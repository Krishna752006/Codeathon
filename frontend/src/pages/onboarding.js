// ============================================
// ONBOARDING — Resume Upload & Analysis
// ============================================
import { icons } from '../components/icons.js';

const API_BASE = 'http://localhost:5000/api';
let analysisResults = null;

export function renderOnboarding() {
  // If analysis is done, show results
  if (analysisResults) {
    return renderResults();
  }

  return `
  <div class="onboarding-page">
    <div class="onboarding-container">
      <div class="onboarding-header">
        <a href="#/" class="landing-nav-brand" style="display:inline-flex; margin-bottom:24px;">
          <div class="brand-icon">${icons.trendingUp(20)}</div>
          <span>SkillFolio</span>
        </a>
        <h1 class="onboarding-title">Upload Your Resume</h1>
        <p class="onboarding-subtitle">Get AI-powered insights about your skills and market demand</p>
      </div>

      <div class="onboarding-card" id="onboarding-content">
        <div style="text-align:center; padding:40px 20px; display:flex; flex-direction:column; align-items:center; justify-content:center;">
          <div style="margin:30px 0;">
            <div style="font-size:48px; color:var(--accent-primary); margin-bottom:20px; display:flex; justify-content:center;">
              ${icons.upload(48)}
            </div>
            <h3 style="font-size:18px; font-weight:600; margin-bottom:10px;">Upload Resume Image</h3>
            <p style="color:var(--text-secondary); margin-bottom:30px;">JPG, PNG supported. Max 5MB</p>
          </div>

          <div id="upload-form" style="display:flex; flex-direction:column; gap:16px;">
            <input 
              type="file" 
              id="resume-file" 
              accept="image/*" 
              style="display:none;"
            />
            <button id="upload-btn" class="btn btn-primary" style="cursor:pointer;">
              Choose File
            </button>
            <div style="color:var(--text-tertiary); font-size:12px;">
              We extract text from your resume image to analyze your skills
            </div>
          </div>

          <div id="loading" style="display:none; text-align:center;">
            <div style="margin:20px 0; color:var(--text-secondary);">
              <div style="font-size:14px; margin-bottom:10px;">Analyzing your resume...</div>
              <div style="animation: spin 1s linear infinite; display:inline-block;">
                ${icons.refreshCw(24)}
              </div>
            </div>
          </div>

          <div id="error" style="display:none; color:var(--status-error); font-size:14px; margin-top:20px; padding:12px; background:rgba(239, 68, 68, 0.1); border-radius:8px;"></div>
        </div>
      </div>
    </div>
  </div>`;
}

function renderResults() {
  const { skills, analysis } = analysisResults;
  
  return `
  <div class="onboarding-page">
    <div class="onboarding-container">
      <div class="onboarding-header">
        <a href="#/" class="landing-nav-brand" style="display:inline-flex; margin-bottom:24px;">
          <div class="brand-icon">${icons.trendingUp(20)}</div>
          <span>SkillFolio</span>
        </a>
        <h1 class="onboarding-title">Your Skills Analysis</h1>
        <p class="onboarding-subtitle">Based on your resume and current market data</p>
      </div>

      <div class="onboarding-card" id="onboarding-content">
        <div style="padding:20px;">
          ${renderSkillsTable(analysis)}
          
          <div style="margin-top:30px; display:flex; gap:12px;">
            <button id="new-resume-btn" class="btn btn-primary" style="flex:1; cursor:pointer;">
              Upload Another Resume
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>`;
}

function renderSkillsTable(analysis) {
  if (!analysis || !Array.isArray(analysis)) {
    return '<p style="color:var(--text-secondary);">Unable to parse analysis results</p>';
  }

  return `
  <div style="overflow-x:auto;">
    <table style="width:100%; border-collapse:collapse;">
      <thead>
        <tr style="border-bottom:2px solid var(--bg-tertiary);">
          <th style="padding:12px; text-align:left; font-weight:600;">Skill</th>
          <th style="padding:12px; text-align:center; font-weight:600;">Demand</th>
          <th style="padding:12px; text-align:center; font-weight:600;">Growth</th>
          <th style="padding:12px; text-align:center; font-weight:600;">Saturation</th>
          <th style="padding:12px; text-align:left; font-weight:600;">Salary Range</th>
          <th style="padding:12px; text-align:center; font-weight:600;">Hours/Week</th>
        </tr>
      </thead>
      <tbody>
        ${analysis.map((item, idx) => `
          <tr style="border-bottom:1px solid var(--bg-tertiary); ${idx % 2 === 0 ? 'background:var(--bg-secondary);' : ''}">
            <td style="padding:12px; font-weight:500;">${item.skill || 'N/A'}</td>
            <td style="padding:12px; text-align:center; color:var(--accent-primary); font-weight:600;">${item.demand || 0}/10</td>
            <td style="padding:12px; text-align:center; color:var(--accent-secondary); font-weight:600;">${item.growth || 0}/10</td>
            <td style="padding:12px; text-align:center; color:var(--text-secondary);">${item.saturation || 0}/10</td>
            <td style="padding:12px;">${item.salary_range || 'N/A'}</td>
            <td style="padding:12px; text-align:center; font-weight:600;">${item.recommended_hours || 0}h</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>`;
}

export function bindOnboarding() {
  if (analysisResults) {
    // Results page bindings
    const newResumeBtn = document.getElementById('new-resume-btn');

    if (newResumeBtn) {
      newResumeBtn.addEventListener('click', () => {
        analysisResults = null;
        const appEl = document.getElementById('app');
        appEl.innerHTML = renderOnboarding();
        bindOnboarding();
      });
    }
    return;
  }

  // Upload page bindings
  const uploadBtn = document.getElementById('upload-btn');
  const resumeFile = document.getElementById('resume-file');
  const loading = document.getElementById('loading');
  const error = document.getElementById('error');

  if (uploadBtn) {
    uploadBtn.addEventListener('click', () => {
      resumeFile.click();
    });
  }

  if (resumeFile) {
    resumeFile.addEventListener('change', async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Show loading
      document.getElementById('upload-form').style.display = 'none';
      loading.style.display = 'block';
      error.style.display = 'none';

      try {
        const formData = new FormData();
        formData.append('resume', file);

        const response = await fetch(`${API_BASE}/analyze-resume`, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.statusText}`);
        }

        const data = await response.json();
        analysisResults = data;

        // Re-render with results
        const appEl = document.getElementById('app');
        appEl.innerHTML = renderResults();
        bindOnboarding();

      } catch (err) {
        console.error('Upload error:', err);
        error.textContent = `Error: ${err.message}`;
        error.style.display = 'block';
        document.getElementById('upload-form').style.display = 'flex';
        loading.style.display = 'none';
      }
    });
  }
}
