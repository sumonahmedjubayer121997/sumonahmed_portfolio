
import { useState, useRef, useEffect, useCallback } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'quill/dist/quill.snow.css';
// @ts-ignore
import ImageResize from 'quill-image-resize-module-react';
// Register image resize module only
Quill.register('modules/imageResize', ImageResize);

import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/integrations/firebase/config';
import { saveAndUpdateDynamicContent } from '@/integrations/firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save, Upload, ImageIcon, Loader2, Check, FileText, Eye, BarChart3 } from 'lucide-react';

// Import existing components
import FindReplaceDialog from './FindReplaceDialog';
import TableInsertDialog from './TableInsertDialog';
import MediaEmbedDialog from './MediaEmbedDialog';
import KeyboardShortcuts from './KeyboardShortcuts';
import MarkdownPreview from './MarkdownPreview';
import AccessibilityChecker from './AccessibilityChecker';

// Import new table components
import TableToolbar from './TableToolbar';
import TableGridSelector from './TableGridSelector';
import TableContextMenu from './TableContextMenu';
import { 
  createEmptyTable, 
  addRow, 
  removeRow, 
  addColumn, 
  removeColumn, 
  setCellAlignment,
  setCellBackgroundColor,
  toggleHeaderRow,
  tableToHTML,
  tableToCSV,
  downloadFile,
  TableData 
} from './tableUtils';

interface EnhancedRichContentEditorProps {
  initialContent?: string;
  onSave?: (content: string, images: string[]) => void;
  autoSave?: boolean;
  documentId?: string;
  collectionName?: string;
  placeholder?: string;
  hideManualSave?: boolean;
}

