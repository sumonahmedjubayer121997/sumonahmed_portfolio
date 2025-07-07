import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/integrations/firebase/config';

export const uploadBloodDonationImage = async (): Promise<string> => {
  try {
    // Create a blood donation preview image blob (you would replace this with actual image data)
    // For now, we'll create a placeholder that can be replaced with the actual image
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Create a gradient background
      const gradient = ctx.createLinearGradient(0, 0, 800, 600);
      gradient.addColorStop(0, '#ef4444');
      gradient.addColorStop(1, '#dc2626');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 800, 600);
      
      // Add text
      ctx.fillStyle = 'white';
      ctx.font = 'bold 48px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Blood Donation Guide', 400, 250);
      
      ctx.font = '24px Arial';
      ctx.fillText('Connect Donors with Those in Need', 400, 300);
      
      // Add a heart symbol
      ctx.font = '72px Arial';
      ctx.fillText('♥', 400, 400);
    }
    
    // Convert canvas to blob
    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob!);
      }, 'image/png');
    });
    
    // Create a reference to the file location in Firebase Storage
    const fileName = 'public/images/blood-donation-preview.png';
    const storageRef = ref(storage, fileName);
    
    // Upload the file
    const snapshot = await uploadBytes(storageRef, blob);
    
    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    console.log('Blood donation image uploaded successfully:', downloadURL);
    return downloadURL;
    
  } catch (error) {
    console.error('Error uploading blood donation image:', error);
    throw error;
  }
};

// Helper function to get the public URL for the blood donation image
export const getBloodDonationImageUrl = (): string => {
  // This is the expected public URL format for Firebase Storage
  const projectId = 'taskwise-n03h6'; // From your Firebase config
  const bucketName = `${projectId}.firebasestorage.app`;
  return `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/public%2Fimages%2Fblood-donation-preview.png?alt=media`;
};