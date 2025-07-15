import { useEffect, useState } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';

interface MarkdownPreviewProps {
  content: string;
  className?: string;
}

export const MarkdownPreview = ({ content, className = '' }: MarkdownPreviewProps) => {
  const [htmlContent, setHtmlContent] = useState('');

  useEffect(() => {
    const convertToHtml = async () => {
      // Configure marked with syntax highlighting
      marked.setOptions({
        breaks: true,
        gfm: true
      });

      try {
        const rawHtml = await marked(content);
        const cleanHtml = DOMPurify.sanitize(rawHtml);
        setHtmlContent(cleanHtml);
      } catch (error) {
        console.error('Markdown parsing error:', error);
        setHtmlContent('<p>Error parsing markdown</p>');
      }
    };

    convertToHtml();
  }, [content]);

  return (
    <div 
      className={`prose prose-sm max-w-none dark:prose-invert ${className}`}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
};