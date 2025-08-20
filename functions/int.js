        // Prevent right-click menu
        document.addEventListener('contextmenu', function(e) {
            e.preventDefault();
        });
        
        // Prevent text selection
        document.addEventListener('selectstart', function(e) {
            e.preventDefault();
        });
        
        // Prevent copy shortcut (Ctrl+C)
        document.addEventListener('keydown', function(e) {
            if (e.ctrlKey && e.key === 'c') {
                e.preventDefault();
            }
        });
        
        // Check if current year is 2028 or later
        function checkYear() {
            const currentYear = new Date().getFullYear();
            if (currentYear >= 2028) {
                document.getElementById('aboutCover').style.display = 'none';
            }
        }
        
        // Initialize
        document.addEventListener('DOMContentLoaded', function() {
            checkYear();
            
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
        });