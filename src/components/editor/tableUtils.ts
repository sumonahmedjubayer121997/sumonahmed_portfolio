
// Utility functions for table operations
export interface TableCell {
  content: string;
  isHeader: boolean;
  colspan: number;
  rowspan: number;
  alignment: 'left' | 'center' | 'right';
  backgroundColor: string;
}

export interface TableData {
  rows: TableCell[][];
  borderWidth: string;
  hasHeader: boolean;
}

export const createEmptyTable = (rows: number, cols: number, hasHeader: boolean = true): TableData => {
  const tableRows: TableCell[][] = [];
  
  for (let r = 0; r < rows; r++) {
    const row: TableCell[] = [];
    for (let c = 0; c < cols; c++) {
      row.push({
        content: r === 0 && hasHeader ? `Header ${c + 1}` : `Cell ${r + 1}-${c + 1}`,
        isHeader: r === 0 && hasHeader,
        colspan: 1,
        rowspan: 1,
        alignment: 'left',
        backgroundColor: 'transparent'
      });
    }
    tableRows.push(row);
  }
  
  return {
    rows: tableRows,
    borderWidth: '1px',
    hasHeader
  };
};

export const addRow = (tableData: TableData, position: number): TableData => {
  const newRow: TableCell[] = [];
  const colCount = tableData.rows[0]?.length || 0;
  
  for (let c = 0; c < colCount; c++) {
    newRow.push({
      content: `Cell ${position + 1}-${c + 1}`,
      isHeader: false,
      colspan: 1,
      rowspan: 1,
      alignment: 'left',
      backgroundColor: 'transparent'
    });
  }
  
  const newRows = [...tableData.rows];
  newRows.splice(position, 0, newRow);
  
  return { ...tableData, rows: newRows };
};

export const removeRow = (tableData: TableData, position: number): TableData => {
  if (tableData.rows.length <= 1) return tableData;
  
  const newRows = tableData.rows.filter((_, index) => index !== position);
  return { ...tableData, rows: newRows };
};

export const addColumn = (tableData: TableData, position: number): TableData => {
  const newRows = tableData.rows.map((row, rowIndex) => {
    const newRow = [...row];
    newRow.splice(position, 0, {
      content: rowIndex === 0 && tableData.hasHeader ? `Header ${position + 1}` : `Cell ${rowIndex + 1}-${position + 1}`,
      isHeader: rowIndex === 0 && tableData.hasHeader,
      colspan: 1,
      rowspan: 1,
      alignment: 'left',
      backgroundColor: 'transparent'
    });
    return newRow;
  });
  
  return { ...tableData, rows: newRows };
};

export const removeColumn = (tableData: TableData, position: number): TableData => {
  if (tableData.rows[0]?.length <= 1) return tableData;
  
  const newRows = tableData.rows.map(row => 
    row.filter((_, index) => index !== position)
  );
  
  return { ...tableData, rows: newRows };
};

export const setCellAlignment = (
  tableData: TableData, 
  rowIndex: number, 
  colIndex: number, 
  alignment: 'left' | 'center' | 'right'
): TableData => {
  const newRows = [...tableData.rows];
  if (newRows[rowIndex] && newRows[rowIndex][colIndex]) {
    newRows[rowIndex][colIndex] = {
      ...newRows[rowIndex][colIndex],
      alignment
    };
  }
  
  return { ...tableData, rows: newRows };
};

export const setCellBackgroundColor = (
  tableData: TableData,
  rowIndex: number,
  colIndex: number,
  backgroundColor: string
): TableData => {
  const newRows = [...tableData.rows];
  if (newRows[rowIndex] && newRows[rowIndex][colIndex]) {
    newRows[rowIndex][colIndex] = {
      ...newRows[rowIndex][colIndex],
      backgroundColor
    };
  }
  
  return { ...tableData, rows: newRows };
};

export const toggleHeaderRow = (tableData: TableData): TableData => {
  const newHasHeader = !tableData.hasHeader;
  const newRows = [...tableData.rows];
  
  if (newRows[0]) {
    newRows[0] = newRows[0].map(cell => ({
      ...cell,
      isHeader: newHasHeader,
      content: newHasHeader && !cell.isHeader ? 
        cell.content.replace(/^Cell \d+-/, 'Header ') : 
        cell.content
    }));
  }
  
  return { ...tableData, hasHeader: newHasHeader, rows: newRows };
};

export const tableToHTML = (tableData: TableData): string => {
  const { rows, borderWidth } = tableData;
  
  let html = `<table style="border-collapse: collapse; width: 100%; border: ${borderWidth} solid #ccc;">`;
  
  rows.forEach((row, rowIndex) => {
    html += '<tr>';
    row.forEach(cell => {
      const tag = cell.isHeader ? 'th' : 'td';
      const style = [
        `border: ${borderWidth} solid #ccc`,
        'padding: 8px',
        `text-align: ${cell.alignment}`,
        `background-color: ${cell.backgroundColor}`
      ].join('; ');
      
      const colspan = cell.colspan > 1 ? ` colspan="${cell.colspan}"` : '';
      const rowspan = cell.rowspan > 1 ? ` rowspan="${cell.rowspan}"` : '';
      
      html += `<${tag} style="${style}"${colspan}${rowspan}>${cell.content}</${tag}>`;
    });
    html += '</tr>';
  });
  
  html += '</table>';
  return html;
};

export const tableToCSV = (tableData: TableData): string => {
  return tableData.rows
    .map(row => 
      row.map(cell => `"${cell.content.replace(/"/g, '""')}"`)
         .join(',')
    )
    .join('\n');
};

export const downloadFile = (content: string, filename: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
