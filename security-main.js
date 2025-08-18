// secure-injector.js
(function() {
    // Authorized domains (case-insensitive)
    const authorizedDomains = [
        'eldrex.landecs.org',
        'eldrex.vercel.app'
    ];

    const isBlocked = (
        // Check if running in an iframe
        window.self !== window.top ||
        
        // Check if running locally
        window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1' ||
        
        // Check if using HTTP (non-HTTPS)
        window.location.protocol !== 'https:' ||
        
        // Check if domain is not authorized
        !authorizedDomains.some(domain => 
            window.location.hostname.toLowerCase() === domain.toLowerCase() ||
            window.location.hostname.toLowerCase().endsWith('.' + domain.toLowerCase())
        )
    );

    // If blocked, redirect to blocked.html
    if (isBlocked) {
        // Prevent any further execution
        window.stop();
        
        // Redirect to blocked page
        window.location.href = '/blocked.html';
        return;
    }

    // If authorized, proceed with injection
    const script = document.createElement('script');
    script.src = '/functions/main.js';
    script.type = 'module'; // Use module if your main.js uses ES6 modules
    script.defer = true;
    script.onerror = function() {
        console.error('Failed to load main.js');
    };
    
    document.head.appendChild(script);
})();