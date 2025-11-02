document.addEventListener('DOMContentLoaded', () => {

    // Get references to the HTML elements
    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const sendButton = document.getElementById('send-btn');

    // Function to add a message to the chat window
    function displayMessage(message, sender) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', sender);
        messageElement.textContent = message;
        chatMessages.appendChild(messageElement);
        scrollToBottom();
    }

    // Function to show the typing indicator
    function showTypingIndicator() {
        // Check if one already exists
        if (document.querySelector('.typing-indicator')) return;

        const typingElement = document.createElement('div');
        typingElement.classList.add('message', 'bot', 'typing-indicator');
        typingElement.innerHTML = `
            <span></span>
            <span></span>
            <span></span>
        `;
        chatMessages.appendChild(typingElement);
        scrollToBottom();
    }

    // Function to hide the typing indicator
    function hideTypingIndicator() {
        const typingElement = document.querySelector('.typing-indicator');
        if (typingElement) {
            typingElement.remove();
        }
    }

    // Helper function to scroll down
    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Function to get a REAL response from your backend
    async function getGammaResponse(userMessage) {
        showTypingIndicator(); // Show the "..."

        try {
            // 
            // V V V V V V V V V V V V V V V V V V V V V V V V V V V V V V
            //
            //  !!!  IMPORTANT: REPLACE THIS URL  !!!
            //  Replace 'http://localhost:3000/chat' with your 
            //  live 'https://your-app-name.onrender.com/chat' URL
            //
            const response = await fetch('https://gamma-ai.onrender.com/chat', { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: userMessage }),
            });
            //
            // ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^
            //

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();

            // Display the AI's reply
            hideTypingIndicator();
            displayMessage(data.reply, 'bot');

        } catch (error) {
            console.error('Error fetching from backend:', error);
            hideTypingIndicator();
            displayMessage("Sorry, I'm having trouble connecting to my brain. Please try again.", 'bot');
        }
    }

    // Function to handle sending a message
    function sendMessage() {
        const messageText = chatInput.value.trim();
        if (messageText === '') return; 

        displayMessage(messageText, 'user');
        chatInput.value = '';
        getGammaResponse(messageText); // Call the new async function
    }

    // Event Listeners
    sendButton.addEventListener('click', sendMessage);
    chatInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault(); 
            sendMessage();
        }
    });

    // Display a welcome message when the page loads
    setTimeout(() => {
        displayMessage("Welcome! I am Gamma Γ. Feel free to ask me anything.", 'bot');
    }, 1200); // Delayed to let the page load animation finish

});