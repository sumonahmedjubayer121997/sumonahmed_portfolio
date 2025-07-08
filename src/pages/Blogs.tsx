
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";
import { getDynamicContent } from "@/integrations/firebase/firestore";
import { toast } from "sonner";

interface BlogItem {
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
  createdAt?: any;
  updatedAt?: any;
}

const Blogs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("");
  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const { data, error } = await getDynamicContent('blogs');
        
        if (error) {
          console.error('Error fetching blogs:', error);
          toast.error('Failed to load blogs');
          return;
        }

        if (data && Array.isArray(data)) {
          // Filter to only show published blogs and sort by date
          const publishedBlogs = (data as BlogItem[])
            .filter(blog => blog.status === 'Published')
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          
          setBlogs(publishedBlogs);
        }
      } catch (error) {
        console.error('Error fetching blogs:', error);
        toast.error('Failed to load blogs');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Get all unique tags
  const allTags = Array.from(new Set(blogs.flatMap(blog => blog.tags || [])));

  // Filter blogs based on search term and selected tag
  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = searchTerm === "" || 
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (blog.excerpt || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (blog.tags || []).some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesTag = selectedTag === "" || (blog.tags || []).includes(selectedTag);

    return matchesSearch && matchesTag;
  });

  const getTagStyle = (status: string) => {
    return "bg-slate-800 text-white hover:bg-slate-700";
  };

  // Generate excerpt from content if not provided
  const generateExcerpt = (content: string, maxLength: number = 150) => {
    // Remove HTML tags and get plain text
    const plainText = content.replace(/<[^>]*>/g, '').trim();
    if (plainText.length <= maxLength) return plainText;
    return plainText.substring(0, maxLength) + '...';
  };

  // Calculate read time based on content
  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readTime} min read`;
  };

  if (loading) {
    return (
      <Layout>
        <div className="pt-16 lg:pt-0 px-6 py-12 lg:py-24 max-w-6xl mx-auto">
          <div className="flex justify-center items-center py-12">
            <div className="text-lg text-gray-600">Loading blogs...</div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="pt-16 lg:pt-0 px-6 py-12 lg:py-24 max-w-6xl mx-auto relative">
        {/* Header Section */}
        <div className="mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Pensieve
          </h1>
          <p className="text-gray-600 text-lg mb-6">
            A collection of thoughts, ideas, and musings. You can check more of my writings on my{" "}
            <a 
              href="https://medium.com/@sumon" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Medium
            </a>{" "}
            profile.
          </p>

          {/* Search and Filter Section */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search blogs by title, content, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Tag Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Tags</option>
                {allTags.map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Filter Tags Display */}
          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {allTags.map(tag => (
                <Button
                  key={tag}
                  variant={selectedTag === tag ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTag(selectedTag === tag ? "" : tag)}
                  className="text-xs"
                >
                  {tag}
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Results Count */}
        {(searchTerm || selectedTag) && (
          <div className="mb-6">
            <p className="text-gray-600">
              Found {filteredBlogs.length} blog{filteredBlogs.length !== 1 ? 's' : ''}
              {searchTerm && ` matching "${searchTerm}"`}
              {selectedTag && ` in "${selectedTag}"`}
            </p>
          </div>
        )}

        {/* Blog Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredBlogs.length > 0 ? (
            filteredBlogs.map((blog) => (
              <Link
                key={blog.id}
                to={`/blogs/${blog.slug}`}
                className="block"
              >
                <article className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02] overflow-hidden cursor-pointer border border-gray-100 h-full">
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
                  
                  {/* Card Content */}
                  <div className="p-6 relative flex flex-col justify-between h-full">
                    <div>
                      {/* Title */}
                      <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 leading-tight">
                        {blog.title}
                      </h2>
                      
                      {/* Excerpt */}
                      <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
                        {blog.excerpt || generateExcerpt(blog.content)}
                      </p>

                      {/* Tags */}
                      {blog.tags && blog.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {blog.tags.slice(0, 3).map((tag, tagIndex) => (
                            <Badge
                              key={tagIndex}
                              variant="secondary"
                              className="text-xs px-2 py-1 bg-gray-100 text-gray-700"
                            >
                              {tag}
                            </Badge>
                          ))}
                          {blog.tags.length > 3 && (
                            <Badge variant="secondary" className="text-xs px-2 py-1 bg-gray-100 text-gray-700">
                              +{blog.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {/* Date and Read Time */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <p className="text-xs text-gray-400">
                          {blog.date}
                        </p>
                        <span className="text-gray-300">•</span>
                        <p className="text-xs text-gray-400">
                          {blog.readTime || calculateReadTime(blog.content)}
                        </p>
                      </div>
                      
                      {/* Status Badge */}
                      <Badge 
                        variant="secondary" 
                        className={`text-xs px-2 py-1 rounded-full ${getTagStyle(blog.status)}`}
                      >
                        Published
                      </Badge>
                    </div>
                  </div>
                </article>
              </Link>
            ))
          ) : (
            <div className="col-span-2 text-center py-12">
              <p className="text-gray-600 text-lg">
                {blogs.length === 0 ? 'No published blogs found.' : 'No blogs found matching your criteria.'}
              </p>
              {filteredBlogs.length === 0 && blogs.length > 0 && (
                <Button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedTag("");
                  }}
                  variant="outline"
                  className="mt-4"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          )}
        </div>

        {/* RSS Feed Link */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-4">
            Stay updated with my latest posts
          </p>
          <div className="flex justify-center gap-4">
            <Button variant="outline" asChild>
              <a href="/rss.xml">
                RSS Feed
              </a>
            </Button>
            <Button variant="outline">
              Subscribe to Newsletter
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Blogs;
