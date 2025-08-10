// Bottom Sheets Functionality
function initBottomSheets() {
    const profilePicture = document.getElementById('profile-picture');
    const squadLink = document.getElementById('squad-link');
    const profileSheet = document.getElementById('profile-sheet');
    const squadSheet = document.getElementById('squad-sheet');
    const overlay = document.getElementById('overlay');
    const closeButtons = document.querySelectorAll('.close-sheet');

    // Open profile sheet with morph animation
    if (profilePicture && profileSheet) {
        profilePicture.addEventListener('click', function(e) {
            const rect = profilePicture.getBoundingClientRect();
            const startX = rect.left + rect.width / 2;
            const startY = rect.top + rect.height / 2;

            // Create morph element
            const morphElement = document.createElement('div');
            morphElement.className = 'morph-element';
            morphElement.style.position = 'fixed';
            morphElement.style.width = rect.width + 'px';
            morphElement.style.height = rect.height + 'px';
            morphElement.style.left = rect.left + 'px';
            morphElement.style.top = rect.top + 'px';
            morphElement.style.borderRadius = '50%';
            morphElement.style.backgroundColor = getComputedStyle(profilePicture).backgroundColor;
            morphElement.style.zIndex = '1001';
            document.body.appendChild(morphElement);

            // Animate to sheet position
            gsap.to(morphElement, {
                width: '100%',
                height: '90vh',
                left: 0,
                top: window.innerHeight * 0.1,
                borderRadius: '28px 28px 0 0',
                duration: 0.8,
                ease: "expo.inOut",
                onComplete: () => {
                    profileSheet.classList.add('active');
                    overlay.classList.add('active');
                    document.body.style.overflow = 'hidden';
                    morphElement.remove();
                }
            });
        });
    }

    // Open squad sheet
    if (squadLink && squadSheet) {
        squadLink.addEventListener('click', function(e) {
            e.preventDefault();
            const rect = squadLink.getBoundingClientRect();
            const startX = rect.left + rect.width / 2;
            const startY = rect.top + rect.height / 2;

            // Create particle burst
            createParticleBurst(startX, startY, () => {
                squadSheet.classList.add('active');
                overlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });
    }

    // Close sheets
    if (closeButtons) {
        closeButtons.forEach(button => {
            button.addEventListener('click', function() {
                if (profileSheet) profileSheet.classList.remove('active');
                if (squadSheet) squadSheet.classList.remove('active');
                if (overlay) overlay.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // Close with overlay click
    if (overlay) {
        overlay.addEventListener('click', function() {
            if (profileSheet) profileSheet.classList.remove('active');
            if (squadSheet) squadSheet.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    // Prevent closing when clicking inside sheet
    if (profileSheet) {
        profileSheet.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }

    if (squadSheet) {
        squadSheet.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
}

// Create particle burst animation
function createParticleBurst(x, y, callback) {
    const burst = document.createElement('div');
    burst.className = 'particle-burst';
    burst.style.left = x + 'px';
    burst.style.top = y + 'px';
    document.body.appendChild(burst);

    const particleCount = 20;
    const colors = ['#0071e3', '#34aadc', '#5ac8fa', '#ffffff'];

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        burst.appendChild(particle);

        const angle = Math.random() * Math.PI * 2;
        const distance = 50 + Math.random() * 50;
        const duration = 0.5 + Math.random() * 0.5;

        gsap.fromTo(particle, {
            x: 0,
            y: 0,
            opacity: 1,
            scale: 1
        }, {
            x: Math.cos(angle) * distance,
            y: Math.sin(angle) * distance,
            opacity: 0,
            scale: 0,
            duration: duration,
            ease: "power2.out",
            onComplete: () => {
                if (i === particleCount - 1) {
                    burst.remove();
                    if (callback) callback();
                }
            }
        });
    }
}

// Member Cards Functionality
function initMemberCards() {
    const memberCards = document.querySelectorAll('.member-card');
    const scrollContainer = document.querySelector('.members-scroll-container');

    if (memberCards.length > 0 && scrollContainer) {
        memberCards.forEach((card, index) => {
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'button');
            const nameElement = card.querySelector('p');
            if (nameElement) {
                card.setAttribute('aria-label', `View ${nameElement.textContent}'s profile`);
            }

            // Click handler
            card.addEventListener('click', function(e) {
                if (e.key && e.key !== 'Enter' && e.key !== ' ') return;
                showMemberDetails(this);
            });

            // Keyboard support
            card.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    showMemberDetails(this);
                }
            });
        });

        // Make scroll container keyboard navigable
        scrollContainer.setAttribute('tabindex', '0');
        scrollContainer.setAttribute('role', 'region');
        scrollContainer.setAttribute('aria-label', 'Squad members list');

        // Keyboard scroll
        scrollContainer.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowLeft') {
                this.scrollBy({
                    left: -100,
                    behavior: 'smooth'
                });
            } else if (e.key === 'ArrowRight') {
                this.scrollBy({
                    left: 100,
                    behavior: 'smooth'
                });
            }
        });

        // Improved drag scrolling with better accessibility
        let isDragging = false;
        let startX, scrollLeft;

        // Mouse events
        scrollContainer.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.pageX - scrollContainer.offsetLeft;
            scrollLeft = scrollContainer.scrollLeft;
            scrollContainer.style.cursor = 'grabbing';
            scrollContainer.style.userSelect = 'none';
        });

        scrollContainer.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const x = e.pageX - scrollContainer.offsetLeft;
            const walk = (x - startX) * 2;
            scrollContainer.scrollLeft = scrollLeft - walk;
        });

        const endDrag = () => {
            isDragging = false;
            scrollContainer.style.cursor = 'grab';
            scrollContainer.style.removeProperty('user-select');
        };

        scrollContainer.addEventListener('mouseleave', endDrag);
        scrollContainer.addEventListener('mouseup', endDrag);

        // Touch events
        scrollContainer.addEventListener('touchstart', (e) => {
            isDragging = true;
            startX = e.touches[0].pageX - scrollContainer.offsetLeft;
            scrollLeft = scrollContainer.scrollLeft;
        });

        scrollContainer.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            const x = e.touches[0].pageX - scrollContainer.offsetLeft;
            const walk = (x - startX) * 2;
            scrollContainer.scrollLeft = scrollLeft - walk;
        });

        scrollContainer.addEventListener('touchend', endDrag);
    }
}

