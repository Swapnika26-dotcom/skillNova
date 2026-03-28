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

export async function generateInnovationIdeas(domain: string, resumeProfile?: any) {
  const prompt = resumeProfile 
    ? `Generate 5 innovative project ideas for the domain: ${domain}, specifically tailored for a student with this profile: ${JSON.stringify(resumeProfile)}.`
    : `Generate 5 innovative project ideas for the domain: ${domain}.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
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

export async function generateStudyPlan(resumeProfile: any) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Based on this resume profile: ${JSON.stringify(resumeProfile)}, generate a personalized 4-week study plan to bridge skill gaps and prepare for top-tier engineering roles.`,
    config: {
      systemInstruction: "You are a Career and Academic Mentor. Provide a detailed 4-week study plan in Markdown format. Focus on bridging the 'missingSkills' identified in the profile and strengthening 'matchedSkills'. Be encouraging and professional.",
    },
  });
  return response.text;
}

export async function generateCareerRoadmap(resumeProfile: any) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Based on this resume profile: ${JSON.stringify(resumeProfile)}, generate a detailed career roadmap for the next 12 months. Include certifications to pursue, project types to build, and networking strategies.`,
    config: {
      systemInstruction: "You are a Senior Career Strategist. Provide a structured 12-month career roadmap in Markdown format. Break it down into quarterly milestones (Q1-Q4). Focus on high-impact actions that will lead to a top-tier engineering role.",
    },
  });
  return response.text;
}

export async function analyzeResumePDF(pdfBase64: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        inlineData: {
          mimeType: "application/pdf",
          data: pdfBase64
        }
      },
      {
        text: `Analyze this resume and provide a comprehensive summary of skills, experience, and overall profile.`
      }
    ],
    config: {
      systemInstruction: "You are a Placement Coach and ATS Resume Analyzer. Analyze the provided PDF resume. Return a JSON object with a score (0-100) representing overall resume quality, matchedSkills (array of top technical skills found), missingSkills (array of skills that could be added for better engineering roles), experienceLevel (string: 'Entry', 'Intermediate', 'Senior'), and suggestion (string for improvement).",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER },
          matchedSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
          missingSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
          experienceLevel: { type: Type.STRING },
          suggestion: { type: Type.STRING }
        },
        required: ["score", "matchedSkills", "missingSkills", "experienceLevel", "suggestion"]
      }
    },
  });
  try {
    return JSON.parse(response.text || "{}");
  } catch (e) {
    return null;
  }
}

export async function recommendJobs(skills: string, resumeProfile: any) {
  const prompt = resumeProfile 
    ? `Analyze this student's resume profile: ${JSON.stringify(resumeProfile)}. 
       The user has confirmed these are their core skills: ${skills}. 
       Recommend 5 job roles that best match their profile and these specific skills. 
       
       STRICT MATCHING LOGIC:
       1. PRIORITIZE roles that utilize a high percentage of the 'matchedSkills' (${resumeProfile.matchedSkills?.join(', ')}).
       2. PENALIZE roles that require many of the 'missingSkills' (${resumeProfile.missingSkills?.join(', ')}).
       3. The 'matchPercentage' (0-100) MUST factor in the overall resume 'score' (${resumeProfile.score}) as a baseline for quality.
       
       Calculate a matchPercentage for each role by comparing the job requirements with the resume profile and provided skills.
       Provide 'matchDetails' explaining how the matched skills, missing skills, and overall resume score influenced the final percentage.`
    : `Recommend 5 job roles and descriptions for someone with these skills: ${skills}`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      systemInstruction: "You are a Career Advisor. Based on the user's resume and skills, recommend 5 relevant job roles. For each role, provide a title, a brief description, 3 key companies that hire for this role, and a 'matchPercentage' (0-100) based on the resume provided. Return ONLY a JSON array of objects.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            companies: { type: Type.ARRAY, items: { type: Type.STRING } },
            matchPercentage: { type: Type.NUMBER },
            matchDetails: { type: Type.STRING }
          },
          required: ["title", "description", "companies", "matchPercentage", "matchDetails"]
        }
      }
    },
  });
  try {
    return JSON.parse(response.text || "[]");
  } catch (e) {
    return [];
  }
}
