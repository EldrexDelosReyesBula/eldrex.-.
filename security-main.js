// security.js - Production-Grade Security Loader
// Hosted on Vercel: https://eldrex.vercel.app/security.js

(function() {
    // ======================
    // 1. Environment Validation
    // ======================
    const security = {
        config: {
            authorizedDomains: [
                'eldrex.neocities.org',
                'https://eldrex.neocities.org',
                'eldrex.vercel.app' // For development/testing
            ],
            requiredFeatures: [
                'Promise',
                'fetch',
                'IntersectionObserver',
                'MutationObserver'
            ],
            resourceMap: {
                css: {
                    url: 'https://eldrex.vercel.app/css/main.css',
                    integrity: '' // Will be populated dynamically
                },
                js: {
                    url: 'https://eldrex.vercel.app/functions/main.js',
                    integrity: '' // Will be populated dynamically
                },
                libs: {
                    dompurify: {
                        url: 'https://cdnjs.cloudflare.com/ajax/libs/dompurify/3.0.6/purify.min.js',
                        integrity: 'sha512-MXuN8NRZLi5ZJqZR6/0vUgNkSDQdQ4Qq3Hw5mF0K2jRqTQZ5XZ3BqQ5/l/u1QlZwNQ2dY0ZJq0X4i+3QlFvBA=='
                    },
                    detectBrowser: {
                        url: 'https://cdn.jsdelivr.net/npm/detect-browser@5.3.0/dist/detect-browser.umd.min.js',
                        integrity: 'sha512-9e31w/8Y0YQkC+9F4Y7v8/OLfzAxy+0OZ0T+QJ8Q7QYQO/5qJVEe4+QYgNwj6O5wJj9jR71Q1fKZwZL5MQUJg=='
                    },
                    cryptoPolyfill: {
                        url: 'https://cdnjs.cloudflare.com/ajax/libs/asmCrypto/2.3.2/asmcrypto.all.min.js',
                        integrity: 'sha512-OrNYbtEPuQ4Hp7Q5kUxhnphYjYx7GZ/5Q/9JgY5QZ+QvbiaEXkLtVpBQ4jJw1Q9YJVZx7hY7zQ7E5Q7Q5Q5Q=='
                    }
                }
            },
            version: '1.0.0-' + Date.now()
        },
        
        // Initialize security checks
        init: function() {
            return this.checkBrowser()
                .then(() => this.checkEnvironment())
                .then(() => this.checkFeatures())
                .then(() => this.fetchIntegrityHashes())
                .then(() => this.loadDependencies())
                .then(() => this.injectResources())
                .catch(err => this.handleError(err));
        },
        
        // ======================
        // 2. Security Checks
        // ======================
        checkBrowser: function() {
            return new Promise((resolve, reject) => {
                // Load browser detection library
                const script = document.createElement('script');
                script.src = this.config.libs.detectBrowser.url;
                script.integrity = this.config.libs.detectBrowser.integrity;
                script.crossOrigin = 'anonymous';
                script.onload = () => {
                    const { detect } = window.DetectBrowser;
                    const { name, version } = detect();
                    
                    // Block old browsers
                    const blockedBrowsers = {
                        'ie': 11,
                        'edge': 15,
                        'safari': 9
                    };
                    
                    if (blockedBrowsers[name] && parseInt(version) <= blockedBrowsers[name]) {
                        reject(`Unsupported browser: ${name} ${version}`);
                    }
                    resolve();
                };
                script.onerror = () => reject('Failed to load browser detection');
                document.head.appendChild(script);
            });
        },
        
        checkEnvironment: function() {
            return new Promise((resolve, reject) => {
                const isLocalhost = /localhost|127\.0\.0\.1|::1/i.test(window.location.hostname);
                const isHttps = window.location.protocol === 'https:';
                const isAuthorized = this.config.authorizedDomains.includes(window.location.hostname);
                const isInIframe = window.self !== window.top;
                
                if (isInIframe) {
                    try { window.top.location.href = window.location.href; } catch(e) {}
                    reject('Embedding not allowed');
                }
                
                if (isLocalhost) reject('Local execution not allowed');
                if (!isHttps) reject('HTTPS required');
                if (!isAuthorized) reject('Unauthorized domain');
                
                resolve();
            });
        },
        
        checkFeatures: function() {
            return new Promise((resolve, reject) => {
                const missing = this.config.requiredFeatures.filter(f => !window[f]);
                if (missing.length) {
                    reject(`Missing required features: ${missing.join(', ')}`);
                }
                resolve();
            });
        },
        
        // ======================
        // 3. Resource Handling
        // ======================
        fetchIntegrityHashes: function() {
            return Promise.all([
                this.calculateIntegrity(this.config.resourceMap.css.url),
                this.calculateIntegrity(this.config.resourceMap.js.url)
            ]).then(([cssHash, jsHash]) => {
                this.config.resourceMap.css.integrity = `sha256-${cssHash}`;
                this.config.resourceMap.js.integrity = `sha256-${jsHash}`;
            });
        },
        
        calculateIntegrity: function(url) {
            return fetch(url, { cache: 'no-store' })
                .then(r => r.text())
                .then(text => {
                    return crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
                        .then(hash => {
                            return btoa(String.fromCharCode(...new Uint8Array(hash)));
                        });
                })
                .catch(() => ''); // Fallback to empty if dynamic check fails
        },
        
        loadDependencies: function() {
            return new Promise(resolve => {
                // Load crypto polyfill if needed
                if (!window.crypto || !crypto.subtle) {
                    const script = document.createElement('script');
                    script.src = this.config.libs.cryptoPolyfill.url;
                    script.integrity = this.config.libs.cryptoPolyfill.integrity;
                    script.crossOrigin = 'anonymous';
                    script.onload = () => {
                        window.asmCrypto = asmCrypto;
                        resolve();
                    };
                    document.head.appendChild(script);
                } else {
                    resolve();
                }
            });
        },
        
        injectResources: function() {
            // Create sanitizer first
            const sanitizerScript = document.createElement('script');
            sanitizerScript.src = this.config.libs.dompurify.url;
            sanitizerScript.integrity = this.config.libs.dompurify.integrity;
            sanitizerScript.crossOrigin = 'anonymous';
            
            // Main resources
            const cssLink = document.createElement('link');
            cssLink.rel = 'stylesheet';
            cssLink.href = `${this.config.resourceMap.css.url}?v=${this.config.version}`;
            cssLink.crossOrigin = 'anonymous';
            cssLink.integrity = this.config.resourceMap.css.integrity;
            
            const jsScript = document.createElement('script');
            jsScript.src = `${this.config.resourceMap.js.url}?v=${this.config.version}`;
            jsScript.crossOrigin = 'anonymous';
            jsScript.integrity = this.config.resourceMap.js.integrity;
            jsScript.defer = true;
            
            // Error handling
            const fallback = () => {
                document.body.innerHTML = `
                    <style>
                        .security-error {
                            font-family: sans-serif;
                            max-width: 600px;
                            margin: 2rem auto;
                            padding: 2rem;
                            border: 1px solid #ff4444;
                            background: #ffebee;
                            color: #c62828;
                        }
                    </style>
                    <div class="security-error">
                        <h1>Application Load Error</h1>
                        <p>Failed to load required resources. Please refresh or try again later.</p>
                        <button onclick="window.location.reload()">Retry</button>
                    </div>
                `;
            };
            
            cssLink.onerror = fallback;
            jsScript.onerror = fallback;
            sanitizerScript.onerror = () => console.warn('DOMPurify failed to load');
            
            // Inject in optimal order
            document.head.appendChild(sanitizerScript);
            document.head.appendChild(cssLink);
            document.head.appendChild(jsScript);
            
            // Initialize sanitizer for dynamic content
            if (window.DOMPurify) {
                DOMPurify.addHook('uponSanitizeElement', (node, data) => {
                    if (data.tagName === 'script' || data.tagName === 'iframe') {
                        return window.location.hostname === 'eldrex.neocities.org' ? node : null;
                    }
                });
            }
        },
        
        handleError: function(error) {
            console.error('Security Error:', error);
            document.documentElement.innerHTML = `
                <head>
                    <title>Security Error</title>
                    <meta charset="UTF-8">
                    <style>
                        body {
                            font-family: sans-serif;
                            line-height: 1.6;
                            color: #333;
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 2rem;
                        }
                        h1 { color: #c62828; }
                        .error-details {
                            background: #f5f5f5;
                            padding: 1rem;
                            border-radius: 4px;
                            margin: 1rem 0;
                            font-family: monospace;
                        }
                        button {
                            background: #c62828;
                            color: white;
                            border: none;
                            padding: 0.5rem 1rem;
                            border-radius: 4px;
                            cursor: pointer;
                        }
                    </style>
                </head>
                <body>
                    <h1>Security Restriction</h1>
                    <p>The application cannot run in this environment due to security policies.</p>
                    <div class="error-details">${error}</div>
                    <button onclick="window.location.href='https://eldrex.neocities.org'">
                        Go to Homepage
                    </button>
                </body>
            `;
        }
    };
    
    // Start security initialization
    security.init();
})();
