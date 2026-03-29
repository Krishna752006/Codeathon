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

// Middleware
app.use(cors());
app.use(express.json());

// File upload setup
const upload = multer({ dest: "uploads/" });

// Initialize OpenAI
const openai = new OpenAI({
  baseURL: "https://api.featherless.ai/v1",
  apiKey: process.env.FEATHERLESS_API_KEY,
});

// ============ RESUME EXTRACTION ============
async function extractResumeText(imagePath) {
  // For now, return mock text (no Python OCR needed for testing)
  // In production, integrate real OCR here
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

// ============ SKILL ANALYSIS ============
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

// Extract skills from resume text
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
You are a career market intelligence system.

Resume:
${resumeText}

Skills:
${skills}

Market Data:
${marketData}

Analyze the skills using market data and resume.

Return ONLY valid JSON in this format:
[
  {
    "skill": "skill name",
    "demand": 7,
    "growth": 8,
    "saturation": 5,
    "salary_range": "80k-120k",
    "risk": "low",
    "recommendation": "focus on this skill",
    "recommended_hours": 5
  }
]

Rules:
- Use market data for demand and growth
- Scores are 1-10
- Total recommended_hours should be around 20
- Return ONLY valid JSON, no explanation`;

  const chatCompletions = await openai.chat.completions.create({
    model: "Qwen/Qwen2.5-7B-Instruct",
    max_tokens: 1200,
    temperature: 0.2,
    messages: [
      {
        role: "system",
        content: "You are a strict JSON generator. Only return valid JSON."
      },
      {
        role: "user",
        content: prompt
      }
    ]
  });

  return JSON.parse(chatCompletions.choices[0].message.content);
}

// ============ ENDPOINTS ============

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Upload resume and analyze
app.post("/api/analyze-resume", upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    console.log("Extracting text from resume...");
    const resumeText = await extractResumeText(req.file.path);
    
    // Clean up uploaded file
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

// Direct analysis (for testing)
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

// Start server
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});