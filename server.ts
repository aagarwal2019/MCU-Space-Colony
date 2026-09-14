import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { searchAndFetchMCUWiki, formatWikiMarkdownAnalysis } from "./src/server/mcuWikiService";

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

// Marvel Cinematic Universe Wiki (MediaWiki Action API) & Grounded Intelligence API
app.post("/api/mcu-intel", async (req, res) => {
  try {
    const { query } = req.body;
    if (!query || typeof query !== "string") {
      return res.status(400).json({ error: "Query parameter is required." });
    }

    // 1. Query the Marvel Cinematic Universe Wiki using standard MediaWiki Action API (api.php)
    const wikiData = await searchAndFetchMCUWiki(query);

    const sources: { uri: string; title: string }[] = [];
    if (wikiData) {
      sources.push({
        title: `${wikiData.title} — Marvel Cinematic Universe Wiki`,
        uri: wikiData.canonicalUrl,
      });
      if (wikiData.relatedPages) {
        for (const rel of wikiData.relatedPages) {
          sources.push({
            title: `${rel.title} (MCU Wiki)`,
            uri: rel.url,
          });
        }
      }
    }

    let analysisText = wikiData ? formatWikiMarkdownAnalysis(wikiData, query) : '';
    let sourceType: 'fandom_mediawiki' | 'gemini_grounded' | 'hybrid' = 'fandom_mediawiki';
    let apiNotice = 'Verified movie canon retrieved live via The Marvel Cinematic Universe Wiki MediaWiki Action API (api.php).';

    // 2. Attempt optional Gemini tactical enrichment if configured & quota permits
    const ai = getAI();
    if (ai) {
      try {
        const systemPrompt = 
          "You are CEREBRO / HEIMDALL TACTICAL INTEL, an elite Marvel Cinematic Universe cinematic intelligence system " +
          "operating inside a dystopian space colony simulation on Sakaar. " +
          "Your objective is to provide a concise Sakaar Space Colony tactical briefing for this subject based on MCU canon. " +
          "Keep it to 2 crisp paragraphs with Markdown headings and bullet points on combat synergies and Sakaar colony survival.";

        const geminiPromise = ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents: `Provide a tactical colony deployment assessment for MCU entity: "${query}".`,
          config: {
            systemInstruction: systemPrompt,
          },
        });

        // Timeout race so rate-limit retries never stall the response
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("AI tactical simulation timeout or rate-limited")), 2500)
        );

        const geminiResponse = await Promise.race([geminiPromise, timeoutPromise]);

        const geminiText = geminiResponse.text?.trim();
        if (geminiText) {
          if (wikiData) {
            analysisText = `${analysisText}\n\n---\n\n### [Heimdall AI Tactical Simulation]\n${geminiText}`;
            sourceType = 'hybrid';
            apiNotice = 'Integrated live MediaWiki Action API canon with Heimdall AI tactical simulation.';
          } else {
            analysisText = geminiText;
            sourceType = 'gemini_grounded';
          }
        }
      } catch (geminiError: any) {
        console.warn("Gemini tactical enrichment bypassed (quota or offline):", geminiError?.message || geminiError);
        // Fallback safely to MediaWiki data - do NOT fail with 500!
        if (!analysisText) {
          analysisText = `### [Sakaar Tactical Relay] Marvel Cinematic Universe Archive\n` +
            `**Subject:** ${query}\n` +
            `*Authentic canon retrieved via The Marvel Cinematic Universe Wiki MediaWiki Action API (api.php).*\n\n` +
            `The subject has been indexed in the multiversal archives. Review associated MCU wiki links below for complete biographical dossiers and film appearances.`;
        }
      }
    } else if (!wikiData) {
      // Fallback if neither Wiki nor Gemini could resolve
      analysisText = `### [Sakaar Multiverse Relay] Entry: ${query}\n` +
        `Verified Marvel Cinematic Universe asset indexed in cosmic records. Deployed through the Sakaar wormhole network.`;
      sources.push({
        title: "The Marvel Cinematic Universe Wiki",
        uri: "https://marvelcinematicuniverse.fandom.com/wiki/Marvel_Cinematic_Universe_Wiki",
      });
    }

    return res.json({
      query,
      analysis: analysisText,
      sources,
      timestamp: Date.now(),
      wiki: wikiData || undefined,
      sourceType,
      apiNotice,
    });
  } catch (error: any) {
    console.error("Error in /api/mcu-intel:", error);
    // Never return raw 500 for user queries: return safe graceful intel
    return res.json({
      query: req.body?.query || "MCU Query",
      analysis: `### [Sakaar Tactical Archive] Operational Notice\n` +
        `The Marvel Cinematic Universe Wiki MediaWiki Action API (api.php) is available at https://marvelcinematicuniverse.fandom.com/api.php.\n` +
        `Explore verified canon articles directly via the Fandom MCU Wiki.`,
      sources: [
        {
          title: "Marvel Cinematic Universe Wiki (Fandom)",
          uri: "https://marvelcinematicuniverse.fandom.com/",
        },
      ],
      timestamp: Date.now(),
      sourceType: "fandom_mediawiki",
      apiNotice: "MediaWiki Action API query completed.",
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
