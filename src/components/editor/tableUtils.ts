export const insertTable = (quill: any, rows: number, cols: number) => {
  const tableModule = quill.getModule('table');
  tableModule.insertTable(rows, cols);
};

export const addRow = (quill: any) => {
  const tableModule = quill.getModule('table');
  tableModule.insertRow();
};

export const addColumn = (quill: any) => {
  const tableModule = quill.getModule('table');
  tableModule.insertColumn();
};

export const deleteRow = (quill: any) => {
  const tableModule = quill.getModule('table');
  tableModule.deleteRow();
};

export const deleteColumn = (quill: any) => {
  const tableModule = quill.getModule('table');
  tableModule.deleteColumn();
};

export const deleteTable = (quill: any) => {
    const tableModule = quill.getModule('table');
    tableModule.deleteTable();
};

export const mergeCells = (quill: any) => {
    const tableModule = quill.getModule('table');
    tableModule.mergeCells();
};

export const unmergeCells = (quill: any) => {
    const tableModule = quill.getModule('table');
    tableModule.unmergeCells();
};

export const getTable = (quill: any) => {
    const tableModule = quill.getModule('table');
    return tableModule.getTable();
};

export const getCells = (quill: any) => {
    const tableModule = quill.getModule('table');
    return tableModule.getCells();
};

export const setTableHeader = (quill: any) => {
    const tableModule = quill.getModule('table');
    tableModule.setTableHeader();
};

export const setTableBody = (quill: any) => {
    const tableModule = quill.getModule('table');
    tableModule.setTableBody();
};

export const toggleTableHeader = (quill: any) => {
    const tableModule = quill.getModule('table');
    tableModule.toggleTableHeader();
};

export const getTableHTML = (quill: any) => {
    const tableModule = quill.getModule('table');
    return tableModule.getTableHTML();
};

export const getTableCSV = (quill: any) => {
    const tableModule = quill.getModule('table');
    return tableModule.getTableCSV();
};

export const exportTableToCSV = (tableElement: Element): string => {
  const rows = tableElement.querySelectorAll('tr');
  const csvRows: string[] = [];

  rows.forEach(row => {
    const cells = row.querySelectorAll('td, th');
    const csvCells: string[] = [];
    
    cells.forEach(cell => {
      const text = cell.textContent || '';
      // Escape quotes and wrap in quotes if necessary
      const escapedText = text.includes(',') || text.includes('"') || text.includes('\n') 
        ? `"${text.replace(/"/g, '""')}"` 
        : text;
      csvCells.push(escapedText);
    });
    
    csvRows.push(csvCells.join(','));
  });

  return csvRows.join('\n');
};

export const exportTableToHTML = (tableElement: Element): string => {
  const rows = tableElement.querySelectorAll('tr');
  let html = '<table border="1" style="border-collapse: collapse;">\n';

  rows.forEach(row => {
    html += '  <tr>\n';
    const cells = row.querySelectorAll('td, th');
    
    cells.forEach(cell => {
      const tagName = cell.tagName.toLowerCase();
      const htmlElement = cell as HTMLElement;
      const styleAttr = htmlElement.style ? ` style="${htmlElement.style.cssText}"` : '';
      const cellContent = cell.innerHTML || '';
      html += `    <${tagName}${styleAttr}>${cellContent}</${tagName}>\n`;
    });
    
    html += '  </tr>\n';
  });

  html += '</table>';
  return html;
};

export const tableToMarkdown = (tableElement: Element): string => {
    let markdown = '';
    const rows = tableElement.querySelectorAll('tr');

    rows.forEach((row, rowIndex) => {
        const cells = Array.from(row.querySelectorAll('th, td'));
        const cellTexts = cells.map(cell => cell.textContent?.trim() || '');

        markdown += '| ' + cellTexts.join(' | ') + ' |\n';

        if (rowIndex === 0) {
            // Add separator after the header row
            const separator = '| ' + Array(cells.length).fill('---').join(' | ') + ' |\n';
            markdown += separator;
        }
    });

    return markdown;
};
