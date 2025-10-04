    // Posts data - hardcoded as requested
    const postsData = [
        {
            id: 1,
            title: "When nothing moves, everything begins",
            image: "When nothing moves, everything begins_20250928_195843_0000.png",
            description: "There are times when we feel it is easier to rest and just wait for things to happen. What we do not realize is that the dreams we hold may already be done or achieved by others because they acted before they even dreamed of it. If we stop moving and only watch what comes next, the dreams we hope for will always be reached first by the people around us. There is nothing wrong with making mistakes, but what is wrong is when a person cannot correct those mistakes.
",
            fullDescription: "There are times when we feel it is easier to rest and just wait for things to happen. What we do not realize is that the dreams we hold may already be done or achieved by others because they acted before they even dreamed of it. If we stop moving and only watch what comes next, the dreams we hope for will always be reached first by the people around us. There is nothing wrong with making mistakes, but what is wrong is when a person cannot correct those mistakes.",
            date: "September 29, 2025"
        },
        {
            id: 2,
            title: "Socratic Squad",
            image: "https://eldrex.landecs.org/_DSC3033.jpg",
            description: "Behind every brilliant idea is a squad who dared to ask why.", 
            fullDescription: "Behind every brilliant idea is a squad who dared to ask why. A friend is always there, ready to hear and listen to you, ready to accept you and laugh with you. A friend who became family, a friend who turned into a debater, a friend who always shows up when you need someone to talk to. A friend who has the habits I like, the influence I admire, and the food memories that began the first time we met. Even if you don't always see it, it means everything to us. Whether a boy or a girl, they will always be part of our story, our friendship, and our squad. All for one, one for all.", 
            date: "May 18, 2025"
        },
        {
            id: 3,
            title: "Creative Exploration",
            image: "https://eldrex.landecs.org/img_1_1759565398614.jpg",
            description: `"The Sleepy, Crazy, Meme Squad"`,
            fullDescription: `"The Sleepy, Crazy, Meme Squad"

We're the squad that loves to sleep,
But when awake, we laugh so deep!
Crazy ideas, wild and loud,
We're the funniest, and we're proud.

Greedy for answers, we never rest,
Don't review the topics, just guess the best!
Debates are loud, but no one's right,
We're just here for the memes tonight.

Yawn, snooze, and then—BOOM—awake!
We search for answers we won't forsake.
Sleepyheads at the break of dawn,
We're on a roll, but we're still yawning.

Crazy questions, crazy answers too,
No review notes? That's just our view!
We laugh, we cry, we shout, we scream,
We're the squad that lives the dream!

So bring on the chaos, bring on the fun,
We'll solve zero problems but have tons of fun!
Sleepy, lazy, but never done,
Socratic Squad—let's meme 'til we run!`,
            date: "Feb 02, 2025",
            isPoem: true
        }
    ];

    class PostsManager {
        constructor() {
            this.currentPostIndex = 0;
            this.postsContainer = document.querySelector('.posts-container');
            this.modal = document.getElementById('bottomsheetPostModal');
            this.isDragging = false;
            this.startY = 0;
            this.currentY = 0;
            this.init();
        }

        init() {
            this.renderPosts();
            this.setupEventListeners();
            this.addScrollIndicator();
        }

        addScrollIndicator() {
            const indicator = document.createElement('div');
            indicator.className = 'scroll-indicator';
            document.querySelector('.posts-carousel').appendChild(indicator);
        }

        renderPosts() {
            if (!this.postsContainer) return;

            this.postsContainer.innerHTML = '';

            postsData.forEach((post, index) => {
                const postElement = this.createPostElement(post, index);
                this.postsContainer.appendChild(postElement);
            });
        }

        createPostElement(post, index) {
            const postElement = document.createElement('div');
            postElement.className = 'post-card';
            postElement.dataset.postId = post.id;

            postElement.innerHTML = `
                <img src="${post.image}" alt="${post.title}" class="post-image">
                <div class="post-content">
                    <div class="post-description">${post.description}</div>
                    <div class="post-date">${post.date}</div>
                    <button class="post-see-more haptic-link" data-post-id="${post.id}">
                        See More <i class="fas fa-arrow-right"></i>
                    </button>
                </div>
            `;

            return postElement;
        }

        setupEventListeners() {
            // See More buttons
            document.addEventListener('click', (e) => {
                if (e.target.closest('.post-see-more')) {
                    const postId = parseInt(e.target.closest('.post-see-more').dataset.postId);
                    this.openBottomsheetPost(postId);
                }
                
                // Click on post card (excluding the button)
                if (e.target.closest('.post-card') && !e.target.closest('.post-see-more')) {
                    const postId = parseInt(e.target.closest('.post-card').dataset.postId);
                    this.openBottomsheetPost(postId);
                }
            });

            // Modal close button
            const modalClose = document.querySelector('.bottomsheet-close');
            if (modalClose) {
                modalClose.addEventListener('click', () => {
                    this.closeBottomsheetPost();
                });
            }

            // Close modal when clicking outside content
            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal || e.target.classList.contains('bottomsheet-overlay')) {
                    this.closeBottomsheetPost();
                }
            });

            // Carousel controls
            const prevBtn = document.querySelector('.carousel-prev');
            const nextBtn = document.querySelector('.carousel-next');

            if (prevBtn) {
                prevBtn.addEventListener('click', () => {
                    this.scrollCarousel('prev');
                });
            }

            if (nextBtn) {
                nextBtn.addEventListener('click', () => {
                    this.scrollCarousel('next');
                });
            }

            // Keyboard navigation
            document.addEventListener('keydown', (e) => {
                if (this.modal.classList.contains('active')) {
                    if (e.key === 'Escape') {
                        this.closeBottomsheetPost();
                    }
                }
            });

            // Touch/swipe support for carousel
            this.setupTouchEvents();
            
            // Swipe down to close bottom sheet
            this.setupBottomsheetSwipe();
        }

        setupTouchEvents() {
            let startX = 0;
            let endX = 0;

            this.postsContainer.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
            });

            this.postsContainer.addEventListener('touchend', (e) => {
                endX = e.changedTouches[0].clientX;
                this.handleSwipe(startX, endX);
            });
        }
        
        setupBottomsheetSwipe() {
            const bottomsheetContent = document.querySelector('.bottomsheet-content');
            
            bottomsheetContent.addEventListener('touchstart', (e) => {
                this.isDragging = true;
                this.startY = e.touches[0].clientY;
                this.currentY = this.startY;
            });
            
            bottomsheetContent.addEventListener('touchmove', (e) => {
                if (!this.isDragging) return;
                
                this.currentY = e.touches[0].clientY;
                const diff = this.currentY - this.startY;
                
                // Only allow downward dragging
                if (diff > 0) {
                    bottomsheetContent.style.transform = `translateY(${diff}px)`;
                }
            });
            
            bottomsheetContent.addEventListener('touchend', () => {
                if (!this.isDragging) return;
                
                this.isDragging = false;
                const diff = this.currentY - this.startY;
                const threshold = 100; // pixels to trigger close
                
                if (diff > threshold) {
                    this.closeBottomsheetPost();
                } else {
                    // Return to original position
                    bottomsheetContent.style.transform = 'translateY(0)';
                }
            });
        }

        handleSwipe(startX, endX) {
            const swipeThreshold = 50;
            const diff = startX - endX;

            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    this.scrollCarousel('next');
                } else {
                    this.scrollCarousel('prev');
                }
            }
        }

        scrollCarousel(direction) {
            const scrollAmount = 300; // Width of a post card + gap

            if (direction === 'next') {
                this.postsContainer.scrollBy({
                    left: scrollAmount,
                    behavior: 'smooth'
                });
            } else {
                this.postsContainer.scrollBy({
                    left: -scrollAmount,
                    behavior: 'smooth'
                });
            }
        }

        openBottomsheetPost(postId) {
            const post = postsData.find(p => p.id === postId);
            if (!post) return;

            // Update modal content
            document.getElementById('bottomsheetPostImage').src = post.image;
            document.getElementById('bottomsheetPostImage').alt = post.title;
            
            // Format description based on content type
            if (post.isPoem) {
                document.getElementById('bottomsheetPostDescription').innerHTML = `<div class="poem-content">${post.fullDescription}</div>`;
            } else {
                document.getElementById('bottomsheetPostDescription').textContent = post.fullDescription;
            }
            
            document.getElementById('bottomsheetPostDate').textContent = post.date;

            // Show modal
            this.modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        }

        closeBottomsheetPost() {
            this.modal.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
            
            // Reset animations for next open
            const bottomsheetElements = document.querySelectorAll('.bottomsheet-image-container, .bottomsheet-description, .bottomsheet-date');
            bottomsheetElements.forEach(el => {
                el.style.animation = 'none';
                setTimeout(() => {
                    el.style.animation = '';
                }, 10);
            });
        }
    }

    // Initialize posts manager when DOM is loaded
    document.addEventListener('DOMContentLoaded', () => {
        new PostsManager();
    });