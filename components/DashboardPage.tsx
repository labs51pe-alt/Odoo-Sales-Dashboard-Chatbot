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
        return <div className="text-center text-gray-500 dark:text-gray-400">Loading sales data...</div>;
    }

    if (error) {
        return <div className="p-4 text-red-700 bg-red-100 rounded-md dark:bg-red-900 dark:text-red-200">Error loading data: {error}</div>;
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
                    change="12.5%"
                    changeType="increase"
                />
                <KpiCard
                    title="Total Profit"
                    value={formatCurrency(data.totalProfit)}
                    change="15.2%"
                    changeType="increase"
                />
                <KpiCard
                    title="Total Orders"
                    value={data.orderCount.toString()}
                    change="5.1%"
                    changeType="increase"
                />
            </div>

            {/* Data Tables */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Sales by Product */}
                <div className="p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800">
                    <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Sales by Product</h3>
                    <div className="mt-4 overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">Product</th>
                                    <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">Sales</th>
                                    <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">Profit</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                                {data.salesByProduct.map(p => (
                                    <tr key={p.name}>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white">{p.name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap dark:text-gray-300">{formatCurrency(p.sales)}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap dark:text-gray-300">{formatCurrency(p.profit)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Monthly Sales */}
                <div className="p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800">
                    <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Monthly Performance</h3>
                    <div className="mt-4 overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">Month</th>
                                    <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">Sales</th>
                                    <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">Profit</th>
                                </tr>
                            </thead>
                             <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                                {data.monthlySales.map(m => (
                                    <tr key={m.month}>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white">{m.month}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap dark:text-gray-300">{formatCurrency(m.sales)}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap dark:text-gray-300">{formatCurrency(m.profit)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