// Function to handle member selection
function showMemberDetails(card) {
    const memberName = card.querySelector('p');
    if (memberName) {
        console.log('Viewing details for:', memberName.textContent);
        // Implement your member detail view logic here
        // Could open a modal or update another part of the UI
    }
}

// Image Gallery Functionality
function initImageGallery() {
    const gallery = document.querySelector('.image-scroll-gallery');
    const scrollContainer = document.querySelector('.scroll-container');
    const leftBtn = document.querySelector('.scroll-btn.left');
    const rightBtn = document.querySelector('.scroll-btn.right');

    if (!gallery || !scrollContainer || !leftBtn || !rightBtn) return;

    // Scroll buttons functionality
    leftBtn.addEventListener('click', () => {
        gallery.scrollBy({
            left: -300,
            behavior: 'smooth'
        });
    });

    rightBtn.addEventListener('click', () => {
        gallery.scrollBy({
            left: 300,
            behavior: 'smooth'
        });
    });

    // Hide/show scroll buttons based on scroll position
    function updateScrollButtons() {
        const scrollLeft = gallery.scrollLeft;
        const maxScroll = gallery.scrollWidth - gallery.clientWidth;

        leftBtn.style.visibility = scrollLeft > 0 ? 'visible' : 'hidden';
        rightBtn.style.visibility = scrollLeft < maxScroll - 5 ? 'visible' : 'hidden';
    }

    gallery.addEventListener('scroll', updateScrollButtons);
    window.addEventListener('resize', updateScrollButtons);

    // Initialize button visibility
    updateScrollButtons();

    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!gallery) return;
        
        if (e.key === 'ArrowLeft') {
            gallery.scrollBy({
                left: -300,
                behavior: 'smooth'
            });
        } else if (e.key === 'ArrowRight') {
            gallery.scrollBy({
                left: 300,
                behavior: 'smooth'
            });
        }
    });
}

