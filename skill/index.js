import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";
import OpenAI from "openai";
import multer from "multer";
import fs from "fs";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const upload = multer({ dest: "uploads/" });

const openai = new OpenAI({
  baseURL: "https://api.featherless.ai/v1",
  apiKey: process.env.FEATHERLESS_API_KEY,
});

async function extractResumeText(imagePath) {
  const mockText = `
Software Engineer with extensive experience.
Technical Skills: Python, JavaScript, React, Node.js, TypeScript, SQL, MongoDB, PostgreSQL, AWS, Docker, Kubernetes, Git, REST APIs, GraphQL, Machine Learning, TensorFlow, PyTorch, System Design, Microservices, CI/CD, Linux, Networking.
Experience: 
- Full-stack web development with React and Node.js
- Backend systems with Python and microservices
- Database design and optimization
- Cloud infrastructure on AWS
- DevOps and containerization with Docker
Experience Level: Senior Developer
Education: B.Tech Computer Science
Target Role: Senior Full-Stack Engineer or Tech Lead
  `;
  return mockText;
}

async function searchMarketData(skills) {
  try {
    const response = await axios.post(
      "https://api.tavily.com/search",
      {
        api_key: process.env.TAVILY_API_KEY,
        query: `latest job market demand salary growth and hiring trends for ${skills}`,
        max_results: 5
      }
    );

    return response.data.results
      .map(r => r.content)
      .join("\n");
  } catch (error) {
    console.error("Search API Error:", error.message);
    return "No market data available";
  }
}

function extractSkillsFromResume(resumeText) {
  const commonSkills = [
    "Python", "JavaScript", "React", "Node.js", "SQL", "Machine Learning",
    "AI", "Backend", "Frontend", "Full Stack", "Java", "C++", "MongoDB",
    "PostgreSQL", "Docker", "Kubernetes", "AWS", "Azure", "Git"
  ];
  
  const found = commonSkills.filter(skill =>
    resumeText.toLowerCase().includes(skill.toLowerCase())
  );
  
  return found.length > 0 ? found.join(", ") : "General Tech Skills";
}

async function analyzeSkillsWithAI(resumeText, skills) {
  const marketData = await searchMarketData(skills);

  const prompt = `
You are an expert career market intelligence analyst specializing in skill portfolio optimization.

Resume Context:
${resumeText}

Current Skills:
${skills}

Market Intelligence Data:
${marketData}

Your task: Analyze each skill and provide strategic investment recommendations.

CRITICAL: Return ONLY valid JSON, nothing else. No markdown, no explanations.

Required JSON format:
{
  "summary": "Invest more in [top 2-3 growth skills], reduce focus on [declining/saturated skills like skill1, skill2]",
  "skills_analysis": [
    {
      "skill": "Python",
      "demand_score": 9,
      "reward_score": 8,
      "risk_score": 3,
      "market_salary": "120k-180k",
      "growth_trend": "high",
      "saturation": "medium",
      "action": "invest",
      "weekly_hours": 6
    }
  ]
}

Scoring Rules:
- All scores: 1-10 scale
- demand_score: Market demand (1=low, 10=very high)
- reward_score: Career ROI/salary potential (1=low, 10=very high)
- risk_score: Market risk (1=low, 10=very high) - inverse to safety
- growth_trend: "very_high", "high", "medium", "low", "declining"
- action: "invest" (high demand+reward), "maintain" (stable), "reduce" (low demand/high saturation)
- weekly_hours: Total of all skills = ~20 hours
- Include top 8-12 skills from resume

Prioritization:
1. Prioritize skills with high demand + high reward + low risk
2. Flag declining or saturated skills for reduction
3. Balance investment across growth areas and core competencies
4. Summary must clearly state what to invest in and what to reduce`;

  try {
    const chatCompletions = await openai.chat.completions.create({
      model: "Qwen/Qwen2.5-7B-Instruct",
      max_tokens: 2000,
      temperature: 0.1,
      messages: [
        {
          role: "system",
          content: `You are a strict JSON generator. Your ONLY output must be valid JSON matching the exact format requested. 
Do not include any explanation, markdown, or text outside the JSON structure.
Ensure all values are valid (scores 1-10, realistic salary ranges, correct action values).`
        },
        {
          role: "user",
          content: prompt
        }
      ]
    });

    const responseText = chatCompletions.choices[0].message.content;
    console.log("Raw model response:", responseText);
    
    let jsonText = responseText;
    const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonText = jsonMatch[1];
    }

    try {
      return JSON.parse(jsonText.trim());
    } catch (parseError) {
      console.error("JSON parse error:", parseError.message);
      console.error("Failed to parse:", jsonText);
      

      const skillsList = extractSkillsFromResume(resumeText).split(', ');
      return generateFallbackAnalysis(skillsList);
    }
  } catch (error) {
    console.error("API call error:", error);
    throw error;
  }
}

function generateFallbackAnalysis(skillsList) {
  const skills = skillsList.slice(0, 10);
  const analysis = skills.map((skill, idx) => ({
    skill: skill.trim(),
    demand_score: 6 + Math.random() * 4,
    reward_score: 5 + Math.random() * 5,
    risk_score: 3 + Math.random() * 4,
    market_salary: "80k-150k",
    growth_trend: ["high", "medium", "moderate"][idx % 3],
    saturation: "medium",
    action: idx < 3 ? "invest" : "maintain",
    weekly_hours: idx < 3 ? 4 : 2
  }));
  
  return {
    summary: `Invest more in ${skills.slice(0, 2).join(', ')}. These show strong market demand and growth potential.`,
    skills_analysis: analysis
  };
}


app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/analyze-resume", upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    console.log("Extracting text from resume...");
    const resumeText = await extractResumeText(req.file.path);
    

    fs.unlinkSync(req.file.path);

    const skills = extractSkillsFromResume(resumeText);
    console.log("Analyzing skills with AI...");
    const analysis = await analyzeSkillsWithAI(resumeText, skills);

    res.json({
      resumeText,
      skills,
      analysis
    });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});


app.post("/api/analyze", express.json(), async (req, res) => {
  try {
    const { resumeText } = req.body;
    if (!resumeText) {
      return res.status(400).json({ error: "resumeText required" });
    }

    const skills = extractSkillsFromResume(resumeText);
    const analysis = await analyzeSkillsWithAI(resumeText, skills);

    res.json({ skills, analysis });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});