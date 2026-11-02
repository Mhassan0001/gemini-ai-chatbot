import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is missing from environment variables");
}

const ai = new GoogleGenAI({ apiKey });

export async function generateResponse(message) {
  console.log("Gemini service loaded");
  console.log("Using model: gemini-3.8-flash");

  if (typeof message !== "string" || !message.trim()) {
    throw new Error("Message must be a non-empty string");
  }

  console.time("Gemini API Duration");

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: message.trim(),
    });

    if (!response.text) {
      throw new Error("Gemini returned an empty response");
    }

    return response.text;
  } finally {
    console.timeEnd("Gemini API Duration");
  }
}
