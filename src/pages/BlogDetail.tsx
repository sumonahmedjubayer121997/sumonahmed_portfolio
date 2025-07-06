
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

  // Mock blog data - in a real app, this would come from an API
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
# Building AI Products That Actually Ship

The AI space is flooded with demos and prototypes, but very few products make it to market successfully. After building and launching several AI products, I've learned some crucial lessons about what it takes to ship AI products that people actually use.

## The Problem with AI Product Development

Most AI products fail not because of technical limitations, but because of fundamental product development mistakes:

- **Over-engineering the AI component** while neglecting user experience
- **Perfectionism paralysis** - waiting for the AI to be "perfect" before shipping
- **Solution in search of a problem** - building cool AI without solving real pain points

## Key Principles for Shipping AI Products

### 1. Start with the Problem, Not the Technology

Before diving into the latest AI models or frameworks, clearly define:
- What specific problem are you solving?
- Who has this problem?
- How are they currently solving it?
- Why is your AI-powered solution better?

### 2. Build the Minimum Viable AI

Your first version doesn't need to be perfect. It needs to be:
- **Functional** - solves the core problem
- **Fast** - responds quickly enough for real use
- **Reliable** - works consistently for the main use case

### 3. Design for Human-AI Collaboration

The best AI products don't replace humans entirely - they augment human capabilities:

\`\`\`python
# Example: AI-assisted code review
def review_code(code_snippet, context):
    ai_suggestions = ai_model.analyze(code_snippet)
    human_review = get_human_input(ai_suggestions)
    
    return combine_insights(ai_suggestions, human_review)
\`\`\`

### 4. Iterate Based on Real Usage Data

Once you ship, focus on:
- **User feedback** - what are people actually trying to do?
- **Usage patterns** - where do users drop off?
- **Performance metrics** - response times, accuracy, reliability

## Case Study: Dreamboat.ai

When we built Dreamboat.ai, our AI insurance agent, we followed these principles:

1. **Problem-first approach**: Insurance claims are complex and time-consuming
2. **MVP mindset**: Started with basic claim processing, not comprehensive insurance AI
3. **Human-in-the-loop**: AI handles routine tasks, humans handle edge cases
4. **Rapid iteration**: Weekly deployments based on user feedback

Result: $100K in funding and real customer traction within 6 months.

## Technical Considerations

### Model Selection
- Start with existing APIs (OpenAI, Anthropic) before building custom models
- Optimize for speed and cost, not just accuracy
- Have fallback mechanisms for when AI fails

### Infrastructure
- Design for scale from day one
- Monitor AI performance in production
- Implement proper error handling and logging

### Data Pipeline
\`\`\`javascript
// Example: Simple data pipeline for AI product
const processUserInput = async (input) => {
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
};
\`\`\`

## Common Pitfalls to Avoid

1. **Feature creep** - Adding AI to everything instead of solving one problem well
2. **Data quality neglect** - Poor data leads to poor AI performance
3. **Ignoring edge cases** - AI fails in unexpected ways
4. **Underestimating deployment complexity** - Production AI is different from development AI

## The Shipping Mindset

The key to successful AI products is adopting a "shipping mindset":

- **Ship early and often** - Get feedback as soon as possible
- **Embrace imperfection** - Perfect is the enemy of good
- **Focus on user value** - Technical sophistication doesn't equal user value
- **Measure what matters** - User satisfaction, not just model accuracy

## Conclusion

Building AI products that ship successfully requires balancing technical capabilities with product discipline. Start with real problems, build minimum viable solutions, and iterate based on actual user feedback.

The future belongs not to the most sophisticated AI, but to the AI products that solve real problems for real people. Focus on shipping, and the sophistication will follow.

---

*Have you built or used AI products? I'd love to hear about your experiences in the comments below.*
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
        { id: "start-with-the-problem-not-the-technology", title: "Start with the Problem, Not the Technology", level: 3 },
        { id: "build-the-minimum-viable-ai", title: "Build the Minimum Viable AI", level: 3 },
        { id: "design-for-human-ai-collaboration", title: "Design for Human-AI Collaboration", level: 3 },
        { id: "iterate-based-on-real-usage-data", title: "Iterate Based on Real Usage Data", level: 3 },
        { id: "case-study-dreamboat-ai", title: "Case Study: Dreamboat.ai", level: 2 },
        { id: "technical-considerations", title: "Technical Considerations", level: 2 },
        { id: "common-pitfalls-to-avoid", title: "Common Pitfalls to Avoid", level: 2 },
        { id: "the-shipping-mindset", title: "The Shipping Mindset", level: 2 },
        { id: "conclusion", title: "Conclusion", level: 2 }
      ]
    }
  };

  useEffect(() => {
    if (blogId && blogPosts[blogId]) {
      setBlog(blogPosts[blogId]);
      setViews(blogPosts[blogId].views + Math.floor(Math.random() * 10));
    }
  }, [blogId]);

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
        // Fallback to copying URL
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

                {/* Title */}
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                  {blog.title}
                </h1>

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

                {/* Article Content */}
                <div className="prose prose-lg max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: blog.content.replace(/\n/g, '<br />') }} />
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
                            <a
                              href={`#${item.id}`}
                              className={`block text-sm py-1 px-2 rounded hover:bg-gray-100 transition-colors ${
                                activeSection === item.id ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-700'
                              }`}
                            >
                              {item.title}
                            </a>
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
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Posts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Mock related posts */}
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-2">
                  The Future of AI in Insurance
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Exploring how AI agents will transform the insurance industry...
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>February 2024</span>
                  <Badge variant="secondary">tutorial</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BlogDetail;
