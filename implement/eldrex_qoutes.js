// eldrex-quotes.js - Quote Library by Eldrex Delos Reyes Bula
// Version 2.0.0 - Secure Implementation
// Protected by LPSL license by landecs

(function(global) {
    'use strict';

    // Security: Prevent prototype pollution and ensure safe execution
    if (typeof window === 'undefined') {
        throw new Error('Eldrex Quotes library requires a browser environment');
    }

    // Content Data - Immutable quotes collection
    const contentData = Object.freeze({
        quotes: Object.freeze([
            {
                text: "Still Be the Blue",
                author: "Eldrex Delos Reyes Bula"
            },
            {
                text: "Crazy? Maybe. But I'd rather learn passionately than memorize mindlessly.",
                author: "Eldrex Delos Reyes Bula"
            },
            {
                text: "The more we think, the more risks we understand, but sometimes we're quick to regret instead of embracing them.",
                author: "Eldrex Delos Reyes Bula"
            },
            {
                text: "An old book might look like trash, yet it has the power to change lives, even if people can't see its worth at first glance.",
                author: "Eldrex Delos Reyes Bula"
            },
            {
                text: "Sometimes, it's people themselves who make things seem impossible.",
                author: "Eldrex Delos Reyes Bula"
            },
            {
                text: "Sometimes, it's curiosity that takes you to the place where you were meant to be.",
                author: "Eldrex Delos Reyes Bula"
            },
            {
                text: "I serve people not a company",
                author: "Eldrex Delos Reyes Bula"
            },
            {
                text: "Numbers may define you, but it's your will to give them meaning.",
                author: "Eldrex Delos Reyes Bula"
            },
            {
                text: "A man who can do what he wants, does what he wants.",
                author: "Eldrex Delos Reyes Bula"
            },
            {
                text: "We lose not because we have little, but because we expect nothing more.",
                author: "Eldrex Delos Reyes Bula"
            },
            {
                text: "Create what others can't see—because they won't know they needed it until it's here.",
                author: "Eldrex Delos Reyes Bula"
            },
            {
                text: "Your limits aren't real if you're the one writing the rules.",
                author: "Eldrex Delos Reyes Bula"
            },
            {
                text: "I never asked for attention. I just made things impossible to ignore.",
                author: "Eldrex Delos Reyes Bula"
            },
            {
                text: "I didn't say it. I didn't do it. But that doesn't mean I didn't mean it with all of me.",
                author: "Eldrex Delos Reyes Bula"
            },
            {
                text: "To own your information is not a feature—it is a right that should never be questioned.",
                author: "Eldrex Delos Reyes Bula"
            },
            {
                text: "Change is our only goal, and that's why we're here to create a new story and become part of history.",
                author: "Eldrex Delos Reyes Bula"
            },
            {
                text: "To exist is to question; to question is to live. And if all else is illusion, let my curiosity be real.",
                author: "Eldrex Delos Reyes Bula"
            },
            {
                text: "If life is a labyrinth of illusions, then perhaps my purpose is not to escape, but to wander. To question without answer, to search without end—this may be the only truth we ever know.",
                author: "Eldrex Delos Reyes Bula"
            },
            {
                text: "I'm in love—not with you, but with the essence of who you are.",
                author: "Eldrex Delos Reyes Bula"
            },
            {
                text: "The strongest people are not those who show strength in front of us, but those who fight battles we know nothing about.",
                author: "Eldrex Delos Reyes Bula"
            },
            {
                text: "The cost of convenience should never be the loss of control.",
                author: "Eldrex Delos Reyes Bula"
            },
            {
                text: "A mother's gift isn't measured by how it looks, but by the love that came with it.",
                author: "Eldrex Delos Reyes Bula"
            },
            {
                text: "A seed doesn't ask for perfect soil, nor does it wait for the perfect rain. It simply grows where it's planted, reaching for light with whatever it can find.",
                author: "Eldrex Delos Reyes Bula"
            },
            {
                text: "If you can question everything, you can understand anything.",
                author: "Eldrex Delos Reyes Bula"
            },
            {
                text: "A child's heart remembers the warmth of home, even when life keeps them far away.",
                author: "Eldrex Delos Reyes Bula"
            },
            {
                text: "Hoping to be enough, just as I am",
                author: "Eldrex Delos Reyes Bula"
            },
            {
                text: "Fly again, My blue",
                author: "Eldrex Delos Reyes Bula"
            },
            {
                text: "Time moves so slow, yet I blink, and everything is gone.",
                author: "Eldrex Delos Reyes Bula"
            },
            {
                text: "I thought I wanted freedom, but now I just want one more yesterday.",
                author: "Eldrex Delos Reyes Bula"
            },
            {
                text: "A road without signs is only a problem if you believe you're going somewhere.",
                author: "Eldrex Delos Reyes Bula"
            },
            {
                text: "A recipe followed perfectly still tastes different in someone else's hands.",
                author: "Eldrex Delos Reyes Bula"
            },
            {
                text: "We've waited for this day, but now we're wishing for one more.",
                author: "Eldrex Delos Reyes Bula"
            },
            {
                text: "Mistakes don't make you weak; refusing to correct them does.",
                author: "Eldrex Delos Reyes Bula"
            }
        ])
    });

    // Security: HTML escaping utility
    const escapeHtml = (unsafe) => {
        if (typeof unsafe !== 'string') return '';
        const div = document.createElement('div');
        div.textContent = unsafe;
        return div.innerHTML;
    };

    // Security: Validate configuration
    const validateConfig = (config) => {
        const errors = [];
        
        if (config.container && typeof config.container !== 'string') {
            errors.push('Container must be a CSS selector string');
        }
        
        if (config.maxQuotes && (typeof config.maxQuotes !== 'number' || config.maxQuotes < 1)) {
            errors.push('maxQuotes must be a positive number');
        }
        
        if (config.filter && typeof config.filter !== 'function') {
            errors.push('Filter must be a function');
        }
        
        if (errors.length > 0) {
            throw new Error(`Configuration error: ${errors.join(', ')}`);
        }
    };

    // Physics Animation Class
    class PhysicsAnimation {
        constructor() {
            this.animations = new Map();
        }

        fadeInWithPhysics(element, delay = 0) {
            if (!element || !(element instanceof HTMLElement)) return;
            
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px) scale(0.95)';
            element.style.transition = 'none';

            setTimeout(() => {
                element.style.transition = `all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}s`;
                element.style.opacity = '1';
                element.style.transform = 'translateY(0) scale(1)';
            }, 50);
        }
    }

    // Quote Manager Class
    class QuoteManager {
        constructor() {
            this.physics = new PhysicsAnimation();
            this.visibleQuotes = new Set();
            this.intersectionObserver = null;
            this.initObserver();
        }

        initObserver() {
            if (!('IntersectionObserver' in window)) {
                console.warn('IntersectionObserver not supported, animations may not work');
                return;
            }

            this.intersectionObserver = new IntersectionObserver(
                (entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            this.animateQuoteIn(entry.target);
                        }
                    });
                }, {
                    threshold: 0.1,
                    rootMargin: '50px'
                }
            );
        }

        createQuoteElement(quote, index) {
            const quoteElement = document.createElement('div');
            quoteElement.className = 'eldrex-quote';
            quoteElement.dataset.quoteId = index;

            quoteElement.innerHTML = `
                <div class="eldrex-quote-content">
                    <div class="eldrex-quote-text">"${escapeHtml(quote.text)}"</div>
                    <span class="eldrex-quote-author">— ${escapeHtml(quote.author)}</span>
                </div>
            `;

            // Add event listeners with proper cleanup references
            quoteElement.addEventListener('mouseenter', this.handleQuoteHover.bind(this));
            quoteElement.addEventListener('mouseleave', this.handleQuoteHoverEnd.bind(this));
            quoteElement.addEventListener('click', this.handleQuoteClick.bind(this));

            return quoteElement;
        }

        handleQuoteHover(e) {
            const quote = e.currentTarget;
            if (quote) {
                quote.style.transform = 'translateY(-5px) scale(1.02)';
                quote.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.15)';
            }
        }

        handleQuoteHoverEnd(e) {
            const quote = e.currentTarget;
            if (quote) {
                quote.style.transform = 'translateY(0) scale(1)';
                quote.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
            }
        }

        handleQuoteClick(e) {
            const quote = e.currentTarget;
            if (!quote) return;

            const rect = quote.getBoundingClientRect();
            const ripple = document.createElement('div');
            
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(59, 130, 246, 0.3);
                transform: scale(0);
                animation: eldrex-ripple 0.6s linear;
                pointer-events: none;
                width: 100px;
                height: 100px;
                left: ${e.clientX - rect.left - 50}px;
                top: ${e.clientY - rect.top - 50}px;
            `;

            quote.appendChild(ripple);
            setTimeout(() => {
                if (ripple.parentNode === quote) {
                    quote.removeChild(ripple);
                }
            }, 600);
        }

        animateQuoteIn(quoteElement) {
            if (!quoteElement || !quoteElement.dataset.quoteId) return;
            
            if (this.visibleQuotes.has(quoteElement.dataset.quoteId)) return;

            this.visibleQuotes.add(quoteElement.dataset.quoteId);
            this.physics.fadeInWithPhysics(quoteElement, Math.random() * 0.5);
        }

        displayQuotesWithData(quoteData, container) {
            if (!container || !(container instanceof HTMLElement)) {
                throw new Error('Valid container element is required');
            }

            // Clear container safely
            while (container.firstChild) {
                container.removeChild(container.firstChild);
            }

            this.ensureRippleAnimation();

            quoteData.quotes.forEach((quote, index) => {
                const quoteElement = this.createQuoteElement(quote, index);
                container.appendChild(quoteElement);
                
                if (this.intersectionObserver) {
                    this.intersectionObserver.observe(quoteElement);
                } else {
                    // Fallback: animate immediately if IntersectionObserver not available
                    this.animateQuoteIn(quoteElement);
                }
            });
        }

        ensureRippleAnimation() {
            if (!document.querySelector('#eldrex-ripple-animation')) {
                const style = document.createElement('style');
                style.id = 'eldrex-ripple-animation';
                style.textContent = `
                    @keyframes eldrex-ripple {
                        to {
                            transform: scale(2.5);
                            opacity: 0;
                        }
                    }
                `;
                document.head.appendChild(style);
            }
        }

        destroy() {
            if (this.intersectionObserver) {
                this.intersectionObserver.disconnect();
            }
            this.visibleQuotes.clear();
        }
    }

    // Main QuoteAPI Class
    class QuoteAPI {
        constructor() {
            this._initialized = false;
            this._instances = new Map();
            this._version = '2.0.0';
            this._stylesInjected = false;
        }

        init(config = {}) {
            if (this._initialized) {
                console.warn('Eldrex QuoteAPI already initialized');
                return this;
            }

            // Default configuration
            this.config = {
                container: config.container || '#eldrex-quotes-container',
                animationEnabled: config.animationEnabled !== false,
                maxQuotes: config.maxQuotes || null,
                filter: config.filter || null,
                autoInit: config.autoInit !== false,
                customStyles: config.customStyles !== false,
                ...config
            };

            // Validate configuration
            try {
                validateConfig(this.config);
            } catch (error) {
                console.error('Configuration validation failed:', error.message);
                throw error;
            }

            this._initialized = true;

            if (this.config.autoInit) {
                this._autoInitStyles();
            }

            return this;
        }

        _autoInitStyles() {
            if (this._stylesInjected || !this.config.customStyles) return;

            if (!document.querySelector('#eldrex-quotes-styles')) {
                const style = document.createElement('style');
                style.id = 'eldrex-quotes-styles';
                style.textContent = `
                    .eldrex-quote {
                        background: white;
                        border-radius: 12px;
                        padding: 1.5rem;
                        margin: 1rem 0;
                        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
                        transition: all 0.3s ease;
                        border-left: 4px solid #3b82f6;
                        position: relative;
                        overflow: hidden;
                    }
                    
                    .eldrex-quote-content {
                        position: relative;
                    }
                    
                    .eldrex-quote-text {
                        font-size: 1.1rem;
                        line-height: 1.6;
                        color: #333;
                        margin-bottom: 0.5rem;
                        font-style: italic;
                    }
                    
                    .eldrex-quote-author {
                        font-weight: 600;
                        color: #3b82f6;
                        font-size: 0.9rem;
                        display: block;
                        text-align: right;
                    }
                    
                    .eldrex-quotes-container {
                        max-width: 800px;
                        margin: 0 auto;
                        padding: 2rem;
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    }
                    
                    @media (max-width: 768px) {
                        .eldrex-quotes-container {
                            padding: 1rem;
                        }
                        
                        .eldrex-quote {
                            padding: 1rem;
                            margin: 0.5rem 0;
                        }
                    }
                    
                    @media (prefers-reduced-motion: reduce) {
                        .eldrex-quote {
                            transition: none;
                        }
                    }
                `;
                document.head.appendChild(style);
                this._stylesInjected = true;
            }
        }

        // Public API Methods
        getAllQuotes() {
            this._ensureInitialized();
            return JSON.parse(JSON.stringify(contentData.quotes));
        }

        getRandomQuote() {
            this._ensureInitialized();
            const randomIndex = Math.floor(Math.random() * contentData.quotes.length);
            return { ...contentData.quotes[randomIndex] };
        }

        getQuotesByFilter(filterFn) {
            this._ensureInitialized();
            if (typeof filterFn !== 'function') {
                throw new Error('Filter must be a function');
            }
            return contentData.quotes.filter(filterFn).map(quote => ({ ...quote }));
        }

        searchQuotes(searchTerm) {
            this._ensureInitialized();
            if (typeof searchTerm !== 'string') {
                throw new Error('Search term must be a string');
            }

            const term = searchTerm.toLowerCase();
            return contentData.quotes.filter(quote => 
                quote.text.toLowerCase().includes(term) || 
                quote.author.toLowerCase().includes(term)
            ).map(quote => ({ ...quote }));
        }

        displayQuotes(container = this.config.container) {
            this._ensureInitialized();

            const targetContainer = typeof container === 'string' ? 
                document.querySelector(container) : container;

            if (!targetContainer) {
                // Create container if it doesn't exist
                const newContainer = document.createElement('div');
                newContainer.className = 'eldrex-quotes-container';
                newContainer.id = 'eldrex-quotes-container';
                document.body.appendChild(newContainer);
                return this.displayQuotes(newContainer);
            }

            // Ensure container has proper class
            targetContainer.classList.add('eldrex-quotes-container');

            const quoteManager = new QuoteManager();
            const instanceId = Symbol('quoteInstance');
            
            this._instances.set(instanceId, { 
                quoteManager, 
                container: targetContainer,
                type: 'quotes'
            });

            let quotesToDisplay = contentData.quotes;

            // Apply filters
            if (this.config.filter) {
                quotesToDisplay = quotesToDisplay.filter(this.config.filter);
            }

            if (this.config.maxQuotes) {
                quotesToDisplay = quotesToDisplay.slice(0, this.config.maxQuotes);
            }

            const filteredContentData = { quotes: quotesToDisplay };
            quoteManager.displayQuotesWithData(filteredContentData, targetContainer);

            return instanceId;
        }

        displayRandomQuote(container = this.config.container) {
            this._ensureInitialized();

            const targetContainer = typeof container === 'string' ? 
                document.querySelector(container) : container;

            if (!targetContainer) {
                throw new Error(`Container not found: ${container}`);
            }

            const randomQuote = this.getRandomQuote();
            const quoteManager = new QuoteManager();

            const instanceId = Symbol('randomQuoteInstance');
            this._instances.set(instanceId, { 
                quoteManager, 
                container: targetContainer,
                type: 'random'
            });

            const singleQuoteData = { quotes: [randomQuote] };
            quoteManager.displayQuotesWithData(singleQuoteData, targetContainer);

            return instanceId;
        }

        // Cleanup methods
        cleanup(instanceId) {
            const instance = this._instances.get(instanceId);
            if (instance) {
                if (instance.quoteManager) {
                    instance.quoteManager.destroy();
                }
                if (instance.container) {
                    instance.container.innerHTML = '';
                }
                this._instances.delete(instanceId);
            }
        }

        destroy() {
            for (const [instanceId] of this._instances) {
                this.cleanup(instanceId);
            }
            this._initialized = false;
            this._instances.clear();
        }

        // Utility methods
        getVersion() {
            return this._version;
        }

        isInitialized() {
            return this._initialized;
        }

        _ensureInitialized() {
            if (!this._initialized) {
                throw new Error('Eldrex QuoteAPI not initialized. Call init() first.');
            }
        }
    }

    // Utility functions
    const utils = {
        getVersion: () => '2.0.0',
        validateQuote: (quote) => {
            return quote && 
                   typeof quote.text === 'string' && 
                   typeof quote.author === 'string' &&
                   quote.text.length > 0 &&
                   quote.author.length > 0;
        },
        formatQuote: (quote, template = '"{text}" — {author}') => {
            if (!quote || typeof quote !== 'object') return '';
            return template
                .replace('{text}', escapeHtml(quote.text))
                .replace('{author}', escapeHtml(quote.author));
        },
        escapeHtml: escapeHtml
    };

    // Global exposure with security checks
    if (typeof global.EldrexQuotes === 'undefined') {
        global.EldrexQuotes = {
            QuoteAPI,
            utils,
            contentData: Object.freeze(JSON.parse(JSON.stringify(contentData))),
            version: '2.0.0'
        };
    }

    // Export for module systems
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = { QuoteAPI, utils, contentData };
    }

})(typeof window !== 'undefined' ? window : this);