import React from 'react';

interface FinalDiagnosticReportProps {
    allSecretsSet: boolean;
    onReset: () => void;
}

const FinalDiagnosticReport: React.FC<FinalDiagnosticReportProps> = ({ allSecretsSet, onReset }) => {
  return (
    <div className="max-w-2xl p-8 mx-auto text-center bg-white rounded-lg shadow-xl dark:bg-gray-800">
        {allSecretsSet ? (
            <>
                <svg className="w-24 h-24 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <h1 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">System Ready</h1>
                <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                    All required Supabase secrets are correctly configured. The application should be fully functional.
                </p>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    The AI Sales Assistant and Odoo data connection (mocked) are ready to be used.
                </p>
            </>
        ) : (
            <>
                <svg className="w-24 h-24 mx-auto text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                <h1 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">Configuration Incomplete</h1>
                <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                    One or more required Supabase secrets are missing. Key features of the application may not work.
                </p>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Please go to your Supabase project settings, find "Secrets" under the "Settings" tab, and add the missing environment variables. The AI assistant will not work without the <code className="px-1 font-mono text-sm bg-gray-200 rounded dark:bg-gray-700">GEMINI_API_KEY</code>.
                </p>
            </>
        )}
        <button 
            onClick={onReset}
            className="w-full px-4 py-2 mt-8 font-bold text-white bg-gray-600 rounded-lg sm:w-auto hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
            >
            Run Check Again
        </button>
    </div>
  );
};

export default FinalDiagnosticReport;
