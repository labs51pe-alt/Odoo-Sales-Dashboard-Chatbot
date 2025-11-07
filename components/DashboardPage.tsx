import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useAuth } from '../hooks/useAuth';
import { useSalesData } from '../hooks/useSalesData';
import { KpiCard } from './common/KpiCard';

const RedeployCommand = "supabase functions deploy get-odoo-sales --no-verify-jwt";
const SUPABASE_SECRETS_URL = "https://supabase.com/dashboard/project/ixhbgkimmzgfwehbbloa/functions/secrets";

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text).then(() => {
    alert('Command copied to clipboard!');
  }).catch(err => {
    console.error('Failed to copy text: ', err);
    alert('Failed to copy command. Please copy it manually.');
  });
};

const TroubleshootingGuide: React.FC<{ error: string }> = ({ error }) => {
  const [secretsVerified, setSecretsVerified] = useState(false);
  const [loginVerified, setLoginVerified] = useState(false);

  return (
    <div className="p-4 sm:p-6 mx-auto mt-8 max-w-4xl text-gray-800 bg-white rounded-lg shadow-2xl border border-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-4 pb-4 mb-4 border-b dark:border-gray-600">
        <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full">
          <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
        </div>
        <div>
          <h3 className="text-xl font-bold text-red-700 dark:text-red-400">Connection Error Detected</h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Your app can't connect to Odoo because the backend function is missing its credentials.</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Step 1 */}
        <div className="p-4 border border-gray-300 rounded-lg dark:border-gray-600">
          <h4 className="font-bold text-gray-800 dark:text-white"><span className="text-blue-500">Step 1:</span> Verify Supabase Secret Names</h4>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Go to your Supabase Secrets page and ensure the names you entered match the "Required Name" column below **exactly**. Typos are a common issue.
          </p>
          <a href={SUPABASE_SECRETS_URL} target="_blank" rel="noopener noreferrer" className="inline-block px-3 py-1 mt-2 text-sm text-white bg-green-600 rounded-md hover:bg-green-700">
            Open Supabase Secrets Page
          </a>
          <div className="mt-3 overflow-x-auto">
            <table className="min-w-full text-sm text-left border rounded-md dark:border-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr><th className="px-4 py-2 font-semibold">Required Secret Name</th><th className="px-4 py-2 font-semibold">Purpose</th></tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                <tr><td className="px-4 py-2 font-mono">ODOO_URL</td><td className="px-4 py-2 text-gray-500">Your Odoo instance URL</td></tr>
                <tr><td className="px-4 py-2 font-mono">ODOO_DB</td><td className="px-4 py-2 text-gray-500">Your Odoo database name</td></tr>
                <tr><td className="px-4 py-2 font-mono">ODOO_USER</td><td className="px-4 py-2 text-gray-500">Your Odoo login username</td></tr>
                <tr><td className="px-4 py-2 font-mono">ODOO_API_KEY</td><td className="px-4 py-2 text-gray-500">Your Odoo API Key / Password</td></tr>
              </tbody>
            </table>
          </div>
          <div className="flex items-center mt-4">
            <input type="checkbox" id="secretsVerified" checked={secretsVerified} onChange={() => setSecretsVerified(!secretsVerified)} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500" />
            <label htmlFor="secretsVerified" className="ml-2 text-sm font-medium">I have verified all secret names are correct.</label>
          </div>
        </div>

        {/* Step 2 */}
        <div className={`p-4 border border-gray-300 rounded-lg dark:border-gray-600 transition-opacity ${secretsVerified ? 'opacity-100' : 'opacity-50'}`}>
          <h4 className="font-bold text-gray-800 dark:text-white"><span className="text-blue-500">Step 2:</span> Re-Deploy The Function</h4>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Supabase Functions only load secrets when they are deployed. Since you've verified the secrets, you must now re-deploy the function to make it read them.
          </p>
          <p className="mt-2 text-xs text-gray-500"><strong>Important:</strong> Make sure your terminal is logged into the Supabase account that is the **Owner** of this project.</p>
          <div className="flex items-center gap-2 p-3 mt-3 bg-gray-50 rounded-md dark:bg-gray-900">
            <code className="flex-grow text-sm font-mono text-gray-700 dark:text-gray-300">{RedeployCommand}</code>
            <button
              onClick={() => copyToClipboard(RedeployCommand)}
              disabled={!secretsVerified}
              className="flex-shrink-0 px-3 py-1 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Copy Command
            </button>
          </div>
           <div className="flex items-center mt-4">
            <input type="checkbox" id="loginVerified" checked={loginVerified} onChange={() => setLoginVerified(!loginVerified)} disabled={!secretsVerified} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500" />
            <label htmlFor="loginVerified" className="ml-2 text-sm font-medium">I have run the command in my terminal.</label>
          </div>
        </div>

        {/* Step 3 */}
        <div className={`p-4 border border-gray-300 rounded-lg dark:border-gray-600 transition-opacity ${loginVerified ? 'opacity-100' : 'opacity-50'}`}>
          <h4 className="font-bold text-gray-800 dark:text-white"><span className="text-blue-500">Step 3:</span> Refresh The Page</h4>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Now that the function has been re-deployed with the correct secrets, the dashboard should load correctly.
          </p>
          <button
            onClick={() => window.location.reload()}
            disabled={!loginVerified}
            className="w-full px-4 py-2 mt-3 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Refresh and Load Data
          </button>
        </div>
      </div>
    </div>
  );
};


