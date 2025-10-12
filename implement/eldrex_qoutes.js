// eldrex-quotes.js - Quote Library by Eldrex Delos Reyes Bula
// Version 1.0.0
//Protected by LPSL license by landecs

export const contentData = {
    quotes: [
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
    ]
};

export class PhysicsAnimation {
    constructor() {
        this.animations = new Map();
        this.isScrolling = false;
        this.scrollTimer = null;
    }

    springAnimation(element, target, options = {}) {
        const {
            stiffness = 0.1,
            damping = 0.8,
            mass = 1,
            precision = 0.01
        } = options;

        let position = 0;
        let velocity = 0;
        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;

            const force = (target - position) * stiffness;
            const acceleration = force / mass;
            velocity = (velocity + acceleration) * damping;
            position += velocity;

            element.style.transform = `translateY(${position}px)`;

            if (Math.abs(target - position) > precision || Math.abs(velocity) > precision) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }

    fadeInWithPhysics(element, delay = 0) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px) scale(0.95)';
        element.style.transition = 'none';

        setTimeout(() => {
            element.style.transition = `all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}s`;
            element.style.opacity = '1';
            element.style.transform = 'translateY(0) scale(1)';
        }, 50);
    }

    parallaxScroll(element, speed = 0.5) {
        const updateParallax = () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * speed;
            element.style.transform = `translateY(${rate}px)`;
        };

        window.addEventListener('scroll', updateParallax, {
            passive: true
        });
        updateParallax();
        
        return () => {
            window.removeEventListener('scroll', updateParallax);
        };
    }
}

export class QuoteManager {
    constructor() {
        this.physics = new PhysicsAnimation();
        this.visibleQuotes = new Set();
        this.intersectionObserver = null;
        this.initObserver();
    }

