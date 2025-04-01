(function() {
    // Estilos en tiempo real
    const style = document.createElement('style');
    style.textContent = `
        .chat-container {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 350px;
            background-color: rgb(198, 185, 185);
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            overflow: hidden;
            transition: all 0.3s ease;
            z-index: 9999;
            font-family: Arial, sans-serif;
        }
        .chat-header {
            background-color: #0066cc;
            color: white;
            padding: 10px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: pointer;
        }
        .chat-header-content {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .chat-logo {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            object-fit: cover;
        }
        .chat-title {
            font-weight: bold;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .chat-body {
            height: 0;
            opacity: 0;
            transition: all 0.3s ease;
            overflow: hidden;
        }
        .chat-body.open {
            height: 450px;
            opacity: 1;
        }
        .messages {
            height: 350px;
            overflow-y: auto;
            padding: 10px;
            background-color: #f9f9f9;
        }
        .message {
            margin-bottom: 10px;
            padding: 10px;
            border-radius: 8px;
            max-width: 80%;
            clear: both;
        }
        .user-message {
            background-color: #e6f2ff;
            float: right;
            text-align: right;
            margin-left: auto;
        }
        .bot-message {
            background-color: #f1f0f0;
            float: left;
            text-align: left;
        }
        .input-area {
            display: flex;
            padding: 10px;
            border-top: 1px solid #eee;
            background-color: white;
        }
        .input-area input {
            flex-grow: 1;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            margin-right: 10px;
        }
        .input-area button {
            background-color: #0066cc;
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.3s;
        }
        .input-area button:hover {
            background-color: #0052a3;
        }
        .loading {
            text-align: center;
            padding: 10px;
            color: #666;
        }
    `;
    document.head.appendChild(style);

    // HTML del chat
    const container = document.createElement('div');
    container.innerHTML = `
        <div class="chat-container">
            <div class="chat-header" id="chat-header">
                <div class="chat-header-content">
                    <img src="https://media.licdn.com/dms/image/v2/D4E0BAQHmxViisOIY9A/company-logo_200_200/company-logo_200_200/0/1730993264475/oohel_technologies_logo?e=2147483647&v=beta&t=0rcPoBP1tpmuQDu4NKzAdjPCMN1mJp4Rf4sBNcSwQeE" 
                         alt="Oohel Technologies Logo" 
                         class="chat-logo">
                    <span class="chat-title">Asistente Virtual Oohel</span>
                </div>
                <span id="chat-toggle">▼</span>
            </div>
            <div class="chat-body" id="chat-body">
                <div class="messages" id="messages">
                    <div class="message bot-message">
                        ¡Hola! Soy el asistente virtual de Oohel Technologies. ¿En qué puedo ayudarte hoy?
                    </div>
                </div>
                <div class="input-area">
                    <input type="text" id="user-input" placeholder="Escribe tu mensaje...">
                    <button id="send-button">Enviar</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(container);

    const RASA_SERVER_URL = 'http://localhost:5005/webhooks/rest/webhook';
    const SENDER_ID = 'usuario_' + Math.random().toString(36).substring(7);

    const chatHeader = document.getElementById('chat-header');
    const chatToggle = document.getElementById('chat-toggle');
    const chatBody = document.getElementById('chat-body');
    const input = document.getElementById('user-input');
    const messages = document.getElementById('messages');
    const sendButton = document.getElementById('send-button');

    chatHeader.addEventListener('click', () => {
        chatBody.classList.toggle('open');
        chatToggle.textContent = chatBody.classList.contains('open') ? '▲' : '▼';
    });

    sendButton.addEventListener('click', sendMessage);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    function sendMessage() {
        if (input.value.trim() === '') return;

        const userMessageEl = document.createElement('div');
        userMessageEl.classList.add('message', 'user-message');
        userMessageEl.textContent = input.value;
        messages.appendChild(userMessageEl);

        const loadingEl = document.createElement('div');
        loadingEl.classList.add('message', 'bot-message', 'loading');
        loadingEl.textContent = 'Escribiendo...';
        messages.appendChild(loadingEl);
        messages.scrollTop = messages.scrollHeight;

        fetch(RASA_SERVER_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                sender: SENDER_ID,
                message: input.value
            })
        })
        .then(response => response.json())
        .then(data => {
            messages.removeChild(loadingEl);
            if (data.length === 0) {
                const fallback = document.createElement('div');
                fallback.classList.add('message', 'bot-message');
                fallback.textContent = 'Lo siento, no pude encontrar una respuesta. ¿Podrías reformular tu pregunta?';
                messages.appendChild(fallback);
            } else {
                data.forEach(botMsg => {
                    const botMessageEl = document.createElement('div');
                    botMessageEl.classList.add('message', 'bot-message');
                    botMessageEl.textContent = botMsg.text;
                    messages.appendChild(botMessageEl);
                });
            }
            messages.scrollTop = messages.scrollHeight;
        })
        .catch(error => {
            messages.removeChild(loadingEl);
            const errorMessage = document.createElement('div');
            errorMessage.classList.add('message', 'bot-message');
            errorMessage.textContent = 'Hubo un error al conectar con el asistente. Por favor, inténtalo de nuevo.';
            messages.appendChild(errorMessage);
            console.error('Chatbot error:', error);
        });

        input.value = '';
    }
})();
