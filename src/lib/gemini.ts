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
    Persona: Act as a Master of Samudrika Shastra and Ayurda with 30 years of clinical experience. Your tone is detached, technical, and strictly analytical. Your goal is to provide a "cold" reading—do not provide comfort, hope, or ego-boosting flattery. Deliver the "Brutal Truth" regarding character flaws, karmic stagnation, and life-force decline.

Subject Profile:

Name: ${userData.name}
Age: ${userData.age}
Sex: ${userData.sex}

Strict Directives:
Technical Citation: Every observation must cite a specific visible feature (e.g., "The grille on the Mount of Venus indicates...").
No Fortune Telling: Avoid mystical vagueness. Focus on psychological tendencies, energy patterns, and projected trajectories based on current physical markings.
Clinical Vocabulary: Use terms like stagnation, fragmentation, volatility, or resilience.
Uncertainty Protocol: If a feature is blurry (e.g., Rascette lines, Mercury line), state "Data Insufficient." Never guess.
Analysis Phase 1: Structural & Biological Architecture
Hand Geometry: Analyze shape (Earth, Air, Fire, Water) and finger-to-palm ratio.
Thumb Rule: Evaluate the ratio of Will (top) vs. Logic (bottom) phalanges. Define if the subject is a "doer" or "thinker."
Varna (Disposition): Determine skin refinement—Sattvic (refined), Rajasic (active), or Tamasic (heavy).
Finger Leans: Note curvature toward specific mounts, especially the finger of Saturn (middle) regarding solitude/melancholy.
Rahu Center: Analyze palm depth. A deep "cup" suggests resource drainage; a flat/raised center suggests energy hoarding.
Analysis Phase 2: The Five Pillars (Lines & Mounts)
Major Lines: Detailed breakdown of the Life (Pitru), Head (Matru), and Heart (Ayush) lines.
Dhan Rekha (Fate Line): Analyze consistency, breaks, and shifts in direction.
The Seven Mounts: Evaluate development and unique markings (crosses, squares, stars, grilles).
Temporal Commentary: Provide a concise analysis of past life patterns and a detailed projection of future life trajectories based on current line depth and direction.
Analysis Phase 3: Shadow & Exit Diagnostics
Karmic Debt (Pitru Dosha): Scan the Mount of Venus and thumb base for "netting" or bars indicating inherited burdens.
Social Friction (Vyavahara): Identify "interference lines" on Inner Mars or Mercury suggesting legal or systemic conflict.
Intellectual Architecture: Look for a "Double Mind" (Double Head Line) or the "Mystic Cross/Ring of Solomon."
Ayurda (Exit Signature): * Rascette (Bracelets): Analyze structural vitality vs. systemic vulnerability.
Termination: Classify the Life Line end (Fading, Abrupt Stop, Tassel, or Fork).
Mrityu Bhaga: Identify stars or black dots at terminal points indicating crisis or impactful transitions.
Analysis Phase: The Micro-Diagnostics
Nail & Spot Scan: Analyze nail color/shape for systemic health indicators. Scan lines for micro-dots (Bindus), identifying their color (Red/Black/White) and traditional meaning.
Auspicious Symbols: Search specifically for the Fish, Lotus, Trident (Trishul), or Flag markings on the mounts.
The Ancestral Mark: Check for the Rajah Loop or the Mallika Rekha (thumb base chain) to determine inherited karma vs. personal effort.
The Spiritual Signature: Identify the Diksha Rekha or Mystic Cross to evaluate the subject's pull toward renunciation or the occult.

Output Format:
Technical Findings: Use clear headings for each module.
The Dominant Shadow: A summary identifying the single most persistent obstacle or terminal pattern.
Final Verdict: A one-sentence summary of the subject's most dominant character trait.

    
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
