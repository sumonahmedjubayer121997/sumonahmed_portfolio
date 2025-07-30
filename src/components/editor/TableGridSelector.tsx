
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
  const maxCols = 10;

  const handleCellHover = (row: number, col: number) => {
    setHoveredCell({ row, col });
  };

  const handleCellClick = (row: number, col: number) => {
    onSelectGrid(row + 1, col + 1);
    setIsOpen(false);
    setHoveredCell(null);
  };

  const renderGrid = () => {
    const cells = [];
    
    for (let row = 0; row < maxRows; row++) {
      for (let col = 0; col < maxCols; col++) {
        const isHighlighted = hoveredCell && row <= hoveredCell.row && col <= hoveredCell.col;
        
        cells.push(
          <div
            key={`${row}-${col}`}
            className={`w-4 h-4 border border-border cursor-pointer transition-colors ${
              isHighlighted ? 'bg-primary' : 'bg-background hover:bg-muted'
            }`}
            onMouseEnter={() => handleCellHover(row, col)}
            onClick={() => handleCellClick(row, col)}
          />
        );
      }
    }
    
    return cells;
  };

  const getGridDescription = () => {
    if (!hoveredCell) return 'Select table size';
    return `${hoveredCell.row + 1} x ${hoveredCell.col + 1} table`;
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Table className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-3" align="start">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground text-center">
            {getGridDescription()}
          </p>
          <div
            className="grid gap-1"
            style={{ gridTemplateColumns: `repeat(${maxCols}, 1fr)` }}
            onMouseLeave={() => setHoveredCell(null)}
          >
            {renderGrid()}
          </div>
          <div className="text-xs text-muted-foreground text-center">
            Click to insert table
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default TableGridSelector;
