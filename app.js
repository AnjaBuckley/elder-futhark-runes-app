document.addEventListener('DOMContentLoaded', function() {
    // Navigation
    const navLinks = document.querySelectorAll('nav a');
    const pages = document.querySelectorAll('.page');
    const goToLearningBtn = document.getElementById('go-to-learning');

    // Chat elements
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const promptBtns = document.querySelectorAll('.prompt-btn');

    // Learning page elements
    const runeCardsContainer = document.getElementById('rune-cards');

    // Test page elements
    const canvas = document.getElementById('drawing-canvas');
    const ctx = canvas.getContext('2d');
    const clearCanvasBtn = document.getElementById('clear-canvas');
    const submitDrawingBtn = document.getElementById('submit-drawing');
    const currentRuneName = document.getElementById('current-rune-name');
    const drawingFeedback = document.getElementById('drawing-feedback');
    const nextRuneBtn = document.getElementById('next-rune');

    // Current state
    let currentPage = 'launchpad';
    let currentTestRune = null;
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;

    // Initialize the app
    initNavigation();
    initChat();
    initLearningPage();
    initTestPage();

    // Navigation functions
    function initNavigation() {
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetPage = this.getAttribute('data-page');
                changePage(targetPage);
            });
        });

        goToLearningBtn.addEventListener('click', function() {
            changePage('learning');
        });
    }

    function changePage(pageName) {
        // Update navigation
        navLinks.forEach(link => {
            if (link.getAttribute('data-page') === pageName) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // Update page visibility
        pages.forEach(page => {
            if (page.id === pageName) {
                page.classList.add('active');
            } else {
                page.classList.remove('active');
            }
        });

        currentPage = pageName;

        // Special actions for specific pages
        if (pageName === 'test') {
            resetTestPage();
        }
    }

    // Chat functions
    function initChat() {
        sendBtn.addEventListener('click', sendMessage);
        userInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });

        promptBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                userInput.value = this.textContent;
                sendMessage();
            });
        });
    }

    function sendMessage() {
        const message = userInput.value.trim();
        if (message === '') return;

        // Add user message to chat
        addMessageToChat(message, 'user');
        userInput.value = '';

        // Simulate AI response (in a real app, this would call an API)
        setTimeout(() => {
            const response = getAIResponse(message);
            addMessageToChat(response, 'system');
        }, 1000);
    }

    function addMessageToChat(message, sender) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', sender);
        messageElement.textContent = message;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function getAIResponse(message) {
        // Simple response logic - in a real app, this would use ChatGPT API
        message = message.toLowerCase();
        
        if (message.includes('what are elder futhark runes')) {
            return "Elder Futhark is the oldest form of the runic alphabets. It was used by Germanic tribes from the 2nd to 8th centuries CE. It consists of 24 runes, often arranged in three groups of eight runes called ættir.";
        } else if (message.includes('how many runes')) {
            return "The Elder Futhark consists of 24 runes.";
        } else if (message.includes('ansuz')) {
            return "Ansuz (ᚨ) represents the 'a' sound. It's associated with Odin, the chief god in Norse mythology. It symbolizes divine power, wisdom, communication, and inspiration.";
        } else if (message.includes('meaning')) {
            return "Runes were not just letters but also had magical and divinatory meanings. Each rune represents concepts, forces of nature, or aspects of human experience.";
        } else {
            return "I'm a simple AI for this demo. In the full version, I could answer more detailed questions about Elder Futhark runes using ChatGPT's capabilities.";
        }
    }

    // Learning page functions
    function initLearningPage() {
        createRuneCards();
    }

    function createRuneCards() {
        runesData.forEach(rune => {
            const card = document.createElement('div');
            card.classList.add('rune-card');
            card.innerHTML = `
                <div class="rune-card-inner">
                    <div class="rune-card-front">
                        <div class="rune-symbol">${rune.symbol}</div>
                    </div>
                    <div class="rune-card-back">
                        <div class="rune-name">${rune.name}</div>
                        <div class="rune-latin">Latin: ${rune.latin}</div>
                        <div class="rune-meaning">${rune.meaning}</div>
                    </div>
                </div>
            `;
            card.addEventListener('click', function() {
                this.classList.toggle('flipped');
            });
            runeCardsContainer.appendChild(card);
        });
    }

    // Test page functions
    function initTestPage() {
        // Set up canvas drawing
        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', stopDrawing);
        canvas.addEventListener('mouseout', stopDrawing);
        
        // Touch support
        canvas.addEventListener('touchstart', handleTouch);
        canvas.addEventListener('touchmove', handleTouch);
        canvas.addEventListener('touchend', stopDrawing);

        // Buttons
        clearCanvasBtn.addEventListener('click', clearCanvas);
        submitDrawingBtn.addEventListener('click', evaluateDrawing);
        nextRuneBtn.addEventListener('click', nextRune);

        // Initialize canvas
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = '#000';
    }

    function resetTestPage() {
        clearCanvas();
        drawingFeedback.className = 'feedback-container';
        drawingFeedback.textContent = '';
        nextRuneBtn.classList.add('hidden');
        
        // Select a random rune for testing
        currentTestRune = runesData[Math.floor(Math.random() * runesData.length)];
        currentRuneName.textContent = `Draw: ${currentTestRune.name} (${currentTestRune.latin})`;
    }

    function startDrawing(e) {
        isDrawing = true;
        const rect = canvas.getBoundingClientRect();
        lastX = e.clientX - rect.left;
        lastY = e.clientY - rect.top;
    }

    function draw(e) {
        if (!isDrawing) return;
        
        const rect = canvas.getBoundingClientRect();
        const currentX = e.clientX - rect.left;
        const currentY = e.clientY - rect.top;
        
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(currentX, currentY);
        ctx.stroke();
        
        lastX = currentX;
        lastY = currentY;
    }

    function handleTouch(e) {
        e.preventDefault();
        
        if (e.type === 'touchstart') {
            isDrawing = true;
            const rect = canvas.getBoundingClientRect();
            lastX = e.touches[0].clientX - rect.left;
            lastY = e.touches[0].clientY - rect.top;
        } else if (e.type === 'touchmove' && isDrawing) {
            const rect = canvas.getBoundingClientRect();
            const currentX = e.touches[0].clientX - rect.left;
            const currentY = e.touches[0].clientY - rect.top;
            
            ctx.beginPath();
            ctx.moveTo(lastX, lastY);
            ctx.lineTo(currentX, currentY);
            ctx.stroke();
            
            lastX = currentX;
            lastY = currentY;
        }
    }

    function stopDrawing() {
        isDrawing = false;
    }

    function clearCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    function evaluateDrawing() {
        // In a real app, this would use image recognition or AI to compare the drawing
        // For this demo, we'll simulate feedback
        
        const feedback = simulateDrawingEvaluation();
        
        if (feedback.success) {
            drawingFeedback.className = 'feedback-container success';
        } else {
            drawingFeedback.className = 'feedback-container error';
        }
        
        drawingFeedback.textContent = feedback.message;
        nextRuneBtn.classList.remove('hidden');
    }

    function simulateDrawingEvaluation() {
        // This is a placeholder for actual drawing evaluation
        // In a real app, you would use AI to compare the drawing with the correct rune
        
        // For demo purposes, randomly determine success/failure
        const success = Math.random() > 0.5;
        
        if (success) {
            return {
                success: true,
                message: `Great job! Your drawing of ${currentTestRune.name} looks correct.`
            };
        } else {
            return {
                success: false,
                message: `Your drawing needs some improvement. The ${currentTestRune.name} rune typically has straighter lines. Try again!`
            };
        }
    }

    function nextRune() {
        resetTestPage();
    }
}); 