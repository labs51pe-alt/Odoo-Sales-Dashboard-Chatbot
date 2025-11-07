import type { Company, SalesData } from '../types';
import { SUPABASE_FUNCTION_BASE_URL, ASK_GEMINI_FUNCTION_NAME } from '../constants';

// The Gemini API call is now proxied through a secure Supabase Edge Function.
// The API key is stored securely as a Supabase secret and is never exposed to the browser.
const ASK_ASSISTANT_URL = `${SUPABASE_FUNCTION_BASE_URL}${ASK_GEMINI_FUNCTION_NAME}`;


/**
 * Sends a user's query along with company and sales data to a secure backend function.
 * This function then calls the Gemini API for analysis.
 *
 * @param userInput The user's question about the sales data.
 * @param company The company for which the data is being analyzed.
 * @param salesData The sales data to be analyzed by the AI.
 * @returns A promise that resolves to the AI-generated text response.
 */
export const askSalesAssistant = async (
  userInput: string,
  company: Company,
  salesData: SalesData
): Promise<string> => {
  try {
    const response = await fetch(ASK_ASSISTANT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userInput, company, salesData }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Failed to get a response from the AI assistant.`);
    }

    const data = await response.json();
    return data.text;

  } catch (error) {
    console.error("Error communicating with the AI assistant function:", error);
    // Propagate a user-friendly error to be handled by the calling component.
    throw new Error("Failed to get a response from the AI assistant. Please try again later.");
  }
};
