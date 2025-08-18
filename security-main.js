// secure-injector.js - Balanced Secure Script Loader
(function() {
    // Domain Verification System
    class DomainVerifier {
        constructor() {
            this.authorizedDomains = [
                'eldrex.landecs.org',
                'eldrex.neocities.org',
                'eldrex.vercel.app',
                'localhost',       // Added for local development
                '127.0.0.1'       // Added for local testing
            ];
        }

        verifyDomain(hostname) {
            const host = hostname.toLowerCase();
            
            // Check exact matches
            if (this.authorizedDomains.includes(host)) {
                return true;
            }

            // Check subdomains of authorized domains
            for (const domain of this.authorizedDomains) {
                if (host.endsWith('.' + domain)) {
                    return true;
                }
            }

            // Allow local network addresses (192.168.x.x, 10.x.x.x)
            if (/^(192\.168\.|10\.|172\.(1[6-9]|2[0-9]|3[0-1])\.)/.test(host)) {
                console.log('Local network access allowed for development');
                return true;
            }

            return false;
        }
    }

    // Environment Security Checker (relaxed version)
    class EnvironmentChecker {
        static isSecureEnvironment() {
            // Allow both http and https for local development
            if (window.location.hostname === 'localhost' || 
                window.location.hostname === '127.0.0.1') {
                return true;
            }

            // Require HTTPS for production domains
            if (window.location.protocol !== 'https:') {
                console.warn('Non-HTTPS connection detected');
                return false;
            }

            // Allow iframes only for local development
            if (window.self !== window.top) {
                try {
                    window.parent.location.origin;
                    return window.location.hostname === 'localhost' || 
                           window.location.hostname === '127.0.0.1';
                } catch (e) {
                    return false;
                }
            }

            return true;
        }
    }

    // Main Verification Flow (relaxed)
    const verifier = new DomainVerifier();
    const isAuthorized = verifier.verifyDomain(window.location.hostname);
    const isSecure = EnvironmentChecker.isSecureEnvironment();

    if (!isAuthorized || !isSecure) {
        console.warn(`Access restricted - Authorized: ${isAuthorized}, Secure: ${isSecure}`);
        
        // For unauthorized domains, just prevent injection without redirect
        if (!isAuthorized && !/^(localhost|127\.0\.0\.1|192\.168\.|10\.)/.test(window.location.hostname)) {
            document.documentElement.innerHTML = '<h1>Unauthorized Domain</h1>';
            return;
        }
        
        // For security issues on local/dev, just warn but allow
        console.warn('Proceeding with insecure environment for development');
    }

    // Secure Script Injection
    const injectScript = () => {
        const script = document.createElement('script');
        script.src = 'https://eldrex.vercel.app/functions/main.js';
        script.type = 'module';
        script.defer = true;
        
        // Only enforce CORS and integrity in production
        if (!['localhost', '127.0.0.1'].includes(window.location.hostname)) {
            script.crossOrigin = 'anonymous';
            script.integrity = 'sha384-7r7QCYk1zw/MzUaYyaEDYVXLPoRN27Mpkgs61aFIIxX09YwKDwUAaSom+y68Vlkz';
        }

        // Fallback loading
        script.onerror = function() {
            console.warn('Primary CDN failed, trying fallback...');
            const fallback = document.createElement('script');
            fallback.src = 'https://eldrex.vercel.app/functions/main.js';
            fallback.type = 'module';
            fallback.defer = true;
            document.head.appendChild(fallback);
        };

        document.head.appendChild(script);
    };

    // Execute injection
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(injectScript, 0);
    } else {
        document.addEventListener('DOMContentLoaded', injectScript);
    }

    // Lightweight DOM protection
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.tagName === 'SCRIPT' && 
                    node.src.includes('main.js') && 
                    node !== document.currentScript) {
                    console.warn('Duplicate script injection detected');
                    node.remove();
                }
            });
        });
    });

    observer.observe(document.head, { childList: true });
})();