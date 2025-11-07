import React, { useState, useEffect } from 'react';
import { SUPABASE_FUNCTION_BASE_URL } from '../constants';
import FinalDiagnosticReport from './common/FinalDiagnosticReport';

const CHECK_SECRETS_FUNCTION_NAME = 'check-secrets';

interface SecretStatus {
  name: string;
  isSet: boolean;
  description: string;
}

const DebugPage: React.FC = () => {
  const [secrets, setSecrets] = useState<SecretStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showReport, setShowReport] = useState(false);

  useEffect(() => {
    const fetchSecretsStatus = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${SUPABASE_FUNCTION_BASE_URL}${CHECK_SECRETS_FUNCTION_NAME}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch secrets status');
        }
        const data: SecretStatus[] = await response.json();
        setSecrets(data);
      } catch (err) {
        if (err instanceof Error) {
            setError(err.message);
        } else {
            setError('An unknown error occurred.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchSecretsStatus();
  }, []);
  
  const allSecretsSet = secrets.filter(s => s.name === 'GEMINI_API_KEY').every(s => s.isSet);

  if (showReport) {
    return <FinalDiagnosticReport allSecretsSet={allSecretsSet} onReset={() => setShowReport(false)} />;
  }

  return (
    <div className="max-w-4xl p-8 mx-auto bg-white rounded-lg shadow-xl dark:bg-gray-800">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Supabase Environment & Secrets Check</h1>
      <p className="mt-2 text-gray-600 dark:text-gray-400">
        This page checks if the necessary environment variables (secrets) have been configured in your Supabase project. These are required for the application to function correctly.
      </p>
      
      {isLoading && (
        <div className="mt-6 text-center">
            <p className="text-lg text-gray-700 dark:text-gray-300">Checking secrets...</p>
        </div>
      )}
      
      {error && (
        <div className="p-4 mt-6 text-red-800 bg-red-100 border border-red-200 rounded-lg dark:bg-red-900 dark:text-red-200 dark:border-red-800">
          <h3 className="font-bold">Error</h3>
          <p>{error}</p>
        </div>
      )}

      {!isLoading && !error && (
        <div className="mt-6">
          <ul className="space-y-4">
            {secrets.map(secret => (
              <li key={secret.name} className="flex items-center justify-between p-4 border rounded-lg dark:border-gray-700">
                <div>
                  <p className="font-mono font-semibold text-gray-800 dark:text-gray-200">{secret.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{secret.description}</p>
                </div>
                {secret.isSet ? (
                  <span className="inline-flex items-center px-3 py-1 text-sm font-semibold text-green-800 bg-green-100 rounded-full dark:bg-green-900 dark:text-green-200">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                    Set
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 text-sm font-semibold text-red-800 bg-red-100 rounded-full dark:bg-red-900 dark:text-red-200">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.693a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                    Missing
                  </span>
                )}
              </li>
            ))}
          </ul>
           <button 
            onClick={() => setShowReport(true)}
            className="w-full px-4 py-2 mt-8 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
                View Final Diagnostic Report
            </button>
        </div>
      )}
    </div>
  );
};

export default DebugPage;
