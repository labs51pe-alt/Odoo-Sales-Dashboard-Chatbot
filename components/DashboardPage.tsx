
import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useSalesData } from '../hooks/useSalesData';
import { KpiCard } from './common/KpiCard';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { data: salesData, isLoading, error } = useSalesData(user?.companyId);

  // Currency formatter for Peruvian Sol
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
    }).format(value);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-120px)]">
        <div className="text-center">
            <svg className="w-12 h-12 mx-auto text-blue-500 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-4 text-lg font-semibold text-gray-700 dark:text-gray-300">Loading Sales Data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-120px)]">
         <div className="p-6 text-center bg-red-100 border-2 border-red-300 rounded-lg dark:bg-red-900 dark:border-red-700">
            <h2 className="text-xl font-bold text-red-800 dark:text-red-200">Error Loading Data</h2>
            <p className="mt-2 text-red-600 dark:text-red-300">{error}</p>
        </div>
      </div>
    );
  }

  if (!salesData || salesData.orderCount === 0) {
    return (
        <div className="flex items-center justify-center h-[calc(100vh-120px)]">
            <div className="p-6 text-center bg-yellow-100 border-2 border-yellow-300 rounded-lg dark:bg-yellow-900 dark:border-yellow-700">
                <h2 className="text-xl font-bold text-yellow-800 dark:text-yellow-200">No Data Available</h2>
                <p className="mt-2 text-yellow-600 dark:text-yellow-300">
                    There is no sales data to display for the selected company.
                </p>
            </div>
        </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <KpiCard
          title="Total Sales"
          value={formatCurrency(salesData.totalSales)}
          change="12.5%"
          changeType="increase"
        />
        <KpiCard
          title="Total Profit"
          value={formatCurrency(salesData.totalProfit)}
          change="8.2%"
          changeType="increase"
        />
        <KpiCard
          title="Total Orders"
          value={salesData.orderCount.toLocaleString('es-PE')}
          change="2.1%"
          changeType="decrease"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Sales by Sede */}
        <div className="p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Sales by Branch (Sede)</h3>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">Branch</th>
                  <th scope="col" className="px-6 py-3 text-right">Sales</th>
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
                    <td className="px-6 py-4 text-right">{sede.num_ordenes.toLocaleString('es-PE')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sales by Product */}
        <div className="p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Top Products (Placeholder)</h3>
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
                  <tr key={product.name} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
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
      </div>
      
      {/* Monthly Sales */}
       <div className="p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Monthly Sales Overview (Placeholder)</h3>
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
                  <tr key={monthData.month} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
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
  );
};

export default DashboardPage;
