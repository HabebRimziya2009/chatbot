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


async function sendMessage(message) {
  // Show temporary loading message
  const loadingMessage = appendMessage("...", "bot-message");

  try {
    const response = await fetch("https://chatbot-backend-hxus.onrender.com/ask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ question: message })
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();

    // Replace the loading message with the actual bot response
    loadingMessage.textContent = data.response;
  } catch (err) {
    console.error("Fetch error:", err);
    loadingMessage.textContent = "Something went wrong. Please try again.";
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
