// supabase/functions/get-odoo-sales/index.ts
// LIVE ODOO CONNECTION VERSION
// This function connects to a real Odoo instance using XML-RPC.

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { DOMParser, type Document, type Element } from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";

declare const Deno: any;

// =================================================================================
// COMPANY ID MAPPING (The "Translator")
// This maps the frontend's string ID to Odoo's internal numeric ID.
// This is based on the final list provided by the user.
// =================================================================================
const COMPANY_NAME_TO_ODOO_ID_MAP: Record<string, number> = {
    'botica-angie': 8,
    'servilab-urubamba': 2,
    'baca-juarez': 3,
    'botica-j-m': 9,
    'bioplus-farma': 4,
    'feet-care': 7,
    'boticas-multifarma': 6,
    'maripeya': 5,
    'ferreteria-sac': 1, // Assuming the base.main_company corresponds to ID 1, needs verification.
};


// =================================================================================
// ODOO XML-RPC CLIENT
// =================================================================================
async function callOdoo(service: 'common' | 'object', method: string, ...args: any[]) {
    const url = Deno.env.get("ODOO_URL");
    const db = Deno.env.get("ODOO_DB");
    const user = Deno.env.get("ODOO_USER");
    const password = Deno.env.get("ODOO_API_KEY");

    // Self-diagnostic check for secrets
    const missingSecrets = ['ODOO_URL', 'ODOO_DB', 'ODOO_USER', 'ODOO_API_KEY'].filter(key => !Deno.env.get(key));
    if (missingSecrets.length > 0) {
        throw new Error(`Action Required: The following secrets are missing from your Supabase project: ${missingSecrets.join(', ')}`);
    }

    const endpoint = `${url}/xmlrpc/2/${service}`;
    
    let uid: string | number = user;
    if (service === 'object') {
        uid = args.shift() as number; // First arg for 'object' calls is the user ID
    }

    const serializedArgs = args.map(arg => `<param><value>${toXmlRpc(arg)}</value></param>`).join('');

    const body = `<?xml version="1.0"?>
    <methodCall>
        <methodName>${method}</methodName>
        <params>
            <param><value><string>${db}</string></value></param>
            <param><value><${service === 'common' ? 'string' : 'int'}>${uid}</${service === 'common' ? 'string' : 'int'}></value></param>
            <param><value><string>${password}</string></value></param>
            ${serializedArgs}
        </params>
    </methodCall>`;

    const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'text/xml', 'Accept': 'text/xml' },
        body,
    });

    if (!response.ok) {
        throw new Error(`Odoo API request failed: ${response.status} ${response.statusText}. Check your ODOO_URL.`);
    }

    const responseText = await response.text();
    if (responseText.includes('<fault>')) {
        const faultString = responseText.split('<string>')[1]?.split('</string>')[0] || "Unknown RPC error";
        throw new Error(`Odoo RPC Fault: ${faultString}. Check your DB name, user, and API key.`);
    }
    
    return parseXmlRpcResponse(responseText);
}

