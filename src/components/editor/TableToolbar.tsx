
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Plus,
  Minus,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Merge,
  Split,
  Palette,
  Download,
  MoreHorizontal,
} from 'lucide-react';

interface TableToolbarProps {
  onAddRow: () => void;
  onRemoveRow: () => void;
  onAddColumn: () => void;
  onRemoveColumn: () => void;
  onAlignLeft: () => void;
  onAlignCenter: () => void;
  onAlignRight: () => void;
  onMergeCells: () => void;
  onSplitCells: () => void;
  onColorChange: (color: string) => void;
  onBorderChange: (width: number, color: string) => void;
  onExportCSV: () => void;
  onExportHTML: () => void;
  selectedCellColor?: string;
  borderWidth?: number;
  borderColor?: string;
}

const TableToolbar: React.FC<TableToolbarProps> = ({
  onAddRow,
  onRemoveRow,
  onAddColumn,
  onRemoveColumn,
  onAlignLeft,
  onAlignCenter,
  onAlignRight,
  onMergeCells,
  onSplitCells,
  onColorChange,
  onBorderChange,
  onExportCSV,
  onExportHTML,
  selectedCellColor = '',
  borderWidth = 1,
  borderColor = '#cccccc',
}) => {
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [borderSettingsOpen, setBorderSettingsOpen] = useState(false);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);

  const commonColors = [
    '#ffffff', '#f8f9fa', '#e9ecef', '#dee2e6',
    '#ffe8e8', '#fff4e6', '#e8f5e8', '#e6f3ff',
    '#f0e8ff', '#ffe8f8', '#ffebcd', '#e0ffff',
  ];

  return (
    <div className="flex items-center gap-1 p-2 border-b bg-background/50 backdrop-blur-sm">
      {/* Row Operations */}
      <div className="flex items-center gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" onClick={onAddRow} className="h-7 px-2">
              <Plus className="h-3 w-3 mr-1" />
              Row
            </Button>
          </TooltipTrigger>
          <TooltipContent>Add row below</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" onClick={onRemoveRow} className="h-7 px-2">
              <Minus className="h-3 w-3 mr-1" />
              Row
            </Button>
          </TooltipTrigger>
          <TooltipContent>Remove current row</TooltipContent>
        </Tooltip>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Column Operations */}
      <div className="flex items-center gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" onClick={onAddColumn} className="h-7 px-2">
              <Plus className="h-3 w-3 mr-1" />
              Col
            </Button>
          </TooltipTrigger>
          <TooltipContent>Add column to the right</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" onClick={onRemoveColumn} className="h-7 px-2">
              <Minus className="h-3 w-3 mr-1" />
              Col
            </Button>
          </TooltipTrigger>
          <TooltipContent>Remove current column</TooltipContent>
        </Tooltip>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Alignment */}
      <div className="flex items-center gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" onClick={onAlignLeft} className="h-7 px-2">
              <AlignLeft className="h-3 w-3" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Align left</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" onClick={onAlignCenter} className="h-7 px-2">
              <AlignCenter className="h-3 w-3" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Align center</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" onClick={onAlignRight} className="h-7 px-2">
              <AlignRight className="h-3 w-3" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Align right</TooltipContent>
        </Tooltip>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Cell Operations */}
      <div className="flex items-center gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" onClick={onMergeCells} className="h-7 px-2">
              <Merge className="h-3 w-3" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Merge selected cells</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" onClick={onSplitCells} className="h-7 px-2">
              <Split className="h-3 w-3" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Split merged cells</TooltipContent>
        </Tooltip>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Styling */}
      <Popover open={colorPickerOpen} onOpenChange={setColorPickerOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" className="h-7 px-2">
            <Palette className="h-3 w-3" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56" align="start">
          <div className="space-y-3">
            <div className="text-sm font-medium">Cell Background</div>
            <div className="grid grid-cols-4 gap-2">
              {commonColors.map((color) => (
                <button
                  key={color}
                  className="w-8 h-8 rounded border border-border hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                  onClick={() => {
                    onColorChange(color);
                    setColorPickerOpen(false);
                  }}
                />
              ))}
            </div>
            <div className="space-y-2">
              <Label htmlFor="custom-color">Custom Color</Label>
              <Input
                id="custom-color"
                type="color"
                value={selectedCellColor}
                onChange={(e) => onColorChange(e.target.value)}
                className="h-8"
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Export Options */}
      <Popover open={exportMenuOpen} onOpenChange={setExportMenuOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" className="h-7 px-2">
            <Download className="h-3 w-3" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-40" align="end">
          <div className="space-y-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                onExportCSV();
                setExportMenuOpen(false);
              }}
              className="w-full justify-start"
            >
              Export as CSV
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                onExportHTML();
                setExportMenuOpen(false);
              }}
              className="w-full justify-start"
            >
              Export as HTML
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default TableToolbar;
