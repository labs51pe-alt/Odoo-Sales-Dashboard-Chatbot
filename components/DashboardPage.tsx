import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useSalesData } from '../hooks/useSalesData';
import { KpiCard } from './common/KpiCard';

const DashboardPage: React.FC = () => {
    const { user } = useAuth();
    const { data: salesData, isLoading, error } = useSalesData(user?.companyId);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <svg className="w-12 h-12 mx-auto text-blue-500 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">Loading sales data...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 text-red-800 bg-red-100 border border-red-200 rounded-lg shadow-md dark:bg-red-900/20 dark:border-red-800/50 dark:text-red-300">
                <h3 className="font-bold">Error Loading Data</h3>
                <p>{error}</p>
            </div>
        );
    }
    
    if (!salesData || salesData.orderCount === 0) {
        return (
            <div className="p-8 text-center bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">No Sales Data Available</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">There is no sales data to display for the selected company.</p>
            </div>
        );
    }
    
    // Formatting for display
    const formatCurrency = (value: number) => 
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value); // Assuming USD for now

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <KpiCard
                    title="Total Sales"
                    value={formatCurrency(salesData.totalSales)}
                    change="+5.4%"
                    changeType="increase"
                />
                <KpiCard
                    title="Total Profit"
                    value={formatCurrency(salesData.totalProfit)}
                    change="+12.1%"
                    changeType="increase"
                />
                <KpiCard
                    title="Total Orders"
                    value={salesData.orderCount.toLocaleString()}
                    change="-1.2%"
                    changeType="decrease"
                />
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Sales by Sede */}
                <div className="p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800">
                    <h3 className="text-lg font-medium text-gray-800 dark:text-white">Sales by Branch (Sede)</h3>
                    <div className="mt-4 overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Branch</th>
                                    <th scope="col" className="px-6 py-3 text-right">Total Sales</th>
                                    <th scope="col" className="px-6 py-3 text-right">Profit</th>
                                    <th scope="col" className="px-6 py-3 text-right">Orders</th>
                                </tr>
                            </thead>
                            <tbody>
                                {salesData.salesBySede.map((sede) => (
                                    <tr key={sede.sede} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            {sede.sede}
                                        </th>
                                        <td className="px-6 py-4 text-right">{formatCurrency(sede.total_ventas)}</td>
                                        <td className="px-6 py-4 text-right">{formatCurrency(sede.ganancia)}</td>
                                        <td className="px-6 py-4 text-right">{sede.num_ordenes.toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Sales by Product (Placeholder) */}
                <div className="p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800">
                    <h3 className="text-lg font-medium text-gray-800 dark:text-white">Top Products (Live Data)</h3>
                    <div className="mt-4">
                        <ul className="space-y-3">
                            {salesData.salesByProduct.map((product) => (
                                <li key={product.name} className="flex justify-between items-center p-3 bg-gray-50 rounded-md dark:bg-gray-700">
                                    <span className="font-medium text-gray-700 dark:text-gray-300">{product.name}</span>
                                    <span className="font-bold text-gray-800 dark:text-white">{formatCurrency(product.sales)}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
