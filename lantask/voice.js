/**
 * Voice Assistant Module for LanTask Pro
 * Self-contained module that can be easily managed and updated
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
        
        // Command history
        this.commandHistory = [];
        this.maxHistorySize = 10;
        
        this.init();
    }

    init() {
        this.setupDOM();
        this.setupEventListeners();
        this.setupVoiceRecognition();
        
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
            `;
            document.body.insertAdjacentHTML('beforeend', voiceHTML);
        }
    }

    setupEventListeners() {
        // Voice button in header
        document.getElementById('voice-assistant-button').addEventListener('click', () => {
            this.startVoiceAssistant();
        });

        // Microphone button
        document.getElementById('voice-mic-button').addEventListener('click', () => {
            this.toggleListening();
        });

        // Minimize button
        document.getElementById('minimize-voice-button').addEventListener('click', (e) => {
            e.stopPropagation();
            this.minimizeVoiceSheet();
        });

        // Close button
        document.getElementById('close-voice-button').addEventListener('click', (e) => {
            e.stopPropagation();
            this.stopVoiceAssistant();
        });

        // Header click to maximize
        document.getElementById('voice-sheet-header').addEventListener('click', () => {
            if (this.voiceSheetMinimized) {
                this.minimizeVoiceSheet();
            }
        });

        // Overlay click to close
        document.getElementById('voice-sheet-overlay').addEventListener('click', () => {
            this.stopVoiceAssistant();
        });

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
        }
    }

    // Public Methods
    startVoiceAssistant() {
        if (!this.recognition) {
            this.showNotSupportedMessage();
            return;
        }
        
        this.openVoiceSheet();
        this.startVoiceRecognition();
        this.taskManager.showNotification('Voice assistant activated', 'info');
    }

    stopVoiceAssistant() {
        this.stopVoiceRecognition();
        this.closeVoiceSheet();
        this.taskManager.showNotification('Voice assistant deactivated', 'info');
    }

    toggleListening() {
        if (!this.recognition) {
            this.showNotSupportedMessage();
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
        if (this.recognition && !this.isListening) {
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

    // Command Processing
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

    // UI Management
    openVoiceSheet() {
        document.getElementById('voice-bottom-sheet').classList.add('active');
        document.getElementById('voice-sheet-overlay').classList.add('active');
        document.getElementById('voice-assistant-button').classList.add('listening');
    }

    closeVoiceSheet() {
        document.getElementById('voice-bottom-sheet').classList.remove('active');
        document.getElementById('voice-sheet-overlay').classList.remove('active');
        document.getElementById('voice-assistant-button').classList.remove('listening');
        this.voiceSheetMinimized = false;
    }

    minimizeVoiceSheet() {
        const sheet = document.getElementById('voice-bottom-sheet');
        if (this.voiceSheetMinimized) {
            sheet.classList.remove('minimized');
            this.voiceSheetMinimized = false;
        } else {
            sheet.classList.add('minimized');
            this.voiceSheetMinimized = true;
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

    // Voice Response
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

    // Command History
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
        return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    }

    getStatus() {
        return {
            isVoiceActive: this.isVoiceActive,
            isListening: this.isListening,
            isSupported: this.isSupported(),
            historySize: this.commandHistory.length
        };
    }

    // Cleanup method for when the module is no longer needed
    destroy() {
        this.stopVoiceRecognition();
        this.closeVoiceSheet();
        
        // Remove event listeners
        document.getElementById('voice-assistant-button').removeEventListener('click', this.startVoiceAssistant);
        document.getElementById('voice-mic-button').removeEventListener('click', this.toggleListening);
        document.getElementById('minimize-voice-button').removeEventListener('click', this.minimizeVoiceSheet);
        document.getElementById('close-voice-button').removeEventListener('click', this.stopVoiceAssistant);
        document.getElementById('voice-sheet-header').removeEventListener('click', this.minimizeVoiceSheet);
        document.getElementById('voice-sheet-overlay').removeEventListener('click', this.stopVoiceAssistant);
        
        console.log('Voice Assistant destroyed');
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VoiceAssistant;
}