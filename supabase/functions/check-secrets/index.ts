// supabase/functions/check-secrets/index.ts
// This function checks for the presence of required environment variables (secrets)
// in the Supabase Edge Function environment. It helps diagnose configuration issues.

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

// Supabase provides the 'Deno' global object in its Edge Function environment.
declare const Deno: any;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // List of secrets that the application expects to be available.
    const requiredSecrets = [
        "GEMINI_API_KEY", 
        // Add other required secrets here, e.g., "ODOO_API_KEY"
    ];

    const status: Record<string, { present: boolean; value?: string }> = {};

    for (const secretName of requiredSecrets) {
        const secretValue = Deno.env.get(secretName);
        status[secretName] = {
            present: !!secretValue,
            // For security, we only show a snippet or confirmation, not the full key.
            value: secretValue ? `Present (ends with ...${secretValue.slice(-4)})` : "Not Found"
        };
    }

    return new Response(JSON.stringify(status), {
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
