// Security Main Script - Centralized Resource Loader with Security Checks
// Hosted on Vercel: https://eldrex.vercel.app/security-main.js

// Configuration
const CONFIG = {
    ALLOWED_DOMAINS: ['eldrex.neocities.org', 'eldrex.vercel.app'],
    RESOURCES: {
        CSS: 'https://eldrex.vercel.app/css/main.css',
        JS: 'https://eldrex.vercel.app/functions/main.js'
    },
    VERSION: '1.0.0-' + Date.now(), // Cache busting
    INTEGRITY: {
        CSS: 'sha256-5pJalBz5Xwl5P5+5e5e5e5e5e5e5e5e5e5e5e5e5e5e5=', // Replace with actual hash
        JS: 'sha256-5pJalBz5Xwl5P5+5e5e5e5e5e5e5e5e5e5e5e5e5e5e5='  // Replace with actual hash
    }
};

// Environment Checks
function isEnvironmentSecure() {
    try {
        // Check if running in a secure context (HTTPS)
        if (!window.isSecureContext) {
            console.error('[Security] Page must be served over HTTPS');
            return false;
        }

        // Check if running in an iframe
        if (window.self !== window.top) {
            console.error('[Security] Page cannot be framed');
            return false;
        }

        // Check if running on localhost
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            console.error('[Security] Page cannot run on localhost');
            return false;
        }

        // Check allowed domains
        const currentDomain = window.location.hostname;
        if (!CONFIG.ALLOWED_DOMAINS.includes(currentDomain)) {
            console.error('[Security] Unauthorized domain:', currentDomain);
            return false;
        }

        return true;
    } catch (e) {
        console.error('[Security] Environment check failed:', e);
        return false;
    }
}

// Resource Injection
function injectResources() {
    if (!isEnvironmentSecure()) {
        // Fallback or error handling
        document.body.innerHTML = '<div style="padding:20px;font-family:sans-serif;text-align:center;">' +
            '<h2>Security Error</h2>' +
            '<p>This application cannot be loaded in the current environment.</p>' +
            '<p>Please visit <a href="https://eldrex.neocities.org">eldrex.neocities.org</a> directly.</p>' +
            '</div>';
        return;
    }

    // Inject CSS with SRI
    const cssLink = document.createElement('link');
    cssLink.rel = 'stylesheet';
    cssLink.href = CONFIG.RESOURCES.CSS + '?v=' + CONFIG.VERSION;
    cssLink.crossOrigin = 'anonymous';
    cssLink.integrity = CONFIG.INTEGRITY.CSS;
    cssLink.onerror = () => console.error('[Security] Failed to load CSS');
    document.head.appendChild(cssLink);

    // Inject JS with SRI
    const jsScript = document.createElement('script');
    jsScript.src = CONFIG.RESOURCES.JS + '?v=' + CONFIG.VERSION;
    jsScript.crossOrigin = 'anonymous';
    jsScript.integrity = CONFIG.INTEGRITY.JS;
    jsScript.onerror = () => console.error('[Security] Failed to load JS');
    document.body.appendChild(jsScript);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Add CSP meta tag dynamically (additional layer)
    const cspMeta = document.createElement('meta');
    cspMeta.httpEquiv = 'Content-Security-Policy';
    cspMeta.content = "default-src 'self'; " +
        "script-src 'self' https://eldrex.vercel.app 'unsafe-inline'; " +
        "style-src 'self' https://eldrex.vercel.app 'unsafe-inline'; " +
        "img-src 'self' data: https://*; " +
        "connect-src 'self' https://*; " +
        "frame-ancestors 'none';";
    document.head.appendChild(cspMeta);

    injectResources();
});

// Prevent right-click and other common inspection methods
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    return false;
});

document.addEventListener('keydown', (e) => {
    // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
    if (e.key === 'F12' || 
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J')) || 
        (e.ctrlKey && e.key === 'u')) {
        e.preventDefault();
        return false;
    }
});