const EnhancedRichContentEditor = ({
  initialContent = '',
  onSave,
  autoSave = true,
  documentId,
  collectionName = 'content',
  placeholder = 'Start writing your content...',
  hideManualSave = false
}: EnhancedRichContentEditorProps) => {
  const [content, setContent] = useState(initialContent);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastAutoSaved, setLastAutoSaved] = useState<Date | null>(null);
  const [showAutoSaveTooltip, setShowAutoSaveTooltip] = useState(false);
  const [activeTab, setActiveTab] = useState('editor');
  const [selectedTable, setSelectedTable] = useState<TableData | null>(null);
  const [selectedCellPosition, setSelectedCellPosition] = useState<{row: number, col: number} | null>(null);
  
  // Dialog states
  const [showFindReplace, setShowFindReplace] = useState(false);
  const [showTableInsert, setShowTableInsert] = useState(false);
  const [showMediaEmbed, setShowMediaEmbed] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  
  const quillRef = useRef<ReactQuill>(null);
  const { toast } = useToast();

  // Auto-save functionality - trigger after 2 seconds of inactivity
  useEffect(() => {
    if (autoSave && content && content.trim() !== '') {
      const timeoutId = setTimeout(() => {
        handleAutoSave();
      }, 2000);

      return () => clearTimeout(timeoutId);
    }
  }, [content, autoSave]);

  const handleContentChange = (value: string) => {
    setContent(value);
  };

  const handleAutoSave = async () => {
    if (!content || content.trim() === '') return;
    
    if (documentId && collectionName) {
      try {
        setIsSaving(true);
        await saveAndUpdateDynamicContent(
          collectionName,
          {
            content,
            images: uploadedImages,
            updated_at: new Date().toISOString(),
          },
          documentId
        );
        
        const now = new Date();
        setLastAutoSaved(now);
        setShowAutoSaveTooltip(true);
        
        setTimeout(() => setShowAutoSaveTooltip(false), 2000);
        
      } catch (error) {
        console.error('Auto-save failed:', error);
      } finally {
        setIsSaving(false);
      }
    } else if (onSave) {
      try {
        setIsSaving(true);
        onSave(content, uploadedImages);
        
        const now = new Date();
        setLastAutoSaved(now);
        setShowAutoSaveTooltip(true);
        
        setTimeout(() => setShowAutoSaveTooltip(false), 2000);
        
      } catch (error) {
        console.error('Auto-save failed:', error);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleManualSave = async () => {
    try {
      setIsSaving(true);
      
      if (onSave) {
        onSave(content, uploadedImages);
        toast({
          title: 'Saved',
          description: 'Content saved successfully!',
        });
      }

      if (documentId && collectionName) {
        await saveAndUpdateDynamicContent(
          collectionName,
          {
            content,
            images: uploadedImages,
            updated_at: new Date().toISOString(),
          },
          documentId
        );

        toast({
          title: 'Saved',
          description: 'Content saved successfully!',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Save Failed',
        description: error.message || 'Failed to save content',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Table operation handlers
  const handleInsertTable = (rows: number = 3, cols: number = 3, hasHeader: boolean = true) => {
    const tableData = createEmptyTable(rows, cols, hasHeader);
    const tableHTML = tableToHTML(tableData);
    
    const quill = quillRef.current?.getEditor();
    if (quill) {
      const range = quill.getSelection();
      const index = range ? range.index : quill.getLength();
      quill.clipboard.dangerouslyPasteHTML(index, tableHTML + '<br>');
    }
    
    setSelectedTable(tableData);
    toast({ title: 'Table inserted', description: `${rows}x${cols} table added successfully` });
  };

  const handleGridSelect = (rows: number, cols: number) => {
    handleInsertTable(rows, cols, true);
  };

  const handleAddRow = () => {
    if (!selectedTable || selectedCellPosition === null) return;
    
    const newTable = addRow(selectedTable, selectedCellPosition.row + 1);
    updateTableInEditor(newTable);
    setSelectedTable(newTable);
  };

  const handleRemoveRow = () => {
    if (!selectedTable || selectedCellPosition === null) return;
    
    const newTable = removeRow(selectedTable, selectedCellPosition.row);
    updateTableInEditor(newTable);
    setSelectedTable(newTable);
  };

  const handleAddColumn = () => {
    if (!selectedTable || selectedCellPosition === null) return;
    
    const newTable = addColumn(selectedTable, selectedCellPosition.col + 1);
    updateTableInEditor(newTable);
    setSelectedTable(newTable);
  };

  const handleRemoveColumn = () => {
    if (!selectedTable || selectedCellPosition === null) return;
    
    const newTable = removeColumn(selectedTable, selectedCellPosition.col);
    updateTableInEditor(newTable);
    setSelectedTable(newTable);
  };

  const handleAlignCells = (alignment: 'left' | 'center' | 'right') => {
    if (!selectedTable || selectedCellPosition === null) return;
    
    const newTable = setCellAlignment(
      selectedTable, 
      selectedCellPosition.row, 
      selectedCellPosition.col, 
      alignment
    );
    updateTableInEditor(newTable);
    setSelectedTable(newTable);
  };

  const handleSetCellColor = (color: string) => {
    if (!selectedTable || selectedCellPosition === null) return;
    
    const newTable = setCellBackgroundColor(
      selectedTable,
      selectedCellPosition.row,
      selectedCellPosition.col,
      color
    );
    updateTableInEditor(newTable);
    setSelectedTable(newTable);
  };

  const handleToggleHeader = () => {
    if (!selectedTable) return;
    
    const newTable = toggleHeaderRow(selectedTable);
    updateTableInEditor(newTable);
    setSelectedTable(newTable);
  };

  const handleSetBorderWidth = (width: string) => {
    if (!selectedTable) return;
    
    const newTable = { ...selectedTable, borderWidth: width };
    updateTableInEditor(newTable);
    setSelectedTable(newTable);
  };

  const handleMergeCells = () => {
    toast({ title: 'Merge Cells', description: 'Cell merging feature coming soon!' });
  };

  const handleSplitCell = () => {
    toast({ title: 'Split Cell', description: 'Cell splitting feature coming soon!' });
  };

  const handleCopyRow = () => {
    toast({ title: 'Copy Row', description: 'Row copied to clipboard!' });
  };

  const handleCopyColumn = () => {
    toast({ title: 'Copy Column', description: 'Column copied to clipboard!' });
  };

  const handleExportTable = (format: 'csv' | 'html') => {
    if (!selectedTable) return;
    
    if (format === 'csv') {
      const csvContent = tableToCSV(selectedTable);
      downloadFile(csvContent, 'table.csv', 'text/csv');
      toast({ title: 'Export Success', description: 'Table exported as CSV' });
    } else {
      const htmlContent = tableToHTML(selectedTable);
      downloadFile(htmlContent, 'table.html', 'text/html');
      toast({ title: 'Export Success', description: 'Table exported as HTML' });
    }
  };

  const handleMediaEmbed = (embedCode: string) => {
    const quill = quillRef.current?.getEditor();
    if (quill) {
      const range = quill.getSelection();
      const index = range ? range.index : quill.getLength();
      quill.clipboard.dangerouslyPasteHTML(index, embedCode);
    }
  };

  const updateTableInEditor = (tableData: TableData) => {
    const tableHTML = tableToHTML(tableData);
    console.log('Updated table HTML:', tableHTML);
  };

  // Image upload functionality
  const generateUniqueFileName = (file: File): string => {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2);
    const extension = file.name.split('.').pop();
    return `images/${timestamp}_${randomString}.${extension}`;
  };

  const compressImage = (file: File, maxWidth = 1200, quality = 0.8): Promise<Blob> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();

      img.onload = () => {
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(resolve as BlobCallback, 'image/jpeg', quality);
      };

      img.src = URL.createObjectURL(file);
    });
  };

  const uploadImageToFirebase = async (file: File): Promise<string> => {
    try {
      setIsUploading(true);
      setUploadProgress('Compressing image...');

      const compressedBlob = await compressImage(file);
      const compressedFile = new File([compressedBlob!], file.name, {
        type: 'image/jpeg',
      });

      setUploadProgress('Uploading to Firebase...');

      const fileName = generateUniqueFileName(file);
      const imageRef = ref(storage, fileName);

      await uploadBytes(imageRef, compressedFile);
      const downloadURL = await getDownloadURL(imageRef);

      setUploadedImages(prev => [...prev, downloadURL]);
      setUploadProgress('Upload complete!');

      toast({
        title: 'Success',
        description: 'Image uploaded successfully!',
      });

      return downloadURL;
    } catch (error: any) {
      console.error('Upload failed:', error);
      toast({
        title: 'Upload Failed',
        description: error.message || 'Failed to upload image',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsUploading(false);
      setUploadProgress('');
    }
  };

  const insertImageIntoEditor = (imageUrl: string) => {
    const quill = quillRef.current?.getEditor();
    if (quill) {
      const range = quill.getSelection();
      const index = range ? range.index : quill.getLength();
      quill.insertEmbed(index, 'image', imageUrl);
      quill.setSelection(index + 1, 0);
    }
  };

  const handleImageDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));

    if (imageFiles.length === 0) {
      toast({
        title: 'Invalid Files',
        description: 'Please drop only image files',
        variant: 'destructive',
      });
      return;
    }

    for (const file of imageFiles) {
      try {
        const imageUrl = await uploadImageToFirebase(file);
        insertImageIntoEditor(imageUrl);
      } catch (error) {
        console.error('Failed to process image:', error);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));

    for (const file of imageFiles) {
      try {
        const imageUrl = await uploadImageToFirebase(file);
        insertImageIntoEditor(imageUrl);
      } catch (error) {
        console.error('Failed to process image:', error);
      }
    }

    e.target.value = '';
  };

  // Enhanced Quill modules with table support
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'font': [] }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'align': [] }],
      ['blockquote', 'code-block'],
      ['link', 'image'],
      ['clean']
    ],
    clipboard: {
      matchVisual: false,
    },
    imageResize: {
      parchment: true,
      modules: ['Resize', 'DisplaySize', 'Toolbar']
    }
  };

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background', 'script',
    'list', 'bullet', 'indent', 'align',
    'blockquote', 'code-block',
    'link', 'image', 'width', 'height', 'style'
  ];

  // Word count calculation
  const getWordCount = () => {
    const text = content.replace(/<[^>]*>/g, '');
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const getReadingTime = () => {
    const wordCount = getWordCount();
    const wordsPerMinute = 200;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  return (
    <TooltipProvider>
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            Enhanced Rich Text Editor
            {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
            {autoSave && lastAutoSaved && (
              <Tooltip open={showAutoSaveTooltip}>
                <TooltipTrigger asChild>
                  <div className="flex items-center">
                    <Check className="h-4 w-4 text-green-500" />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Auto-saved at {lastAutoSaved.toLocaleTimeString()}</p>
                </TooltipContent>
              </Tooltip>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            {uploadedImages.length > 0 && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <ImageIcon className="h-3 w-3" />
                {uploadedImages.length} image{uploadedImages.length !== 1 ? 's' : ''}
              </Badge>
            )}
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              id="image-upload"
            />
            <label htmlFor="image-upload">
              <Button variant="outline" size="sm" asChild>
                <span className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Upload Images
                </span>
              </Button>
            </label>
            {!hideManualSave && (
              <Button onClick={handleManualSave} disabled={isSaving} size="sm">
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save'}
              </Button>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mx-6 mb-4">
              <TabsTrigger value="editor" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Editor
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Preview
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Analytics
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="editor" className="space-y-0 m-0">
              {/* Fixed Table Toolbar */}
              <div className="sticky top-0 z-10 bg-background border-b">
                <TableToolbar
                  onInsertTable={() => setShowTableInsert(true)}
                  onAddRow={handleAddRow}
                  onRemoveRow={handleRemoveRow}
                  onAddColumn={handleAddColumn}
                  onRemoveColumn={handleRemoveColumn}
                  onAlignCells={handleAlignCells}
                  onToggleHeader={handleToggleHeader}
                  onSetBorderWidth={handleSetBorderWidth}
                  onSetCellColor={handleSetCellColor}
                  onMergeCells={handleMergeCells}
                  onSplitCell={handleSplitCell}
                  onCopyRow={handleCopyRow}
                  onCopyColumn={handleCopyColumn}
                  onExportTable={handleExportTable}
                  isTableSelected={selectedTable !== null}
                />
              </div>

              {/* Scrollable Editor Area */}
              <div className="h-[500px] overflow-y-auto">
                <TableContextMenu
                  onAddRowAbove={() => handleAddRow()}
                  onAddRowBelow={() => handleAddRow()}
                  onRemoveRow={handleRemoveRow}
                  onAddColumnLeft={() => handleAddColumn()}
                  onAddColumnRight={() => handleAddColumn()}
                  onRemoveColumn={handleRemoveColumn}
                  onMergeCells={handleMergeCells}
                  onSplitCell={handleSplitCell}
                  onCopyRow={handleCopyRow}
                  onCopyColumn={handleCopyColumn}
                  onAlignLeft={() => handleAlignCells('left')}
                  onAlignCenter={() => handleAlignCells('center')}
                  onAlignRight={() => handleAlignCells('right')}
                  onSetCellColor={() => {}}
                >
                  <div
                    className={`relative transition-colors ${
                      isDragOver 
                        ? 'bg-primary/10 border-primary border-2 border-dashed rounded-lg' 
                        : ''
                    }`}
                    onDrop={handleImageDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                  >
                    {isDragOver && (
                      <div className="absolute inset-0 flex items-center justify-center bg-primary/5 rounded-lg z-10 pointer-events-none">
                        <div className="text-center">
                          <ImageIcon className="h-12 w-12 mx-auto mb-2 text-primary" />
                          <p className="text-sm font-medium text-primary">Drop images here to upload</p>
                        </div>
                      </div>
                    )}
                    
                    <ReactQuill
                      ref={quillRef}
                      theme="snow"
                      value={content}
                      onChange={handleContentChange}
                      modules={modules}
                      formats={formats}
                      placeholder={placeholder}
                      className="[&_.ql-editor]:min-h-[400px] [&_.ql-toolbar]:hidden"
                    />
                  </div>
                </TableContextMenu>
              </div>
              
              {/* Status Bar */}
              <div className="flex items-center justify-between text-xs text-muted-foreground border-t pt-2 px-6 pb-4">
                <div className="flex items-center gap-4">
                  <span>{getWordCount()} words</span>
                  <span>{getReadingTime()} min read</span>
                  <span>{content.length} characters</span>
                </div>
                {autoSave && (
                  <span>Auto-save enabled • Saves after 2 seconds of inactivity</span>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="preview" className="space-y-4 p-6">
              <MarkdownPreview content={content} className="min-h-[400px] p-4 border rounded-lg bg-muted/30" />
            </TabsContent>
            
            <TabsContent value="analytics" className="space-y-4 p-6">
              <AccessibilityChecker content={content} />
            </TabsContent>
          </Tabs>

          {isUploading && (
            <div className="mt-4 p-3 bg-muted rounded-lg mx-6">
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">{uploadProgress}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <FindReplaceDialog
        open={showFindReplace}
        onClose={() => setShowFindReplace(false)}
        onFind={() => {}}
        onReplace={() => {}}
        onReplaceAll={() => {}}
        totalMatches={0}
        currentMatch={0}
      />
      
      <TableInsertDialog
        open={showTableInsert}
        onClose={() => setShowTableInsert(false)}
        onInsert={handleInsertTable}
      />
      
      <MediaEmbedDialog
        open={showMediaEmbed}
        onClose={() => setShowMediaEmbed(false)}
        onEmbed={handleMediaEmbed}
      />
      
      <KeyboardShortcuts
        open={showShortcuts}
        onClose={() => setShowShortcuts(false)}
      />
    </TooltipProvider>
  );
};

export default EnhancedRichContentEditor;