// Content Protection
function initContentProtection() {
    const antiCopyCSS = `
        body {
            user-select: none;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
        }
        
        img {
            pointer-events: none;
        }
    `;

    const antiCopyStyle = document.createElement('style');
    antiCopyStyle.textContent = antiCopyCSS;
    document.head.appendChild(antiCopyStyle);

    // Disable right-click context menu
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });

    // Disable keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey && (e.key === 'c' || e.key === 'C' || e.key === 'x' || e.key === 'X' || e.key === 'a' || e.key === 'A')) || 
            e.key === 'F12' || 
            (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j'))) {
            e.preventDefault();
            alert('Content protection is enabled');
        }
    });

    // Fallback for browsers that override user-select
    document.addEventListener('selectionchange', () => {
        const selection = window.getSelection();
        if (selection && selection.toString().length > 0) {
            selection.removeAllRanges();
        }
    });

    // Link protection
    document.querySelectorAll('a').forEach(link => {
        const realUrl = link.href;
        if (realUrl && !realUrl.startsWith('javascript:')) {
            link.dataset.url = realUrl;
            link.href = 'javascript:void(0)';
            
            link.addEventListener('click', function(e) {
                if (!e.currentTarget.dataset.lastTouch) {
                    e.currentTarget.dataset.lastTouch = 0;
                }
                
                if (e.timeStamp - e.currentTarget.dataset.lastTouch < 500) {
                    window.location.href = realUrl;
                }
                e.currentTarget.dataset.lastTouch = e.timeStamp;
            });
            
            // Prevent long press
            link.addEventListener('touchstart', function(e) {
                e.currentTarget.dataset.lastTouch = e.timeStamp;
                setTimeout(() => {
                    if (e.currentTarget.dataset.longPress) {
                        e.preventDefault();
                    }
                }, 300);
            });
            
            link.addEventListener('touchend', function(e) {
                e.currentTarget.dataset.longPress = 
                    (e.timeStamp - e.currentTarget.dataset.lastTouch > 300);
            });
        }
    });
}

