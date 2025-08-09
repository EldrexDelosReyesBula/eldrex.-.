/**
 * Enhanced Security.js for Eldrex Neocities
 * With fallbacks, error handling, and performance optimizations
 */

// Load tiny libraries from CDN with fallbacks
const loadScript = (url, integrity, fallback) => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = url;
    if (integrity) script.integrity = integrity;
    script.crossOrigin = 'anonymous';
    script.onload = resolve;
    script.onerror = () => {
      if (fallback) {
        const fallbackScript = document.createElement('script');
        fallbackScript.src = fallback;
        document.head.appendChild(fallbackScript);
        fallbackScript.onload = resolve;
        fallbackScript.onerror = reject;
      } else {
        reject();
      }
    };
    document.head.appendChild(script);
  });
};

const loadStyle = (url, fallback) => {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;
    link.onload = resolve;
    link.onerror = () => {
      if (fallback) {
        const fallbackLink = document.createElement('link');
        fallbackLink.rel = 'stylesheet';
        fallbackLink.href = fallback;
        document.head.appendChild(fallbackLink);
        fallbackLink.onload = resolve;
        fallbackLink.onerror = reject;
      } else {
        reject();
      }
    };
    document.head.appendChild(link);
  });
};

// Main security function wrapped in IIFE
(function() {
  // Configuration with fallbacks
  const CONFIG = {
    allowedDomains: ['eldrex.neocities.org', 'eldrex.vercel.app'],
    blockedUrl: 'https://eldrex.vercel.app/blocked.html',
    resources: {
      js: {
        main: [
          'https://cdn.jsdelivr.net/npm/umbrellajs@3.3.3/umbrella.min.js',
          'https://eldrex.vercel.app/functions/main.js'
        ],
        about: [
          'https://cdn.jsdelivr.net/npm/umbrellajs@3.3.3/umbrella.min.js',
          'https://eldrex.vercel.app/functions/about.js'
        ],
        security: 'https://eldrex.vercel.app/security.js'
      },
      css: {
        main: 'https://eldrex.vercel.app/css/main.css',
        about: 'https://eldrex.vercel.app/css/about.css'
      },
      fallbacks: {
        js: {
          main: 'https://cdn.jsdelivr.net/gh/franciscop/umbrella@3.3.3/umbrella.min.js',
          about: 'https://cdn.jsdelivr.net/gh/franciscop/umbrella@3.3.3/umbrella.min.js'
        },
        css: {
          main: 'https://cdn.jsdelivr.net/npm/normalize.css@8.0.1/normalize.min.css',
          about: 'https://cdn.jsdelivr.net/npm/normalize.css@8.0.1/normalize.min.css'
        }
      }
    },
    version: '1.0.2'
  };

  // Current environment checks
  const currentEnv = {
    domain: window.location.hostname,
    protocol: window.location.protocol,
    path: window.location.pathname,
    isEmbedded: window.self !== window.top,
    isDirectAccess: /security\.js\/?$/.test(window.location.pathname),
    isAboutPage: /about\.html|about\/?$/.test(window.location.pathname)
  };

  // Security validation
  const securityChecks = {
    isAllowedDomain: CONFIG.allowedDomains.includes(currentEnv.domain),
    isHTTPS: currentEnv.protocol === 'https:',
    isValidAccess: function() {
      return this.isAllowedDomain && this.isHTTPS && 
             !currentEnv.isEmbedded && !currentEnv.isDirectAccess;
    }
  };

  // Block unauthorized access with multiple checks
  if (!securityChecks.isValidAccess()) {
    if (!window.location.href.startsWith(CONFIG.blockedUrl)) {
      // Store attempt in sessionStorage to prevent loops
      const redirectAttempts = sessionStorage.getItem('redirectAttempts') || 0;
      if (redirectAttempts < 3) {
        sessionStorage.setItem('redirectAttempts', parseInt(redirectAttempts) + 1);
        window.location.href = CONFIG.blockedUrl;
      } else {
        document.write('<h1>Access Blocked</h1><p>Too many redirect attempts</p>');
        document.close();
      }
    }
    return;
  }

  // Reset redirect attempts on valid access
  sessionStorage.removeItem('redirectAttempts');

  // Main functionality for valid access
  document.addEventListener('DOMContentLoaded', async function() {
    try {
      // Clean URL
      if (history.replaceState) {
        history.replaceState(null, null, window.location.origin + '/');
      }

      // Load CSS with fallback
      const cssUrl = currentEnv.isAboutPage ? CONFIG.resources.css.about : CONFIG.resources.css.main;
      const cssFallback = currentEnv.isAboutPage ? CONFIG.fallbacks.css.about : CONFIG.fallbacks.css.main;
      
      await loadStyle(cssUrl, cssFallback).catch(err => {
        console.error('Failed to load main CSS, using fallback', err);
      });

      // Load JS with fallback
      const jsUrls = currentEnv.isAboutPage ? CONFIG.resources.js.about : CONFIG.resources.js.main;
      const jsFallback = currentEnv.isAboutPage ? CONFIG.fallbacks.js.about : CONFIG.fallbacks.js.main;
      
      // Load umbrella.js first (lightweight jQuery alternative)
      await loadScript(jsUrls[0], 'sha256-xyz', jsFallback);
      // Then load page-specific JS
      await loadScript(jsUrls[1]).catch(err => {
        console.error('Failed to load page-specific JS', err);
      });

      // Handle client-side routing for non-about pages
      if (!currentEnv.isAboutPage && currentEnv.path !== '/' && !currentEnv.path.endsWith('index.html')) {
        try {
          const response = await fetch('/index.html');
          if (response.ok) {
            const html = await response.text();
            document.open();
            document.write(html);
            document.close();
          } else {
            window.location.href = '/';
          }
        } catch (error) {
          window.location.href = '/';
        }
      }
    } catch (error) {
      console.error('Initialization error:', error);
      // Basic fallback content if everything fails
      if (!document.body.innerHTML.trim()) {
        document.body.innerHTML = `
          <h1>Welcome to Eldrex</h1>
          <p>Sorry, we're having trouble loading resources.</p>
          <a href="/">Try again</a>
        `;
      }
    }
  });

  // Additional security measures
  window.addEventListener('load', function() {
    // Prevent embedding
    if (window.self !== window.top) {
      window.top.location = window.self.location;
    }

    // Force HTTPS (redundant check)
    if (location.protocol !== 'https:') {
      location.replace(`https:${location.href.substring(location.protocol.length)}`);
    }
  });
})();