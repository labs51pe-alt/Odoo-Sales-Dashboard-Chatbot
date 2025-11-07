import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useSalesData } from '../hooks/useSalesData';
import { KpiCard } from './common/KpiCard';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { COMPANIES } from '../constants';
import FinalDiagnosticReport from './common/FinalDiagnosticReport';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { data, isLoading, error } = useSalesData(user?.companyId);
  const company = user ? COMPANIES.find(c => c.id === user.companyId) : null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-120px)]">
        <div className="text-center">
          <svg className="w-12 h-12 mx-auto text-blue-500 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-4 text-lg font-semibold text-gray-700 dark:text-gray-300">Loading Sales Data for {company?.name}...</p>
        </div>
      </div>
    );
  }

  if (error) {
    // Render the new interactive diagnostic report on error.
    return <FinalDiagnosticReport errorDetails={error} />;
  }

  if (!data || data.orderCount === 0) {
    return (
        <div className="flex items-center justify-center h-[calc(100vh-120px)]">
            <div className="p-8 text-center bg-white rounded-lg shadow-xl dark:bg-gray-800">
                <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                <h2 className="mt-4 text-2xl font-bold text-gray-800 dark:text-white">No Sales Data Found</h2>
                <p className="mt-2 text-gray-600 dark:text-gray-400">There are no sale orders for {company?.name} in the selected period.</p>
            </div>
        </div>
    );
  }
  
  const formatCurrency = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

  // Chart data
  const monthlySalesData = {
    labels: data.monthlySales.map(m => m.month),
    datasets: [
      {
        label: 'Sales',
        data: data.monthlySales.map(m => m.sales),
        borderColor: 'rgb(54, 162, 235)',
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        yAxisID: 'y',
      },
      {
        label: 'Profit',
        data: data.monthlySales.map(m => m.profit),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        yAxisID: 'y1',
      }
    ]
  };

  const productSalesData = {
    labels: data.salesByProduct.map(p => p.name),
    datasets: [
        {
            label: 'Product Sales',
            data: data.salesByProduct.map(p => p.sales),
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            borderColor: 'rgb(255, 99, 132)',
            borderWidth: 1
        }
    ]
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <KpiCard title="Total Sales" value={formatCurrency(data.totalSales)} change="+5.4%" changeType="increase" />
        <KpiCard title="Total Profit" value={formatCurrency(data.totalProfit)} change="+12.1%" changeType="increase" />
        <KpiCard title="Total Orders" value={data.orderCount.toString()} change="-1.2%" changeType="decrease" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Monthly Performance</h3>
          <Line options={{ responsive: true, interaction: { mode: 'index' as const, intersect: false }, scales: { y: { type: 'linear' as const, display: true, position: 'left' as const }, y1: { type: 'linear' as const, display: true, position: 'right' as const, grid: { drawOnChartArea: false } } } }} data={monthlySalesData} />
        </div>
        <div className="p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Top Products by Sales</h3>
          <Bar options={{ responsive: true, indexAxis: 'y' as const }} data={productSalesData} />
        </div>
      </div>
      
      <div className="p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Sales by Location (Sede)</h3>
          <div className="overflow-x-auto">
            <table className="w-full mt-4 text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">Location</th>
                        <th scope="col" className="px-6 py-3">Total Sales</th>
                        <th scope="col" className="px-6 py-3">Profit</th>
                        <th scope="col" className="px-6 py-3">Number of Orders</th>
                    </tr>
                </thead>
                <tbody>
                    {data.salesBySede.map(sede => (
                        <tr key={sede.sede} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{sede.sede}</th>
                            <td className="px-6 py-4">{formatCurrency(sede.total_ventas)}</td>
                            <td className="px-6 py-4">{formatCurrency(sede.ganancia)}</td>
                            <td className="px-6 py-4">{sede.num_ordenes}</td>
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