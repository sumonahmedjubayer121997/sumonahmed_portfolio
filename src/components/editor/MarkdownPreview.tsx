import React, { useEffect, useState } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';

interface MarkdownPreviewProps {
  content: string;
  className?: string;
}

const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({ 
  content, 
  className = '' 
}) => {
  const [htmlContent, setHtmlContent] = useState('');

  useEffect(() => {
    const processContent = async () => {
    // Configure marked options
    marked.setOptions({
      breaks: true,
      gfm: true,
    });

    // Convert HTML to Markdown-like content for preview
    const htmlToMarkdown = (html: string): string => {
      return html
        // Headers
        .replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n')
        .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n')
        .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n')
        .replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1\n\n')
        .replace(/<h5[^>]*>(.*?)<\/h5>/gi, '##### $1\n\n')
        .replace(/<h6[^>]*>(.*?)<\/h6>/gi, '###### $1\n\n')
        
        // Text formatting
        .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
        .replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**')
        .replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*')
        .replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*')
        .replace(/<u[^>]*>(.*?)<\/u>/gi, '_$1_')
        .replace(/<s[^>]*>(.*?)<\/s>/gi, '~~$1~~')
        
        // Links
        .replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)')
        
        // Images
        .replace(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*>/gi, '![$2]($1)')
        .replace(/<img[^>]*src="([^"]*)"[^>]*>/gi, '![]($1)')
        
        // Lists
        .replace(/<ul[^>]*>/gi, '')
        .replace(/<\/ul>/gi, '\n')
        .replace(/<ol[^>]*>/gi, '')
        .replace(/<\/ol>/gi, '\n')
        .replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n')
        
        // Blockquotes
        .replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gi, '> $1\n\n')
        
        // Code blocks
        .replace(/<pre[^>]*><code[^>]*>(.*?)<\/code><\/pre>/gi, '```\n$1\n```\n\n')
        .replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`')
        
        // Paragraphs
        .replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n')
        
        // Line breaks
        .replace(/<br[^>]*>/gi, '\n')
        
        // Remove any remaining HTML tags
        .replace(/<[^>]*>/g, '')
        
        // Clean up extra whitespace
        .replace(/\n{3,}/g, '\n\n')
        .trim();
    };

    try {
      const markdown = htmlToMarkdown(content);
      const parsed = await marked.parse(markdown);
      const sanitized = DOMPurify.sanitize(parsed);
      setHtmlContent(sanitized);
    } catch (error) {
      console.error('Markdown parsing error:', error);
      setHtmlContent('<p class="text-red-500">Error parsing content for preview</p>');
    }
    };
    
    processContent();
  }, [content]);

  return (
    <div 
      className={`prose prose-sm max-w-none dark:prose-invert ${className}`}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
};

export default MarkdownPreview;