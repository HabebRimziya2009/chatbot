function toggleChat() {
  const chatWidget = document.getElementById("chat-widget");
  const toggleIcon = document.querySelector("#chat-toggle i");

  const isMinimized = chatWidget.classList.contains("minimized");

  if (isMinimized) {
    chatWidget.classList.remove("minimized");
    toggleIcon.classList.remove("flipped");
  } else {
    chatWidget.classList.add("minimized");
    toggleIcon.classList.add("flipped");
  }
}


async function sendMessage() {
  const input = document.getElementById("chat-input");
  const message = input.value.trim();

  if (!message) return;

  // Clear input field
  input.value = "";

  try {
    const response = await fetch("https://chatbot-backend-hxus.onrender.com/ask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ query: message })  // <-- this is the key
    });

    const data = await response.json();

    // Display bot's response
    displayMessage(data.response || "No response", "bot");
  } catch (error) {
    console.error("Error sending message:", error);
    displayMessage("Error contacting server.", "bot");
  }
  input.disabled = false;
  sendBtn.disabled = false;
  input.focus();
}


function appendMessage(text, className) {
  const chatMessages = document.getElementById("chat-messages");
  const message = document.createElement("div");
  message.className = "message " + className;
  message.textContent = text;
  chatMessages.appendChild(message);
  chatMessages.scrollTo({
    top: chatMessages.scrollHeight,
    behavior: 'smooth'
  });
}

// Set initial visibility
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("chat-messages").style.display = "flex";
  document.getElementById("chat-input-container").style.display = "flex";
});

// Enter Key --> Send Message
document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("chat-input");
  input.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault(); // prevents newline if it's a textarea
      sendMessage();
    }
  });
});
