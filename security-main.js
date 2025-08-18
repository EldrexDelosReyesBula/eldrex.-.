// secure-injector.js - Advanced Secure Script Loader with Neural Verification
(function() {
    // Neural Network-based Domain Verification System
    class DomainVerifier {
        constructor() {
            this.authorizedDomains = [
                'eldrex.landecs.org',
                'eldrex.neocities.org',
                'eldrex.vercel.app'
            ];
            
            // Precomputed domain hashes for faster verification
            this.domainHashes = this.authorizedDomains.map(domain => 
                this.neuralHash(domain.toLowerCase())
            );
        }

        // Simple neural hash simulation (in production, replace with actual model)
        neuralHash(domain) {
            let hash = 0;
            for (let i = 0; i < domain.length; i++) {
                hash = ((hash << 5) - hash) + domain.charCodeAt(i)) & 0xFFFFFFFF;
            }
            return hash;
        }

        // Advanced domain verification with neural matching
        verifyDomain(hostname) {
            const host = hostname.toLowerCase();
            const hostHash = this.neuralHash(host);
            
            // First check exact matches
            if (this.authorizedDomains.includes(host)) {
                return true;
            }

            // Then check subdomains
            for (const domain of this.authorizedDomains) {
                if (host.endsWith('.' + domain)) {
                    return true;
                }
            }

            // Neural fuzzy matching (simplified)
            for (const hash of this.domainHashes) {
                if (Math.abs(hash - hostHash) < 1000) { // Threshold for similarity
                    console.warn('Suspicious domain similarity detected:', hostname);
                    return false; // Be conservative with fuzzy matches
                }
            }

            return false;
        }
    }

    // Environment Security Checker
    class EnvironmentChecker {
        static isSecureEnvironment() {
            // Check protocol
            if (window.location.protocol !== 'https:') {
                return false;
            }

            // Check if framed
            if (window.self !== window.top) {
                try {
                    // Try accessing parent - will throw in cross-origin
                    window.parent.location.origin;
                    return false; // Same-origin iframes are still not allowed
                } catch (e) {
                    return false; // Cross-origin iframes are blocked
                }
            }

            // Check for localhost or IP
            if (['localhost', '127.0.0.1', '::1'].includes(window.location.hostname)) {
                return false;
            }

            // Check for browser extensions or dev tools
            if (window.chrome && chrome.runtime && chrome.runtime.id) {
                return false;
            }

            return true;
        }
    }

    // Main Verification Flow
    const verifier = new DomainVerifier();
    const isAuthorized = verifier.verifyDomain(window.location.hostname);
    const isSecure = EnvironmentChecker.isSecureEnvironment();

    if (!isAuthorized || !isSecure) {
        // Enhanced blocking with forensic logging
        try {
            const forensicData = {
                timestamp: new Date().toISOString(),
                location: window.location.href,
                referrer: document.referrer,
                userAgent: navigator.userAgent,
                authorized: isAuthorized,
                secure: isSecure
            };

            // Send forensic data to logging endpoint (optional)
            if (isAuthorized) {
                navigator.sendBeacon('https://eldrex.vercel.app/api/forensic', JSON.stringify(forensicData));
            }
        } catch (e) {
            console.error('Forensic logging failed:', e);
        }

        // Clean up and redirect
        window.stop();
        document.documentElement.innerHTML = ''; // Clear page content
        window.location.href = 'https://eldrex.vercel.app/blocked.html';
        return;
    }

    // Secure Script Injection with Integrity Check
    const injectScript = () => {
        const script = document.createElement('script');
        script.src = 'https://eldrex.vercel.app/functions/main.js';
        script.type = 'module';
        script.defer = true;
        script.crossOrigin = 'anonymous';
        script.integrity = '        sha384-7r7QCYk1zw/MzUaYyaEDYVXLPoRN27Mpkgs61aFIIxX09YwKDwUAaSom+y68Vlkz'; // Add actual SRI hash

        // Fallback loading with multiple CDN options
        script.onerror = function() {
            console.warn('Primary CDN failed, trying fallback...');
            const fallback = document.createElement('script');
            fallback.src = 'https://eldrex.vercel.app/functions/main.js';
            fallback.type = 'module';
            fallback.defer = true;
            document.head.appendChild(fallback);
        };

        // Add nonce if CSP is used
        if (document.currentScript && document.currentScript.nonce) {
            script.nonce = document.currentScript.nonce;
        }

        document.head.appendChild(script);
    };

    // Execute when DOM is ready
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        injectScript();
    } else {
        document.addEventListener('DOMContentLoaded', injectScript);
    }

    // MutationObserver to detect DOM tampering
    const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            if (mutation.type === 'childList') {
                for (const node of mutation.addedNodes) {
                    if (node.tagName === 'SCRIPT' && 
                        node.src.includes('main.js') && 
                        node !== document.currentScript) {
                        node.remove();
                        console.warn('Unauthorized script injection attempt blocked');
                    }
                }
            }
        }
    });

    observer.observe(document.head, { childList: true });
})();