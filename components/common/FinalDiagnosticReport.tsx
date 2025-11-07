import React from 'react';

interface SecretStatus {
  key: string;
  isSet: boolean;
  status: string;
  hint: string;
}

interface FinalDiagnosticReportProps {
  secretChecks: SecretStatus[];
}

const FinalDiagnosticReport: React.FC<FinalDiagnosticReportProps> = ({ secretChecks }) => {
  const allSecretsSet = secretChecks.every(s => s.isSet);

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800">
      <div className="pb-4 mb-4 border-b dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Diagnostic Report</h2>
        <p className={`mt-1 text-sm ${allSecretsSet ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
          {allSecretsSet ? '✅ All systems operational.' : '❌ Action required. Some configurations are missing.'}
        </p>
      </div>
      
      <div>
        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">Supabase Secrets Status</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          These secrets must be configured in your Supabase project under 'Project Settings' &gt; 'Database' &gt; 'Secrets'.
        </p>
        <ul className="mt-4 space-y-3">
          {secretChecks.map(secret => (
            <li key={secret.key} className="flex items-start p-3 border rounded-md dark:border-gray-700">
              <div className="flex-shrink-0">
                <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${secret.isSet ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}`}>
                  {secret.isSet ? '✓' : '✗'}
                </span>
              </div>
              <div className="ml-4">
                <p className="font-mono text-sm font-semibold text-gray-900 dark:text-white">{secret.key}</p>
                <p className={`text-sm ${secret.isSet ? 'text-gray-600 dark:text-gray-400' : 'text-red-600 dark:text-red-400'}`}>{secret.hint}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FinalDiagnosticReport;
