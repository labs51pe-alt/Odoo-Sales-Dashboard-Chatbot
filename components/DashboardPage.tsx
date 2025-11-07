import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useAuth } from '../hooks/useAuth';
import { useSalesData } from '../hooks/useSalesData';
import { KpiCard } from './common/KpiCard';

// Helper function to be used inside the component
const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text).then(() => {
    alert('Command copied to clipboard!');
  }).catch(err => {
    console.error('Failed to copy text: ', err);
    alert('Failed to copy command. Please copy it manually.');
  });
};

const RedeployCommand = "supabase functions deploy get-odoo-sales --no-verify-jwt";


const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { data: salesData, isLoading, error } = useSalesData(user?.companyId);

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">
        <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
    </div>;
  }

  if (error) {
    // Inlined Interactive Troubleshooting Guide
    return (
      <div className="p-4 sm:p-6 mx-auto mt-8 max-w-4xl text-gray-800 bg-white rounded-lg shadow-2xl border border-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-4 pb-4 mb-4 border-b dark:border-gray-600">
          <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full">
            <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-red-700 dark:text-red-400">Connection Error Detected</h3>
            <pre className="p-2 mt-1 font-mono text-sm bg-gray-100 rounded dark:bg-gray-700 whitespace-pre-wrap">{error}</pre>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h4 className="text-lg font-semibold">Primary Solution: Re-Deploy the Function</h4>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              This error usually happens when the Supabase function hasn't loaded the latest secrets. Re-deploying is the most common fix.
            </p>
            <div className="flex items-center gap-2 p-3 mt-3 bg-gray-50 rounded-md dark:bg-gray-900">
              <code className="flex-grow text-sm font-mono text-gray-700 dark:text-gray-300">{RedeployCommand}</code>
              <button
                onClick={() => copyToClipboard(RedeployCommand)}
                className="flex-shrink-0 px-3 py-1 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                title="Copy command"
              >
                Copy
              </button>
            </div>
            <p className="mt-2 text-xs text-gray-500">Open your terminal in the project folder, paste this command, and press Enter. Then, refresh this page.</p>
          </div>

          <div>
            <h4 className="text-lg font-semibold">If the Problem Persists: Verification Checklist</h4>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              If re-deploying doesn't work, meticulously check your Supabase dashboard for typos in the secret names. They must match <strong>exactly</strong>.
            </p>
            <div className="mt-3 overflow-x-auto">
              <table className="min-w-full text-sm text-left border rounded-md dark:border-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-2 font-semibold">Required Secret Name</th>
                    <th className="px-4 py-2 font-semibold">Example Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                  <tr><td className="px-4 py-2 font-mono">ODOO_URL</td><td className="px-4 py-2 font-mono text-gray-500">https://your-odoo.domain.com</td></tr>
                  <tr><td className="px-4 py-2 font-mono">ODOO_DB</td><td className="px-4 py-2 font-mono text-gray-500">your_database_name</td></tr>
                  <tr><td className="px-4 py-2 font-mono">ODOO_USER</td><td className="px-4 py-2 font-mono text-gray-500">your_odoo_user@email.com</td></tr>
                  <tr><td className="px-4 py-2 font-mono">ODOO_API_KEY</td><td className="px-4 py-2 font-mono text-gray-500">Your Odoo API Key / Password</td></tr>
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-gray-500">If you correct any secrets, remember to <strong>re-deploy the function again</strong> using the command above.</p>
          </div>
        </div>
      </div>
    );
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