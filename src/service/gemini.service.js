
import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is missing from environment variables");
}

const ai = new GoogleGenAI({ apiKey });

export async function generateResponse(message) {
  if (typeof message !== "string" || !message.trim()) {
    throw new Error("Message must be a non-empty string");
  }

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: message.trim(),
  });

  if (!response.text) {
    throw new Error("Gemini returned an empty response");
  }

  return response.text;
}
