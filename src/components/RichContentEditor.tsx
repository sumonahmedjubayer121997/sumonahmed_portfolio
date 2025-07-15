import { useState, useRef, useEffect } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'quill/dist/quill.snow.css';
// @ts-ignore
import ImageResize from 'quill-image-resize-module-react';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Save, Upload, ImageIcon, Loader2, Check, Film, Highlighter, 
  Undo2, Redo2, Table, Search, Eye, Keyboard, FileText, Clock,
  AlertTriangle, Zap
} from 'lucide-react';

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
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(3);
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [fontSize, setFontSize] = useState('14');
  const [fontFamily, setFontFamily] = useState('Arial');
  const [mediaType, setMediaType] = useState('youtube');
  const [mediaUrl, setMediaUrl] = useState('');
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
  const handleMediaEmbed = () => {
    if (!mediaUrl) return;

    const quill = quillRef.current?.getEditor();
    if (!quill) return;

    let embedHtml = '';
    const range = quill.getSelection();
    
    if (mediaType === 'youtube') {
      const videoId = mediaUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1];
      if (videoId) {
        embedHtml = `<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>`;
      }
    } else if (mediaType === 'twitter') {
      embedHtml = `<blockquote class="twitter-tweet"><a href="${mediaUrl}"></a></blockquote>`;
    } else if (mediaType === 'html') {
      embedHtml = DOMPurify.sanitize(mediaUrl);
    }

    if (embedHtml && range) {
      quill.clipboard.dangerouslyPasteHTML(range.index, embedHtml + '<br>');
      setMediaUrl('');
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

  // Apply formatting to selected text
  const applyFormat = (format: string, value?: any) => {
    const quill = quillRef.current?.getEditor();
    if (quill) {
      const range = quill.getSelection();
      if (range && range.length > 0) {
        quill.format(format, value);
      }
    }
  };

  // Check accessibility issues
  const checkAccessibility = () => {
    const issues = [];
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    
    const images = tempDiv.querySelectorAll('img');
    images.forEach((img, index) => {
      if (!img.alt) {
        issues.push(`Image ${index + 1} missing alt text`);
      }
    });
    
    const headings = tempDiv.querySelectorAll('h1, h2, h3, h4, h5, h6');
    if (headings.length === 0 && wordCount > 100) {
      issues.push('Consider adding headings for better structure');
    }
    
    return issues;
  };

  const renderMarkdownPreview = () => {
    try {
      const markdownText = content.replace(/<[^>]*>/g, '');
      const htmlContent = typeof marked.parse === 'function' 
        ? marked.parse(markdownText) as string
        : marked(markdownText) as string;
      const sanitizedHtml = DOMPurify.sanitize(htmlContent);
      return <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />;
    } catch (error) {
      return <div className="text-destructive">Error rendering markdown preview</div>;
    }
  };

  const shortcuts = [
    { key: 'Ctrl+B', action: 'Bold' },
    { key: 'Ctrl+I', action: 'Italic' },
    { key: 'Ctrl+U', action: 'Underline' },
    { key: 'Ctrl+Z', action: 'Undo' },
    { key: 'Ctrl+Y', action: 'Redo' },
    { key: 'Ctrl+S', action: 'Save' }
  ];

  const fontOptions = [
    { value: 'Arial', label: 'Arial' },
    { value: 'Georgia', label: 'Georgia' },
    { value: 'Times New Roman', label: 'Times New Roman' },
    { value: 'Helvetica', label: 'Helvetica' },
    { value: 'Courier New', label: 'Courier New' },
    { value: 'Verdana', label: 'Verdana' }
  ];

  const sizeOptions = [
    { value: '10', label: '10px' },
    { value: '12', label: '12px' },
    { value: '14', label: '14px' },
    { value: '16', label: '16px' },
    { value: '18', label: '18px' },
    { value: '24', label: '24px' },
    { value: '32', label: '32px' }
  ];

  const modules = {
    toolbar: false, // Disable default toolbar to prevent conflicts
    syntax: {
      highlight: (text: string) => hljs.highlightAuto(text).value
    },
    clipboard: {
      matchVisual: false,
    },
    imageResize: {
      parchment: true,
      modules: ['Resize', 'DisplaySize']
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
      <Card className="w-full max-w-6xl mx-auto">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              Rich Content Editor
              {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
              {autoSave && lastAutoSaved && showAutoSaveTooltip && (
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
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <FileText className="h-3 w-3" />
                <span>{wordCount} words</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{readTime} min read</span>
              </div>
              {checkAccessibility().length > 0 && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-1 text-orange-500">
                      <AlertTriangle className="h-3 w-3" />
                      <span>{checkAccessibility().length} issues</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="max-w-sm">
                      {checkAccessibility().map((issue, i) => (
                        <div key={i} className="text-xs">{issue}</div>
                      ))}
                    </div>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          </div>

          {/* Enhanced Toolbar */}
          <div className="flex items-center justify-between pt-3 border-t mt-3">
            <div className="flex items-center gap-2 flex-wrap">
              {/* Undo/Redo */}
              <div className="flex items-center gap-1 border-r pr-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" onClick={handleUndo} disabled={undoStack.length <= 1}>
                      <Undo2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Undo (Ctrl+Z)</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" onClick={handleRedo} disabled={redoStack.length === 0}>
                      <Redo2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Redo (Ctrl+Y)</TooltipContent>
                </Tooltip>
              </div>

              {/* Font Controls */}
              <div className="flex items-center gap-2 border-r pr-2">
                <Select value={fontFamily} onValueChange={(value) => {
                  setFontFamily(value);
                  applyFormat('font', value);
                }}>
                  <SelectTrigger className="w-32 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fontOptions.map(font => (
                      <SelectItem key={font.value} value={font.value}>
                        {font.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={fontSize} onValueChange={(value) => {
                  setFontSize(value);
                  applyFormat('size', `${value}px`);
                }}>
                  <SelectTrigger className="w-20 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sizeOptions.map(size => (
                      <SelectItem key={size.value} value={size.value}>
                        {size.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Advanced Tools */}
              <div className="flex items-center gap-1">
                {/* Table */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Table className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Insert Table</TooltipContent>
                    </Tooltip>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Insert Table</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Rows</Label>
                        <Input
                          type="number"
                          value={tableRows}
                          onChange={(e) => setTableRows(Number(e.target.value))}
                          min={1}
                          max={20}
                        />
                      </div>
                      <div>
                        <Label>Columns</Label>
                        <Input
                          type="number"
                          value={tableCols}
                          onChange={(e) => setTableCols(Number(e.target.value))}
                          min={1}
                          max={10}
                        />
                      </div>
                      <Button onClick={() => handleInsertTable(tableRows, tableCols)} className="w-full">
                        Insert Table
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                {/* Find & Replace */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Search className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Find & Replace</TooltipContent>
                    </Tooltip>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Find & Replace</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Find</Label>
                        <Input
                          value={findText}
                          onChange={(e) => setFindText(e.target.value)}
                          placeholder="Text to find"
                        />
                      </div>
                      <div>
                        <Label>Replace with</Label>
                        <Input
                          value={replaceText}
                          onChange={(e) => setReplaceText(e.target.value)}
                          placeholder="Replacement text"
                        />
                      </div>
                      <Button onClick={() => handleFindReplace(findText, replaceText)} className="w-full">
                        Replace All
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                {/* Media Embed */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Film className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Embed Media</TooltipContent>
                    </Tooltip>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Embed Media</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Type</Label>
                        <Select value={mediaType} onValueChange={setMediaType}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="youtube">YouTube</SelectItem>
                            <SelectItem value="twitter">Twitter</SelectItem>
                            <SelectItem value="html">Custom HTML</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>URL/HTML</Label>
                        <Input
                          value={mediaUrl}
                          onChange={(e) => setMediaUrl(e.target.value)}
                          placeholder={mediaType === 'html' ? 'Enter HTML code' : 'Enter URL'}
                        />
                      </div>
                      <Button onClick={handleMediaEmbed} className="w-full">
                        Embed
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                {/* Highlight */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" onClick={handleHighlight}>
                      <Highlighter className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Highlight Text</TooltipContent>
                </Tooltip>

                {/* Keyboard Shortcuts */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Keyboard className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Shortcuts</TooltipContent>
                    </Tooltip>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Keyboard Shortcuts</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-2">
                      {shortcuts.map((shortcut, index) => (
                        <div key={index} className="flex justify-between py-1">
                          <span className="text-sm">{shortcut.action}</span>
                          <code className="text-xs bg-muted px-2 py-1 rounded">{shortcut.key}</code>
                        </div>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Image Upload */}
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

              {uploadedImages.length > 0 && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <ImageIcon className="h-3 w-3" />
                  {uploadedImages.length}
                </Badge>
              )}

              {!hideManualSave && (
                <Button onClick={handleSave} disabled={isSaving} size="sm">
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save'}
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Tabs value={isMarkdownMode ? "preview" : "editor"} className="w-full">
            <TabsList className="grid w-full grid-cols-2 rounded-none border-b">
              <TabsTrigger value="editor" onClick={() => setIsMarkdownMode(false)} className="rounded-none">
                Editor
              </TabsTrigger>
              <TabsTrigger value="preview" onClick={() => setIsMarkdownMode(true)} className="rounded-none">
                Preview
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="editor" className="mt-0 border-0">
              <div
                className={`relative ${isDragOver ? 'bg-primary/5 border-primary/20 border-2 border-dashed' : ''}`}
                onDrop={handleImageDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                {isDragOver && (
                  <div className="absolute inset-0 flex items-center justify-center bg-primary/5 z-10 pointer-events-none">
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
                  className="min-h-[500px] [&_.ql-editor]:border-0 [&_.ql-toolbar]:hidden"
                />
              </div>
            </TabsContent>
            
            <TabsContent value="preview" className="mt-0">
              <div className="p-6 min-h-[500px] prose prose-slate max-w-none">
                {renderMarkdownPreview()}
              </div>
            </TabsContent>
          </Tabs>

          {isUploading && (
            <div className="border-t p-4 bg-muted/30">
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">{uploadProgress}</span>
              </div>
            </div>
          )}

          {autoSave && (
            <div className="border-t px-4 py-2 text-xs text-muted-foreground bg-muted/30">
              <div className="flex items-center gap-2">
                <Zap className="h-3 w-3" />
                Auto-save enabled • Content saves automatically every 3 seconds
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default RichContentEditor;