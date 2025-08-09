// Domain verification and security measures
(function() {
    // List of allowed domains
    const ALLOWED_DOMAINS = [
        'eldrex.neocities.org',
        'www.eldrex.neocities.org'
    ];
    
    // Check if current domain is allowed
    const currentDomain = window.location.hostname;
    const isAllowedDomain = ALLOWED_DOMAINS.some(domain => 
        currentDomain === domain || currentDomain.endsWith('.' + domain)
    );
    
    // Redirect to license page if not on allowed domain
    if (!isAllowedDomain) {
        window.location.href = 'https://eldrex.neocities.org/license.html';
        return;
    }
    
    // Force HTTPS if not already
    if (window.location.protocol !== 'https:') {
        window.location.href = 'https://' + window.location.host + window.location.pathname + window.location.search;
    }
    
    // Content protection measures (only on allowed domains)
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
        if (e.ctrlKey && (e.key === 'c' || e.key === 'C' || e.key === 'x' || e.key === 'X' || e.key === 'a' || e.key === 'A') ||
            e.key === 'F12' ||
            (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j'))) {
            e.preventDefault();
            alert('Content protection is enabled');
        }
    });
    
    // Fallback for browsers that override user-select
    document.addEventListener('selectionchange', () => {
        window.getSelection().removeAllRanges();
    });
})();

