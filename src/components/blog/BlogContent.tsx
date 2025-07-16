
import { Button } from "@/components/ui/button";
import { Copy, Download } from "lucide-react";
import DOMPurify from "dompurify";

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
  onCopyCode
}: BlogContentProps) => {
  return (
    <article className="prose prose-lg max-w-none dark:prose-invert">
      <style>
        {`
          .blog-content h1 {
            font-size: 2rem;
            font-weight: 700;
            color: hsl(var(--foreground));
            margin: 2rem 0 1rem 0;
            line-height: 1.2;
          }
          .blog-content h2 {
            font-size: 1.75rem;
            font-weight: 600;
            color: hsl(var(--foreground));
            margin: 2.5rem 0 1rem 0;
            padding-bottom: 0.5rem;
            border-bottom: 2px solid hsl(var(--border));
          }
          .blog-content h3 {
            font-size: 1.5rem;
            font-weight: 600;
            color: hsl(var(--foreground));
            margin: 2rem 0 1rem 0;
          }
          .blog-content p {
            margin-bottom: 1.5rem;
            line-height: 1.7;
            color: hsl(var(--foreground));
          }
          .blog-content .lead {
            font-size: 1.125rem;
            font-weight: 400;
            color: hsl(var(--muted-foreground));
            margin-bottom: 2rem;
            padding: 1.5rem;
            background-color: hsl(var(--muted));
            border-left: 4px solid hsl(var(--primary));
            border-radius: 0.5rem;
          }
          .blog-content ul, .blog-content ol {
            margin-bottom: 1.5rem;
            padding-left: 1.5rem;
          }
          .blog-content li {
            margin-bottom: 0.5rem;
            line-height: 1.6;
          }
          .blog-content strong {
            font-weight: 600;
            color: hsl(var(--foreground));
          }
          .blog-content hr {
            margin: 3rem 0;
            border: none;
            border-top: 1px solid hsl(var(--border));
          }
          .blog-content img {
            max-width: 100%;
            height: auto;
            border-radius: 0.5rem;
            margin: 1.5rem 0;
          }
          .blog-content blockquote {
            border-left: 4px solid hsl(var(--primary));
            margin: 2rem 0;
            padding-left: 1.5rem;
            font-style: italic;
            color: hsl(var(--muted-foreground));
          }
          .blog-content code {
            background-color: hsl(var(--muted));
            padding: 0.2rem 0.4rem;
            border-radius: 0.25rem;
            font-size: 0.875rem;
          }
        `}
      </style>

      {/* Main Content */}
      <div
        className="blog-content"
        dangerouslySetInnerHTML={{
          __html: (() => {
            const encodedHtml = content || "No content available";
            const decodedHtml = decodeHTML(encodedHtml);
            return DOMPurify.sanitize(decodedHtml);
          })(),
        }}
      />

      {/* Code Snippets */}
      {codeSnippets && codeSnippets.map((codeBlock, index) => (
        <div key={index} className="my-8 not-prose">
          <div className="bg-gray-900 rounded-t-lg px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-300 text-sm">
              <span>{codeBlock.language}</span>
              {codeBlock.version && (
                <span className="text-gray-500">({codeBlock.version})</span>
              )}
            </div>
            <Button
              onClick={() => onCopyCode(codeBlock.code)}
              variant="ghost"
              size="sm"
              className="text-gray-300 hover:text-white h-8 w-8 p-0"
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>
          <pre className="bg-gray-800 text-gray-100 p-4 rounded-b-lg overflow-x-auto">
            <code>{codeBlock.code}</code>
          </pre>
        </div>
      ))}

      {/* Extra Sections */}
      {extraSections && extraSections.map((section, index) => (
        <div key={index} className="my-8 p-6 bg-muted rounded-lg not-prose">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            {section.title}
          </h3>
          <div className="blog-content" dangerouslySetInnerHTML={{ __html: section.body }} />
        </div>
      ))}

      {/* Downloadable Resources */}
      {resources && resources.length > 0 && (
        <div className="my-8 p-6 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800 not-prose">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Downloadable Resources
          </h3>
          <div className="space-y-2">
            {resources.map((resource, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-background rounded border">
                <div>
                  <span className="font-medium text-foreground">{resource.title}</span>
                  <span className="ml-2 text-sm text-muted-foreground">({resource.type})</span>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <a href={resource.url} download target="_blank" rel="noopener noreferrer">
                    <Download className="w-4 h-4 mr-2" />
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
