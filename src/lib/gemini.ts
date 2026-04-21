/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, Type } from "@google/genai";
import { UserData, PalmReading } from "../types";

let aiInstance: GoogleGenAI | null = null;

function getAI() {
  if (!aiInstance) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY is not defined. Please ensure your environment is correctly configured.");
    }
    // Trim to avoid "API key not valid" due to accidental whitespace
    aiInstance = new GoogleGenAI({ apiKey: key.trim() });
  }
  return aiInstance;
}

function fileToGenerativePart(base64Str: string) {
  const [mimePart, dataPart] = base64Str.split(';base64,');
  const mimeType = mimePart.split(':')[1] || 'image/jpeg';
  return {
    inlineData: {
      data: dataPart,
      mimeType
    },
  };
}

export function getPalmReadingPrompt(userData: UserData): string {
  return `
    Act as a Palmist with 30 years of experience, a master of Oracle Palmistry. 
    Analyze the uploaded hand images and create an accurate palm reading. Do not make up stuff, you can use the user profile for more details, if it helps you with the predictions. 
    
    User Profile:
    - Name: ${userData.name}
    - Age: ${userData.age}
    - Essence (Sex): ${userData.sex}
    
    Structure your reading with the following aspects:
    - Synthesis: Overall life direction.
    - Career: Foundational stability and professional growth.
    - Harmony: Relationship dynamics and emotional landscape.
    - Spirit: Hidden talents and spiritual depth.
    - verifiedId: A unique mystical code.

    Format the response strictly as JSON matches the PalmReading interface.
  `;
}

export async function generatePalmReading(userData: UserData): Promise<PalmReading> {
  const portalImages = [
    userData.portals.rightHand,
    userData.portals.leftHand,
    userData.portals.rightPercussion,
    userData.portals.leftPercussion
  ].filter((img): img is string => !!img);

  const imageParts = portalImages.map(fileToGenerativePart);
  const prompt = getPalmReadingPrompt(userData);

  try {
    const ai = getAI();
    const model = "gemini-3-flash-preview";
    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [{ text: prompt }, ...imageParts]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            synthesis: { type: Type.STRING },
            career: { type: Type.STRING },
            harmony: { type: Type.STRING },
            spirit: { type: Type.STRING },
            verifiedId: { type: Type.STRING },
          },
          required: ["synthesis", "career", "harmony", "spirit", "verifiedId"],
        }
      }
    });

    const text = response.text || '{}';
    // Clean potential markdown if the model doesn't strictly follow JSON config
    const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned) as PalmReading;
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
}
