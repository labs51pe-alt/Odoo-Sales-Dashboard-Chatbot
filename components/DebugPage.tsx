import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useSalesData } from '../hooks/useSalesData';
import { SUPABASE_FUNCTION_BASE_URL, CHECK_SECRETS_FUNCTION_NAME } from '../constants';

const DebugPage: React.FC = () => {
    const { user } = useAuth();
    const { data: salesData, isLoading, error } = useSalesData(user?.companyId);
    const [secretsStatus, setSecretsStatus] = useState<any>(null);
    const [secretsLoading, setSecretsLoading] = useState(true);

    useEffect(() => {
        const checkSecrets = async () => {
            try {
                setSecretsLoading(true);
                const response = await fetch(`${SUPABASE_FUNCTION_BASE_URL}${CHECK_SECRETS_FUNCTION_NAME}`);
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.error || 'Failed to fetch secrets status');
                }
                setSecretsStatus(data);
            } catch (err) {
                setSecretsStatus({ error: err instanceof Error ? err.message : 'Unknown error' });
            } finally {
                setSecretsLoading(false);
            }
        };
        checkSecrets();
    }, []);

    return (
        <div className="p-6 space-y-6 bg-white rounded-lg shadow-lg dark:bg-gray-800">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Debug Information</h1>
            
            <div className="p-4 border rounded-md dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Supabase Secrets Status</h2>
                {secretsLoading ? <p className="text-gray-500 dark:text-gray-400">Checking secrets...</p> : 
                <pre className="mt-2 text-sm text-gray-600 bg-gray-100 rounded dark:bg-gray-700 dark:text-gray-300">
                    <code>{JSON.stringify(secretsStatus, null, 2)}</code>
                </pre>
                }
            </div>

            <div className="p-4 border rounded-md dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Auth Context</h2>
                <pre className="mt-2 text-sm text-gray-600 bg-gray-100 rounded dark:bg-gray-700 dark:text-gray-300">
                    <code>{JSON.stringify({ user }, null, 2)}</code>
                </pre>
            </div>

            <div className="p-4 border rounded-md dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Sales Data Hook</h2>
                <pre className="mt-2 text-sm text-gray-600 bg-gray-100 rounded dark:bg-gray-700 dark:text-gray-300">
                    <code>
                        {JSON.stringify({ isLoading, error, data: salesData }, null, 2)}
                    </code>
                </pre>
            </div>
        </div>
    );
};

export default DebugPage;
