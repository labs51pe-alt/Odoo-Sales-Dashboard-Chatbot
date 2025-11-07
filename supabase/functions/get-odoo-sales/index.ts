// supabase/functions/get-odoo-sales/index.ts
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import Odoo from "https://deno.land/x/odoo@v1.2.0/odoo.js";

// Supabase provides the 'Deno' global object in its Edge Function environment.
declare const Deno: any;

// Helper function to create CORS headers
const createCorsHeaders = () => ({
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
});

// Main request handler
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: createCorsHeaders() });
  }

  try {
    // Extract companyId from the URL path.
    // e.g., .../get-odoo-sales/botica-angie
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/');
    const companyId = pathParts[pathParts.length - 1];

    if (!companyId) {
      throw new Error("Company ID is missing from the request URL.");
    }
    
    // Dynamically retrieve Odoo connection details from Supabase secrets based on companyId.
    // SECRETS FORMAT: ODOO_URL_botica-angie, ODOO_DB_botica-angie, etc.
    const odooUrl = Deno.env.get(`ODOO_URL_${companyId}`);
    const odooDb = Deno.env.get(`ODOO_DB_${companyId}`);
    const odooUser = Deno.env.get(`ODOO_USER_${companyId}`);
    const odooPassword = Deno.env.get(`ODOO_PASSWORD_${companyId}`);

    if (!odooUrl || !odooDb || !odooUser || !odooPassword) {
      throw new Error(`Odoo connection credentials are not configured for company: ${companyId}`);
    }

    // Initialize Odoo client
    const odoo = new Odoo({
      url: odooUrl,
      db: odooDb,
      username: odooUser,
      password: odooPassword,
    });

    // Authenticate with Odoo
    await odoo.connect();

    // Fetch sales orders. We'll look at orders from the last year.
    // NOTE: This is a simplified query. A real-world scenario might have more complex
    // filtering based on state (e.g., 'sale', 'done').
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    const dateStr = oneYearAgo.toISOString().split('T')[0];

    const orders = await odoo.search_read(
      'sale.order',
      [['date_order', '>=', dateStr], ['state', 'in', ['sale', 'done']]],
      ['amount_total', 'margin', 'name', 'date_order', 'warehouse_id', 'order_line']
    );

    if (orders.length === 0) {
      // Return a valid empty state if there are no sales.
      const emptyData = {
        totalSales: 0,
        totalProfit: 0,
        orderCount: 0,
        salesByProduct: [],
        monthlySales: [],
        salesBySede: [],
      };
      return new Response(JSON.stringify(emptyData), {
        headers: { ...createCorsHeaders(), 'Content-Type': 'application/json' },
      });
    }

    // Process the data
    const totalSales = orders.reduce((sum, order) => sum + order.amount_total, 0);
    const totalProfit = orders.reduce((sum, order) => sum + order.margin, 0);
    const orderCount = orders.length;

    // Aggregate sales by branch (sede/warehouse)
    const salesBySedeMap = new Map();
    for (const order of orders) {
      const sedeName = order.warehouse_id ? order.warehouse_id[1] : 'Unknown Branch';
      if (!salesBySedeMap.has(sedeName)) {
        salesBySedeMap.set(sedeName, { sede: sedeName, total_ventas: 0, ganancia: 0, num_ordenes: 0 });
      }
      const current = salesBySedeMap.get(sedeName);
      current.total_ventas += order.amount_total;
      current.ganancia += order.margin;
      current.num_ordenes += 1;
    }
    
    // Fetch order lines to analyze products
    const orderLineIds = orders.flatMap(order => order.order_line);
    const orderLines = await odoo.search_read(
        'sale.order.line',
        [['id', 'in', orderLineIds]],
        ['product_id', 'price_total', 'margin']
    );

    // Aggregate by product
    const salesByProductMap = new Map();
    for (const line of orderLines) {
        if (!line.product_id) continue;
        const productName = line.product_id[1];
        if(!salesByProductMap.has(productName)) {
            salesByProductMap.set(productName, { name: productName, sales: 0, profit: 0 });
        }
        const current = salesByProductMap.get(productName);
        current.sales += line.price_total;
        current.profit += line.margin;
    }

    // Aggregate by month
    const monthlySalesMap = new Map();
    for (const order of orders) {
        const month = new Date(order.date_order).toLocaleString('default', { month: 'long', year: 'numeric' });
        if(!monthlySalesMap.has(month)) {
            monthlySalesMap.set(month, { month: month, sales: 0, profit: 0 });
        }
        const current = monthlySalesMap.get(month);
        current.sales += order.amount_total;
        current.profit += order.margin;
    }
    
    // Convert maps to arrays for the final response
    const salesBySede = Array.from(salesBySedeMap.values()).sort((a,b) => b.total_ventas - a.total_ventas);
    const salesByProduct = Array.from(salesByProductMap.values()).sort((a,b) => b.sales - a.sales).slice(0, 10); // Top 10
    const monthlySales = Array.from(monthlySalesMap.values());

    const salesData = {
      totalSales,
      totalProfit,
      orderCount,
      salesByProduct,
      monthlySales,
      salesBySede,
    };

    // Return the processed data
    return new Response(JSON.stringify(salesData), {
      headers: { ...createCorsHeaders(), 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error("Function Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...createCorsHeaders(), 'Content-Type': 'application/json' },
    });
  }
});
