
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TOCItem {
  id: string;
  title: string;
  level: number;
}

interface BlogTableOfContentsProps {
  items: TOCItem[];
  activeSection: string;
  onSectionClick: (sectionId: string) => void;
}

const BlogTableOfContents = ({
  items,
  activeSection,
  onSectionClick
}: BlogTableOfContentsProps) => {
  if (items.length === 0) return null;

  return (
    <div className="sticky top-6">
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Table of Contents
          </h3>
          <ScrollArea className="h-96">
            <nav>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item.id} style={{ marginLeft: `${(item.level - 2) * 16}px` }}>
                    <button
                      onClick={() => onSectionClick(item.id)}
                      className={`block text-sm py-2 px-3 rounded-md hover:bg-muted transition-colors text-left w-full ${
                        activeSection === item.id 
                          ? 'bg-primary/10 text-primary font-medium border-l-2 border-primary' 
                          : 'text-muted-foreground hover:text-foreground'
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
  );
};

export default BlogTableOfContents;
