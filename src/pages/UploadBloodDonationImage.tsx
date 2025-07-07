import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { uploadBloodDonationImage } from '@/utils/uploadBloodDonationImage';
import FirebaseImageUploader from '@/components/admin/FirebaseImageUploader';

const UploadBloodDonationImage: React.FC = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string>('');

  const handleAutoUpload = async () => {
    try {
      setUploading(true);
      const url = await uploadBloodDonationImage();
      setUploadedUrl(url);
      toast.success('Blood donation image uploaded successfully!');
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleManualUpload = (url: string) => {
    setUploadedUrl(url);
    console.log('Manual upload completed. URL:', url);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Upload Blood Donation Image</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Upload the blood donation preview image to Firebase Storage
        </p>
      </div>

      <div className="space-y-4">
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-2">Option 1: Auto-generate Preview</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Generate a placeholder blood donation image automatically
          </p>
          <Button 
            onClick={handleAutoUpload} 
            disabled={uploading}
            className="w-full"
          >
            {uploading ? 'Uploading...' : 'Generate & Upload Image'}
          </Button>
        </div>

        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-2">Option 2: Upload Custom Image</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Upload your own blood donation guide image
          </p>
          <FirebaseImageUploader 
            onUploadComplete={handleManualUpload}
            folder="public/images"
          />
        </div>
      </div>

      {uploadedUrl && (
        <div className="border rounded-lg p-4 bg-green-50 dark:bg-green-900/20">
          <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">
            ✅ Upload Successful!
          </h3>
          <p className="text-sm text-green-700 dark:text-green-300 mb-2">
            Public URL:
          </p>
          <code className="block p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs break-all">
            {uploadedUrl}
          </code>
          <div className="mt-4">
            <img 
              src={uploadedUrl} 
              alt="Blood Donation Guide preview" 
              className="w-full max-w-md mx-auto rounded-lg"
              style={{ borderRadius: '8px' }}
            />
          </div>
        </div>
      )}

      <div className="text-sm text-gray-500 dark:text-gray-400">
        <p><strong>Firebase Storage Path:</strong> public/images/blood-donation-preview.png</p>
        <p><strong>Expected Public URL:</strong></p>
        <code className="block mt-1 text-xs break-all">
          https://firebasestorage.googleapis.com/v0/b/taskwise-n03h6.firebasestorage.app/o/public%2Fimages%2Fblood-donation-preview.png?alt=media
        </code>
      </div>
    </div>
  );
};

export default UploadBloodDonationImage;