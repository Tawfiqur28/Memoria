import { buildSystemPrompt } from "./promptBuilder";
import { MemoryGraph } from "./types";

type VoiceLoopConfig = {
  claudeApiKey: string;
  elevenLabsApiKey: string;
  elevenLabsVoiceId: string;
};

export type VoiceLoopResult = {
  transcript: string;
  responseText: string;
  audioBuffer: ArrayBuffer;
};

async function transcribeWithWhisper(audioBlob: Blob): Promise<string> {
  const formData = new FormData();
  formData.append("file", audioBlob, "voice-input.wav");
  formData.append("model", "whisper-1");

  const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY ?? ""}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Whisper transcription failed: ${response.status}`);
  }

  const data = (await response.json()) as { text: string };
  return data.text;
}

async function askClaude(systemPrompt: string, userText: string, claudeApiKey: string): Promise<string> {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": claudeApiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 500,
      system: systemPrompt,
      messages: [{ role: "user", content: userText }],
    }),
  });

  if (!response.ok) {
    throw new Error(`Claude request failed: ${response.status}`);
  }

  const data = await response.json();
  const text = data?.content?.[0]?.text;
  if (!text) throw new Error("Claude returned empty content");
  return text;
}

async function speakWithElevenLabs(text: string, cfg: VoiceLoopConfig): Promise<ArrayBuffer> {
  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${cfg.elevenLabsVoiceId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": cfg.elevenLabsApiKey,
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_turbo_v2_5",
        voice_settings: {
          stability: 0.45,
          similarity_boost: 0.8,
        },
      }),
    },
  );

  if (!response.ok) {
    throw new Error(`ElevenLabs TTS failed: ${response.status}`);
  }

  return response.arrayBuffer();
}

export async function runVoiceConversationLoop(
  audioBlob: Blob,
  memoryGraph: MemoryGraph,
  cfg: VoiceLoopConfig,
): Promise<VoiceLoopResult> {
  const transcript = await transcribeWithWhisper(audioBlob);
  const systemPrompt = buildSystemPrompt(memoryGraph);
  const responseText = await askClaude(systemPrompt, transcript, cfg.claudeApiKey);
  const audioBuffer = await speakWithElevenLabs(responseText, cfg);

  return {
    transcript,
    responseText,
    audioBuffer,
  };
}
