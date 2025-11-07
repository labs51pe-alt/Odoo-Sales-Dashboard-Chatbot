import type { Company, SalesData } from './types';

// Company and user data for the application
export const COMPANIES: Company[] = [
  { id: 'facturaclic', name: 'Factura Clic' },
  { id: 'techcorp', name: 'TechCorp Peru' },
];

// NOTE: In a real application, user data would not be stored in a constant file.
export const USERS = [
  { 
    id: 'user-1', 
    username: 'soporte@facturaclic.pe', 
    allowedCompanyIds: ['facturaclic', 'techcorp'] 
  },
  { 
    id: 'user-2', 
    username: 'juan.perez', 
    allowedCompanyIds: ['techcorp'] 
  },
];

export const USER_PASSWORDS: Record<string, string> = {
  'soporte@facturaclic.pe': 'facturaclic123',
  'juan.perez': 'password123',
};

// Supabase configuration
// IMPORTANT: Replace with your actual Supabase project URL if not using the local emulator.
export const SUPABASE_FUNCTION_BASE_URL = 'http://localhost:54321/functions/v1/'; 
export const ASK_GEMINI_FUNCTION_NAME = 'ask-gemini';
export const ODOO_SALES_FUNCTION_NAME = 'get-odoo-sales';
export const CHECK_SECRETS_FUNCTION_NAME = 'check-secrets';


// Toggle to use mock data instead of calling the Supabase function.
// Useful for frontend development without a running Supabase instance.
export const USE_MOCK_DATA = false;

// Mock sales data for different companies.
export const MOCK_SALES_DATA: Record<string, SalesData> = {
  'facturaclic': {
    totalSales: 125000,
    totalProfit: 45000,
    orderCount: 340,
    salesByProduct: [
      { name: 'Plan Básico', sales: 50000, profit: 20000 },
      { name: 'Plan Premium', sales: 75000, profit: 25000 },
    ],
    monthlySales: [
      { month: 'Enero', sales: 30000, profit: 10000 },
      { month: 'Febrero', sales: 40000, profit: 15000 },
      { month: 'Marzo', sales: 55000, profit: 20000 },
    ],
    salesBySede: [
        { sede: 'Lima', total_ventas: 80000, ganancia: 30000, num_ordenes: 200 },
        { sede: 'Arequipa', total_ventas: 45000, ganancia: 15000, num_ordenes: 140 },
    ]
  },
  'techcorp': {
    totalSales: 280000,
    totalProfit: 95000,
    orderCount: 520,
    salesByProduct: [
      { name: 'Laptop Pro', sales: 150000, profit: 50000 },
      { name: 'Monitor Ultra', sales: 80000, profit: 30000 },
      { name: 'Teclado Mecánico', sales: 50000, profit: 15000 },
    ],
    monthlySales: [
        { month: 'Enero', sales: 80000, profit: 25000 },
        { month: 'Febrero', sales: 90000, profit: 30000 },
        { month: 'Marzo', sales: 110000, profit: 40000 },
    ],
    salesBySede: [
        { sede: 'Lima', total_ventas: 180000, ganancia: 60000, num_ordenes: 350 },
        { sede: 'Trujillo', total_ventas: 100000, ganancia: 35000, num_ordenes: 170 },
    ]
  }
};
