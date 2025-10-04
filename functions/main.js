// Enhanced Physics-Based Animations & Interactive Functions
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components with enhanced performance
    initEnhancedBottomSheets();
    initMemberCards();
    initImageGallery();
    initContentProtection();
    initFooterAnimation();
    initParticleSystem();
    initSmoothScrolling();
    
    // Load smooth entrance animations
    setTimeout(() => {
        const profilePicture = document.getElementById('profile-picture');
        if (profilePicture) profilePicture.classList.add('loaded');

        // Enhanced link animations with physics
        document.querySelectorAll('.link-item').forEach((item, index) => {
            setTimeout(() => {
                if (typeof gsap !== 'undefined') {
                    gsap.fromTo(item, {
                        opacity: 0,
                        y: 30,
                        scale: 0.9
                    }, {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        duration: 0.7,
                        delay: index * 0.08,
                        ease: "back.out(1.4)",
                        clearProps: "all"
                    });
                }
            }, 150);
        });
    }, 300);
});

// Enhanced Bottom Sheets with Liquid Animations
function initEnhancedBottomSheets() {
    const profilePicture = document.getElementById('profile-picture');
    const squadLink = document.getElementById('squad-link');
    const profileSheet = document.getElementById('profile-sheet');
    const squadSheet = document.getElementById('squad-sheet');
    const overlay = document.getElementById('overlay');
    const closeButtons = document.querySelectorAll('.close-sheet');
    
    let activeSheet = null;
    let isAnimating = false;

    // Enhanced profile sheet opening with morph animation
    if (profilePicture && profileSheet) {
        profilePicture.addEventListener('click', function(e) {
            if (isAnimating) return;
            openSheetWithLiquidMorph(profilePicture, profileSheet);
        });
    }

    // Enhanced squad sheet opening with optimized particles
    if (squadLink && squadSheet) {
        squadLink.addEventListener('click', function(e) {
            e.preventDefault();
            if (isAnimating) return;
            openSheetWithLiquidParticles(squadLink, squadSheet);
        });
    }

    // Enhanced close functionality
    function closeActiveSheet() {
        if (!activeSheet || isAnimating) return;
        
        isAnimating = true;
        
        if (typeof gsap !== 'undefined') {
            gsap.to(activeSheet, {
                y: '100%',
                duration: 0.6,
                ease: "power3.inOut",
                onComplete: () => {
                    activeSheet.classList.remove('active');
                    overlay.classList.remove('active');
                    document.body.style.overflow = '';
                    activeSheet = null;
                    isAnimating = false;
                }
            });
            
            gsap.to(overlay, {
                opacity: 0,
                duration: 0.4,
                ease: "power2.out"
            });
        } else {
            // Fallback
            activeSheet.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
            activeSheet = null;
            isAnimating = false;
        }
    }

    // Close buttons
    if (closeButtons) {
        closeButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                closeActiveSheet();
            });
        });
    }

    // Close with overlay click
    if (overlay) {
        overlay.addEventListener('click', function() {
            closeActiveSheet();
        });
    }

    // Prevent closing when clicking inside sheets
    [profileSheet, squadSheet].forEach(sheet => {
        if (sheet) {
            sheet.addEventListener('click', function(e) {
                e.stopPropagation();
            });
        }
    });

    // Liquid morph animation function
    function openSheetWithLiquidMorph(triggerElement, sheetElement) {
        isAnimating = true;
        const rect = triggerElement.getBoundingClientRect();
        
        // Create liquid morph element
        const liquidElement = document.createElement('div');
        liquidElement.className = 'liquid-morph-element';
        liquidElement.style.cssText = `
            position: fixed;
            width: ${rect.width}px;
            height: ${rect.height}px;
            left: ${rect.left}px;
            top: ${rect.top}px;
            border-radius: 50%;
            background: linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.1));
            backdrop-filter: blur(20px);
            z-index: 1001;
            pointer-events: none;
            transform-origin: center;
        `;
        document.body.appendChild(liquidElement);

        // Liquid physics animation
        if (typeof gsap !== 'undefined') {
            const timeline = gsap.timeline({
                onComplete: () => {
                    sheetElement.classList.add('active');
                    overlay.classList.add('active');
                    document.body.style.overflow = 'hidden';
                    activeSheet = sheetElement;
                    
                    // Liquid sheet entrance
                    gsap.fromTo(sheetElement, {
                        y: '100%',
                        scaleY: 0.8
                    }, {
                        y: '0%',
                        scaleY: 1,
                        duration: 0.8,
                        ease: "elastic.out(1, 0.5)",
                        onComplete: () => {
                            isAnimating = false;
                        }
                    });
                    
                    gsap.fromTo(overlay, {
                        opacity: 0
                    }, {
                        opacity: 1,
                        duration: 0.5,
                        ease: "power2.out"
                    });
                    
                    liquidElement.remove();
                }
            });

            timeline.to(liquidElement, {
                width: '100%',
                height: '90vh',
                left: 0,
                top: '10%',
                borderRadius: '28px 28px 0 0',
                duration: 0.9,
                ease: "expo.inOut"
            }, 0);

            timeline.to(liquidElement, {
                scale: 1.02,
                duration: 0.2,
                ease: "power2.inOut",
                yoyo: true,
                repeat: 1
            }, 0.4);
        }
    }

    // Liquid particle animation function
    function openSheetWithLiquidParticles(triggerElement, sheetElement) {
        isAnimating = true;
        const rect = triggerElement.getBoundingClientRect();
        const startX = rect.left + rect.width / 2;
        const startY = rect.top + rect.height / 2;

        // Create liquid particle burst
        createLiquidParticleBurst(startX, startY, () => {
            sheetElement.classList.add('active');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            activeSheet = sheetElement;
            
            // Liquid sheet entrance with wave effect
            if (typeof gsap !== 'undefined') {
                gsap.fromTo(sheetElement, {
                    y: '100%',
                    scaleY: 0.7
                }, {
                    y: '0%',
                    scaleY: 1,
                    duration: 0.9,
                    ease: "elastic.out(1.2, 0.6)",
                    onComplete: () => {
                        isAnimating = false;
                    }
                });
                
                // Wave effect on content
                gsap.fromTo(sheetElement.querySelectorAll('.squad-card, .detail-item'), {
                    y: 30,
                    opacity: 0
                }, {
                    y: 0,
                    opacity: 1,
                    duration: 0.6,
                    stagger: 0.1,
                    ease: "back.out(1.2)"
                });
                
                gsap.fromTo(overlay, {
                    opacity: 0
                }, {
                    opacity: 1,
                    duration: 0.5,
                    ease: "power2.out"
                });
            } else {
                isAnimating = false;
            }
        });
    }
}

