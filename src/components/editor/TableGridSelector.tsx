
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Table } from 'lucide-react';

interface TableGridSelectorProps {
  onSelectGrid: (rows: number, cols: number) => void;
}

const TableGridSelector: React.FC<TableGridSelectorProps> = ({ onSelectGrid }) => {
  const [hoveredCell, setHoveredCell] = useState<{ row: number; col: number } | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const maxRows = 8;
  const maxCols = 8;

  const handleCellHover = (row: number, col: number) => {
    setHoveredCell({ row, col });
  };

  const handleCellClick = (row: number, col: number) => {
    onSelectGrid(row + 1, col + 1);
    setIsOpen(false);
    setHoveredCell(null);
  };

  const getCellStyle = (row: number, col: number) => {
    const isHighlighted = hoveredCell && row <= hoveredCell.row && col <= hoveredCell.col;
    return `w-4 h-4 border border-border cursor-pointer transition-colors ${
      isHighlighted ? 'bg-primary' : 'bg-background hover:bg-muted'
    }`;
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 px-2">
          <Table className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2" align="start">
        <div className="space-y-2">
          <div className="text-sm font-medium">Insert Table</div>
          <div 
            className="grid gap-0.5" 
            style={{ gridTemplateColumns: `repeat(${maxCols}, 1fr)` }}
            onMouseLeave={() => setHoveredCell(null)}
          >
            {Array.from({ length: maxRows * maxCols }, (_, index) => {
              const row = Math.floor(index / maxCols);
              const col = index % maxCols;
              return (
                <div
                  key={index}
                  className={getCellStyle(row, col)}
                  onMouseEnter={() => handleCellHover(row, col)}
                  onClick={() => handleCellClick(row, col)}
                />
              );
            })}
          </div>
          {hoveredCell && (
            <div className="text-xs text-muted-foreground text-center">
              {hoveredCell.row + 1} × {hoveredCell.col + 1} table
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default TableGridSelector;
