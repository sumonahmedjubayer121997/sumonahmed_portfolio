import { useState } from 'react';
import RichContentEditor from './RichContentEditor';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const RichContentEditorDemo = () => {
  const [savedContent, setSavedContent] = useState('');
  const [savedImages, setSavedImages] = useState<string[]>([]);

  const handleSave = (content: string, images: string[]) => {
    setSavedContent(content);
    setSavedImages(images);
    console.log('Saved content:', content);
    console.log('Saved images:', images);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Rich Content Editor Demo</CardTitle>
          <CardDescription>
            Drag and drop images directly into the editor or use the upload button. 
            Images are automatically uploaded to Firebase Storage and embedded in the content.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RichContentEditor
            initialContent="<h2>Welcome to the Rich Content Editor!</h2><p>You can drag and drop images here or use the upload button. Try creating some content with formatting and images.</p>"
            onSave={handleSave}
            autoSave={true}
            documentId="demo-content"
            collectionName="demo"
            placeholder="Start writing your rich content with images..."
          />
        </CardContent>
      </Card>

      {savedContent && (
        <Card>
          <CardHeader>
            <CardTitle>Saved Content Preview</CardTitle>
            <CardDescription>
              This shows how the saved content would be rendered
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div 
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: savedContent }} 
            />
            {savedImages.length > 0 && (
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Uploaded Images ({savedImages.length}):</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {savedImages.map((imageUrl, index) => (
                    <img 
                      key={index} 
                      src={imageUrl} 
                      alt={`Uploaded ${index + 1}`}
                      className="rounded border max-h-20 object-cover"
                    />
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RichContentEditorDemo;