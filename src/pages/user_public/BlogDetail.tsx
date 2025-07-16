import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Menu } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getDynamicContent } from "@/integrations/firebase/firestore";
import { toast } from "sonner";
import BlogHeader from "@/components/blog/BlogHeader";
import BlogContent from "@/components/blog/BlogContent";
import BlogTableOfContents from "@/components/blog/BlogTableOfContents";
import BlogFeedback from "@/components/blog/BlogFeedback";
import RelatedBlogs from "@/components/blog/RelatedBlogs";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

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
  const [tocOpen, setTocOpen] = useState(false);

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
          const currentBlog = (data as BlogPost[]).find(b => b.slug === slug);
          
          if (currentBlog && currentBlog.status === 'Published') {
            setBlog(currentBlog);
            setViews(Math.floor(Math.random() * 1000) + 100);
            
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

  // Scroll tracking for table of contents
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
        title: "Copied!",
        description: "Code snippet copied to clipboard.",
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
      title: "Thank you!",
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
      setTocOpen(false); // Close mobile TOC after navigation
    }
  };

  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readTime} min read`;
  };

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
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Loading article...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!blog) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center space-y-6 max-w-md">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Article not found</h1>
            <p className="text-muted-foreground">The article you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate('/blogs')} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Articles
            </Button>
          </div>
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
      <div className="min-h-screen bg-background">
        {/* Navigation */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
          <div className="container mx-auto px-4 py-3 sm:py-4">
            <div className="flex items-center justify-between">
              <Link to="/blogs">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Back to Articles</span>
                  <span className="sm:hidden">Back</span>
                </Button>
              </Link>
              
              {/* Mobile TOC Toggle */}
              {tableOfContents.length > 0 && (
                <Sheet open={tocOpen} onOpenChange={setTocOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="sm" className="lg:hidden">
                      <Menu className="w-4 h-4 mr-2" />
                      Contents
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-80">
                    <div className="mt-6">
                      <BlogTableOfContents
                        items={tableOfContents}
                        activeSection={activeSection}
                        onSectionClick={scrollToSection}
                      />
                    </div>
                  </SheetContent>
                </Sheet>
              )}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6 sm:py-8 lg:py-12 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6 sm:space-y-8 min-w-0">
              {/* Blog Header */}
              <BlogHeader
                title={blog.title}
                date={blog.date}
                author={blog.author}
                readTime={blog.readTime || calculateReadTime(blog.content)}
                views={views}
                tags={blog.tags}
                coverImage={blog.coverImage}
                onShare={handleShare}
              />

              {/* Blog Content */}
              <div className="overflow-hidden">
                <BlogContent
                  content={blog.content}
                  codeSnippets={blog.codeSnippets}
                  resources={blog.resources}
                  extraSections={blog.extraSections}
                  onCopyCode={copyToClipboard}
                />
              </div>

              {/* Feedback Section */}
              <BlogFeedback
                feedback={feedback}
                onFeedback={handleFeedback}
              />
            </div>

            {/* Desktop Sidebar */}
            <div className="hidden lg:block lg:col-span-1">
              {tableOfContents.length > 0 && (
                <BlogTableOfContents
                  items={tableOfContents}
                  activeSection={activeSection}
                  onSectionClick={scrollToSection}
                />
              )}
            </div>
          </div>

          {/* Related Blogs */}
          <RelatedBlogs blogs={relatedBlogs} />
        </div>
      </div>
    </Layout>
  );
};

export default BlogDetail;
