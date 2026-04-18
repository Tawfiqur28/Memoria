import "dotenv/config";
import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

const port = Number(process.env.PORT || process.env.BACKEND_PORT || 8787);

// Validate required environment variables
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const modelscopeApiKey = process.env.EXPO_PUBLIC_MODELSCOPE_API_KEY;
const modelscopeBaseUrl = process.env.EXPO_PUBLIC_MODELSCOPE_BASE_URL || 'https://api-inference.modelscope.cn/v1';
const chatModel = process.env.EXPO_PUBLIC_CHAT_MODEL || 'Qwen/Qwen3.6-35B-A3B';
const voiceModel = process.env.EXPO_PUBLIC_VOICE_MODEL || 'iic/CosyVoice2-0.5B';
const openAiApiKey = process.env.OPENAI_API_KEY;
const didApiKey = process.env.DID_API_KEY;

// Check for missing critical services
const missingVars = [];
if (!supabaseUrl || !supabaseServiceRoleKey) missingVars.push("SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY");
if (!modelscopeApiKey) missingVars.push("EXPO_PUBLIC_MODELSCOPE_API_KEY");
if (!openAiApiKey) missingVars.push("OPENAI_API_KEY");

if (missingVars.length > 0) {
  console.warn(`⚠️ Missing environment variables: ${missingVars.join(", ")}`);
  console.warn("Some features may not work properly.");
}

// Initialize Supabase (only if credentials are provided)
let supabase = null;
if (supabaseUrl && supabaseServiceRoleKey && supabaseServiceRoleKey !== "dummy") {
  supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
  console.log("✅ Supabase connected");
} else {
  console.warn("⚠️ Supabase not configured - database features disabled");
}

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Serve static files from the frontend dist folder (if it exists)
const frontendDistPath = path.join(__dirname, "../caregiver-web/dist");
import fs from "fs";
if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));
  console.log(`✅ Serving frontend from: ${frontendDistPath}`);
} else {
  console.warn(`⚠️ Frontend dist not found at: ${frontendDistPath}`);
  console.warn("Run 'npm run build' in apps/caregiver-web first");
}

app.get("/health", (_req, res) => {
  res.json({ 
    ok: true, 
    service: "memoria-backend",
    features: {
      supabase: !!supabase,
      modelscope: !!modelscopeApiKey,
      openai: !!openAiApiKey,
    }
  });
});

function buildSystemPrompt(patient, contacts, lifeFacts) {
  const triggerTopics = (patient?.trigger_topics || []).join(", ") || "none";
  return `You are a compassionate AI assistant for ${patient?.full_name || "the patient"}, aged ${patient?.age || "unknown"}. Speak warmly and simply. Never mention: ${triggerTopics}. Key people in their life: ${JSON.stringify(contacts || [])}. Life facts: ${JSON.stringify(lifeFacts || [])}. Today is ${new Date().toLocaleDateString()}. Current time: ${new Date().toLocaleTimeString()}.`;
}

