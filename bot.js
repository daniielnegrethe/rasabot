document.addEventListener("DOMContentLoaded", function() {
    // Crear contenedor del chat
    const chatContainer = document.createElement("div");
    chatContainer.classList.add("chat-container");
    chatContainer.style.position = "fixed";
    chatContainer.style.bottom = "20px";
    chatContainer.style.right = "20px";
    chatContainer.style.width = "350px";
    chatContainer.style.backgroundColor = "rgb(198, 185, 185)";
    chatContainer.style.borderRadius = "10px";
    chatContainer.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";
    chatContainer.style.overflow = "hidden";
    chatContainer.style.transition = "all 0.3s ease";

    // Crear encabezado del chat
    const chatHeader = document.createElement("div");
    chatHeader.classList.add("chat-header");
    chatHeader.style.backgroundColor = "#0066cc";
    chatHeader.style.color = "white";
    chatHeader.style.padding = "10px";
    chatHeader.style.display = "flex";
    chatHeader.style.justifyContent = "space-between";
    chatHeader.style.alignItems = "center";
    chatHeader.style.cursor = "pointer";
    chatHeader.textContent = "Asistente Virtual Oohel";
    chatHeader.onclick = function() {
        chatBody.classList.toggle("open");
    };

    // Crear cuerpo del chat
    const chatBody = document.createElement("div");
    chatBody.classList.add("chat-body");
    chatBody.style.height = "0";
    chatBody.style.opacity = "0";
    chatBody.style.transition = "all 0.3s ease";
    chatBody.style.overflow = "hidden";
    
    // Contenedor de mensajes
    const messagesContainer = document.createElement("div");
    messagesContainer.classList.add("messages");
    messagesContainer.style.height = "350px";
    messagesContainer.style.overflowY = "auto";
    messagesContainer.style.padding = "10px";
    messagesContainer.style.backgroundColor = "#f9f9f9";
    
    // Primer mensaje del bot
    const botMessage = document.createElement("div");
    botMessage.classList.add("message", "bot-message");
    botMessage.style.backgroundColor = "#f1f0f0";
    botMessage.style.padding = "10px";
    botMessage.style.borderRadius = "8px";
    botMessage.textContent = "¡Hola! Soy el asistente virtual de Oohel Technologies. ¿En qué puedo ayudarte hoy?";
    messagesContainer.appendChild(botMessage);

    // Área de entrada de mensajes
    const inputArea = document.createElement("div");
    inputArea.classList.add("input-area");
    inputArea.style.display = "flex";
    inputArea.style.padding = "10px";
    inputArea.style.borderTop = "1px solid #eee";
    inputArea.style.backgroundColor = "white";
    
    const inputField = document.createElement("input");
    inputField.type = "text";
    inputField.placeholder = "Escribe tu mensaje...";
    inputField.style.flexGrow = "1";
    inputField.style.padding = "10px";
    inputField.style.border = "1px solid #ddd";
    inputField.style.borderRadius = "4px";
    inputField.style.marginRight = "10px";
    
    const sendButton = document.createElement("button");
    sendButton.textContent = "Enviar";
    sendButton.style.backgroundColor = "#0066cc";
    sendButton.style.color = "white";
    sendButton.style.border = "none";
    sendButton.style.padding = "10px 15px";
    sendButton.style.borderRadius = "4px";
    sendButton.style.cursor = "pointer";
    sendButton.onclick = function() {
        const userMessage = inputField.value.trim();
        if (userMessage === "") return;

        const userMessageEl = document.createElement("div");
        userMessageEl.classList.add("message", "user-message");
        userMessageEl.style.backgroundColor = "#e6f2ff";
        userMessageEl.style.padding = "10px";
        userMessageEl.style.borderRadius = "8px";
        userMessageEl.style.textAlign = "right";
        userMessageEl.textContent = userMessage;
        messagesContainer.appendChild(userMessageEl);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        inputField.value = "";
    };

    inputArea.appendChild(inputField);
    inputArea.appendChild(sendButton);
    chatBody.appendChild(messagesContainer);
    chatBody.appendChild(inputArea);
    chatContainer.appendChild(chatHeader);
    chatContainer.appendChild(chatBody);
    document.body.appendChild(chatContainer);
});