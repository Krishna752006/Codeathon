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

  onNavigateCallbacks.forEach(cb => cb(path));

  if (renderFn) {
    const html = await renderFn();
    appEl.innerHTML = html;

    const pageRoot = appEl.firstElementChild;
    if (pageRoot) pageRoot.classList.add('page-enter');

    window.dispatchEvent(new CustomEvent('page:mounted', { detail: { path } }));
  }
}

export function initRouter() {
  window.addEventListener('hashchange', handleRoute);
  window.addEventListener('load', handleRoute);
  if (!window.location.hash) {
    window.location.hash = '#/';
  } else {
    handleRoute();
  }
}
