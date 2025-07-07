
import { useState, useEffect } from 'react';
import { getDynamicContent } from '@/integrations/firebase/firestore';

interface ResponseTimeItem {
  id: string;
  platform: string;
  timeframe: string;
  description?: string;
  sortOrder: number;
  isVisible: boolean;
}

export const useResponseTimeData = () => {
  const [responseTimes, setResponseTimes] = useState<ResponseTimeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchResponseTimes = async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await getDynamicContent('response_times');
      
      if (fetchError) {
        setError(fetchError);
        return;
      }

      const responseTimesArray = Array.isArray(data) ? data : [];
      const visibleResponseTimes = responseTimesArray
        .filter(rt => rt.isVisible)
        .sort((a, b) => a.sortOrder - b.sortOrder);
      
      setResponseTimes(visibleResponseTimes);
      setError(null);
    } catch (err) {
      console.error('Error fetching response times:', err);
      setError('Failed to fetch response times');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResponseTimes();
  }, []);

  return { responseTimes, loading, error, refetch: fetchResponseTimes };
};
