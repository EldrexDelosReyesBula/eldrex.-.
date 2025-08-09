/**
 * security-main.js - Main Page Security for Eldrex Neocities
 * Version 1.0.3
 */

// Shared configuration (must match in both files)
const SHARED_CONFIG = {
  allowedDomains: ['eldrex.neocities.org', 'eldrex.vercel.app'],
  blockedUrl: 'https://eldrex.vercel.app/blocked.html',
  version: '1.0.3'
};

// Main page specific configuration
const MAIN_CONFIG = {
  css: {
    primary: 'https://eldrex.vercel.app/css/main.css',
    fallback: 'https://cdn.jsdelivr.net/npm/normalize.css@8.0.1/normalize.min.css'
  },
  js: {
    primary: 'https://eldrex.vercel.app/functions/main.js',
    fallback: 'https://cdn.jsdelivr.net/npm/umbrellajs@3.3.3/umbrella.min.js',
    dependencies: [
      'https://cdn.jsdelivr.net/npm/umbrellajs@3.3.3/umbrella.min.js'
    ]
  }
};

// Security check function (reusable)
function performSecurityChecks() {
  const currentEnv = {
    domain: window.location.hostname,
    protocol: window.location.protocol,
    path: window.location.pathname,
    isEmbedded: window.self !== window.top,
    isDirectAccess: /security-(main|about)\.js\/?$/.test(window.location.pathname)
  };

  const isValid = (
    SHARED_CONFIG.allowedDomains.includes(currentEnv.domain) &&
    currentEnv.protocol === 'https:' &&
    !currentEnv.isEmbedded &&
    !currentEnv.isDirectAccess
  );

  return { isValid, currentEnv };
}

// Resource loader with retry logic
async function loadResources(resources) {
  const loadWithRetry = async (url, retries = 2) => {
    try {
      if (url.endsWith('.js')) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = url;
          script.onload = resolve;
          script.onerror = reject;
          document.body.appendChild(script);
        });
      } else if (url.endsWith('.css')) {
        await new Promise((resolve, reject) => {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = url;
          link.onload = resolve;
          link.onerror = reject;
          document.head.appendChild(link);
        });
      }
    } catch (err) {
      if (retries > 0) {
        await new Promise(r => setTimeout(r, 1000));
        return loadWithRetry(url, retries - 1);
      }
      throw err;
    }
  };

  try {
    // Load dependencies first
    for (const dep of resources.dependencies || []) {
      await loadWithRetry(dep);
    }
    
    // Then load primary resources
    await Promise.all([
      loadWithRetry(resources.css.primary).catch(() => loadWithRetry(resources.css.fallback)),
      loadWithRetry(resources.js.primary).catch(() => loadWithRetry(resources.js.fallback))
    ]);
  } catch (error) {
    console.error('Resource loading failed:', error);
    throw error;
  }
}

// Main execution
(async function() {
  const { isValid, currentEnv } = performSecurityChecks();
  
  if (!isValid) {
    const attempts = sessionStorage.getItem('sec_redirects') || 0;
    if (attempts < 3 && !window.location.href.startsWith(SHARED_CONFIG.blockedUrl)) {
      sessionStorage.setItem('sec_redirects', parseInt(attempts) + 1);
      window.location.href = SHARED_CONFIG.blockedUrl;
    } else {
      document.write('<h1>Access Blocked</h1>');
      document.close();
    }
    return;
  }

  sessionStorage.removeItem('sec_redirects');
  
  // Clean URL
  if (history.replaceState) {
    history.replaceState(null, null, window.location.origin + '/');
  }

  // Load resources
  try {
    await loadResources(MAIN_CONFIG);
    
    // Handle client-side routing
    if (currentEnv.path !== '/' && !currentEnv.path.endsWith('index.html')) {
      const response = await fetch('/index.html').catch(() => null);
      if (response && response.ok) {
        const html = await response.text();
        document.open();
        document.write(html);
        document.close();
      } else {
        window.location.href = '/';
      }
    }
  } catch (error) {
    console.error('Initialization error:', error);
    document.body.innerHTML = `
      <h1>Welcome to Eldrex</h1>
      <p>We're having trouble loading resources.</p>
      <a href="/">Try again</a>
    `;
  }
})();