
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

  // Calculate proper indentation based on heading level
  const getIndentation = (level: number) => {
    switch (level) {
      case 1: return 0; // H1 - no indentation (main sections)
      case 2: return 16; // H2 - 16px indentation (subsections)
      case 3: return 32; // H3 - 32px indentation (nested under H2)
      default: return 0;
    }
  };

  // Get text size based on heading level
  const getTextSize = (level: number) => {
    switch (level) {
      case 1: return "text-sm sm:text-base font-semibold"; // H1 - larger, bold
      case 2: return "text-xs sm:text-sm font-medium"; // H2 - medium
      case 3: return "text-xs sm:text-sm font-normal"; // H3 - smaller, normal weight
      default: return "text-xs sm:text-sm";
    }
  };

  return (
    <div className="sticky top-6">
      <Card>
        <CardContent className="p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4">
            Table of Contents
          </h3>
          <ScrollArea className="h-80 sm:h-96">
            <nav>
              <ul className="space-y-1">
                {items.map((item) => (
                  <li key={item.id} style={{ marginLeft: `${getIndentation(item.level)}px` }}>
                    <button
                      onClick={() => onSectionClick(item.id)}
                      className={`block py-2 px-2 sm:px-3 rounded-md hover:bg-muted transition-colors text-left w-full leading-tight ${getTextSize(item.level)} ${
                        activeSection === item.id 
                          ? 'bg-primary/10 text-primary border-l-2 border-primary' 
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <span className="line-clamp-2 break-words">{item.title}</span>
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
