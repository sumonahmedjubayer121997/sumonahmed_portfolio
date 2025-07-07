
import { useState, useEffect } from 'react';
import { getDynamicContent } from '@/integrations/firebase/firestore';

interface ContactItem {
  id: string;
  type: 'email' | 'phone' | 'twitter' | 'linkedin' | 'github' | 'other';
  displayText: string;
  url?: string;
  notes?: string;
  sortOrder: number;
  isVisible: boolean;
}

export const useContactData = () => {
  const [contacts, setContacts] = useState<ContactItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await getDynamicContent('contact_items');
      
      if (fetchError) {
        setError(fetchError);
        return;
      }

      const contactsArray = Array.isArray(data) ? data : [];
      const visibleContacts = contactsArray
        .filter(contact => contact.isVisible)
        .sort((a, b) => a.sortOrder - b.sortOrder);
      
      setContacts(visibleContacts);
      setError(null);
    } catch (err) {
      console.error('Error fetching contacts:', err);
      setError('Failed to fetch contacts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  return { contacts, loading, error, refetch: fetchContacts };
};
