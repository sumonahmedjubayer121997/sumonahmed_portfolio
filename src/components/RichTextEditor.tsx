import { useState, useEffect, useRef, useCallback } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Bold, Italic, Link, List, ListOrdered, Eye, EyeOff, 
  Underline, Strikethrough, Code, Image, Undo, Redo,
  Heading1, Heading2, Heading3, Minus
} from "lucide-react";
import DOMPurify from 'dompurify';
import { marked } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';

interface FormatButton {
  icon: any;
  label: string;
  action: () => void;
  shortcut?: string;
}

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  config?: {
    enabledButtons?: string[];
    customButtons?: FormatButton[];
  };
}

const RichTextEditor = ({ value, onChange, placeholder, config }: RichTextEditorProps) => {
  const [showPreview, setShowPreview] = useState(false);
  const [history, setHistory] = useState<string[]>([value]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [imageUrl, setImageUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [isVideoDialogOpen, setIsVideoDialogOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Initialize history
  useEffect(() => {
    if (history.length === 0 || history[historyIndex] !== value) {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(value);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
  }, [value]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case 'b':
            e.preventDefault();
            insertTag('<b>', '</b>');
            break;
          case 'i':
            e.preventDefault();
            insertTag('<i>', '</i>');
            break;
          case 'u':
            e.preventDefault();
            insertTag('<u>', '</u>');
            break;
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
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [historyIndex, history]);

  const insertTag = useCallback((openTag: string, closeTag: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    const before = value.substring(0, start);
    const after = value.substring(end);
    
    const newText = `${before}${openTag}${selectedText}${closeTag}${after}`;
    onChange(newText);
    
    // Reset focus and cursor position
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + openTag.length + selectedText.length + closeTag.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  }, [value, onChange]);

  const insertImage = () => {
    if (imageUrl.trim()) {
      insertTag(`<img src="${imageUrl}" alt="Image" />`, '');
      setImageUrl("");
      setIsImageDialogOpen(false);
    }
  };

  const insertVideo = () => {
    if (videoUrl.trim()) {
      let embedUrl = videoUrl;
      
      // Convert YouTube URLs to embed format
      if (videoUrl.includes('youtube.com/watch?v=')) {
        const videoId = videoUrl.split('v=')[1]?.split('&')[0];
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
      } else if (videoUrl.includes('youtu.be/')) {
        const videoId = videoUrl.split('youtu.be/')[1]?.split('?')[0];
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
      } else if (videoUrl.includes('vimeo.com/')) {
        const videoId = videoUrl.split('vimeo.com/')[1]?.split('?')[0];
        embedUrl = `https://player.vimeo.com/video/${videoId}`;
      }
      
      insertTag(`<iframe src="${embedUrl}" width="560" height="315" frameborder="0" allowfullscreen></iframe>`, '');
      setVideoUrl("");
      setIsVideoDialogOpen(false);
    }
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      onChange(history[newIndex]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      onChange(history[newIndex]);
    }
  };

  const autoDetectUrls = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');
  };

  const convertMarkdownToHtml = (text: string) => {
    try {
      const result = marked(text);
      return typeof result === 'string' ? result : text;
    } catch (error) {
      return text;
    }
  };

  const sanitizeHtml = (html: string) => {
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ['b', 'i', 'u', 's', 'a', 'ul', 'ol', 'li', 'p', 'br', 'code', 'pre', 'blockquote', 'h1', 'h2', 'h3', 'hr', 'img', 'iframe'],
      ALLOWED_ATTR: ['href', 'target', 'rel', 'src', 'alt', 'width', 'height', 'frameborder', 'allowfullscreen']
    });
  };

  const getPreviewContent = () => {
    let processedContent = value;
    
    // Auto-detect URLs
    processedContent = autoDetectUrls(processedContent);
    
    // Convert markdown if enabled
    if (processedContent.includes('**') || processedContent.includes('*') || processedContent.includes('#')) {
      processedContent = convertMarkdownToHtml(processedContent);
    }
    
    // Sanitize HTML
    processedContent = sanitizeHtml(processedContent);
    
    return processedContent;
  };

  const insertTemplate = (template: string) => {
    insertTag(template, '');
  };

  const defaultFormatButtons: FormatButton[] = [
    { icon: Bold, label: "Bold (Ctrl+B)", action: () => insertTag('<b>', '</b>'), shortcut: "Ctrl+B" },
    { icon: Italic, label: "Italic (Ctrl+I)", action: () => insertTag('<i>', '</i>'), shortcut: "Ctrl+I" },
    { icon: Underline, label: "Underline (Ctrl+U)", action: () => insertTag('<u>', '</u>'), shortcut: "Ctrl+U" },
    { icon: Strikethrough, label: "Strikethrough", action: () => insertTag('<s>', '</s>') },
    { icon: Code, label: "Inline Code", action: () => insertTag('<code>', '</code>') },
    { icon: Heading1, label: "Heading 1", action: () => insertTag('<h1>', '</h1>') },
    { icon: Heading2, label: "Heading 2", action: () => insertTag('<h2>', '</h2>') },
    { icon: Heading3, label: "Heading 3", action: () => insertTag('<h3>', '</h3>') },
    { icon: List, label: "Bullet List", action: () => insertTag('<ul><li>', '</li></ul>') },
    { icon: ListOrdered, label: "Numbered List", action: () => insertTag('<ol><li>', '</li></ol>') },
    { icon: Link, label: "Link", action: () => insertTag('<a href="URL">', '</a>') },
    { icon: Minus, label: "Horizontal Rule", action: () => insertTag('<hr />', '') },
    { icon: Code, label: "Blockquote", action: () => insertTag('<blockquote>', '</blockquote>') }
  ];

  const formatButtons = config?.enabledButtons
    ? defaultFormatButtons.filter(btn => config.enabledButtons?.includes(btn.label))
    : defaultFormatButtons;

  const allButtons = [...formatButtons, ...(config?.customButtons || [])];

  // Apply syntax highlighting to code blocks in preview
  useEffect(() => {
    if (showPreview) {
      setTimeout(() => {
        document.querySelectorAll('pre code, code').forEach((block) => {
          hljs.highlightElement(block as HTMLElement);
        });
      }, 0);
    }
  }, [showPreview, value]);

  const templateBlocks = [
    { name: "FAQ", template: '<div class="faq"><h4>Question</h4><p>Answer</p></div>' },
    { name: "Callout", template: '<div class="callout"><strong>Note:</strong> Important information here.</div>' },
    { name: "Code Block", template: '<pre><code>// Your code here</code></pre>' }
  ];

  return (
    <div className="space-y-2">
      {/* Toolbar */}
      <div className="border rounded-t-md p-2 bg-muted/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center flex-wrap gap-1">
            {/* Format Buttons */}
            {allButtons.map((button, index) => {
              const Icon = button.icon;
              return (
                <Button
                  key={index}
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={button.action}
                  title={button.label}
                  className="h-8 w-8 p-0"
                >
                  <Icon size={14} />
                </Button>
              );
            })}
            
            {/* Separator */}
            <div className="w-px h-6 bg-border mx-1" />
            
            {/* Media Buttons */}
            <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  title="Insert Image"
                >
                  <Image size={14} />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Insert Image</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="image-url">Image URL</Label>
                    <Input
                      id="image-url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  <Button onClick={insertImage} disabled={!imageUrl.trim()}>
                    Insert Image
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={isVideoDialogOpen} onOpenChange={setIsVideoDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  title="Insert Video"
                >
                  <Code size={14} />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Insert Video</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="video-url">Video URL (YouTube/Vimeo)</Label>
                    <Input
                      id="video-url"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      placeholder="https://youtube.com/watch?v=..."
                    />
                  </div>
                  <Button onClick={insertVideo} disabled={!videoUrl.trim()}>
                    Insert Video
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            
            {/* Separator */}
            <div className="w-px h-6 bg-border mx-1" />
            
            {/* History Buttons */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleUndo}
              disabled={historyIndex === 0}
              title="Undo (Ctrl+Z)"
              className="h-8 w-8 p-0"
            >
              <Undo size={14} />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleRedo}
              disabled={historyIndex === history.length - 1}
              title="Redo (Ctrl+Y)"
              className="h-8 w-8 p-0"
            >
              <Redo size={14} />
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Template Blocks */}
            <select
              onChange={(e) => {
                if (e.target.value) {
                  insertTemplate(e.target.value);
                  e.target.value = "";
                }
              }}
              className="text-xs border rounded px-2 py-1"
            >
              <option value="">Templates</option>
              {templateBlocks.map((template, index) => (
                <option key={index} value={template.template}>
                  {template.name}
                </option>
              ))}
            </select>
            
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center space-x-1"
            >
              {showPreview ? <EyeOff size={14} /> : <Eye size={14} />}
              <span className="text-xs">{showPreview ? 'Edit' : 'Preview'}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Editor/Preview Area */}
      {showPreview ? (
        <div className="min-h-[120px] p-3 border rounded-b-md bg-background">
          {value ? (
            <div 
              className="prose prose-sm max-w-none prose-code:bg-muted prose-code:px-1 prose-code:rounded"
              dangerouslySetInnerHTML={{ __html: getPreviewContent() }}
            />
          ) : (
            <p className="text-muted-foreground italic">Preview will appear here...</p>
          )}
        </div>
      ) : (
        <Textarea
          ref={textareaRef}
          id="rich-text-editor"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="min-h-[120px] rounded-t-none border-t-0 resize-y"
          rows={6}
        />
      )}

      {/* Help Text */}
      <div className="text-xs text-muted-foreground space-y-1">
        <p>
          Supports HTML tags, Markdown syntax, and keyboard shortcuts (Ctrl+B, Ctrl+I, Ctrl+U, Ctrl+Z, Ctrl+Y)
        </p>
        <p>
          URLs are automatically converted to links. Use templates for quick insertion of common blocks.
        </p>
      </div>
    </div>
  );
};

export default RichTextEditor;