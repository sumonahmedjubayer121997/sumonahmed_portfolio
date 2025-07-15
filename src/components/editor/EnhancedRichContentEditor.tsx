import { useState, useRef, useEffect, useCallback } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'quill/dist/quill.snow.css';
// @ts-ignore
import ImageResize from 'quill-image-resize-module-react';
// Register table support
import QuillBetterTable from 'quill-better-table';

// Register modules
Quill.register('modules/imageResize', ImageResize);
Quill.register('modules/better-table', QuillBetterTable);

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

// Import new components
import EditorToolbar from './EditorToolbar';
import FindReplaceDialog from './FindReplaceDialog';
import TableInsertDialog from './TableInsertDialog';
import MediaEmbedDialog from './MediaEmbedDialog';
import KeyboardShortcuts from './KeyboardShortcuts';
import MarkdownPreview from './MarkdownPreview';
import AccessibilityChecker from './AccessibilityChecker';

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
  autoSave = false,
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
  
  // Dialog states
  const [showFindReplace, setShowFindReplace] = useState(false);
  const [showTableInsert, setShowTableInsert] = useState(false);
  const [showMediaEmbed, setShowMediaEmbed] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  
  // History for undo/redo
  const [history, setHistory] = useState<string[]>([initialContent]);
  const [historyIndex, setHistoryIndex] = useState(0);
  
  const quillRef = useRef<ReactQuill>(null);
  const { toast } = useToast();

  // Auto-save functionality
  useEffect(() => {
    if (autoSave && content && documentId && collectionName) {
      const timeoutId = setTimeout(() => {
        handleAutoSave();
      }, 30000); // Auto-save every 30 seconds

      return () => clearTimeout(timeoutId);
    }
  }, [content, autoSave, documentId, collectionName]);

  // Add content to history
  const addToHistory = useCallback((newContent: string) => {
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(newContent);
      // Keep only last 50 changes
      if (newHistory.length > 50) {
        newHistory.shift();
      }
      return newHistory;
    });
    setHistoryIndex(prev => Math.min(prev + 1, 49));
  }, [historyIndex]);

  const handleContentChange = (value: string) => {
    setContent(value);
    // Add to history with debounce
    const timeoutId = setTimeout(() => {
      addToHistory(value);
    }, 1000);
    return () => clearTimeout(timeoutId);
  };

  const handleAutoSave = async () => {
    if (!documentId || !collectionName) return;

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
  };

  // Undo/Redo functionality
  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setContent(history[newIndex]);
      const quill = quillRef.current?.getEditor();
      if (quill) {
        quill.setText(history[newIndex]);
      }
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setContent(history[newIndex]);
      const quill = quillRef.current?.getEditor();
      if (quill) {
        quill.setText(history[newIndex]);
      }
    }
  };

  // Table insertion
  const handleInsertTable = (rows: number, cols: number, hasHeader: boolean) => {
    const quill = quillRef.current?.getEditor();
    if (quill) {
      const tableModule = quill.getModule('better-table');
      if (tableModule) {
        tableModule.insertTable(rows, cols);
      }
    }
  };

  // Media embedding
  const handleMediaEmbed = (embedCode: string) => {
    const quill = quillRef.current?.getEditor();
    if (quill) {
      const range = quill.getSelection();
      const index = range ? range.index : quill.getLength();
      quill.clipboard.dangerouslyPasteHTML(index, embedCode);
    }
  };

  // Image upload functionality (existing)
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

  const handleSave = async () => {
    if (onSave) {
      onSave(content, uploadedImages);
      toast({
        title: 'Saved',
        description: 'Content updated successfully!',
      });
    }

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

        toast({
          title: 'Saved',
          description: 'Content saved successfully!',
        });
      } catch (error: any) {
        toast({
          title: 'Save Failed',
          description: error.message || 'Failed to save content',
          variant: 'destructive',
        });
      } finally {
        setIsSaving(false);
      }
    }
  };

  // Enhanced Quill modules with new features
  const modules = {
    toolbar: false, // We'll use custom toolbar
    clipboard: {
      matchVisual: false,
    },
    imageResize: {
      parchment: true,
      modules: ['Resize', 'DisplaySize', 'Toolbar']
    },
    'better-table': {
      operationMenu: {
        items: {
          unmergeCells: {
            text: 'Another unmerge cells name'
          }
        }
      }
    },
    keyboard: {
      bindings: {
        // Add custom keyboard shortcuts
        bold: {
          key: 'B',
          ctrlKey: true,
          handler: function(range: any, context: any) {
            this.quill.format('bold', !context.format.bold);
          }
        },
        italic: {
          key: 'I',
          ctrlKey: true,
          handler: function(range: any, context: any) {
            this.quill.format('italic', !context.format.italic);
          }
        },
        underline: {
          key: 'U',
          ctrlKey: true,
          handler: function(range: any, context: any) {
            this.quill.format('underline', !context.format.underline);
          }
        }
      }
    }
  };

  const formats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'blockquote', 'code-block',
    'link', 'image', 'align', 'color', 'background', 
    'size', 'font', 'width', 'height', 'style',
    'table', 'table-cell-line', 'table-cell-line-height',
    'table-cell-background-color', 'table-cell-border-color',
    'table-cell-border-width', 'table-cell-border-style'
  ];

  // Word count calculation
  const getWordCount = () => {
    const text = content.replace(/<[^>]*>/g, ''); // Remove HTML tags
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const getReadingTime = () => {
    const wordCount = getWordCount();
    const wordsPerMinute = 200; // Average reading speed
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
              <Button onClick={handleSave} disabled={isSaving} size="sm">
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save'}
              </Button>
            )}
          </div>
        </CardHeader>
        
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
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
            
            <TabsContent value="editor" className="space-y-4">
              {/* Custom Toolbar */}
              <EditorToolbar
                onUndo={handleUndo}
                onRedo={handleRedo}
                onFindReplace={() => setShowFindReplace(true)}
                onInsertTable={() => setShowTableInsert(true)}
                onInsertMedia={() => setShowMediaEmbed(true)}
                onToggleShortcuts={() => setShowShortcuts(true)}
                canUndo={historyIndex > 0}
                canRedo={historyIndex < history.length - 1}
              />
              
              {/* Editor Area */}
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
                  className="min-h-[400px] [&_.ql-editor]:min-h-[350px]"
                />
              </div>
              
              {/* Status Bar */}
              <div className="flex items-center justify-between text-xs text-muted-foreground border-t pt-2">
                <div className="flex items-center gap-4">
                  <span>{getWordCount()} words</span>
                  <span>{getReadingTime()} min read</span>
                  <span>{content.length} characters</span>
                </div>
                {autoSave && (
                  <span>Auto-save enabled</span>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="preview" className="space-y-4">
              <MarkdownPreview content={content} className="min-h-[400px] p-4 border rounded-lg bg-muted/30" />
            </TabsContent>
            
            <TabsContent value="analytics" className="space-y-4">
              <AccessibilityChecker content={content} />
            </TabsContent>
          </Tabs>

          {isUploading && (
            <div className="mt-4 p-3 bg-muted rounded-lg">
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
        onFind={() => {}} // TODO: Implement find functionality
        onReplace={() => {}} // TODO: Implement replace functionality
        onReplaceAll={() => {}} // TODO: Implement replace all functionality
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
