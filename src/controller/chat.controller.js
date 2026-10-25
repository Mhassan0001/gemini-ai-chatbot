
import { generateResponse } from "../service/gemini.service.js";

export async function chatController(req, res) {
  try {
    const { message } = req.body;

    if (typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid message.",
      });
    }

    const reply = await generateResponse(message);

    return res.status(200).json({
      success: true,
      reply,
    });
  } catch (error) {
    console.error("Chat controller error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to generate AI response.",
    });
  }
}
