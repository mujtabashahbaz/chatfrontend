// Toggle Collapse/Expand for Chat Components
function toggleChat(chatType) {
  const container = document.getElementById(chatType === 'whatsapp' ? 'whatsapp-container' : 'chat-container');
  container.classList.toggle('collapsed');

  // Save the collapsed state in localStorage
  const isCollapsed = container.classList.contains('collapsed');
  localStorage.setItem(`${chatType}-collapsed`, isCollapsed);
}

// Load Collapsed State on Page Load
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

  // Load chat history for the chatbot
  clearChatHistoryAfter24Hours();
  setChatHistoryTime();
  loadChatHistory();
});

// Chatbot Functionality with Timestamp and Markdown Formatting
const apiUrl = "https://smilecenterchat.onrender.com/chat"; // Replace with your API endpoint
const chatMessages = document.getElementById("chat-messages");

// Add Message to the Chatbox with Timestamp
function addMessage(content, sender) {
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message", sender);

  // Format message with Markdown (bold, italic, links)
  const formattedContent = formatMarkdown(content);

  // Add timestamp
  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Create a span for the timestamp
  const timestampSpan = document.createElement("span");
  timestampSpan.classList.add("timestamp");
  timestampSpan.textContent = timestamp;

  // Add content with proper paragraphing for bot responses
  const contentDiv = document.createElement("div");
  if (sender === "bot") {
    // Split content into paragraphs for better readability
    const paragraphs = formattedContent.split("\n").filter(paragraph => paragraph.trim() !== "");
    paragraphs.forEach(paragraph => {
      const p = document.createElement("p");
      p.innerHTML = paragraph;
      contentDiv.appendChild(p);
    });
  } else {
    // For user messages, keep it as-is
    contentDiv.innerHTML = formattedContent;
  }

  // Append timestamp and content to the message div
  messageDiv.appendChild(timestampSpan);
  messageDiv.appendChild(contentDiv);

  // Add the message to the chat window
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

// Send Message to Backend
async function sendMessage() {
  const userInput = document.getElementById("user-input");
  const message = userInput.value.trim();
  if (!message) return;

  // Display user's message
  addMessage(message, "user");
  userInput.value = "";

  try {
    // Simulate sending message to API and get response
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: message }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

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

// Enable Sending Messages Using Enter Key
document.getElementById("user-input").addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    sendMessage();
  }
});

// Save Chat History to localStorage
function saveChatHistory() {
  const messages = Array.from(chatMessages.children).map(message => ({
    content: message.innerHTML,
    sender: message.classList.contains("user") ? "user" : "bot",
  }));
  localStorage.setItem("chat-history", JSON.stringify(messages));
}

// Load Chat History from localStorage
function loadChatHistory() {
  const savedHistory = localStorage.getItem("chat-history");
  if (savedHistory) {
    const messages = JSON.parse(savedHistory);
    messages.forEach(({ content, sender }) => {
      const messageDiv = document.createElement("div");
      messageDiv.classList.add("message", sender);
      messageDiv.innerHTML = content;
      chatMessages.appendChild(messageDiv);
    });
  }
}

// Clear Chat History After 24 Hours
function clearChatHistoryAfter24Hours() {
  const lastSavedTime = localStorage.getItem("chat-history-time");
  const currentTime = Date.now();

  if (!lastSavedTime || currentTime - parseInt(lastSavedTime) > 24 * 60 * 60 * 1000) {
    localStorage.removeItem("chat-history");
    localStorage.removeItem("chat-history-time");
    chatMessages.innerHTML = ""; // Clear the chat messages
  }
}

// Set the Current Time When Saving Chat History
function setChatHistoryTime() {
  localStorage.setItem("chat-history-time", Date.now());
}

// Clear Chat History
function clearChat() {
  const chatMessages = document.getElementById("chat-messages");

  // Clear messages from the UI
  chatMessages.innerHTML = "";

  // Remove chat history from localStorage
  localStorage.removeItem("chat-history");
  localStorage.removeItem("chat-history-time");

  console.log("Chat history cleared.");
}