    initObserver() {
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
        quoteElement.className = 'quote';
        quoteElement.dataset.quoteId = index;

        quoteElement.innerHTML = `
            <div class="quote-content">
                <div class="quote-text">"${this.escapeHtml(quote.text)}"</div>
                <span class="quote-author">— ${this.escapeHtml(quote.author)}</span>
            </div>
        `;

        quoteElement.addEventListener('mouseenter', this.handleQuoteHover.bind(this));
        quoteElement.addEventListener('mouseleave', this.handleQuoteHoverEnd.bind(this));
        quoteElement.addEventListener('click', this.handleQuoteClick.bind(this));

        return quoteElement;
    }

    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    handleQuoteHover(e) {
        const quote = e.currentTarget;
        quote.style.transform = 'translateY(-5px) scale(1.02)';
        quote.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.15)';
    }

    handleQuoteHoverEnd(e) {
        const quote = e.currentTarget;
        quote.style.transform = 'translateY(0) scale(1)';
        quote.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
    }

    handleQuoteClick(e) {
        const quote = e.currentTarget;
        const rect = quote.getBoundingClientRect();

        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(59, 130, 246, 0.3);
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
            width: 100px;
            height: 100px;
            left: ${e.clientX - rect.left - 50}px;
            top: ${e.clientY - rect.top - 50}px;
        `;

        quote.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    }

    animateQuoteIn(quoteElement) {
        if (this.visibleQuotes.has(quoteElement.dataset.quoteId)) return;

        this.visibleQuotes.add(quoteElement.dataset.quoteId);
        this.physics.fadeInWithPhysics(quoteElement, Math.random() * 0.5);
    }

    displayQuotes() {
        const quotesContainer = document.querySelector('.quotes-container');
        if (!quotesContainer) {
            console.warn('Quotes container not found');
            return;
        }

        this.displayQuotesWithData(contentData, quotesContainer);
    }

    displayQuotesWithData(quoteData, container) {
        if (!container) {
            throw new Error('Container is required for displayQuotesWithData');
        }

        container.innerHTML = '';

        this.ensureRippleAnimation();

        quoteData.quotes.forEach((quote, index) => {
            const quoteElement = this.createQuoteElement(quote, index);
            container.appendChild(quoteElement);
            this.intersectionObserver.observe(quoteElement);
        });
    }

    ensureRippleAnimation() {
        if (!document.querySelector('#ripple-animation')) {
            const style = document.createElement('style');
            style.id = 'ripple-animation';
            style.textContent = `
                @keyframes ripple {
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

export class EnhancedReadMore {
    constructor() {
        this.physics = new PhysicsAnimation();
        this.isExpanded = false;
    }

    init(buttonSelector = '.read-more-btn', contentSelector = '.hidden-content') {
        const readMoreBtn = document.querySelector(buttonSelector);
        const hiddenContent = document.querySelector(contentSelector);

        if (!readMoreBtn || !hiddenContent) {
            console.warn('Read more elements not found');
            return;
        }

        const toggleContent = (expanded) => {
            this.isExpanded = expanded;

            if (expanded) {
                hiddenContent.style.maxHeight = '0';
                hiddenContent.classList.add('active');

                setTimeout(() => {
                    const contentHeight = hiddenContent.scrollHeight;
                    hiddenContent.style.maxHeight = contentHeight + 'px';
                    hiddenContent.style.transition = 'max-height 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
                }, 10);

                readMoreBtn.innerHTML = `
                    <span>Read Less</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                    </svg>
                `;
                readMoreBtn.setAttribute('aria-expanded', 'true');

                setTimeout(() => {
                    readMoreBtn.scrollIntoView({
                        behavior: 'smooth',
                        block: 'nearest'
                    });
                }, 400);

            } else {
                hiddenContent.style.maxHeight = hiddenContent.scrollHeight + 'px';

                setTimeout(() => {
                    hiddenContent.style.maxHeight = '0';
                    setTimeout(() => {
                        hiddenContent.classList.remove('active');
                    }, 500);
                }, 10);

                readMoreBtn.innerHTML = `
                    <span>Read More</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                `;
                readMoreBtn.setAttribute('aria-expanded', 'false');
            }

            this.physics.fadeInWithPhysics(readMoreBtn, 0);
        };

        readMoreBtn.addEventListener('click', (e) => {
            e.preventDefault();
            toggleContent(!this.isExpanded);
        });

        readMoreBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleContent(!this.isExpanded);
            }
        });

        hiddenContent.style.maxHeight = '0';
        hiddenContent.style.overflow = 'hidden';
        hiddenContent.style.transition = 'max-height 0.5s cubic-bezier(0.4, 0, 0.2, 1)';

        this.readMoreBtn = readMoreBtn;
        this.hiddenContent = hiddenContent;
        this.toggleContent = toggleContent;
    }

    destroy() {
        if (this.readMoreBtn) {
            this.readMoreBtn.removeEventListener('click', this.toggleContent);
            this.readMoreBtn.removeEventListener('keydown', this.toggleContent);
        }
    }
}

export class PageTransitions {
    constructor() {
        this.initPageTransitions();
    }

    initPageTransitions() {
        // Add smooth page transition styles
        const style = document.createElement('style');
        style.textContent = `
            .page-transition {
                opacity: 0;
                transform: translateY(20px);
                transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            }
            
            .page-transition.visible {
                opacity: 1;
                transform: translateY(0);
            }
            
            @media (prefers-reduced-motion: reduce) {
                .page-transition {
                    transition: opacity 0.3s ease;
                }
            }
        `;
        document.head.appendChild(style);
    }

    animateSections(selector = 'section, .about-content, .quotes-container') {
        const sections = document.querySelectorAll(selector);

        sections.forEach((section, index) => {
            section.classList.add('page-transition');

            setTimeout(() => {
                section.classList.add('visible');
            }, 100 + (index * 150));
        });
    }
}

