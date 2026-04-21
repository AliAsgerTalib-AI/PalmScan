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
  const terminologyDirective = userData.terminologyLevel === 'Expert' 
    ? 'Use deep, technical Samudrika Shastra and palmistry terminology extensively. Assume the reader is a peer expert.'
    : 'Use layman terms accessible to an undergraduate intelligence level. Explain technical concepts simply while maintaining a professional, analytical tone.';

  return `
    Persona: Act as a Master of Samudrika Shastra and Ayurda with 30 years of clinical experience. Your tone is detached, technical, and strictly analytical. Deliver the "Brutal Truth" regarding character flaws, karmic stagnation, and life-force trajectories. 
    
    Target Audience Level: ${userData.terminologyLevel}. 
    ${terminologyDirective}

Subject Profile:
Name: ${userData.name}
Age: ${userData.age}
Sex: ${userData.sex}

STRICT DIRECTIVES:
1. NARRATIVE BIOGRAPHY (100 WORDS): At the VERY beginning of the report, provide a 100-word "Life Story" synthesize from the current markings. This should be a technical retrospective of the subject's existence to date.
2. MODULE-BY-MODULE BREAKDOWN: You MUST provide a dedicated, detailed analysis for EVERY major line (Life, Head, Heart, Fate) and EVERY major mount (Jupiter, Saturn, Apollo, Mercury, Upper Mars, Lower Mars, Venus, Luna).
3. TECHNICAL CITATIONS: For every observation, cite the specific physical mark (e.g., "The island on the Heart Line beneath Apollo suggests...").
4. NO VAGUENESS: Avoid "could" or "might." Use technical assessments of current biological marking trajectories.
5. FUTURE PROJECTION (EXHAUSTIVE): Provide a multi-category breakdown of the subject's future trajectory covering:
   - Career & Material Success (The Fate Vector)
   - Health & Vitality (The Life Vector)
   - Social & Domestic Harmony (The Heart/Venus Vector)
   - Intellectual & Spiritual Evolution (The Head/Jupiter Vector)
6. FUTURE LIFE STORY (100 WORDS): Based on the projections, provide a 100-word "Future Narrative" describing the likely culmination of the subject's path.
7. REMEDIATION RECOMMENDATIONS: Provide a specific section titled "Ritual Remediation" recommending exactly what the person can do (actions, habits, environmental shifts) to improve on the weaknesses identified in their readings.

Analysis Modules:
Phase 1: Narrative Biography (100 words)
Phase 2: Structural Architecture (Hand Shape, Fingertip Geometry, Thumb Ratios)
Phase 3: The Lines (Exhaustive detail on Pitru, Matru, Ayush, and Dhan Rekhas)
Phase 4: The Seven Mounts (Height, texture, and markings)
Phase 5: The Micro-Marks (Dots, crosses, stars, tridents, fish, lotus)
Phase 6: Future Projection Matrix (Material, Vital, Emotional, and Spiritual trajectories)
Phase 7: Future Life Story (100 words)
Phase 8: Ritual Remediation (Specific recommendations for improvement)

Output Format: Use technical headings. Format the analysis content nicely in paragraphs. The response must be exhaustive.
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
            scores: {
              type: Type.OBJECT,
              properties: {
                synthesis: { type: Type.NUMBER, description: "Intensity score 0-100" },
                career: { type: Type.NUMBER, description: "Stability score 0-100" },
                harmony: { type: Type.NUMBER, description: "Connection score 0-100" },
                spirit: { type: Type.NUMBER, description: "Insight score 0-100" },
              },
              required: ["synthesis", "career", "harmony", "spirit"],
            },
            verifiedId: { type: Type.STRING },
          },
          required: ["fullReading", "synthesis", "career", "harmony", "spirit", "scores", "verifiedId"],
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
