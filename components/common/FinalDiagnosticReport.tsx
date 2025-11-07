import React from 'react';
import { ODOO_SALES_FUNCTION_NAME } from '../../constants';

interface FinalDiagnosticReportProps {
  errorDetails: string;
}

const FinalDiagnosticReport: React.FC<FinalDiagnosticReportProps> = ({ errorDetails }) => {
  const isFunctionError = errorDetails.includes('function');
  const isAuthError = errorDetails.includes('authentication') || errorDetails.includes('credentials');

  return (
    <div className="p-6 bg-red-50 border border-red-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-red-900">
      <div className="flex items-start">
        <div className="flex-shrink-0">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        </div>
        <div className="ml-4">
          <h3 className="text-lg font-bold text-red-800 dark:text-red-300">Data Connection Error</h3>
          <p className="mt-1 text-sm text-red-700 dark:text-red-400">
            We couldn't retrieve the sales data from the Odoo server.
          </p>
          <div className="mt-4 p-3 bg-red-100 rounded-md dark:bg-gray-700">
            <p className="text-sm font-mono text-red-900 dark:text-red-300">
              <strong>Technical Details:</strong> {errorDetails}
            </p>
          </div>

          <div className="mt-6">
            <h4 className="text-md font-semibold text-gray-800 dark:text-gray-200">What you can do:</h4>
            <ul className="mt-2 list-disc list-inside space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li>
                <strong>Wait and Retry:</strong> Sometimes these issues are temporary. Please try refreshing the page in a few minutes.
              </li>
              {isFunctionError && (
                 <li>
                   <strong>Check Supabase Function:</strong> The error seems to be related to the <code>{ODOO_SALES_FUNCTION_NAME}</code> Supabase function. Verify that it is deployed correctly and its logs don't show any critical errors.
                 </li>
              )}
               {isAuthError && (
                 <li>
                   <strong>Verify Odoo Credentials:</strong> The error suggests a problem with the credentials used to connect to Odoo. Check the Supabase secrets to ensure they are correct and have not expired.
                 </li>
              )}
              <li>
                <strong>Contact Support:</strong> If the problem persists, please contact technical support and provide them with the technical details shown above.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinalDiagnosticReport;
