import { GoogleGenAI, Type } from "@google/genai";

// Standard translation using Gemini 3 Flash
export async function translateContent(text: string, from: 'KR' | 'CN') {
  const targetLang = from === 'KR' ? 'Chinese' : 'Korean';
  const prompt = `Translate the following job recruitment text into ${targetLang}. Keep the context professional and suitable for a job portal. Output only the translated text.\n\nText: ${text}`;

  // Instantiate right before call to ensure latest API key is used
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || text;
  } catch (error) {
    console.error("Translation Error:", error);
    return text;
  }
}

// Generate bilingual structured content using Gemini 3 Flash and JSON mode
export async function generateBilingualPost(title: string, description: string, from: 'KR' | 'CN') {
  const targetLang = from === 'KR' ? 'Chinese' : 'Korean';
  
  // Instantiate right before call to ensure latest API key is used
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `As a professional recruiter for Yanji Job portal, create a bilingual version of this post.
    Original Title: ${title}
    Original Description: ${description}
    Format the output as JSON with the following structure:
    { "titleKR": "...", "titleCN": "...", "descKR": "...", "descCN": "..." }`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          titleKR: { type: Type.STRING },
          titleCN: { type: Type.STRING },
          descKR: { type: Type.STRING },
          descCN: { type: Type.STRING },
        },
        required: ["titleKR", "titleCN", "descKR", "descCN"]
      }
    }
  });

  const text = response.text;
  if (!text) {
    throw new Error("No response from AI service");
  }

  try {
    return JSON.parse(text);
  } catch (e) {
    console.error("JSON Parse Error on Gemini Response:", e);
    // Fallback if JSON is malformed
    return {
      titleKR: from === 'KR' ? title : '',
      titleCN: from === 'CN' ? title : '',
      descKR: from === 'KR' ? description : '',
      descCN: from === 'CN' ? description : '',
    };
  }
}