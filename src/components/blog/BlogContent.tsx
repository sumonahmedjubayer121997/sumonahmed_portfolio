import { Button } from "@/components/ui/button";
import { Copy, Download, Check } from "lucide-react";
import DOMPurify from "dompurify";
import { useState } from "react";

interface CodeSnippet {
  language: string;
  code: string;
  version?: string;
}

interface Resource {
  title: string;
  type: string;
  url: string;
}

interface ExtraSection {
  title: string;
  body: string;
}

interface BlogContentProps {
  content: string;
  codeSnippets?: CodeSnippet[];
  resources?: Resource[];
  extraSections?: ExtraSection[];
  onCopyCode: (code: string) => void;
  tableOfContents?: Array<{
    id: string;
    title: string;
    level: number;
  }>;
}

function decodeHTML(encoded: string) {
  const txt = document.createElement("textarea");
  txt.innerHTML = encoded;
  return txt.value;
}

const BlogContent = ({
  content,
  codeSnippets,
  resources,
  extraSections,
  onCopyCode,
  tableOfContents = []
}: BlogContentProps) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopyCode = async (code: string, index: number) => {
    await onCopyCode(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Function to add IDs to headings in the content
  const addIdsToHeadings = (htmlContent: string) => {
    return htmlContent.replace(/<h([1-3])([^>]*)>(.*?)<\/h\1>/gi, (match, level, attributes, text) => {
      // Extract clean text for ID generation
      const cleanText = text.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
      
      // Find matching TOC item
      const tocItem = tableOfContents.find(item => 
        item.title === cleanText && item.level === parseInt(level)
      );
      
      if (tocItem) {
        // Check if ID already exists in attributes
        if (!attributes.includes('id=')) {
          return `<h${level}${attributes} id="${tocItem.id}">${text}</h${level}>`;
        }
      }
      
      return match; // Return original if no TOC match or ID already exists
    });
  };

  const processedContent = addIdsToHeadings(content || "No content available");

  return (
    <article className="prose prose-lg max-w-none dark:prose-invert px-4 sm:px-0">
      <style>
        {`
          .blog-content {
            width: 100%;
            max-width: 100%;
            overflow-wrap: break-word;
            word-wrap: break-word;
            hyphens: auto;
          }
          .blog-content * {
            max-width: 100%;
          }
          .blog-content h1 {
            font-size: 1.5rem;
            font-weight: 700;
            color: hsl(var(--foreground));
            margin: 1rem 0 0.75rem 0;
            line-height: 1.3;
            word-wrap: break-word;
            overflow-wrap: break-word;
          }
          .blog-content h2 {
            font-size: 1.25rem;
            font-weight: 600;
            color: hsl(var(--foreground));
            margin: 1.5rem 0 0.75rem 0;
            padding-bottom: 0.5rem;
            border-bottom: 2px solid hsl(var(--border));
            word-wrap: break-word;
            overflow-wrap: break-word;
          }
          .blog-content h3 {
            font-size: 1.125rem;
            font-weight: 600;
            color: hsl(var(--foreground));
            margin: 1.25rem 0 0.75rem 0;
            word-wrap: break-word;
            overflow-wrap: break-word;
          }
          .blog-content p {
            margin-bottom: 1rem;
            line-height: 1.7;
            color: hsl(var(--foreground));
            word-wrap: break-word;
            overflow-wrap: break-word;
            hyphens: auto;
            text-align: justify;
          }
          .blog-content .lead {
            font-size: 0.875rem;
            font-weight: 400;
            color: hsl(var(--muted-foreground));
            margin-bottom: 1.25rem;
            padding: 0.75rem;
            background-color: hsl(var(--muted));
            border-left: 4px solid hsl(var(--primary));
            border-radius: 0.5rem;
            word-wrap: break-word;
            overflow-wrap: break-word;
          }
          .blog-content ul, .blog-content ol {
            margin-bottom: 1rem;
            padding-left: 1rem;
            word-wrap: break-word;
            overflow-wrap: break-word;
          }
          .blog-content li {
            margin-bottom: 0.5rem;
            line-height: 1.6;
            word-wrap: break-word;
            overflow-wrap: break-word;
            hyphens: auto;
          }
          .blog-content strong {
            font-weight: 600;
            color: hsl(var(--foreground));
          }
          .blog-content hr {
            margin: 1.5rem 0;
            border: none;
            border-top: 1px solid hsl(var(--border));
          }
          .blog-content img {
            max-width: 100%;
            height: auto;
            border-radius: 0.5rem;
            margin: 1rem 0;
            display: block;
          }
          .blog-content blockquote {
            border-left: 4px solid hsl(var(--primary));
            margin: 1.25rem 0;
            padding-left: 0.75rem;
            font-style: italic;
            color: hsl(var(--muted-foreground));
            word-wrap: break-word;
            overflow-wrap: break-word;
          }
          .blog-content code {
            background-color: hsl(var(--muted));
            padding: 0.125rem 0.25rem;
            border-radius: 0.25rem;
            font-size: 0.8rem;
            font-family: 'Courier New', Courier, monospace;
            word-break: break-all;
            overflow-wrap: break-word;
            white-space: pre-wrap;
          }
          .blog-content pre {
            background-color: hsl(var(--muted));
            padding: 0.75rem;
            border-radius: 0.5rem;
            overflow-x: auto;
            margin: 1rem 0;
            max-width: 100%;
          }
          .blog-content pre code {
            background: none;
            padding: 0;
            word-break: normal;
            white-space: pre;
            overflow-wrap: normal;
          }
          .blog-content table {
            width: 100%;
            overflow-x: auto;
            display: block;
            white-space: nowrap;
          }
          .blog-content table thead,
          .blog-content table tbody,
          .blog-content table tr {
            display: table;
            width: 100%;
            table-layout: fixed;
          }
          
          @media (min-width: 640px) {
            .blog-content h1 {
              font-size: 1.875rem;
              margin: 1.5rem 0 1rem 0;
            }
            .blog-content h2 {
              font-size: 1.5rem;
              margin: 2rem 0 1rem 0;
            }
            .blog-content h3 {
              font-size: 1.25rem;
              margin: 1.5rem 0 1rem 0;
            }
            .blog-content p {
              margin-bottom: 1.25rem;
            }
            .blog-content .lead {
              font-size: 1rem;
              padding: 1rem;
              margin-bottom: 1.5rem;
            }
            .blog-content ul, .blog-content ol {
              margin-bottom: 1.25rem;
              padding-left: 1.25rem;
            }
            .blog-content code {
              font-size: 0.875rem;
            }
            .blog-content pre {
              padding: 1rem;
            }
          }
        `}
      </style>

      {/* Main Content */}
      <div
        className="blog-content"
        dangerouslySetInnerHTML={{
          __html: (() => {
            const encodedHtml = processedContent;
            const decodedHtml = decodeHTML(encodedHtml);
            return DOMPurify.sanitize(decodedHtml);
          })(),
        }}
      />

      {/* Code Snippets */}
      {codeSnippets && codeSnippets.map((codeBlock, index) => (
        <div key={index} className="my-4 sm:my-6 not-prose w-full max-w-full">
          {/* Code Header */}
          <div className="bg-slate-800 rounded-t-lg px-3 sm:px-4 py-2 flex items-center justify-between min-w-0">
            <div className="flex items-center gap-2 text-gray-300 text-xs sm:text-sm min-w-0 flex-1">
              <span className="truncate">{codeBlock.language}</span>
              {codeBlock.version && (
                <span className="text-gray-500 hidden sm:inline">({codeBlock.version})</span>
              )}
            </div>
            <Button
              onClick={() => handleCopyCode(codeBlock.code, index)}
              variant="ghost"
              size="sm"
              className="text-gray-300 hover:text-white h-7 w-7 sm:h-8 sm:w-8 p-0 flex-shrink-0 ml-2"
            >
              {copiedIndex === index ? (
                <Check className="w-3 h-3 sm:w-4 sm:h-4" />
              ) : (
                <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
              )}
            </Button>
          </div>
          
          {/* Code Content */}
          <div className="bg-slate-900 rounded-b-lg overflow-hidden max-w-full">
            <div className="overflow-x-auto">
              <pre className="text-gray-100 p-3 sm:p-4 text-xs sm:text-sm leading-relaxed min-w-0">
                <code className="whitespace-pre block">
                  {codeBlock.code}
                </code>
              </pre>
            </div>
          </div>
        </div>
      ))}

      {/* Extra Sections */}
      {extraSections && extraSections.map((section, index) => (
        <div key={index} className="my-4 sm:my-6 p-3 sm:p-6 bg-muted rounded-lg not-prose max-w-full">
          <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2 sm:mb-4 word-wrap break-words">
            {section.title}
          </h3>
          <div 
            className="blog-content prose prose-sm sm:prose-base dark:prose-invert max-w-none" 
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(section.body) }} 
          />
        </div>
      ))}

      {/* Downloadable Resources */}
      {resources && resources.length > 0 && (
        <div className="my-4 sm:my-6 p-3 sm:p-6 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800 not-prose max-w-full">
          <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2 sm:mb-4">
            Downloadable Resources
          </h3>
          <div className="space-y-2">
            {resources.map((resource, index) => (
              <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-background rounded border gap-2 sm:gap-4 min-w-0">
                <div className="min-w-0 flex-1">
                  <span className="font-medium text-foreground block truncate">{resource.title}</span>
                  <span className="text-xs sm:text-sm text-muted-foreground">({resource.type})</span>
                </div>
                <Button variant="outline" size="sm" asChild className="w-full sm:w-auto flex-shrink-0">
                  <a href={resource.url} download target="_blank" rel="noopener noreferrer">
                    <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                    Download
                  </a>
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </article>
  );
};

export default BlogContent;
