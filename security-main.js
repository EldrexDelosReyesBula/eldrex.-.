// secure-loader.prod.js
(() => {
    'use strict';

    // Configuration
    const CONFIG = {
        authorizedOrigins: [
            'https://eldrex.landecs.org',
            'https://eldrex.vercel.app'
        ],
        mainScriptUrl: 'https://eldrex.vercel.app/functions/main.js',
        fallbackScriptUrl: '/functions/main.js',
        blockedPage: '/blocked.html',
        enableP2P: true,
        p2pConfig: {
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: 'stun:global.stun.twilio.com:3478?transport=udp' }
            ]
        },
        sriHash: 'sha384-7r7QCYk1zw/MzUaYyaEDYVXLPoRN27Mpkgs61aFIIxX09YwKDwUAaSom+y68Vlkz'
    };

    // Security Validation Module
    const SecurityValidator = {
        isOriginAuthorized: () => {
            const origin = window.location.origin.toLowerCase();
            return CONFIG.authorizedOrigins.some(authorized => {
                const authLower = authorized.toLowerCase();
                return origin === authLower || 
                       origin.endsWith(authLower.replace('https://', '.'));
            });
        },

        isSecureContext: () => {
            return window.isSecureContext || 
                   window.location.protocol === 'https:' ||
                   /^(localhost|127\.0\.0\.1|::1)$/.test(window.location.hostname);
        },

        shouldBlockExecution: () => {
            if (!SecurityValidator.isSecureContext()) {
                console.warn('Blocked: Insecure context');
                return true;
            }

            if (!SecurityValidator.isOriginAuthorized()) {
                console.warn(`Blocked: Unauthorized origin ${window.location.origin}`);
                return true;
            }

            return false;
        }
    };

    // Script Loader Module
    const ScriptLoader = {
        loadScript: (url, attributes = {}) => {
            return new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = url;
                
                // Set attributes
                for (const [key, value] of Object.entries(attributes)) {
                    script.setAttribute(key, value);
                }

                const cleanup = () => {
                    script.onload = null;
                    script.onerror = null;
                };

                script.onload = () => {
                    cleanup();
                    resolve(script);
                };
                script.onerror = () => {
                    cleanup();
                    reject(new Error(`Failed to load script: ${url}`));
                };

                document.head.appendChild(script);
            });
        },

        loadMainScript: async () => {
            try {
                // Try loading from primary source with SRI
                return await ScriptLoader.loadScript(CONFIG.mainScriptUrl, {
                    type: 'module',
                    crossorigin: 'anonymous',
                    integrity: CONFIG.sriHash
                });
            } catch (primaryError) {
                console.warn('Primary script load failed, trying fallback:', primaryError);
                
                // Try fallback without SRI (local file)
                try {
                    return await ScriptLoader.loadScript(CONFIG.fallbackScriptUrl, {
                        type: 'module'
                    });
                } catch (fallbackError) {
                    console.error('All script loading attempts failed:', fallbackError);
                    throw new Error('Critical: Could not load application script');
                }
            }
        }
    };

    // P2P Communication Module
    const P2PManager = {
        connection: null,
        dataChannel: null,

        initialize: async function() {  // Changed to function for proper 'this' binding
            if (!CONFIG.enableP2P) return;

            try {
                this.connection = new RTCPeerConnection(CONFIG.p2pConfig);
                
                // Set up data channel
                this.dataChannel = this.connection.createDataChannel('eldrex-comm', {
                    ordered: true,
                    maxPacketLifeTime: 3000
                });
                
                // Event handlers
                this.dataChannel.onopen = () => {
                    console.log('P2P Data Channel opened');
                    this.sendInitialHandshake();
                };

                this.dataChannel.onmessage = (event) => {
                    this.handleMessage(event.data);
                };

                this.dataChannel.onclose = () => {
                    console.log('P2P Data Channel closed');
                };

                // ICE candidate handling
                this.connection.onicecandidate = (event) => {
                    if (event.candidate) {
                        console.debug('New ICE candidate:', event.candidate);
                    }
                };

                // Error handling
                this.connection.oniceconnectionstatechange = () => {
                    if (this.connection.iceConnectionState === 'failed') {
                        console.error('P2P connection failed');
                    }
                };

                // Create offer
                const offer = await this.connection.createOffer({
                    offerToReceiveAudio: false,
                    offerToReceiveVideo: false
                });
                await this.connection.setLocalDescription(offer);

                console.debug('P2P offer created:', offer);

            } catch (error) {
                console.error('P2P initialization failed:', error);
                throw error;
            }
        },

        sendInitialHandshake: function() {
            try {
                const handshake = {
                    type: 'handshake',
                    origin: window.location.origin,
                    timestamp: Date.now(),
                    version: '1.0'
                };
                this.dataChannel.send(JSON.stringify(handshake));
            } catch (error) {
                console.error('Failed to send handshake:', error);
            }
        },

        handleMessage: function(rawData) {
            try {
                const data = JSON.parse(rawData);
                console.debug('Received P2P message:', data);
                
                switch (data.type) {
                    case 'handshake':
                        console.log('Handshake received from:', data.origin);
                        break;
                    case 'data':
                        console.log('Data payload received:', data.payload);
                        break;
                    default:
                        console.warn('Unknown message type:', data.type);
                }
            } catch (error) {
                console.error('Error processing P2P message:', error);
            }
        },

        closeConnection: function() {
            if (this.dataChannel) {
                this.dataChannel.close();
            }
            if (this.connection) {
                this.connection.close();
            }
        }
    };

    // Error Handling Module
    const ErrorHandler = {
        criticalError: (error) => {
            console.error('Critical error:', error);
            document.body.innerHTML = `
                <div style="padding: 20px; font-family: sans-serif; color: #721c24; background-color: #f8d7da; border: 1px solid #f5c6cb; border-radius: 4px;">
                    <h2>Application Error</h2>
                    <p>${error.message || 'Unknown error occurred'}</p>
                    <p>Please refresh the page or try again later.</p>
                </div>
            `;
        }
    };

    // Main Execution Flow
    const main = async () => {
        if (SecurityValidator.shouldBlockExecution()) {
            window.location.href = CONFIG.blockedPage;
            return;
        }

        try {
            // Load main application script
            await ScriptLoader.loadMainScript();
            
            // Initialize P2P communication if enabled
            if (CONFIG.enableP2P) {
                await P2PManager.initialize();
            }

            console.log('Application initialized successfully');

            // Clean up on page unload
            window.addEventListener('beforeunload', () => {
                if (CONFIG.enableP2P) {
                    P2PManager.closeConnection();
                }
            });

        } catch (error) {
            ErrorHandler.criticalError(error);
        }
    };

    // Start execution after DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main);
    } else {
        main();
    }
})();