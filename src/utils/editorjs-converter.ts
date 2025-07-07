import { OutputData } from '@editorjs/editorjs';

/**
 * Convert HTML string to Editor.js JSON format
 */
export const htmlToEditorJS = (html: string): OutputData => {
  if (!html || html.trim() === '') {
    return {
      time: Date.now(),
      blocks: [],
      version: "2.30.8"
    };
  }

  const blocks: any[] = [];
  
  // Create a temporary DOM element to parse HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  
  const processNode = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent?.trim();
      if (text) {
        blocks.push({
          id: Math.random().toString(36).substr(2, 9),
          type: 'paragraph',
          data: {
            text: text
          }
        });
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as Element;
      const tagName = element.tagName.toLowerCase();
      
      switch (tagName) {
        case 'h1':
        case 'h2':
        case 'h3':
        case 'h4':
        case 'h5':
        case 'h6':
          blocks.push({
            id: Math.random().toString(36).substr(2, 9),
            type: 'header',
            data: {
              text: element.textContent || '',
              level: parseInt(tagName.charAt(1))
            }
          });
          break;
        case 'p':
          const pText = element.innerHTML || '';
          if (pText.trim()) {
            blocks.push({
              id: Math.random().toString(36).substr(2, 9),
              type: 'paragraph',
              data: {
                text: pText
              }
            });
          }
          break;
        case 'ul':
        case 'ol':
          const items: string[] = [];
          element.querySelectorAll('li').forEach(li => {
            items.push(li.textContent || '');
          });
          if (items.length > 0) {
            blocks.push({
              id: Math.random().toString(36).substr(2, 9),
              type: 'list',
              data: {
                style: tagName === 'ul' ? 'unordered' : 'ordered',
                items: items
              }
            });
          }
          break;
        default:
          // For other elements, process children
          Array.from(element.childNodes).forEach(processNode);
          break;
      }
    }
  };

  Array.from(tempDiv.childNodes).forEach(processNode);

  return {
    time: Date.now(),
    blocks: blocks,
    version: "2.30.8"
  };
};

/**
 * Convert Editor.js JSON to HTML string
 */
export const editorJSToHtml = (data: OutputData): string => {
  if (!data || !data.blocks || data.blocks.length === 0) {
    return '';
  }

  return data.blocks.map(block => {
    switch (block.type) {
      case 'paragraph':
        return `<p>${block.data.text || ''}</p>`;
      case 'header':
        const level = block.data.level || 2;
        return `<h${level}>${block.data.text || ''}</h${level}>`;
      case 'list':
        const tag = block.data.style === 'ordered' ? 'ol' : 'ul';
        const items = block.data.items?.map((item: string) => `<li>${item}</li>`).join('') || '';
        return `<${tag}>${items}</${tag}>`;
      default:
        return '';
    }
  }).join('\n');
};