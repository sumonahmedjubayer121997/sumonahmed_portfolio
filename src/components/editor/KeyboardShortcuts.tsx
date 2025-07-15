import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Keyboard } from 'lucide-react';

interface KeyboardShortcutsProps {
  open: boolean;
  onClose: () => void;
}

const KeyboardShortcuts: React.FC<KeyboardShortcutsProps> = ({
  open,
  onClose,
}) => {
  const shortcuts = [
    {
      category: 'Basic Editing',
      items: [
        { keys: ['Ctrl', 'Z'], description: 'Undo' },
        { keys: ['Ctrl', 'Y'], description: 'Redo' },
        { keys: ['Ctrl', 'A'], description: 'Select All' },
        { keys: ['Ctrl', 'C'], description: 'Copy' },
        { keys: ['Ctrl', 'V'], description: 'Paste' },
        { keys: ['Ctrl', 'X'], description: 'Cut' },
      ],
    },
    {
      category: 'Text Formatting',
      items: [
        { keys: ['Ctrl', 'B'], description: 'Bold' },
        { keys: ['Ctrl', 'I'], description: 'Italic' },
        { keys: ['Ctrl', 'U'], description: 'Underline' },
        { keys: ['Ctrl', 'Shift', 'S'], description: 'Strikethrough' },
        { keys: ['Ctrl', 'K'], description: 'Insert Link' },
      ],
    },
    {
      category: 'Structure',
      items: [
        { keys: ['Ctrl', '1'], description: 'Heading 1' },
        { keys: ['Ctrl', '2'], description: 'Heading 2' },
        { keys: ['Ctrl', '3'], description: 'Heading 3' },
        { keys: ['Ctrl', 'Shift', '8'], description: 'Bullet List' },
        { keys: ['Ctrl', 'Shift', '7'], description: 'Numbered List' },
        { keys: ['Ctrl', 'Shift', '9'], description: 'Blockquote' },
      ],
    },
    {
      category: 'Alignment',
      items: [
        { keys: ['Ctrl', 'Shift', 'L'], description: 'Align Left' },
        { keys: ['Ctrl', 'Shift', 'E'], description: 'Align Center' },
        { keys: ['Ctrl', 'Shift', 'R'], description: 'Align Right' },
        { keys: ['Ctrl', 'Shift', 'J'], description: 'Justify' },
      ],
    },
    {
      category: 'Advanced',
      items: [
        { keys: ['Ctrl', 'F'], description: 'Find & Replace' },
        { keys: ['Ctrl', 'S'], description: 'Save' },
        { keys: ['Ctrl', '`'], description: 'Code Block' },
        { keys: ['Tab'], description: 'Indent' },
        { keys: ['Shift', 'Tab'], description: 'Outdent' },
        { keys: ['Ctrl', '?'], description: 'Show Shortcuts' },
      ],
    },
  ];

  const KeyBadge = ({ children }: { children: string }) => (
    <Badge variant="outline" className="font-mono text-xs px-2 py-1">
      {children}
    </Badge>
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="h-5 w-5" />
            Keyboard Shortcuts
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {shortcuts.map((category, categoryIndex) => (
            <div key={categoryIndex}>
              <h3 className="font-semibold text-lg mb-3 text-primary">
                {category.category}
              </h3>
              <div className="space-y-2">
                {category.items.map((shortcut, index) => (
                  <div key={index} className="flex items-center justify-between py-2">
                    <span className="text-sm">{shortcut.description}</span>
                    <div className="flex items-center gap-1">
                      {shortcut.keys.map((key, keyIndex) => (
                        <React.Fragment key={keyIndex}>
                          <KeyBadge>{key}</KeyBadge>
                          {keyIndex < shortcut.keys.length - 1 && (
                            <span className="text-muted-foreground text-xs mx-1">+</span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              {categoryIndex < shortcuts.length - 1 && (
                <Separator className="mt-4" />
              )}
            </div>
          ))}
          
          <div className="pt-4 border-t">
            <p className="text-xs text-muted-foreground text-center">
              Press <KeyBadge>Esc</KeyBadge> to close this dialog
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default KeyboardShortcuts;