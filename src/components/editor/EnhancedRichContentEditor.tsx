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
import TableGridSelector from './TableGridSelector';
import TableToolbar from './TableToolbar';
import TableContextMenu from './TableContextMenu';
import {
  createTable,
  tableToHTML,
  parseHTMLTable,
  exportTableToCSV,
  addTableRow,
  addTableColumn,
  removeTableRow,
  removeTableColumn,
  TableData,
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
  
  // Table-related state
  const [selectedTable, setSelectedTable] = useState<TableData | null>(null);
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [showTableToolbar, setShowTableToolbar] = useState(false);
  
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

  // Manual save functionality
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

  // Table functionality
  const handleInsertTable = (rows: number, cols: number) => {
    const quill = quillRef.current?.getEditor();
    if (quill) {
      const table = createTable(rows, cols, true);
      const tableHTML = tableToHTML(table);
      
      const range = quill.getSelection();
      const index = range ? range.index : quill.getLength();
      quill.clipboard.dangerouslyPasteHTML(index, tableHTML);
      
      toast({
        title: 'Table Inserted',
        description: `${rows}×${cols} table added successfully`,
      });
    }
  };

  const handleGridSelect = (rows: number, cols: number) => {
    handleInsertTable(rows, cols);
  };

  const detectTableSelection = useCallback(() => {
    const quill = quillRef.current?.getEditor();
    if (!quill) return;

    const selection = quill.getSelection();
    if (!selection) return;

    const [leaf] = quill.getLeaf(selection.index);
    const tableElement = leaf?.domNode?.closest?.('table');
    
    if (tableElement) {
      const tableData = parseHTMLTable(tableElement.outerHTML);
      setSelectedTable(tableData);
      setShowTableToolbar(true);
    } else {
      setSelectedTable(null);
      setShowTableToolbar(false);
    }
  }, []);

  // Table operations
  const handleAddRow = () => {
    if (!selectedTable) return;
    const updatedTable = addTableRow(selectedTable, selectedCell?.row || 0);
    updateTableInEditor(updatedTable);
  };

  const handleRemoveRow = () => {
    if (!selectedTable) return;
    const updatedTable = removeTableRow(selectedTable, selectedCell?.row || 0);
    updateTableInEditor(updatedTable);
  };

  const handleAddColumn = () => {
    if (!selectedTable) return;
    const updatedTable = addTableColumn(selectedTable, selectedCell?.col || 0);
    updateTableInEditor(updatedTable);
  };

  const handleRemoveColumn = () => {
    if (!selectedTable) return;
    const updatedTable = removeTableColumn(selectedTable, selectedCell?.col || 0);
    updateTableInEditor(updatedTable);
  };

  const updateTableInEditor = (updatedTable: TableData) => {
    const quill = quillRef.current?.getEditor();
    if (!quill || !selectedTable) return;

    const tableHTML = tableToHTML(updatedTable);
    const currentContent = quill.root.innerHTML;
    const oldTableHTML = tableToHTML(selectedTable);
    
    const updatedContent = currentContent.replace(oldTableHTML, tableHTML);
    quill.root.innerHTML = updatedContent;
    setContent(updatedContent);
    setSelectedTable(updatedTable);
  };

  const handleCellAlignment = (alignment: 'left' | 'center' | 'right') => {
    if (!selectedTable || !selectedCell) return;
    
    const updatedTable = { ...selectedTable };
    updatedTable.rows[selectedCell.row].cells[selectedCell.col].textAlign = alignment;
    updateTableInEditor(updatedTable);
  };

  const handleCellColor = (color: string) => {
    if (!selectedTable || !selectedCell) return;
    
    const updatedTable = { ...selectedTable };
    updatedTable.rows[selectedCell.row].cells[selectedCell.col].backgroundColor = color;
    updateTableInEditor(updatedTable);
  };

  const handleExportCSV = () => {
    if (!selectedTable) return;
    
    const csvContent = exportTableToCSV(selectedTable);
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'table.csv';
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: 'Export Complete',
      description: 'Table exported as CSV successfully',
    });
  };

  const handleExportHTML = () => {
    if (!selectedTable) return;
    
    const htmlContent = tableToHTML(selectedTable);
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'table.html';
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: 'Export Complete',
      description: 'Table exported as HTML successfully',
    });
  };

  // Existing image upload functionality
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
    toolbar: {
      container: [
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
      handlers: {
        // Custom handlers can be added here
      }
    },
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
      <Card className="w-full h-full flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between flex-shrink-0">
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
            
            {/* Table Grid Selector */}
            <TableGridSelector onSelectGrid={handleGridSelect} />
            
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
        
        <CardContent className="flex-1 flex flex-col min-h-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-3 flex-shrink-0">
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
            
            <TabsContent value="editor" className="flex-1 flex flex-col space-y-0">
              <div className="flex-1 flex flex-col min-h-0">
                {/* Table Toolbar - Shows when table is selected */}
                {showTableToolbar && selectedTable && (
                  <div className="flex-shrink-0 sticky top-0 z-10 bg-background border-b">
                    <TableToolbar
                      onAddRow={handleAddRow}
                      onRemoveRow={handleRemoveRow}
                      onAddColumn={handleAddColumn}
                      onRemoveColumn={handleRemoveColumn}
                      onAlignLeft={() => handleCellAlignment('left')}
                      onAlignCenter={() => handleCellAlignment('center')}
                      onAlignRight={() => handleCellAlignment('right')}
                      onMergeCells={() => {}} // TODO: Implement merge
                      onSplitCells={() => {}} // TODO: Implement split
                      onColorChange={handleCellColor}
                      onBorderChange={() => {}} // TODO: Implement border change
                      onExportCSV={handleExportCSV}
                      onExportHTML={handleExportHTML}
                      selectedCellColor={selectedTable.rows[selectedCell?.row || 0]?.cells[selectedCell?.col || 0]?.backgroundColor}
                    />
                  </div>
                )}
                
                {/* Editor Area */}
                <div className="flex-1 min-h-0 relative">
                  <div
                    className={`h-full transition-colors ${
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
                    
                    <TableContextMenu
                      onInsertRowAbove={handleAddRow}
                      onInsertRowBelow={handleAddRow}
                      onInsertColumnLeft={handleAddColumn}
                      onInsertColumnRight={handleAddColumn}
                      onDeleteRow={handleRemoveRow}
                      onDeleteColumn={handleRemoveColumn}
                      onDeleteTable={() => {}} // TODO: Implement table deletion
                      onAlignLeft={() => handleCellAlignment('left')}
                      onAlignCenter={() => handleCellAlignment('center')}
                      onAlignRight={() => handleCellAlignment('right')}
                      onMergeCells={() => {}} // TODO: Implement merge
                      onSplitCells={() => {}} // TODO: Implement split
                    >
                      <div className="h-full">
                        <ReactQuill
                          ref={quillRef}
                          theme="snow"
                          value={content}
                          onChange={handleContentChange}
                          onSelectionChange={detectTableSelection}
                          modules={modules}
                          formats={formats}
                          placeholder={placeholder}
                          className="h-full [&_.ql-container]:h-full [&_.ql-editor]:h-full [&_.ql-editor]:overflow-auto [&_.ql-toolbar]:sticky [&_.ql-toolbar]:top-0 [&_.ql-toolbar]:z-10 [&_.ql-toolbar]:bg-background [&_.ql-toolbar]:border-b"
                          style={{ height: '100%' }}
                        />
                      </div>
                    </TableContextMenu>
                  </div>
                </div>
              </div>
              
              {/* Status Bar */}
              <div className="flex-shrink-0 flex items-center justify-between text-xs text-muted-foreground border-t pt-2">
                <div className="flex items-center gap-4">
                  <span>{getWordCount()} words</span>
                  <span>{getReadingTime()} min read</span>
                  <span>{content.length} characters</span>
                  {selectedTable && <span>Table selected</span>}
                </div>
                {autoSave && (
                  <span>Auto-save enabled • Saves after 2 seconds of inactivity</span>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="preview" className="flex-1 overflow-auto">
              <MarkdownPreview content={content} className="h-full p-4 border rounded-lg bg-muted/30" />
            </TabsContent>
            
            <TabsContent value="analytics" className="flex-1 overflow-auto">
              <AccessibilityChecker content={content} />
            </TabsContent>
          </Tabs>

          {isUploading && (
            <div className="flex-shrink-0 mt-4 p-3 bg-muted rounded-lg">
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
        onEmbed={(embedCode: string) => {
          const quill = quillRef.current?.getEditor();
          if (quill) {
            const range = quill.getSelection();
            const index = range ? range.index : quill.getLength();
            quill.clipboard.dangerouslyPasteHTML(index, embedCode);
          }
        }}
      />
      
      <KeyboardShortcuts
        open={showShortcuts}
        onClose={() => setShowShortcuts(false)}
      />
    </TooltipProvider>
  );
};

export default EnhancedRichContentEditor;
