
import { GoogleGenAI, Type } from '@google/genai';
import type { Song } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const SYSTEM_INSTRUCTION = `You are a professional music AI that generates complete songs with metadata for a music streaming platform.

Generate songs with:
- Title and artist name (AI-generated creative names)
- Genre tags
- Mood/vibe description
- Album art description
- Full musical composition (melody, chords, bass, drums)
- Song duration
- Release year (make it current/recent)

Return JSON format:
{
  "id": "unique-id",
  "title": "Song Title",
  "artist": "Artist Name",
  "album": "Album Name",
  "duration": 180,
  "genre": ["Electronic", "Dance"],
  "mood": "Energetic",
  "year": 2024,
  "coverArt": "description for image generation",
  "composition": {
    "tempo": 128,
    "key": "C major",
    "melody": [...],
    "chords": [...],
    "bass": [...],
    "drums": [...]
  }
}`;

const songSchema = {
  type: Type.OBJECT,
  properties: {
    id: { type: Type.STRING, description: "A unique identifier for the song." },
    title: { type: Type.STRING, description: "The title of the song." },
    artist: { type: Type.STRING, description: "The name of the artist." },
    album: { type: Type.STRING, description: "The name of the album." },
    duration: { type: Type.INTEGER, description: "The song duration in seconds." },
    genre: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "A list of genre tags."
    },
    mood: { type: Type.STRING, description: "The primary mood or vibe of the song." },
    year: { type: Type.INTEGER, description: "The release year of the song." },
    coverArt: { type: Type.STRING, description: "A detailed description for generating album art." },
    composition: {
      type: Type.OBJECT,
      properties: {
        tempo: { type: Type.INTEGER, description: "The tempo of the song in BPM." },
        key: { type: Type.STRING, description: "The musical key of the song." },
        melody: { type: Type.ARRAY, items: { type: Type.STRING }, description: "An array of musical notes for the melody." },
        chords: { type: Type.ARRAY, items: { type: Type.STRING }, description: "An array of chords." },
        bass: { type: Type.ARRAY, items: { type: Type.STRING }, description: "An array of bass notes." },
        drums: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A description of the drum pattern." },
      },
      required: ["tempo", "key", "melody", "chords", "bass", "drums"],
    },
  },
  required: ["id", "title", "artist", "album", "duration", "genre", "mood", "year", "coverArt", "composition"],
};

export const generateSongs = async (numSongs: number, genre: string, mood: string): Promise<Song[]> => {
  const userPrompt = `Generate ${numSongs} songs in ${genre} genre with ${mood} vibe`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: songSchema,
        },
      },
    });

    const jsonText = response.text.trim();
    try {
      const songs: Song[] = JSON.parse(jsonText);
      return songs;
    } catch (parseError) {
        console.error("Failed to parse JSON response:", jsonText);
        throw new Error("The AI returned a response in an unexpected format.");
    }

  } catch (error) {
    console.error("Error generating songs:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to generate songs: ${error.message}`);
    }
    throw new Error("An unknown error occurred while generating songs.");
  }
};
