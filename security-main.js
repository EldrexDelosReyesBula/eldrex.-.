/**
 * LanDecs Security Module v1.1
 * Enhanced with better error handling and fallback mechanisms
 */

(function() {
    'use strict';

    // Configuration - Update these when files change
    const CONFIG = {
        allowedDomains: ['eldrex.neocities.org', 'eldrex.vercel.app', 'localhost'],
        cssUrl: 'https://eldrex.vercel.app/css/main.css',
        jsUrl: 'https://eldrex.vercel.app/functions/main.js',
        // Generate these hashes using: openssl dgst -sha256 -binary FILENAME | openssl base64 -A
        cssIntegrity: 'sha256-2QNx4QqBQkMmvhQmRZ1nQxS9XmZwQ6KTHyJQlY7X5o=',
        jsIntegrity: 'sha256-9QnXjQjQkMmvhQmRZ1nQxS9XmZwQ6KTHyJQlY7X5o=',
        version: '1.1.0-' + Date.now(),
        debug: true // Set to false in production
    };

    // Enhanced security initialization
    function initializeSecurity() {
        try {
            if (!runEnvironmentChecks()) {
                displayErrorFallback();
                return;
            }

            // First attempt to load CSS
            loadCSS().then(() => {
                // Then load JS after CSS is loaded
                return loadJS();
            }).then(() => {
                if (CONFIG.debug) console.log('[LanDecs] All resources loaded successfully');
                initApplication();
            }).catch(error => {
                console.error('[LanDecs] Resource loading failed:', error);
                attemptFallbackLoading();
            });

        } catch (error) {
            console.error('[LanDecs] Initialization error:', error);
            displayErrorFallback();
        }
    }

    // Environment checks with detailed validation
    function runEnvironmentChecks() {
        // Check if running in a browser
        if (typeof window === 'undefined' || typeof document === 'undefined') {
            throw new Error('Unsupported environment');
        }

        // Verify domain
        const currentDomain = window.location.hostname;
        const domainAllowed = CONFIG.allowedDomains.some(domain => 
            currentDomain === domain || currentDomain.endsWith('.' + domain)
        );

        if (!domainAllowed) {
            throw new Error(`Domain ${currentDomain} not authorized`);
        }

        // Check for essential browser features
        const features = [
            'Promise' in window,
            'createElement' in document,
            'head' in document,
            'appendChild' in document.createElement('div')
        ];

        if (features.some(feature => !feature)) {
            throw new Error('Browser lacks required features');
        }

        return true;
    }

    // CSS loading with retry logic
    function loadCSS() {
        return new Promise((resolve, reject) => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = CONFIG.cssUrl + '?v=' + CONFIG.version;
            link.crossOrigin = 'anonymous';
            link.integrity = CONFIG.cssIntegrity;
            link.referrerPolicy = 'no-referrer';

            link.onload = () => {
                if (CONFIG.debug) console.log('[LanDecs] CSS loaded successfully');
                resolve();
            };

            link.onerror = () => {
                console.error('[LanDecs] CSS loading failed');
                reject(new Error('CSS load failed'));
            };

            document.head.appendChild(link);
        });
    }

    // JS loading with retry logic
    function loadJS() {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = CONFIG.jsUrl + '?v=' + CONFIG.version;
            script.async = true;
            script.defer = true;
            script.crossOrigin = 'anonymous';
            script.integrity = CONFIG.jsIntegrity;
            script.referrerPolicy = 'no-referrer';

            script.onload = () => {
                if (CONFIG.debug) console.log('[LanDecs] JS loaded successfully');
                resolve();
            };

            script.onerror = () => {
                console.error('[LanDecs] JS loading failed');
                reject(new Error('JS load failed'));
            };

            document.head.appendChild(script);
        });
    }

    // Fallback loading attempt without integrity checks
    function attemptFallbackLoading() {
        console.warn('[LanDecs] Attempting fallback resource loading');
        
        const fallbackCSS = document.createElement('link');
        fallbackCSS.rel = 'stylesheet';
        fallbackCSS.href = CONFIG.cssUrl + '?v=' + CONFIG.version + '&fallback=1';
        fallbackCSS.onload = () => {
            console.warn('[LanDecs] Fallback CSS loaded');
            const fallbackJS = document.createElement('script');
            fallbackJS.src = CONFIG.jsUrl + '?v=' + CONFIG.version + '&fallback=1';
            fallbackJS.onload = () => {
                console.warn('[LanDecs] Fallback JS loaded');
                initApplication();
            };
            fallbackJS.onerror = displayErrorFallback;
            document.head.appendChild(fallbackJS);
        };
        fallbackCSS.onerror = displayErrorFallback;
        document.head.appendChild(fallbackCSS);
    }

    // Initialize application after resources load
    function initApplication() {
        // Ensure footer is shown
        const footer = document.getElementById('pageFooter');
        if (footer) {
            footer.style.transform = 'translateY(0)';
            footer.style.opacity = '1';
        }

        // Add any other initialization logic here
    }

    // Enhanced error display
    function displayErrorFallback() {
        // Remove any existing error messages
        const existingError = document.querySelector('.security-error');
        if (existingError) existingError.remove();

        // Create error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'security-error';
        errorDiv.innerHTML = `
            <div style="
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                background: #ff4444;
                color: white;
                padding: 15px;
                text-align: center;
                z-index: 9999;
                font-family: Arial, sans-serif;
                box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                border-bottom: 1px solid #ff0000;
            ">
                <strong>Security Alert:</strong> There was an issue loading required resources.<br>
                Please <a href="${window.location.href}" style="color: white; text-decoration: underline;">refresh the page</a> or try again later.
                ${CONFIG.debug ? '<br><small>Debug: Resource loading failed</small>' : ''}
            </div>
        `;

        document.body.insertBefore(errorDiv, document.body.firstChild);

        // Add basic styles if CSS failed to load
        const fallbackStyles = document.createElement('style');
        fallbackStyles.textContent = `
            body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
            a { color: #0071e3; text-decoration: none; }
            .link-item { display: block; margin: 10px 0; padding: 10px; border: 1px solid #ddd; border-radius: 8px; }
            .container { max-width: 600px; margin: 20px auto; padding: 0 15px; }
        `;
        document.head.appendChild(fallbackStyles);
    }

    // Initialize when DOM is ready
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(initializeSecurity, 0);
    } else {
        document.addEventListener('DOMContentLoaded', initializeSecurity);
    }

    // Add CSP meta tag dynamically
    const cspMeta = document.createElement('meta');
    cspMeta.httpEquiv = 'Content-Security-Policy';
    cspMeta.content = `
        default-src 'self';
        script-src 'self' https://eldrex.vercel.app 'unsafe-inline';
        style-src 'self' https://eldrex.vercel.app 'unsafe-inline';
        img-src 'self' data: https://*.neocities.org https://*.vercel.app https://ucarecdn.com;
        font-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com https://cdnjs.cloudflare.com;
        connect-src 'self' https://eldrex.vercel.app;
        frame-src 'none';
        object-src 'none';
    `.replace(/\n/g, '').replace(/\s{2,}/g, ' ').trim();
    document.head.appendChild(cspMeta);

})();