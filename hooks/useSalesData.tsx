import { useState, useEffect } from 'react';
import type { SalesData } from '../types';
import { SUPABASE_FUNCTION_BASE_URL, USE_MOCK_DATA, MOCK_SALES_DATA } from '../constants';

interface UseSalesDataReturn {
  data: SalesData | null;
  isLoading: boolean;
  error: string | null;
}

export const useSalesData = (companyId: string | undefined): UseSalesDataReturn => {
  const [data, setData] = useState<SalesData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!companyId) {
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      if (USE_MOCK_DATA) {
        console.log(`Using mock data for company: ${companyId}`);
        setTimeout(() => {
            setData(MOCK_SALES_DATA[companyId]);
            setIsLoading(false);
        }, 500); // Simulate network delay
        return;
      }
      
      if(SUPABASE_FUNCTION_BASE_URL.includes('<your-project-ref>')) {
        setError("Please update the 'SUPABASE_FUNCTION_BASE_URL' in constants.ts with your actual Supabase function URL.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`${SUPABASE_FUNCTION_BASE_URL}${companyId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.statusText}`);
        }
        const salesData: SalesData = await response.json();
        setData(salesData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        console.error("Error fetching sales data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [companyId]);

  return { data, isLoading, error };
};
