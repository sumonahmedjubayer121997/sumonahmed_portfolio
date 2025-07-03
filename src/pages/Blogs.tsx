
import Layout from "../components/Layout";

const Blogs = () => {
  const blogs = [
    {
      title: "Building AI Products That Actually Ship",
      date: "March 2024",
      excerpt: "Lessons learned from building multiple AI products and the importance of shipping quickly.",
      readTime: "5 min read"
    },
    {
      title: "The Future of AI in Insurance",
      date: "February 2024",
      excerpt: "How AI agents are transforming the insurance industry and what to expect next.",
      readTime: "7 min read"
    },
    {
      title: "From Idea to $100K Funding",
      date: "January 2024",
      excerpt: "The journey of building Dreamboat.ai and raising our first round of funding.",
      readTime: "10 min read"
    }
  ];

  return (
    <Layout>
      <div className="pt-16 lg:pt-0 px-6 py-12 lg:py-24 max-w-4xl mx-auto">
        <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-12">Blogs</h1>
        
        <div className="space-y-8">
          {blogs.map((blog, index) => (
            <article key={index} className="border-b border-gray-200 pb-8 last:border-b-0">
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <span>{blog.date}</span>
                <span className="mx-2">•</span>
                <span>{blog.readTime}</span>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3 hover:text-gray-700 cursor-pointer transition-colors duration-200">
                {blog.title}
              </h2>
              <p className="text-gray-600 leading-relaxed">{blog.excerpt}</p>
            </article>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Blogs;
