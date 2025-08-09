/**
 * security-core.js - Core Security Module for Eldrex
 * Version 1.1.0
 */

class SecurityCore {
  constructor(config) {
    this.config = {
      ...{
        version: '1.1.0',
        blockedUrl: 'https://eldrex.vercel.app/blocked.html',
        allowedDomains: ['eldrex.neocities.org', 'eldrex.vercel.app'],
        maxRedirectAttempts: 3,
        resourceLoadRetries: 2,
        resourceLoadTimeout: 1000
      },
      ...config
    };

    this.currentEnv = this.analyzeEnvironment();
  }

  analyzeEnvironment() {
    return {
      domain: window.location.hostname,
      protocol: window.location.protocol,
      path: window.location.pathname,
      isEmbedded: window.self !== window.top,
      isDirectAccess: /security-(main|about|core)\.js\/?$/.test(window.location.pathname),
      userAgent: navigator.userAgent
    };
  }

  isValidAccess() {
    return (
      this.config.allowedDomains.includes(this.currentEnv.domain) &&
      this.currentEnv.protocol === 'https:' &&
      !this.currentEnv.isEmbedded &&
      !this.currentEnv.isDirectAccess
    );
  }

  enforceSecurity() {
    if (!this.isValidAccess()) {
      const attempts = sessionStorage.getItem('sec_redirects') || 0;
      if (attempts < this.config.maxRedirectAttempts && 
          !window.location.href.startsWith(this.config.blockedUrl)) {
        sessionStorage.setItem('sec_redirects', parseInt(attempts) + 1);
        window.location.href = this.config.blockedUrl;
      } else {
        this.showBlockedMessage();
      }
      return false;
    }
    sessionStorage.removeItem('sec_redirects');
    return true;
  }

  showBlockedMessage() {
    document.open();
    document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Access Blocked</title>
        <style>
          body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
          h1 { color: #d9534f; }
        </style>
      </head>
      <body>
        <h1>Access Blocked</h1>
        <p>Too many redirect attempts or invalid access.</p>
      </body>
      </html>
    `);
    document.close();
  }

  cleanUrl() {
    if (history.replaceState) {
      const cleanUrl = window.location.origin + '/';
      history.replaceState(null, null, cleanUrl);
    }
  }

  async loadScript(url, integrity = '') {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = url;
      if (integrity) script.integrity = integrity;
      script.crossOrigin = 'anonymous';
      script.onload = resolve;
      script.onerror = reject;
      document.body.appendChild(script);
    });
  }

  async loadStyle(url) {
    return new Promise((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = url;
      link.onload = resolve;
      link.onerror = reject;
      document.head.appendChild(link);
    });
  }

  async loadResourceWithRetry(loader, url, retries = this.config.resourceLoadRetries) {
    try {
      return await loader(url);
    } catch (err) {
      if (retries > 0) {
        await new Promise(r => setTimeout(r, this.config.resourceLoadTimeout));
        return this.loadResourceWithRetry(loader, url, retries - 1);
      }
      throw err;
    }
  }

  async loadPageResources(resources) {
    try {
      // Load dependencies first
      for (const dep of resources.dependencies || []) {
        await this.loadResourceWithRetry(this.loadScript.bind(this), dep.url, dep.retries);
      }

      // Load primary resources
      const loadPromises = [];
      
      if (resources.css) {
        loadPromises.push(
          this.loadResourceWithRetry(this.loadStyle.bind(this), resources.css.primary)
            .catch(() => resources.css.fallback ? 
              this.loadResourceWithRetry(this.loadStyle.bind(this), resources.css.fallback) : 
              Promise.reject())
        );
      }

      if (resources.js) {
        loadPromises.push(
          this.loadResourceWithRetry(this.loadScript.bind(this), resources.js.primary)
            .catch(() => resources.js.fallback ? 
              this.loadResourceWithRetry(this.loadScript.bind(this), resources.js.fallback) : 
              Promise.reject())
        );
      }

      await Promise.all(loadPromises);
    } catch (error) {
      console.error('Resource loading failed:', error);
      throw error;
    }
  }

  showFallbackContent(title, retryUrl) {
    if (!document.body.innerHTML.trim()) {
      document.body.innerHTML = `
        <h1>${title}</h1>
        <p>We're having trouble loading resources.</p>
        <a href="${retryUrl}">Try again</a>
      `;
    }
  }
}

// Export for browser (attaches to window if not using modules)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SecurityCore;
} else {
  window.SecurityCore = SecurityCore;
}