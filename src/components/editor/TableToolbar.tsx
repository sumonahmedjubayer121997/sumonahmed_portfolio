
import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Table, 
  Plus, 
  Minus, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  Palette,
  Download,
  Copy,
  Scissors,
  RotateCcw,
  Grid3x3
} from 'lucide-react';

interface TableToolbarProps {
  onInsertTable: () => void;
  onAddRow: () => void;
  onRemoveRow: () => void;
  onAddColumn: () => void;
  onRemoveColumn: () => void;
  onAlignCells: (alignment: 'left' | 'center' | 'right') => void;
  onToggleHeader: () => void;
  onSetBorderWidth: (width: string) => void;
  onSetCellColor: (color: string) => void;
  onMergeCells: () => void;
  onSplitCell: () => void;
  onCopyRow: () => void;
  onCopyColumn: () => void;
  onExportTable: (format: 'csv' | 'html') => void;
  isTableSelected: boolean;
}

const TableToolbar: React.FC<TableToolbarProps> = ({
  onInsertTable,
  onAddRow,
  onRemoveRow,
  onAddColumn,
  onRemoveColumn,
  onAlignCells,
  onToggleHeader,
  onSetBorderWidth,
  onSetCellColor,
  onMergeCells,
  onSplitCell,
  onCopyRow,
  onCopyColumn,
  onExportTable,
  isTableSelected
}) => {
  const cellColors = [
    { name: 'None', value: 'transparent' },
    { name: 'Light Gray', value: '#f8f9fa' },
    { name: 'Light Blue', value: '#e3f2fd' },
    { name: 'Light Green', value: '#e8f5e8' },
    { name: 'Light Yellow', value: '#fff9c4' },
    { name: 'Light Red', value: '#ffebee' }
  ];

  const borderWidths = [
    { name: 'None', value: '0' },
    { name: 'Thin', value: '1px' },
    { name: 'Medium', value: '2px' },
    { name: 'Thick', value: '3px' }
  ];

  return (
    <div className="flex flex-wrap items-center gap-2 p-2 border-b bg-muted/30">
      {/* Insert Table */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={onInsertTable}
            className="h-8 w-8 p-0"
          >
            <Table className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Insert Table</TooltipContent>
      </Tooltip>

      <Separator orientation="vertical" className="h-6" />

      {/* Row Operations */}
      <div className="flex items-center gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={onAddRow}
              disabled={!isTableSelected}
              className="h-8 w-8 p-0"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Add Row</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={onRemoveRow}
              disabled={!isTableSelected}
              className="h-8 w-8 p-0"
            >
              <Minus className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Remove Row</TooltipContent>
        </Tooltip>
      </div>

      {/* Column Operations */}
      <div className="flex items-center gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={onAddColumn}
              disabled={!isTableSelected}
              className="h-8 w-8 p-0"
            >
              <Plus className="h-4 w-4 rotate-90" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Add Column</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={onRemoveColumn}
              disabled={!isTableSelected}
              className="h-8 w-8 p-0"
            >
              <Minus className="h-4 w-4 rotate-90" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Remove Column</TooltipContent>
        </Tooltip>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Cell Alignment */}
      <div className="flex items-center gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onAlignCells('left')}
              disabled={!isTableSelected}
              className="h-8 w-8 p-0"
            >
              <AlignLeft className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Align Left</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onAlignCells('center')}
              disabled={!isTableSelected}
              className="h-8 w-8 p-0"
            >
              <AlignCenter className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Align Center</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onAlignCells('right')}
              disabled={!isTableSelected}
              className="h-8 w-8 p-0"
            >
              <AlignRight className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Align Right</TooltipContent>
        </Tooltip>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Cell Merge/Split */}
      <div className="flex items-center gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={onMergeCells}
              disabled={!isTableSelected}
              className="h-8 w-8 p-0"
            >
              <Grid3x3 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Merge Cells</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={onSplitCell}
              disabled={!isTableSelected}
              className="h-8 w-8 p-0"
            >
              <Scissors className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Split Cell</TooltipContent>
        </Tooltip>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Styling Options */}
      <Select onValueChange={onSetBorderWidth}>
        <SelectTrigger className="h-8 w-20 text-xs">
          <SelectValue placeholder="Border" />
        </SelectTrigger>
        <SelectContent>
          {borderWidths.map((width) => (
            <SelectItem key={width.value} value={width.value}>
              {width.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select onValueChange={onSetCellColor}>
        <SelectTrigger className="h-8 w-20 text-xs">
          <SelectValue placeholder="Color" />
        </SelectTrigger>
        <SelectContent>
          {cellColors.map((color) => (
            <SelectItem key={color.value} value={color.value}>
              <div className="flex items-center gap-2">
                <div 
                  className="w-4 h-4 rounded border"
                  style={{ backgroundColor: color.value }}
                />
                {color.name}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Separator orientation="vertical" className="h-6" />

      {/* Copy Operations */}
      <div className="flex items-center gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={onCopyRow}
              disabled={!isTableSelected}
              className="h-8 w-8 p-0"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Copy Row</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={onCopyColumn}
              disabled={!isTableSelected}
              className="h-8 w-8 p-0"
            >
              <Copy className="h-4 w-4 rotate-90" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Copy Column</TooltipContent>
        </Tooltip>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Export Options */}
      <Select onValueChange={onExportTable}>
        <SelectTrigger className="h-8 w-20 text-xs">
          <SelectValue placeholder="Export" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="csv">CSV</SelectItem>
          <SelectItem value="html">HTML</SelectItem>
        </SelectContent>
      </Select>

      {/* Header Toggle */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleHeader}
            disabled={!isTableSelected}
            className="h-8 px-2 text-xs"
          >
            Header
          </Button>
        </TooltipTrigger>
        <TooltipContent>Toggle Header Row</TooltipContent>
      </Tooltip>
    </div>
  );
};

export default TableToolbar;
