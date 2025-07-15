import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface AccessibilityIssue {
  type: 'error' | 'warning' | 'info';
  category: string;
  message: string;
  suggestion?: string;
  element?: string;
}

interface AccessibilityCheckerProps {
  content: string;
  onIssueClick?: (issue: AccessibilityIssue) => void;
}

const AccessibilityChecker: React.FC<AccessibilityCheckerProps> = ({
  content,
  onIssueClick,
}) => {
  const [issues, setIssues] = useState<AccessibilityIssue[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    checkAccessibility(content);
  }, [content]);

  const checkAccessibility = (htmlContent: string) => {
    const foundIssues: AccessibilityIssue[] = [];
    
    // Create a temporary DOM element to parse HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;

    // Check for images without alt text
    const images = tempDiv.querySelectorAll('img');
    images.forEach((img, index) => {
      if (!img.getAttribute('alt')) {
        foundIssues.push({
          type: 'error',
          category: 'Images',
          message: `Image ${index + 1} missing alt text`,
          suggestion: 'Add descriptive alt text for screen readers',
          element: 'img'
        });
      } else if (img.getAttribute('alt')?.trim() === '') {
        foundIssues.push({
          type: 'warning',
          category: 'Images',
          message: `Image ${index + 1} has empty alt text`,
          suggestion: 'Provide meaningful alt text or use alt="" for decorative images',
          element: 'img'
        });
      }
    });

    // Check heading structure
    const headings = tempDiv.querySelectorAll('h1, h2, h3, h4, h5, h6');
    let prevLevel = 0;
    let hasH1 = false;

    headings.forEach((heading) => {
      const level = parseInt(heading.tagName.charAt(1));
      
      if (level === 1) {
        hasH1 = true;
        if (prevLevel !== 0) {
          foundIssues.push({
            type: 'warning',
            category: 'Headings',
            message: 'Multiple H1 headings found',
            suggestion: 'Use only one H1 per page/section',
            element: heading.tagName.toLowerCase()
          });
        }
      }
      
      if (prevLevel !== 0 && level > prevLevel + 1) {
        foundIssues.push({
          type: 'warning',
          category: 'Headings',
          message: `Heading level jumps from H${prevLevel} to H${level}`,
          suggestion: 'Maintain logical heading hierarchy without skipping levels',
          element: heading.tagName.toLowerCase()
        });
      }
      
      prevLevel = level;
    });

    if (headings.length > 0 && !hasH1) {
      foundIssues.push({
        type: 'info',
        category: 'Headings',
        message: 'No H1 heading found',
        suggestion: 'Consider adding an H1 for the main page/section title',
        element: 'h1'
      });
    }

    // Check for links without descriptive text
    const links = tempDiv.querySelectorAll('a');
    links.forEach((link, index) => {
      const linkText = link.textContent?.trim() || '';
      const commonGeneric = ['click here', 'read more', 'here', 'more', 'link'];
      
      if (linkText === '') {
        foundIssues.push({
          type: 'error',
          category: 'Links',
          message: `Link ${index + 1} has no text content`,
          suggestion: 'Provide descriptive link text',
          element: 'a'
        });
      } else if (commonGeneric.some(generic => linkText.toLowerCase().includes(generic))) {
        foundIssues.push({
          type: 'warning',
          category: 'Links',
          message: `Link ${index + 1} uses generic text: "${linkText}"`,
          suggestion: 'Use more descriptive link text that explains the destination',
          element: 'a'
        });
      }
    });

    // Check for sufficient text contrast (basic color analysis)
    const elementsWithColor = tempDiv.querySelectorAll('[style*="color"]');
    elementsWithColor.forEach((element, index) => {
      const style = element.getAttribute('style') || '';
      const hasTextColor = style.includes('color:');
      const hasBackground = style.includes('background');
      
      if (hasTextColor && !hasBackground) {
        foundIssues.push({
          type: 'info',
          category: 'Color Contrast',
          message: `Element ${index + 1} has custom text color without background`,
          suggestion: 'Ensure sufficient color contrast for readability',
          element: element.tagName.toLowerCase()
        });
      }
    });

    // Check for text length in paragraphs
    const paragraphs = tempDiv.querySelectorAll('p');
    paragraphs.forEach((p, index) => {
      const textLength = p.textContent?.length || 0;
      if (textLength > 500) {
        foundIssues.push({
          type: 'info',
          category: 'Readability',
          message: `Paragraph ${index + 1} is very long (${textLength} characters)`,
          suggestion: 'Consider breaking long paragraphs into shorter ones for better readability',
          element: 'p'
        });
      }
    });

    // Check for tables without headers
    const tables = tempDiv.querySelectorAll('table');
    tables.forEach((table, index) => {
      const hasHeaders = table.querySelectorAll('th').length > 0;
      if (!hasHeaders) {
        foundIssues.push({
          type: 'warning',
          category: 'Tables',
          message: `Table ${index + 1} has no header cells`,
          suggestion: 'Use <th> elements for table headers to improve accessibility',
          element: 'table'
        });
      }
    });

    setIssues(foundIssues);
  };

  const getIssueIcon = (type: AccessibilityIssue['type']) => {
    switch (type) {
      case 'error':
        return <XCircle className="h-4 w-4 text-destructive" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getIssueCount = (type: AccessibilityIssue['type']) => {
    return issues.filter(issue => issue.type === type).length;
  };

  const groupedIssues = issues.reduce((acc, issue) => {
    if (!acc[issue.category]) {
      acc[issue.category] = [];
    }
    acc[issue.category].push(issue);
    return acc;
  }, {} as Record<string, AccessibilityIssue[]>);

  return (
    <Card className="w-full">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                Accessibility Check
                {issues.length === 0 ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                )}
              </span>
              <div className="flex items-center gap-2">
                {getIssueCount('error') > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    {getIssueCount('error')} errors
                  </Badge>
                )}
                {getIssueCount('warning') > 0 && (
                  <Badge variant="outline" className="text-xs border-yellow-500 text-yellow-600">
                    {getIssueCount('warning')} warnings
                  </Badge>
                )}
                {getIssueCount('info') > 0 && (
                  <Badge variant="outline" className="text-xs border-blue-500 text-blue-600">
                    {getIssueCount('info')} info
                  </Badge>
                )}
                {issues.length === 0 && (
                  <Badge variant="outline" className="text-xs border-green-500 text-green-600">
                    No issues
                  </Badge>
                )}
              </div>
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent>
            {issues.length === 0 ? (
              <div className="text-center py-6">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">
                  No accessibility issues found! Your content follows good accessibility practices.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {Object.entries(groupedIssues).map(([category, categoryIssues]) => (
                  <div key={category}>
                    <h4 className="font-semibold text-sm mb-2 text-primary">
                      {category} ({categoryIssues.length})
                    </h4>
                    <div className="space-y-2">
                      {categoryIssues.map((issue, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-2 p-3 border rounded-lg hover:bg-muted/30 transition-colors"
                        >
                          {getIssueIcon(issue.type)}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">{issue.message}</p>
                            {issue.suggestion && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {issue.suggestion}
                              </p>
                            )}
                          </div>
                          {onIssueClick && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onIssueClick(issue)}
                              className="text-xs"
                            >
                              Fix
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default AccessibilityChecker;