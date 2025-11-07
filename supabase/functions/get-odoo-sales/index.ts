// supabase/functions/get-odoo-sales/index.ts
// This function simulates fetching sales data for a specific company.
// In a real application, this would connect to an Odoo instance or another ERP.

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

// Mock sales data to be returned by the function.
// This is included directly to keep the function self-contained.
const MOCK_SALES_DATA: Record<string, any> = {
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

// Common headers for CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Extract company ID from the URL path, e.g., /get-odoo-sales/facturaclic
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/');
    const companyId = pathParts[pathParts.length - 1];

    if (!companyId) {
      throw new Error("Company ID is missing from the request URL.");
    }
    
    // In a real-world scenario, you would use the companyId to query your
    // Odoo database or API. For this example, we'll return mock data.
    console.log(`Fetching data for company: ${companyId}`);
    
    const companyData = MOCK_SALES_DATA[companyId];

    if (!companyData) {
      return new Response(JSON.stringify({ error: `No data found for company ID: ${companyId}` }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Return the sales data for the requested company
    return new Response(JSON.stringify(companyData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error("Function Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
