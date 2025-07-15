import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Search, Replace, ChevronDown, ChevronUp, X } from 'lucide-react';

interface FindReplaceDialogProps {
  open: boolean;
  onClose: () => void;
  onFind: (query: string, options: FindOptions) => void;
  onReplace: (findQuery: string, replaceText: string, options: FindOptions) => void;
  onReplaceAll: (findQuery: string, replaceText: string, options: FindOptions) => void;
  totalMatches: number;
  currentMatch: number;
}

interface FindOptions {
  caseSensitive: boolean;
  wholeWord: boolean;
  regex: boolean;
}

const FindReplaceDialog: React.FC<FindReplaceDialogProps> = ({
  open,
  onClose,
  onFind,
  onReplace,
  onReplaceAll,
  totalMatches,
  currentMatch,
}) => {
  const [findQuery, setFindQuery] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [options, setOptions] = useState<FindOptions>({
    caseSensitive: false,
    wholeWord: false,
    regex: false,
  });

  const handleFind = () => {
    if (findQuery.trim()) {
      onFind(findQuery, options);
    }
  };

  const handleReplace = () => {
    if (findQuery.trim()) {
      onReplace(findQuery, replaceText, options);
    }
  };

  const handleReplaceAll = () => {
    if (findQuery.trim()) {
      onReplaceAll(findQuery, replaceText, options);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        // Previous match
        handleFind();
      } else {
        // Next match
        handleFind();
      }
    }
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Find & Replace
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Find Input */}
          <div className="space-y-2">
            <Label htmlFor="find-input">Find</Label>
            <div className="relative">
              <Input
                id="find-input"
                value={findQuery}
                onChange={(e) => setFindQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter text to find..."
                className="pr-20"
                autoFocus
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {totalMatches > 0 && (
                  <span className="text-xs text-muted-foreground">
                    {currentMatch}/{totalMatches}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Replace Input */}
          <div className="space-y-2">
            <Label htmlFor="replace-input">Replace</Label>
            <Input
              id="replace-input"
              value={replaceText}
              onChange={(e) => setReplaceText(e.target.value)}
              placeholder="Enter replacement text..."
            />
          </div>

          {/* Options */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="case-sensitive">Case sensitive</Label>
              <Switch
                id="case-sensitive"
                checked={options.caseSensitive}
                onCheckedChange={(checked) =>
                  setOptions(prev => ({ ...prev, caseSensitive: checked }))
                }
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="whole-word">Whole word</Label>
              <Switch
                id="whole-word"
                checked={options.wholeWord}
                onCheckedChange={(checked) =>
                  setOptions(prev => ({ ...prev, wholeWord: checked }))
                }
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="regex">Regular expression</Label>
              <Switch
                id="regex"
                checked={options.regex}
                onCheckedChange={(checked) =>
                  setOptions(prev => ({ ...prev, regex: checked }))
                }
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleFind}
                disabled={!findQuery.trim()}
                className="flex-1"
              >
                <ChevronUp className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleFind}
                disabled={!findQuery.trim()}
                className="flex-1"
              >
                <ChevronDown className="h-4 w-4 mr-1" />
                Next
              </Button>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleReplace}
                disabled={!findQuery.trim() || totalMatches === 0}
                className="flex-1"
              >
                <Replace className="h-4 w-4 mr-1" />
                Replace
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleReplaceAll}
                disabled={!findQuery.trim() || totalMatches === 0}
                className="flex-1"
              >
                Replace All
              </Button>
            </div>
          </div>

          {/* Close Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="w-full"
          >
            <X className="h-4 w-4 mr-2" />
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FindReplaceDialog;