async function transcribeAudio(fileBuffer, mimeType = "audio/m4a") {
  if (!openAiApiKey) {
    throw new Error("OpenAI API key not configured");
  }
  
  const form = new FormData();
  form.append("model", "whisper-1");
  form.append("file", new Blob([fileBuffer], { type: mimeType }), "patient-audio.m4a");

  const res = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: { Authorization: `Bearer ${openAiApiKey}` },
    body: form,
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Whisper transcription failed (${res.status}): ${errorText}`);
  }
  const data = await res.json();
  return data.text;
}

async function askModelScope(systemPrompt, userText, patientId) {
  if (!modelscopeApiKey) {
    throw new Error("ModelScope API key not configured");
  }

  // Get patient context from Supabase
  let patientContext = { patient: null, contacts: [] };
  if (supabase && patientId) {
    try {
      const [patientRes, contactsRes] = await Promise.all([
        supabase.from("patient_profiles").select("*").eq("id", patientId).single(),
        supabase.from("contacts").select("*").eq("patient_id", patientId),
      ]);
      patientContext = {
        patient: patientRes.data,
        contacts: contactsRes.data || [],
      };
    } catch (error) {
      console.warn("Could not fetch patient context:", error.message);
    }
  }

  // Build enhanced system prompt with patient context
  const enhancedPrompt = `You are Memoria, an AI assistant for ${patientContext.patient?.full_name || patientContext.patient?.name || 'an elderly patient'}.
Important facts about them:
- Avoid topics: ${patientContext.patient?.trigger_topics?.join(', ') || 'none'}
- Their family: ${patientContext.contacts?.map(c => c.full_name).join(', ') || 'unknown'}

${systemPrompt}

Speak warmly, slowly, and clearly. Keep responses to 2-3 sentences.`;

  const res = await fetch(`${modelscopeBaseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${modelscopeApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: chatModel,
      messages: [
        { role: "system", content: enhancedPrompt },
        { role: "user", content: userText }
      ],
      max_tokens: 150,
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`ModelScope chat failed (${res.status}): ${errorText}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content || "I'm here with you. Could you please say that again?";
}

async function ttsModelScope(text) {
  if (!modelscopeApiKey) {
    throw new Error("ModelScope API key not configured");
  }

  const res = await fetch(`${modelscopeBaseUrl}/models/${voiceModel}`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${modelscopeApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      input: text,
      voice: "zhitian",
      speed: 0.9,
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`ModelScope TTS failed (${res.status}): ${errorText}`);
  }

  const audioBuffer = await res.arrayBuffer();
  return Buffer.from(audioBuffer).toString("base64");
}

app.post("/api/conversation", upload.single("audio"), async (req, res) => {
  try {
    const patientId = req.body.patientId;
    if (!patientId || !req.file) {
      return res.status(400).json({ error: "patientId and audio file are required" });
    }
    
    if (!supabase) {
      return res.status(503).json({ error: "Database not configured" });
    }

    const [patientRes, contactsRes, factsRes] = await Promise.all([
      supabase.from("patient_profiles").select("*").eq("id", patientId).single(),
      supabase.from("contacts").select("*").eq("patient_id", patientId),
      supabase.from("life_facts").select("*").eq("patient_id", patientId),
    ]);
    
    if (patientRes.error) {
      throw new Error(`Patient not found: ${patientRes.error.message}`);
    }

    const transcript = await transcribeAudio(req.file.buffer, req.file.mimetype);
    const systemPrompt = buildSystemPrompt(
      patientRes.data,
      contactsRes.data || [],
      factsRes.data || [],
    );
    const responseText = await askModelScope(systemPrompt, transcript, patientId);
    const audioBase64 = await ttsModelScope(responseText);

    if (supabase) {
      await supabase.from("session_logs").insert({
        patient_id: patientId,
        source: "mobile",
        user_utterance: transcript,
        ai_response: responseText,
        summary: responseText.slice(0, 140),
      });
    }

    res.json({ transcript, responseText, audioBase64, audioMimeType: "audio/mpeg" });
  } catch (error) {
    console.error("Conversation error:", error);
    res.status(500).json({ error: error.message || "Conversation failed" });
  }
});

app.post("/api/caller-overlay", async (req, res) => {
  try {
    const { photoUrl, script } = req.body;
    if (!photoUrl || !script) {
      return res.status(400).json({ error: "photoUrl and script required" });
    }
    
    if (!didApiKey) {
      return res.status(503).json({ error: "D-ID API not configured" });
    }

    const didRes = await fetch("https://api.d-id.com/talks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(didApiKey).toString('base64')}`,
      },
      body: JSON.stringify({
        source_url: photoUrl,
        script: {
          type: "text",
          input: script,
          provider: { type: "microsoft", voice_id: "en-GB-SoniaNeural" },
        },
      }),
    });
    
    if (!didRes.ok) {
      const errorText = await didRes.text();
      throw new Error(`D-ID failed (${didRes.status}): ${errorText}`);
    }
    const didData = await didRes.json();
    res.json({ talkId: didData.id });
  } catch (error) {
    console.error("Caller overlay error:", error);
    res.status(500).json({ error: error.message || "Caller overlay failed" });
  }
});

// Serve the frontend for all other routes (SPA support)
app.get("*", (_req, res) => {
  const indexPath = path.join(frontendDistPath, "index.html");
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).json({ error: "Frontend not built. Run 'npm run build' in apps/caregiver-web" });
  }
});

const server = app.listen(port, () => {
  console.log(`🚀 Memoria backend running on http://localhost:${port}`);
  console.log(`📊 Health check: http://localhost:${port}/health`);
  console.log(`🌐 Frontend: http://localhost:${port}`);
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Port ${port} is already in use. Please free the port or set a different PORT in .env`);
  } else {
    console.error('❌ Backend server error:', error);
  }
  process.exit(1);
});