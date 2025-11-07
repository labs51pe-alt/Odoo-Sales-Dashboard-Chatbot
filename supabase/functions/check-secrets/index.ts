// supabase/functions/check-secrets/index.ts
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

declare const Deno: any;

const createCorsHeaders = () => ({
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
});

// List of companies provided in the app's constants.
// In a real app, this might come from a database or another central config.
const COMPANY_IDS = [
  'botica-angie', 'servilab-urubamba', 'baca-juarez', 'botica-j-m',
  'bioplus-farma', 'feet-care', 'boticas-multifarma', 'maripeya', 'ferreteria-sac'
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: createCorsHeaders() });
  }

  try {
    const checks: { secret: string; status: 'SET' | 'MISSING' }[] = [];

    // 1. Check for Gemini API Key
    const geminiKey = Deno.env.get("GEMINI_API_KEY");
    checks.push({
      secret: "GEMINI_API_KEY",
      status: geminiKey ? 'SET' : 'MISSING',
    });
    
    // 2. Check Odoo credentials for each company
    COMPANY_IDS.forEach(companyId => {
      const odooSecrets = [
        `ODOO_URL_${companyId}`,
        `ODOO_DB_${companyId}`,
        `ODOO_USER_${companyId}`,
        `ODOO_PASSWORD_${companyId}`
      ];
      
      odooSecrets.forEach(secretName => {
        const secretValue = Deno.env.get(secretName);
        checks.push({
          secret: secretName,
          status: secretValue ? 'SET' : 'MISSING',
        });
      });
    });

    return new Response(JSON.stringify({ checks }), {
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
