import { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertTriangle, CheckCircle, XCircle, Shield } from 'lucide-react';

interface AccessibilityIssue {
  type: 'error' | 'warning' | 'info';
  message: string;
  element?: string;
}

interface AccessibilityCheckerProps {
  content: string;
}

export const AccessibilityChecker = ({ content }: AccessibilityCheckerProps) => {
  const [issues, setIssues] = useState<AccessibilityIssue[]>([]);
  const [score, setScore] = useState(100);

  useEffect(() => {
    checkAccessibility();
  }, [content]);

  const checkAccessibility = () => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const foundIssues: AccessibilityIssue[] = [];

    // Check for images without alt text
    const images = doc.querySelectorAll('img');
    images.forEach((img, index) => {
      if (!img.getAttribute('alt')) {
        foundIssues.push({
          type: 'error',
          message: `Image ${index + 1} is missing alt text`,
          element: 'img'
        });
      }
    });

    // Check heading structure
    const headings = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');
    let lastLevel = 0;
    headings.forEach((heading, index) => {
      const level = parseInt(heading.tagName.charAt(1));
      if (index === 0 && level !== 1) {
        foundIssues.push({
          type: 'warning',
          message: 'Document should start with an H1 heading',
          element: heading.tagName.toLowerCase()
        });
      }
      if (level > lastLevel + 1) {
        foundIssues.push({
          type: 'warning',
          message: `Heading level skipped from H${lastLevel} to H${level}`,
          element: heading.tagName.toLowerCase()
        });
      }
      lastLevel = level;
    });

    // Check for empty headings
    headings.forEach((heading, index) => {
      if (!heading.textContent?.trim()) {
        foundIssues.push({
          type: 'error',
          message: `Heading ${index + 1} is empty`,
          element: heading.tagName.toLowerCase()
        });
      }
    });

    // Check links
    const links = doc.querySelectorAll('a');
    links.forEach((link, index) => {
      if (!link.textContent?.trim()) {
        foundIssues.push({
          type: 'error',
          message: `Link ${index + 1} has no text content`,
          element: 'a'
        });
      }
      if (link.getAttribute('href') === '#') {
        foundIssues.push({
          type: 'warning',
          message: `Link ${index + 1} has placeholder href`,
          element: 'a'
        });
      }
    });

    // Check color contrast (simplified)
    const elementsWithColor = doc.querySelectorAll('[style*="color"]');
    if (elementsWithColor.length > 0) {
      foundIssues.push({
        type: 'info',
        message: 'Manual color contrast check recommended for colored text',
        element: 'style'
      });
    }

    // Calculate accessibility score
    const errorCount = foundIssues.filter(issue => issue.type === 'error').length;
    const warningCount = foundIssues.filter(issue => issue.type === 'warning').length;
    const newScore = Math.max(0, 100 - (errorCount * 15) - (warningCount * 5));

    setIssues(foundIssues);
    setScore(newScore);
  };

  const getScoreColor = () => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreIcon = () => {
    if (score >= 90) return <CheckCircle className="h-4 w-4 text-green-600" />;
    if (score >= 70) return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
    return <XCircle className="h-4 w-4 text-red-600" />;
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-2">
          <Shield className="h-4 w-4" />
          <span className={getScoreColor()}>A11y: {score}%</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getScoreIcon()}
            Accessibility Report
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Accessibility Score</span>
            <Badge variant={score >= 90 ? 'default' : score >= 70 ? 'secondary' : 'destructive'}>
              {score}%
            </Badge>
          </div>
          
          <ScrollArea className="h-64">
            <div className="space-y-2">
              {issues.length === 0 ? (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    No accessibility issues found! Great job!
                  </AlertDescription>
                </Alert>
              ) : (
                issues.map((issue, index) => (
                  <Alert key={index} variant={issue.type === 'error' ? 'destructive' : 'default'}>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <div className="flex items-center justify-between">
                        <span>{issue.message}</span>
                        <Badge variant="outline" className="text-xs">
                          {issue.element}
                        </Badge>
                      </div>
                    </AlertDescription>
                  </Alert>
                ))
              )}
            </div>
          </ScrollArea>

          <div className="text-sm text-muted-foreground">
            <p>This checker provides basic accessibility guidelines. For comprehensive testing, use dedicated tools like axe or WAVE.</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};