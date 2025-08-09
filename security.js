/**
 * Security.js - Comprehensive protection for eldrex.neocities.org
 * Version: 1.0
 * Author: Eldrex
 * License: https://eldrex.neocities.org/license.html
 */

(function() {
    'use strict';

    // Allowed domains configuration
    const ALLOWED_DOMAINS = [
        'eldrex.neocities.org',
        'eldrex.vercel.app'
    ];

    // Current domain information
    const currentDomain = window.location.hostname;
    const isSecure = window.location.protocol === 'https:';
    const isEmbedded = window.self !== window.top;
    const isAllowedDomain = ALLOWED_DOMAINS.includes(currentDomain);

    // Security functions
    const Security = {
        /**
         * Enforce HTTPS
         */
        enforceHTTPS: function() {
            if (!isSecure && currentDomain === 'eldrex.neocities.org') {
                window.location.href = 'https://eldrex.neocities.org' + window.location.pathname;
            }
        },

        /**
         * Prevent embedding in unauthorized sites
         */
        preventEmbedding: function() {
            if (isEmbedded && !isAllowedDomain) {
                document.body.innerHTML = `
                    <style>
                        .embed-error {
                            font-family: Arial, sans-serif;
                            text-align: center;
                            padding: 50px;
                            color: #ff4444;
                        }
                        .embed-error a {
                            color: #4444ff;
                        }
                    </style>
                    <div class="embed-error">
                        <h1>Embedding Not Allowed</h1>
                        <p>This content cannot be embedded on external websites.</p>
                        <p>Please visit <a href="https://eldrex.neocities.org">https://eldrex.neocities.org</a> directly.</p>
                    </div>
                `;
            }
        },

        /**
         * Hide paths and redirect all requests to index.html
         */
        handleRouting: function() {
            const path = window.location.pathname;
            
            // Redirect direct access to security.js
            if (path.includes('security.js')) {
                window.location.href = 'https://eldrex.neocities.org/license.html';
                return;
            }

            // Handle file requests (simulate SPA behavior)
            const fileExtensions = ['.css', '.js'];
            const isFileRequest = fileExtensions.some(ext => path.endsWith(ext));
            
            if (isFileRequest && !path.includes('security.js')) {
                // For other files, redirect to index.html (they'll be handled by the JS)
                window.location.href = '/index.html';
            }
        },

        /**
         * Load appropriate content based on path
         */
        loadContent: function() {
            const path = window.location.pathname;
            
            // Skip if this is a direct file request
            if (path.endsWith('.js') || path.endsWith('.css')) return;

            // Determine which page to load
            let page = 'main';
            if (path.includes('about')) page = 'about';
            if (path.includes('license')) page = 'license';

            // Inject the appropriate CSS and JS
            this.injectResources(page);
            
            // Load the page content
            this.loadPageContent(page);
        },

        /**
         * Inject CSS and JS resources for the current page
         */
        injectResources: function(page) {
            // Base URL for resources
            const baseUrl = 'https://eldrex.vercel.app';
            
            // Remove any existing dynamically added resources
            document.querySelectorAll('link[data-dynamic], script[data-dynamic]').forEach(el => el.remove());
            
            // Inject CSS
            const cssLink = document.createElement('link');
            cssLink.rel = 'stylesheet';
            cssLink.href = `${baseUrl}/css/${page}.css`;
            cssLink.setAttribute('data-dynamic', 'true');
            document.head.appendChild(cssLink);
            
            // Inject JS (except for main page which already has security.js)
            if (page !== 'main') {
                const jsScript = document.createElement('script');
                jsScript.src = `${baseUrl}/functions/${page}.js`;
                jsScript.setAttribute('data-dynamic', 'true');
                document.body.appendChild(jsScript);
            }
        },

        /**
         * Load page content dynamically
         */
        loadPageContent: function(page) {
            // In a real implementation, you would fetch or generate content here
            // For this example, we'll just update the title
            document.title = `Eldrex - ${page.charAt(0).toUpperCase() + page.slice(1)}`;
            
            // You would typically have a more sophisticated content loading system
            console.log(`Loading content for ${page} page`);
        },

        /**
         * Initialize all security measures
         */
        init: function() {
            this.enforceHTTPS();
            this.preventEmbedding();
            this.handleRouting();
            
            // Only load content if we're on the allowed domain
            if (isAllowedDomain) {
                this.loadContent();
            }
        }
    };

    // Initialize security measures
    Security.init();
})();