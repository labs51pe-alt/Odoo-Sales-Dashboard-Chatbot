import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useSalesData } from '../hooks/useSalesData';
import { KpiCard } from './common/KpiCard';
import FinalDiagnosticReport from './common/FinalDiagnosticReport';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { data: salesData, isLoading, error } = useSalesData(user?.companyId);

  // A simple number formatter
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD', // This can be adjusted if a different currency is needed
      minimumFractionDigits: 2,
    }).format(value);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800 animate-pulse">
            <div className="h-4 bg-gray-300 rounded dark:bg-gray-700 w-1/4 mb-4"></div>
            <div className="h-8 bg-gray-300 rounded dark:bg-gray-700 w-1/2 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded dark:bg-gray-700 w-1/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    // If there is an error, render the new, interactive diagnostic tool.
    return <FinalDiagnosticReport errorDetails={error} />;
  }

  if (!salesData || salesData.orderCount === 0) {
    return (
      <div className="p-8 text-center bg-white rounded-lg shadow-lg dark:bg-gray-800">
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">No Sales Data Available</h2>
        <p className="mt-2 text-gray-500 dark:text-gray-400">There is no sales data to display for the selected company.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <KpiCard
          title="Total Sales"
          value={formatCurrency(salesData.totalSales)}
          change="+0.0%" // Placeholder change data
          changeType="increase"
        />
        <KpiCard
          title="Total Profit"
          value={formatCurrency(salesData.totalProfit)}
          change="+0.0%" // Placeholder change data
          changeType="increase"
        />
        <KpiCard
          title="Total Orders"
          value={salesData.orderCount.toString()}
          change="+0.0%" // Placeholder change data
          changeType="increase"
        />
      </div>

      {/* Sales by Sede (Branch/Location) */}
      <div className="p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Sales by Branch</h3>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">Branch</th>
                <th scope="col" className="px-6 py-3 text-right">Orders</th>
                <th scope="col" className="px-6 py-3 text-right">Total Sales</th>
                <th scope="col" className="px-6 py-3 text-right">Profit</th>
              </tr>
            </thead>
            <tbody>
              {salesData.salesBySede.map((sede) => (
                <tr key={sede.sede} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {sede.sede}
                  </th>
                  <td className="px-6 py-4 text-right">{sede.num_ordenes}</td>
                  <td className="px-6 py-4 text-right">{formatCurrency(sede.total_ventas)}</td>
                  <td className="px-6 py-4 text-right">{formatCurrency(sede.ganancia)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Other data tables */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Sales by Product (Sample)</h3>
            <div className="mt-4 overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">Product Name</th>
                        <th scope="col" className="px-6 py-3 text-right">Sales</th>
                        <th scope="col" className="px-6 py-3 text-right">Profit</th>
                    </tr>
                    </thead>
                    <tbody>
                    {salesData.salesByProduct.map((product) => (
                        <tr key={product.name} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            {product.name}
                        </th>
                        <td className="px-6 py-4 text-right">{formatCurrency(product.sales)}</td>
                        <td className="px-6 py-4 text-right">{formatCurrency(product.profit)}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>

        <div className="p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Monthly Sales (Sample)</h3>
            <div className="mt-4 overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">Month</th>
                        <th scope="col" className="px-6 py-3 text-right">Sales</th>
                        <th scope="col" className="px-6 py-3 text-right">Profit</th>
                    </tr>
                    </thead>
                    <tbody>
                    {salesData.monthlySales.map((monthData) => (
                        <tr key={monthData.month} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            {monthData.month}
                        </th>
                        <td className="px-6 py-4 text-right">{formatCurrency(monthData.sales)}</td>
                        <td className="px-6 py-4 text-right">{formatCurrency(monthData.profit)}</td>
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