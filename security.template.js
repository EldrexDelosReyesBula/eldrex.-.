// Security.js - Auto-generated with integrity hashes
const CONFIG = {
    ALLOWED_DOMAINS: ['eldrex.neocities.org'],
    REQUIRED_PROTOCOL: 'https:',
    RESOURCES: {
        CSS: 'https://eldrex.vercel.app/css/main.css',
        JS: 'https://eldrex.vercel.app/functions/main.js'
    },
    INTEGRITY: {
        CSS: 'sha3-384-{{CSS_HASH}}',
        JS: 'sha3-384-{{JS_HASH}}'
    },
    VERSION: '1.0.0-' + Date.now()
};

// Environment validation
function validateEnvironment() {
    if (!CONFIG.ALLOWED_DOMAINS.includes(window.location.hostname)) {
        console.error('Unauthorized domain');
        return false;
    }
    if (window.location.protocol !== CONFIG.REQUIRED_PROTOCOL) {
        console.error('HTTPS required');
        return false;
    }
    if (window.self !== window.top) {
        console.error('Framing not allowed');
        return false;
    }
    if (['localhost', '127.0.0.1', ''].includes(window.location.hostname)) {
        console.error('Local execution not allowed');
        return false;
    }
    return true;
}

// Resource injection with retry logic
function injectResource(url, integrity, elementType, attributes = {}) {
    return new Promise((resolve, reject) => {
        const element = document.createElement(elementType);
        element.src = element.href = url + '?v=' + CONFIG.VERSION;
        element.integrity = integrity;
        element.crossOrigin = 'anonymous';
        
        Object.entries(attributes).forEach(([key, value]) => {
            element[key] = value;
        });

        element.onload = () => resolve();
        element.onerror = () => {
            console.error(`Failed to load ${url}`);
            element.remove();
            reject(new Error(`Failed to load ${url}`));
        };

        if (elementType === 'link') {
            element.rel = 'stylesheet';
            document.head.appendChild(element);
        } else {
            document.body.appendChild(element);
        }
    });
}

// Main injection function
async function injectResources() {
    if (!validateEnvironment()) return;

    try {
        // Inject CSS
        await injectResource(
            CONFIG.RESOURCES.CSS,
            CONFIG.INTEGRITY.CSS,
            'link'
        );
        
        // Inject main JS
        await injectResource(
            CONFIG.RESOURCES.JS,
            CONFIG.INTEGRITY.JS,
            'script'
        );
        
        console.log('All resources injected successfully');
    } catch (error) {
        console.error('Resource injection failed:', error);
        // Fallback or error handling could go here
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectResources);
} else {
    injectResources();
}

// Security monitoring
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1 && node.tagName === 'SCRIPT' && 
                !node.src.includes('eldrex.vercel.app')) {
                node.remove();
                console.warn('Unauthorized script removed');
            }
        });
    });
});

observer.observe(document.documentElement, {
    childList: true,
    subtree: true
});

// Error handling
window.addEventListener('error', (e) => {
    console.error('Security error:', e.message);
});