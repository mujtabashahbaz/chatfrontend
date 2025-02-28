// Toggle collapse/expand for chat components
function toggleChat(chatType) {
  const container = document.getElementById(chatType === 'whatsapp' ? 'whatsapp-container' : 'chat-container');
  container.classList.toggle('collapsed');

  // Save the collapsed state in localStorage
  const isCollapsed = container.classList.contains('collapsed');
  localStorage.setItem(`${chatType}-collapsed`, isCollapsed);
}

// Load collapsed state on page load
document.addEventListener('DOMContentLoaded', () => {
  const whatsappContainer = document.getElementById('whatsapp-container');
  const chatContainer = document.getElementById('chat-container');

  // Restore WhatsApp chat collapsed state
  const isWhatsAppCollapsed = localStorage.getItem('whatsapp-collapsed') === 'true';
  if (isWhatsAppCollapsed) {
    whatsappContainer.classList.add('collapsed');
  }

  // Restore chatbot collapsed state
  const isChatbotCollapsed = localStorage.getItem('chatbot-collapsed') === 'true';
  if (isChatbotCollapsed) {
    chatContainer.classList.add('collapsed');
  }
});

// Chatbot functionality with timestamp and Markdown formatting
const apiUrl = "https://smilecenterchat.onrender.com/chat";
const chatMessages = document.getElementById("chat-messages");

// Add message to the chatbox with timestamp
function addMessage(content, sender) {
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message", sender);

  // Format message with Markdown (bold, italic, links)
  const formattedContent = formatMarkdown(content);

  // Add timestamp
  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  messageDiv.innerHTML = `<span class="timestamp">${timestamp}</span> ${formattedContent}`;
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  // Save chat history to localStorage
  saveChatHistory();
}

// Format Markdown (basic support for bold, italic, and links)
function formatMarkdown(text) {
  // Bold text: **text**
  text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  // Italic text: *text*
  text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');

  // Links: [text](url)
  text = text.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>');

  return text;
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
      body: JSON.stringify({ message: message }),
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

// Save chat history to localStorage
function saveChatHistory