// Liquid Particle System
function createLiquidParticleBurst(x, y, callback) {
    const burst = document.createElement('div');
    burst.className = 'liquid-particle-burst';
    burst.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        pointer-events: none;
        z-index: 1002;
    `;
    document.body.appendChild(burst);

    const particleCount = 16;
    let completedParticles = 0;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'liquid-particle';
        particle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.3) 70%);
            border-radius: 50%;
            pointer-events: none;
            opacity: 0;
            filter: blur(0.5px);
        `;
        burst.appendChild(particle);

        const angle = Math.random() * Math.PI * 2;
        const distance = 40 + Math.random() * 50;
        const duration = 0.5 + Math.random() * 0.4;

        if (typeof gsap !== 'undefined') {
            const timeline = gsap.timeline({
                onComplete: () => {
                    completedParticles++;
                    if (completedParticles === particleCount) {
                        burst.remove();
                        if (callback) callback();
                    }
                }
            });

            timeline.to(particle, {
                x: Math.cos(angle) * distance,
                y: Math.sin(angle) * distance,
                opacity: 1,
                scale: 1.5,
                duration: duration * 0.4,
                ease: "power2.out"
            });

            timeline.to(particle, {
                opacity: 0,
                scale: 0,
                duration: duration * 0.6,
                ease: "power2.in"
            }, `-=${duration * 0.3}`);
        } else {
            setTimeout(() => {
                burst.remove();
                if (callback) callback();
            }, 600);
        }
    }
}

