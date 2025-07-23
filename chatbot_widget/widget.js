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


function sendMessage() {
  const input = document.getElementById("chat-input");
  const sendBtn = document.getElementById("chat-send");
  const message = input.value.trim();
  if (!message) return;

  // Disable input and button while bot is "typing"
  input.disabled = true;
  sendBtn.disabled = true;

  appendMessage(message, "user-message");
  input.value = "";

  // Fake bot response delay
  setTimeout(() => {
    appendMessage("Thanks! Let me get back to you on that.", "bot-message");

    // Re-enable input and button
    input.disabled = false;
    sendBtn.disabled = false;
    input.focus();
  }, 1500);
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
