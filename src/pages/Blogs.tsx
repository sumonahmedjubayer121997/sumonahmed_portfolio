
import Layout from "../components/Layout";
import { Badge } from "@/components/ui/badge";

const Blogs = () => {
  const blogs = [
    {
      title: "Building AI Products That Actually Ship",
      date: "March 2024",
      excerpt: "Lessons learned from building multiple AI products and the importance of shipping quickly.",
      readTime: "5 min read",
      tag: "thought",
      image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=200&fit=crop&crop=center",
      alt: "Laptop computer with code on screen"
    },
    {
      title: "The Future of AI in Insurance",
      date: "February 2024",
      excerpt: "How AI agents are transforming the insurance industry and what to expect next.",
      readTime: "7 min read",
      tag: "tutorial",
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=200&fit=crop&crop=center",
      alt: "Monitor showing programming code"
    },
    {
      title: "From Idea to $100K Funding",
      date: "January 2024",
      excerpt: "The journey of building Dreamboat.ai and raising our first round of funding.",
      readTime: "10 min read",
      tag: "resource",
      image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=200&fit=crop&crop=center",
      alt: "Person using MacBook Pro"
    },
    {
      title: "The Power of 1%: Daily Habits for Success",
      date: "December 2023",
      excerpt: "Small daily, weekly, and monthly actions that compound into massive growth—tailored for founders and engineers.",
      readTime: "6 min read",
      tag: "thought",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=200&fit=crop&crop=center",
      alt: "Woman using laptop computer"
    }
  ];

  const getTagStyle = (tag: string) => {
    switch (tag) {
      case "thought":
        return "bg-slate-800 text-white hover:bg-slate-700";
      case "tutorial": 
        return "bg-blue-600 text-white hover:bg-blue-700";
      case "resource":
        return "bg-green-600 text-white hover:bg-green-700";
      default:
        return "bg-gray-600 text-white hover:bg-gray-700";
    }
  };

  return (
    <Layout>
      <div className="pt-16 lg:pt-0 px-6 py-12 lg:py-24 max-w-6xl mx-auto relative">
        {/* Header Section */}
        <div className="mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Pensieve
          </h1>
          <p className="text-gray-600 text-lg mb-2">
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
        </div>

        {/* Blog Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {blogs.map((blog, index) => (
            <article
              key={index}
              className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02] overflow-hidden cursor-pointer border border-gray-100"
            >
              {/* Feature Image */}
              <div className="aspect-[2/1] overflow-hidden">
                <img
                  src={blog.image}
                  alt={blog.alt}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Card Content */}
              <div className="p-6 relative">
                {/* Title */}
                <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 leading-tight">
                  {blog.title}
                </h2>
                
                {/* Excerpt */}
                <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
                  {blog.excerpt}
                </p>
                
                {/* Date */}
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-400">
                    {blog.date}
                  </p>
                  
                  {/* Tag Badge */}
                  <Badge 
                    variant="secondary" 
                    className={`text-xs px-2 py-1 rounded-full ${getTagStyle(blog.tag)}`}
                  >
                    {blog.tag}
                  </Badge>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Blogs;
