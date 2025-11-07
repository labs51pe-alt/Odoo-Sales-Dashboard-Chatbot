// supabase/functions/check-secrets/index.ts
// This function checks for the presence of all required environment variables (secrets)
// in the Supabase project and returns their status.

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

declare const Deno: any;

// Define the list of secret keys the application depends on.
const REQUIRED_SECRETS = [
  'GEMINI_API_KEY',
  'ODOO_URL',
  'ODOO_DB',
  'ODOO_USER',
  'ODOO_API_KEY',
  'SUPABASE_URL', // Important for client-side Supabase instance
  'SUPABASE_ANON_KEY' // Important for client-side Supabase instance
];

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const secretsStatus = REQUIRED_SECRETS.map(key => {
      const value = Deno.env.get(key);
      const isSet = !!value;
      
      return {
        key,
        isSet,
        status: isSet ? '✅ Set' : '❌ NOT SET',
        hint: isSet ? `Value is present.` : `This secret is required for the application to function correctly.`,
      };
    });

    return new Response(JSON.stringify(secretsStatus), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
