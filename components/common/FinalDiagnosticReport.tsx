import React, { useState } from 'react';
import { SUPABASE_PROJECT_ID } from '../../constants';

interface FinalDiagnosticReportProps {
  errorDetails: string;
}

const ODOO_SECRETS_CHECKLIST = [
  'ODOO_URL',
  'ODOO_DB',
  'ODOO_USER',
  'ODOO_API_KEY',
];

const REFRESH_COMMAND = 'supabase functions deploy get-odoo-sales --no-verify-jwt';

const FinalDiagnosticReport: React.FC<FinalDiagnosticReportProps> = ({ errorDetails }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(REFRESH_COMMAND);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const secretsUrl = `https://supabase.com/dashboard/project/${SUPABASE_PROJECT_ID}/settings/secrets`;

  return (
    <div className="p-6 bg-red-50 border border-red-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-red-900">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        </div>
        <div className="ml-4">
          <h2 className="text-xl font-bold text-red-800 dark:text-red-300">Connection Error Detected</h2>
          <p className="mt-1 text-sm text-red-700 dark:text-red-400">
            The server could not connect to Odoo. This is usually due to a small configuration issue. Let's fix it!
          </p>
          <div className="p-3 mt-3 text-sm text-red-600 bg-red-100 rounded-md dark:bg-red-900 dark:text-red-300">
            <strong>Error Details:</strong> {errorDetails}
          </div>
        </div>
      </div>
      
      <div className="mt-6 space-y-6">
        {/* Step 1: Verify Secrets */}
        <div className="flex items-start">
          <div className="flex items-center justify-center w-8 h-8 font-bold text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">1</div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Verify Supabase Secrets</h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Go to your Supabase project and confirm that the following four secrets exist with these **exact names** and have the correct values.
            </p>
            <ul className="pl-5 mt-2 space-y-1 list-disc list-inside">
              {ODOO_SECRETS_CHECKLIST.map(secret => (
                <li key={secret} className="font-mono text-sm text-gray-700 dark:text-gray-300">{secret}</li>
              ))}
            </ul>
            <a 
              href={secretsUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block px-4 py-2 mt-3 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Open Supabase Secrets
            </a>
          </div>
        </div>
        
        {/* Step 2: Refresh the Server */}
        <div className="flex items-start">
          <div className="flex items-center justify-center w-8 h-8 font-bold text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">2</div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Force Server Refresh</h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              If your secrets are correct, the server might be running an old configuration. Re-deploying the function forces it to read the latest secrets.
            </p>
            <div className="relative p-3 mt-3 font-mono text-sm text-gray-800 bg-gray-100 border rounded-md dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700">
              {REFRESH_COMMAND}
              <button
                onClick={handleCopy}
                className="absolute top-2 right-2 px-2 py-1 text-xs font-semibold text-gray-600 bg-gray-200 rounded hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        </div>

        {/* Step 3: Reload Dashboard */}
        <div className="flex items-start">
            <div className="flex items-center justify-center w-8 h-8 font-bold text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">3</div>
            <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Reload Dashboard</h3>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    After the command in your terminal finishes successfully, click here to try loading the data again.
                </p>
                <button
                    onClick={() => window.location.reload()}
                    className="inline-block px-4 py-2 mt-3 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                >
                    Reload Dashboard
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default FinalDiagnosticReport;
