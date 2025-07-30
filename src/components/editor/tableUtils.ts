
export interface TableCell {
  content: string;
  colspan: number;
  rowspan: number;
  backgroundColor?: string;
  textAlign: 'left' | 'center' | 'right';
  isHeader: boolean;
}

export interface TableRow {
  cells: TableCell[];
}

export interface TableData {
  rows: TableRow[];
  borderWidth: number;
  borderColor: string;
  id: string;
}

// Generate unique table ID
export const generateTableId = (): string => {
  return `table_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Create a new table with specified dimensions
export const createTable = (rows: number, cols: number, hasHeader = true): TableData => {
  const tableRows: TableRow[] = [];
  
  for (let i = 0; i < rows; i++) {
    const cells: TableCell[] = [];
    for (let j = 0; j < cols; j++) {
      cells.push({
        content: i === 0 && hasHeader ? 'Header' : 'Cell',
        colspan: 1,
        rowspan: 1,
        textAlign: 'left',
        isHeader: i === 0 && hasHeader,
      });
    }
    tableRows.push({ cells });
  }
  
  return {
    rows: tableRows,
    borderWidth: 1,
    borderColor: '#cccccc',
    id: generateTableId(),
  };
};

// Convert table to HTML
export const tableToHTML = (table: TableData): string => {
  const { rows, borderWidth, borderColor } = table;
  
  let html = `<table id="${table.id}" style="border-collapse: collapse; width: 100%; border: ${borderWidth}px solid ${borderColor};">`;
  
  rows.forEach((row) => {
    html += '<tr>';
    row.cells.forEach((cell) => {
      const tag = cell.isHeader ? 'th' : 'td';
      const style = [
        `border: ${borderWidth}px solid ${borderColor}`,
        'padding: 8px',
        `text-align: ${cell.textAlign}`,
        cell.backgroundColor ? `background-color: ${cell.backgroundColor}` : '',
      ].filter(Boolean).join('; ');
      
      const attributes = [
        cell.colspan > 1 ? `colspan="${cell.colspan}"` : '',
        cell.rowspan > 1 ? `rowspan="${cell.rowspan}"` : '',
        `style="${style}"`,
      ].filter(Boolean).join(' ');
      
      html += `<${tag} ${attributes}>${cell.content}</${tag}>`;
    });
    html += '</tr>';
  });
  
  html += '</table><br>';
  return html;
};

// Parse HTML table back to TableData
export const parseHTMLTable = (html: string): TableData | null => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const table = doc.querySelector('table');
  
  if (!table) return null;
  
  const rows: TableRow[] = [];
  const tableRows = table.querySelectorAll('tr');
  
  tableRows.forEach((tr) => {
    const cells: TableCell[] = [];
    const tableCells = tr.querySelectorAll('td, th');
    
    tableCells.forEach((cell) => {
      cells.push({
        content: cell.textContent || '',
        colspan: parseInt(cell.getAttribute('colspan') || '1'),
        rowspan: parseInt(cell.getAttribute('rowspan') || '1'),
        backgroundColor: cell.style.backgroundColor || undefined,
        textAlign: (cell.style.textAlign as any) || 'left',
        isHeader: cell.tagName.toLowerCase() === 'th',
      });
    });
    
    rows.push({ cells });
  });
  
  return {
    rows,
    borderWidth: 1,
    borderColor: '#cccccc',
    id: table.id || generateTableId(),
  };
};

// Export table to CSV
export const exportTableToCSV = (table: TableData): string => {
  return table.rows.map(row => 
    row.cells.map(cell => `"${cell.content.replace(/"/g, '""')}"`).join(',')
  ).join('\n');
};

// Add row to table
export const addTableRow = (table: TableData, index: number): TableData => {
  const newRow: TableRow = {
    cells: table.rows[0]?.cells.map(() => ({
      content: 'Cell',
      colspan: 1,
      rowspan: 1,
      textAlign: 'left' as const,
      isHeader: false,
    })) || [],
  };
  
  const newRows = [...table.rows];
  newRows.splice(index + 1, 0, newRow);
  
  return { ...table, rows: newRows };
};

// Add column to table
export const addTableColumn = (table: TableData, index: number): TableData => {
  const newRows = table.rows.map(row => ({
    cells: [
      ...row.cells.slice(0, index + 1),
      {
        content: 'Cell',
        colspan: 1,
        rowspan: 1,
        textAlign: 'left' as const,
        isHeader: false,
      },
      ...row.cells.slice(index + 1),
    ],
  }));
  
  return { ...table, rows: newRows };
};

// Remove row from table
export const removeTableRow = (table: TableData, index: number): TableData => {
  if (table.rows.length <= 1) return table;
  
  const newRows = table.rows.filter((_, i) => i !== index);
  return { ...table, rows: newRows };
};

// Remove column from table
export const removeTableColumn = (table: TableData, index: number): TableData => {
  if (table.rows[0]?.cells.length <= 1) return table;
  
  const newRows = table.rows.map(row => ({
    cells: row.cells.filter((_, i) => i !== index),
  }));
  
  return { ...table, rows: newRows };
};