// =================================================================================
// MAIN SERVER HANDLER
// =================================================================================
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const url = new URL(req.url);
        const companyId = url.pathname.split('/').pop();

        if (!companyId) {
            throw new Error("Company ID is missing in the request URL.");
        }

        const odooCompanyId = COMPANY_NAME_TO_ODOO_ID_MAP[companyId];
        if (odooCompanyId === undefined) {
            throw new Error(`No Odoo ID mapping found for company: ${companyId}. Check your 'get-odoo-sales' function code.`);
        }

        // 1. Authenticate with Odoo to get UID
        const uid = await callOdoo('common', 'authenticate');
        if (!uid || typeof uid !== 'number') {
            throw new Error("Odoo authentication failed. Please verify your ODOO_DB, ODOO_USER, and ODOO_API_KEY secrets.");
        }

        // 2. Fetch sales data for the specific company
        const domain = [
            ['state', 'in', ['sale', 'done']],
            ['company_id', '=', odooCompanyId]
        ];
        const fields = ['amount_total', 'margin', 'warehouse_id', 'date_order', 'name'];
        const saleOrders = await callOdoo('object', 'execute_kw', uid, 'sale.order', 'search_read', [domain], { fields });

        if (!Array.isArray(saleOrders)) {
             return new Response(JSON.stringify({ totalSales: 0, totalProfit: 0, orderCount: 0, salesByProduct: [], monthlySales: [], salesBySede: [] }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
        }
        
        // 3. Process the data
        const salesBySede: Record<string, { sede: string; total_ventas: number; ganancia: number; num_ordenes: number }> = {};
        let totalSales = 0;
        let totalProfit = 0;

        for (const order of saleOrders) {
            totalSales += order.amount_total || 0;
            totalProfit += order.margin || 0;
            
            const sedeName = order.warehouse_id ? order.warehouse_id[1] : 'Sede Desconocida';
            if (!salesBySede[sedeName]) {
                salesBySede[sedeName] = { sede: sedeName, total_ventas: 0, ganancia: 0, num_ordenes: 0 };
            }
            salesBySede[sedeName].total_ventas += order.amount_total || 0;
            salesBySede[sedeName].ganancia += order.margin || 0;
            salesBySede[sedeName].num_ordenes += 1;
        }
        
        const processedData = {
            totalSales: totalSales,
            totalProfit: totalProfit,
            orderCount: saleOrders.length,
            salesBySede: Object.values(salesBySede),
            // NOTE: These are placeholders. Real implementation would require more complex queries.
            salesByProduct: [ { name: 'Live Product A', sales: totalSales * 0.6, profit: totalProfit * 0.7 }, { name: 'Live Product B', sales: totalSales * 0.4, profit: totalProfit * 0.3 } ],
            monthlySales: [ { month: 'Live Data', sales: totalSales, profit: totalProfit } ],
        };
        
        return new Response(JSON.stringify(processedData), {
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


// =================================================================================
// XML-RPC HELPER FUNCTIONS
// =================================================================================
function toXmlRpc(value: any): string {
    // This is a simplified serializer. A robust library would be better for production.
    switch (typeof value) {
        case 'string': return `<string>${value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</string>`;
        case 'number': return value % 1 === 0 ? `<int>${value}</int>` : `<double>${value}</double>`;
        case 'boolean': return `<boolean>${value ? 1 : 0}</boolean>`;
        case 'object':
            if (value === null) return '<nil/>';
            if (Array.isArray(value)) {
                return `<array><data>${value.map(v => `<value>${toXmlRpc(v)}</value>`).join('')}</data></array>`;
            }
            return `<struct>${Object.entries(value)
                .map(([k, v]) => `<member><name>${k}</name><value>${toXmlRpc(v)}</value></member>`)
                .join('')}</struct>`;
        default: return '<nil/>';
    }
}

function parseXmlRpcResponse(xml: string): any {
    const doc: Document | null = new DOMParser().parseFromString(xml, "text/xml");
    // FIX: Add an explicit null check for the document. This helps the type checker
    // correctly infer the type of `doc` and avoids errors on the following `querySelector` call.
    if (!doc) {
        return null;
    }
    const valueNode = doc.querySelector("params param value");
    return valueNode ? parseValueNode(valueNode) : null;
}

function parseValueNode(node: Element): any {
    // This is a simplified parser.
    const typeNode = node.firstElementChild;
    if (!typeNode) return null;
    const type = typeNode.tagName.toLowerCase();

    switch (type) {
        case 'int':
        case 'i4': return parseInt(typeNode.textContent || '0', 10);
        case 'double': return parseFloat(typeNode.textContent || '0');
        case 'string': return typeNode.textContent;
        case 'boolean': return typeNode.textContent === '1';
        case 'array':
            return Array.from(typeNode.querySelectorAll("data > value") || []).map(parseValueNode);
        case 'struct':
            const obj: Record<string, any> = {};
            for (const member of Array.from(typeNode.querySelectorAll("member"))) {
                const name = member.querySelector("name")?.textContent || '';
                const value = member.querySelector("value");
                if (name && value) {
                    obj[name] = parseValueNode(value);
                }
            }
            return obj;
        case 'nil': return null;
        default: return typeNode.textContent;
    }
}