// Footer Animation
function initFooterAnimation() {
    const footer = document.getElementById('pageFooter');
    if (!footer) return;

    // Add mouse position tracking for dynamic refraction effect
    document.addEventListener('mousemove', function(e) {
        const highlight = footer.querySelector('.refraction-highlight');
        
        // Get mouse position relative to footer
        const footerRect = footer.getBoundingClientRect();
        const mouseX = e.clientX - footerRect.left;
        const mouseY = e.clientY - footerRect.top;
        
        // Update CSS variables
        footer.style.setProperty('--mouse-x', mouseX + 'px');
        footer.style.setProperty('--mouse-y', mouseY + 'px');
        
        // Adjust highlight position if it exists
        if (highlight) {
            highlight.style.transform = `translate(${mouseX - 50}px, ${mouseY - 50}px)`;
        }
    });
    
    // Show footer with animation
    window.addEventListener('load', function() {
        setTimeout(() => {
            footer.style.transform = 'translateY(0)';
            footer.style.opacity = '1';
        }, 500);
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize components
    initBottomSheets();
    initMemberCards();
    initImageGallery();
    initContentProtection();
    initFooterAnimation();

    // Load animations
    setTimeout(() => {
        const profilePicture = document.getElementById('profile-picture');
        if (profilePicture) profilePicture.classList.add('loaded');
        
        document.querySelectorAll('.link-item').forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = 0;
                item.style.transform = 'translateY(20px)';
                if (typeof gsap !== 'undefined') {
                    gsap.to(item, {
                        opacity: 1,
                        y: 0,
                        duration: 0.6,
                        delay: index * 0.05,
                        ease: "back.out(1.2)"
                    });
                }
            }, 100);
        });
    }, 300);
});// Bottom Sheets Functionality
function initBottomSheets() {
    const profilePicture = document.getElementById('profile-picture');
    const squadLink = document.getElementById('squad-link');
    const profileSheet = document.getElementById('profile-sheet');
    const squadSheet = document.getElementById('squad-sheet');
    const overlay = document.getElementById('overlay');
    const closeButtons = document.querySelectorAll('.close-sheet');

    // Open profile sheet with morph animation
    if (profilePicture && profileSheet) {
        profilePicture.addEventListener('click', function(e) {
            const rect = profilePicture.getBoundingClientRect();
            const startX = rect.left + rect.width / 2;
            const startY = rect.top + rect.height / 2;

            // Create morph element
            const morphElement = document.createElement('div');
            morphElement.className = 'morph-element';
            morphElement.style.position = 'fixed';
            morphElement.style.width = rect.width + 'px';
            morphElement.style.height = rect.height + 'px';
            morphElement.style.left = rect.left + 'px';
            morphElement.style.top = rect.top + 'px';
            morphElement.style.borderRadius = '50%';
            morphElement.style.backgroundColor = getComputedStyle(profilePicture).backgroundColor;
            morphElement.style.zIndex = '1001';
            document.body.appendChild(morphElement);

            // Animate to sheet position
            gsap.to(morphElement, {
                width: '100%',
                height: '90vh',
                left: 0,
                top: window.innerHeight * 0.1,
                borderRadius: '28px 28px 0 0',
                duration: 0.8,
                ease: "expo.inOut",
                onComplete: () => {
                    profileSheet.classList.add('active');
                    overlay.classList.add('active');
                    document.body.style.overflow = 'hidden';
                    morphElement.remove();
                }
            });
        });
    }

    // Open squad sheet
    if (squadLink && squadSheet) {
        squadLink.addEventListener('click', function(e) {
            e.preventDefault();
            const rect = squadLink.getBoundingClientRect();
            const startX = rect.left + rect.width / 2;
            const startY = rect.top + rect.height / 2;

            // Create particle burst
            createParticleBurst(startX, startY, () => {
                squadSheet.classList.add('active');
                overlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });
    }

    // Close sheets
    if (closeButtons) {
        closeButtons.forEach(button => {
            button.addEventListener('click', function() {
                if (profileSheet) profileSheet.classList.remove('active');
                if (squadSheet) squadSheet.classList.remove('active');
                if (overlay) overlay.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // Close with overlay click
    if (overlay) {
        overlay.addEventListener('click', function() {
            if (profileSheet) profileSheet.classList.remove('active');
            if (squadSheet) squadSheet.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    // Prevent closing when clicking inside sheet
    if (profileSheet) {
        profileSheet.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }

    if (squadSheet) {
        squadSheet.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
}

// Create particle burst animation
function createParticleBurst(x, y, callback) {
    const burst = document.createElement('div');
    burst.className = 'particle-burst';
    burst.style.left = x + 'px';
    burst.style.top = y + 'px';
    document.body.appendChild(burst);

    const particleCount = 20;
    const colors = ['#0071e3', '#34aadc', '#5ac8fa', '#ffffff'];

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        burst.appendChild(particle);

        const angle = Math.random() * Math.PI * 2;
        const distance = 50 + Math.random() * 50;
        const duration = 0.5 + Math.random() * 0.5;

        gsap.fromTo(particle, {
            x: 0,
            y: 0,
            opacity: 1,
            scale: 1
        }, {
            x: Math.cos(angle) * distance,
            y: Math.sin(angle) * distance,
            opacity: 0,
            scale: 0,
            duration: duration,
            ease: "power2.out",
            onComplete: () => {
                if (i === particleCount - 1) {
                    burst.remove();
                    if (callback) callback();
                }
            }
        });
    }
}

// Member Cards Functionality
function initMemberCards() {
    const memberCards = document.querySelectorAll('.member-card');
    const scrollContainer = document.querySelector('.members-scroll-container');

    if (memberCards.length > 0 && scrollContainer) {
        memberCards.forEach((card, index) => {
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'button');
            const nameElement = card.querySelector('p');
            if (nameElement) {
                card.setAttribute('aria-label', `View ${nameElement.textContent}'s profile`);
            }

            // Click handler
            card.addEventListener('click', function(e) {
                if (e.key && e.key !== 'Enter' && e.key !== ' ') return;
                showMemberDetails(this);
            });

            // Keyboard support
            card.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    showMemberDetails(this);
                }
            });
        });

        // Make scroll container keyboard navigable
        scrollContainer.setAttribute('tabindex', '0');
        scrollContainer.setAttribute('role', 'region');
        scrollContainer.setAttribute('aria-label', 'Squad members list');

        // Keyboard scroll
        scrollContainer.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowLeft') {
                this.scrollBy({
                    left: -100,
                    behavior: 'smooth'
                });
            } else if (e.key === 'ArrowRight') {
                this.scrollBy({
                    left: 100,
                    behavior: 'smooth'
                });
            }
        });

        // Improved drag scrolling with better accessibility
        let isDragging = false;
        let startX, scrollLeft;

        // Mouse events
        scrollContainer.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.pageX - scrollContainer.offsetLeft;
            scrollLeft = scrollContainer.scrollLeft;
            scrollContainer.style.cursor = 'grabbing';
            scrollContainer.style.userSelect = 'none';
        });

        scrollContainer.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const x = e.pageX - scrollContainer.offsetLeft;
            const walk = (x - startX) * 2;
            scrollContainer.scrollLeft = scrollLeft - walk;
        });

        const endDrag = () => {
            isDragging = false;
            scrollContainer.style.cursor = 'grab';
            scrollContainer.style.removeProperty('user-select');
        };

        scrollContainer.addEventListener('mouseleave', endDrag);
        scrollContainer.addEventListener('mouseup', endDrag);

        // Touch events
        scrollContainer.addEventListener('touchstart', (e) => {
            isDragging = true;
            startX = e.touches[0].pageX - scrollContainer.offsetLeft;
            scrollLeft = scrollContainer.scrollLeft;
        });

        scrollContainer.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            const x = e.touches[0].pageX - scrollContainer.offsetLeft;
            const walk = (x - startX) * 2;
            scrollContainer.scrollLeft = scrollLeft - walk;
        });

        scrollContainer.addEventListener('touchend', endDrag);
    }
}

