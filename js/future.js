document.addEventListener('DOMContentLoaded', () => {
    const messageInput = document.getElementById('messageInput');
    const submitButton = document.getElementById('submitMessage');
    const messageWall = document.getElementById('messageWall');

    let coins = parseInt(localStorage.getItem('coins')) || 0;
    
    // 初始化显示金币数量
    updateCoinsDisplay();

    // 更新金币显示
    function updateCoinsDisplay() {
        document.querySelector('.coin-count').textContent = coins;
    }

    // 提交消息
    submitButton.addEventListener('click', () => {
        const message = messageInput.value.trim();
        if (message && coins > 0) {
            // 扣除金币
            coins--;
            localStorage.setItem('coins', coins.toString());
            updateCoinsDisplay();
            
            // 添加消息
            addNewMessage(message);
            messageInput.value = '';
        } else if (coins <= 0) {
            alert('金币不足，无法发送留言！');
        }
    });

    // 随机位置生成
    function getRandomPosition() {
        return {
            top: Math.random() * 70 + 10 + '%',
            left: Math.random() * 70 + 10 + '%'
        };
    }

    // 创建新的消息气泡
    function createMessageBubble(message) {
        const bubble = document.createElement('div');
        bubble.className = 'message-bubble';
        bubble.textContent = message;
        
        const position = getRandomPosition();
        bubble.style.top = position.top;
        bubble.style.left = position.left;
        bubble.style.animationDelay = Math.random() * 2 + 's';
        
        return bubble;
    }

    // 添加新消息
    function addNewMessage(message) {
        const bubble = createMessageBubble(message);
        messageWall.appendChild(bubble);

        // 淡入动画
        bubble.style.opacity = '0';
        bubble.style.transform = 'scale(0.8) translateY(20px)';
        
        setTimeout(() => {
            bubble.style.opacity = '1';
            bubble.style.transform = 'scale(1) translateY(0)';
        }, 100);

        // 控制消息数量，保持最新的8条
        const bubbles = messageWall.getElementsByClassName('message-bubble');
        if (bubbles.length > 8) {
            messageWall.removeChild(bubbles[0]);
        }
    }

    // 提交消息
    submitButton.addEventListener('click', () => {
        const message = messageInput.value.trim();
        if (message) {
            addNewMessage(message);
            messageInput.value = '';
        }
    });

    // 按Enter提交
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            submitButton.click();
        }
    });
});