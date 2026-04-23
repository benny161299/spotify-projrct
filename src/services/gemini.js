/**
 * Gemini AI service
 * Sends a user prompt and returns an array of { title, artist } track objects.
 */

const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent';

const SYSTEM_PROMPT = `You are a music expert and playlist curator.
The user will describe a mood, activity, theme, or vibe.
Your job is to suggest 15–20 songs that perfectly match the description.

CRITICAL RULES:
- Respond ONLY with a valid JSON array. No explanation, no markdown, no text before or after.
- Each item must have exactly two fields: "title" (string) and "artist" (string).
- Do not include albums, years, genres, or any other fields.
- Make sure the songs actually exist and are real.

Example format:
[
  { "title": "Midnight Rain", "artist": "Taylor Swift" },
  { "title": "Motion Sickness", "artist": "Phoebe Bridgers" }
]`;

/**
 * Asks Gemini to generate a playlist based on the user's prompt.
 * @param {string} userPrompt - Natural language description of desired playlist
 * @returns {Promise<Array<{title: string, artist: string}>>}
 */
export async function generatePlaylistTracks(userPrompt) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Gemini API key is not configured. Please set VITE_GEMINI_API_KEY in your .env file.');
  }

  const url = `${GEMINI_API_BASE}?key=${apiKey}`;

  const body = {
    contents: [
      {
        parts: [
          { text: SYSTEM_PROMPT },
          { text: `User request: ${userPrompt}` },
        ],
      },
    ],
    generationConfig: {
      temperature: 1.0,
      topK: 40,
      topP: 0.95,
    },
  };

  let response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error('Network error — check your connection and try again.');
  }

  if (!response.ok) {
    if (response.status === 400 || response.status === 403) {
      throw new Error('AI service unavailable — invalid or quota-exceeded API key.');
    }
    throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  let rawText;
  try {
    rawText = data.candidates[0].content.parts[0].text;
  } catch {
    throw new Error('Unexpected response format from Gemini API.');
  }

  // Strip any accidental markdown code fences
  const cleaned = rawText.replace(/```json|```/g, '').trim();

  let tracks;
  try {
    tracks = JSON.parse(cleaned);
  } catch {
    throw new Error('AI returned invalid JSON. Please try again.');
  }

  if (!Array.isArray(tracks)) {
    throw new Error('AI returned unexpected data format. Please try again.');
  }

  if (tracks.length < 5) {
    console.warn(`Gemini returned only ${tracks.length} tracks — fewer than expected.`);
  }

  return tracks;
}

/**
 * Generates a short, human-readable playlist name from the user's prompt.
 * Trims to 40 characters at a word boundary.
 * @param {string} prompt
 * @returns {string}
 */
export function derivePlaylistName(prompt) {
  if (!prompt) return 'AI Playlist';
  const capitalized = prompt.charAt(0).toUpperCase() + prompt.slice(1);
  if (capitalized.length <= 40) return capitalized;
  const trimmed = capitalized.slice(0, 40);
  const lastSpace = trimmed.lastIndexOf(' ');
  return lastSpace > 20 ? trimmed.slice(0, lastSpace) : trimmed;
}
