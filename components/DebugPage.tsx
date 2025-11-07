import React, { useState, useEffect } from 'react';
import { SUPABASE_FUNCTION_BASE_URL } from '../constants';

const CHECK_SECRETS_FUNCTION_NAME = 'check-secrets';
const CHECK_SECRETS_URL = `${SUPABASE_FUNCTION_BASE_URL}${CHECK_SECRETS_FUNCTION_NAME}`;

interface SecretCheck {
  secret: string;
  status: 'SET' | 'MISSING';
}

const DebugPage: React.FC = () => {
  const [secretChecks, setSecretChecks] = useState<SecretCheck[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSecretStatus = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(CHECK_SECRETS_URL);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch secret status');
        }
        const data = await response.json();
        setSecretChecks(data.checks);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSecretStatus();
  }, []);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Debug & Diagnostics</h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          This page checks the configuration of the Supabase backend functions and secrets.
        </p>
        
        <div className="mt-8 p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Supabase Secret Status</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            The following secrets are required for the application to function correctly.
          </p>

          {isLoading && <div className="mt-4 text-center">Loading status...</div>}
          {error && <div className="mt-4 p-3 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800">{error}</div>}
          
          {!isLoading && !error && (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3">Secret Name</th>
                    <th scope="col" className="px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {secretChecks.map((check) => (
                    <tr key={check.secret} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                      <td className="px-6 py-4 font-mono text-gray-900 dark:text-white">{check.secret}</td>
                      <td className="px-6 py-4">
                        {check.status === 'SET' ? (
                          <span className="px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full dark:bg-green-900 dark:text-green-300">
                            SET
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs font-medium text-red-800 bg-red-100 rounded-full dark:bg-red-900 dark:text-red-300">
                            MISSING
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DebugPage;
