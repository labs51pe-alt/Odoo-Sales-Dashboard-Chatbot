import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useAuth } from '../hooks/useAuth';
import { useSalesData } from '../hooks/useSalesData';
import { KpiCard } from './common/KpiCard';

const RedeployCommand = "supabase functions deploy get-odoo-sales --no-verify-jwt";

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text).then(() => {
    alert('Command copied to clipboard!');
  }).catch(err => {
    console.error('Failed to copy text: ', err);
    alert('Failed to copy command. Please copy it manually.');
  });
};

// A new, simplified guide focusing on the single action needed.
const FinalActionRequired: React.FC = () => {
  return (
    <div className="p-6 sm:p-8 mx-auto mt-8 max-w-3xl bg-white rounded-lg shadow-2xl border-2 border-blue-500 dark:bg-gray-800 dark:border-blue-600">
      <div className="text-center">
        <svg className="w-16 h-16 mx-auto text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-4">One Final Step to Connect to Odoo</h3>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Your Odoo credentials are set, but the backend function needs a quick refresh to use them.
          This is a one-time action.
        </p>
      </div>

      <div className="mt-8 space-y-6">
        <div>
          <h4 className="font-semibold text-lg flex items-center gap-2">
            <span className="flex items-center justify-center w-8 h-8 text-white bg-blue-600 rounded-full font-bold">1</span>
            <span>Open your Terminal</span>
          </h4>
          <p className="pl-10 text-sm text-gray-500 dark:text-gray-400">Navigate to your project folder (`mi-dashboard-backend`).</p>
        </div>

        <div>
           <h4 className="font-semibold text-lg flex items-center gap-2">
            <span className="flex items-center justify-center w-8 h-8 text-white bg-blue-600 rounded-full font-bold">2</span>
            <span>Run the Refresh Command</span>
          </h4>
          <p className="pl-10 text-sm text-gray-500 dark:text-gray-400">This command re-deploys your function so it can read the credentials you've set.</p>
          <div className="flex items-center gap-2 p-3 mt-2 ml-10 bg-gray-100 rounded-md dark:bg-gray-900 ring-1 ring-gray-200 dark:ring-gray-700">
            <code className="flex-grow text-sm font-mono text-gray-700 dark:text-gray-300">{RedeployCommand}</code>
            <button
              onClick={() => copyToClipboard(RedeployCommand)}
              className="flex-shrink-0 px-4 py-2 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900"
            >
              Copy
            </button>
          </div>
        </div>
        
        <div>
            <h4 className="font-semibold text-lg flex items-center gap-2">
                <span className="flex items-center justify-center w-8 h-8 text-white bg-blue-600 rounded-full font-bold">3</span>
                <span>Refresh This Page</span>
            </h4>
             <p className="pl-10 text-sm text-gray-500 dark:text-gray-400">After the command finishes successfully in your terminal, click the button below.</p>
             <button
                onClick={() => window.location.reload()}
                className="w-full px-4 py-3 mt-3 font-bold text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-800 md:w-auto md:ml-10"
              >
                Load Live Data
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
    // Show the new, simplified guide instead of the old one.
    return <FinalActionRequired />;
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