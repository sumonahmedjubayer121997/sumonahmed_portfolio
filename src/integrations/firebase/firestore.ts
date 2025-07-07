
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
  Timestamp ,
  getFirestore, setDoc, 
   onSnapshot, 
  QuerySnapshot, 
  DocumentSnapshot, 
  CollectionReference, 
  DocumentReference 
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



////////////////////////////////////Mine ////////////////////////////////////
//Creating content;



/**
 * Save or update data dynamically to any collection
 * 
 * @param collectionName - name of the Firestore collection (e.g. 'apps', 'home')
 * @param data - data object to save
 * @param docId - optional docId; if provided, updates that document; else creates a new one
 * @returns result with id and error
 **/
const dbFire = getFirestore();
export const saveDynamicContent = async (
  collectionName: string, 
  data: any, 
  docId?: string
) => {
  try {
    if (docId) {
      // Update existing document
      const docRef = doc(dbFire, collectionName, docId);
      await updateDoc(docRef, data);
      return { id: docRef.id, error: null };
    } else {
      // Create new document
      const docRef = await addDoc(collection(dbFire, collectionName), data);
      return { id: docRef.id, error: null };
    }
  } catch (error: any) {
    console.error(`Error saving to ${collectionName}:`, error);
    return { id: null, error: error.message };
  }
};




/**
 * Dynamically get content from Firestore
 * 
 * @param collectionName - Firestore collection name
 * @param docId - optional document ID to fetch a specific doc
 * @returns data (object or array), error (string or null)
 */
export const getDynamicContent = async (
  collectionName: string,
  docId?: string
) => {
  try {
    if (docId) {
      // Get a single document
      const docRef = doc(dbFire, collectionName, docId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { data: { id: docSnap.id, ...docSnap.data() }, error: null };
      } else {
        return { data: null, error: `Document with ID ${docId} not found in ${collectionName}` };
      }
    } else {
      // Get all documents in the collection
      const querySnapshot = await getDocs(collection(dbFire, collectionName));
      const docs = querySnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      return { data: docs, error: null };
    }
  } catch (error: any) {
    console.error(`Error fetching from ${collectionName}:`, error);
    return { data: null, error: error.message };
  }
};



export const listenDynamicContent = (
  collectionName: string,
  docId: string | null,
  onData: (data: any) => void,
  onError?: (error: any) => void
) => {
  try {
    if (docId) {
      const docRef: DocumentReference = doc(dbFire, collectionName, docId);
      const unsubscribe = onSnapshot(docRef, 
        (docSnap: DocumentSnapshot) => {
          if (docSnap.exists()) {
            onData({ id: docSnap.id, ...docSnap.data() });
          } else {
            onData(null);
          }
        },
        (error) => {
          console.error(`Error listening to ${collectionName}/${docId}:`, error);
          if (onError) onError(error);
        }
      );
      return unsubscribe;
    } else {
      const colRef: CollectionReference = collection(dbFire, collectionName);
      const unsubscribe = onSnapshot(colRef, 
        (querySnap: QuerySnapshot) => {
          const docs = querySnap.docs.map(d => ({ id: d.id, ...d.data() }));
          onData(docs);
        },
        (error) => {
          console.error(`Error listening to ${collectionName}:`, error);
          if (onError) onError(error);
        }
      );
      return unsubscribe;
    }
  } catch (error: any) {
    console.error(`Error setting up listener for ${collectionName}:`, error);
    if (onError) onError(error);
    return () => {}; // return no-op unsubscribe on error
  }
};