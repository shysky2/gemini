import { GoogleGenAI } from "@google/genai";
import { CartoonStyle } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = 'gemini-2.5-flash-image';

export const generateCartoonImage = async (
  base64Image: string, 
  mimeType: string, 
  style: CartoonStyle
): Promise<string> => {
  
  let promptDetail = "";
  
  switch (style) {
    case CartoonStyle.Pixar3D:
      promptDetail = "a high-quality 3D render, cute, expressive, Pixar or Disney animation style, soft lighting, vibrant colors, 4k detail.";
      break;
    case CartoonStyle.Anime:
      promptDetail = "a high-quality Japanese anime style, clean lines, vibrant cel-shading, studio ghibli or modern shonen aesthetic.";
      break;
    case CartoonStyle.ComicBook:
      promptDetail = "a vintage American comic book style, bold black outlines, halftone patterns, pop art aesthetic, dramatic shading.";
      break;
    case CartoonStyle.Caricature:
      promptDetail = "a funny artistic caricature, slightly exaggerated features, expressive, hand-drawn artistic style.";
      break;
    case CartoonStyle.FlatDesign:
      promptDetail = "a modern minimalist flat design vector illustration, simple shapes, solid colors, clean and sleek.";
      break;
    default:
      promptDetail = "a stylized cartoon character.";
  }

  const prompt = `Transform the person in this image into ${promptDetail}. Maintain the gender, hair color, and key facial characteristics (like glasses or facial hair) so they are recognizable, but fully stylized as a cartoon. Return ONLY the image.`;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
    });

    // Check response parts for image data
    if (response.candidates && response.candidates[0].content && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
           return `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
        }
      }
    }

    throw new Error("No image generated in response");

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
