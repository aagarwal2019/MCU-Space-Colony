import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini client
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI | null {
  if (!process.env.GEMINI_API_KEY) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Health check route
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "Sakaar MCU Colony Backend", time: Date.now() });
});

// Search-grounded MCU Intelligence API
app.post("/api/mcu-intel", async (req, res) => {
  try {
    const { query } = req.body;
    if (!query || typeof query !== "string") {
      return res.status(400).json({ error: "Query parameter is required." });
    }

    const ai = getAI();

    // If no API key is provided, return grounded curated movie dossier fallback
    if (!ai) {
      return res.json({
        query,
        analysis: `### [Sakaar Tactical Archive] Real-Time Cinema Grounding Notice\n` +
          `*Note: Operating in offline archive mode. Configure your GEMINI_API_KEY in Settings > Secrets for live web search queries.*\n\n` +
          `**Subject:** ${query}\n` +
          `**MCU Canon Classification:** Confirmed cinematic timeline asset.\n` +
          `**Colony Directive:** Deployed to Sakaar via interstellar cosmic wormhole. All superhuman powers and tactical equipment remain combat-ready against hostile raiders, Grandmaster tithes, and dystopian wasteland threats.`,
        sources: [
          {
            title: "Marvel Cinematic Universe Official Portal",
            uri: "https://www.marvel.com/movies"
          }
        ],
        timestamp: Date.now(),
      });
    }

    const systemPrompt = 
      "You are CEREBRO / HEIMDALL TACTICAL INTEL, an elite Marvel Cinematic Universe cinematic intelligence system " +
      "operating inside a dystopian space colony simulation on Sakaar. " +
      "Your objective is to provide accurate, up-to-date Marvel Cinematic Universe MOVIE canon data " +
      "using Google Search grounding. Verify the character's exact movie appearances (e.g. Iron Man, Thor: Ragnarok, " +
      "Avengers: Infinity War, Spider-Man: No Way Home, Captain America: Brave New World, Thunderbolts*, Shang-Chi, etc.), " +
      "their movie-specific arc, weapons/powers as seen on film, iconic quotes, and give tactical advice on how this character or villain " +
      "functions in a high-stakes Sakaar space colony. Keep the tone immersive, authoritative, and cinematic. Format with clear Markdown.";

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: `Perform an up-to-date search-grounded movie canon intel dossier for: "${query}". Include MCU movie appearances, film canon status, key movie moments, and colony tactical role on Sakaar.`,
      config: {
        systemInstruction: systemPrompt,
        tools: [{ googleSearch: {} }],
      },
    });

    const analysis = response.text || "No intelligence data could be retrieved.";
    
    // Extract search grounding chunks
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    const sources: { uri: string; title: string }[] = [];
    
    if (Array.isArray(chunks)) {
      for (const chunk of chunks) {
        if (chunk && chunk.web && chunk.web.uri) {
          sources.push({
            uri: chunk.web.uri,
            title: chunk.web.title || chunk.web.uri,
          });
        }
      }
    }

    return res.json({
      query,
      analysis,
      sources,
      timestamp: Date.now(),
    });
  } catch (error: any) {
    console.error("Error in /api/mcu-intel:", error);
    return res.status(500).json({
      error: "Failed to generate MCU movie intelligence.",
      details: error?.message || String(error),
    });
  }
});

// Vite middleware & Static serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Sakaar Colony Full-Stack Server running on port ${PORT}`);
  });
}

startServer();
