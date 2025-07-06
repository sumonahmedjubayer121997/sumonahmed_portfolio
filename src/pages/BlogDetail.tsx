
import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Clock, Calendar, Eye, ThumbsUp, ThumbsDown, Copy, ExternalLink, Download, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BlogPost {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  readTime: string;
  tag: string;
  image: string;
  alt: string;
  content: string;
  author: string;
  views: number;
  tags: string[];
  codeBlocks: Array<{
    language: string;
    code: string;
    version?: string;
  }>;
  downloadableAssets?: Array<{
    name: string;
    url: string;
    type: string;
  }>;
  relatedPosts: string[];
  tableOfContents: Array<{
    id: string;
    title: string;
    level: number;
  }>;
}

const BlogDetail = () => {
  const { blogId } = useParams<{ blogId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [activeSection, setActiveSection] = useState<string>("");
  const [views, setViews] = useState(0);
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);

  // Mock blog data with related posts data
  const blogPosts: Record<string, BlogPost> = {
    "building-ai-products-that-actually-ship": {
      id: "building-ai-products-that-actually-ship",
      title: "Building AI Products That Actually Ship",
      date: "March 2024",
      excerpt: "Lessons learned from building multiple AI products and the importance of shipping quickly.",
      readTime: "5 min read",
      tag: "thought",
      image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&h=400&fit=crop&crop=center",
      alt: "Laptop computer with code on screen",
      author: "Sumon Rahman",
      views: 1247,
      tags: ["AI", "Product Development", "Startup", "Technology"],
      content: `
<div class="blog-content">
  <h1>Building AI Products That Actually Ship</h1>
  <p class="lead">The AI space is flooded with demos and prototypes, but very few products make it to market successfully. After building and launching several AI products, I've learned some crucial lessons about what it takes to ship AI products that people actually use.</p>

  <h2 id="the-problem-with-ai-product-development">The Problem with AI Product Development</h2>
  <p>Most AI products fail not because of technical limitations, but because of fundamental product development mistakes:</p>
  <ul>
    <li><strong>Over-engineering the AI component</strong> while neglecting user experience</li>
    <li><strong>Perfectionism paralysis</strong> - waiting for the AI to be "perfect" before shipping</li>
    <li><strong>Solution in search of a problem</strong> - building cool AI without solving real pain points</li>
  </ul>

  <h2 id="key-principles-for-shipping-ai-products">Key Principles for Shipping AI Products</h2>

  <h3 id="start-with-the-problem-not-the-technology">1. Start with the Problem, Not the Technology</h3>
  <p>Before diving into the latest AI models or frameworks, clearly define:</p>
  <ul>
    <li>What specific problem are you solving?</li>
    <li>Who has this problem?</li>
    <li>How are they currently solving it?</li>
    <li>Why is your AI-powered solution better?</li>
  </ul>

  <h3 id="build-the-minimum-viable-ai">2. Build the Minimum Viable AI</h3>
  <p>Your first version doesn't need to be perfect. It needs to be:</p>
  <ul>
    <li><strong>Functional</strong> - solves the core problem</li>
    <li><strong>Fast</strong> - responds quickly enough for real use</li>
    <li><strong>Reliable</strong> - works consistently for the main use case</li>
  </ul>

  <h3 id="design-for-human-ai-collaboration">3. Design for Human-AI Collaboration</h3>
  <p>The best AI products don't replace humans entirely - they augment human capabilities:</p>

  <h3 id="iterate-based-on-real-usage-data">4. Iterate Based on Real Usage Data</h3>
  <p>Once you ship, focus on:</p>
  <ul>
    <li><strong>User feedback</strong> - what are people actually trying to do?</li>
    <li><strong>Usage patterns</strong> - where do users drop off?</li>
    <li><strong>Performance metrics</strong> - response times, accuracy, reliability</li>
  </ul>

  <h2 id="case-study-dreamboat-ai">Case Study: Dreamboat.ai</h2>
  <p>When we built Dreamboat.ai, our AI insurance agent, we followed these principles:</p>
  <ol>
    <li><strong>Problem-first approach</strong>: Insurance claims are complex and time-consuming</li>
    <li><strong>MVP mindset</strong>: Started with basic claim processing, not comprehensive insurance AI</li>
    <li><strong>Human-in-the-loop</strong>: AI handles routine tasks, humans handle edge cases</li>
    <li><strong>Rapid iteration</strong>: Weekly deployments based on user feedback</li>
  </ol>
  <p><strong>Result:</strong> $100K in funding and real customer traction within 6 months.</p>

  <h2 id="technical-considerations">Technical Considerations</h2>

  <h3 id="model-selection">Model Selection</h3>
  <ul>
    <li>Start with existing APIs (OpenAI, Anthropic) before building custom models</li>
    <li>Optimize for speed and cost, not just accuracy</li>
    <li>Have fallback mechanisms for when AI fails</li>
  </ul>

  <h3 id="infrastructure">Infrastructure</h3>
  <ul>
    <li>Design for scale from day one</li>
    <li>Monitor AI performance in production</li>
    <li>Implement proper error handling and logging</li>
  </ul>

  <h3 id="data-pipeline">Data Pipeline</h3>
  <p>Here's an example of a simple data pipeline for AI products:</p>

  <h2 id="common-pitfalls-to-avoid">Common Pitfalls to Avoid</h2>
  <ol>
    <li><strong>Feature creep</strong> - Adding AI to everything instead of solving one problem well</li>
    <li><strong>Data quality neglect</strong> - Poor data leads to poor AI performance</li>
    <li><strong>Ignoring edge cases</strong> - AI fails in unexpected ways</li>
    <li><strong>Underestimating deployment complexity</strong> - Production AI is different from development AI</li>
  </ol>

  <h2 id="the-shipping-mindset">The Shipping Mindset</h2>
  <p>The key to successful AI products is adopting a "shipping mindset":</p>
  <ul>
    <li><strong>Ship early and often</strong> - Get feedback as soon as possible</li>
    <li><strong>Embrace imperfection</strong> - Perfect is the enemy of good</li>
    <li><strong>Focus on user value</strong> - Technical sophistication doesn't equal user value</li>
    <li><strong>Measure what matters</strong> - User satisfaction, not just model accuracy</li>
  </ul>

  <h2 id="conclusion">Conclusion</h2>
  <p>Building AI products that ship successfully requires balancing technical capabilities with product discipline. Start with real problems, build minimum viable solutions, and iterate based on actual user feedback.</p>
  <p>The future belongs not to the most sophisticated AI, but to the AI products that solve real problems for real people. Focus on shipping, and the sophistication will follow.</p>

  <hr>
  <p><em>Have you built or used AI products? I'd love to hear about your experiences in the comments below.</em></p>
</div>
      `,
      codeBlocks: [
        {
          language: "python",
          code: `def review_code(code_snippet, context):
    ai_suggestions = ai_model.analyze(code_snippet)
    human_review = get_human_input(ai_suggestions)
    
    return combine_insights(ai_suggestions, human_review)`,
          version: "Python 3.9+"
        },
        {
          language: "javascript",
          code: `const processUserInput = async (input) => {
  try {
    const cleanedInput = sanitizeInput(input);
    const aiResponse = await callAIModel(cleanedInput);
    const validatedResponse = validateOutput(aiResponse);
    
    logInteraction(input, validatedResponse);
    return validatedResponse;
  } catch (error) {
    logError(error);
    return fallbackResponse(input);
  }
};`,
          version: "ES2020+"
        }
      ],
      downloadableAssets: [
        {
          name: "AI Product Development Checklist",
          url: "/downloads/ai-product-checklist.pdf",
          type: "PDF"
        },
        {
          name: "Sample AI Pipeline Code",
          url: "/downloads/ai-pipeline-sample.zip",
          type: "ZIP"
        }
      ],
      relatedPosts: ["the-future-of-ai-in-insurance", "from-idea-to-100k-funding"],
      tableOfContents: [
        { id: "the-problem-with-ai-product-development", title: "The Problem with AI Product Development", level: 2 },
        { id: "key-principles-for-shipping-ai-products", title: "Key Principles for Shipping AI Products", level: 2 },
        { id: "start-with-the-problem-not-the-technology", title: "1. Start with the Problem, Not the Technology", level: 3 },
        { id: "build-the-minimum-viable-ai", title: "2. Build the Minimum Viable AI", level: 3 },
        { id: "design-for-human-ai-collaboration", title: "3. Design for Human-AI Collaboration", level: 3 },
        { id: "iterate-based-on-real-usage-data", title: "4. Iterate Based on Real Usage Data", level: 3 },
        { id: "case-study-dreamboat-ai", title: "Case Study: Dreamboat.ai", level: 2 },
        { id: "technical-considerations", title: "Technical Considerations", level: 2 },
        { id: "model-selection", title: "Model Selection", level: 3 },
        { id: "infrastructure", title: "Infrastructure", level: 3 },
        { id: "data-pipeline", title: "Data Pipeline", level: 3 },
        { id: "common-pitfalls-to-avoid", title: "Common Pitfalls to Avoid", level: 2 },
        { id: "the-shipping-mindset", title: "The Shipping Mindset", level: 2 },
        { id: "conclusion", title: "Conclusion", level: 2 }
      ]
    },
    "the-future-of-ai-in-insurance": {
      id: "the-future-of-ai-in-insurance",
      title: "The Future of AI in Insurance",
      date: "February 2024",
      excerpt: "How AI agents are transforming the insurance industry and what to expect next.",
      readTime: "7 min read",
      tag: "tutorial",
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop&crop=center",
      alt: "Monitor showing programming code",
      author: "Sumon Rahman",
      views: 892,
      tags: ["AI", "Insurance", "Technology"],
      content: "<div class='blog-content'><h1>The Future of AI in Insurance</h1><p>AI is revolutionizing the insurance industry...</p></div>",
      codeBlocks: [],
      relatedPosts: ["building-ai-products-that-actually-ship", "from-idea-to-100k-funding"],
      tableOfContents: []
    },
    "from-idea-to-100k-funding": {
      id: "from-idea-to-100k-funding",
      title: "From Idea to $100K Funding",
      date: "January 2024",
      excerpt: "The journey of building Dreamboat.ai and raising our first round of funding.",
      readTime: "10 min read",
      tag: "resource",
      image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=400&fit=crop&crop=center",
      alt: "Person using MacBook Pro",
      author: "Sumon Rahman",
      views: 1542,
      tags: ["Startup", "Funding", "Entrepreneurship"],
      content: "<div class='blog-content'><h1>From Idea to $100K Funding</h1><p>Here's how we built and funded Dreamboat.ai...</p></div>",
      codeBlocks: [],
      relatedPosts: ["building-ai-products-that-actually-ship", "the-future-of-ai-in-insurance"],
      tableOfContents: []
    }
  };

  useEffect(() => {
    if (blogId && blogPosts[blogId]) {
      setBlog(blogPosts[blogId]);
      setViews(blogPosts[blogId].views + Math.floor(Math.random() * 10));
    }
  }, [blogId]);

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
      toast({
        title: "Copied to clipboard!",
        description: "Code snippet has been copied to your clipboard.",
      });
    } catch (err) {
      toast({
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
          text: blog.excerpt,
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
    toast({
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

  const relatedBlogPosts = blog.relatedPosts.map(postId => blogPosts[postId]).filter(Boolean);

  return (
    <Layout>
      <div className="pt-16 lg:pt-0 px-6 py-12 lg:py-24 max-w-7xl mx-auto">
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
              <div className="aspect-[2/1] overflow-hidden">
                <img
                  src={blog.image}
                  alt={blog.alt}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Article Content */}
              <div className="p-8">
                {/* Meta Information */}
                <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {blog.date}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {blog.readTime}
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

                {/* Share Button */}
                <div className="flex justify-end mb-8">
                  <Button onClick={handleShare} variant="outline" size="sm">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>

                {/* Article Content with improved typography */}
                <div className="prose prose-lg max-w-none">
                  <style jsx>{`
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
                  `}</style>
                  <div dangerouslySetInnerHTML={{ __html: blog.content }} />
                </div>

                {/* Code Blocks */}
                {blog.codeBlocks.map((codeBlock, index) => (
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

                {/* Downloadable Assets */}
                {blog.downloadableAssets && blog.downloadableAssets.length > 0 && (
                  <div className="my-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Downloadable Resources
                    </h3>
                    <div className="space-y-2">
                      {blog.downloadableAssets.map((asset, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-white rounded border">
                          <div>
                            <span className="font-medium text-gray-900">{asset.name}</span>
                            <span className="ml-2 text-sm text-gray-500">({asset.type})</span>
                          </div>
                          <Button variant="outline" size="sm" asChild>
                            <a href={asset.url} download>
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
                        {blog.tableOfContents.map((item) => (
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
        </div>

        {/* Related Posts */}
        {relatedBlogPosts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedBlogPosts.map((relatedPost) => (
                <Link key={relatedPost.id} to={`/blogs/${relatedPost.id}`}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {relatedPost.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4">
                        {relatedPost.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{relatedPost.date}</span>
                        <Badge variant="secondary">{relatedPost.tag}</Badge>
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
