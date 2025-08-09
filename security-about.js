/**
 * security-about.js - About Page Security for Eldrex Neocities
 * Version 1.0.3
 */

// Shared configuration (must match in both files)
const SHARED_CONFIG = {
  allowedDomains: ['eldrex.neocities.org', 'eldrex.vercel.app'],
  blockedUrl: 'https://eldrex.vercel.app/blocked.html',
  version: '1.0.3'
};

// About page specific configuration
const ABOUT_CONFIG = {
  css: {
    primary: 'https://eldrex.vercel.app/css/about.css',
    fallback: 'https://cdn.jsdelivr.net/npm/normalize.css@8.0.1/normalize.min.css'
  },
  js: {
    primary: 'https://eldrex.vercel.app/functions/about.js',
    fallback: 'https://cdn.jsdelivr.net/npm/umbrellajs@3.3.3/umbrella.min.js',
    dependencies: [
      'https://cdn.jsdelivr.net/npm/umbrellajs@3.3.3/umbrella.min.js'
    ]
  }
};

// Reuse the exact same performSecurityChecks function from security-main.js
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

// Reuse the exact same loadResources function from security-main.js
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
    for (const dep of resources.dependencies || []) {
      await loadWithRetry(dep);
    }
    
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
  
  // About page specific logic
  try {
    await loadResources(ABOUT_CONFIG);
    
    // Ensure we're on about.html
    if (!currentEnv.path.includes('about')) {
      window.location.href = '/about.html';
    }
  } catch (error) {
    console.error('Initialization error:', error);
    document.body.innerHTML = `
      <h1>About Eldrex</h1>
      <p>We're having trouble loading resources.</p>
      <a href="/about.html">Try again</a>
    `;
  }
})();