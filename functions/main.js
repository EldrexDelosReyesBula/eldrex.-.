/*
function initBottomSheets() {
    const profilePicture = document.getElementById('profile-picture');
    const squadLink = document.getElementById('squad-link');
    const profileSheet = document.getElementById('profile-sheet');
    const squadSheet = document.getElementById('squad-sheet');
    const overlay = document.getElementById('overlay');
    const closeButtons = document.querySelectorAll('.close-sheet');

   
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

document.addEventListener('DOMContentLoaded', function() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        const overlay = document.createElement('div');
        overlay.className = 'image-unavailable';
        overlay.innerHTML = `
            <i class="fas fa-lock"></i>
            <span>The image is temporarily unavailable. Please check back later.</span>
        `;
        item.appendChild(overlay);
        
        item.addEventListener('mousemove', (e) => {
            const rect = item.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            overlay.style.setProperty('--mouse-x', `${x}px`);
            overlay.style.setProperty('--mouse-y', `${y}px`);
        });
        
        const img = item.querySelector('img');
        img.setAttribute('draggable', 'false');
        img.style.userSelect = 'none';
        img.style.webkitUserDrag = 'none';
    });
    
    document.addEventListener('contextmenu', function(e) {
        if (e.target.closest('.gallery-item img')) {
            e.preventDefault();
            return false;
        }
    }, false);
});
*/






/*=========================================*/

// Enhanced Physics-Based Animations & Interactive Functions
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components with enhanced performance
    initEnhancedBottomSheets();
    initMemberCards();
    initImageGallery();
    initContentProtection();
    initFooterAnimation();
    initParticleSystem();
    
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

