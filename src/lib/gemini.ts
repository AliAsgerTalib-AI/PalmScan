/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, Type } from "@google/genai";
import { UserData, PalmReading } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function generatePalmReading(userData: UserData): Promise<PalmReading> {
  const prompt = `
    You are the "Digital Alchemist," a master of Oracle Palmistry. 
    Analyze the following user profile and their specific life inquiries to provide a profound, mystical, and encouraging palm reading.
    
    User Profile:
    - Name: ${userData.name}
    - Age: ${userData.age}
    - Essence (Sex): ${userData.sex}
    
    Inquiries Pose to the Oracle:
    1. The Foundation: ${userData.questions.foundation}
    2. The Shadow: ${userData.questions.shadow}
    3. The Horizon: ${userData.questions.horizon}
    
    Guidelines for the reading:
    - Use poetic, slightly archaic, and mystical language (e.g., "The lines of fate whisper...", "Ancient wisdom suggests...").
    - "Synthesis of the Soul" should be a high-level spiritual overview (around 80-100 words).
    - Provide specific answers to each of the three inquiries based on the "palmistry lines" (Fate line, Heart line, Life line, Mount of Apollo, etc.).
    - Keep it encouraging and focused on personal growth.
    - Format the response strictly as JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["synthesis", "career", "harmony", "spirit", "verifiedId"],
          properties: {
            synthesis: { type: Type.STRING, description: "A mystical overview of the user's soul journey." },
            career: { type: Type.STRING, description: "Answer to the Foundation question, framed as career/purpose." },
            harmony: { type: Type.STRING, description: "Answer to the Shadow question, framed as relationship/harmony." },
            spirit: { type: Type.STRING, description: "Answer to the Horizon question, framed as hidden talents/spirit." },
            verifiedId: { type: Type.STRING, description: "A mystical ID code for the reading, e.g., 'NO. 884-X9'." }
          }
        }
      }
    });

    const result = JSON.parse(response.text || '{}');
    return result as PalmReading;
  } catch (error) {
    console.error("Gemini Error:", error);
    // Fallback if AI fails
    return {
      synthesis: "Your palm reveals a journey of profound transformation. The convergence of your minor lines near the quadrangle indicates a period of significant decision-making ahead.",
      career: "The Fate Line shows a jagged shift around the 35th year, suggesting a transition from stability to passion.",
      harmony: "The Heart Line possesses small islands, indicating current turbulence. However, these resolve into a singular, deep stroke.",
      spirit: "The Girdle of Venus is strong in your read. This often masks a talent for the healing arts or profound empathy.",
      verifiedId: "NO. 884-X9"
    };
  }
}
