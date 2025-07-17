
import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  Timestamp,
  writeBatch
} from 'firebase/firestore';
import { db } from '@/integrations/firebase/config';
import { IconCategory, CategoryIcon } from '@/types/iconCategories';

// Icon Categories CRUD operations
export const createIconCategory = async (data: Omit<IconCategory, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const docRef = await addDoc(collection(db, 'icon_categories'), {
      ...data,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return { id: docRef.id, error: null };
  } catch (error: any) {
    console.error('Error creating icon category:', error);
    return { id: null, error: error.message };
  }
};

export const getAllIconCategories = async (): Promise<IconCategory[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'icon_categories'));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate().toISOString() || new Date().toISOString(),
      updatedAt: doc.data().updatedAt?.toDate().toISOString() || new Date().toISOString(),
    })) as IconCategory[];
  } catch (error) {
    console.error('Error getting icon categories:', error);
    return [];
  }
};

export const updateIconCategory = async (id: string, data: Partial<IconCategory>) => {
  try {
    const docRef = doc(db, 'icon_categories', id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now(),
    });
    return { error: null };
  } catch (error: any) {
    console.error('Error updating icon category:', error);
    return { error: error.message };
  }
};

export const deleteIconCategory = async (id: string) => {
  try {
    const batch = writeBatch(db);
    
    // Delete the category
    const categoryRef = doc(db, 'icon_categories', id);
    batch.delete(categoryRef);
    
    // Delete all icons in this category
    const iconsQuery = query(collection(db, 'category_icons'), where('categoryId', '==', id));
    const iconsSnapshot = await getDocs(iconsQuery);
    
    iconsSnapshot.docs.forEach(iconDoc => {
      batch.delete(iconDoc.ref);
    });
    
    await batch.commit();
    return { error: null };
  } catch (error: any) {
    console.error('Error deleting icon category:', error);
    return { error: error.message };
  }
};

// Category Icons CRUD operations
export const addIconToCategory = async (data: Omit<CategoryIcon, 'id' | 'createdAt'>) => {
  try {
    // Check if icon already exists in this category
    const existingQuery = query(
      collection(db, 'category_icons'), 
      where('categoryId', '==', data.categoryId),
      where('iconName', '==', data.iconName)
    );
    const existingSnapshot = await getDocs(existingQuery);
    
    if (!existingSnapshot.empty) {
      return { id: null, error: 'Icon already exists in this category' };
    }
    
    const docRef = await addDoc(collection(db, 'category_icons'), {
      ...data,
      createdAt: Timestamp.now(),
    });
    return { id: docRef.id, error: null };
  } catch (error: any) {
    console.error('Error adding icon to category:', error);
    return { id: null, error: error.message };
  }
};

export const getIconsByCategory = async (categoryId: string): Promise<CategoryIcon[]> => {
  try {
    const q = query(collection(db, 'category_icons'), where('categoryId', '==', categoryId));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate().toISOString() || new Date().toISOString(),
    })) as CategoryIcon[];
  } catch (error) {
    console.error('Error getting icons by category:', error);
    return [];
  }
};

export const removeIconFromCategory = async (iconId: string) => {
  try {
    await deleteDoc(doc(db, 'category_icons', iconId));
    return { error: null };
  } catch (error: any) {
    console.error('Error removing icon from category:', error);
    return { error: error.message };
  }
};

export const getAllCategorizedIcons = async () => {
  try {
    const [categoriesSnapshot, iconsSnapshot] = await Promise.all([
      getDocs(collection(db, 'icon_categories')),
      getDocs(collection(db, 'category_icons'))
    ]);
    
    const categories = categoriesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as IconCategory[];
    
    const icons = iconsSnapshot.docs.map(doc => {
      const iconData = doc.data();
      const category = categories.find(cat => cat.id === iconData.categoryId);
      
      return {
        id: doc.id,
        ...iconData,
        categoryName: category?.name || 'Unknown',
        categoryColor: category?.color || '#6B7280',
        createdAt: iconData.createdAt?.toDate().toISOString() || new Date().toISOString(),
      };
    });
    
    return { categories, icons, error: null };
  } catch (error: any) {
    console.error('Error getting categorized icons:', error);
    return { categories: [], icons: [], error: error.message };
  }
};

// Initialize default categories
export const initializeDefaultCategories = async () => {
  try {
    const existingCategories = await getAllIconCategories();
    
    if (existingCategories.length === 0) {
      const defaultCategories = [
        { name: 'Frontend', description: 'Frontend frameworks and libraries', color: '#3B82F6' },
        { name: 'Backend', description: 'Backend frameworks and server technologies', color: '#10B981' },
        { name: 'DevOps', description: 'DevOps tools and cloud platforms', color: '#F59E0B' },
        { name: 'Programming Languages', description: 'Programming languages and runtimes', color: '#8B5CF6' },
        { name: 'Databases', description: 'Database systems and storage solutions', color: '#EF4444' },
        { name: 'Mobile', description: 'Mobile development frameworks', color: '#06B6D4' },
        { name: 'Design & UI', description: 'Design tools and UI libraries', color: '#EC4899' }
      ];
      
      for (const category of defaultCategories) {
        await createIconCategory(category);
      }
      
      console.log('Default categories initialized');
    }
  } catch (error) {
    console.error('Error initializing default categories:', error);
  }
};
