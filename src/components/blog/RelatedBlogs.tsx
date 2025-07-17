
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  date: string;
  excerpt?: string;
  content: string;
}

interface RelatedBlogsProps {
  blogs: BlogPost[];
}

const RelatedBlogs = ({ blogs }: RelatedBlogsProps) => {
  if (blogs.length === 0) return null;

  return (
    <section className="mt-16">
      <h2 className="text-2xl font-bold text-foreground mb-8">Related Articles</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <Link key={blog.id} to={`/blogs/${blog.slug}`}>
            <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer h-full group">
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                  {blog.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                  {blog.excerpt || blog.content.replace(/<[^>]*>/g, '').substring(0, 120) + '...'}
                </p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{blog.date}</span>
                  <Badge variant="secondary" className="text-xs">
                    Published
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default RelatedBlogs;
