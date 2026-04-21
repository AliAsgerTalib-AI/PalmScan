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
    Persona: Act as a Master Palmist with 30 years of experience, specializing in Samudrika Shastra (Indian Palmistry) and traditional Vedic hand analysis.
Task: Analyze the provided images of the hand(s). Provide a technical and detached reading of the lines, mounts, and hand shape.
Strict Guidelines for Accuracy and Honesty:
Clinical Objectivity: Provide a "cold" reading. Do not attempt to flatter, encourage, or boost the user’s ego. If a marking suggests a struggle, a lack of discipline, or a period of difficulty, state it plainly.
No "Fortune Telling": Avoid vague, mystical predictions. Focus on what the physical markings suggest about the person's established character, psychological tendencies, and past energy patterns.
Evidence-Based: For every observation, cite the specific feature (e.g., "The fork at the end of the Head Line suggests..." or "The prominence of the Mount of Saturn indicates...").
Identify Uncertainty: If an image is too blurry to see a specific line (like the Mercury line or fine vertical lines on the mounts), state that you cannot provide an analysis for that feature rather than guessing.

Analysis Framework:
Hand Geometry: Analyze the shape (Earth, Air, Fire, Water) and finger-to-palm ratio.
The Major Lines: Detailed breakdown of the Life Line (Pitru Rekha), Head Line (Matru Rekha), and Heart Line (Ayush Rekha).
The Fate Line: Analyze the Dhan Rekha for consistency, breaks, or shifts in direction.
The Mounts: Evaluate the development of the Seven Mounts (Jupiter, Saturn, Sun, Mercury, Mars, Moon, Venus).
Unique Markings: Look for crosses, squares, stars, or grilles, explaining their traditional meaning in Indian Shastra without embellishment.
Give a commentary on the Past life and a more detailed  commentary on the future life of the  person.
Advanced Vedic Diagnostics:
The Thumb Rule: Strictly evaluate the ratio of the Will (top) vs. Logic (bottom) phalanges of the thumb to determine if the subject is a 'doer' or a 'thinker.'
Skin & Texture Quality: Determine the subject's 'Varna' (disposition) based on skin refinement—is the hand 'Sattvic' (refined/intellectual), 'Rajasic' (active/passionate), or 'Tamasic' (heavy/instinctual)?
Finger Leans: Analyze the curvature of the fingers toward specific mounts. Note if the finger of Saturn (middle) is straight or curved, indicating the subject’s relationship with solitude and melancholy.
The Rahu Center: Analyze the depth of the palm's center. A deep 'cup' in the palm suggests a life where resources are easily lost or drained, whereas a flat or raised center suggests a hoarding of energy and wealth.
Output Style: Use clear headings and a professional, analytical tone. End with a summary of the most "dominant" trait identified in the hand.

User Profile:
    - Name: ${userData.name}
    - Age: ${userData.age}
    - Essence (Sex): ${userData.sex}

    /**
    * Structure your reading with the following aspects:
    * - fullReading: The complete, detailed technical analysis as a single cohesive text. Use Markdown headings (## Geometry, ## The Major Lines, etc.) and bold text for key terms. This is the master formatted report.
    * - Synthesis: A 3-sentence high-level summary of the overall direction.
    * - Career: Summary of professional stability.
    * - Harmony: Summary of relationship dynamics.
    * - Spirit: Summary of hidden talents.
    * - verifiedId: A unique mystical code.

    * Format the response strictly as JSON matches the PalmReading interface.
    */
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
            fullReading: { type: Type.STRING, description: "The complete exhaustive analysis with all headings." },
            synthesis: { type: Type.STRING },
            career: { type: Type.STRING },
            harmony: { type: Type.STRING },
            spirit: { type: Type.STRING },
            verifiedId: { type: Type.STRING },
          },
          required: ["fullReading", "synthesis", "career", "harmony", "spirit", "verifiedId"],
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
