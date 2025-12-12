import { GoogleGenAI, Type } from "@google/genai";

export const generateSethStylePost = async (topic: string): Promise<{ title: string; content: string; tags: string[] }> => {
  try {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || process.env.API_KEY;
    if (!apiKey) {
      throw new Error("Gemini API Key not found. Please set VITE_GEMINI_API_KEY in your .env file.");
    }
    
    const ai = new GoogleGenAI({ apiKey });
    
    // Using gemini-2.5-flash for fast, snappy text generation
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Write a blog post in the style of Seth Godin about "${topic}". 
      
      Style Guidelines:
      - Short, punchy sentences.
      - Use a rhetorical question or two.
      - Focus on marketing, leadership, art, or the "lizard brain".
      - Keep it concise (under 300 words).
      - Use simple, direct language.
      - Do not use jargon.
      - The tone should be provocative but inspiring.
      - Generate 3-5 relevant single-word tags (lowercase).
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: {
              type: Type.STRING,
              description: "The title of the blog post."
            },
            content: {
              type: Type.STRING,
              description: "The content of the blog post in markdown format."
            },
            tags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of 3-5 relevant tags for the post."
            }
          },
          required: ["title", "content", "tags"]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from Gemini");
    }

    const json = JSON.parse(text);
    return {
      title: json.title || "Untitled",
      content: json.content || "No content generated.",
      tags: json.tags || []
    };
  } catch (error) {
    console.error("Error generating post:", error);
    throw error;
  }
};