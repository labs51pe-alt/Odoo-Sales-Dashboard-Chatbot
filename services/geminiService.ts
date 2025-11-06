
import { GoogleGenAI } from "@google/genai";
import type { SalesData, Company } from '../types';

// Assume process.env.API_KEY is configured in the environment
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. Using a mock response.");
}

const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

export const askSalesAssistant = async (
  query: string,
  company: Company,
  salesData: SalesData
): Promise<string> => {
  if (!ai) {
    // Mock response for development if API key is not available
    return new Promise(resolve => setTimeout(() => {
      resolve(`This is a mock response for your question: "${query}". For ${company.name}, the total sales are $${salesData.totalSales.toLocaleString()}.`);
    }, 1000));
  }
  
  const prompt = `
    You are a helpful sales data assistant for the company: "${company.name}".
    Your tone should be professional, concise, and helpful.
    Analyze the following sales data and answer the user's question.
    Do not make up information that is not present in the data.
    If the data doesn't contain the answer, say so politely.

    **Sales Data (in JSON format):**
    ${JSON.stringify(salesData, null, 2)}

    **User's Question:**
    ${query}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Sorry, I encountered an error while processing your request. Please try again later.";
  }
};
