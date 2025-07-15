import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Undo2, 
  Redo2, 
  Table, 
  Search, 
  Type, 
  Palette, 
  Code2, 
  Youtube, 
  Eye, 
  Keyboard,
  FileText,
  Clock,
  Calculator
} from 'lucide-react';

interface EditorToolbarProps {
  quillRef: React.RefObject<any>;
  onUndo: () => void;
  onRedo: () => void;
  onInsertTable: (rows: number, cols: number) => void;
  onToggleMarkdown: () => void;
  onFindReplace: (find: string, replace: string) => void;
  wordCount: number;
  readTime: number;
  isMarkdownMode: boolean;
}

export const EditorToolbar = ({
  quillRef,
  onUndo,
  onRedo,
  onInsertTable,
  onToggleMarkdown,
  onFindReplace,
  wordCount,
  readTime,
  isMarkdownMode
}: EditorToolbarProps) => {
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(3);
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [fontSize, setFontSize] = useState('14');
  const [fontFamily, setFontFamily] = useState('Arial');

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
    { value: '20', label: '20px' },
    { value: '24', label: '24px' },
    { value: '28', label: '28px' },
    { value: '32', label: '32px' }
  ];

  const applyFormat = (format: string, value?: any) => {
    const quill = quillRef.current?.getEditor();
    if (quill) {
      const range = quill.getSelection();
      if (range) {
        quill.format(format, value);
      }
    }
  };

  const insertEmbed = (type: string, url: string) => {
    const quill = quillRef.current?.getEditor();
    if (quill) {
      const range = quill.getSelection();
      if (range) {
        quill.insertEmbed(range.index, type, url);
      }
    }
  };

  const shortcuts = [
    { key: 'Ctrl+B', action: 'Bold' },
    { key: 'Ctrl+I', action: 'Italic' },
    { key: 'Ctrl+U', action: 'Underline' },
    { key: 'Ctrl+Z', action: 'Undo' },
    { key: 'Ctrl+Y', action: 'Redo' },
    { key: 'Ctrl+K', action: 'Link' },
    { key: 'Ctrl+F', action: 'Find' },
    { key: 'Ctrl+H', action: 'Replace' }
  ];

  return (
    <TooltipProvider>
      <div className="border-b p-3 space-y-3">
        {/* Primary toolbar */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Undo/Redo */}
          <div className="flex items-center gap-1 border-r pr-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={onUndo}>
                  <Undo2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Undo (Ctrl+Z)</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={onRedo}>
                  <Redo2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Redo (Ctrl+Y)</TooltipContent>
            </Tooltip>
          </div>

          {/* Font controls */}
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
                  <Label htmlFor="rows">Rows</Label>
                  <Input
                    id="rows"
                    type="number"
                    value={tableRows}
                    onChange={(e) => setTableRows(Number(e.target.value))}
                    min={1}
                    max={20}
                  />
                </div>
                <div>
                  <Label htmlFor="cols">Columns</Label>
                  <Input
                    id="cols"
                    type="number"
                    value={tableCols}
                    onChange={(e) => setTableCols(Number(e.target.value))}
                    min={1}
                    max={10}
                  />
                </div>
                <Button onClick={() => onInsertTable(tableRows, tableCols)} className="w-full">
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
                <TooltipContent>Find & Replace (Ctrl+F)</TooltipContent>
              </Tooltip>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Find & Replace</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="find">Find</Label>
                  <Input
                    id="find"
                    value={findText}
                    onChange={(e) => setFindText(e.target.value)}
                    placeholder="Text to find"
                  />
                </div>
                <div>
                  <Label htmlFor="replace">Replace with</Label>
                  <Input
                    id="replace"
                    value={replaceText}
                    onChange={(e) => setReplaceText(e.target.value)}
                    placeholder="Replacement text"
                  />
                </div>
                <Button onClick={() => onFindReplace(findText, replaceText)} className="w-full">
                  Replace All
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Markdown Toggle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant={isMarkdownMode ? "default" : "ghost"} size="sm" onClick={onToggleMarkdown}>
                <Eye className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Toggle Markdown Preview</TooltipContent>
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
                <TooltipContent>Keyboard Shortcuts</TooltipContent>
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

        {/* Stats bar */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <FileText className="h-3 w-3" />
            <span>{wordCount} words</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{readTime} min read</span>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};