// Main application code
document.addEventListener('DOMContentLoaded', function() {
    // Initialize components only if on allowed domain
    if (window.location.hostname.includes('eldrex.neocities.org')) {
        initWaterEffect();
        initParticles();
        initBottomSheets();
        initRippleEffects();
        initLinkParticles();
        initProfilePicture();
        animateFooter();
        
        // Load animations
        setTimeout(() => {
            const profilePic = document.getElementById('profile-picture');
            if (profilePic) profilePic.classList.add('loaded');
            
            document.querySelectorAll('.link-item').forEach((item, index) => {
                setTimeout(() => {
                    item.style.opacity = 0;
                    item.style.transform = 'translateY(20px)';
                    if (window.gsap) {
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
    }
});

// Water Effect using Three.js
let waterScene, waterCamera, waterRenderer, waterMesh;
let waterUniforms, clock;

function initWaterEffect() {
    try {
        const canvas = document.createElement('canvas');
        canvas.id = 'water-canvas';
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '0';
        document.body.appendChild(canvas);

        // Scene setup
        waterScene = new THREE.Scene();
        waterCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        waterCamera.position.z = 5;

        // Renderer setup
        waterRenderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true,
            alpha: true
        });
        waterRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        waterRenderer.setSize(window.innerWidth, window.innerHeight);

        // Water shader
        waterUniforms = {
            time: { type: "f", value: 0.0 },
            resolution: { type: "v2", value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
            mouse: { type: "v2", value: new THREE.Vector2(0.5, 0.5) }
        };

        const waterShader = {
            uniforms: waterUniforms,
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                uniform vec2 resolution;
                uniform vec2 mouse;
                varying vec2 vUv;
                
                void main() {
                    vec2 uv = vUv;
                    vec2 p = uv * 2.0 - 1.0;
                    p.x *= resolution.x / resolution.y;
                    
                    float dist = length(p - (mouse * 2.0 - 1.0));
                    float wave = sin(dist * 20.0 - time * 3.0) * 0.02;
                    
                    vec3 color = mix(
                        vec3(0.1, 0.3, 0.8),
                        vec3(0.2, 0.5, 0.9),
                        smoothstep(0.2, 0.8, uv.y)
                    );
                    
                    color += wave * 0.5;
                    color = mix(color, vec3(1.0), smoothstep(0.95, 1.0, dist));
                    
                    gl_FragColor = vec4(color, 0.03);
                }
            `
        };

        const waterGeometry = new THREE.PlaneGeometry(0, 0);
        const waterMaterial = new THREE.ShaderMaterial({
            uniforms: waterUniforms,
            vertexShader: waterShader.vertexShader,
            fragmentShader: waterShader.fragmentShader,
            transparent: true,
            blending: THREE.AdditiveBlending
        });

        waterMesh = new THREE.Mesh(waterGeometry, waterMaterial);
        waterScene.add(waterMesh);

        clock = new THREE.Clock();

        // Mouse movement effect
        document.addEventListener('mousemove', (e) => {
            waterUniforms.mouse.value.x = e.clientX / window.innerWidth;
            waterUniforms.mouse.value.y = 1.0 - e.clientY / window.innerHeight;
        });

        // Handle window resize
        window.addEventListener('resize', function() {
            waterCamera.aspect = window.innerWidth / window.innerHeight;
            waterCamera.updateProjectionMatrix();
            waterRenderer.setSize(window.innerWidth, window.innerHeight);
            waterUniforms.resolution.value.set(window.innerWidth, window.innerHeight);
        });

        // Animate water
        function animateWater() {
            requestAnimationFrame(animateWater);
            waterUniforms.time.value = clock.getElapsedTime();
            waterRenderer.render(waterScene, waterCamera);
        }

        animateWater();
    } catch (error) {
        console.error('Water effect initialization failed:', error);
    }
}

// Three.js Particle System
let particleSystem, particles, particleGeometry, particleMaterial;
let scene, camera, renderer;

function initParticles() {
    try {
        const canvas = document.getElementById('particles-canvas');
        if (!canvas) return;

        // Scene setup
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
        camera.position.z = 500;

        // Renderer setup
        renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true,
            alpha: true
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(window.innerWidth, window.innerHeight);

        // Particle system
        const particleCount = 600;
        particleGeometry = new THREE.BufferGeometry();
        particles = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount; i++) {
            particles[i * 3] = (Math.random() - 0.5) * 2000;
            particles[i * 3 + 1] = (Math.random() - 0.5) * 2000;
            particles[i * 3 + 2] = (Math.random() - 0.5) * 2000;
        }

        particleGeometry.setAttribute('position', new THREE.BufferAttribute(particles, 3));

        particleMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 1.2,
            transparent: true,
            opacity: 0.2,
            blending: THREE.AdditiveBlending,
            sizeAttenuation: true
        });

        particleSystem = new THREE.Points(particleGeometry, particleMaterial);
        scene.add(particleSystem);

        // Handle window resize
        window.addEventListener('resize', function() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });

        // Animate particles
        function animate() {
            requestAnimationFrame(animate);
            if (particleSystem) {
                particleSystem.rotation.x += 0.0001;
                particleSystem.rotation.y += 0.00015;
                renderer.render(scene, camera);
            }
        }

        animate();
    } catch (error) {
        console.error('Particle system initialization failed:', error);
    }
}

// Bottom Sheets with Morph Animation
function initBottomSheets() {
    try {
        const profilePicture = document.getElementById('profile-picture');
        const squadLink = document.getElementById('squad-link');
        const profileSheet = document.getElementById('profile-sheet');
        const squadSheet = document.getElementById('squad-sheet');
        const overlay = document.getElementById('overlay');
        const closeButtons = document.querySelectorAll('.close-sheet');

        if (!profilePicture || !squadLink || !profileSheet || !squadSheet || !overlay) return;

        // Open profile sheet with morph animation
        profilePicture.addEventListener('click', function(e) {
            const rect = profilePicture.getBoundingClientRect();
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

            if (window.gsap) {
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
            } else {
                morphElement.remove();
                profileSheet.classList.add('active');
                overlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });

        // Open squad sheet
        squadLink.addEventListener('click', function(e) {
            e.preventDefault();
            const rect = squadLink.getBoundingClientRect();
            const startX = rect.left + rect.width / 2;
            const startY = rect.top + rect.height / 2;

            createParticleBurst(startX, startY, () => {
                squadSheet.classList.add('active');
                overlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });

        // Close sheets
        closeButtons.forEach(button => {
            button.addEventListener('click', function() {
                profileSheet.classList.remove('active');
                squadSheet.classList.remove('active');
                overlay.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close with overlay click
        overlay.addEventListener('click', function() {
            profileSheet.classList.remove('active');
            squadSheet.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        });

        // Prevent closing when clicking inside sheet
        [profileSheet, squadSheet].forEach(sheet => {
            sheet.addEventListener('click', function(e) {
                e.stopPropagation();
            });
        });
    } catch (error) {
        console.error('Bottom sheets initialization failed:', error);
    }
}

// Ripple Effects
function initRippleEffects() {
    try {
        document.querySelectorAll('.link-item, .profile-picture, .close-sheet').forEach(element => {
            element.addEventListener('click', function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const ripple = document.createElement('span');
                ripple.className = 'ripple';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                this.appendChild(ripple);

                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });
    } catch (error) {
        console.error('Ripple effects initialization failed:', error);
    }
}

// Link Particle Effects
function initLinkParticles() {
    try {
        document.querySelectorAll('.link-item:not(#squad-link)').forEach(link => {
            link.addEventListener('click', function(e) {
                if (this.getAttribute('target') === '_blank') {
                    e.preventDefault();
                    const rect = this.getBoundingClientRect();
                    const startX = rect.left + rect.width / 2;
                    const startY = rect.top + rect.height / 2;

                    createParticleBurst(startX, startY, () => {
                        window.open(this.href, '_blank');
                    });
                }
            });
        });
    } catch (error) {
        console.error('Link particles initialization failed:', error);
    }
}

// Create particle burst animation
function createParticleBurst(x, y, callback) {
    try {
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

            if (window.gsap) {
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
            } else {
                burst.remove();
                if (callback) callback();
                break;
            }
        }
    } catch (error) {
        console.error('Particle burst creation failed:', error);
        if (callback) callback();
    }
}

// Profile Picture
function initProfilePicture() {
    try {
        const profilePic = document.getElementById('profile-picture');
        if (!profilePic) return;
        
        const img = profilePic.querySelector('img');
        if (!img) return;

        img.onload = function() {
            profilePic.classList.add('loaded');
            if (window.gsap) {
                gsap.from(profilePic, {
                    scale: 0.8,
                    opacity: 0,
                    duration: 0.8,
                    ease: "elastic.out(1, 0.5)"
                });
            }
        };

        if (img.complete) img.onload();
    } catch (error) {
        console.error('Profile picture initialization failed:', error);
    }
}

// Footer Animation
function animateFooter() {
    try {
        const footer = document.getElementById('pageFooter');
        if (!footer) return;

        setTimeout(() => {
            if (window.gsap) {
                gsap.to(footer, {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    delay: 0.5,
                    ease: "expo.out"
                });
            } else {
                footer.style.transform = 'translateY(0)';
                footer.style.opacity = '1';
            }
        }, 1000);

        const footerLogo = document.querySelector('.footer-logo');
        if (footerLogo && window.gsap) {
            footerLogo.addEventListener('mouseenter', function() {
                gsap.to(this, {
                    scale: 1.1,
                    opacity: 1,
                    duration: 0.3,
                    yoyo: true,
                    repeat: 1
                });
            });
        }
    } catch (error) {
        console.error('Footer animation initialization failed:', error);
    }
}

// Mouse position tracking for dynamic refraction effect
document.addEventListener('mousemove', function(e) {
    try {
        const footer = document.getElementById('pageFooter');
        if (!footer) return;
        
        const highlight = footer.querySelector('.refraction-highlight');
        if (!highlight) return;

        const footerRect = footer.getBoundingClientRect();
        const mouseX = e.clientX - footerRect.left;
        const mouseY = e.clientY - footerRect.top;
        
        footer.style.setProperty('--mouse-x', mouseX + 'px');
        footer.style.setProperty('--mouse-y', mouseY + 'px');
        
        highlight.style.transform = `translate(${mouseX - 50}px, ${mouseY - 50}px)`;
    } catch (error) {
        console.error('Mouse tracking failed:', error);
    }
});

// Enhanced haptic feedback
document.addEventListener('DOMContentLoaded', function() {
    try {
        if (!('vibrate' in navigator)) return;
        const hapticLinks = document.querySelectorAll('.haptic-link');
        if (!hapticLinks.length) return;

        const vibrate = () => {
            try {
                navigator.vibrate([15, 3, 15]);
            } catch (e) {
                console.warn('Haptic feedback unavailable');
            }
        };

        hapticLinks.forEach(link => {
            link.addEventListener('touchstart', vibrate, { passive: true });
            link.addEventListener('mousedown', vibrate);
            link.addEventListener('click', (e) => {
                if (e.screenX !== 0) {
                    setTimeout(vibrate, 10);
                }
            });
            link.addEventListener('contextmenu', vibrate);
        });

        let lastTouchTime = 0;
        document.addEventListener('touchmove', () => {
            lastTouchTime = Date.now();
        }, { passive: true });
    } catch (error) {
        console.error('Haptic feedback initialization failed:', error);
    }
});

// Image gallery functionality
document.addEventListener('DOMContentLoaded', function() {
    try {
        const gallery = document.querySelector('.image-scroll-gallery');
        if (!gallery) return;
        
        const scrollContainer = document.querySelector('.scroll-container');
        const leftBtn = document.querySelector('.scroll-btn.left');
        const rightBtn = document.querySelector('.scroll-btn.right');

        if (leftBtn && rightBtn) {
            leftBtn.addEventListener('click', () => {
                gallery.scrollBy({ left: -300, behavior: 'smooth' });
            });

            rightBtn.addEventListener('click', () => {
                gallery.scrollBy({ left: 300, behavior: 'smooth' });
            });

            function updateScrollButtons() {
                const scrollLeft = gallery.scrollLeft;
                const maxScroll = scrollContainer.scrollWidth - gallery.clientWidth;

                leftBtn.style.visibility = scrollLeft > 0 ? 'visible' : 'hidden';
                rightBtn.style.visibility = scrollLeft < maxScroll - 5 ? 'visible' : 'hidden';
            }

            gallery.addEventListener('scroll', updateScrollButtons);
            window.addEventListener('resize', updateScrollButtons);
            updateScrollButtons();

            document.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowLeft') {
                    gallery.scrollBy({ left: -300, behavior: 'smooth' });
                } else if (e.key === 'ArrowRight') {
                    gallery.scrollBy({ left: 300, behavior: 'smooth' });
                }
            });
        }
    } catch (error) {
        console.error('Image gallery initialization failed:', error);
    }
});

// Squad members functionality
document.addEventListener('DOMContentLoaded', function() {
    try {
        const memberCards = document.querySelectorAll('.member-card');
        const scrollContainer = document.querySelector('.members-scroll-container');
        if (!memberCards.length || !scrollContainer) return;

        memberCards.forEach((card, index) => {
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'button');
            const name = card.querySelector('p');
            if (name) {
                card.setAttribute('aria-label', `View ${name.textContent}'s profile`);
            }

            card.addEventListener('click', function(e) {
                if (e.key && e.key !== 'Enter' && e.key !== ' ') return;
                showMemberDetails(this);
            });

            card.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    showMemberDetails(this);
                }
            });
        });

        scrollContainer.setAttribute('tabindex', '0');
        scrollContainer.setAttribute('role', 'region');
        scrollContainer.setAttribute('aria-label', 'Squad members list');

        scrollContainer.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowLeft') {
                this.scrollBy({ left: -100, behavior: 'smooth' });
            } else if (e.key === 'ArrowRight') {
                this.scrollBy({ left: 100, behavior: 'smooth' });
            }
        });

        let isDragging = false;
        let startX, scrollLeft;

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

        function showMemberDetails(card) {
            const memberName = card.querySelector('p');
            if (memberName) {
                console.log('Viewing details for:', memberName.textContent);
            }
        }
    } catch (error) {
        console.error('Squad members functionality initialization failed:', error);
    }
});