import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini client
let genAIClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!genAIClient && process.env.GEMINI_API_KEY) {
    genAIClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return genAIClient;
}

// Fallback rule-based extractor for prototype resiliency & offline capability
function extractEmergencyFallback(text: string) {
  const lower = text.toLowerCase();
  
  if (lower.includes("stroke") || lower.includes("facial") || lower.includes("slur") || lower.includes("weakness") || lower.includes("droop") || lower.includes("paralysis")) {
    return {
      emergency_category: "suspected_stroke",
      urgency: "critical",
      required_capabilities: ["emergency_department", "ct", "neurology", "icu"],
      icu_capability_required: true,
      suspected_condition_display: "Suspected Acute Ischemic Stroke / CVA",
      clinical_summary: "Acute neurological deficit presenting with unilateral weakness and facial asymmetry. Immediate non-contrast CT required to rule out intracranial hemorrhage and assess thrombectomy/thrombolytic candidacy.",
      recommended_pre_arrival_actions: [
        "Pre-alert receiving hospital acute stroke team",
        "Clear CT scanner bay for immediate door-to-needle priority",
        "Establish 2x large-bore IV access (18G preferred)",
        "Maintain NPO status and check fingerstick blood glucose"
      ]
    };
  } else if (lower.includes("chest pain") || lower.includes("stemi") || lower.includes("heart") || lower.includes("cardiac") || lower.includes("diaphoretic")) {
    return {
      emergency_category: "suspected_stemi",
      urgency: "critical",
      required_capabilities: ["emergency_department", "cathLab", "icu"],
      icu_capability_required: true,
      suspected_condition_display: "Suspected Acute Coronary Syndrome / STEMI",
      clinical_summary: "Substernal chest pressure radiating to left arm with diaphoresis. Urgent 12-lead ECG transmission and immediate cardiac catheterization lab mobilization required.",
      recommended_pre_arrival_actions: [
        "Activate primary percutaneous coronary intervention (PCI) team",
        "Administer Chewable Aspirin 324mg unless contraindicated",
        "Prepare defibrillator pads in transit",
        "Reserve CCU/ICU bed post-revascularization"
      ]
    };
  } else if (lower.includes("trauma") || lower.includes("collision") || lower.includes("bleeding") || lower.includes("hemorrhage") || lower.includes("fracture") || lower.includes("fall")) {
    return {
      emergency_category: "severe_polytrauma",
      urgency: "critical",
      required_capabilities: ["emergency_department", "traumaSurgery", "ct", "icu"],
      icu_capability_required: true,
      suspected_condition_display: "Severe Multi-System Trauma / Major Hemorrhage",
      clinical_summary: "High-energy blunt/penetrating trauma with hemodynamic instability risk. Requires designated Level-1 trauma surgical resuscitation team, rapid whole-body CT, and massive transfusion protocol.",
      recommended_pre_arrival_actions: [
        "Activate Level 1 Trauma activation & Surgical attending on-deck",
        "Prepare Trauma Bay 1 with Rapid Infuser and warm fluids",
        "Notify blood bank for 4 units O-negative uncrossed PRBCs",
        "Secure airway and pelvic binder placement"
      ]
    };
  }

  // Default critical emergency
  return {
    emergency_category: "acute_medical_emergency",
    urgency: "critical",
    required_capabilities: ["emergency_department", "icu"],
    icu_capability_required: true,
    suspected_condition_display: "Acute Undifferentiated Medical Emergency",
    clinical_summary: "Acute emergency requiring rapid resuscitation and multispecialty evaluation upon arrival.",
    recommended_pre_arrival_actions: [
      "Prepare Resuscitation Bay",
      "Assign attending emergency physician",
      "Continuous cardiac and pulse oximetry monitoring"
    ]
  };
}

// API: Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "JeevanGrid Orchestration Engine",
    geminiConfigured: !!process.env.GEMINI_API_KEY,
  });
});

