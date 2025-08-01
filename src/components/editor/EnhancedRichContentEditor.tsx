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

// Import new components
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
  content?: string;
  onChange?: (content: string) => void;
}

const EnhancedRichContentEditor = ({
  initialContent = '',
  onSave,
  autoSave = true,
  documentId,
  collectionName = 'content',
  placeholder = 'Start writing your content...',
  hideManualSave = false,
  content,
  onChange
}: EnhancedRichContentEditorProps) => {
  const [editorContent, setEditorContent] = useState(content || initialContent);
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
  
  const quillRef = useRef<ReactQuill>(null);
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Update internal state when controlled content prop changes
  useEffect(() => {
    if (content !== undefined && content !== editorContent) {
      setEditorContent(content);
    }
  }, [content]);

  // Auto-save functionality - trigger after 2 seconds of inactivity
  useEffect(() => {
    if (autoSave && editorContent && editorContent.trim() !== '') {
      const timeoutId = setTimeout(() => {
        handleAutoSave();
      }, 2000); // Auto-save after 2 seconds of inactivity

      return () => clearTimeout(timeoutId);
    }
  }, [editorContent, autoSave]);

  const handleContentChange = useCallback((value: string) => {
    // Store current scroll position before content change
    const editor = quillRef.current?.getEditor();
    const scrollTop = editor?.root?.scrollTop || 0;
    
    setEditorContent(value);
    
    // Call controlled component onChange if provided
    if (onChange) {
      onChange(value);
    }
    
    // Restore scroll position after content change
    setTimeout(() => {
      if (editor?.root) {
        editor.root.scrollTop = scrollTop;
      }
    }, 0);
  }, [onChange]);

  const handleAutoSave = async () => {
    if (!editorContent || editorContent.trim() === '') return;
    
    if (documentId && collectionName) {
      try {
        setIsSaving(true);
        await saveAndUpdateDynamicContent(
          collectionName,
          {
            content: editorContent,
            images: uploadedImages,
            updated_at: new Date().toISOString(),
          },
          documentId
        );
        
        const now = new Date();
        setLastAutoSaved(now);
        setShowAutoSaveTooltip(true);
        
        // Hide tooltip after 2 seconds
        setTimeout(() => setShowAutoSaveTooltip(false), 2000);
        
      } catch (error) {
        console.error('Auto-save failed:', error);
      } finally {
        setIsSaving(false);
      }
    } else if (onSave) {
      // If no documentId but onSave callback exists, use that for auto-save
      try {
        setIsSaving(true);
        onSave(editorContent, uploadedImages);
        
        const now = new Date();
        setLastAutoSaved(now);
        setShowAutoSaveTooltip(true);
        
        // Hide tooltip after 2 seconds
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
        onSave(editorContent, uploadedImages);
        toast({
          title: 'Saved',
          description: 'Content saved successfully!',
        });
      }

      if (documentId && collectionName) {
        await saveAndUpdateDynamicContent(
          collectionName,
          {
            content: editorContent,
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

  const handleInsertTable = (rows: number, cols: number, hasHeader: boolean) => {
    const quill = quillRef.current?.getEditor();
    if (quill) {
      // Create simple HTML table
      let tableHTML = '<table border="1" style="border-collapse: collapse; width: 100%;">';
      
      for (let i = 0; i < rows; i++) {
        tableHTML += '<tr>';
        for (let j = 0; j < cols; j++) {
          if (i === 0 && hasHeader) {
            tableHTML += '<th style="border: 1px solid #ccc; padding: 8px;">Header</th>';
          } else {
            tableHTML += '<td style="border: 1px solid #ccc; padding: 8px;">Cell</td>';
          }
        }
        tableHTML += '</tr>';
      }
      tableHTML += '</table><br>';
      
      const range = quill.getSelection();
      const index = range ? range.index : quill.getLength();
      quill.clipboard.dangerouslyPasteHTML(index, tableHTML);
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

  const getWordCount = () => {
    const text = editorContent.replace(/<[^>]*>/g, ''); // Remove HTML tags
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const getReadingTime = () => {
    const wordCount = getWordCount();
    const wordsPerMinute = 200; // Average reading speed
    return Math.ceil(wordCount / wordsPerMinute);
  };

  return (
    <TooltipProvider>
      <Card className="w-full flex flex-col h-[600px]">
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
        
        <CardContent className="flex-1 flex flex-col overflow-hidden p-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex flex-col h-full">
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
            
            <TabsContent value="editor" className="flex-1 flex flex-col space-y-4 overflow-hidden mt-4">
              <div
                ref={editorContainerRef}
                className={`relative flex-1 transition-colors overflow-hidden ${
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
                
                <div className="h-full flex flex-col">
                  <ReactQuill
                    ref={quillRef}
                    theme="snow"
                    value={editorContent}
                    onChange={handleContentChange}
                    modules={modules}
                    formats={formats}
                    placeholder={placeholder}
                    style={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column'
                    }}
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between text-xs text-muted-foreground border-t pt-2 flex-shrink-0">
                <div className="flex items-center gap-4">
                  <span>{getWordCount()} words</span>
                  <span>{getReadingTime()} min read</span>
                  <span>{editorContent.length} characters</span>
                </div>
                {autoSave && (
                  <span>Auto-save enabled • Saves after 2 seconds of inactivity</span>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="preview" className="flex-1 overflow-hidden mt-4">
              <div className="h-full overflow-y-auto">
                <MarkdownPreview content={editorContent} className="min-h-full p-4 border rounded-lg bg-muted/30" />
              </div>
            </TabsContent>
            
            <TabsContent value="analytics" className="flex-1 overflow-hidden mt-4">
              <div className="h-full overflow-y-auto">
                <AccessibilityChecker content={editorContent} />
              </div>
            </TabsContent>
          </Tabs>

          {isUploading && (
            <div className="mt-4 p-3 bg-muted rounded-lg flex-shrink-0">
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">{uploadProgress}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <style>{`
        .ql-toolbar {
          position: sticky !important;
          top: 0 !important;
          z-index: 10 !important;
          background: white !important;
          border-bottom: 1px solid #ccc !important;
        }
        
        .ql-container {
          flex: 1 !important;
          overflow-y: auto !important;
          height: auto !important;
        }
        
        .ql-editor {
          height: auto !important;
          min-height: 300px !important;
          overflow-y: visible !important;
        }
      `}</style>

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
