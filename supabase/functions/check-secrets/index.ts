// supabase/functions/check-secrets/index.ts

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

// Supabase provides the 'Deno' global object in its Edge Function environment.
declare const Deno: any;

interface SecretStatus {
  name: string;
  isSet: boolean;
  description: string;
}

serve(async (req) => {
  // Standard CORS preflight handling.
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      }
    });
  }

  try {
    // List of secrets the application expects to be set.
    const secretsToCheck = [
      {
        name: "GEMINI_API_KEY",
        description: "Required for the AI Sales Assistant feature."
      },
      {
        name: "ODOO_URL",
        description: "Required for fetching sales data from Odoo. (Not used in mock data mode)."
      },
      {
        name: "ODOO_DB",
        description: "Required for fetching sales data from Odoo. (Not used in mock data mode)."
      },
      {
        name: "ODOO_USER",
        description: "Required for fetching sales data from Odoo. (Not used in mock data mode)."
      },
      {
        name: "ODOO_PASSWORD",
        description: "Required for fetching sales data from Odoo. (Not used in mock data mode)."
      },
    ];

    const results: SecretStatus[] = secretsToCheck.map(secret => ({
      name: secret.name,
      // Deno.env.get() returns the value or undefined. We convert it to a boolean.
      isSet: !!Deno.env.get(secret.name),
      description: secret.description,
    }));
    
    return new Response(JSON.stringify(results), {
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
