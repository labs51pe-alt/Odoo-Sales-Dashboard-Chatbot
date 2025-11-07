// supabase/functions/check-secrets/index.ts
// This is a diagnostic function to help debug connection issues.
// Its only purpose is to check if the required environment variables (secrets)
// are accessible within the Supabase Edge Function environment.

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

declare const Deno: any;

// The list of secrets the application expects to be set.
const REQUIRED_SECRETS = [
  "ODOO_URL",
  "ODOO_DB",
  "ODOO_USER",
  "ODOO_API_KEY",
  "GEMINI_API_KEY",
];

serve(async (_req) => {
  // Handle CORS preflight requests.
  if (_req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      }
    });
  }

  try {
    const secretsStatus: Record<string, boolean> = {};

    for (const secretName of REQUIRED_SECRETS) {
      // Deno.env.get() returns the value of the secret, or undefined if not found.
      // We convert this to a boolean to indicate presence.
      secretsStatus[secretName] = Deno.env.get(secretName) !== undefined;
    }

    // Return a JSON response with the status of each secret.
    return new Response(
      JSON.stringify(secretsStatus), 
      {
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*' 
        },
      }
    );

  } catch (error) {
    // In case of an unexpected error within the function itself.
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*' 
      },
    });
  }
});
