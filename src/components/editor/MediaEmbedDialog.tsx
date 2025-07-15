import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Video, Link2, Code } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MediaEmbedDialogProps {
  open: boolean;
  onClose: () => void;
  onEmbed: (embedCode: string) => void;
}

const MediaEmbedDialog: React.FC<MediaEmbedDialogProps> = ({
  open,
  onClose,
  onEmbed,
}) => {
  const [url, setUrl] = useState('');
  const [customHTML, setCustomHTML] = useState('');
  const { toast } = useToast();

  const getYouTubeEmbedCode = (url: string): string | null => {
    const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
    const match = url.match(youtubeRegex);
    
    if (match) {
      const videoId = match[1];
      return `<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>`;
    }
    return null;
  };

  const getVimeoEmbedCode = (url: string): string | null => {
    const vimeoRegex = /(?:vimeo\.com\/)([0-9]+)/;
    const match = url.match(vimeoRegex);
    
    if (match) {
      const videoId = match[1];
      return `<iframe src="https://player.vimeo.com/video/${videoId}" width="560" height="315" frameborder="0" allowfullscreen></iframe>`;
    }
    return null;
  };

  const getTwitterEmbedCode = (url: string): string | null => {
    const twitterRegex = /(?:twitter\.com|x\.com)\/\w+\/status\/(\d+)/;
    const match = url.match(twitterRegex);
    
    if (match) {
      return `<blockquote class="twitter-tweet"><a href="${url}"></a></blockquote><script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>`;
    }
    return null;
  };

  const handleURLEmbed = () => {
    if (!url.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a valid URL',
        variant: 'destructive',
      });
      return;
    }

    let embedCode = getYouTubeEmbedCode(url) || 
                   getVimeoEmbedCode(url) || 
                   getTwitterEmbedCode(url);

    if (!embedCode) {
      // Generic iframe for other URLs
      embedCode = `<iframe src="${url}" width="560" height="315" frameborder="0"></iframe>`;
    }

    onEmbed(embedCode);
    onClose();
    setUrl('');
    
    toast({
      title: 'Success',
      description: 'Media embedded successfully!',
    });
  };

  const handleCustomHTML = () => {
    if (!customHTML.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter valid HTML code',
        variant: 'destructive',
      });
      return;
    }

    onEmbed(customHTML);
    onClose();
    setCustomHTML('');
    
    toast({
      title: 'Success',
      description: 'Custom HTML embedded successfully!',
    });
  };

  const exampleUrls = [
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://vimeo.com/123456789',
    'https://twitter.com/user/status/123456789',
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Video className="h-4 w-4" />
            Embed Media
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="url" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="url" className="flex items-center gap-2">
              <Link2 className="h-4 w-4" />
              URL
            </TabsTrigger>
            <TabsTrigger value="html" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              Custom HTML
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="url" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="media-url">Media URL</Label>
              <Input
                id="media-url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter YouTube, Vimeo, Twitter, or other media URL..."
                autoFocus
              />
              <div className="text-xs text-muted-foreground">
                Supported: YouTube, Vimeo, Twitter/X, and other embeddable URLs
              </div>
            </div>

            <div className="space-y-2">
              <Label>Examples:</Label>
              <div className="space-y-1">
                {exampleUrls.map((exampleUrl, index) => (
                  <button
                    key={index}
                    onClick={() => setUrl(exampleUrl)}
                    className="block w-full text-left text-xs text-muted-foreground hover:text-foreground transition-colors p-1 rounded hover:bg-muted"
                  >
                    {exampleUrl}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleURLEmbed}
                className="flex-1"
              >
                Embed URL
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="html" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="custom-html">Custom HTML Code</Label>
              <Textarea
                id="custom-html"
                value={customHTML}
                onChange={(e) => setCustomHTML(e.target.value)}
                placeholder="Paste your custom HTML embed code here..."
                rows={6}
                className="font-mono text-sm"
              />
              <div className="text-xs text-muted-foreground">
                Enter any custom HTML embed code (iframes, scripts, etc.)
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCustomHTML}
                className="flex-1"
              >
                Insert HTML
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default MediaEmbedDialog;