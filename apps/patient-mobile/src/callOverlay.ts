type Caller = {
  full_name: string;
  relationship: string;
  city?: string;
  photo_url: string;
};

type OverlayResult = {
  didTalkId: string;
  whisperText: string;
};

export async function generateCallerAnimationAndWhisper(caller: Caller): Promise<OverlayResult> {
  const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL ?? "http://localhost:8787";
  
  // Validate URL
  if (!backendUrl || backendUrl === "undefined") {
    throw new Error("Backend URL is not configured. Please check EXPO_PUBLIC_BACKEND_URL environment variable.");
  }

  const whisperText = `This is ${caller.full_name}, your ${caller.relationship}. ${
    caller.city ? `They are calling from ${caller.city}.` : ""
  }`;

  // Add timeout to fetch
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

  try {
    const didRes = await fetch(`${backendUrl}/api/caller-overlay`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        photoUrl: caller.photo_url,
        script: whisperText,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!didRes.ok) {
      throw new Error(`D-ID talk creation failed: ${didRes.status} ${didRes.statusText}`);
    }
    
    const didData = await didRes.json();
    
    // Validate response structure
    if (!didData.talkId) {
      throw new Error("Invalid response from backend: missing talkId");
    }

    return { didTalkId: didData.talkId, whisperText };
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error("Request timeout: Backend did not respond within 15 seconds");
    }
    throw error;
  }
}