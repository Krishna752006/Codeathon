// ============================================
// SPA ROUTER — Hash-based routing
// ============================================

const routes = {};
let currentPath = null;
let appEl = null;
let onNavigateCallbacks = [];

export function registerRoute(path, renderFn) {
  routes[path] = renderFn;
}

export function navigate(path) {
  window.location.hash = path;
}

export function onNavigate(cb) {
  onNavigateCallbacks.push(cb);
}

export function getCurrentPath() {
  return currentPath;
}

function matchRoute(hash) {
  const path = hash.replace('#', '') || '/';
  return { path, renderFn: routes[path] || routes['/404'] || routes['/'] };
}

async function handleRoute() {
  const { path, renderFn } = matchRoute(window.location.hash);
  if (path === currentPath) return;
  currentPath = path;

  if (!appEl) appEl = document.getElementById('app');
  
  // Notify navigation listeners
  onNavigateCallbacks.forEach(cb => cb(path));

  if (renderFn) {
    const html = await renderFn();
    appEl.innerHTML = html;
    
    // Add page enter animation
    const pageRoot = appEl.firstElementChild;
    if (pageRoot) pageRoot.classList.add('page-enter');

    // Dispatch custom event for page scripts to bind
    window.dispatchEvent(new CustomEvent('page:mounted', { detail: { path } }));
  }
}

export function initRouter() {
  window.addEventListener('hashchange', handleRoute);
  window.addEventListener('load', handleRoute);
  // Initial route
  if (!window.location.hash) {
    window.location.hash = '#/';
  } else {
    handleRoute();
  }
}
