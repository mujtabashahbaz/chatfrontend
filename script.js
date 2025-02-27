// Smooth scrolling for navigation links
document.querySelectorAll('nav a').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href').substring(1);
    document.getElementById(targetId).scrollIntoView({
      behavior: 'smooth'
    });
  });
});

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
document.getElementById("user-input").addEventListener("keypress", function(e) {
  if (e.key === "Enter") {
    sendMessage();
  }
});