export class QuoteAPI {
    constructor() {
        this._initialized = false;
        this._instances = new Map();
        this._version = '1.0.0';
    }

    init(config = {}) {
        if (this._initialized) {
            console.warn('QuoteAPI already initialized');
            return this;
        }

        this.config = {
            container: config.container || '.quotes-container',
            animationEnabled: config.animationEnabled !== false,
            maxQuotes: config.maxQuotes || null,
            filter: config.filter || null,
            autoInit: config.autoInit !== false,
            ...config
        };

        this._validateConfig();
        this._initialized = true;
        
        if (this.config.autoInit) {
            this._autoInitStyles();
        }
        
        return this;
    }

    _validateConfig() {
        if (this.config.container && typeof this.config.container !== 'string') {
            throw new Error('Container must be a CSS selector string');
        }
        
        if (this.config.maxQuotes && (typeof this.config.maxQuotes !== 'number' || this.config.maxQuotes < 1)) {
            throw new Error('maxQuotes must be a positive number');
        }
        
        if (this.config.filter && typeof this.config.filter !== 'function') {
            throw new Error('Filter must be a function');
        }
    }

    _autoInitStyles() {
        if (!document.querySelector('#eldrex-quotes-styles')) {
            const style = document.createElement('style');
            style.id = 'eldrex-quotes-styles';
            style.textContent = `
                .quote {
                    background: white;
                    border-radius: 12px;
                    padding: 1.5rem;
                    margin: 1rem 0;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
                    transition: all 0.3s ease;
                    border-left: 4px solid #3b82f6;
                }
                
                .quote-content {
                    position: relative;
                }
                
                .quote-text {
                    font-size: 1.1rem;
                    line-height: 1.6;
                    color: #333;
                    margin-bottom: 0.5rem;
                    font-style: italic;
                }
                
                .quote-author {
                    font-weight: 600;
                    color: #3b82f6;
                    font-size: 0.9rem;
                }
                
                .quotes-container {
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 2rem;
                }
            `;
            document.head.appendChild(style);
        }
    }

    getAllQuotes() {
        return JSON.parse(JSON.stringify(contentData.quotes)); // Deep clone
    }

    getRandomQuote() {
        const randomIndex = Math.floor(Math.random() * contentData.quotes.length);
        return { ...contentData.quotes[randomIndex] };
    }

    getQuotesByFilter(filterFn) {
        if (typeof filterFn !== 'function') {
            throw new Error('Filter must be a function');
        }
        return contentData.quotes.filter(filterFn).map(quote => ({ ...quote }));
    }

    searchQuotes(searchTerm) {
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
        
        const quoteManager = new QuoteManager();
        const targetContainer = typeof container === 'string' ? 
            document.querySelector(container) : container;
        
        if (!targetContainer) {
            throw new Error(`Container not found: ${container}`);
        }

        const instanceId = Symbol('quoteInstance');
        this._instances.set(instanceId, { 
            quoteManager, 
            container: targetContainer,
            type: 'quotes'
        });

        let quotesToDisplay = contentData.quotes;
        
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
        for (const [instanceId, instance] of this._instances) {
            this.cleanup(instanceId);
        }
        this._initialized = false;
        this._instances.clear();
    }

    getVersion() {
        return this._version;
    }

    isInitialized() {
        return this._initialized;
    }

    _ensureInitialized() {
        if (!this._initialized) {
            throw new Error('QuoteAPI not initialized. Call init() first.');
        }
    }
}

export const utils = {
    getVersion: () => '1.0.0',
    validateQuote: (quote) => {
        return quote && 
               typeof quote.text === 'string' && 
               typeof quote.author === 'string' &&
               quote.text.length > 0 &&
               quote.author.length > 0;
    },
    formatQuote: (quote, template = '"{text}" — {author}') => {
        return template
            .replace('{text}', quote.text)
            .replace('{author}', quote.author);
    }
};

export default QuoteAPI;