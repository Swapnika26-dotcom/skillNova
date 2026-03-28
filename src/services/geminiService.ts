import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function askStudyBuddy(question: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: question,
    config: {
      systemInstruction: "You are AI Study Buddy, a helpful and professional tutor for BTech students. Provide clear, academic, and concise answers to engineering and technical questions.",
    },
  });
  return response.text;
}

export async function generateInnovationIdeas(domain: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate 5 innovative project ideas for the domain: ${domain}.`,
    config: {
      systemInstruction: "You are an Innovation Idea Generator. Provide a list of 5 unique and practical project ideas for BTech students. Return ONLY a JSON array of strings.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      }
    },
  });
  try {
    return JSON.parse(response.text || "[]") as string[];
  } catch (e) {
    return [];
  }
}

export async function analyzeResume(resumeText: string, company: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze this resume for a position at ${company}:\n\n${resumeText}`,
    config: {
      systemInstruction: "You are a Placement Coach and ATS Resume Analyzer. Analyze the resume against the typical requirements of the specified company. Return a JSON object with company, score (0-100), matchedSkills (array), missingSkills (array), and suggestion (string).",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          company: { type: Type.STRING },
          score: { type: Type.NUMBER },
          matchedSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
          missingSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
          suggestion: { type: Type.STRING }
        },
        required: ["company", "score", "matchedSkills", "missingSkills", "suggestion"]
      }
    },
  });
  try {
    return JSON.parse(response.text || "{}");
  } catch (e) {
    return null;
  }
}