// Initialize optimized particle system
function initParticleSystem() {
    // Add CSS for liquid particles
    const particleStyles = `
        .liquid-particle {
            will-change: transform, opacity;
        }
        .liquid-particle-burst {
            will-change: transform;
        }
        .liquid-morph-element {
            will-change: transform, width, height, border-radius;
        }
    `;
    const styleSheet = document.createElement('style');
    styleSheet.textContent = particleStyles;
    document.head.appendChild(styleSheet);
}

// Enhanced Member Cards with Liquid Physics
function initMemberCards() {
    const memberCards = document.querySelectorAll('.member-card');
    const scrollContainer = document.querySelector('.members-scroll-container');

    if (memberCards.length > 0 && scrollContainer) {
        // Enhanced card interactions
        memberCards.forEach((card, index) => {
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'button');
            
            const nameElement = card.querySelector('p');
            if (nameElement) {
                card.setAttribute('aria-label', `View ${nameElement.textContent}'s profile`);
            }

            // Liquid physics click animation
            card.addEventListener('click', function(e) {
                if (e.key && e.key !== 'Enter' && e.key !== ' ') return;
                
                // Liquid ripple effect
                createLiquidRippleEffect(e, this);
                
                // Scale animation with liquid feel
                if (typeof gsap !== 'undefined') {
                    gsap.to(this, {
                        scale: 0.92,
                        duration: 0.15,
                        ease: "power2.inOut",
                        yoyo: true,
                        repeat: 1
                    });
                }
                
                showMemberDetails(this);
            });

            // Liquid hover effects
            card.addEventListener('mouseenter', function() {
                if (typeof gsap !== 'undefined') {
                    gsap.to(this, {
                        scale: 1.08,
                        y: -5,
                        duration: 0.3,
                        ease: "elastic.out(1, 0.5)"
                    });
                }
            });

            card.addEventListener('mouseleave', function() {
                if (typeof gsap !== 'undefined') {
                    gsap.to(this, {
                        scale: 1,
                        y: 0,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                }
            });

            // Keyboard support
            card.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    showMemberDetails(this);
                }
            });
        });

        // Enhanced scroll container with liquid momentum
        initLiquidMomentumScroll(scrollContainer);
    }
}

// Liquid Momentum-based scrolling
function initLiquidMomentumScroll(container) {
    let isDragging = false;
    let startX, scrollLeft, velocity = 0;
    let rafId;
    let lastTime = 0;

    const handleMouseDown = (e) => {
        isDragging = true;
        startX = e.pageX - container.offsetLeft;
        scrollLeft = container.scrollLeft;
        velocity = 0;
        lastTime = performance.now();
        container.style.cursor = 'grabbing';
        container.style.userSelect = 'none';
        
        cancelAnimationFrame(rafId);
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        
        const currentTime = performance.now();
        const deltaTime = currentTime - lastTime;
        lastTime = currentTime;
        
        const x = e.pageX - container.offsetLeft;
        const walk = (x - startX) * 2.5; // Increased sensitivity
        const prevScrollLeft = container.scrollLeft;
        
        container.scrollLeft = scrollLeft - walk;
        velocity = (container.scrollLeft - prevScrollLeft) / deltaTime;
    };

    const handleMouseUp = () => {
        isDragging = false;
        container.style.cursor = 'grab';
        container.style.removeProperty('user-select');
        
        // Apply liquid momentum
        applyLiquidMomentum();
    };

    const applyLiquidMomentum = (currentTime = performance.now()) => {
        if (!isDragging) {
            velocity *= 0.92; // Liquid friction
            
            if (Math.abs(velocity) > 0.1) {
                container.scrollLeft += velocity * 16;
                rafId = requestAnimationFrame(applyLiquidMomentum);
            } else {
                // Snap to nearest card
                const cardWidth = 95; // Approximate card width + margin
                const currentScroll = container.scrollLeft;
                const targetScroll = Math.round(currentScroll / cardWidth) * cardWidth;
                
                if (Math.abs(targetScroll - currentScroll) > 1) {
                    gsap.to(container, {
                        scrollLeft: targetScroll,
                        duration: 0.4,
                        ease: "power2.out"
                    });
                }
            }
        }
    };

    // Mouse events
    container.addEventListener('mousedown', handleMouseDown);
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseUp);
    container.addEventListener('mouseup', handleMouseUp);

    // Touch events with improved sensitivity
    container.addEventListener('touchstart', (e) => {
        isDragging = true;
        startX = e.touches[0].pageX - container.offsetLeft;
        scrollLeft = container.scrollLeft;
        velocity = 0;
        lastTime = performance.now();
    });

    container.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const x = e.touches[0].pageX - container.offsetLeft;
        const walk = (x - startX) * 2.5;
        container.scrollLeft = scrollLeft - walk;
    });

    container.addEventListener('touchend', handleMouseUp);
}

