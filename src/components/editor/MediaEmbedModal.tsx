import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Youtube, Twitter, Code, Film } from 'lucide-react';

interface MediaEmbedModalProps {
  onEmbed: (type: string, content: string) => void;
  children: React.ReactNode;
}

export const MediaEmbedModal = ({ onEmbed, children }: MediaEmbedModalProps) => {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [twitterUrl, setTwitterUrl] = useState('');
  const [customHtml, setCustomHtml] = useState('');
  const [open, setOpen] = useState(false);

  const extractYouTubeId = (url: string) => {
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const extractTwitterId = (url: string) => {
    const regex = /twitter\.com\/\w+\/status\/(\d+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const handleYouTubeEmbed = () => {
    const videoId = extractYouTubeId(youtubeUrl);
    if (videoId) {
      const embedHtml = `<div class="video-embed" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden;">
        <iframe 
          src="https://www.youtube.com/embed/${videoId}" 
          style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
          frameborder="0" 
          allowfullscreen>
        </iframe>
      </div>`;
      onEmbed('video', embedHtml);
      setYoutubeUrl('');
      setOpen(false);
    }
  };

  const handleTwitterEmbed = () => {
    const tweetId = extractTwitterId(twitterUrl);
    if (tweetId) {
      const embedHtml = `<blockquote class="twitter-tweet">
        <a href="${twitterUrl}"></a>
      </blockquote>
      <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>`;
      onEmbed('social', embedHtml);
      setTwitterUrl('');
      setOpen(false);
    }
  };

  const handleCustomHtmlEmbed = () => {
    if (customHtml.trim()) {
      onEmbed('html', customHtml);
      setCustomHtml('');
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Film className="h-5 w-5" />
            Embed Media
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="youtube" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="youtube" className="flex items-center gap-1">
              <Youtube className="h-4 w-4" />
              YouTube
            </TabsTrigger>
            <TabsTrigger value="twitter" className="flex items-center gap-1">
              <Twitter className="h-4 w-4" />
              Twitter
            </TabsTrigger>
            <TabsTrigger value="html" className="flex items-center gap-1">
              <Code className="h-4 w-4" />
              HTML
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="youtube" className="space-y-4">
            <div>
              <Label htmlFor="youtube-url">YouTube URL</Label>
              <Input
                id="youtube-url"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
              />
            </div>
            <Button onClick={handleYouTubeEmbed} className="w-full" disabled={!youtubeUrl}>
              Embed YouTube Video
            </Button>
          </TabsContent>
          
          <TabsContent value="twitter" className="space-y-4">
            <div>
              <Label htmlFor="twitter-url">Twitter URL</Label>
              <Input
                id="twitter-url"
                value={twitterUrl}
                onChange={(e) => setTwitterUrl(e.target.value)}
                placeholder="https://twitter.com/user/status/..."
              />
            </div>
            <Button onClick={handleTwitterEmbed} className="w-full" disabled={!twitterUrl}>
              Embed Tweet
            </Button>
          </TabsContent>
          
          <TabsContent value="html" className="space-y-4">
            <div>
              <Label htmlFor="custom-html">Custom HTML</Label>
              <Textarea
                id="custom-html"
                value={customHtml}
                onChange={(e) => setCustomHtml(e.target.value)}
                placeholder="Enter your custom HTML code..."
                rows={4}
              />
            </div>
            <Button onClick={handleCustomHtmlEmbed} className="w-full" disabled={!customHtml.trim()}>
              Insert HTML
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};