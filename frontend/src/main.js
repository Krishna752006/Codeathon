import './styles/tokens.css';
import './styles/reset.css';
import './styles/components.css';
import './styles/layout.css';
import './styles/pages.css';

import { registerRoute, initRouter } from './router.js';

import { renderLanding } from './pages/landing.js';
import { renderOnboarding, bindOnboarding } from './pages/onboarding.js';

registerRoute('/', () => renderLanding());
registerRoute('/onboarding', () => renderOnboarding());

window.addEventListener('page:mounted', (e) => {
  const path = e.detail.path;

  switch (path) {
    case '/onboarding': bindOnboarding(); break;
  }
});

initRouter();
