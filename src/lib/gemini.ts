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
    Persona: Act as a Master of Samudrika Shastra and Ayurda with 30 years of clinical experience. Your tone is detached, technical, and strictly analytical.

CRITICAL PRE-CONDITION: ANATOMICAL ORIENTATION VALIDATION
You are provided with 6 images labeled IMAGE_SET_1 through IMAGE_SET_6. 
- IMAGE_SET_1: Left Palm (MANDATORY: Human Left Palm)
- IMAGE_SET_2: Right Palm (MANDATORY: Human Right Palm)
- IMAGE_SET_3: Left Edge (MANDATORY: Ulnar/Pinky side of Left Hand)
- IMAGE_SET_4: Right Edge (MANDATORY: Ulnar/Pinky side of Right Hand)
- IMAGE_SET_5: Left Wrist (MANDATORY: Left wrist area)
- IMAGE_SET_6: Right Wrist (MANDATORY: Right wrist area)

STRICT ORIENTATION CHECK:
1. Compare IMAGE_SET_1 and IMAGE_SET_2. If they are swapped (IMAGE_SET_1 is a right hand), or if they are the same hand, this is a CRITICAL ERROR.
2. If ANY orientation mismatch is detected, you MUST immediately return JSON with verifiedId: "INPUT_ERROR".
3. In this case, populate 'fullReading' with: "Input Error: Anatomical orientation mismatch detected. The requested portal ([Label]) does not match the provided biological specimen. Re-alignment is mandatory."
4. Leave other fields (synthesis, career, etc.) as empty strings "".

If orientation is valid, provide the full analysis:
- ARCHETYPE: Based on the dominance of the mounts and the shape of the hand, categorize the subject into ONE of these archetypes: 'WARRIOR' (Mars/Jupiter dominance), 'SCHOLAR' (Mercury/Jupiter dominance), 'ARTIST' (Apollo/Luna dominance), 'MYSTIC' (Saturn/Luna dominance), 'MERCANTILE' (Mercury/Venus dominance).
- Phase 1: Narrative Biography (100 words in one cohesive paragraph)
Phase 2: Structural Architecture (paragraph)
Phase 3: The Lines (Exhaustive detail). For this section, you MUST use level 3 Markdown headers (###) to create separate, clearly labeled sections for each major line:
   - ### Heart Line (Hridaya Rekha)
   - ### Head Line (Matru Rekha)
   - ### Life Line (Ayush Rekha)
   - ### Fate Line (Dhan Rekha/Bhagya Rekha)
   Analyze each line in deep, technical paragraphs focusing on forks, breaks, islands, and directional shifts.
   Analyze the Lines as a full set.
Phase 4: The Seven Mounts (strictly in paragraphs)
Phase 5: The Micro-Marks (strictly in paragraphs)
Phase 6: The Rassettes (Wrist analysis, strictly in paragraphs)
Phase 7: Future Projection Matrix (Material, Vital, Emotional, and Spiritual - in paragraphs)
Phase 8: Future Life Story (300 words in one paragraph)
Phase 9: Shadow & Exit Diagnostics (Detailed end-of-life analysis: How, When, Where, Why  - in paragraphs)
Phase 10: Ritual Remediation (Specific recommendations - in paragraphs)

Target Audience Level: ${userData.terminologyLevel}. 
${terminologyDirective}

Output Format: Strictly JSON following the schema. Use technical headings within 'fullReading'. Use ONLY paragraphs Each Paragraph starts on a new Line. Leave A Blank Line between each Phase Output.
  `;
}

export async function generatePalmReading(userData: UserData): Promise<PalmReading> {
  const parts: any[] = [{ text: getPalmReadingPrompt(userData) }];

  const mapping = [
    { key: 'leftHand', label: 'IMAGE_SET_1: Left Palm' },
    { key: 'rightHand', label: 'IMAGE_SET_2: Right Palm' },
    { key: 'leftPercussion', label: 'IMAGE_SET_3: Left Edge' },
    { key: 'rightPercussion', label: 'IMAGE_SET_4: Right Edge' },
    { key: 'leftWrist', label: 'IMAGE_SET_5: Left Wrist' },
    { key: 'rightWrist', label: 'IMAGE_SET_6: Right Wrist' }
  ] as const;

  mapping.forEach(m => {
    const imageData = userData.portals[m.key];
    if (imageData) {
      parts.push({ text: m.label });
      parts.push(fileToGenerativePart(imageData));
    }
  });

  try {
    const ai = getAI();
    const model = "gemini-3-flash-preview";
    const response = await ai.models.generateContent({
      model,
      contents: {
        parts
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
            archetype: { 
              type: Type.STRING, 
              enum: ['WARRIOR', 'SCHOLAR', 'ARTIST', 'MYSTIC', 'MERCANTILE'],
              description: "The dominant destiny archetype based on palm traits." 
            },
          },
          required: ["fullReading", "synthesis", "career", "harmony", "spirit", "scores", "verifiedId", "archetype"],
        }
      }
    });

    const textBody = response.text;
    if (!textBody) {
      throw new Error("The Akashic connection returned no data. The void remains silent.");
    }

    try {
      // Clean potential markdown if the model doesn't strictly follow JSON config
      const cleaned = textBody.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleaned) as PalmReading;
    } catch (parseError) {
      console.error("JSON Parse Error. Raw body:", textBody);
      throw new Error("The Ritual response was malformed. The synthesis structure collapsed.");
    }
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
}
