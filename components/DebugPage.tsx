import React, { useState, useEffect } from 'react';
import { SUPABASE_FUNCTION_BASE_URL } from '../constants';
import FinalDiagnosticReport from './common/FinalDiagnosticReport';

// Define the shape of the data we expect from the 'check-secrets' function
interface SecretStatus {
  key: string;
  isSet: boolean;
  status: string;
  hint: string;
}

const CHECK_SECRETS_FUNCTION_NAME = 'check-secrets';
const CHECK_SECRETS_URL = `${SUPABASE_FUNCTION_BASE_URL}${CHECK_SECRETS_FUNCTION_NAME}`;

const DebugPage: React.FC = () => {
  const [secretsStatus, setSecretsStatus] = useState<SecretStatus[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSecretsStatus = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(CHECK_SECRETS_URL);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch secrets status');
        }
        const data: SecretStatus[] = await response.json();
        setSecretsStatus(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'An unknown error occurred';
        setError(message);
        console.error("Error fetching secrets status:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSecretsStatus();
  }, []);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">System Diagnostics</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          This page checks the health of the application's backend configuration, primarily the Supabase secrets.
        </p>
        
        <div className="mt-8">
          {isLoading && <p className="dark:text-white">Running diagnostics...</p>}
          {error && <div className="p-4 text-red-700 bg-red-100 rounded-lg dark:bg-red-900 dark:text-red-200"><strong>Error:</strong> {error}</div>}
          {!isLoading && !error && (
            <FinalDiagnosticReport secretChecks={secretsStatus} />
          )}
        </div>
      </div>
    </div>
  );
};

export default DebugPage;
