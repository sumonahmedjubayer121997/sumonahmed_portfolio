
import React from 'react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import {
  Plus,
  Minus,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Merge,
  Split,
  Copy,
  Scissors,
  Trash2,
} from 'lucide-react';

interface TableContextMenuProps {
  children: React.ReactNode;
  onInsertRowAbove?: () => void;
  onInsertRowBelow?: () => void;
  onInsertColumnLeft?: () => void;
  onInsertColumnRight?: () => void;
  onDeleteRow?: () => void;
  onDeleteColumn?: () => void;
  onDeleteTable?: () => void;
  onMergeCells?: () => void;
  onSplitCells?: () => void;
  onAlignLeft?: () => void;
  onAlignCenter?: () => void;
  onAlignRight?: () => void;
  onCopyRow?: () => void;
  onCopyColumn?: () => void;
  onCutRow?: () => void;
  onCutColumn?: () => void;
  canMerge?: boolean;
  canSplit?: boolean;
}

const TableContextMenu: React.FC<TableContextMenuProps> = ({
  children,
  onInsertRowAbove,
  onInsertRowBelow,
  onInsertColumnLeft,
  onInsertColumnRight,
  onDeleteRow,
  onDeleteColumn,
  onDeleteTable,
  onMergeCells,
  onSplitCells,
  onAlignLeft,
  onAlignCenter,
  onAlignRight,
  onCopyRow,
  onCopyColumn,
  onCutRow,
  onCutColumn,
  canMerge = true,
  canSplit = false,
}) => {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent className="w-56">
        {/* Insert Operations */}
        <ContextMenuSub>
          <ContextMenuSubTrigger className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Insert
          </ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-48">
            <ContextMenuItem onClick={onInsertRowAbove} className="flex items-center gap-2">
              <Plus className="h-3 w-3" />
              Row Above
            </ContextMenuItem>
            <ContextMenuItem onClick={onInsertRowBelow} className="flex items-center gap-2">
              <Plus className="h-3 w-3" />
              Row Below
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem onClick={onInsertColumnLeft} className="flex items-center gap-2">
              <Plus className="h-3 w-3" />
              Column Left
            </ContextMenuItem>
            <ContextMenuItem onClick={onInsertColumnRight} className="flex items-center gap-2">
              <Plus className="h-3 w-3" />
              Column Right
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>

        {/* Delete Operations */}
        <ContextMenuSub>
          <ContextMenuSubTrigger className="flex items-center gap-2">
            <Minus className="h-4 w-4" />
            Delete
          </ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-48">
            <ContextMenuItem onClick={onDeleteRow} className="flex items-center gap-2">
              <Minus className="h-3 w-3" />
              Delete Row
            </ContextMenuItem>
            <ContextMenuItem onClick={onDeleteColumn} className="flex items-center gap-2">
              <Minus className="h-3 w-3" />
              Delete Column
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem onClick={onDeleteTable} className="flex items-center gap-2 text-destructive">
              <Trash2 className="h-3 w-3" />
              Delete Table
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>

        <ContextMenuSeparator />

        {/* Cell Operations */}
        <ContextMenuSub>
          <ContextMenuSubTrigger className="flex items-center gap-2">
            <Merge className="h-4 w-4" />
            Cells
          </ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-48">
            {canMerge && (
              <ContextMenuItem onClick={onMergeCells} className="flex items-center gap-2">
                <Merge className="h-3 w-3" />
                Merge Cells
              </ContextMenuItem>
            )}
            {canSplit && (
              <ContextMenuItem onClick={onSplitCells} className="flex items-center gap-2">
                <Split className="h-3 w-3" />
                Split Cells
              </ContextMenuItem>
            )}
          </ContextMenuSubContent>
        </ContextMenuSub>

        {/* Alignment */}
        <ContextMenuSub>
          <ContextMenuSubTrigger className="flex items-center gap-2">
            <AlignCenter className="h-4 w-4" />
            Align
          </ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-48">
            <ContextMenuItem onClick={onAlignLeft} className="flex items-center gap-2">
              <AlignLeft className="h-3 w-3" />
              Left
            </ContextMenuItem>
            <ContextMenuItem onClick={onAlignCenter} className="flex items-center gap-2">
              <AlignCenter className="h-3 w-3" />
              Center
            </ContextMenuItem>
            <ContextMenuItem onClick={onAlignRight} className="flex items-center gap-2">
              <AlignRight className="h-3 w-3" />
              Right
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>

        <ContextMenuSeparator />

        {/* Copy/Cut Operations */}
        <ContextMenuItem onClick={onCopyRow} className="flex items-center gap-2">
          <Copy className="h-4 w-4" />
          Copy Row
        </ContextMenuItem>
        <ContextMenuItem onClick={onCopyColumn} className="flex items-center gap-2">
          <Copy className="h-4 w-4" />
          Copy Column
        </ContextMenuItem>
        <ContextMenuItem onClick={onCutRow} className="flex items-center gap-2">
          <Scissors className="h-4 w-4" />
          Cut Row
        </ContextMenuItem>
        <ContextMenuItem onClick={onCutColumn} className="flex items-center gap-2">
          <Scissors className="h-4 w-4" />
          Cut Column
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default TableContextMenu;
