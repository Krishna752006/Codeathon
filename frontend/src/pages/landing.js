import { icons } from '../components/icons.js';

export function renderLanding() {
  return `
  <div class="landing-page">
    <nav class="landing-nav" role="navigation" aria-label="Main navigation">
      <div class="landing-nav-brand">
        <div class="brand-icon">${icons.trendingUp(20)}</div>
        <span>SkillFolio</span>
      </div>
      <div class="landing-nav-actions">
        <a href="#/onboarding" class="btn btn-primary" id="nav-upload">Upload Resume</a>
      </div>
    </nav>

    <section class="landing-hero" aria-label="Hero">
      <div class="landing-hero-content">
        <h1 class="landing-hero-title">
          Turn your skills into an <span class="highlight">investment portfolio</span>
        </h1>
        <p class="landing-hero-subtitle">
          Stop guessing what to learn next. SkillFolio allocates your learning time like capital — 
          using real job-market signals to build a skill portfolio that maximizes your career growth.
        </p>
        <div class="landing-hero-actions">
          <a href="#/onboarding" class="btn btn-primary btn-lg" id="hero-upload">Upload Your Resume</a>
        </div>
      </div>
      <div class="landing-hero-visual" aria-hidden="true">
        <div class="landing-mock-dashboard">
          ${renderMockDashboard()}
        </div>
      </div>
    </section>

    <section class="landing-how" aria-label="How it works">
      <h2 class="landing-how-title">How it works</h2>
      <p class="landing-how-subtitle">Three steps to a data-driven learning strategy</p>
      <div class="landing-steps">
        <div class="landing-step">
          <div class="landing-step-number">1</div>
          <h3 class="landing-step-title">Build your profile</h3>
          <p class="landing-step-desc">Tell us your current skills, target role, and available hours. Or upload your resume and we'll pre-fill everything.</p>
        </div>
        <div class="landing-step">
          <div class="landing-step-number">2</div>
          <h3 class="landing-step-title">Get market signals</h3>
          <p class="landing-step-desc">We analyze real job postings across platforms to score demand, growth trends, and salary premiums for each skill.</p>
        </div>
        <div class="landing-step">
          <div class="landing-step-number">3</div>
          <h3 class="landing-step-title">Follow your portfolio plan</h3>
          <p class="landing-step-desc">Receive a personalized allocation: which skills to invest in, hold, or reduce — structured into focused learning seasons.</p>
        </div>
      </div>
    </section>

    <section class="landing-trust" aria-label="Why trust us">
      <div class="landing-trust-grid">
        <div class="landing-trust-item">
          <div class="landing-trust-icon">${icons.barChart(20)}</div>
          <h3 class="landing-trust-title">Backed by job-market signals</h3>
          <p class="landing-trust-desc">Recommendations are grounded in quantitative demand data from real job postings — not opinion, not hype.</p>
        </div>
        <div class="landing-trust-item">
          <div class="landing-trust-icon">${icons.eye(20)}</div>
          <h3 class="landing-trust-title">Transparent risk & reward</h3>
          <p class="landing-trust-desc">Every skill gets a clear risk score and reward score. You see exactly why we recommend investing or reducing.</p>
        </div>
        <div class="landing-trust-item">
          <div class="landing-trust-icon">${icons.shield(20)}</div>
          <h3 class="landing-trust-title">You stay in control</h3>
          <p class="landing-trust-desc">Edit skills, adjust seasons, override suggestions. The engine gives you data — you make the decisions.</p>
        </div>
      </div>
    </section>

    <section class="landing-cta" aria-label="Call to action">
      <div class="landing-cta-card">
        <h2 class="landing-cta-title">Start investing in the right skills</h2>
        <p class="landing-cta-subtitle">Upload your resume and get AI-powered insights</p>
        <a href="#/onboarding" class="btn btn-lg" id="cta-upload">Upload Resume & Analyze</a>
      </div>
    </section>

    <footer class="landing-footer" role="contentinfo">
      <span>© 2026 SkillFolio. All rights reserved.</span>
      <div class="landing-footer-links">
        <a href="#" id="footer-privacy">Privacy Policy</a>
        <a href="#" id="footer-terms">Terms of Service</a>
        <a href="#" id="footer-contact">Contact</a>
      </div>
    </footer>
  </div>`;
}

function renderMockDashboard() {
  return `
    <div style="font-size:11px; color:var(--text-tertiary); margin-bottom:12px; font-weight:600; text-transform:uppercase; letter-spacing:0.5px;">Your Skill Portfolio</div>
    <div style="display:flex; gap:12px; margin-bottom:16px;">
      <div style="flex:1; background:var(--bg-primary); border-radius:8px; padding:10px;">
        <div style="font-size:10px; color:var(--text-tertiary);">Weekly Hours</div>
        <div style="font-size:18px; font-weight:700; color:var(--text-primary);">18</div>
      </div>
      <div style="flex:1; background:var(--bg-primary); border-radius:8px; padding:10px;">
        <div style="font-size:10px; color:var(--text-tertiary);">Active Skills</div>
        <div style="font-size:18px; font-weight:700; color:var(--text-primary);">12</div>
      </div>
      <div style="flex:1; background:var(--bg-primary); border-radius:8px; padding:10px;">
        <div style="font-size:10px; color:var(--text-tertiary);">Focus</div>
        <div style="font-size:18px; font-weight:700; color:var(--accent-primary);">Full-Stack</div>
      </div>
    </div>
    <div style="display:flex; gap:8px; margin-bottom:12px;">
      ${['React', 'Node.js', 'AWS'].map(s => `<span style="padding:3px 8px; background:var(--invest-bg); color:var(--invest); border-radius:20px; font-size:10px; font-weight:600;">▲ ${s}</span>`).join('')}
      <span style="padding:3px 8px; background:var(--hold-bg); color:var(--hold); border-radius:20px; font-size:10px; font-weight:600;">● Python</span>
    </div>
    <div style="display:flex; gap:4px; height:24px; border-radius:6px; overflow:hidden;">
      <div style="flex:33; background:var(--chart-1);"></div>
      <div style="flex:33; background:var(--chart-2);"></div>
      <div style="flex:17; background:var(--chart-3);"></div>
      <div style="flex:10; background:var(--chart-4);"></div>
      <div style="flex:7; background:var(--chart-5);"></div>
    </div>
    <div style="display:flex; justify-content:space-between; font-size:9px; color:var(--text-tertiary); margin-top:4px;">
      <span>Frontend 33%</span><span>Backend 33%</span><span>Cloud 17%</span><span>Data 10%</span>
    </div>`;
}
