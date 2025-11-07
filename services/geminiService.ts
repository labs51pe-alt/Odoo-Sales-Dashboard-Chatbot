import { GoogleGenAI } from "@google/genai";
import type { Company, SalesData } from '../types';

// FIX: Update GoogleGenAI initialization to use process.env.API_KEY per coding guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

/**
 * Sends a user's query along with company and sales data to the Gemini API for analysis.
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
  // FIX: Create a detailed system instruction to provide context to the AI model.
  const systemInstruction = `You are an expert sales data analyst and assistant for the company "${company.name}".
Your role is to provide clear, concise, and insightful answers about the company's sales performance based on the JSON data provided.
When asked about data, refer to the provided JSON. Do not invent or hallucinate data.
Format your answers in a user-friendly way. Use Markdown for lists, bolding, and italics where appropriate to improve readability.
Analyze the following sales data:
${JSON.stringify(salesData, null, 2)}
`;

  try {
    // FIX: Call the Gemini API using ai.models.generateContent as per the guidelines.
    const response = await ai.models.generateContent({
      // Using 'gemini-2.5-flash' as it is recommended for basic text tasks.
      model: "gemini-2.5-flash",
      contents: userInput,
      config: {
        systemInstruction: systemInstruction,
      },
    });

    // FIX: Extract the response text directly from the .text property as per guidelines.
    return response.text;
  } catch (error) {
    console.error("Error communicating with the Gemini API:", error);
    // Propagate a user-friendly error to be handled by the calling component.
    throw new Error("Failed to get a response from the AI assistant. Please try again later.");
  }
};
