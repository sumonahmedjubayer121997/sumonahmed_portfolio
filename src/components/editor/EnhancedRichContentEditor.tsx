import React, { useState, useRef, useEffect, useCallback } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './EnhancedRichContentEditor.css';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import {
  Heading1Icon, Heading2Icon, Heading3Icon,
  ListOrderedIcon, ListUnorderedIcon, CodeIcon,
  ImageIcon, LinkIcon, QuoteIcon, TableIcon,
  AlignLeftIcon, AlignCenterIcon, AlignRightIcon,
  Color, Eraser, Code2, Redo, Undo,
  TextCursor, Maximize2, Download, Copy,
  Columns, Rows, CopyPlus, LayoutDashboard,
  SeparatorHorizontal
} from 'lucide-react';
import ImageResize from 'quill-image-resize-module';
import { useToast } from "@/components/ui/use-toast"
import { exportTableToCSV, exportTableToHTML, insertTable, deleteTable, addRow, addColumn, deleteRow, deleteColumn } from './tableUtils';

ReactQuill.Quill.register('modules/imageResize', ImageResize);

interface EnhancedRichContentEditorProps {
  content: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  showWordCount?: boolean;
  autoSave?: boolean;
  autoSaveDelay?: number;
  maxLength?: number;
  minHeight?: string;
  readOnly?: boolean;
  toolbarOptions?: (string | { [key: string]: any })[];
  enableMathSupport?: boolean;
  enableCodeHighlight?: boolean;
  theme?: "light" | "dark";
  showToolbar?: boolean;
  enableCollaborativeEditing?: boolean;
}

