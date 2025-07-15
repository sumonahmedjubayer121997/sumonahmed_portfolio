import { useState, useRef, useEffect, useCallback } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'quill/dist/quill.snow.css';
// @ts-ignore
import ImageResize from 'quill-image-resize-module-react';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';

// Register modules
Quill.register('modules/imageResize', ImageResize);

// Configure syntax highlighting
hljs.configure({ 
  languages: ['javascript', 'python', 'java', 'css', 'html', 'sql', 'bash']
});

import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/integrations/firebase/config';
import { saveAndUpdateDynamicContent } from '@/integrations/firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save, Upload, ImageIcon, Loader2, Check, Film, Highlighter } from 'lucide-react';

// Import our custom components
import { EditorToolbar } from './editor/EditorToolbar';
import { MarkdownPreview } from './editor/MarkdownPreview';
import { AccessibilityChecker } from './editor/AccessibilityChecker';
import { MediaEmbedModal } from './editor/MediaEmbedModal';

interface RichContentEditorProps {
  initialContent?: string;
  onSave?: (content: string, images: string[]) => void;
  autoSave?: boolean;
  documentId?: string;
  collectionName?: string;
  placeholder?: string;
  hideManualSave?: boolean;
}

const RichContentEditor = ({
  initialContent = '',
  onSave,
  autoSave = false,
  documentId,
  collectionName = 'content',
  placeholder = 'Start writing your content...',
  hideManualSave = false
}: RichContentEditorProps) => {
  const [content, setContent] = useState(initialContent);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastAutoSaved, setLastAutoSaved] = useState<Date | null>(null);
  const [showAutoSaveTooltip, setShowAutoSaveTooltip] = useState(false);
  const [isMarkdownMode, setIsMarkdownMode] = useState(false);
  const [undoStack, setUndoStack] = useState<string[]>([]);
  const [redoStack, setRedoStack] = useState<string[]>([]);
  const [wordCount, setWordCount] = useState(0);
  const [readTime, setReadTime] = useState(0);
  const quillRef = useRef<ReactQuill>(null);
  const { toast } = useToast();

  // Auto-save functionality
  useEffect(() => {
    if (autoSave && content && documentId && collectionName) {
      const timeoutId = setTimeout(() => {
        handleAutoSave();
      }, 3000); // Auto-save after 3 seconds of inactivity

      return () => clearTimeout(timeoutId);
    }
  }, [content, autoSave, documentId, collectionName]);

  // Calculate word count and read time
  useEffect(() => {
    const plainText = content.replace(/<[^>]*>/g, '').trim();
    const words = plainText ? plainText.split(/\s+/).length : 0;
    const estimatedReadTime = Math.max(1, Math.ceil(words / 200)); // Average reading speed: 200 words/min
    
    setWordCount(words);
    setReadTime(estimatedReadTime);
  }, [content]);

  // Track content changes for undo/redo
  useEffect(() => {
    if (content && content !== undoStack[undoStack.length - 1]) {
      setUndoStack(prev => [...prev.slice(-19), content]); // Keep last 20 states
      setRedoStack([]); // Clear redo stack when new content is added
    }
  }, [content]);

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
      
      // Show auto-save success
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
  };

  // Undo/Redo functionality
  const handleUndo = () => {
    if (undoStack.length > 1) {
      const currentContent = undoStack[undoStack.length - 1];
      const previousContent = undoStack[undoStack.length - 2];
      
      setRedoStack(prev => [...prev, currentContent]);
      setUndoStack(prev => prev.slice(0, -1));
      setContent(previousContent);
    }
  };

  const handleRedo = () => {
    if (redoStack.length > 0) {
      const nextContent = redoStack[redoStack.length - 1];
      
      setUndoStack(prev => [...prev, nextContent]);
      setRedoStack(prev => prev.slice(0, -1));
      setContent(nextContent);
    }
  };

  // Table insertion
  const handleInsertTable = (rows: number, cols: number) => {
    const quill = quillRef.current?.getEditor();
    if (quill) {
      const range = quill.getSelection();
      if (range) {
        let tableHtml = '<table border="1" style="border-collapse: collapse; width: 100%;">';
        
        // Header row
        tableHtml += '<thead><tr>';
        for (let c = 0; c < cols; c++) {
          tableHtml += '<th style="border: 1px solid #ccc; padding: 8px;">Header ' + (c + 1) + '</th>';
        }
        tableHtml += '</tr></thead>';
        
        // Body rows
        tableHtml += '<tbody>';
        for (let r = 1; r < rows; r++) {
          tableHtml += '<tr>';
          for (let c = 0; c < cols; c++) {
            tableHtml += '<td style="border: 1px solid #ccc; padding: 8px;">Cell ' + r + '-' + (c + 1) + '</td>';
          }
          tableHtml += '</tr>';
        }
        tableHtml += '</tbody></table><br>';
        
        quill.clipboard.dangerouslyPasteHTML(range.index, tableHtml);
      }
    }
  };

  // Find and replace
  const handleFindReplace = (find: string, replace: string) => {
    if (!find) return;
    
    const newContent = content.replace(new RegExp(find, 'gi'), replace);
    setContent(newContent);
    
    toast({
      title: 'Find & Replace',
      description: `Replaced all instances of "${find}" with "${replace}"`,
    });
  };

  // Media embed
  const handleMediaEmbed = (type: string, embedContent: string) => {
    const quill = quillRef.current?.getEditor();
    if (quill) {
      const range = quill.getSelection();
      if (range) {
        quill.clipboard.dangerouslyPasteHTML(range.index, embedContent + '<br>');
      }
    }
  };

  // Highlight text
  const handleHighlight = () => {
    const quill = quillRef.current?.getEditor();
    if (quill) {
      const range = quill.getSelection();
      if (range && range.length > 0) {
        const currentFormat = quill.getFormat(range);
        const isHighlighted = currentFormat.background === '#ffff00';
        quill.format('background', isHighlighted ? false : '#ffff00');
      }
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

      // Compress image before upload
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
      quill.setSelection(index + 1);
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

    // Reset input
    e.target.value = '';
  };

  const handleSave = async () => {
    if (onSave) {
      onSave(content, uploadedImages);
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

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'z':
            e.preventDefault();
            if (e.shiftKey) {
              handleRedo();
            } else {
              handleUndo();
            }
            break;
          case 'y':
            e.preventDefault();
            handleRedo();
            break;
          case 's':
            e.preventDefault();
            handleSave();
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [undoStack, redoStack]);

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'font': [] }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'script': 'sub' }, { 'script': 'super' }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
      [{ 'direction': 'rtl' }, { 'align': [] }],
      ['blockquote', 'code-block'],
      ['link', 'image', 'video'],
      ['clean']
    ],
    syntax: {
      highlight: (text: string) => hljs.highlightAuto(text).value
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
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video',
    'align', 'color', 'background',
    'script', 'code-block', 'direction',
    'width', 'height', 'style'
  ];

  return (
    <TooltipProvider>
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            Advanced Rich Content Editor
            {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
            {autoSave && lastAutoSaved && (
              <Tooltip open={showAutoSaveTooltip}>
                <TooltipTrigger asChild>
                  <div className="flex items-center">
                    <Check className="h-4 w-4 text-green-500" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
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
            
            <AccessibilityChecker content={content} />
            
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
                  Images
                </span>
              </Button>
            </label>

            <MediaEmbedModal onEmbed={handleMediaEmbed}>
              <Button variant="outline" size="sm">
                <Film className="h-4 w-4 mr-2" />
                Embed
              </Button>
            </MediaEmbedModal>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={handleHighlight}>
                  <Highlighter className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Highlight Selected Text</TooltipContent>
            </Tooltip>

            {!hideManualSave && (
              <Button onClick={handleSave} disabled={isSaving} size="sm">
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save'}
              </Button>
            )}
          </div>
        </CardHeader>

        <EditorToolbar
          quillRef={quillRef}
          onUndo={handleUndo}
          onRedo={handleRedo}
          onInsertTable={handleInsertTable}
          onToggleMarkdown={() => setIsMarkdownMode(!isMarkdownMode)}
          onFindReplace={handleFindReplace}
          wordCount={wordCount}
          readTime={readTime}
          isMarkdownMode={isMarkdownMode}
        />

        <CardContent className="p-0">
          <Tabs value={isMarkdownMode ? "preview" : "editor"} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="editor" onClick={() => setIsMarkdownMode(false)}>
                Editor
              </TabsTrigger>
              <TabsTrigger value="preview" onClick={() => setIsMarkdownMode(true)}>
                Preview
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="editor" className="mt-0">
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
                  onChange={setContent}
                  modules={modules}
                  formats={formats}
                  placeholder={placeholder}
                  className="min-h-[400px] border-0"
                />
              </div>
            </TabsContent>
            
            <TabsContent value="preview" className="mt-0">
              <div className="border rounded-md p-6 min-h-[400px] bg-background">
                <MarkdownPreview content={content} />
              </div>
            </TabsContent>
          </Tabs>

          {isUploading && (
            <div className="m-4 p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">{uploadProgress}</span>
              </div>
            </div>
          )}

          {autoSave && (
            <div className="m-4 text-xs text-muted-foreground">
              Auto-save enabled • Content saves automatically every 3 seconds
            </div>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default RichContentEditor;