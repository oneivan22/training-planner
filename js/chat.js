// Токен HuggingFace для доступа к AI
var HF_TOKEN = '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';

// Добавить сообщение в чат
function addMessage(text, type) {
    var box = document.getElementById('chatBox');
    if (!box) return;
    var div = document.createElement('div');
    div.className = 'chat-message ' + type;

    // Форматирование: **жирный** и переносы строк
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/\n/g, '<br>');

    div.innerHTML = text;
    box.appendChild(div);
    box.scrollTop = box.scrollHeight;
}

// Отправить вопрос AI-тренеру
function sendMessage() {
    var input = document.getElementById('chatInput');
    if (!input) return;
    var text = input.value.trim();
    if (!text) return;

    addMessage(text, 'user');
    input.value = '';
    addMessage('Думаю...', 'bot');

    // Запрос к HuggingFace API
    fetch('https://router.huggingface.co/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + HF_TOKEN,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: 'moonshotai/Kimi-K2-Instruct-0905',
            messages: [
                {
                    role: 'system',
                    content: 'Ты — персональный тренер по фитнесу. Отвечай кратко, по делу, не более 8 предложений. Всегда на русском языке.'
                },
                { role: 'user', content: text }
            ],
            max_tokens: 1200
        })
    })
    .then(function(res) { return res.json(); })
    .then(function(data) {
        // Убираем "Думаю..."
        var box = document.getElementById('chatBox');
        var last = box.lastChild;
        if (last && last.textContent === 'Думаю...') box.removeChild(last);

        // Показываем ответ
        if (data.choices && data.choices[0]) {
            addMessage(data.choices[0].message.content, 'bot');
        } else if (data.error) {
            addMessage('Ошибка: ' + data.error.message, 'bot');
        } else {
            addMessage('Попробуйте ещё раз.', 'bot');
        }
    })
    .catch(function() {
        var box = document.getElementById('chatBox');
        var last = box.lastChild;
        if (last && last.textContent === 'Думаю...') box.removeChild(last);
        addMessage('Ошибка соединения.', 'bot');
    });
}

// Отправка по Enter
function setupChat() {
    var chatInput = document.getElementById('chatInput');
    if (chatInput) {
        chatInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') sendMessage();
        });
    }
}