const EnhancedRichContentEditor: React.FC<EnhancedRichContentEditorProps> = ({
  content,
  onChange,
  placeholder = "Start writing your content...",
  className = "",
  showWordCount = true,
  autoSave = false,
  autoSaveDelay = 5000,
  maxLength,
  minHeight = "300px",
  readOnly = false,
  toolbarOptions = [
    'undo', 'redo', '|',
    'bold', 'italic', 'underline', 'strike', '|',
    'header', 'blockquote', 'code-block', '|',
    'list', 'bullet', 'indent', 'outdent', '|',
    'link', 'image', 'video', 'table', '|',
    'align', 'color', 'background', '|',
    'clean', 'fullscreen'
  ],
  enableMathSupport = false,
  enableCodeHighlight = true,
  theme = "light",
  showToolbar = true,
  enableCollaborativeEditing = false
}) => {
  const [wordCount, setWordCount] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedRange, setSelectedRange] = useState<any>(null);
  const [isTableSelected, setIsTableSelected] = useState(false);
  const quillRef = useRef<ReactQuill>(null);
  const autoSaveTimer = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast()

  const { theme: currentTheme } = useTheme();

  const calculateWordCount = (text: string) => {
    const words = text.trim().split(/\s+/);
    return words.length > 0 ? words.length : 0;
  };

  const handleChange = (value: string, source: string) => {
    if (source === 'api') {
      return;
    }

    setWordCount(calculateWordCount(value));
    onChange(value);

    if (autoSave) {
      if (autoSaveTimer.current) {
        clearTimeout(autoSaveTimer.current);
      }
      autoSaveTimer.current = setTimeout(() => {
        localStorage.setItem('savedContent', value);
        toast({
          title: "Auto Saved!",
          description: "Your content has been automatically saved.",
        })
      }, autoSaveDelay);
    }
  };

  const handleSelectionChange = useCallback((range: any, source: string, editor: any) => {
    if (range) {
      setSelectedRange(range);
      
      // Check if selection is within a table
      const selectedText = editor.getText(range.index, range.length);
      const tableRegex = /<table[\s\S]*?<\/table>/gi;
      setIsTableSelected(tableRegex.test(selectedText));
    }
  }, [toast]);

  const handleFullScreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleExport = (format: 'csv' | 'html') => {
    if (!selectedRange) {
      toast({
        title: "No Selection",
        description: "Please select a table to export.",
      })
      return;
    }

    const quill = quillRef.current?.getEditor();
    if (!quill) {
      toast({
        title: "Error",
        description: "Quill editor is not available.",
      })
      return;
    }

    const tableElement = quill.container.querySelector('table');
    if (!tableElement) {
      toast({
        title: "No Table Found",
        description: "No table found in the selected range.",
      })
      return;
    }

    let exportedData: string = '';
    let fileExtension: string = '';
    let mimeType: string = '';

    if (format === 'csv') {
      exportedData = exportTableToCSV(tableElement);
      fileExtension = 'csv';
      mimeType = 'text/csv';
    } else if (format === 'html') {
      exportedData = exportTableToHTML(tableElement);
      fileExtension = 'html';
      mimeType = 'text/html';
    }

    const blob = new Blob([exportedData], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `table_export.${fileExtension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopyTable = () => {
    if (!selectedRange) {
      toast({
        title: "No Selection",
        description: "Please select a table to copy.",
      })
      return;
    }

    const quill = quillRef.current?.getEditor();
    if (!quill) {
      toast({
        title: "Error",
        description: "Quill editor is not available.",
      })
      return;
    }

    const tableElement = quill.container.querySelector('table');
    if (!tableElement) {
      toast({
        title: "No Table Found",
        description: "No table found in the selected range.",
      })
      return;
    }

    const htmlContent = tableElement.outerHTML;
    navigator.clipboard.writeText(htmlContent)
      .then(() => {
        toast({
          title: "Copied!",
          description: "Table copied to clipboard.",
        })
      })
      .catch(err => {
        toast({
          title: "Copy Failed",
          description: "Failed to copy table to clipboard.",
        })
        console.error('Failed to copy table: ', err);
      });
  };

  const toolbarConfig = useMemo(() => {
    const config: any = {
      container: toolbarOptions,
      handlers: {
        table: () => {
          const quill = quillRef.current?.getEditor();
          if (quill) {
            insertTable(quill);
          }
        },
        image: () => {
          const quill = quillRef.current?.getEditor();
          if (quill) {
            const range = quill.getSelection();
            const imageUrl = prompt('Enter image URL:');
            if (imageUrl) {
              quill.insertEmbed(range.index, 'image', imageUrl, 'user');
            }
          }
        }
      }
    };
    return config;
  }, [toolbarOptions]);

  const toolbarHandlers = useMemo(() => ({
    table: () => {
      const quill = quillRef.current?.getEditor();
      if (quill) {
        insertTable(quill);
      }
    },
    image: () => {
      const quill = quillRef.current?.getEditor();
      if (quill) {
        const range = quill.getSelection();
        const imageUrl = prompt('Enter image URL:');
        if (imageUrl) {
          quill.insertEmbed(range.index, 'image', imageUrl, 'user');
        }
      }
    }
  }), []);

  return (
    <div className={`enhanced-rich-editor ${theme} ${className}`}>
      {showToolbar && (
        <div className="toolbar-container">
          <ReactQuill.Quill.Toolbar
            container={toolbarConfig.container}
            handlers={toolbarHandlers}
          />
        </div>
      )}
      
      {/* Editor Container */}
      <div 
        className="editor-container relative"
        style={{ 
          minHeight,
          height: isFullscreen ? '100vh' : 'auto'
        }}
      >
        <ReactQuill
          ref={quillRef}
          theme="snow"
          value={content}
          onChange={handleChange}
          onChangeSelection={handleSelectionChange}
          modules={{
            toolbar: {
              container: toolbarConfig,
              handlers: toolbarHandlers
            },
            clipboard: {
              matchVisual: false,
            },
            imageResize: {
              parchment: ReactQuill.Quill.import('parchment'),
              modules: ['Resize', 'DisplaySize']
            }
          }}
          formats={[
            'header', 'font', 'size',
            'bold', 'italic', 'underline', 'strike', 'blockquote',
            'list', 'bullet', 'indent',
            'link', 'image', 'video', 'table',
            'align', 'color', 'background',
            'code', 'code-block',
            'script', 'formula'
          ]}
          placeholder={placeholder}
          className={`
            custom-quill-editor 
            ${readOnly ? 'read-only' : ''}
            ${isFullscreen ? 'fullscreen-editor' : ''}
          `}
          readOnly={readOnly}
        />

        {/* Word Count Display */}
        {showWordCount && (
          <div className="word-count absolute bottom-2 right-2 text-xs text-gray-500">
            {wordCount} words
          </div>
        )}

        {/* Fullscreen Toggle Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleFullScreen}
          className="fullscreen-button absolute top-2 right-2 text-gray-500 hover:bg-gray-100"
        >
          <Maximize2 className="h-4 w-4" />
        </Button>

        {/* Table Actions */}
        {isTableSelected && (
          <div className="table-actions absolute top-2 left-2 bg-white border rounded shadow-md p-2 z-10">
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" onClick={() => {
                const quill = quillRef.current?.getEditor();
                if (quill) {
                  addRow(quill);
                }
              }}>
                <Rows className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => {
                const quill = quillRef.current?.getEditor();
                if (quill) {
                  addColumn(quill);
                }
              }}>
                <Columns className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => {
                const quill = quillRef.current?.getEditor();
                if (quill) {
                  deleteRow(quill);
                }
              }}>
                <SeparatorHorizontal className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => {
                const quill = quillRef.current?.getEditor();
                if (quill) {
                  deleteColumn(quill);
                }
              }}>
                <LayoutDashboard className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => {
                const quill = quillRef.current?.getEditor();
                if (quill) {
                  deleteTable(quill);
                }
              }}>
                <Code2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleCopyTable}>
                <CopyPlus className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => handleExport('csv')}>
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => handleExport('html')}>
                <CodeIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedRichContentEditor;
