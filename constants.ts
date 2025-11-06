import type { Company, User, SalesData } from './types';

// =================================================================================
// ACTION: I have updated this URL to point to your Supabase project.
// You now need to create a Supabase Edge Function named 'get-odoo-sales'.
// The function will be called like: .../get-odoo-sales/empresa-a
// =================================================================================
export const SUPABASE_FUNCTION_BASE_URL = "https://ixhbgkimmzgfwehbbloa.supabase.co/functions/v1/get-odoo-sales/";

// Set this to `false` to use live data from your Supabase function.
// I have set this to `false` for you to activate the live connection.
export const USE_MOCK_DATA = false;


export const COMPANIES: Company[] = [
  { id: 'empresa-a', name: 'Empresa A (Innovate Corp)' },
  { id: 'empresa-b', name: 'Empresa B (Quantum Solutions)' },
  { id: 'empresa-c', name: 'Empresa C (Apex Dynamics)' },
];

export const USERS: User[] = [
  { id: 'u1', username: 'juan.perez', companyId: 'empresa-a' },
  { id: 'u2', username: 'ana.lopez', companyId: 'empresa-a' },
  { id: 'u3', username: 'maria.gomez', companyId: 'empresa-b' },
  { id: 'u4', username: 'pedro.sanchez', companyId: 'empresa-b' },
  { id: 'u5', username: 'carlos.ruiz', companyId: 'empresa-c' },
];

// Passwords are mocked for demonstration purposes
export const USER_PASSWORDS: Record<string, string> = {
  'juan.perez': 'demo123',
  'ana.lopez': 'pass123',
  'maria.gomez': 'demo456',
  'pedro.sanchez': 'pass456',
  'carlos.ruiz': 'demo789',
};

export const MOCK_SALES_DATA: Record<string, SalesData> = {
  'empresa-a': {
    totalSales: 450000,
    totalProfit: 120000,
    orderCount: 520,
    salesByProduct: [
      { name: 'Laptop Pro', sales: 150000, profit: 40000 },
      { name: 'Monitor 4K', sales: 120000, profit: 35000 },
      { name: 'Docking Station', sales: 80000, profit: 25000 },
      { name: 'Webcam HD', sales: 60000, profit: 15000 },
      { name: 'Mechanical Keyboard', sales: 40000, profit: 5000 },
    ],
    monthlySales: [
      { month: 'Jan', sales: 35000, profit: 10000 },
      { month: 'Feb', sales: 42000, profit: 12000 },
      { month: 'Mar', sales: 55000, profit: 15000 },
      { month: 'Apr', sales: 48000, profit: 13000 },
      { month: 'May', sales: 62000, profit: 18000 },
      { month: 'Jun', sales: 75000, profit: 22000 },
    ],
     salesBySede: [
      { sede: 'Sede Central', total_ventas: 250000, ganancia: 70000, num_ordenes: 300 },
      { sede: 'Almacén Norte', total_ventas: 120000, ganancia: 35000, num_ordenes: 150 },
      { sede: 'Sucursal Oeste', total_ventas: 80000, ganancia: 15000, num_ordenes: 70 },
    ],
  },
  'empresa-b': {
    totalSales: 780000,
    totalProfit: 250000,
    orderCount: 890,
    salesByProduct: [
      { name: 'Cloud Service S1', sales: 250000, profit: 100000 },
      { name: 'Data Analytics Suite', sales: 200000, profit: 70000 },
      { name: 'AI Module', sales: 150000, profit: 50000 },
      { name: 'Security Package', sales: 100000, profit: 20000 },
      { name: 'Support Tier 1', sales: 80000, profit: 10000 },
    ],
    monthlySales: [
      { month: 'Jan', sales: 60000, profit: 20000 },
      { month: 'Feb', sales: 85000, profit: 28000 },
      { month: 'Mar', sales: 110000, profit: 35000 },
      { month: 'Apr', sales: 130000, profit: 45000 },
      { month: 'May', sales: 155000, profit: 57000 },
      { month: 'Jun', sales: 180000, profit: 65000 },
    ],
    salesBySede: [
        { sede: 'HQ Global', total_ventas: 780000, ganancia: 250000, num_ordenes: 890 },
    ],
  },
  'empresa-c': {
    totalSales: 320000,
    totalProfit: 95000,
    orderCount: 410,
    salesByProduct: [
      { name: 'Robotic Arm', sales: 120000, profit: 45000 },
      { name: 'Conveyor Belt', sales: 80000, profit: 25000 },
      { name: 'Sensor Kit', sales: 60000, profit: 15000 },
      { name: 'Control Unit', sales: 40000, profit: 8000 },
      { name: 'Power Supply', sales: 20000, profit: 2000 },
    ],
    monthlySales: [
      { month: 'Jan', sales: 28000, profit: 8000 },
      { month: 'Feb', sales: 35000, profit: 10000 },
      { month: 'Mar', sales: 45000, profit: 14000 },
      { month: 'Apr', sales: 58000, profit: 19000 },
      { month: 'May', sales: 68000, profit: 22000 },
      { month: 'Jun', sales: 86000, profit: 22000 },
    ],
     salesBySede: [
      { sede: 'Planta de Producción', total_ventas: 280000, ganancia: 85000, num_ordenes: 350 },
      { sede: 'Centro Logístico', total_ventas: 40000, ganancia: 10000, num_ordenes: 60 },
    ],
  },
};