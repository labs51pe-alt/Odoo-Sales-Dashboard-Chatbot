import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useSalesData } from '../hooks/useSalesData';
import { KpiCard } from './common/KpiCard';

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(value);
};

const DashboardPage: React.FC = () => {
    const { user } = useAuth();
    const { data, isLoading, error } = useSalesData(user?.companyId);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center p-10 text-center text-gray-500 bg-white rounded-lg shadow-xl dark:bg-gray-800 dark:text-gray-400">
                <svg className="w-12 h-12 mb-4 text-blue-500 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <h2 className="text-xl font-semibold">Connecting to Odoo...</h2>
                <p>Loading live sales data. This may take a moment.</p>
            </div>
        );
    }

    if (error) {
        return (
             <div className="p-6 text-center text-red-800 bg-red-100 border-l-4 border-red-500 rounded-lg shadow-xl dark:bg-red-900 dark:text-red-200">
                <div className="flex items-center justify-center">
                    <svg className="w-10 h-10 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
                    <h2 className="text-2xl font-bold">Connection Error</h2>
                </div>
                <p className="mt-4 text-lg">Failed to load data from Odoo.</p>
                <div className="p-3 mt-4 font-mono text-sm text-left bg-red-200 rounded-md dark:bg-red-800 dark:text-red-100">
                    <strong>Error details:</strong> {error}
                </div>
                <p className="mt-4">Please check your Supabase secrets and ensure the Odoo service is running.</p>
            </div>
        );
    }

    if (!data) {
        return <div className="text-center text-gray-500 dark:text-gray-400">No sales data available.</div>;
    }

    return (
        <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <KpiCard
                    title="Total Sales"
                    value={formatCurrency(data.totalSales)}
                    change="Live Data"
                    changeType="increase"
                />
                <KpiCard
                    title="Total Profit"
                    value={formatCurrency(data.totalProfit)}
                    change="Live Data"
                    changeType="increase"
                />
                <KpiCard
                    title="Total Orders"
                    value={data.orderCount.toString()}
                    change="Live Data"
                    changeType="increase"
                />
            </div>

            {/* Data Tables */}
            <div className="p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800">
                <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Sales by Sede</h3>
                <div className="mt-4 overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">Sede</th>
                                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">Total Sales</th>
                                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">Profit</th>
                                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300"># Orders</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                            {data.salesBySede.map(s => (
                                <tr key={s.sede}>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white">{s.sede}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap dark:text-gray-300">{formatCurrency(s.total_ventas)}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap dark:text-gray-300">{formatCurrency(s.ganancia)}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap dark:text-gray-300">{s.num_ordenes}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
