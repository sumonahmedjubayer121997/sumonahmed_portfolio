
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ThumbsUp, ThumbsDown } from "lucide-react";

interface BlogFeedbackProps {
  feedback: 'up' | 'down' | null;
  onFeedback: (type: 'up' | 'down') => void;
}

const BlogFeedback = ({ feedback, onFeedback }: BlogFeedbackProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Was this article helpful?
        </h3>
        <div className="flex gap-4">
          <Button
            onClick={() => onFeedback('up')}
            variant={feedback === 'up' ? 'default' : 'outline'}
            size="sm"
            className="flex-1"
          >
            <ThumbsUp className="w-4 h-4 mr-2" />
            Yes, helpful
          </Button>
          <Button
            onClick={() => onFeedback('down')}
            variant={feedback === 'down' ? 'default' : 'outline'}
            size="sm"
            className="flex-1"
          >
            <ThumbsDown className="w-4 h-4 mr-2" />
            Could be better
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BlogFeedback;
