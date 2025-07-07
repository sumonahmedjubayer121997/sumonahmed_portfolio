import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X, Upload, Link as LinkIcon } from 'lucide-react';
import { toast } from 'sonner';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/integrations/firebase/config';

interface ScreenshotUploaderProps {
  screenshots: string[];
  onScreenshotsChange: (screenshots: string[]) => void;
}

const ScreenshotUploader: React.FC<ScreenshotUploaderProps> = ({
  screenshots,
  onScreenshotsChange
}) => {
  const [urlInput, setUrlInput] = useState('');
  const [uploading, setUploading] = useState(false);

  const addScreenshotUrl = () => {
    const trimmedUrl = urlInput.trim();
    if (trimmedUrl) {
      try {
        new URL(trimmedUrl); // Validate URL
        if (!screenshots.includes(trimmedUrl)) {
          onScreenshotsChange([...screenshots, trimmedUrl]);
          setUrlInput('');
        } else {
          toast.error('This URL is already added');
        }
      } catch {
        toast.error('Please enter a valid URL');
      }
    }
  };

  const removeScreenshot = (index: number) => {
    const newScreenshots = screenshots.filter((_, i) => i !== index);
    onScreenshotsChange(newScreenshots);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setUploading(true);
    try {
      const newUrls: string[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Generate unique filename with timestamp
        const timestamp = Date.now();
        const fileName = `apps/screenshots/${timestamp}-${file.name}`;
        
        // Create Firebase Storage reference
        const storageRef = ref(storage, fileName);
        
        // Upload file to Firebase Storage
        console.log('Uploading file to Firebase Storage:', fileName);
        const snapshot = await uploadBytes(storageRef, file);
        
        // Get the public download URL
        const downloadURL = await getDownloadURL(snapshot.ref);
        console.log('File uploaded successfully, URL:', downloadURL);
        
        newUrls.push(downloadURL);
      }
      
      onScreenshotsChange([...screenshots, ...newUrls]);
      toast.success(`${files.length} screenshot(s) uploaded to Firebase Storage`);
    } catch (error) {
      console.error('Firebase upload error:', error);
      toast.error('Failed to upload screenshots to Firebase Storage');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* File Upload */}
      <div>
        <label className="text-sm font-medium mb-2 block">Upload Files</label>
        <div className="flex items-center gap-2">
          <Input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileUpload}
            disabled={uploading}
            className="file:mr-2 file:rounded file:border-0 file:bg-primary file:text-primary-foreground file:text-sm"
          />
          {uploading && (
            <div className="text-sm text-gray-500">Uploading...</div>
          )}
        </div>
      </div>

      {/* URL Input */}
      <div>
        <label className="text-sm font-medium mb-2 block">Add by URL</label>
        <div className="flex gap-2">
          <Input
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://example.com/screenshot.jpg"
            onKeyPress={(e) => e.key === 'Enter' && addScreenshotUrl()}
          />
          <Button
            type="button"
            variant="outline"
            onClick={addScreenshotUrl}
            disabled={!urlInput.trim()}
          >
            <LinkIcon className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Screenshots Grid */}
      {screenshots.length > 0 && (
        <div>
          <label className="text-sm font-medium mb-2 block">
            Screenshots ({screenshots.length})
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {screenshots.map((screenshot, index) => (
              <Card key={index} className="relative">
                <CardContent className="p-2">
                  <img
                    src={screenshot}
                    alt={`Screenshot ${index + 1}`}
                    className="w-full h-24 object-cover rounded"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder.svg';
                    }}
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-1 right-1 w-6 h-6 p-0"
                    onClick={() => removeScreenshot(index)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ScreenshotUploader;