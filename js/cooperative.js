// 对话内容
const dialogues = [
    {
        text: "欢迎来到普照村附子合作社！我是这里的负责人王主任。",
        options: [
            { text: "请问普照村的附子是怎么发展起来的？", next: 1 },
            { text: "我想了解一下合作社的情况", next: 2 },
            { text: "我想帮忙打包附子", next: 'game' }
        ]
    },
    {
        text: "普照村的附子种植历史悠久，这里得天独厚的自然环境和气候条件，使得附子生长特别旺盛。最早的时候，这里就是一片野生附子的产地。后来，我们村开始规模化种植，建立了标准化的种植基地...",
        options: [
            { text: "继续了解", next: 3 },
            { text: "返回上一级", next: 0 }
        ]
    },
    {
        text: "我们普照村的附子专业合作社成立于2010年，现在已经有超过100户村民加入。我们主要负责全村附子的统一种植、加工和销售，同时也为农户提供技术支持。普照村现在已经成为江油市最大的附子种植基地...",
        options: [
            { text: "继续了解", next: 4 },
            { text: "返回上一级", next: 0 }
        ]
    },
    {
        text: "经过多年的发展，普照村的附子品质在全国都很有名。我们的产品不仅销往全国各地，还获得了多个质量认证。特别是我们独特的种植技术和管理模式，使得普照村的附子品质特别好...",
        options: [
            { text: "了解更多", next: 5 },
            { text: "返回上一级", next: 0 }
        ]
    },
    {
        text: "我们合作社采用'公司+合作社+农户'的模式运作，实现统一管理、统一技术标准。普照村有专门的技术团队为农户提供指导，确保产品质量的统一性。现在全村90%以上的农户都加入了合作社...",
        options: [
            { text: "了解更多", next: 6 },
            { text: "返回上一级", next: 0 }
        ]
    },
    {
        text: "未来，我们计划把普照村打造成全国知名的附子特色产业示范村。我们将进一步扩大种植规模，引入更多现代化设备，同时也会加强与科研机构的合作，不断提升产品品质...",
        options: [
            { text: "我想帮忙打包附子", next: 'game' },
            { text: "返回上一级", next: 0 }
        ]
    },
    {
        text: "目前普照村正在建设附子产业园，开发新的附子深加工产品。同时，我们也在建设电商平台，让更多人能买到普照村的优质附子。这些项目都将带动更多村民增收致富...",
        options: [
            { text: "我想帮忙打包附子", next: 'game' },
            { text: "返回上一级", next: 0 }
        ]
    }
];

// 游戏状态
const gameState = {
    loaded: 0,
    isAnimating: false,
    coins: parseInt(localStorage.getItem('coins')) || 0
};

// 初始化页面
function initPage() {
    document.getElementById('manager').addEventListener('click', startDialog);
    document.querySelector('.coin-count').textContent = gameState.coins;
    setupGameControls();
}

// 开始对话
function startDialog() {
    showDialog(0);
}

// 显示对话
function showDialog(index) {
    if (index === 'game') {
        startLoadingGame();
        return;
    }

    const dialog = dialogues[index];
    const dialogBox = document.querySelector('.dialog-box');
    const dialogText = dialogBox.querySelector('.dialog-text');
    const dialogOptions = dialogBox.querySelector('.dialog-options');

    dialogText.textContent = dialog.text;
    dialogOptions.innerHTML = '';

    dialog.options.forEach(option => {
        const button = document.createElement('button');
        button.className = 'dialog-option';
        button.textContent = option.text;
        button.addEventListener('click', () => showDialog(option.next));
        dialogOptions.appendChild(button);
    });

    dialogBox.style.display = 'block';
}

// 开始装车游戏
function startLoadingGame() {
    document.querySelector('.dialog-box').style.display = 'none';
    document.querySelector('.manager').style.display = 'none';
    document.querySelector('.loading-area').style.display = 'flex';
    document.querySelector('.game-panel').style.display = 'flex';
    
    // 更新附宝对话框内容
    document.querySelector('.character-dialog').textContent = '帮助合作社打包附子装车吧！';
    
    // 初始化卡车货物区
    initTruckCargo();
    // 初始化拖放事件
    setupDragAndDrop();
    
    showGameTip('开始装车吧！把附子拖到卡车上');
}

// 初始化卡车货物区
function initTruckCargo() {
    const cargoArea = document.querySelector('.truck-cargo');
    cargoArea.innerHTML = '';
    
    // 创建6个装载槽
    for (let i = 0; i < 6; i++) {
        const slot = document.createElement('div');
        slot.className = 'cargo-slot';
        slot.dataset.index = i;
        cargoArea.appendChild(slot);
    }
}

