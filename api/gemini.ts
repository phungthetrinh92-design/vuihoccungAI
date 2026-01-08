
import { GoogleGenAI } from "@google/genai";
import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt, model, config } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
    
    // Use the requested model or fallback to gemini-2.5-flash
    const targetModel = model || "gemini-2.5-flash";

    const response = await ai.models.generateContent({
      model: targetModel,
      contents: [{ parts: [{ text: prompt }] }],
      config: config || {},
    });

    // Check if the response contains inline data (used for Audio/TTS)
    const part = response.candidates?.[0]?.content?.parts?.[0];
    
    if (part?.inlineData) {
      // If it's audio data, return the base64 string in the 'text' field
      return res.status(200).json({ text: part.inlineData.data });
    }

    // Default to returning generated text
    return res.status(200).json({ text: response.text || "" });
  } catch (error: any) {
    console.error("Gemini API Server Error:", error);
    return res.status(500).json({ 
      error: "Internal Server Error", 
      message: error.message 
    });
  }
}
