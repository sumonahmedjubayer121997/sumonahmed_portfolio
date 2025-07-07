
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Bold, Italic, Link, List, ListOrdered, Eye, EyeOff } from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const RichTextEditor = ({ value, onChange, placeholder }: RichTextEditorProps) => {
  const [showPreview, setShowPreview] = useState(false);

  const insertTag = (openTag: string, closeTag: string) => {
    const textarea = document.getElementById('rich-text-editor') as HTMLTextAreaElement;
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
  };

  const formatButtons = [
    {
      icon: Bold,
      label: "Bold",
      action: () => insertTag('<b>', '</b>')
    },
    {
      icon: Italic,
      label: "Italic", 
      action: () => insertTag('<i>', '</i>')
    },
    {
      icon: Link,
      label: "Link",
      action: () => insertTag('<a href="URL">', '</a>')
    },
    {
      icon: List,
      label: "Bullet List",
      action: () => insertTag('<ul><li>', '</li></ul>')
    },
    {
      icon: ListOrdered,
      label: "Numbered List",
      action: () => insertTag('<ol><li>', '</li></ol>')
    }
  ];

  return (
    <div className="space-y-2">
      {/* Toolbar */}
      <div className="flex items-center justify-between border rounded-t-md p-2 bg-gray-50">
        <div className="flex items-center space-x-1">
          {formatButtons.map((button, index) => {
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
        </div>
        
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

      {/* Editor/Preview Area */}
      {showPreview ? (
        <div className="min-h-[120px] p-3 border rounded-b-md bg-white">
          {value ? (
            <div 
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: value }}
            />
          ) : (
            <p className="text-gray-400 italic">Preview will appear here...</p>
          )}
        </div>
      ) : (
        <Textarea
          id="rich-text-editor"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="min-h-[120px] rounded-t-none border-t-0"
          rows={6}
        />
      )}

      {/* Help Text */}
      <p className="text-xs text-gray-500">
        Supports HTML tags: &lt;b&gt;, &lt;i&gt;, &lt;a&gt;, &lt;ul&gt;, &lt;ol&gt;, &lt;li&gt;, &lt;p&gt;, &lt;br&gt;
      </p>
    </div>
  );
};

export default RichTextEditor;
