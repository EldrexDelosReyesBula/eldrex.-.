        const contentData = {

            quotes: [{
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

        class PhysicsAnimation {
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

                    // Spring force calculation
                    const force = (target - position) * stiffness;
                    const acceleration = force / mass;
                    velocity = (velocity + acceleration) * damping;
                    position += velocity;

                    // Apply transformation
                    element.style.transform = `translateY(${position}px)`;

                    // Continue animation if not settled
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
            }
        }

        class QuoteManager {
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
                <div class="quote-text">"${quote.text}"</div>
                <span class="quote-author">— ${quote.author}</span>
            </div>
        `;

                // Add hover effects
                quoteElement.addEventListener('mouseenter', this.handleQuoteHover.bind(this));
                quoteElement.addEventListener('mouseleave', this.handleQuoteHoverEnd.bind(this));
                quoteElement.addEventListener('click', this.handleQuoteClick.bind(this));

                return quoteElement;
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

                // Create ripple effect
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
                if (!quotesContainer) return;

                quotesContainer.innerHTML = '';

                // Add CSS for ripple animation
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

                contentData.quotes.forEach((quote, index) => {
                    const quoteElement = this.createQuoteElement(quote, index);
                    quotesContainer.appendChild(quoteElement);
                    this.intersectionObserver.observe(quoteElement);
                });
            }
        }

        class EnhancedReadMore {
            constructor() {
                this.physics = new PhysicsAnimation();
                this.isExpanded = false;
            }

            init() {
                const readMoreBtn = document.querySelector('.read-more-btn');
                const hiddenContent = document.querySelector('.hidden-content');

                if (!readMoreBtn || !hiddenContent) return;

                const toggleContent = (expanded) => {
                    this.isExpanded = expanded;

                    if (expanded) {
                        // Expand with physics animation
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

                        // Smooth scroll to button after expansion
                        setTimeout(() => {
                            readMoreBtn.scrollIntoView({
                                behavior: 'smooth',
                                block: 'nearest'
                            });
                        }, 400);

                    } else {
                        // Collapse with physics animation
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

                    // Animate the button
                    this.physics.fadeInWithPhysics(readMoreBtn, 0);
                };

                // Click handler
                readMoreBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    toggleContent(!this.isExpanded);
                });

                // Keyboard handler
                readMoreBtn.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggleContent(!this.isExpanded);
                    }
                });

                // Initialize hidden content style
                hiddenContent.style.maxHeight = '0';
                hiddenContent.style.overflow = 'hidden';
                hiddenContent.style.transition = 'max-height 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            }
        }

        class PageTransitions {
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

            animateSections() {
                const sections = document.querySelectorAll('section, .about-content, .quotes-container');

                sections.forEach((section, index) => {
                    section.classList.add('page-transition');

                    setTimeout(() => {
                        section.classList.add('visible');
                    }, 100 + (index * 150));
                });
            }
        }

        // Enhanced initialization with error handling and performance optimization
        function init() {
            try {
                // Set current year
                const yearElement = document.getElementById('current-year');
                if (yearElement) {
                    yearElement.textContent = new Date().getFullYear();
                }

                // Initialize managers
                const quoteManager = new QuoteManager();
                const readMoreManager = new EnhancedReadMore();
                const pageTransitions = new PageTransitions();
                const physics = new PhysicsAnimation();

                // Load content with staggered animations
                setTimeout(() => {
                    // Load about sections
                    const aboutContentElements = [
                        document.getElementById('aboutContent1'),
                        document.getElementById('aboutContent2'),
                        document.getElementById('aboutContent3'),
                        document.getElementById('aboutContent4')
                    ];

                    aboutContentElements.forEach((el, index) => {
                        if (el && contentData.aboutSections[index]) {
                            el.textContent = contentData.aboutSections[index];
                            physics.fadeInWithPhysics(el, index * 0.2);
                        }
                    });

                    // Display quotes
                    quoteManager.displayQuotes();

                    // Initialize read more functionality
                    readMoreManager.init();

                    // Animate page sections
                    pageTransitions.animateSections();

                }, 100);

                // Enhanced loading screen handling
                setTimeout(() => {
                    const loadingContainer = document.querySelector('.loading-container');
                    if (loadingContainer) {
                        loadingContainer.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                        loadingContainer.style.opacity = '0';
                        loadingContainer.style.transform = 'scale(0.95)';

                        setTimeout(() => {
                            loadingContainer.classList.add('hidden');
                        }, 500);
                    }
                }, 1200);

                // Enhanced beforeunload handling
                window.addEventListener('beforeunload', () => {
                    if (document.body) {
                        document.body.style.opacity = '0';
                        document.body.style.transition = 'opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
                    }
                });

                // Add scroll performance optimization
                let ticking = false;
                window.addEventListener('scroll', () => {
                    if (!ticking) {
                        requestAnimationFrame(() => {
                            document.body.style.setProperty('--scroll-y', window.pageYOffset + 'px');
                            ticking = false;
                        });
                        ticking = true;
                    }
                }, {
                    passive: true
                });

                // Add resize handler for responsiveness
                window.addEventListener('resize', () => {
                    // Recalculate any dynamic layouts if needed
                    const readMoreContent = document.querySelector('.hidden-content');
                    if (readMoreContent && readMoreContent.classList.contains('active')) {
                        readMoreContent.style.maxHeight = readMoreContent.scrollHeight + 'px';
                    }
                });

                // Add error boundary for quotes
                window.addEventListener('error', (e) => {
                    console.error('Script error:', e.error);
                    const quotesContainer = document.querySelector('.quotes-container');
                    if (quotesContainer) {
                        quotesContainer.innerHTML = '<p class="error-message">Unable to load quotes at this time.</p>';
                    }
                });

            } catch (error) {
                console.error('Initialization error:', error);
                // Fallback: ensure basic functionality works
                const quotesContainer = document.querySelector('.quotes-container');
                if (quotesContainer) {
                    quotesContainer.innerHTML = '<p>Quotes will be available shortly.</p>';
                }
            }
        }

        // Enhanced DOM ready with loading states
        document.addEventListener('DOMContentLoaded', () => {
            // Add loading state to body
            document.body.style.opacity = '0';
            document.body.style.transition = 'opacity 0.6s ease';

            setTimeout(() => {
                init();
                document.body.style.opacity = '1';
            }, 100);
        });

        // Export for potential module usage
        if (typeof module !== 'undefined' && module.exports) {
            module.exports = {
                contentData,
                PhysicsAnimation,
                QuoteManager,
                EnhancedReadMore,
                PageTransitions
            };
        }