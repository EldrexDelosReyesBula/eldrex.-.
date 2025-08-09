        document.addEventListener('DOMContentLoaded', function() {
            // Initialize components
            initWaterEffect();
            initParticles();
            initBottomSheets();
            initRippleEffects();
            initLinkParticles();
            initProfilePicture();
            animateFooter();

            // Load animations
            setTimeout(() => {
                document.getElementById('profile-picture').classList.add('loaded');
                document.querySelectorAll('.link-item').forEach((item, index) => {
                    setTimeout(() => {
                        item.style.opacity = 0;
                        item.style.transform = 'translateY(20px)';
                        gsap.to(item, {
                            opacity: 1,
                            y: 0,
                            duration: 0.6,
                            delay: index * 0.05,
                            ease: "back.out(1.2)"
                        });
                    }, 100);
                });
            }, 300);
        });

        // Water Effect using Three.js
        let waterScene, waterCamera, waterRenderer, waterMesh;
        let waterUniforms, clock;

        function initWaterEffect() {
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
                time: {
                    type: "f",
                    value: 0.0
                },
                resolution: {
                    type: "v2",
                    value: new THREE.Vector2(window.innerWidth, window.innerHeight)
                },
                mouse: {
                    type: "v2",
                    value: new THREE.Vector2(0.5, 0.5)
                }
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
                        
                        // Water effect
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
        }

        // Three.js Particle System
        let particleSystem, particles, particleGeometry, particleMaterial;
        let scene, camera, renderer;

        function initParticles() {
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
        }

        // Bottom Sheets with Morph Animation
        function initBottomSheets() {
            const profilePicture = document.getElementById('profile-picture');
            const squadLink = document.getElementById('squad-link');
            const profileSheet = document.getElementById('profile-sheet');
            const squadSheet = document.getElementById('squad-sheet');
            const overlay = document.getElementById('overlay');
            const closeButtons = document.querySelectorAll('.close-sheet');

            // Open profile sheet with morph animation
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

            // Open squad sheet
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
        }

        // Ripple Effects
        function initRippleEffects() {
            document.querySelectorAll('.link-item, .profile-picture, .close-sheet').forEach(element => {
                element.addEventListener('click', function(e) {
                    // Get click position relative to element
                    const rect = this.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;

                    // Create ripple
                    const ripple = document.createElement('span');
                    ripple.className = 'ripple';
                    ripple.style.left = x + 'px';
                    ripple.style.top = y + 'px';
                    this.appendChild(ripple);

                    // Remove ripple after animation
                    setTimeout(() => {
                        ripple.remove();
                    }, 600);
                });
            });
        }

        // Link Particle Effects
        function initLinkParticles() {
            document.querySelectorAll('.link-item:not(#squad-link)').forEach(link => {
                link.addEventListener('click', function(e) {
                    if (this.getAttribute('target') === '_blank') {
                        e.preventDefault();
                        const rect = this.getBoundingClientRect();
                        const startX = rect.left + rect.width / 2;
                        const startY = rect.top + rect.height / 2;

                        // Create particle burst
                        createParticleBurst(startX, startY, () => {
                            window.open(this.href, '_blank');
                        });
                    }
                });
            });
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

        // Profile Picture
        function initProfilePicture() {
            const profilePic = document.getElementById('profile-picture');
            const img = profilePic.querySelector('img');

            // Ensure image is loaded
            img.onload = function() {
                profilePic.classList.add('loaded');

                // Fluid animation when loaded
                gsap.from(profilePic, {
                    scale: 0.8,
                    opacity: 0,
                    duration: 0.8,
                    ease: "elastic.out(1, 0.5)"
                });
            };

            // Force load if already cached
            if (img.complete) img.onload();
        }

        // Footer Animation
        function animateFooter() {
            const footer = document.getElementById('pageFooter');

            setTimeout(() => {
                gsap.to(footer, {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    delay: 0.5,
                    ease: "expo.out"
                });
            }, 1000);

            // Add hover effect to logo
            const footerLogo = document.querySelector('.footer-logo');
            if (footerLogo) {
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
        }

    // Add mouse position tracking for dynamic refraction effect
    document.addEventListener('mousemove', function(e) {
        const footer = document.getElementById('pageFooter');
        const highlight = footer.querySelector('.refraction-highlight');
        
        // Get mouse position relative to footer
        const footerRect = footer.getBoundingClientRect();
        const mouseX = e.clientX - footerRect.left;
        const mouseY = e.clientY - footerRect.top;
        
        // Update CSS variables
        footer.style.setProperty('--mouse-x', mouseX + 'px');
        footer.style.setProperty('--mouse-y', mouseY + 'px');
        
        // Adjust highlight position
        highlight.style.transform = `translate(${mouseX - 50}px, ${mouseY - 50}px)`;
    });
    
    // Show footer with animation
    window.addEventListener('load', function() {
        const footer = document.getElementById('pageFooter');
        setTimeout(() => {
            footer.style.transform = 'translateY(0)';
            footer.style.opacity = '1';
        }, 500);
    });