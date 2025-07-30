
import React from 'react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { 
  Plus, 
  Minus, 
  Grid3x3, 
  Scissors, 
  Copy, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  Palette
} from 'lucide-react';

interface TableContextMenuProps {
  children: React.ReactNode;
  onAddRowAbove: () => void;
  onAddRowBelow: () => void;
  onRemoveRow: () => void;
  onAddColumnLeft: () => void;
  onAddColumnRight: () => void;
  onRemoveColumn: () => void;
  onMergeCells: () => void;
  onSplitCell: () => void;
  onCopyRow: () => void;
  onCopyColumn: () => void;
  onAlignLeft: () => void;
  onAlignCenter: () => void;
  onAlignRight: () => void;
  onSetCellColor: () => void;
}

const TableContextMenu: React.FC<TableContextMenuProps> = ({
  children,
  onAddRowAbove,
  onAddRowBelow,
  onRemoveRow,
  onAddColumnLeft,
  onAddColumnRight,
  onRemoveColumn,
  onMergeCells,
  onSplitCell,
  onCopyRow,
  onCopyColumn,
  onAlignLeft,
  onAlignCenter,
  onAlignRight,
  onSetCellColor
}) => {
  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-56">
        {/* Row Operations */}
        <ContextMenuItem onClick={onAddRowAbove}>
          <Plus className="mr-2 h-4 w-4" />
          Insert Row Above
        </ContextMenuItem>
        <ContextMenuItem onClick={onAddRowBelow}>
          <Plus className="mr-2 h-4 w-4" />
          Insert Row Below
        </ContextMenuItem>
        <ContextMenuItem onClick={onRemoveRow}>
          <Minus className="mr-2 h-4 w-4" />
          Delete Row
        </ContextMenuItem>
        
        <ContextMenuSeparator />
        
        {/* Column Operations */}
        <ContextMenuItem onClick={onAddColumnLeft}>
          <Plus className="mr-2 h-4 w-4 rotate-90" />
          Insert Column Left
        </ContextMenuItem>
        <ContextMenuItem onClick={onAddColumnRight}>
          <Plus className="mr-2 h-4 w-4 rotate-90" />
          Insert Column Right
        </ContextMenuItem>
        <ContextMenuItem onClick={onRemoveColumn}>
          <Minus className="mr-2 h-4 w-4 rotate-90" />
          Delete Column
        </ContextMenuItem>
        
        <ContextMenuSeparator />
        
        {/* Cell Operations */}
        <ContextMenuItem onClick={onMergeCells}>
          <Grid3x3 className="mr-2 h-4 w-4" />
          Merge Cells
        </ContextMenuItem>
        <ContextMenuItem onClick={onSplitCell}>
          <Scissors className="mr-2 h-4 w-4" />
          Split Cell
        </ContextMenuItem>
        
        <ContextMenuSeparator />
        
        {/* Alignment */}
        <ContextMenuItem onClick={onAlignLeft}>
          <AlignLeft className="mr-2 h-4 w-4" />
          Align Left
        </ContextMenuItem>
        <ContextMenuItem onClick={onAlignCenter}>
          <AlignCenter className="mr-2 h-4 w-4" />
          Align Center
        </ContextMenuItem>
        <ContextMenuItem onClick={onAlignRight}>
          <AlignRight className="mr-2 h-4 w-4" />
          Align Right
        </ContextMenuItem>
        
        <ContextMenuSeparator />
        
        {/* Copy Operations */}
        <ContextMenuItem onClick={onCopyRow}>
          <Copy className="mr-2 h-4 w-4" />
          Copy Row
        </ContextMenuItem>
        <ContextMenuItem onClick={onCopyColumn}>
          <Copy className="mr-2 h-4 w-4 rotate-90" />
          Copy Column
        </ContextMenuItem>
        
        <ContextMenuSeparator />
        
        {/* Styling */}
        <ContextMenuItem onClick={onSetCellColor}>
          <Palette className="mr-2 h-4 w-4" />
          Cell Color
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default TableContextMenu;