// Function to handle member selection
function showMemberDetails(card) {
    const memberName = card.querySelector('p');
    if (memberName) {
        console.log('Viewing details for:', memberName.textContent);
        // Implement your member detail view logic here
        // Could open a modal or update another part of the UI
    }
}

// Image Gallery Functionality
function initImageGallery() {
    const gallery = document.querySelector('.image-scroll-gallery');
    const scrollContainer = document.querySelector('.scroll-container');
    const leftBtn = document.querySelector('.scroll-btn.left');
    const rightBtn = document.querySelector('.scroll-btn.right');

    if (!gallery || !scrollContainer || !leftBtn || !rightBtn) return;

    // Scroll buttons functionality
    leftBtn.addEventListener('click', () => {
        gallery.scrollBy({
            left: -300,
            behavior: 'smooth'
        });
    });

    rightBtn.addEventListener('click', () => {
        gallery.scrollBy({
            left: 300,
            behavior: 'smooth'
        });
    });

    // Hide/show scroll buttons based on scroll position
    function updateScrollButtons() {
        const scrollLeft = gallery.scrollLeft;
        const maxScroll = gallery.scrollWidth - gallery.clientWidth;

        leftBtn.style.visibility = scrollLeft > 0 ? 'visible' : 'hidden';
        rightBtn.style.visibility = scrollLeft < maxScroll - 5 ? 'visible' : 'hidden';
    }

    gallery.addEventListener('scroll', updateScrollButtons);
    window.addEventListener('resize', updateScrollButtons);

    // Initialize button visibility
    updateScrollButtons();

    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!gallery) return;
        
        if (e.key === 'ArrowLeft') {
            gallery.scrollBy({
                left: -300,
                behavior: 'smooth'
            });
        } else if (e.key === 'ArrowRight') {
            gallery.scrollBy({
                left: 300,
                behavior: 'smooth'
            });
        }
    });
}

