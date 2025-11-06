import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useAuth } from '../hooks/useAuth';
import { useSalesData } from '../hooks/useSalesData';
import { KpiCard } from './common/KpiCard';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { data: salesData, isLoading, error } = useSalesData(user?.companyId);

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">
        <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
    </div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-700 bg-red-100 rounded-lg dark:bg-red-900 dark:text-red-200">
        <h3 className="font-bold">Error</h3>
        <p>{error}</p>
    </div>;
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
