import { GoogleGenAI, Type } from "@google/genai";
import { SeaEntity } from "../types";

const apiKey = process.env.VITE_GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const getCreatureFact = async (
  entity: SeaEntity
): Promise<string> => {
  if (!ai) {
    return "AI Module Offline. Connect API Key for deep sea data.";
  }

  const prompt = `
    Tell me a fascinating, one-sentence "Fun Fact" about the ${entity.name}. 
    Context: It lives at ${entity.depth} meters deep.
    Tone: Educational, slightly whimsical (like Neal.fun).
    Length: Maximum 25 words.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "text/plain",
      }
    });

    return response.text?.trim() || "Data unavailable.";
  } catch (error) {
    console.error("Gemini Analysis Failed", error);
    return "Communication interference. Try again.";
  }
};
