
import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Clock, Calendar, Eye, ThumbsUp, ThumbsDown, Copy, Share2, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getDynamicContent } from "@/integrations/firebase/firestore";
import { toast } from "sonner";
import DOMPurify from "dompurify";

function decodeHTML(encoded) {
  const txt = document.createElement("textarea");
  txt.innerHTML = encoded;
  return txt.value;
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  status: 'Draft' | 'Published';
  date: string;
  author: string;
  tags: string[];
  coverImage?: string;
  content: string;
  excerpt?: string;
  readTime?: string;
  tableOfContents?: string[];
  codeSnippets?: Array<{
    language: string;
    code: string;
    version?: string;
  }>;
  resources?: Array<{
    title: string;
    type: string;
    url: string;
  }>;
  extraSections?: Array<{
    title: string;
    body: string;
  }>;
  createdAt?: any;
  updatedAt?: any;
}

const BlogDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { toast: showToast } = useToast();
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<string>("");
  const [views, setViews] = useState(0);
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);

  useEffect(() => {
    const fetchBlogData = async () => {
      if (!slug) return;

      try {
        setLoading(true);
        const { data, error } = await getDynamicContent('blogs');
        
        if (error) {
          console.error('Error fetching blogs:', error);
          toast.error('Failed to load blog');
          return;
        }

        if (data && Array.isArray(data)) {
          // Find the current blog by slug
          const currentBlog = (data as BlogPost[]).find(b => b.slug === slug);
          
          if (currentBlog && currentBlog.status === 'Published') {
            setBlog(currentBlog);
            setViews(Math.floor(Math.random() * 1000) + 100); // Mock view count
            
            // Find related blogs (same tags, excluding current blog)
            const related = (data as BlogPost[])
              .filter(b => 
                b.id !== currentBlog.id && 
                b.status === 'Published' &&
                b.tags?.some(tag => currentBlog.tags?.includes(tag))
              )
              .slice(0, 3);
            
            setRelatedBlogs(related);
          }
        }
      } catch (error) {
        console.error('Error fetching blog:', error);
        toast.error('Failed to load blog');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogData();
  }, [slug]);

  // Add scroll tracking for table of contents
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('h2[id], h3[id]');
      let currentSection = '';
      
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 100 && rect.bottom >= 100) {
          currentSection = section.id;
        }
      });
      
      if (currentSection && currentSection !== activeSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeSection]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast({
        title: "Copied to clipboard!",
        description: "Code snippet has been copied to your clipboard.",
      });
    } catch (err) {
      showToast({
        title: "Failed to copy",
        description: "Please try selecting and copying manually.",
        variant: "destructive",
      });
    }
  };

  const handleShare = async () => {
    if (navigator.share && blog) {
      try {
        await navigator.share({
          title: blog.title,
          text: blog.excerpt || blog.title,
          url: window.location.href,
        });
      } catch (err) {
        copyToClipboard(window.location.href);
      }
    } else {
      copyToClipboard(window.location.href);
    }
  };

  const handleFeedback = (type: 'up' | 'down') => {
    setFeedback(type);
    showToast({
      title: "Thank you for your feedback!",
      description: `Your ${type === 'up' ? 'positive' : 'constructive'} feedback helps improve our content.`,
    });
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // Calculate read time based on content
  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readTime} min read`;
  };

  // Extract table of contents from content
  const extractTableOfContents = (content: string) => {
    const headings = content.match(/<h[2-3][^>]*id="([^"]*)"[^>]*>([^<]*)<\/h[2-3]>/g);
    
    if (!headings) return [];

    return headings.map(heading => {
      const idMatch = heading.match(/id="([^"]*)"/);
      const textMatch = heading.match(/>([^<]*)</);
      const levelMatch = heading.match(/<h([2-3])/);
      
      return {
        id: idMatch ? idMatch[1] : '',
        title: textMatch ? textMatch[1] : '',
        level: levelMatch ? parseInt(levelMatch[1]) : 2
      };
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="pt-16 lg:pt-0 px-6 py-12 lg:py-24 max-w-4xl mx-auto text-center">
          <div className="text-lg text-gray-600">Loading blog...</div>
        </div>
      </Layout>
    );
  }

  if (!blog) {
    return (
      <Layout>
        <div className="pt-16 lg:pt-0 px-6 py-12 lg:py-24 max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Blog post not found</h1>
          <p className="text-gray-600 mb-6">The blog post you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/blogs')} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blogs
          </Button>
        </div>
      </Layout>
    );
  }

  const tableOfContents = blog.tableOfContents?.map((title, index) => ({
    id: title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, ''),
    title,
    level: 2
  })) || extractTableOfContents(blog.content);

  return (
    <Layout>
      <div className="pt-16 lg:pt-0 px-6 py-12 lg:py-24 max-w-7xl mx-auto">
        <style>
          {`
            .blog-content h1 {
              font-size: 2.5rem;
              font-weight: 700;
              color: #1f2937;
              margin-bottom: 1.5rem;
              line-height: 1.2;
            }
            .blog-content h2 {
              font-size: 1.875rem;
              font-weight: 600;
              color: #374151;
              margin-top: 3rem;
              margin-bottom: 1.5rem;
              padding-bottom: 0.5rem;
              border-bottom: 2px solid #e5e7eb;
            }
            .blog-content h3 {
              font-size: 1.5rem;
              font-weight: 600;
              color: #4b5563;
              margin-top: 2rem;
              margin-bottom: 1rem;
            }
            .blog-content p {
              margin-bottom: 1.5rem;
              line-height: 1.7;
              color: #374151;
            }
            .blog-content .lead {
              font-size: 1.125rem;
              font-weight: 400;
              color: #6b7280;
              margin-bottom: 2rem;
              padding: 1.5rem;
              background-color: #f9fafb;
              border-left: 4px solid #3b82f6;
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
              color: #1f2937;
            }
            .blog-content hr {
              margin: 3rem 0;
              border: none;
              border-top: 1px solid #e5e7eb;
            }
            .blog-content img {
              max-width: 100%;
              height: auto;
              border-radius: 0.5rem;
              margin: 1.5rem 0;
            }
          `}
        </style>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1 max-w-4xl">
            {/* Back Button */}
            <Button
              onClick={() => navigate('/blogs')}
              variant="ghost"
              className="mb-6 -ml-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blogs
            </Button>

            {/* Article Header */}
            <article className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Feature Image */}
              {blog.coverImage && (
                <div className="aspect-[2/1] overflow-hidden">
                  <img
                    src={blog.coverImage}
                    alt={blog.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Article Content */}
              <div className="lg:p-8">
                {/* Meta Information */}
                <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {blog.date}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {blog.readTime || calculateReadTime(blog.content)}
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {views.toLocaleString()} views
                  </div>
                  <div className="flex items-center gap-1">
                    By {blog.author}
                  </div>
                </div>

                {/* Tags */}
                {blog.tags && blog.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-8">
                    {blog.tags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs px-2 py-1 bg-gray-100 text-gray-700 hover:bg-gray-200"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Share Button */}
                <div className="flex justify-end mb-8">
                  <Button onClick={handleShare} variant="outline" size="sm">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>

                {/* Article Content with improved typography */}
                 <div
                      className="mt-2 text-gray-600 dark:text-gray-400 text-sm reak-words whitespace-pre-wrap overflow-hidden"
                      dangerouslySetInnerHTML={{
                        __html: (() => {
                          const encodedHtml =
                            blog?.content || "No description available";
                          const decodedHtml = decodeHTML(encodedHtml);
                          const sanitizedHtml = DOMPurify.sanitize(decodedHtml);

                          // OPTIONAL: Truncate visually, not programmatically
                          return sanitizedHtml;
                        })(),
                      }}
                    ></div>

                {/* Code Blocks */}
                {blog.codeSnippets && blog.codeSnippets.map((codeBlock, index) => (
                  <div key={index} className="my-8">
                    <div className="bg-gray-900 rounded-t-lg px-4 py-2 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-300 text-sm">
                        <span>{codeBlock.language}</span>
                        {codeBlock.version && (
                          <span className="text-gray-500">({codeBlock.version})</span>
                        )}
                      </div>
                      <Button
                        onClick={() => copyToClipboard(codeBlock.code)}
                        variant="ghost"
                        size="sm"
                        className="text-gray-300 hover:text-white"
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
                {blog.extraSections && blog.extraSections.map((section, index) => (
                  <div key={index} className="my-8 p-6 bg-gray-50 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      {section.title}
                    </h3>
                    <div className="blog-content" dangerouslySetInnerHTML={{ __html: section.body }} />
                  </div>
                ))}

                {/* Downloadable Resources */}
                {blog.resources && blog.resources.length > 0 && (
                  <div className="my-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Downloadable Resources
                    </h3>
                    <div className="space-y-2">
                      {blog.resources.map((resource, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-white rounded border">
                          <div>
                            <span className="font-medium text-gray-900">{resource.title}</span>
                            <span className="ml-2 text-sm text-gray-500">({resource.type})</span>
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

                {/* Feedback Section */}
                <div className="my-8 p-6 bg-gray-50 rounded-lg border">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Was this article helpful?
                  </h3>
                  <div className="flex gap-4">
                    <Button
                      onClick={() => handleFeedback('up')}
                      variant={feedback === 'up' ? 'default' : 'outline'}
                      size="sm"
                    >
                      <ThumbsUp className="w-4 h-4 mr-2" />
                      Yes, helpful
                    </Button>
                    <Button
                      onClick={() => handleFeedback('down')}
                      variant={feedback === 'down' ? 'default' : 'outline'}
                      size="sm"
                    >
                      <ThumbsDown className="w-4 h-4 mr-2" />
                      Could be better
                    </Button>
                  </div>
                </div>
              </div>
            </article>
          </div>

          {/* Sidebar - Table of Contents */}
          {tableOfContents.length > 0 && (
            <div className="lg:w-80">
              <div className="sticky top-20">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Table of Contents
                    </h3>
                    <ScrollArea className="h-96">
                      <nav>
                        <ul className="space-y-2">
                          {tableOfContents.map((item) => (
                            <li key={item.id} style={{ marginLeft: `${(item.level - 2) * 16}px` }}>
                              <button
                                onClick={() => scrollToSection(item.id)}
                                className={`block text-sm py-1 px-2 rounded hover:bg-gray-100 transition-colors text-left w-full ${
                                  activeSection === item.id ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-700'
                                }`}
                              >
                                {item.title}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </nav>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>

        {/* Related Posts */}
        {relatedBlogs.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedBlogs.map((relatedPost) => (
                <Link key={relatedPost.id} to={`/blogs/${relatedPost.slug}`}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {relatedPost.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4">
                        {relatedPost.excerpt || relatedPost.content.replace(/<[^>]*>/g, '').substring(0, 100) + '...'}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{relatedPost.date}</span>
                        <Badge variant="secondary">Published</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default BlogDetail;
