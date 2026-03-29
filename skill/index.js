import OpenAI from "openai";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

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

const openai = new OpenAI({
  baseURL: "https://api.featherless.ai/v1",
  apiKey: process.env.FEATHERLESS_API_KEY,
});

async function runSkillEngine() {

  const resumeText = `
  Software engineering student with Python, SQL and Machine Learning.
  Interested in AI and backend development.
  `;

  const skills = "Python, SQL, Machine Learning, React";

  console.log("Fetching market data...");

  const marketData = await searchMarketData(skills);

  console.log("Market data fetched.");

  const prompt = `
You are a career market intelligence system.

Resume:
${resumeText}

Skills:
${skills}

Market Data:
${marketData}

Task:

Analyze the skills using market data and resume.

Return JSON in this format:

[
 {
  "skill": "",
  "demand": 1-10,
  "growth": 1-10,
  "saturation": 1-10,
  "salary_range": "",
  "risk": "",
  "recommendation": "",
  "recommended_hours": number
 }
]

Rules:
- Use market data for demand and growth
- Use resume for interest and experience
- Assign recommended_hours based on importance
- Total hours should be around 20
- Return only JSON
- No explanation
`;

  const chatCompletions = await openai.chat.completions.create({
    model: "Qwen/Qwen2.5-7B-Instruct",
    max_tokens: 1200,
    temperature: 0.2,
    messages: [
      {
        role: "system",
        content: "You are a strict JSON generator. Only return JSON."
      },
      {
        role: "user",
        content: prompt
      }
    ]
  });

  console.log("\nRESULT:\n");

  console.log(chatCompletions.choices[0].message.content);
}

runSkillEngine();