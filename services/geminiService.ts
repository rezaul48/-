import { GoogleGenAI } from "@google/genai";

// Initialize the client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const editImageWithGemini = async (base64Image: string, prompt: string): Promise<string> => {
  try {
    // Extract purely the base64 part if it contains the data url prefix
    const base64Data = base64Image.split(',')[1] || base64Image;
    const mimeType = base64Image.substring(base64Image.indexOf(':') + 1, base64Image.indexOf(';')) || 'image/jpeg';

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
    });

    // Look for image output in the parts
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        const resultBase64 = part.inlineData.data;
        // Construct a data URL from the response
        // Note: The API usually returns the raw base64. We need to guess mime type or assume png/jpeg.
        // Usually gemini image output is png or jpeg.
        return `data:image/png;base64,${resultBase64}`;
      }
    }
    
    throw new Error("No image generated found in response.");
  } catch (error) {
    console.error("Error editing image:", error);
    throw error;
  }
};