// components/DebugPage.tsx
import React, { useState } from 'react';
import { SUPABASE_FUNCTION_BASE_URL, CHECK_SECRETS_FUNCTION_NAME } from '../constants';

type SecretStatus = Record<string, boolean>;

const DebugPage: React.FC = () => {
  const [testResults, setTestResults] = useState<SecretStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Extract the Supabase project reference from the URL constant.
  const getSupabaseProjectRef = () => {
    try {
      const url = new URL(SUPABASE_FUNCTION_BASE_URL);
      const parts = url.hostname.split('.');
      return parts[0];
    } catch (e) {
      return null;
    }
  };
  const supabaseProjectRef = getSupabaseProjectRef();

  const handleRunTest = async () => {
    setIsLoading(true);
    setError(null);
    setTestResults(null);
    
    try {
      const functionUrl = `${SUPABASE_FUNCTION_BASE_URL}${CHECK_SECRETS_FUNCTION_NAME}`;
      const response = await fetch(functionUrl);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to connect to the debug function.');
      }
      setTestResults(data);
    } catch (err) {
      const displayError = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(displayError);
    } finally {
      setIsLoading(false);
    }
  };

  const SecretStatusIndicator: React.FC<{ status: boolean }> = ({ status }) => {
    return status ? (
      <span className="flex items-center text-green-600 dark:text-green-400">
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
        Found
      </span>
    ) : (
      <span className="flex items-center text-red-600 dark:text-red-400">
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        MISSING
      </span>
    );
  };
  
  const getNextSteps = () => {
      if (!testResults) return null;
      
      const missingSecrets = Object.entries(testResults).filter(([, found]) => !found).map(([key]) => key);
      
      if(missingSecrets.length > 0) {
          return (
              <div className="p-4 mt-6 border-2 border-red-300 rounded-lg bg-red-50 dark:bg-red-900 dark:border-red-700">
                <h3 className="font-bold text-red-800 dark:text-red-200">Action Required: Fix Missing Secrets</h3>
                <p className="mt-2 text-sm text-red-700 dark:text-red-300">The test found that the following secrets are missing or named incorrectly:</p>
                <ul className="mt-2 text-sm list-disc list-inside">
                    {missingSecrets.map(secret => <li key={secret}><code className="font-semibold">{secret}</code></li>)}
                </ul>
                <p className="mt-4 text-sm text-red-700 dark:text-red-300">
                    Go to your {supabaseProjectRef ? 
                    <a href={`https://supabase.com/dashboard/project/${supabaseProjectRef}/settings/functions`} target="_blank" rel="noopener noreferrer" className="underline hover:text-red-500">Supabase Secrets Settings</a>
                    : "Supabase Secrets Settings"} and add them. 
                    <strong>After adding them, you MUST re-deploy your functions using the terminal.</strong>
                </p>
              </div>
          );
      }
      
      return (
         <div className="p-4 mt-6 border-2 border-green-300 rounded-lg bg-green-50 dark:bg-green-900 dark:border-green-700">
            <h3 className="font-bold text-green-800 dark:text-green-200">All Secrets Found!</h3>
            <p className="mt-2 text-sm text-green-700 dark:text-green-300">
                The server can read all your secrets correctly. This means the problem is not with the secrets themselves.
                The most likely cause is that your <code className="font-semibold">get-odoo-sales</code> function is running an old version of the code.
            </p>
             <p className="mt-4 text-sm text-green-700 dark:text-green-300">
                Please run this command in your terminal to send the latest code to the server, then try the dashboard again:
             </p>
             <div className="flex items-center p-3 mt-2 font-mono text-sm text-gray-800 bg-gray-200 rounded-md dark:bg-gray-700 dark:text-gray-300">
                <span className="flex-grow">supabase functions deploy get-odoo-sales --no-verify-jwt</span>
                <button
                    onClick={() => navigator.clipboard.writeText('supabase functions deploy get-odoo-sales --no-verify-jwt')}
                    className="px-3 py-1 ml-4 text-xs font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                    Copy
                </button>
            </div>
         </div>
      );
  }

  return (
    <div className="max-w-4xl p-8 mx-auto bg-white rounded-lg shadow-xl dark:bg-gray-800">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">System Diagnostic Tool</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          This tool will test the connection to your Supabase backend and verify your configuration.
        </p>
      </div>

      <div className="mt-8">
        <button
          onClick={handleRunTest}
          disabled={isLoading}
          className="w-full px-6 py-3 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-wait"
        >
          {isLoading ? 'Running Test...' : 'Run Secrets Configuration Test'}
        </button>
      </div>
      
      {error && (
         <div className="p-4 mt-6 text-center text-red-800 bg-red-100 rounded-lg dark:bg-red-900 dark:text-red-200">
            <strong>Test Failed:</strong> {error}
        </div>
      )}

      {testResults && (
        <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Test Results:</h2>
            <div className="p-4 mt-2 border rounded-lg dark:border-gray-700">
                <ul className="space-y-3">
                    {Object.entries(testResults).map(([key, value]) => (
                        <li key={key} className="flex items-center justify-between p-2 rounded-md bg-gray-50 dark:bg-gray-700">
                           <code className="font-semibold text-gray-800 dark:text-gray-200">{key}</code>
                           <SecretStatusIndicator status={value} />
                        </li>
                    ))}
                </ul>
            </div>
            {getNextSteps()}
        </div>
      )}
    </div>
  );
};

export default DebugPage;