// Liquid Ripple effect for interactions
function createLiquidRippleEffect(event, element) {
    const ripple = document.createElement('div');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: radial-gradient(circle, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 70%);
        border-radius: 50%;
        transform: scale(0);
        pointer-events: none;
        filter: blur(1px);
    `;
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    if (typeof gsap !== 'undefined') {
        gsap.to(ripple, {
            scale: 2,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out",
            onComplete: () => ripple.remove()
        });
    } else {
        setTimeout(() => ripple.remove(), 800);
    }
}

// Enhanced Image Gallery with Liquid Scrolling
function initImageGallery() {
    const gallery = document.querySelector('.image-scroll-gallery');
    const scrollContainer = document.querySelector('.scroll-container');
    const leftBtn = document.querySelector('.scroll-btn.left');
    const rightBtn = document.querySelector('.scroll-btn.right');

    if (!gallery || !scrollContainer || !leftBtn || !rightBtn) return;

    // Liquid scroll with physics
    leftBtn.addEventListener('click', () => {
        smoothLiquidScroll(gallery, -400);
    });

    rightBtn.addEventListener('click', () => {
        smoothLiquidScroll(gallery, 400);
    });

    function smoothLiquidScroll(element, amount) {
        const start = element.scrollLeft;
        const target = start + amount;
        
        if (typeof gsap !== 'undefined') {
            gsap.to(element, {
                scrollLeft: target,
                duration: 0.8,
                ease: "power2.inOut",
                onUpdate: function() {
                    // Add parallax effect to gallery items
                    const progress = this.progress();
                    const items = element.querySelectorAll('.gallery-item');
                    items.forEach((item, index) => {
                        const itemProgress = (index / items.length) * 2 - 1;
                        const parallax = Math.sin(progress * Math.PI) * itemProgress * 10;
                        gsap.to(item, {
                            x: parallax,
                            duration: 0.1,
                            ease: "power1.out"
                        });
                    });
                }
            });
        } else {
            element.scrollBy({
                left: amount,
                behavior: 'smooth'
            });
        }
    }

    // Enhanced scroll button visibility with liquid transitions
    function updateScrollButtons() {
        const scrollLeft = gallery.scrollLeft;
        const maxScroll = gallery.scrollWidth - gallery.clientWidth;

        if (typeof gsap !== 'undefined') {
            gsap.to(leftBtn, {
                opacity: scrollLeft > 0 ? 1 : 0.3,
                scale: scrollLeft > 0 ? 1.1 : 1,
                duration: 0.3,
                ease: "power2.out"
            });
            gsap.to(rightBtn, {
                opacity: scrollLeft < maxScroll - 5 ? 1 : 0.3,
                scale: scrollLeft < maxScroll - 5 ? 1.1 : 1,
                duration: 0.3,
                ease: "power2.out"
            });
        } else {
            leftBtn.style.opacity = scrollLeft > 0 ? '1' : '0.3';
            rightBtn.style.opacity = scrollLeft < maxScroll - 5 ? '1' : '0.3';
        }
    }

    gallery.addEventListener('scroll', updateScrollButtons);
    window.addEventListener('resize', updateScrollButtons);
    updateScrollButtons();

    // Add hover effects to gallery items
    const galleryItems = scrollContainer.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            if (typeof gsap !== 'undefined') {
                gsap.to(this, {
                    scale: 1.05,
                    y: -5,
                    duration: 0.3,
                    ease: "back.out(1.2)"
                });
            }
        });

        item.addEventListener('mouseleave', function() {
            if (typeof gsap !== 'undefined') {
                gsap.to(this, {
                    scale: 1,
                    y: 0,
                    duration: 0.3,
                    ease: "power2.out"
                });
            }
        });
    });
}

// Enhanced Content Protection
function initContentProtection() {
    // Enhanced anti-copy CSS
    const antiCopyCSS = `
        body {
            user-select: none;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
        }
        
        img {
            pointer-events: none;
            -webkit-touch-callout: none;
            -webkit-user-drag: none;
        }
        
        .gallery-item {
            position: relative;
        }
        
        .image-unavailable {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: white;
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none;
            border-radius: 12px;
        }
        
        .gallery-item:hover .image-unavailable {
            opacity: 1;
        }
    `;

    const antiCopyStyle = document.createElement('style');
    antiCopyStyle.textContent = antiCopyCSS;
    document.head.appendChild(antiCopyStyle);

    // Enhanced event listeners
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        showProtectionMessage('Restricted Action');
        return false;
    });

    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey && (e.key === 'c' || e.key === 'C' || e.key === 'x' || e.key === 'X' || e.key === 'a' || e.key === 'A')) || 
            e.key === 'F12' || 
            (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j'))) {
            e.preventDefault();
            showProtectionMessage('This action is restricted');
        }
    });

    function showProtectionMessage(text) {
        const message = document.createElement('div');
        message.textContent = text;
        message.style.cssText = `
            position: fixed;
top: 20px;
right: 20px;
color: white;
padding: 12px 10px;
border-radius: 30px;
z-index: 10000;
font-size: 12px;

/* Glassy red tint */
background: rgba(255, 0, 0, 0.25); /* red tint with transparency */
backdrop-filter: blur(6px) saturate(160%);
-webkit-backdrop-filter: blur(6px) saturate(160%);

/* Subtle 3D edges */
box-shadow:
    inset 0.5px 1px 0 rgba(255, 255, 255, 0.2),
    inset -1px -1.5px 0 rgba(0, 0, 0, 0.05),
    0 1px 1.5px rgba(0, 0, 0, 0.08),
    0 2px 4px rgba(0, 0, 0, 0.06);

transform: translateX(100px);
opacity: 0;
        `;
        document.body.appendChild(message);
        
        if (typeof gsap !== 'undefined') {
            gsap.to(message, {
                x: 0,
                opacity: 1,
                duration: 0.4,
                ease: "back.out(1.2)"
            });
            
            setTimeout(() => {
                gsap.to(message, {
                    x: 100,
                    opacity: 0,
                    duration: 0.5,
                    onComplete: () => message.remove()
                });
            }, 2000);
        } else {
            setTimeout(() => message.remove(), 2000);
        }
    }
}

// Enhanced Footer Animation (Preserved as requested)
function initFooterAnimation() {
    const footer = document.getElementById('pageFooter');
    if (!footer) return;

    // Enhanced mouse tracking with liquid physics
    let mouseX = 0, mouseY = 0;
    let targetX = 0, targetY = 0;

    document.addEventListener('mousemove', function(e) {
        targetX = e.clientX;
        targetY = e.clientY;
    });

    // Smooth interpolation for mouse movement
    function updateMousePosition() {
        mouseX += (targetX - mouseX) * 0.08; // Slower for liquid feel
        mouseY += (targetY - mouseY) * 0.08;
        
        const footerRect = footer.getBoundingClientRect();
        const relativeX = mouseX - footerRect.left;
        const relativeY = mouseY - footerRect.top;
        
        footer.style.setProperty('--mouse-x', relativeX + 'px');
        footer.style.setProperty('--mouse-y', relativeY + 'px');
        
        requestAnimationFrame(updateMousePosition);
    }
    
    updateMousePosition();

    // Enhanced footer entrance with liquid animation
    window.addEventListener('load', function() {
        setTimeout(() => {
            if (typeof gsap !== 'undefined') {
                gsap.to(footer, {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    ease: "elastic.out(1.2, 0.5)"
                });
            } else {
                footer.style.transform = 'translateY(0)';
                footer.style.opacity = '1';
            }
        }, 500);
    });
}

// Smooth Scrolling for Entire Page
function initSmoothScrolling() {
    let currentScroll = 0;
    let targetScroll = 0;
    let rafId = null;
    const ease = 0.08;

    function smoothScroll() {
        currentScroll += (targetScroll - currentScroll) * ease;
        window.scrollTo(0, currentScroll);
        
        if (Math.abs(targetScroll - currentScroll) > 0.5) {
            rafId = requestAnimationFrame(smoothScroll);
        }
    }

    window.addEventListener('scroll', () => {
        targetScroll = window.scrollY;
        if (!rafId) {
            rafId = requestAnimationFrame(smoothScroll);
        }
    }, { passive: true });

    // Enhanced link hover effects
    document.querySelectorAll('.link-item').forEach(link => {
        link.addEventListener('mouseenter', function() {
            if (typeof gsap !== 'undefined') {
                gsap.to(this, {
                    y: -3,
                    scale: 1.02,
                    duration: 0.3,
                    ease: "back.out(1.2)"
                });
            }
        });

        link.addEventListener('mouseleave', function() {
            if (typeof gsap !== 'undefined') {
                gsap.to(this, {
                    y: 0,
                    scale: 1,
                    duration: 0.3,
                    ease: "power2.out"
                });
            }
        });
    });
}

// Enhanced member details function
function showMemberDetails(card) {
    const memberName = card.querySelector('p');
    if (memberName) {
        console.log('Viewing details for:', memberName.textContent);
        // Enhanced member detail logic can be added here
        
        // Add liquid feedback
        if (typeof gsap !== 'undefined') {
            gsap.to(card, {
                scale: 0.95,
                duration: 0.1,
                yoyo: true,
                repeat: 1,
                ease: "power2.inOut"
            });
        }
    }
}

// Performance optimization
window.addEventListener('load', function() {
    // Clean up any unused resources
    setTimeout(() => {
        if (typeof gsap !== 'undefined') {
            gsap.ticker.lagSmoothing(1000, 16);
        }
    }, 1000);
});

// Handle page visibility changes for performance
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Page is hidden, reduce animations for performance
        if (typeof gsap !== 'undefined') {
            gsap.ticker.lagSmoothing(0);
        }
    } else {
        // Page is visible, restore normal operation
        if (typeof gsap !== 'undefined') {
            gsap.ticker.lagSmoothing(1000, 16);
        }
    }
});

// Enhanced touch device support
function initTouchOptimizations() {
    // Add touch-specific styles
    const touchStyles = `
        @media (hover: none) and (pointer: coarse) {
            .link-item, .member-card {
                min-height: 44px;
                min-width: 44px;
            }
            
            .haptic-link:active {
                transform: scale(0.95);
                transition: transform 0.1s ease;
            }
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = touchStyles;
    document.head.appendChild(styleSheet);
}

// Initialize touch optimizations
initTouchOptimizations();