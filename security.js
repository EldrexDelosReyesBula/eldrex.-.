/**
 * SECURITY.JS - Eldrex Content Protection System
 * Version: 1.0
 * Author: Eldrex Delos Reyes Bula
 * Protected Domains: eldrex.neocities.org
 * License: https://eldrex.neocities.org/license.html
 */

(function() {
    // ======================
    // SECURITY CONFIGURATION
    // ======================
    const SECURITY_CONFIG = {
        ALLOWED_DOMAINS: [
            'eldrex.neocities.org',
            'www.eldrex.neocities.org'
        ],
        LICENSE_PAGE: 'https://eldrex.neocities.org/license.html',
        MAIN_PAGE: 'https://eldrex.neocities.org',
        FILE_PROTECTION: [
            'security.js',
            'main.js',
            'main.css'
        ],
        EMBED_PROTECTION: true
    };

    // =====================
    // SECURITY VERIFICATION
    // =====================
    function verifyEnvironment() {
        // Block direct access to security.js
        if (window.location.pathname.includes('security.js')) {
            enforceLicenseRedirect();
            return false;
        }

        // Verify domain
        const currentDomain = window.location.hostname;
        const isAllowedDomain = SECURITY_CONFIG.ALLOWED_DOMAINS.some(domain => 
            currentDomain === domain || currentDomain.endsWith('.' + domain)
        );

        if (!isAllowedDomain) {
            enforceLicenseRedirect();
            return false;
        }

        // Enforce HTTPS
        if (window.location.protocol !== 'https:') {
            window.location.href = 'https://' + window.location.host + window.location.pathname;
            return false;
        }

        // Hide all paths (redirect to main page)
        if (window.location.pathname !== '/' && !window.location.pathname.includes('index.html')) {
            window.history.replaceState({}, document.title, '/');
            return true;
        }

        return true;
    }

    // =================
    // SECURITY FEATURES
    // =================
    function enforceLicenseRedirect() {
        window.location.href = SECURITY_CONFIG.LICENSE_PAGE;
    }

    function applyContentProtection() {
        // Anti-copy measures
        const antiCopyCSS = `
            body {
                user-select: none !important;
                -webkit-user-select: none !important;
                -moz-user-select: none !important;
                -ms-user-select: none !important;
            }
            
            img {
                pointer-events: none !important;
            }
        `;
        
        const style = document.createElement('style');
        style.textContent = antiCopyCSS;
        document.head.appendChild(style);

        // Disable right-click
        document.addEventListener('contextmenu', (e) => e.preventDefault());

        // Disable keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && (e.key === 'c' || e.key === 'C' || e.key === 'x' || e.key === 'X' || e.key === 'a' || e.key === 'A') ||
                e.key === 'F12' ||
                (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j'))) {
                e.preventDefault();
            }
        });

        // Prevent selection
        document.addEventListener('selectstart', (e) => e.preventDefault());
        document.addEventListener('selectionchange', () => {
            window.getSelection().removeAllRanges();
        });
    }

    function preventEmbedding() {
        // Frame busting
        if (window.top !== window.self) {
            window.top.location.href = window.self.location.href;
        }

        // X-Frame-Options equivalent
        try {
            document.addEventListener('DOMContentLoaded', () => {
                if (window !== window.top) {
                    window.top.location.href = window.location.href;
                }
            });
        } catch (e) {
            window.location.href = SECURITY_CONFIG.MAIN_PAGE;
        }
    }

    function loadProtectedResources() {
        // Load CSS
        const cssLink = document.createElement('link');
        cssLink.rel = 'stylesheet';
        cssLink.href = '/css/main.css';
        cssLink.onerror = () => {
            console.warn('Failed to load main.css');
            document.head.removeChild(cssLink);
        };
        document.head.appendChild(cssLink);

        // Load main JS
        const jsScript = document.createElement('script');
        jsScript.src = '/functions/main.js';
        jsScript.onerror = () => {
            console.warn('Failed to load main.js');
            document.head.removeChild(jsScript);
        };
        document.head.appendChild(jsScript);
    }

    // ================
    // INITIALIZATION
    // ================
    if (verifyEnvironment()) {
        // Apply security features
        applyContentProtection();
        preventEmbedding();
        
        // Load protected resources
        document.addEventListener('DOMContentLoaded', () => {
            loadProtectedResources();
            
            // Hide loading state
            setTimeout(() => {
                const loadingElement = document.getElementById('loading-container');
                if (loadingElement) {
                    loadingElement.style.opacity = '0';
                    setTimeout(() => {
                        loadingElement.style.display = 'none';
                    }, 500);
                }
            }, 1500);
        });

        // Clean exit transition
        window.addEventListener('beforeunload', () => {
            document.body.style.opacity = '0';
            document.body.style.transition = 'opacity 0.3s ease';
        });
    }

    // =====================
    // ANTI-TAMPERING CHECKS
    // =====================
    setInterval(() => {
        // Check if security.js was modified
        if (typeof verifyEnvironment !== 'function') {
            enforceLicenseRedirect();
        }

        // Check if we're in an iframe (redundant check)
        if (SECURITY_CONFIG.EMBED_PROTECTION && window.top !== window.self) {
            window.top.location.href = window.self.location.href;
        }
    }, 5000);
})();