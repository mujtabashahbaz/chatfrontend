// Smooth Scrolling for Navigation Links
document.querySelectorAll('nav a').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href').substring(1);
    document.getElementById(targetId).scrollIntoView({
      behavior: 'smooth'
    });
  });
});

// WhatsApp Chat Integration
function toggleWhatsAppChat() {
  const whatsappContainer = document.getElementById('whatsapp-container');
  whatsappContainer.classList.toggle('collapsed');

  // Toggle visibility of WhatsApp buttons
  const whatsappButtons = document.getElementById('whatsapp-buttons');
  if (whatsappContainer.classList.contains('collapsed')) {
    whatsappButtons.style.display = 'none';
  } else {
    whatsappButtons.style.display = 'block';
  }
}

// Chatbot Functionality
const apiUrl = "https://smilecenterchat.onrender.com/chat";
const chatMessages = document.getElementById("chat-messages");

// Add message to the chatbox
function addMessage(content, sender) {
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message", sender);
  messageDiv.innerText = content;
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Send message to backend
async function sendMessage() {
  const userInput = document.getElementById("user-input");
  const message = userInput.value.trim();
  if (!message) return;

  // Display user's message
  addMessage(message, "user");
  userInput.value = "";

  try {
    // Send message to API and get response
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: message })
    });
    const data = await response.json();

    // Display bot's reply
    if (data.reply) {
      addMessage(data.reply, "bot");
    } else {
      addMessage("Sorry, I couldn't understand that.", "bot");
    }
  } catch (error) {
    console.error("Error:", error);
    addMessage("There was an error connecting to the server.", "bot");
  }
}

// Enable sending messages using Enter key
document.getElementById("user-input").addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    sendMessage();
  }
});

// Toggle Chatbot Collapse/Expand
function toggleChatbot() {
  const chatContainer = document.getElementById('chat-container');
  chatContainer.classList.toggle('collapsed');

  // Toggle visibility of chat messages
  const chatMessages = document.getElementById('chat-messages');
  if (chatContainer.classList.contains('collapsed')) {
    chatMessages.style.display = 'none';
  } else {
    chatMessages.style.display = 'block';
  }
}

// Initialize Containers as Collapsed by Default
document.addEventListener('DOMContentLoaded', () => {
  const whatsappContainer = document.getElementById('whatsapp-container');
  const chatContainer = document.getElementById('chat-container');

  // Set initial states
  whatsappContainer.classList.add('collapsed');
  chatContainer.classList.add('collapsed');

  // Hide content initially
  document.getElementById('whatsapp-buttons').style.display = 'none';
  document.getElementById('chat-messages').style.display = 'none';
});