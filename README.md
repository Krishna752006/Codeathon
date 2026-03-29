# SkillFolio — Skill Analysis Platform

Simple setup to connect frontend with backend, process resume images, and analyze skills with AI.

## Architecture

- **Frontend**: Vanilla JS SPA (Vite)
- **Backend**: Node.js Express server  
- **Resume Processing**: Python script with EasyOCR
- **AI Analysis**: Featherless AI (Qwen model)
- **Market Data**: Tavily API

## Setup

### 1. Backend Dependencies

```bash
cd skill
npm install
```

Ensure you have Python installed with required packages:
```bash
pip install easyocr opencv-python
```

### 2. Environment Variables

Copy `.env.example` to `.env` and add your API keys:

```bash
cd skill
cp .env.example .env
```

Add to `.env`:
- `FEATHERLESS_API_KEY` — Get from https://featherless.ai
- `TAVILY_API_KEY` — Get from https://tavily.com

### 3. Start Backend

```bash
cd skill
npm start
```

Server runs on `http://localhost:5000`

Health check: `http://localhost:5000/api/health`

### 4. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173` (or next available port)

## File Structure

```
d:\Codethon\
├── skill/                    # Backend
│   ├── index.js             # Express server with API endpoints
│   ├── package.json         # Dependencies
│   └── .env                 # API keys (don't commit!)
├── frontend/                # Frontend SPA
│   ├── src/
│   │   ├── main.js          # Entry point
│   │   ├── router.js        # Client-side router
│   │   ├── pages/
│   │   │   ├── landing.js   # Home page
│   │   │   ├── login.js     # Login page
│   │   │   ├── signup.js    # Signup page
│   │   │   ├── onboarding.js # Resume upload (NEW)
│   │   │   └── dashboard.js # Results dashboard
│   │   └── ...
│   ├── package.json
│   └── index.html
└── resume.py                # Python script for OCR
```

## API Endpoints

### `POST /api/analyze-resume`
Upload resume image and get analysis.

**Request:**
```
multipart/form-data
- resume: File (JPG/PNG)
```

**Response:**
```json
{
  "resumeText": "extracted text...",
  "skills": "Python, React, Node.js",
  "analysis": [
    {
      "skill": "Python",
      "demand": 8,
      "growth": 9,
      "saturation": 5,
      "salary_range": "90k-130k",
      "risk": "low",
      "recommendation": "high priority",
      "recommended_hours": 5
    }
  ]
}
```

### `POST /api/analyze`
Direct text analysis (for testing).

**Request:**
```json
{ "resumeText": "..." }
```

### `GET /api/health`
Check if backend is running.

## Running the App

1. **Start backend** (Terminal 1):
   ```bash
   cd skill && npm start
   ```

2. **Start frontend** (Terminal 2):
   ```bash
   cd frontend && npm run dev
   ```

3. **Open browser** → `http://localhost:5173`

4. **Flow**:
   - Home → Signup/Login → Onboarding (Upload Resume) → Results → Dashboard

## Resume Upload Flow

1. User uploads resume image (JPG/PNG)
2. Backend calls `resume.py` with image path
3. Python extracts text using EasyOCR
4. Backend extracts skills from text
5. OpenAI API analyzes skills with market data
6. Results displayed in table format
7. User can upload again or go to dashboard

## Testing Backend

Test the API directly:

```bash
# Health check
curl http://localhost:5000/api/health

# Direct analysis
curl -X POST http://localhost:5000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"resumeText":"Python, React, SQL experience"}'
```

## Production Notes

- Add error handling and validation
- Implement authentication (currently skipped)
- Store results in database
- Add rate limiting
- Use environment-specific configs
- Keep API keys secure

## Troubleshooting

**Backend not starting?**
- Check if port 5000 is available: `netstat -ano | findstr :5000`
- Verify API keys in `.env`
- Check Node/Python versions

**Frontend can't reach backend?**
- Ensure CORS is enabled (it is in `index.js`)
- Check if backend is running: `curl http://localhost:5000/api/health`
- Verify `API_BASE` in `onboarding.js`

**Python script fails?**
- Install easyocr: `pip install easyocr`
- Ensure image path is valid
- Check Python version (3.8+)

---

**Quick Start**:
```bash
# Terminal 1
cd skill && npm install && npm start

# Terminal 2
cd frontend && npm install && npm run dev
```

Then open `http://localhost:5173`
