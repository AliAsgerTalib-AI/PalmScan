/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Gemini API Proxy
  app.post("/api/analyze", async (req, res) => {
    try {
      const { name, age, sex, images } = req.body;
      
      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: "GEMINI_API_KEY not configured" });
      }

      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const model = "gemini-3.1-flash-lite-preview";

      // Prepare images for Gemini
      // Assuming images is an array of base64 strings (data:image/png;base64,...)
      const imageParts = images.map((base64: string) => {
        const [mimePart, dataPart] = base64.split(';base64,');
        const mimeType = mimePart.split(':')[1];
        return {
          inlineData: {
            data: dataPart,
            mimeType: mimeType || 'image/png'
          }
        };
      });

      const prompt = `Act as a palmist of 30 years experience and analyze the hand prints. 
Subject Details:
Name: ${name}
Age: ${age}
Sex: ${sex}

Please provide a detailed palmistry reading based on the provided images. 
Structure your response clearly with headings for:
1. Synthesis (Overall life path)
2. Career & Ambition
3. Harmony & Relationships
4. Spiritual Essence

Also provide a unique "Verified Identity Hash" at the end.`;

      const response = await ai.models.generateContent({
        model,
        contents: {
          parts: [...imageParts, { text: prompt }]
        }
      });

      res.json({ analysis: response.text });
    } catch (error: any) {
      console.error("Analysis Error:", error);
      res.status(500).json({ error: error.message || "Failed to analyze" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
