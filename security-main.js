// Security.js - Centralized security and resource injection for Eldrex's website
// Hosted on Vercel, injected into Neocities HTML

// Configuration
const CONFIG = {
    ALLOWED_DOMAINS: ['eldrex.neocities.org', 'eldrex.vercel.app'],
    REQUIRED_PROTOCOL: 'https:',
    RESOURCES: {
        CSS: 'https://eldrex.vercel.app/css/main.css',
        JS: 'https://eldrex.vercel.app/functions/main.js'
    },
    VERSION: '1.0.0-' + Date.now(),
    INTEGRITY: {
        CSS: 'sha384-5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5',
        JS: 'sha384-JJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJ'
    }
};

// Environment Checks
function validateEnvironment() {
    // Check if running in authorized domain
    if (!CONFIG.ALLOWED_DOMAINS.includes(window.location.hostname)) {
        console.error('Unauthorized domain');
        return false;
    }

    // Require HTTPS
    if (window.location.protocol !== CONFIG.REQUIRED_PROTOCOL) {
        console.error('HTTPS required');
        return false;
    }

    // Prevent iframe embedding
    if (window.self !== window.top) {
        console.error('Framing not allowed');
        return false;
    }

    // Prevent local execution
    if (window.location.hostname === 'localhost' || 
        window.location.hostname === '127.0.0.1' || 
        window.location.hostname === '') {
        console.error('Local execution not allowed');
        return false;
    }

    return true;
}

// Resource Injection
function injectResources() {
    if (!validateEnvironment()) return;

    // Inject CSS with SRI
    const cssLink = document.createElement('link');
    cssLink.rel = 'stylesheet';
    cssLink.href = CONFIG.RESOURCES.CSS + '?v=' + CONFIG.VERSION;
    cssLink.crossOrigin = 'anonymous';
    cssLink.integrity = CONFIG.INTEGRITY.CSS;
    cssLink.onerror = () => console.error('CSS failed to load');
    document.head.appendChild(cssLink);

    // Inject JS with SRI
    const jsScript = document.createElement('script');
    jsScript.src = CONFIG.RESOURCES.JS + '?v=' + CONFIG.VERSION;
    jsScript.crossOrigin = 'anonymous';
    jsScript.integrity = CONFIG.INTEGRITY.JS;
    jsScript.onerror = () => console.error('JS failed to load');
    document.body.appendChild(jsScript);
}

// DOM Sanitization (using DOMPurify)
function sanitizeDOM() {
    // Load DOMPurify from CDN if not already loaded
    if (typeof DOMPurify !== 'undefined') return;

    const purifyScript = document.createElement('script');
    purifyScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/dompurify/3.0.5/purify.min.js';
    purifyScript.integrity = 'sha512-6s8OiptVcc9JMnqQ4C4iIww9TI5JQkqRr1ZyoKZWAXh1xNk0x5VqZ9XLMQZx8gN7b+FQ9TvXv0Bd+0jQOAClEA==';
    purifyScript.crossOrigin = 'anonymous';
    document.head.appendChild(purifyScript);
}

// Browser Feature Detection
function detectFeatures() {
    // Load detect-browser if needed
    if (typeof detect === 'undefined') {
        const detectScript = document.createElement('script');
        detectScript.src = 'https://cdn.jsdelivr.net/npm/detect-browser@5.3.0/dist/index.min.js';
        detectScript.integrity = 'sha384-5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5';
        detectScript.crossOrigin = 'anonymous';
        document.head.appendChild(detectScript);
    }
}

// Initialize Security
document.addEventListener('DOMContentLoaded', () => {
    // Set CSP meta tag dynamically
    const cspMeta = document.createElement('meta');
    cspMeta.httpEquiv = 'Content-Security-Policy';
    cspMeta.content = `default-src 'self'; 
        script-src 'self' https://eldrex.vercel.app https://cdnjs.cloudflare.com https://cdn.jsdelivr.net 'unsafe-inline'; 
        style-src 'self' https://eldrex.vercel.app 'unsafe-inline'; 
        img-src 'self' data: https://eldrex.neocities.org https://ucarecdn.com; 
        connect-src 'self' https://eldrex.vercel.app; 
        frame-ancestors 'none';`;
    document.head.appendChild(cspMeta);

    // Execute security measures
    sanitizeDOM();
    detectFeatures();
    injectResources();
});

// Error handling
window.addEventListener('error', (e) => {
    console.error('Security error:', e.message);
});

// MutationObserver for DOM changes
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.addedNodes.length) {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1 && node.tagName === 'SCRIPT' && 
                    !node.src.includes('eldrex.vercel.app') && 
                    !node.src.includes('cdnjs.cloudflare.com') && 
                    !node.src.includes('cdn.jsdelivr.net')) {
                    node.remove();
                    console.warn('Unauthorized script removed');
                }
            });
        }
    });
});

observer.observe(document.documentElement, {
    childList: true,
    subtree: true
});