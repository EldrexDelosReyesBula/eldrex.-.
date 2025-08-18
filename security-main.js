// secure-injector.js
(function() {
    // Authorized domains (case-insensitive)
    const authorizedDomains = [
        'https://eldrex.landecs.org',
        'https://eldrex.vercel.app'
    ];

    const isBlocked = (
        window.self !== window.top ||
        
        window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1' ||
        
        window.location.protocol !== 'https:' ||
        
        !authorizedDomains.some(domain => 
            window.location.hostname.toLowerCase() === domain.toLowerCase() ||
            window.location.hostname.toLowerCase().endsWith('.' + domain.toLowerCase())
        )
    );

    if (isBlocked) {
        window.stop();
        
        window.location.href = '/blocked.html';
        return;
    }

    const script = document.createElement('script');
    script.src = '/functions/main.js';
    script.type = 'module';
    script.defer = true;
    script.onerror = function() {
        console.error('Failed to load main.js');
    };
    
    document.head.appendChild(script);
})();