// API: Analyze Paramedic Emergency Report using Gemini AI
app.post("/api/analyze-emergency", async (req, res) => {
  try {
    const { reportText } = req.body;
    if (!reportText || typeof reportText !== "string") {
      return res.status(400).json({ error: "reportText is required" });
    }

    const ai = getGenAI();

    // If Gemini key exists, call Gemini 3.8 Flash for structured extraction
    if (ai) {
      try {
        const prompt = `You are the AI Interpretation Layer of JEEVANGRID, a mission-critical emergency care orchestration network.
Your responsibility is strictly to interpret the paramedic's natural language field report into structured clinical requirements.
IMPORTANT: You do NOT provide a definitive diagnosis or replace a doctor.

Paramedic field report:
"${reportText}"

Analyze this emergency and output structured JSON:
- emergency_category: snake_case identifier (e.g. "suspected_stroke", "suspected_stemi", "severe_polytrauma", "acute_respiratory_failure")
- urgency: "critical" | "high" | "moderate"
- required_capabilities: string array of hospital capabilities needed (choose from: ["emergency_department", "ct", "neurology", "icu", "cathLab", "traumaSurgery"])
- icu_capability_required: boolean
- suspected_condition_display: string label (e.g. "Suspected Acute Ischemic Stroke")
- clinical_summary: string (1-2 sentence concise clinical handoff for the receiving hospital triage desk)
- recommended_pre_arrival_actions: array of strings with 3-4 standard pre-arrival protocol prep steps.`;

        let responseText: string | null = null;
        let usedModel = "gemini-3.8-flash";

        try {
          const response = await ai.models.generateContent({
            model: "gemini-3.8-flash",
            contents: prompt,
            config: {
              responseMimeType: "application/json",
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  emergency_category: { type: Type.STRING },
                  urgency: { type: Type.STRING },
                  required_capabilities: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  icu_capability_required: { type: Type.BOOLEAN },
                  suspected_condition_display: { type: Type.STRING },
                  clinical_summary: { type: Type.STRING },
                  recommended_pre_arrival_actions: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                },
                required: [
                  "emergency_category",
                  "urgency",
                  "required_capabilities",
                  "icu_capability_required",
                  "suspected_condition_display",
                  "clinical_summary",
                  "recommended_pre_arrival_actions",
                ],
              },
            },
          });
          responseText = response.text || null;
        } catch (m38Error) {
          console.warn("gemini-3.8-flash unavailable, attempting gemini-2.5-flash...");
          usedModel = "gemini-2.5-flash";
          const response2 = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
              responseMimeType: "application/json",
            },
          });
          responseText = response2.text || null;
        }

        const parsed = JSON.parse(responseText || "{}");

        // Normalize capabilities to known keys
        const rawCaps: string[] = Array.isArray(parsed.required_capabilities) ? parsed.required_capabilities : [];
        const normalizedCaps = new Set<string>();

        for (const cap of rawCaps) {
          const l = cap.toLowerCase();
          if (l.includes("ct") || l.includes("scan") || l.includes("imaging")) normalizedCaps.add("ct");
          if (l.includes("neuro") || l.includes("stroke")) normalizedCaps.add("neurology");
          if (l.includes("icu") || l.includes("intensive") || l.includes("critical")) normalizedCaps.add("icu");
          if (l.includes("ed") || l.includes("emergency") || l.includes("department") || l.includes("triage")) normalizedCaps.add("emergency_department");
          if (l.includes("cath") || l.includes("pci") || l.includes("cardiac") || l.includes("coronary")) normalizedCaps.add("cathLab");
          if (l.includes("trauma") || l.includes("surgery") || l.includes("or") || l.includes("operating")) normalizedCaps.add("traumaSurgery");
        }

        // Always ensure emergency_department is present for acute emergencies
        normalizedCaps.add("emergency_department");

        // If stroke/neurology is identified, ensure ct is also flagged
        if (parsed.emergency_category?.includes("stroke") || parsed.suspected_condition_display?.toLowerCase().includes("stroke")) {
          normalizedCaps.add("ct");
          normalizedCaps.add("neurology");
          normalizedCaps.add("icu");
        }

        parsed.required_capabilities = Array.from(normalizedCaps);

        return res.json({
          source: usedModel,
          ...parsed,
        });
      } catch (geminiError: any) {
        console.warn("Gemini API call failed, falling back to deterministic extractor:", geminiError?.message || geminiError);
        const fallback = extractEmergencyFallback(reportText);
        return res.json({
          source: "deterministic_fallback",
          note: "Processed via on-device emergency clinical ruleset",
          debugError: geminiError?.message || String(geminiError),
          ...fallback,
        });
      }
    } else {
      // Offline / API key not yet configured
      const fallback = extractEmergencyFallback(reportText);
      return res.json({
        source: "deterministic_engine",
        note: "Processed using clinical rule engine",
        ...fallback,
      });
    }
  } catch (err: any) {
    console.error("Error in /api/analyze-emergency:", err);
    res.status(500).json({ error: "Failed to analyze emergency" });
  }
});

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
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[JeevanGrid] Command server running on port ${PORT}`);
  });
}

startServer();
