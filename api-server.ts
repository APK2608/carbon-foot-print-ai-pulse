import express from "express";
import { GoogleGenAI, Type } from "@google/genai";

const app = express();
app.use(express.json());

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

const router = express.Router();

// API Route: Calculate Footprint and Recommendations
router.post("/calculate-footprint", async (req, res) => {
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
    res.status(503).json({ error: "The AI service is currently experiencing high demand. Please try again shortly.", details: e.message });
  }
});

// API Route: AI Coach Chat
router.post("/chat", async (req, res) => {
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

// Mount router under multiple paths to handle both local and Netlify redirects seamlessly
app.use("/.netlify/functions/api", router);
app.use("/api", router);
app.use("/", router);

export { app };