// 设置拖放事件
function setupDragAndDrop() {
    const fuziItem = document.querySelector('.fuzi-item');
    const slots = document.querySelectorAll('.cargo-slot');

    // 附子拖动事件
    fuziItem.addEventListener('dragstart', (e) => {
        fuziItem.classList.add('dragging');
    });

    fuziItem.addEventListener('dragend', (e) => {
        fuziItem.classList.remove('dragging');
    });

    // 卡车货物槽事件
    slots.forEach(slot => {
        slot.addEventListener('dragover', (e) => {
            e.preventDefault();
            if (!slot.hasChildNodes()) {
                slot.style.borderColor = '#4CAF50';
            }
        });

        slot.addEventListener('dragleave', (e) => {
            slot.style.borderColor = 'rgba(255, 255, 255, 0.3)';
        });

        slot.addEventListener('drop', (e) => {
            e.preventDefault();
            if (!slot.hasChildNodes()) {
                loadFuzi(slot);
            }
        });
    });

    // 移动端触摸事件支持
    setupTouchEvents(fuziItem, slots);
}

// 设置触摸事件
function setupTouchEvents(fuziItem, slots) {
    let touchStartX, touchStartY;
    
    fuziItem.addEventListener('touchstart', (e) => {
        const touch = e.touches[0];
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
        fuziItem.classList.add('dragging');
    });

    fuziItem.addEventListener('touchmove', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        const currentX = touch.clientX;
        const currentY = touch.clientY;

        // 检查是否在某个槽位上
        slots.forEach(slot => {
            const rect = slot.getBoundingClientRect();
            if (currentX >= rect.left && currentX <= rect.right &&
                currentY >= rect.top && currentY <= rect.bottom) {
                slot.style.borderColor = '#4CAF50';
            } else {
                slot.style.borderColor = 'rgba(255, 255, 255, 0.3)';
            }
        });
    });

    fuziItem.addEventListener('touchend', (e) => {
        const touch = e.changedTouches[0];
        const endX = touch.clientX;
        const endY = touch.clientY;

        slots.forEach(slot => {
            const rect = slot.getBoundingClientRect();
            if (endX >= rect.left && endX <= rect.right &&
                endY >= rect.top && endY <= rect.bottom &&
                !slot.hasChildNodes()) {
                loadFuzi(slot);
            }
            slot.style.borderColor = 'rgba(255, 255, 255, 0.3)';
        });

        fuziItem.classList.remove('dragging');
    });
}

// 装载附子
function loadFuzi(slot) {
    if (gameState.loaded >= 6) return;

    const newFuzi = document.createElement('div');
    newFuzi.className = 'fuzi-item';
    newFuzi.innerHTML = '<img src="picture/fuzi-item.png" alt="附子">';
    slot.appendChild(newFuzi);
    slot.classList.add('filled');

    gameState.loaded++;
    updateLoadedCount();

    if (gameState.loaded >= 6) {
        document.getElementById('dispatch-btn').disabled = false;
        showGameTip('装车完成！可以发车了');
    } else {
        showGameTip(`还需要装载${6 - gameState.loaded}个附子`);
    }
}

// 更新装载数量
function updateLoadedCount() {
    document.getElementById('loaded-count').textContent = gameState.loaded;
}

// 设置游戏控制
function setupGameControls() {
    const dispatchBtn = document.getElementById('dispatch-btn');
    dispatchBtn.addEventListener('click', () => {
        if (!gameState.isAnimating && gameState.loaded >= 6) {
            dispatchTruck();
        }
    });
}

// 发车
function dispatchTruck() {
    gameState.isAnimating = true;
    const truck = document.querySelector('.truck-container');
    
    showGameTip('准备发车...');
    
    // 发车动画
    truck.style.transition = 'transform 2s ease';
    truck.style.transform = 'translateX(100vw)';

    // 增加金币逻辑
    const oldCoins = gameState.coins;
    gameState.coins += 1;
    localStorage.setItem('coins', gameState.coins.toString());
    
    // 金币数字动画
    animateNumber(oldCoins, gameState.coins, 1000, (value) => {
        document.querySelector('.coin-count').textContent = Math.floor(value);
    });

    setTimeout(() => {
        // 跳转到下一个页面
        window.location.href = 'blessing.html';
    }, 2000);
}

// 数字增加动画
function animateNumber(start, end, duration, callback) {
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const current = start + (end - start) * progress;
        callback(current);
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

// 显示游戏提示
function showGameTip(message) {
    const tip = document.createElement('div');
    tip.className = 'game-tip';
    tip.textContent = message;
    document.querySelector('.cooperative-container').appendChild(tip);

    setTimeout(() => {
        tip.classList.add('fade-out');
        setTimeout(() => tip.remove(), 500);
    }, 2000);
}

// 返回地图
function returnToMap() {
    window.location.href = 'world-map.html';
}

// 初始化页面
document.addEventListener('DOMContentLoaded', initPage); 