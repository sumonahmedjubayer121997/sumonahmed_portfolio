
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Eye, Share2, User } from "lucide-react";

interface BlogHeaderProps {
  title: string;
  date: string;
  author: string;
  readTime: string;
  views: number;
  tags: string[];
  coverImage?: string;
  onShare: () => void;
}

const BlogHeader = ({
  title,
  date,
  author,
  readTime,
  views,
  tags,
  coverImage,
  onShare
}: BlogHeaderProps) => {
  return (
    <header className="space-y-6">
      {/* Title */}
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-foreground">
        <div dangerouslySetInnerHTML={{ __html: title }} />
      </h1>

      {/* Meta Information */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          <span>{date}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          <span>{readTime}</span>
        </div>
        <div className="flex items-center gap-1">
          <Eye className="w-4 h-4" />
          <span>{views.toLocaleString()} views</span>
        </div>
        <div className="flex items-center gap-1">
          <User className="w-4 h-4" />
          <span>By {author}</span>
        </div>
      </div>

      {/* Tags and Share */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="text-xs px-3 py-1"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Share Button */}
        <Button onClick={onShare} variant="outline" size="sm" className="w-fit dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
          <Share2 className="w-4 h-4 mr-2 dark:text-gray-400" />
          Share
        </Button>
      </div>

      {/* Cover Image */}
      {coverImage && (
        <div className="aspect-video w-full overflow-hidden rounded-lg border">
          <img
            src={coverImage}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
    </header>
  );
};

export default BlogHeader;
