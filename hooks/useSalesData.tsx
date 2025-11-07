import { useState, useEffect } from 'react';
import type { SalesData } from '../types';
import { SUPABASE_FUNCTION_BASE_URL, ODOO_SALES_FUNCTION_NAME } from '../constants';

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
      
      try {
        const functionUrl = `${SUPABASE_FUNCTION_BASE_URL}${ODOO_SALES_FUNCTION_NAME}/${companyId}`;
        const response = await fetch(functionUrl);
        
        // Try to parse the body regardless of status, as Supabase functions
        // send a JSON body even for errors.
        const responseBody = await response.json();

        if (!response.ok) {
          // If the JSON body has a specific 'error' message from our function, use it.
          // Otherwise, fall back to a generic error.
          const errorMessage = responseBody.error || `Request failed with status ${response.status}`;
          throw new Error(errorMessage);
        }
        
        // If the response was OK, the body is our sales data.
        const salesData: SalesData = responseBody;
        setData(salesData);

      } catch (err) {
        // The error message from the `throw` above will be caught here.
        // We also catch potential JSON parsing errors if the response is not JSON.
        const displayError = err instanceof Error ? err.message : 'An unknown error occurred';
        setError(displayError);
        console.error("Error fetching sales data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [companyId]);

  return { data, isLoading, error };
};
