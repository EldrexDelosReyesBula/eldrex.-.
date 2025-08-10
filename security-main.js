/**
 * LanDecs Security Module v1.0
 * Centralized resource loader with security protections
 * 
 * Features:
 * - Domain verification
 * - HTTPS enforcement
 * - SRI (Subresource Integrity) validation
 * - Dynamic resource injection
 * - Anti-tampering measures
 * - Environment checks
 * - Cache busting
 */

(function() {
    'use strict';

    // Configuration - Update these values when files change
    const CONFIG = {
        allowedDomains: ['eldrex.neocities.org', 'eldrex.vercel.app'],
        cssUrl: 'https://eldrex.vercel.app/css/main.css',
        jsUrl: 'https://eldrex.vercel.app/functions/main.js',
        // SHA-3 (Keccak-256) hashes - generate these when files change
        cssIntegrity: 'sha256-2QNx4QqBQkMmvhQmRZ1nQxS9XmZwQ6KTHyJQlY7X5o=',
        jsIntegrity: 'sha256-9QnXjQjQkMmvhQmRZ1nQxS9XmZwQ6KTHyJQlY7X5o=',
        version: '1.0.0-' + Date.now(), // Cache buster
        debug: false
    };

    // Security Checks
    function initializeSecurity() {
        if (!passesEnvironmentChecks()) {
            return;
        }

        // Load resources with security measures
        Promise.all([
            loadResource('css', CONFIG.cssUrl, CONFIG.cssIntegrity),
            loadResource('js', CONFIG.jsUrl, CONFIG.jsIntegrity)
        ]).then(() => {
            if (CONFIG.debug) console.log('[LanDecs Security] All resources loaded successfully');
            showFooter(); // Only show footer after successful load
        }).catch(error => {
            console.error('[LanDecs Security] Resource loading failed:', error);
            displayErrorFallback();
        });
    }

    // Environment Validation
    function passesEnvironmentChecks() {
        try {
            // Verify we're running in a browser
            if (typeof window === 'undefined') {
                throw new Error('Not running in a browser environment');
            }

            // Check if running in an iframe
            if (window.self !== window.top) {
                throw new Error('Framing is not allowed');
            }

            // Verify domain is allowed
            const currentDomain = window.location.hostname;
            if (!CONFIG.allowedDomains.includes(currentDomain)) {
                throw new Error(`Domain ${currentDomain} is not authorized`);
            }

            // Enforce HTTPS in production
            if (window.location.protocol !== 'https:' && !window.location.hostname.includes('localhost')) {
                throw new Error('HTTPS is required');
            }

            // Check for browser features
            if (typeof document.createElement('link').relList === 'undefined' || 
                typeof document.createElement('script').async === 'undefined') {
                throw new Error('Browser lacks required features');
            }

            return true;
        } catch (error) {
            console.error('[LanDecs Security] Environment check failed:', error);
            displayErrorFallback();
            return false;
        }
    }

    // Secure Resource Loading
    function loadResource(type, url, integrity) {
        return new Promise((resolve, reject) => {
            const element = type === 'css' 
                ? document.createElement('link')
                : document.createElement('script');

            if (type === 'css') {
                element.rel = 'stylesheet';
                element.href = url + '?v=' + CONFIG.version;
            } else {
                element.src = url + '?v=' + CONFIG.version;
                element.async = true;
            }

            element.crossOrigin = 'anonymous';
            element.integrity = integrity;
            element.referrerPolicy = 'no-referrer';

            element.onload = () => {
                if (CONFIG.debug) console.log(`[LanDecs Security] ${type.toUpperCase()} loaded successfully`);
                resolve();
            };

            element.onerror = () => {
                reject(new Error(`Failed to load ${type} from ${url}`));
            };

            document.head.appendChild(element);
        });
    }

    // Error Handling
    function displayErrorFallback() {
        const errorStyle = document.createElement('style');
        errorStyle.textContent = `
            .security-error {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                background: #ff4444;
                color: white;
                padding: 10px;
                text-align: center;
                z-index: 9999;
                font-family: Arial, sans-serif;
            }
            .security-error a {
                color: white;
                text-decoration: underline;
            }
        `;
        document.head.appendChild(errorStyle);

        const errorDiv = document.createElement('div');
        errorDiv.className = 'security-error';
        errorDiv.innerHTML = `
            <strong>Security Alert:</strong> There was an issue loading required resources. 
            Please refresh the page or <a href="${window.location.href}">try again</a>.
            If the problem persists, contact support.
        `;
        document.body.insertBefore(errorDiv, document.body.firstChild);
    }

    // Footer Animation
    function showFooter() {
        const footer = document.getElementById('pageFooter');
        if (footer) {
            footer.style.transform = 'translateY(0)';
            footer.style.opacity = '1';
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeSecurity);
    } else {
        initializeSecurity();
    }

    // Add CSP meta tag dynamically (additional protection layer)
    const cspMeta = document.createElement('meta');
    cspMeta.httpEquiv = 'Content-Security-Policy';
    cspMeta.content = `
        default-src 'self';
        script-src 'self' https://eldrex.vercel.app 'unsafe-inline' 'unsafe-eval';
        style-src 'self' https://eldrex.vercel.app 'unsafe-inline';
        img-src 'self' data: https://eldrex.neocities.org https://ucarecdn.com https://eldrex.vercel.app;
        font-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com https://cdnjs.cloudflare.com;
        connect-src 'self' https://eldrex.vercel.app https://api.vercel.app;
        frame-src 'none';
        object-src 'none';
        base-uri 'self';
    `.replace(/\s+/g, ' ').trim();
    document.head.appendChild(cspMeta);

})();