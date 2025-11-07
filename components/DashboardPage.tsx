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

  // ACTION: Updated the hyper-specific error screen for the "ID mapping" issue.
  if (error && error.includes('No Odoo ID mapping found')) {
      return (
          <div className="flex items-center justify-center h-[calc(100vh-120px)]">
              <div className="w-full max-w-2xl p-8 space-y-6 text-center bg-white border-2 border-yellow-300 rounded-lg shadow-2xl dark:bg-gray-800 dark:border-yellow-700">
                  <div className="flex flex-col items-center">
                      <svg className="w-16 h-16 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                      <h2 className="mt-4 text-2xl font-bold text-gray-800 dark:text-yellow-200">Final Step: Update and Synchronize</h2>
                      <p className="mt-2 text-gray-600 dark:text-yellow-300">
                          We've located the issue! Your local code is outdated. Please follow these two steps to fix it.
                      </p>
                  </div>
                  <div className="p-4 space-y-4 text-left bg-gray-100 rounded-lg dark:bg-gray-700">
                      <div>
                        <p className="mb-2 font-semibold text-gray-800 dark:text-gray-200">Step 1: Update Your Local File</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          I have provided you with the corrected code for the file <code className="px-1 text-xs font-semibold bg-gray-200 rounded dark:bg-gray-600 dark:text-yellow-200">supabase/functions/get-odoo-sales/index.ts</code>.
                          Please ensure you have replaced the entire content of that file on your computer with the new version.
                        </p>
                      </div>
                      <div>
                        <p className="mb-2 font-semibold text-gray-800 dark:text-gray-200">Step 2: Send the Update to the Server</p>
                        <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                            Once your file is updated, run the command below in your terminal. This will synchronize the server with your correct company list.
                        </p>
                        <div className="flex items-center p-3 font-mono text-sm text-gray-800 bg-gray-200 rounded-md dark:bg-gray-900 dark:text-gray-300">
                            <span className="flex-grow">supabase functions deploy get-odoo-sales --no-verify-jwt</span>
                            <button
                                onClick={() => navigator.clipboard.writeText('supabase functions deploy get-odoo-sales --no-verify-jwt')}
                                className="px-3 py-1 ml-4 text-xs font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700"
                            >
                                Copy
                            </button>
                        </div>
                      </div>
                  </div>
                   <button
                      onClick={() => window.location.reload()}
                      className="w-full px-4 py-2 mt-4 font-bold text-white bg-green-600 rounded-lg hover:bg-green-700"
                  >
                      I've run the command, now Reload Dashboard
                  </button>
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