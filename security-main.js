// secure-injector.js
(function() {
    // Authorized domains (case-insensitive)
    const authorizedDomains = [
        'eldrex.landecs.org',
        'eldrex.vercel.app'
    ];

    // Current host details
    const currentHost = window.location.hostname.toLowerCase();
    const isSecure = window.location.protocol === 'https:';
    
    // Check if domain is authorized
    const isAuthorized = authorizedDomains.some(domain => 
        currentHost === domain.toLowerCase() ||
        currentHost.endsWith('.' + domain.toLowerCase())
    );

    // Blocked scenarios - less restrictive version
    const shouldBlock = (
        // Only block if not authorized AND not in development
        !isAuthorized && 
        !(currentHost === 'localhost' || currentHost === '127.0.0.1')
    );

    // If blocked, redirect to blocked.html
    if (shouldBlock) {
        // Prevent any further execution
        try { window.stop(); } catch(e) {}
        
        // Redirect to blocked page
        window.location.href = '/blocked.html';
        return;
    }

    // If authorized or localhost, proceed with injection
    const script = document.createElement('script');
    script.src = '/functions/main.js';
    script.type = 'module'; // Use module if your main.js uses ES6 modules
    script.defer = true;
    script.crossOrigin = 'anonymous';
    script.onerror = function() {
        console.error('Failed to load main.js');
        // Optional: fallback to local version if CDN fails
        // const fallback = document.createElement('script');
        // fallback.src = '/local-fallback.js';
        // document.head.appendChild(fallback);
    };
    
    document.head.appendChild(script);
})();