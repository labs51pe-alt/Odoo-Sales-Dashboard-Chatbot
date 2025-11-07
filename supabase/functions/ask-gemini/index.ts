// supabase/functions/ask-gemini/index.ts
// This function acts as a secure proxy to the Google Gemini API.
// It retrieves the API key from Supabase secrets, ensuring it's never exposed to the client.

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
// The GenAI SDK is imported from a CDN, which is standard for Deno environments.
import { GoogleGenAI } from "https://esm.sh/@google/genai";

// Supabase provides the 'Deno' global object in its Edge Function environment.
declare const Deno: any;

// Retrieve the Gemini API key securely from Supabase environment variables (secrets).
const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");

serve(async (req) => {
  // Handle CORS preflight requests, which are essential for browser-based fetch calls.
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      }
    });
  }
  
  try {
    // Ensure the API key secret has been set in the Supabase project.
    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not set in Supabase secrets.");
    }

    // Parse the request body sent from the frontend.
    const { userInput, company, salesData } = await req.json();

    if (!userInput || !company || !salesData) {
      throw new Error("Request body is missing 'userInput', 'company', or 'salesData'.");
    }

    // Initialize the Gemini AI client within the function.
    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
    
    // Construct the detailed system instruction, same as the original frontend version.
    const systemInstruction = `You are an expert sales data analyst and assistant for the company "${company.name}".
Your role is to provide clear, concise, and insightful answers about the company's sales performance based on the JSON data provided.
When asked about data, refer to the provided JSON. Do not invent or hallucinate data.
Format your answers in a user-friendly way. Use Markdown for lists, bolding, and italics where appropriate to improve readability.
Analyze the following sales data:
${JSON.stringify(salesData, null, 2)}
`;

    // Call the Gemini API.
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: userInput,
      config: {
        systemInstruction: systemInstruction,
      },
    });

    // Send the AI's text response back to the frontend.
    return new Response(JSON.stringify({ text: response.text }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });

  } catch (error) {
    console.error("Function Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }
});