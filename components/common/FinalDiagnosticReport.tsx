import React from 'react';
import { SUPABASE_PROJECT_ID } from '../../constants';

interface FinalDiagnosticReportProps {
  errorDetails: string;
}

const FinalDiagnosticReport: React.FC<FinalDiagnosticReportProps> = ({ errorDetails }) => {
  
  const secretsUrl = `https://supabase.com/dashboard/project/${SUPABASE_PROJECT_ID}/settings/secrets`;
  const refreshCommand = 'supabase functions deploy get-odoo-sales --no-verify-jwt';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(refreshCommand).then(() => {
      alert('Command copied to clipboard!');
    }, (err) => {
      alert('Failed to copy command.');
      console.error('Could not copy text: ', err);
    });
  };

  return (
    <div className="flex items-center justify-center h-[calc(100vh-120px)]">
      <div className="w-full max-w-2xl p-8 mx-4 space-y-6 bg-white rounded-lg shadow-2xl dark:bg-gray-800">
        
        <div className="text-center">
            <svg className="w-16 h-16 mx-auto text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <h1 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">Connection Error Detected</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">The server couldn't connect to Odoo. Let's fix this with two final steps.</p>
        </div>
        
        <div className="p-4 border rounded-lg dark:border-gray-600">
            <h3 className="font-semibold text-gray-700 dark:text-gray-300">Error Details:</h3>
            <p className="p-2 mt-1 font-mono text-sm text-red-700 bg-red-100 rounded dark:bg-red-900/50 dark:text-red-300">{errorDetails}</p>
        </div>

        {/* Step 1 */}
        <div className="p-4 border-l-4 border-blue-500 bg-blue-50 dark:bg-gray-700/50 dark:border-blue-400">
            <div className="flex">
                <div className="flex-shrink-0">
                    <span className="flex items-center justify-center w-8 h-8 text-lg font-bold text-white bg-blue-500 rounded-full">1</span>
                </div>
                <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Verify Supabase Secrets</h3>
                    <p className="mt-1 text-gray-600 dark:text-gray-400">
                        Go to your Supabase project and confirm that the following four secrets exist with these <strong>exact names</strong> and have the correct values.
                    </p>
                    <ul className="my-2 space-y-1 list-disc list-inside">
                        <li className="font-mono">ODOO_URL</li>
                        <li className="font-mono">ODOO_DB</li>
                        <li className="font-mono">ODOO_USER</li>
                        <li className="font-mono">ODOO_API_KEY</li>
                    </ul>
                    <a href={secretsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm font-medium text-blue-600 hover:underline dark:text-blue-400">
                        Open Supabase Secrets Page
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                    </a>
                </div>
            </div>
        </div>

        {/* Step 2 */}
        <div className="p-4 border-l-4 border-blue-500 bg-blue-50 dark:bg-gray-700/50 dark:border-blue-400">
            <div className="flex">
                <div className="flex-shrink-0">
                    <span className="flex items-center justify-center w-8 h-8 text-lg font-bold text-white bg-blue-500 rounded-full">2</span>
                </div>
                <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Force Server Refresh</h3>
                    <p className="mt-1 text-gray-600 dark:text-gray-400">
                        After verifying the secrets, you **must** re-deploy the function for the server to read the updated values. Run this command in your terminal from the <code className="text-sm bg-gray-200 rounded dark:bg-gray-600">mi-dashboard-backend</code> folder.
                    </p>
                    <div className="flex mt-2 rounded-md shadow-sm">
                        <input type="text" readOnly value={refreshCommand} className="flex-1 block w-full min-w-0 px-3 py-2 font-mono text-sm text-gray-700 bg-gray-100 border border-gray-300 rounded-l-md dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600" />
                        <button onClick={copyToClipboard} className="relative inline-flex items-center px-4 py-2 -ml-px text-sm font-medium text-gray-700 bg-gray-50 border border-gray-300 rounded-r-md hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:text-gray-200 dark:border-gray-500 dark:hover:bg-gray-500">
                            Copy
                        </button>
                    </div>
                </div>
            </div>
        </div>

        {/* Step 3 */}
         <div className="text-center">
             <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 font-semibold text-white bg-green-600 rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              I've run the command, now Reload Dashboard
            </button>
        </div>

      </div>
    </div>
  );
};

export default FinalDiagnosticReport;