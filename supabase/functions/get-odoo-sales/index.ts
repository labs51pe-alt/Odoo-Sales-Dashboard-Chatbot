// supabase/functions/get-odoo-sales/index.ts

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

// Since we cannot import from the frontend, we define the necessary types here.
// These should be kept in sync with `types.ts` in the frontend.
interface SalesBySede {
  sede: string;
  total_ventas: number;
  ganancia: number;
  num_ordenes: number;
}

interface SalesData {
  totalSales: number;
  totalProfit: number;
  orderCount: number;
  salesByProduct: { name: string; sales: number; profit: number }[];
  monthlySales: { month: string; sales: number; profit: number }[];
  salesBySede: SalesBySede[];
}

// =================================================================================
// MOCK DATA GENERATION
// In a real scenario, this section would be replaced with a client library
// to connect to an Odoo instance using credentials from Deno.env.get().
// For demonstration, we generate plausible-looking data based on companyId.
// =================================================================================
const generateMockSalesData = (companyId: string): SalesData => {
  // Use a simple hash of the companyId to seed the random data,
  // making the data consistent for the same company.
  let seed = 0;
  for (let i = 0; i < companyId.length; i++) {
    seed += companyId.charCodeAt(i);
  }

  const random = (min: number, max: number) => {
    seed = (seed * 9301 + 49297) % 233280;
    const rnd = seed / 233280;
    return min + rnd * (max - min);
  };
  
  const products = ['Aspirin', 'Ibuprofen', 'Band-Aids', 'Cough Syrup', 'Vitamins', 'Pain Reliever', 'Allergy Pills', 'Stomach Relief', 'First Aid Kit', 'Hand Sanitizer'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June'];
  const sedes = companyId.includes('botica') ? ['Centro', 'Norte', 'Sur'] : ['Main Office', 'Warehouse'];

  const salesByProduct = products.slice(0, 5).map(name => {
      const sales = random(1000, 15000);
      const profit = sales * random(0.2, 0.4);
      return { name, sales, profit };
  });

  const monthlySales = months.map(month => {
      const sales = random(15000, 50000);
      const profit = sales * random(0.25, 0.35);
      return { month, sales, profit };
  });

  const salesBySede = sedes.map(sede => {
      const total_ventas = random(20000, 80000);
      const ganancia = total_ventas * random(0.2, 0.4);
      const num_ordenes = Math.floor(random(50, 500));
      return { sede, total_ventas, ganancia, num_ordenes };
  });

  const totalSales = monthlySales.reduce((acc, m) => acc + m.sales, 0);
  const totalProfit = monthlySales.reduce((acc, m) => acc + m.profit, 0);
  const orderCount = salesBySede.reduce((acc, s) => acc + s.num_ordenes, 0);

  return {
    totalSales,
    totalProfit,
    orderCount,
    salesByProduct,
    monthlySales,
    salesBySede,
  };
};


serve(async (req) => {
  // Standard CORS preflight handling.
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST', // Allow GET
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      }
    });
  }

  try {
    // Extract companyId from the URL path.
    // e.g., .../get-odoo-sales/botica-angie -> companyId = 'botica-angie'
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/');
    const companyId = pathParts[pathParts.length - 1];

    if (!companyId) {
      throw new Error("Company ID is missing from the request URL.");
    }
    
    console.log(`Fetching sales data for company: ${companyId}`);

    // Here you would typically connect to Odoo.
    // const odooClient = new OdooClient({ ...Deno.env.get("ODOO_CONFIG") });
    // const salesData = await odooClient.getSalesFor(companyId);

    // For this example, we use the mock data generator.
    const salesData = generateMockSalesData(companyId);
    
    // Return the data with CORS headers.
    return new Response(JSON.stringify(salesData), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      status: 200,
    });

  } catch (error) {
    console.error("Function Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }
});
