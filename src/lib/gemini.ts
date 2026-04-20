/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, Type } from "@google/genai";
import { UserData, PalmReading } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

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

export async function generatePalmReading(userData: UserData): Promise<PalmReading> {
  const portalImages = [
    userData.portals.rightHand,
    userData.portals.leftHand,
    userData.portals.rightPercussion,
    userData.portals.leftPercussion
  ].filter((img): img is string => !!img);

  const imageParts = portalImages.map(fileToGenerativePart);

  const prompt = `
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

  try {
    const model = "gemini-1.5-flash";
    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [{ text: prompt }, ...imageParts]
      },
      config: {
        responseMimeType: "application/json",
      }
    });

    const text = response.text || '{}';
    return JSON.parse(text) as PalmReading;
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
}
