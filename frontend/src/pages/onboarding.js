import { icons } from '../components/icons.js';

const API_BASE = 'http://localhost:5000/api';
let analysisResults = null;

export function renderOnboarding() {
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
  const { analysis } = analysisResults;
  
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

      <div class="onboarding-card onboarding-card-results" id="onboarding-content">
        <div style=\"padding:20px;\">
          ${renderSkillsTable(analysis)}
          
          <div style=\"margin-top:30px; display:flex; gap:12px;\">
            <button id=\"new-resume-btn\" class=\"btn btn-primary\" style=\"flex:1; cursor:pointer;\">
              Upload Another Resume
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>`;
}

function renderSkillsTable(analysis) {
  if (!analysis) {
    return '<p style="color:var(--text-secondary);">Unable to load analysis results</p>';
  }


  const summary = analysis.summary || '';
  const skillsData = analysis.skills_analysis || [];

  if (!Array.isArray(skillsData) || skillsData.length === 0) {
    return '<p style="color:var(--text-secondary);">No skills data available</p>';
  }

  return `
  <div>
    ${summary ? `
      <div style="background:var(--accent-primary-light); border-left:4px solid var(--accent-primary); padding:16px; border-radius:6px; margin-bottom:24px;">
        <p style="font-weight:600; color:var(--accent-primary); margin:0; font-size:14px;">Strategic Recommendation</p>
        <p style="color:var(--text-primary); margin:8px 0 0 0; font-size:15px; line-height:1.5;">${summary}</p>
      </div>
    ` : ''}

    <div style="overflow-x:auto;">
      <table style="width:100%; min-width:1000px; border-collapse:collapse;">
        <thead>
          <tr style="border-bottom:2px solid var(--bg-tertiary); background:var(--bg-secondary);">
            <th style="padding:14px 16px; text-align:left; font-weight:600; font-size:13px; white-space:nowrap;">Skill</th>
            <th style="padding:14px 16px; text-align:center; font-weight:600; font-size:13px; white-space:nowrap;">Demand</th>
            <th style="padding:14px 16px; text-align:center; font-weight:600; font-size:13px; white-space:nowrap;">Reward</th>
            <th style="padding:14px 16px; text-align:center; font-weight:600; font-size:13px; white-space:nowrap;">Risk</th>
            <th style="padding:14px 16px; text-align:left; font-weight:600; font-size:13px; white-space:nowrap;">Growth Trend</th>
            <th style="padding:14px 16px; text-align:center; font-weight:600; font-size:13px; white-space:nowrap;">Action</th>
            <th style="padding:14px 16px; text-align:center; font-weight:600; font-size:13px; white-space:nowrap;">Salary Range</th>
          </tr>
        </thead>
        <tbody>
          ${skillsData.map((item, idx) => {
            const actionColor = item.action === 'invest' ? 'var(--invest)' : item.action === 'reduce' ? 'var(--reduce)' : 'var(--hold)';
            const actionBg = item.action === 'invest' ? 'var(--invest-bg)' : item.action === 'reduce' ? 'var(--reduce-bg)' : 'var(--hold-bg)';
            
            return `
              <tr style="border-bottom:1px solid var(--bg-tertiary); ${idx % 2 === 0 ? 'background:var(--bg-primary);' : ''}">
                <td style="padding:14px 16px; font-weight:500; color:var(--text-primary);">${item.skill || 'N/A'}</td>
                <td style="padding:14px 16px; text-align:center;">
                  <div style="display:inline-block; background:var(--accent-primary-light); color:var(--accent-primary); padding:4px 8px; border-radius:4px; font-weight:600; font-size:13px;">
                    ${item.demand_score || 0}/10
                  </div>
                </td>
                <td style="padding:14px 16px; text-align:center;">
                  <div style="display:inline-block; background:var(--accent-secondary-light); color:var(--accent-secondary); padding:4px 8px; border-radius:4px; font-weight:600; font-size:13px;">
                    ${item.reward_score || 0}/10
                  </div>
                </td>
                <td style="padding:14px 16px; text-align:center;">
                  <div style="display:inline-block; background:rgba(155, 44, 44, 0.1); color:var(--reduce); padding:4px 8px; border-radius:4px; font-weight:600; font-size:13px;">
                    ${item.risk_score || 0}/10
                  </div>
                </td>
                <td style="padding:14px 16px; text-align:left; color:var(--text-secondary);">
                  <span style="text-transform:capitalize;">${(item.growth_trend || 'N/A').replace(/_/g, ' ')}</span>
                </td>
                <td style="padding:14px 16px; text-align:center;">
                  <span style="display:inline-block; background:${actionBg}; color:${actionColor}; padding:4px 10px; border-radius:4px; font-weight:600; font-size:12px; text-transform:uppercase;">
                    ${item.action || 'N/A'}
                  </span>
                </td>
                <td style="padding:14px 16px; text-align:center; color:var(--text-primary); font-size:13px;">${item.market_salary || 'N/A'}</td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>
  </div>`;
}

export function bindOnboarding() {
  if (analysisResults) {
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
        console.log('API Response:', data);

        if (!data.analysis) {
          throw new Error('No analysis data in response. API may have failed to parse resume.');
        }

        analysisResults = data;


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