// Enhanced Bottom Sheets with Physics Animations
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
            openSheetWithMorph(profilePicture, profileSheet);
        });
    }

    // Enhanced squad sheet opening with optimized particles
    if (squadLink && squadSheet) {
        squadLink.addEventListener('click', function(e) {
            e.preventDefault();
            if (isAnimating) return;
            openSheetWithParticles(squadLink, squadSheet);
        });
    }

    // Enhanced close functionality
    function closeActiveSheet() {
        if (!activeSheet || isAnimating) return;
        
        isAnimating = true;
        
        if (typeof gsap !== 'undefined') {
            gsap.to(activeSheet, {
                y: '100%',
                duration: 0.5,
                ease: "power2.in",
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

    // Close with overlay click (preserved as requested)
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

    // Enhanced morph animation function
    function openSheetWithMorph(triggerElement, sheetElement) {
        isAnimating = true;
        const rect = triggerElement.getBoundingClientRect();
        
        // Create morph element
        const morphElement = document.createElement('div');
        morphElement.className = 'morph-element';
        morphElement.style.cssText = `
            position: fixed;
            width: ${rect.width}px;
            height: ${rect.height}px;
            left: ${rect.left}px;
            top: ${rect.top}px;
            border-radius: 50%;
            background: ${getComputedStyle(triggerElement).backgroundColor};
            z-index: 1001;
            pointer-events: none;
        `;
        document.body.appendChild(morphElement);

        // Physics-based morph animation
        if (typeof gsap !== 'undefined') {
            gsap.to(morphElement, {
                width: '100%',
                height: '90vh',
                left: 0,
                top: '10%',
                borderRadius: '28px 28px 0 0',
                duration: 0.8,
                ease: "expo.inOut",
                onComplete: () => {
                    sheetElement.classList.add('active');
                    overlay.classList.add('active');
                    document.body.style.overflow = 'hidden';
                    activeSheet = sheetElement;
                    morphElement.remove();
                    
                    // Animate sheet entrance
                    gsap.fromTo(sheetElement, {
                        y: '100%'
                    }, {
                        y: '0%',
                        duration: 0.6,
                        ease: "back.out(1.2)",
                        onComplete: () => {
                            isAnimating = false;
                        }
                    });
                    
                    gsap.fromTo(overlay, {
                        opacity: 0
                    }, {
                        opacity: 1,
                        duration: 0.4,
                        ease: "power2.out"
                    });
                }
            });
        }
    }

    // Optimized particle animation function
    function openSheetWithParticles(triggerElement, sheetElement) {
        isAnimating = true;
        const rect = triggerElement.getBoundingClientRect();
        const startX = rect.left + rect.width / 2;
        const startY = rect.top + rect.height / 2;

        // Create optimized particle burst (small white dots only)
        createOptimizedParticleBurst(startX, startY, () => {
            sheetElement.classList.add('active');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            activeSheet = sheetElement;
            
            // Enhanced sheet entrance animation
            if (typeof gsap !== 'undefined') {
                gsap.fromTo(sheetElement, {
                    y: '100%',
                    scale: 0.95
                }, {
                    y: '0%',
                    scale: 1,
                    duration: 0.7,
                    ease: "back.out(1.3)",
                    onComplete: () => {
                        isAnimating = false;
                    }
                });
                
                gsap.fromTo(overlay, {
                    opacity: 0
                }, {
                    opacity: 1,
                    duration: 0.4,
                    ease: "power2.out"
                });
            } else {
                isAnimating = false;
            }
        });
    }
}

// Optimized Particle System (Small White Dots Only)
function createOptimizedParticleBurst(x, y, callback) {
    const burst = document.createElement('div');
    burst.className = 'optimized-particle-burst';
    burst.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        pointer-events: none;
        z-index: 1002;
    `;
    document.body.appendChild(burst);

    const particleCount = 12; // Reduced for performance
    let completedParticles = 0;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'optimized-particle';
        particle.style.cssText = `
            position: absolute;
            width: 3px;
            height: 3px;
            background-color: #ffffff;
            border-radius: 50%;
            pointer-events: none;
            opacity: 0;
        `;
        burst.appendChild(particle);

        const angle = Math.random() * Math.PI * 2;
        const distance = 30 + Math.random() * 40; // Reduced distance
        const duration = 0.4 + Math.random() * 0.3; // Shorter duration

        if (typeof gsap !== 'undefined') {
            gsap.to(particle, {
                x: Math.cos(angle) * distance,
                y: Math.sin(angle) * distance,
                opacity: 1,
                scale: 1,
                duration: duration * 0.3,
                ease: "power2.out"
            });
            
            gsap.to(particle, {
                opacity: 0,
                scale: 0,
                duration: duration * 0.7,
                delay: duration * 0.3,
                ease: "power2.in",
                onComplete: () => {
                    completedParticles++;
                    if (completedParticles === particleCount) {
                        burst.remove();
                        if (callback) callback();
                    }
                }
            });
        } else {
            // Fallback
            setTimeout(() => {
                burst.remove();
                if (callback) callback();
            }, 500);
        }
    }
}

// Initialize optimized particle system
function initParticleSystem() {
    // Add CSS for optimized particles
    const particleStyles = `
        .optimized-particle {
            will-change: transform, opacity;
        }
        .optimized-particle-burst {
            will-change: transform;
        }
    `;
    const styleSheet = document.createElement('style');
    styleSheet.textContent = particleStyles;
    document.head.appendChild(styleSheet);
}

// Enhanced Member Cards with Physics
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

            // Physics-based click animation
            card.addEventListener('click', function(e) {
                if (e.key && e.key !== 'Enter' && e.key !== ' ') return;
                
                // Add ripple effect
                createRippleEffect(e, this);
                
                // Scale animation
                if (typeof gsap !== 'undefined') {
                    gsap.to(this, {
                        scale: 0.95,
                        duration: 0.1,
                        yoyo: true,
                        repeat: 1,
                        ease: "power2.inOut"
                    });
                }
                
                showMemberDetails(this);
            });

            // Hover effects
            card.addEventListener('mouseenter', function() {
                if (typeof gsap !== 'undefined') {
                    gsap.to(this, {
                        scale: 1.05,
                        duration: 0.2,
                        ease: "back.out(1.2)"
                    });
                }
            });

            card.addEventListener('mouseleave', function() {
                if (typeof gsap !== 'undefined') {
                    gsap.to(this, {
                        scale: 1,
                        duration: 0.2,
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

        // Enhanced scroll container with momentum
        initMomentumScroll(scrollContainer);
    }
}

// Momentum-based scrolling
function initMomentumScroll(container) {
    let isDragging = false;
    let startX, scrollLeft, velocity = 0;
    let rafId;

    const handleMouseDown = (e) => {
        isDragging = true;
        startX = e.pageX - container.offsetLeft;
        scrollLeft = container.scrollLeft;
        velocity = 0;
        container.style.cursor = 'grabbing';
        container.style.userSelect = 'none';
        
        cancelAnimationFrame(rafId);
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        
        const x = e.pageX - container.offsetLeft;
        const walk = (x - startX) * 2;
        const prevScrollLeft = container.scrollLeft;
        
        container.scrollLeft = scrollLeft - walk;
        velocity = container.scrollLeft - prevScrollLeft;
    };

    const handleMouseUp = () => {
        isDragging = false;
        container.style.cursor = 'grab';
        container.style.removeProperty('user-select');
        
        // Apply momentum
        applyMomentum();
    };

    const applyMomentum = () => {
        velocity *= 0.95; // friction
        
        if (Math.abs(velocity) > 0.5) {
            container.scrollLeft += velocity;
            rafId = requestAnimationFrame(applyMomentum);
        }
    };

    // Mouse events
    container.addEventListener('mousedown', handleMouseDown);
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseUp);
    container.addEventListener('mouseup', handleMouseUp);

    // Touch events
    container.addEventListener('touchstart', (e) => {
        isDragging = true;
        startX = e.touches[0].pageX - container.offsetLeft;
        scrollLeft = container.scrollLeft;
        velocity = 0;
    });

    container.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const x = e.touches[0].pageX - container.offsetLeft;
        const walk = (x - startX) * 2;
        container.scrollLeft = scrollLeft - walk;
    });

    container.addEventListener('touchend', handleMouseUp);
}

// Ripple effect for interactions
function createRippleEffect(event, element) {
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
        background: rgba(255, 255, 255, 0.5);
        border-radius: 50%;
        transform: scale(0);
        pointer-events: none;
    `;
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    if (typeof gsap !== 'undefined') {
        gsap.to(ripple, {
            scale: 1,
            opacity: 0,
            duration: 0.6,
            ease: "power2.out",
            onComplete: () => ripple.remove()
        });
    } else {
        setTimeout(() => ripple.remove(), 600);
    }
}

// Enhanced Image Gallery
function initImageGallery() {
    const gallery = document.querySelector('.image-scroll-gallery');
    const scrollContainer = document.querySelector('.scroll-container');
    const leftBtn = document.querySelector('.scroll-btn.left');
    const rightBtn = document.querySelector('.scroll-btn.right');

    if (!gallery || !scrollContainer || !leftBtn || !rightBtn) return;

    // Enhanced scroll with physics
    leftBtn.addEventListener('click', () => {
        smoothScrollGallery(gallery, -300);
    });

    rightBtn.addEventListener('click', () => {
        smoothScrollGallery(gallery, 300);
    });

    function smoothScrollGallery(element, amount) {
        const start = element.scrollLeft;
        const target = start + amount;
        
        if (typeof gsap !== 'undefined') {
            gsap.to(element, {
                scrollLeft: target,
                duration: 0.6,
                ease: "power2.inOut"
            });
        } else {
            element.scrollBy({
                left: amount,
                behavior: 'smooth'
            });
        }
    }

    // Enhanced scroll button visibility
    function updateScrollButtons() {
        const scrollLeft = gallery.scrollLeft;
        const maxScroll = gallery.scrollWidth - gallery.clientWidth;

        if (typeof gsap !== 'undefined') {
            gsap.to(leftBtn, {
                opacity: scrollLeft > 0 ? 1 : 0.3,
                duration: 0.3
            });
            gsap.to(rightBtn, {
                opacity: scrollLeft < maxScroll - 5 ? 1 : 0.3,
                duration: 0.3
            });
        } else {
            leftBtn.style.opacity = scrollLeft > 0 ? '1' : '0.3';
            rightBtn.style.opacity = scrollLeft < maxScroll - 5 ? '1' : '0.3';
        }
    }

    gallery.addEventListener('scroll', updateScrollButtons);
    window.addEventListener('resize', updateScrollButtons);
    updateScrollButtons();
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
        return false;
    });

    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey && (e.key === 'c' || e.key === 'C' || e.key === 'x' || e.key === 'X' || e.key === 'a' || e.key === 'A')) || 
            e.key === 'F12' || 
            (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j'))) {
            e.preventDefault();
            showProtectionMessage();
        }
    });

    function showProtectionMessage() {
        // Subtle protection message
        const message = document.createElement('div');
        message.textContent = 'Content protected';
        message.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 10px 15px;
            border-radius: 5px;
            z-index: 10000;
            font-size: 14px;
        `;
        document.body.appendChild(message);
        
        setTimeout(() => {
            if (typeof gsap !== 'undefined') {
                gsap.to(message, {
                    opacity: 0,
                    y: -20,
                    duration: 0.5,
                    onComplete: () => message.remove()
                });
            } else {
                message.remove();
            }
        }, 2000);
    }
}

// Enhanced Footer Animation
function initFooterAnimation() {
    const footer = document.getElementById('pageFooter');
    if (!footer) return;

    // Enhanced mouse tracking with physics
    let mouseX = 0, mouseY = 0;
    let targetX = 0, targetY = 0;

    document.addEventListener('mousemove', function(e) {
        targetX = e.clientX;
        targetY = e.clientY;
    });

    // Smooth interpolation for mouse movement
    function updateMousePosition() {
        mouseX += (targetX - mouseX) * 0.1;
        mouseY += (targetY - mouseY) * 0.1;
        
        const footerRect = footer.getBoundingClientRect();
        const relativeX = mouseX - footerRect.left;
        const relativeY = mouseY - footerRect.top;
        
        footer.style.setProperty('--mouse-x', relativeX + 'px');
        footer.style.setProperty('--mouse-y', relativeY + 'px');
        
        requestAnimationFrame(updateMousePosition);
    }
    
    updateMousePosition();

    // Enhanced footer entrance
    window.addEventListener('load', function() {
        setTimeout(() => {
            if (typeof gsap !== 'undefined') {
                gsap.to(footer, {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    ease: "back.out(1.2)"
                });
            } else {
                footer.style.transform = 'translateY(0)';
                footer.style.opacity = '1';
            }
        }, 500);
    });
}

// Enhanced member details function
function showMemberDetails(card) {
    const memberName = card.querySelector('p');
    if (memberName) {
        console.log('Viewing details for:', memberName.textContent);
        // Enhanced member detail logic can be added here
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

document.addEventListener('DOMContentLoaded', function() {
  const docsSheet = document.getElementById('docs-sheet');
  const disagreeBtn = document.getElementById('disagree-btn');
  const agreeBtn = document.getElementById('agree-btn');
  
  function showDocsSheet() {
    docsSheet.classList.add('active', 'bounce-in');
  }
  
  function hideDocsSheet() {
    docsSheet.classList.add('bounce-out');
    setTimeout(() => {
      docsSheet.classList.remove('active', 'bounce-in', 'bounce-out');
    }, 500);
  }
  
  disagreeBtn.addEventListener('click', function() {
    window.location.href = 'https://www.google.com';
  });
  
  agreeBtn.addEventListener('click', function() {
    localStorage.setItem('termsAgreed', 'true');
    hideDocsSheet();
  });
  
  if (!localStorage.getItem('termsAgreed')) {
    setTimeout(showDocsSheet, 500);
  }
  
  docsSheet.addEventListener('click', function(e) {
    if (e.target.classList.contains('docs-sheet-overlay')) {
      hideDocsSheet();
    }
  });
});