import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Table, Plus, Minus } from 'lucide-react';

interface TableInsertDialogProps {
  open: boolean;
  onClose: () => void;
  onInsert: (rows: number, cols: number, hasHeader: boolean) => void;
}

const TableInsertDialog: React.FC<TableInsertDialogProps> = ({
  open,
  onClose,
  onInsert,
}) => {
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  const [hasHeader, setHasHeader] = useState(true);

  const handleInsert = () => {
    onInsert(rows, cols, hasHeader);
    onClose();
  };

  const adjustValue = (value: number, delta: number, min: number, max: number) => {
    return Math.max(min, Math.min(max, value + delta));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Table className="h-4 w-4" />
            Insert Table
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Table Preview */}
          <div className="flex justify-center">
            <div className="grid gap-1 p-4 border rounded-lg bg-muted/30" 
                 style={{ 
                   gridTemplateColumns: `repeat(${cols}, 1fr)`,
                   maxWidth: '240px'
                 }}>
              {Array.from({ length: rows * cols }, (_, i) => {
                const row = Math.floor(i / cols);
                const isHeader = hasHeader && row === 0;
                return (
                  <div
                    key={i}
                    className={`w-6 h-4 border border-border ${
                      isHeader 
                        ? 'bg-primary/20 border-primary/40' 
                        : 'bg-background'
                    }`}
                  />
                );
              })}
            </div>
          </div>

          {/* Rows Control */}
          <div className="space-y-2">
            <Label>Rows</Label>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRows(adjustValue(rows, -1, 1, 20))}
                disabled={rows <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Input
                type="number"
                value={rows}
                onChange={(e) => setRows(adjustValue(parseInt(e.target.value) || 1, 0, 1, 20))}
                className="w-20 text-center"
                min={1}
                max={20}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRows(adjustValue(rows, 1, 1, 20))}
                disabled={rows >= 20}
              >
                <Plus className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground ml-2">
                (1-20)
              </span>
            </div>
          </div>

          {/* Columns Control */}
          <div className="space-y-2">
            <Label>Columns</Label>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCols(adjustValue(cols, -1, 1, 10))}
                disabled={cols <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Input
                type="number"
                value={cols}
                onChange={(e) => setCols(adjustValue(parseInt(e.target.value) || 1, 0, 1, 10))}
                className="w-20 text-center"
                min={1}
                max={10}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCols(adjustValue(cols, 1, 1, 10))}
                disabled={cols >= 10}
              >
                <Plus className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground ml-2">
                (1-10)
              </span>
            </div>
          </div>

          {/* Header Option */}
          <div className="flex items-center justify-between">
            <Label htmlFor="table-header">Include header row</Label>
            <Switch
              id="table-header"
              checked={hasHeader}
              onCheckedChange={setHasHeader}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleInsert}
              className="flex-1"
            >
              Insert Table
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TableInsertDialog;