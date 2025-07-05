
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { db } from './config';

export type ContentType = 'home' | 'experience' | 'apps' | 'projects' | 'blogs' | 'about' | 'contact';

export interface ContentItem {
  id: string;
  page_type: ContentType;
  title: string;
  content: any;
  status: string;
  created_at: string;
  updated_at: string;
}

// Get all content for a specific page type
export const getContentByPageType = async (pageType: ContentType): Promise<ContentItem[]> => {
  try {
    const q = query(
      collection(db, 'page_content'), 
      where('page_type', '==', pageType),
      orderBy('created_at', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      created_at: doc.data().created_at?.toDate().toISOString() || new Date().toISOString(),
      updated_at: doc.data().updated_at?.toDate().toISOString() || new Date().toISOString(),
    })) as ContentItem[];
  } catch (error) {
    console.error('Error getting content:', error);
    throw error;
  }
};

// Get content counts by page type
export const getContentCounts = async (): Promise<Record<string, number>> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'page_content'));
    const counts: Record<string, number> = {};
    
    querySnapshot.docs.forEach(doc => {
      const pageType = doc.data().page_type;
      counts[pageType] = (counts[pageType] || 0) + 1;
    });
    
    return counts;
  } catch (error) {
    console.error('Error getting content counts:', error);
    throw error;
  }
};

// Create new content
export const createContent = async (data: Omit<ContentItem, 'id' | 'created_at' | 'updated_at'>) => {
  try {
    const docRef = await addDoc(collection(db, 'page_content'), {
      ...data,
      created_at: Timestamp.now(),
      updated_at: Timestamp.now(),
    });
    return { id: docRef.id, error: null };
  } catch (error: any) {
    return { id: null, error: error.message };
  }
};

// Update existing content
export const updateContent = async (id: string, data: Partial<ContentItem>) => {
  try {
    const docRef = doc(db, 'page_content', id);
    await updateDoc(docRef, {
      ...data,
      updated_at: Timestamp.now(),
    });
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

// Delete content
export const deleteContent = async (id: string) => {
  try {
    await deleteDoc(doc(db, 'page_content', id));
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};
