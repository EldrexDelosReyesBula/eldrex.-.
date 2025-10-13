/**
 * Voice Assistant Module for LanTask Pro
 * Self-contained module that can be easily managed and updated
 * Enhanced with permission handling and improved UX
 */

class VoiceAssistant {
    constructor(taskManager) {
        // Dependency injection - requires task manager instance
        this.taskManager = taskManager;
        
        // Voice recognition properties
        this.isVoiceActive = false;
        this.isListening = false;
        this.recognition = null;
        this.speechSynthesis = window.speechSynthesis;
        this.voiceSheetMinimized = false;
        
        // Permission state
        this.permissionState = 'prompt'; // 'prompt', 'granted', 'denied'
        this.hasRequestedPermission = false;
        
        // Command history
        this.commandHistory = [];
        this.maxHistorySize = 10;
        
        this.init();
    }

    init() {
        this.setupDOM();
        this.setupEventListeners();
        this.checkPermissionState();
        
        console.log('Voice Assistant initialized');
    }

    setupDOM() {
        // Create voice assistant HTML structure if it doesn't exist
        if (!document.getElementById('voice-bottom-sheet')) {
            const voiceHTML = `
                <div class="voice-sheet-overlay" id="voice-sheet-overlay"></div>
                <div class="voice-bottom-sheet" id="voice-bottom-sheet">
                    <div class="voice-sheet-header" id="voice-sheet-header">
                        <div class="title-medium">Voice Assistant</div>
                        <div>
                            <button class="minimize-button" id="minimize-voice-button">
                                <span class="material-symbols-outlined">minimize</span>
                            </button>
                            <button class="close-voice-button" id="close-voice-button">
                                <span class="material-symbols-outlined">close</span>
                            </button>
                        </div>
                    </div>
                    
                    <div class="voice-sheet-content" id="voice-sheet-content">
                        <div class="voice-status" id="voice-status">Tap the microphone to start</div>
                        
                        <div class="voice-command-preview" id="voice-command-preview">
                            Your command will appear here...
                        </div>
                        
                        <button class="voice-mic-animation" id="voice-mic-button">
                            <span class="material-symbols-outlined">mic</span>
                        </button>
                        
                        <div class="voice-commands-list">
                            <div class="title-small" style="margin-bottom: var(--space-md);">Try saying:</div>
                            <div class="voice-command-item">"Add task [task name]"</div>
                            <div class="voice-command-item">"Start timer" or "Stop timer"</div>
                            <div class="voice-command-item">"Open today's tasks"</div>
                            <div class="voice-command-item">"Mark [task name] as done"</div>
                            <div class="voice-command-item">"Stop Lans" to stop listening</div>
                        </div>
                    </div>
                </div>

                <!-- Permission Modal -->
                <div class="modal-overlay" id="voice-permission-overlay" style="display: none;">
                    <div class="modal" id="voice-permission-modal">
                        <div class="modal-header">
                            <h3 class="title-medium">Microphone Access Required</h3>
                        </div>
                        <div class="modal-content">
                            <div class="permission-icon">
                                <span class="material-symbols-outlined">mic</span>
                            </div>
                            <p>LanTask Voice Assistant needs microphone access to understand your voice commands.</p>
                            <p>Your voice data is processed locally and not stored on our servers.</p>
                        </div>
                        <div class="modal-actions">
                            <button class="button secondary" id="permission-deny-btn">Not Now</button>
                            <button class="button primary" id="permission-allow-btn">Allow Microphone</button>
                        </div>
                    </div>
                </div>

                <!-- Permission Denied Modal -->
                <div class="modal-overlay" id="voice-denied-overlay" style="display: none;">
                    <div class="modal" id="voice-denied-modal">
                        <div class="modal-header">
                            <h3 class="title-medium">Microphone Access Denied</h3>
                        </div>
                        <div class="modal-content">
                            <div class="permission-icon denied">
                                <span class="material-symbols-outlined">mic_off</span>
                            </div>
                            <p>Voice assistant cannot function without microphone access.</p>
                            <p>To enable voice commands:</p>
                            <ol>
                                <li>Click the lock icon in your browser's address bar</li>
                                <li>Find "Microphone" in the permissions list</li>
                                <li>Change the setting to "Allow"</li>
                                <li>Refresh the page and try again</li>
                            </ol>
                        </div>
                        <div class="modal-actions">
                            <button class="button primary" id="denied-ok-btn">OK</button>
                        </div>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', voiceHTML);
        }
    }

    setupEventListeners() {
        // Voice button in header
        const voiceButton = document.getElementById('voice-assistant-button');
        if (voiceButton) {
            voiceButton.addEventListener('click', () => {
                this.startVoiceAssistant();
            });
        }

        // Microphone button
        const micButton = document.getElementById('voice-mic-button');
        if (micButton) {
            micButton.addEventListener('click', () => {
                this.toggleListening();
            });
        }

        // Minimize button
        const minimizeButton = document.getElementById('minimize-voice-button');
        if (minimizeButton) {
            minimizeButton.addEventListener('click', (e) => {
                e.stopPropagation();
                this.minimizeVoiceSheet();
            });
        }

        // Close button
        const closeButton = document.getElementById('close-voice-button');
        if (closeButton) {
            closeButton.addEventListener('click', (e) => {
                e.stopPropagation();
                this.stopVoiceAssistant();
            });
        }

        // Header click to maximize
        const sheetHeader = document.getElementById('voice-sheet-header');
        if (sheetHeader) {
            sheetHeader.addEventListener('click', () => {
                if (this.voiceSheetMinimized) {
                    this.minimizeVoiceSheet();
                }
            });
        }

        // Overlay click to close
        const overlay = document.getElementById('voice-sheet-overlay');
        if (overlay) {
            overlay.addEventListener('click', () => {
                this.stopVoiceAssistant();
            });
        }

        // Permission modal buttons
        const allowBtn = document.getElementById('permission-allow-btn');
        const denyBtn = document.getElementById('permission-deny-btn');
        const deniedOkBtn = document.getElementById('denied-ok-btn');

        if (allowBtn) {
            allowBtn.addEventListener('click', () => {
                this.requestMicrophonePermission();
            });
        }

        if (denyBtn) {
            denyBtn.addEventListener('click', () => {
                this.hidePermissionModal();
                this.updateVoiceUI('Microphone access is required for voice commands', false);
            });
        }

        if (deniedOkBtn) {
            deniedOkBtn.addEventListener('click', () => {
                this.hideDeniedModal();
            });
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === ';') { // Ctrl+; to toggle voice assistant
                e.preventDefault();
                if (this.isVoiceActive) {
                    this.stopVoiceAssistant();
                } else {
                    this.startVoiceAssistant();
                }
            }
            
            if (e.key === 'Escape' && this.isVoiceActive) {
                this.stopVoiceAssistant();
            }
        });
    }

    checkPermissionState() {
        // Check if the browser supports permissions API
        if (navigator.permissions && navigator.permissions.query) {
            navigator.permissions.query({ name: 'microphone' })
                .then(permissionStatus => {
                    this.permissionState = permissionStatus.state;
                    this.updatePermissionUI();
                    
                    permissionStatus.onchange = () => {
                        this.permissionState = permissionStatus.state;
                        this.updatePermissionUI();
                        console.log('Microphone permission changed to:', this.permissionState);
                    };
                })
                .catch(error => {
                    console.warn('Permission API not fully supported:', error);
                    this.permissionState = 'prompt';
                });
        } else {
            // Fallback for browsers that don't support permissions API
            this.permissionState = 'prompt';
        }
    }

    updatePermissionUI() {
        const micButton = document.getElementById('voice-mic-button');
        const statusElement = document.getElementById('voice-status');
        
        if (!micButton || !statusElement) return;

        switch (this.permissionState) {
            case 'granted':
                micButton.style.opacity = '1';
                micButton.style.cursor = 'pointer';
                micButton.disabled = false;
                break;
            case 'denied':
                micButton.style.opacity = '0.5';
                micButton.style.cursor = 'not-allowed';
                micButton.disabled = true;
                statusElement.textContent = 'Microphone access denied. Check browser settings.';
                break;
            case 'prompt':
                micButton.style.opacity = '1';
                micButton.style.cursor = 'pointer';
                micButton.disabled = false;
                break;
        }
    }

    showPermissionModal() {
        const modal = document.getElementById('voice-permission-overlay');
        if (modal) {
            modal.style.display = 'flex';
            // Add animation class
            setTimeout(() => {
                const modalContent = document.getElementById('voice-permission-modal');
                if (modalContent) {
                    modalContent.classList.add('modal-active');
                }
            }, 10);
        }
    }

    hidePermissionModal() {
        const modal = document.getElementById('voice-permission-overlay');
        const modalContent = document.getElementById('voice-permission-modal');
        
        if (modalContent) {
            modalContent.classList.remove('modal-active');
        }
        
        setTimeout(() => {
            if (modal) {
                modal.style.display = 'none';
            }
        }, 300);
    }

    showDeniedModal() {
        const modal = document.getElementById('voice-denied-overlay');
        if (modal) {
            modal.style.display = 'flex';
            setTimeout(() => {
                const modalContent = document.getElementById('voice-denied-modal');
                if (modalContent) {
                    modalContent.classList.add('modal-active');
                }
            }, 10);
        }
    }

    hideDeniedModal() {
        const modal = document.getElementById('voice-denied-overlay');
        const modalContent = document.getElementById('voice-denied-modal');
        
        if (modalContent) {
            modalContent.classList.remove('modal-active');
        }
        
        setTimeout(() => {
            if (modal) {
                modal.style.display = 'none';
            }
        }, 300);
    }

    async requestMicrophonePermission() {
        this.hidePermissionModal();
        
        try {
            // Test microphone access by trying to get user media
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            
            // Immediately stop using the stream since we just needed permission
            stream.getTracks().forEach(track => track.stop());
            
            this.permissionState = 'granted';
            this.updatePermissionUI();
            this.setupVoiceRecognition();
            this.startVoiceRecognition();
            
            console.log('Microphone permission granted');
        } catch (error) {
            console.error('Error getting microphone permission:', error);
            this.permissionState = 'denied';
            this.updatePermissionUI();
            this.showDeniedModal();
        }
        
        this.hasRequestedPermission = true;
    }

    setupVoiceRecognition() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            
            this.recognition.continuous = true;
            this.recognition.interimResults = true;
            this.recognition.lang = 'en-US';
            this.recognition.maxAlternatives = 1;

            this.recognition.onstart = () => {
                this.isListening = true;
                this.updateVoiceUI('Listening...', true);
                console.log('Voice recognition started');
            };

            this.recognition.onresult = (event) => {
                let interimTranscript = '';
                let finalTranscript = '';

                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const transcript = event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        finalTranscript += transcript;
                        this.processVoiceCommand(finalTranscript.trim());
                    } else {
                        interimTranscript += transcript;
                    }
                }

                this.updateCommandPreview(finalTranscript || interimTranscript);
            };

            this.recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                this.updateVoiceUI(`Error: ${this.getErrorMessage(event.error)}`, false);
                this.stopVoiceRecognition();
                
                // Show user-friendly error message
                if (event.error !== 'no-speech') {
                    this.taskManager.showNotification(`Voice error: ${this.getErrorMessage(event.error)}`, 'error');
                }

                // Handle permission denied error
                if (event.error === 'not-allowed') {
                    this.permissionState = 'denied';
                    this.updatePermissionUI();
                }
            };

            this.recognition.onend = () => {
                if (this.isVoiceActive && this.isListening) {
                    // Auto-restart if still active
                    setTimeout(() => {
                        if (this.isVoiceActive && this.isListening) {
                            try {
                                this.recognition.start();
                            } catch (error) {
                                console.error('Error restarting recognition:', error);
                            }
                        }
                    }, 100);
                } else {
                    this.isListening = false;
                    this.updateVoiceUI('Tap the microphone to start', false);
                }
            };
        } else {
            console.warn('Speech recognition not supported in this browser');
            this.showNotSupportedMessage();
        }
    }

    getErrorMessage(errorCode) {
        const errorMessages = {
            'no-speech': 'No speech was detected',
            'audio-capture': 'No microphone was found',
            'not-allowed': 'Permission to use microphone was denied',
            'network': 'Network error occurred',
            'service-not-allowed': 'Speech recognition service not allowed',
            'bad-grammar': 'Error in speech recognition grammar',
            'language-not-supported': 'Language not supported'
        };
        
        return errorMessages[errorCode] || 'Unknown error occurred';
    }

    showNotSupportedMessage() {
        const statusElement = document.getElementById('voice-status');
        if (statusElement) {
            statusElement.innerHTML = `
                Voice recognition not supported in your browser.<br>
                <small>Try using Chrome, Edge, or Safari</small>
            `;
        }
        
        const micButton = document.getElementById('voice-mic-button');
        if (micButton) {
            micButton.style.opacity = '0.5';
            micButton.style.cursor = 'not-allowed';
            micButton.disabled = true;
        }
    }

    // Public Methods
    startVoiceAssistant() {
        if (!this.isSupported()) {
            this.showNotSupportedMessage();
            this.openVoiceSheet();
            return;
        }
        
        this.openVoiceSheet();
        
        // Check permission state before starting
        if (this.permissionState === 'denied') {
            this.showDeniedModal();
            return;
        }
        
        if (this.permissionState === 'prompt' && !this.hasRequestedPermission) {
            this.showPermissionModal();
            return;
        }
        
        this.startVoiceRecognition();
        this.taskManager.showNotification('Voice assistant activated', 'info');
    }

    stopVoiceAssistant() {
        this.stopVoiceRecognition();
        this.closeVoiceSheet();
        this.taskManager.showNotification('Voice assistant deactivated', 'info');
    }

    toggleListening() {
        if (!this.isSupported()) {
            this.showNotSupportedMessage();
            return;
        }
        
        // Check permissions
        if (this.permissionState === 'denied') {
            this.showDeniedModal();
            return;
        }
        
        if (this.permissionState === 'prompt' && !this.hasRequestedPermission) {
            this.showPermissionModal();
            return;
        }
        
        if (this.isListening) {
            this.stopVoiceRecognition();
        } else {
            this.startVoiceRecognition();
        }
    }

    // Core Voice Recognition Methods
    startVoiceRecognition() {
        if (!this.recognition && this.permissionState === 'granted') {
            this.setupVoiceRecognition();
        }
        
        if (this.recognition && !this.isListening && this.permissionState === 'granted') {
            try {
                this.recognition.start();
                this.isVoiceActive = true;
            } catch (error) {
                console.error('Error starting voice recognition:', error);
                this.taskManager.showNotification('Error starting voice recognition', 'error');
            }
        }
    }

    stopVoiceRecognition() {
        if (this.recognition && this.isListening) {
            try {
                this.recognition.stop();
                this.isListening = false;
                this.isVoiceActive = false;
                this.updateVoiceUI('Tap the microphone to start', false);
            } catch (error) {
                console.error('Error stopping voice recognition:', error);
            }
        }
    }

    // Command Processing (unchanged from original)
    processVoiceCommand(command) {
        console.log('Processing voice command:', command);
        this.addToHistory(command);
        
        const lowerCommand = command.toLowerCase();
        
        // Stop command
        if (lowerCommand.includes('stop lans')) {
            this.speakResponse('Okay, stopping voice control.');
            this.stopVoiceAssistant();
            return;
        }

        // Add task command
        if (lowerCommand.includes('add task')) {
            const taskName = this.extractTaskName(command, 'add task');
            if (taskName) {
                this.taskManager.addTask({ title: taskName });
                this.speakResponse(`Added task: ${taskName}`);
                this.taskManager.showNotification(`Task added: ${taskName}`, 'success');
            } else {
                this.speakResponse("I didn't catch the task name. Please try again.");
            }
            return;
        }

        // Timer commands
        if (lowerCommand.includes('start timer')) {
            this.taskManager.startFocusTimer();
            this.speakResponse('Starting focus timer');
            this.taskManager.showNotification('Focus timer started', 'success');
            return;
        }

        if (lowerCommand.includes('stop timer') || lowerCommand.includes('pause timer')) {
            this.taskManager.pauseFocusTimer();
            this.speakResponse('Timer stopped');
            this.taskManager.showNotification('Timer stopped', 'info');
            return;
        }

        // Navigation commands
        if (lowerCommand.includes('open today') || lowerCommand.includes("today's tasks")) {
            this.taskManager.navigateToPage('today');
            this.speakResponse('Opening today\'s tasks');
            return;
        }

        if (lowerCommand.includes('open dashboard')) {
            this.taskManager.navigateToPage('dashboard');
            this.speakResponse('Opening dashboard');
            return;
        }

        if (lowerCommand.includes('open analytics')) {
            this.taskManager.navigateToPage('analytics');
            this.speakResponse('Opening analytics');
            return;
        }

        // Mark task as done
        if (lowerCommand.includes('mark') && lowerCommand.includes('as done')) {
            const taskName = this.extractTaskName(command, 'mark', 'as done');
            this.completeTaskByName(taskName);
            return;
        }

        // Complete task (alternative phrasing)
        if (lowerCommand.includes('complete task')) {
            const taskName = this.extractTaskName(command, 'complete task');
            this.completeTaskByName(taskName);
            return;
        }

        // If no specific command matched
        this.speakResponse(`I heard: ${command}. What would you like me to do?`);
    }

    extractTaskName(command, ...removePhrases) {
        let taskName = command.toLowerCase();
        removePhrases.forEach(phrase => {
            taskName = taskName.replace(phrase, '');
        });
        return taskName.trim();
    }

    completeTaskByName(taskName) {
        const task = this.taskManager.tasks.find(t => 
            t.title.toLowerCase().includes(taskName.toLowerCase()) && !t.completed
        );
        
        if (task) {
            this.taskManager.toggleTaskCompletion(task.id);
            this.speakResponse(`Marked ${task.title} as done`);
            this.taskManager.showNotification(`Completed: ${task.title}`, 'success');
        } else {
            this.speakResponse(`Could not find task: ${taskName}`);
        }
    }

    // UI Management (unchanged from original)
    openVoiceSheet() {
        const sheet = document.getElementById('voice-bottom-sheet');
        const overlay = document.getElementById('voice-sheet-overlay');
        const voiceButton = document.getElementById('voice-assistant-button');
        
        if (sheet) sheet.classList.add('active');
        if (overlay) overlay.classList.add('active');
        if (voiceButton) voiceButton.classList.add('listening');
    }

    closeVoiceSheet() {
        const sheet = document.getElementById('voice-bottom-sheet');
        const overlay = document.getElementById('voice-sheet-overlay');
        const voiceButton = document.getElementById('voice-assistant-button');
        
        if (sheet) sheet.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
        if (voiceButton) voiceButton.classList.remove('listening');
        this.voiceSheetMinimized = false;
    }

    minimizeVoiceSheet() {
        const sheet = document.getElementById('voice-bottom-sheet');
        if (sheet) {
            if (this.voiceSheetMinimized) {
                sheet.classList.remove('minimized');
                this.voiceSheetMinimized = false;
            } else {
                sheet.classList.add('minimized');
                this.voiceSheetMinimized = true;
            }
        }
    }

    updateVoiceUI(status, isListening) {
        const statusElement = document.getElementById('voice-status');
        const micButton = document.getElementById('voice-mic-button');
        
        if (statusElement) {
            statusElement.textContent = status;
        }
        
        if (micButton) {
            if (isListening) {
                micButton.classList.add('listening');
            } else {
                micButton.classList.remove('listening');
            }
        }
    }

    updateCommandPreview(text) {
        const previewElement = document.getElementById('voice-command-preview');
        if (previewElement) {
            previewElement.textContent = text || 'Your command will appear here...';
            
            // Add visual feedback when command is being processed
            if (text) {
                previewElement.style.borderColor = 'var(--dynamic-primary)';
                setTimeout(() => {
                    previewElement.style.borderColor = 'var(--dynamic-outline-variant)';
                }, 500);
            }
        }
    }

    // Voice Response (unchanged from original)
    speakResponse(text) {
        if (this.speechSynthesis.speaking) {
            this.speechSynthesis.cancel();
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.volume = 0.8;

        // Get available voices and prefer natural-sounding ones
        const voices = this.speechSynthesis.getVoices();
        const preferredVoice = voices.find(voice => 
            voice.lang.includes('en') && voice.name.includes('Natural')
        ) || voices.find(voice => voice.lang.includes('en'));
        
        if (preferredVoice) {
            utterance.voice = preferredVoice;
        }

        this.speechSynthesis.speak(utterance);
    }

    // Command History (unchanged from original)
    addToHistory(command) {
        this.commandHistory.unshift({
            command: command,
            timestamp: new Date().toISOString()
        });
        
        if (this.commandHistory.length > this.maxHistorySize) {
            this.commandHistory.pop();
        }
    }

    getCommandHistory() {
        return this.commandHistory;
    }

    clearCommandHistory() {
        this.commandHistory = [];
    }

    // Utility Methods
    isSupported() {
        return ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) &&
               'mediaDevices' in navigator;
    }

    getStatus() {
        return {
            isVoiceActive: this.isVoiceActive,
            isListening: this.isListening,
            isSupported: this.isSupported(),
            permissionState: this.permissionState,
            hasRequestedPermission: this.hasRequestedPermission,
            historySize: this.commandHistory.length
        };
    }

    // Cleanup method for when the module is no longer needed
    destroy() {
        this.stopVoiceRecognition();
        this.closeVoiceSheet();
        this.hidePermissionModal();
        this.hideDeniedModal();
        
        // Remove event listeners
        const elements = [
            'voice-assistant-button',
            'voice-mic-button',
            'minimize-voice-button',
            'close-voice-button',
            'voice-sheet-header',
            'voice-sheet-overlay',
            'permission-allow-btn',
            'permission-deny-btn',
            'denied-ok-btn'
        ];
        
        elements.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                const newElement = element.cloneNode(true);
                element.parentNode.replaceChild(newElement, element);
            }
        });
        
        console.log('Voice Assistant destroyed');
    }
}

// Add CSS for the permission modals
const voiceAssistantStyles = `
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.modal-overlay[style*="display: flex"] {
    opacity: 1;
}

.modal {
    background: var(--dynamic-surface);
    border-radius: var(--border-radius-lg);
    padding: 0;
    max-width: 400px;
    width: 90%;
    max-height: 80vh;
    overflow: hidden;
    transform: scale(0.9);
    opacity: 0;
    transition: all 0.3s ease;
    box-shadow: var(--shadow-lg);
    border: 1px solid var(--dynamic-outline-variant);
}

.modal-active {
    transform: scale(1);
    opacity: 1;
}

.modal-header {
    padding: var(--space-lg);
    border-bottom: 1px solid var(--dynamic-outline-variant);
}

.modal-content {
    padding: var(--space-lg);
    text-align: center;
}

.modal-content ol {
    text-align: left;
    margin-top: var(--space-md);
    padding-left: var(--space-lg);
}

.modal-content li {
    margin-bottom: var(--space-sm);
}

.modal-actions {
    padding: var(--space-lg);
    display: flex;
    gap: var(--space-md);
    justify-content: flex-end;
    border-top: 1px solid var(--dynamic-outline-variant);
}

.permission-icon {
    font-size: 48px;
    color: var(--dynamic-primary);
    margin-bottom: var(--space-lg);
}

.permission-icon.denied {
    color: var(--dynamic-error);
}

.button {
    padding: var(--space-md) var(--space-lg);
    border: none;
    border-radius: var(--border-radius-md);
    cursor: pointer;
    font-weight: 500;
    transition: all 0.2s ease;
}

.button.primary {
    background: var(--dynamic-primary);
    color: var(--dynamic-on-primary);
}

.button.secondary {
    background: var(--dynamic-surface-variant);
    color: var(--dynamic-on-surface-variant);
    border: 1px solid var(--dynamic-outline);
}

.button:hover {
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
}

.button:active {
    transform: translateY(0);
}
`;

// Inject styles
if (!document.getElementById('voice-assistant-styles')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'voice-assistant-styles';
    styleSheet.textContent = voiceAssistantStyles;
    document.head.appendChild(styleSheet);
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VoiceAssistant;
}