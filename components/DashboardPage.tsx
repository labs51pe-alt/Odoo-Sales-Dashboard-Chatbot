import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useAuth } from '../hooks/useAuth';
import { useSalesData } from '../hooks/useSalesData';
import { KpiCard } from './common/KpiCard';

const RedeployCommand = "supabase functions deploy get-odoo-sales --no-verify-jwt";
const SupabaseSecretsURL = "https://supabase.com/dashboard/project/ixhbgkimmzgfwehbbloa/functions/secrets";

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text).then(() => {
    alert('Command copied to clipboard!');
  }).catch(err => {
    console.error('Failed to copy text: ', err);
    alert('Failed to copy command. Please copy it manually.');
  });
};

// A new, definitive troubleshooting wizard to guide the user through the final fix.
const TroubleshootingWizard: React.FC<{ error: string }> = ({ error }) => {
  return (
    <div className="p-6 sm:p-8 mx-auto mt-8 max-w-4xl bg-white rounded-lg shadow-2xl border-t-4 border-red-500 dark:bg-gray-800 dark:border-red-600">
      <div className="text-center">
        <svg className="w-16 h-16 mx-auto text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-4">Connection to Odoo Failed: Let's Fix It</h3>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          This error almost always means there's a small configuration mismatch. Let's walk through the checklist to find it.
        </p>
         <div className="p-3 mt-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-900 dark:text-red-300">
            <strong>Error details:</strong> {error}
        </div>
      </div>

      <div className="mt-8 space-y-6">
        {/* Step 1: Verify Secrets */}
        <div className="p-4 border rounded-lg dark:border-gray-700">
          <h4 className="font-semibold text-lg flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 text-white bg-blue-600 rounded-full font-bold">1</span>
            <span>Verify Supabase Secrets</span>
          </h4>
          <p className="pl-11 mt-1 text-sm text-gray-500 dark:text-gray-400">
            Ensure the following four secrets exist with the <strong>exact</strong> names below.
          </p>
          <ul className="pl-11 mt-2 space-y-1 text-sm list-disc list-inside">
            <li><code className="px-2 py-1 text-xs bg-gray-100 rounded dark:bg-gray-700">ODOO_URL</code></li>
            <li><code className="px-2 py-1 text-xs bg-gray-100 rounded dark:bg-gray-700">ODOO_DB</code></li>
            <li><code className="px-2 py-1 text-xs bg-gray-100 rounded dark:bg-gray-700">ODOO_USER</code></li>
            <li><code className="px-2 py-1 text-xs bg-gray-100 rounded dark:bg-gray-700">ODOO_API_KEY</code></li>
          </ul>
           <a href={SupabaseSecretsURL} target="_blank" rel="noopener noreferrer" className="inline-block mt-3 ml-11 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none">
            Open Supabase Secrets
          </a>
        </div>

        {/* Step 2: Verify Company IDs - New Visual Guide */}
        <div className="p-4 border rounded-lg dark:border-gray-700">
          <h4 className="font-semibold text-lg flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 text-white bg-blue-600 rounded-full font-bold">2</span>
            <span>Verify Odoo Company IDs (The "Translator")</span>
          </h4>
          <div className="pl-11 mt-2 space-y-3 text-sm text-gray-500 dark:text-gray-400">
            <p>
              Your app uses simple names like <code className="px-2 py-1 text-xs bg-gray-100 rounded dark:bg-gray-700">empresa-a</code>, but Odoo's database uses numbers (e.g., <code className="px-2 py-1 text-xs bg-gray-100 rounded dark:bg-gray-700">1</code>, <code className="px-2 py-1 text-xs bg-gray-100 rounded dark:bg-gray-700">5</code>). The code in your Supabase function acts as a translator. You must tell it which number corresponds to which name.
            </p>
            <p className="font-semibold text-gray-700 dark:text-gray-300">How to find the correct ID in Odoo:</p>
            <ol className="list-decimal list-inside space-y-2">
              <li>Go to your Odoo dashboard, then navigate to <strong>Settings &rarr; Companies</strong>.</li>
              <li>Click on a company, for example, <strong>"Vida SAC"</strong>.</li>
              <li>Look at the URL in your browser's address bar. Find the part that says <code className="px-2 py-1 text-xs bg-gray-100 rounded dark:bg-gray-700">id=NUMBER</code>. That number is the ID.</li>
              <li className="p-2 bg-gray-100 rounded dark:bg-gray-900">
                <strong>Example URL:</strong><br/>
                <code className="break-all text-xs">.../web#id=<span className="font-bold text-lg text-red-500">5</span>&amp;model=res.company&amp;...</code><br />
                In this example, the ID for the company is <strong className="text-red-500">5</strong>.
              </li>
            </ol>
            <p>
              Now, open the file <code className="px-2 py-1 text-xs bg-gray-100 rounded dark:bg-gray-700">supabase/functions/get-odoo-sales/index.ts</code> in your project and make sure the numbers in the <code className="px-2 py-1 text-xs bg-gray-100 rounded dark:bg-gray-700">COMPANY_NAME_TO_ODOO_ID_MAP</code> section are correct.
            </p>
          </div>
        </div>


        {/* Step 3: Re-deploy */}
        <div className="p-4 border rounded-lg dark:border-gray-700">
           <h4 className="font-semibold text-lg flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 text-white bg-blue-600 rounded-full font-bold">3</span>
            <span>Run the Refresh Command</span>
          </h4>
          <p className="pl-11 mt-1 text-sm text-gray-500 dark:text-gray-400">After verifying the settings, you <strong>must</strong> re-deploy the function for the changes to take effect. Run this command in your terminal:</p>
          <div className="flex items-center gap-2 p-3 mt-2 ml-11 bg-gray-100 rounded-md dark:bg-gray-900 ring-1 ring-gray-200 dark:ring-gray-700">
            <code className="flex-grow text-sm font-mono text-gray-700 dark:text-gray-300">{RedeployCommand}</code>
            <button
              onClick={() => copyToClipboard(RedeployCommand)}
              className="flex-shrink-0 px-4 py-2 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Copy
            </button>
          </div>
        </div>

         {/* Step 4: Refresh Page */}
        <div className="p-4 border rounded-lg dark:border-gray-700">
            <h4 className="font-semibold text-lg flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 text-white bg-green-600 rounded-full font-bold">4</span>
                <span>Refresh and Load Data</span>
            </h4>
             <p className="pl-11 mt-1 text-sm text-gray-500 dark:text-gray-400">After the command finishes successfully in your terminal, click the button below.</p>
             <button
                onClick={() => window.location.reload()}
                className="w-full px-4 py-3 mt-3 font-bold text-white bg-green-600 rounded-md hover:bg-green-700 md:w-auto md:ml-11"
              >
                Reload Dashboard
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
    // Show the new, definitive troubleshooting wizard.
    return <TroubleshootingWizard error={error} />;
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