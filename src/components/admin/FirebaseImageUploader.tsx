import React, { useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/integrations/firebase/config';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface FirebaseImageUploaderProps {
  onUploadComplete: (url: string) => void;
  folder?: string;
}

const FirebaseImageUploader: React.FC<FirebaseImageUploaderProps> = ({ 
  onUploadComplete, 
  folder = 'public/images' 
}) => {
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      
      // Create a reference to the file location
      const fileName = `${folder}/${file.name}`;
      const storageRef = ref(storage, fileName);
      
      // Upload the file
      const snapshot = await uploadBytes(storageRef, file);
      
      // Get the download URL
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      toast.success('Image uploaded successfully!');
      onUploadComplete(downloadURL);
      
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="image-upload" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Upload Image to Firebase Storage
        </label>
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          disabled={uploading}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>
      
      {uploading && (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Uploading image...
        </div>
      )}
    </div>
  );
};

export default FirebaseImageUploader;