// Content Protection
function initContentProtection() {
    const antiCopyCSS = `
        body {
            user-select: none;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
        }
        
        img {
            pointer-events: none;
        }
    `;

    const antiCopyStyle = document.createElement('style');
    antiCopyStyle.textContent = antiCopyCSS;
    document.head.appendChild(antiCopyStyle);

    // Disable right-click context menu
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });

    // Disable keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey && (e.key === 'c' || e.key === 'C' || e.key === 'x' || e.key === 'X' || e.key === 'a' || e.key === 'A')) || 
            e.key === 'F12' || 
            (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j'))) {
            e.preventDefault();
            alert('Content protection is enabled');
        }
    });

    // Fallback for browsers that override user-select
    document.addEventListener('selectionchange', () => {
        const selection = window.getSelection();
        if (selection && selection.toString().length > 0) {
            selection.removeAllRanges();
        }
    });

    // Link protection
    document.querySelectorAll('a').forEach(link => {
        const realUrl = link.href;
        if (realUrl && !realUrl.startsWith('javascript:')) {
            link.dataset.url = realUrl;
            link.href = 'javascript:void(0)';
            
            link.addEventListener('click', function(e) {
                if (!e.currentTarget.dataset.lastTouch) {
                    e.currentTarget.dataset.lastTouch = 0;
                }
                
                if (e.timeStamp - e.currentTarget.dataset.lastTouch < 500) {
                    window.location.href = realUrl;
                }
                e.currentTarget.dataset.lastTouch = e.timeStamp;
            });
            
            // Prevent long press
            link.addEventListener('touchstart', function(e) {
                e.currentTarget.dataset.lastTouch = e.timeStamp;
                setTimeout(() => {
                    if (e.currentTarget.dataset.longPress) {
                        e.preventDefault();
                    }
                }, 300);
            });
            
            link.addEventListener('touchend', function(e) {
                e.currentTarget.dataset.longPress = 
                    (e.timeStamp - e.currentTarget.dataset.lastTouch > 300);
            });
        }
    });
}

// Footer Animation
function initFooterAnimation() {
    const footer = document.getElementById('pageFooter');
    if (!footer) return;

    // Add mouse position tracking for dynamic refraction effect
    document.addEventListener('mousemove', function(e) {
        const highlight = footer.querySelector('.refraction-highlight');
        
        // Get mouse position relative to footer
        const footerRect = footer.getBoundingClientRect();
        const mouseX = e.clientX - footerRect.left;
        const mouseY = e.clientY - footerRect.top;
        
        // Update CSS variables
        footer.style.setProperty('--mouse-x', mouseX + 'px');
        footer.style.setProperty('--mouse-y', mouseY + 'px');
        
        // Adjust highlight position if it exists
        if (highlight) {
            highlight.style.transform = `translate(${mouseX - 50}px, ${mouseY - 50}px)`;
        }
    });
    
    // Show footer with animation
    window.addEventListener('load', function() {
        setTimeout(() => {
            footer.style.transform = 'translateY(0)';
            footer.style.opacity = '1';
        }, 500);
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize components
    initBottomSheets();
    initMemberCards();
    initImageGallery();
    initContentProtection();
    initFooterAnimation();

    // Load animations
    setTimeout(() => {
        const profilePicture = document.getElementById('profile-picture');
        if (profilePicture) profilePicture.classList.add('loaded');
        
        document.querySelectorAll('.link-item').forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = 0;
                item.style.transform = 'translateY(20px)';
                if (typeof gsap !== 'undefined') {
                    gsap.to(item, {
                        opacity: 1,
                        y: 0,
                        duration: 0.6,
                        delay: index * 0.05,
                        ease: "back.out(1.2)"
                    });
                }
            }, 100);
        });
    }, 300);
});