import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";

async function withRetry<T>(fn: () => Promise<T>, retries = 3, delayMs = 1000): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (e: any) {
      const isRetryable = e.status === 503 || e.status === 429;
      if (i === retries - 1 || !isRetryable) {
        throw e;
      }
      console.warn(`[Gemini API] Request failed with ${e.status}. Retrying in ${delayMs * (i + 1)}ms...`);
      await new Promise((r) => setTimeout(r, delayMs * (i + 1)));
    }
  }
  throw new Error("Action failed after retries");
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Security Middlewares
  app.use(helmet({ contentSecurityPolicy: false })); // Disabled CSP for Vite in dev mode
  app.use(cors());
  
  // Rate limiting for API endpoints
  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: { error: "Too many requests from this IP, please try again after 15 minutes" }
  });
  app.use("/api/", apiLimiter);

  app.use(express.json());

  // API Route: Calculate Footprint and Recommendations
  app.post("/api/calculate-footprint", async (req, res) => {
    try {
      const { answers } = req.body;
      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      const prompt = `You are an expert environmental scientist. Given the user's weekly habit survey answers, calculate their estimated weekly carbon footprint in kg CO2e, break it down by category (Transport, Energy, Food, Shopping, Waste). Also provide a list of top 3 personalized action recommendations.

User's Answers:
${JSON.stringify(answers, null, 2)}

Return the calculation strictly as JSON.`;

      const response = await withRetry(() => ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              totalCO2eKgPerWeek: {
                type: Type.NUMBER,
                description: "Estimated total kg CO2e per week",
              },
              score: {
                type: Type.NUMBER,
                description: "Sustainability score from 0-100 (where 100 is best)",
              },
              breakdown: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    category: { type: Type.STRING },
                    value: { type: Type.NUMBER, description: "kg CO2e" },
                  },
                },
              },
              recommendations: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    action: { type: Type.STRING },
                    impact: { type: Type.STRING, description: "High, Medium, or Low" },
                    difficulty: { type: Type.STRING, description: "Easy, Medium, or Hard" },
                    cost: { type: Type.STRING, description: "Free, Low, Medium, or High" },
                    carbonSavingsKgPerWeek: { type: Type.NUMBER },
                  },
                },
              },
            },
            required: ["totalCO2eKgPerWeek", "score", "breakdown", "recommendations"],
          },
        },
      }));

      const responseText = response.text || "{}";
      const data = JSON.parse(responseText);
      res.json(data);
    } catch (e: any) {
      console.error(e);
      // Return a structured error response that can be handled 
      res.status(503).json({ error: "The AI service is currently experiencing high demand. Please try again shortly.", details: e.message });
    }
  });

  // API Route: AI Coach Chat
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, context } = req.body;
      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      const prompt = `You are "EcoPulse AI", an expert sustainability coach. Provide a brief, practical, and motivating answer to the user's question.
User's Profile Context: ${JSON.stringify(context || {})}
User's Question: ${message}`;

      const response = await withRetry(() => ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
      }));

      res.json({ reply: response.text });
    } catch (e: any) {
      console.error(e);
      res.status(503).json({ error: "The AI service is currently overwhelmed. Please wait a moment and try again.", details: e.message });
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
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