const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { data: salesData, isLoading, error } = useSalesData(user?.companyId);

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">
        <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
    </div>;
  }

  if (error) {
    return <TroubleshootingGuide error={error} />;
  }
  
  if (!salesData) {
    return <div className="text-center text-gray-500">No sales data available for your company.</div>;
  }

  return (
    <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Sales Dashboard</h1>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <KpiCard title="Total Sales" value={`$${salesData.totalSales.toLocaleString()}`} change="+5.4%" changeType="increase" />
            <KpiCard title="Total Profit" value={`$${salesData.totalProfit.toLocaleString()}`} change="+12.1%" changeType="increase" />
            <KpiCard title="Total Orders" value={salesData.orderCount.toLocaleString()} change="-1.2%" changeType="decrease" />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-1">
             {/* Sales by Sede/Branch Chart */}
             <div className="p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800">
                <h2 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200">Sales by Branch</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={salesData.salesBySede}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(107, 114, 128, 0.3)" />
                        <XAxis dataKey="sede" tick={{ fill: '#9ca3af' }} />
                        <YAxis tickFormatter={(value) => `$${Number(value) / 1000}k`} tick={{ fill: '#9ca3af' }}/>
                        <Tooltip
                            cursor={{fill: 'rgba(55, 65, 81, 0.3)'}}
                            contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151' }}
                            labelStyle={{ color: '#d1d5db' }}
                        />
                        <Legend />
                        <Bar dataKey="total_ventas" fill="#3b82f6" name="Total Sales" />
                        <Bar dataKey="ganancia" fill="#10b981" name="Profit" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Monthly Sales Chart */}
            <div className="p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800">
                <h2 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200">Monthly Performance</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={salesData.monthlySales}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(107, 114, 128, 0.3)" />
                        <XAxis dataKey="month" tick={{ fill: '#9ca3af' }} />
                        <YAxis tickFormatter={(value) => `$${Number(value) / 1000}k`} tick={{ fill: '#9ca3af' }} />
                        <Tooltip
                          contentStyle={{
                              backgroundColor: '#1f2937',
                              borderColor: '#374151'
                          }}
                          labelStyle={{ color: '#d1d5db' }}
                        />
                        <Legend />
                        <Line type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={2} name="Sales" />
                        <Line type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={2} name="Profit" />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Sales by Product Chart */}
            <div className="p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800">
                <h2 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200">Top Products by Sales</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={salesData.salesByProduct} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(107, 114, 128, 0.3)" />
                        <XAxis type="number" tickFormatter={(value) => `$${Number(value) / 1000}k`} tick={{ fill: '#9ca3af' }} />
                        <YAxis type="category" dataKey="name" width={120} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                        <Tooltip
                            cursor={{fill: 'rgba(55, 65, 81, 0.3)'}}
                            contentStyle={{
                                backgroundColor: '#1f2937',
                                borderColor: '#374151'
                            }}
                            labelStyle={{ color: '#d1d5db' }}
                        />
                        <Legend />
                        <Bar dataKey="sales" fill="#3b82f6" name="Sales" />
                        <Bar dataKey="profit" fill="#10b981" name="Profit" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    </div>
  );
};

export default DashboardPage;