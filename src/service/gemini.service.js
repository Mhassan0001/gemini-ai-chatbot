import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is missing from environment variables");
}

const ai = new GoogleGenAI({ apiKey });

// Retry helper function
async function withRetry(fn, maxRetries = 5) {
  let delay = 1000; // start with 1 second

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      // Check if it's a retryable error (503 or 429)
      const isRetryable = 
        error.status === 503 || 
        error.status === 429 ||
        (error.message && (error.message.includes("503") || error.message.includes("UNAVAILABLE") || error.message.includes("high demand")));

      if (!isRetryable || attempt === maxRetries) {
        throw error; // Don't retry non-retryable errors or if max attempts reached
      }

      console.log(`Attempt ${attempt} failed (retryable). Retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      delay = Math.min(delay * 2, 32000); // double the delay, cap at 32 seconds
    }
  }
}

export async function generateResponse(message) {
  console.log("Gemini service loaded");
  // Use Flash-Lite model instead of Flash
  const modelName = "gemini-3.5-flash-lite";
  console.log("Using model:", modelName);

  if (typeof message !== "string" || !message.trim()) {
    throw new Error("Message must be a non-empty string");
  }

  console.time("Gemini API Duration");

  try {
    // Wrap the API call with retry logic
    const response = await withRetry(async () => {
      return await ai.models.generateContent({
        model: modelName,
        contents: message.trim(),
      });
    });

    if (!response.text) {
      throw new Error("Gemini returned an empty response");
    }

    return response.text;
  } finally {
    console.timeEnd("Gemini API Duration");
  }
}