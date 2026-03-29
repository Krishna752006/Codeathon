// ============================================
// MAIN — Entry point
// ============================================
import './styles/tokens.css';
import './styles/reset.css';
import './styles/components.css';
import './styles/layout.css';
import './styles/pages.css';

import { registerRoute, initRouter } from './router.js';

// Page modules
import { renderLanding } from './pages/landing.js';
import { renderOnboarding, bindOnboarding } from './pages/onboarding.js';

// Register routes
registerRoute('/', () => renderLanding());
registerRoute('/onboarding', () => renderOnboarding());

// Bind page interactions after mount
window.addEventListener('page:mounted', (e) => {
  const path = e.detail.path;

  // Bind page-specific interactions
  switch (path) {
    case '/onboarding': bindOnboarding(); break;
  }
});

// Initialize
initRouter();
