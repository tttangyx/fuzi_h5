// 游戏状态
const gameState = {
    water: 0,
    fertilizer: 0,
    growth: 0,
    coins: parseInt(localStorage.getItem('coins') || '0'), 
    currentTool: null,
    canHarvest: false,
    isAnimating: false
};

// 生长阶段对应的图片
const growthStages = {
    seed: 'picture/seed.png',
    sprout: 'picture/sprout.png',
    growing: 'picture/growing.png',
    mature: 'picture/mature.png'
};

// 初始化游戏
function initGame() {
    updateProgressBars();
    setupEventListeners();
    showGameTip('点击工具，开始种植附子吧！');
   // 初始化显示金币数量
   document.querySelector('.coin-count').textContent = gameState.coins;
}

// 显示游戏提示
function showGameTip(message) {
    // 创建提示元素
    const tip = document.createElement('div');
    tip.className = 'game-tip';
    tip.textContent = message;
    document.querySelector('.game-container').appendChild(tip);

    // 3秒后自动消失
    setTimeout(() => {
        tip.classList.add('fade-out');
        setTimeout(() => tip.remove(), 500);
    }, 3000);
}

// 设置事件监听
function setupEventListeners() {
    // 工具选择
    document.querySelectorAll('.tool').forEach(tool => {
        tool.addEventListener('click', () => {
            const toolType = tool.dataset.tool;
            selectTool(toolType, tool);
        });
    });

    // 土地点击
    document.querySelector('.soil-plot').addEventListener('click', () => {
        if (gameState.currentTool && !gameState.isAnimating) {
            useTool(gameState.currentTool);
        }
    });

    // 装车按钮点击
    document.querySelector('.load-truck-btn').addEventListener('click', loadTruck);
}

// 选择工具
function selectTool(toolType, toolElement) {
    if (gameState.isAnimating) return;

    // 移除其他工具的active状态
    document.querySelectorAll('.tool').forEach(t => t.classList.remove('active'));
    
    if (gameState.currentTool === toolType) {
        gameState.currentTool = null;
    } else {
        gameState.currentTool = toolType;
        toolElement.classList.add('active');
        
        // 显示工具提示
        switch(toolType) {
            case 'water':
                showGameTip('点击土地给附子浇水');
                break;
            case 'fertilizer':
                showGameTip('点击土地给附子施肥');
                break;
            case 'harvest':
                if (gameState.canHarvest) {
                    showGameTip('可以收获啦！');
                } else {
                    showGameTip('附子还没有成熟哦');
                }
                break;
        }
    }
}

// 使用工具动画
function playToolAnimation(tool) {
    const plant = document.querySelector('.plant');
    gameState.isAnimating = true;

    switch(tool) {
        case 'water':
            plant.classList.add('watering');
            setTimeout(() => {
                plant.classList.remove('watering');
                gameState.isAnimating = false;
            }, 1000);
            break;
        case 'fertilizer':
            plant.classList.add('fertilizing');
            setTimeout(() => {
                plant.classList.remove('fertilizing');
                gameState.isAnimating = false;
            }, 1000);
            break;
        case 'harvest':
            plant.classList.add('harvesting');
            setTimeout(() => {
                plant.classList.remove('harvesting');
                gameState.isAnimating = false;
            }, 1000);
            break;
    }
}

// 使用工具
function useTool(tool) {
    if (gameState.isAnimating) return;

    switch(tool) {
        case 'water':
            if (gameState.water < 100) {
                playToolAnimation(tool);
                gameState.water = Math.min(100, gameState.water + 20);
                updateGrowth();
                showGameTip('浇水成功！水分 +20');
            } else {
                showGameTip('水分已经足够了！');
            }
            break;
        case 'fertilizer':
            if (gameState.fertilizer < 100) {
                playToolAnimation(tool);
                gameState.fertilizer = Math.min(100, gameState.fertilizer + 20);
                updateGrowth();
                showGameTip('施肥成功！肥力 +20');
            } else {
                showGameTip('肥力已经足够了！');
            }
            break;
        case 'harvest':
            if (gameState.canHarvest) {
                playToolAnimation(tool);
                setTimeout(() => {
                    showHarvestPanel();
                }, 1000);
            } else {
                showGameTip('附子还没有成熟，继续加油！');
            }
            break;
    }
    updateProgressBars();
}

// 更新生长进度
function updateGrowth() {
    // 只有当水分和肥力都有时才会生长
    if (gameState.water > 0 && gameState.fertilizer > 0) {
        const oldGrowth = gameState.growth;
        gameState.growth = Math.min(100, gameState.growth + 10);
        updatePlantAppearance();
        
        // 消耗水分和肥力
        gameState.water = Math.max(0, gameState.water - 5);
        gameState.fertilizer = Math.max(0, gameState.fertilizer - 5);

        // 显示生长阶段提示
        if (oldGrowth < 25 && gameState.growth >= 25) {
            showGameTip('附子发芽了！');
        } else if (oldGrowth < 50 && gameState.growth >= 50) {
            showGameTip('附子正在茁壮成长！');
        } else if (oldGrowth < 100 && gameState.growth >= 100) {
            showGameTip('附子已经成熟了，可以收获了！');
            gameState.canHarvest = true;
        }
    }
}

// 更新植物外观
function updatePlantAppearance() {
    const plant = document.querySelector('.plant-image');
    let targetImage;

    if (gameState.growth < 25) {
        targetImage = growthStages.seed;
    } else if (gameState.growth < 50) {
        targetImage = growthStages.sprout;
    } else if (gameState.growth < 100) {
        targetImage = growthStages.growing;
    } else {
        targetImage = growthStages.mature;
    }

    // 添加过渡动画
    if (plant.src !== targetImage) {
        plant.style.opacity = '0';
        setTimeout(() => {
            plant.src = targetImage;
            plant.style.opacity = '1';
        }, 300);
    }
}

// 更新进度条
function updateProgressBars() {
    const updateBar = (elementId, value) => {
        const bar = document.getElementById(elementId);
        bar.style.width = `${value}%`;
        // 添加颜色变化
        if (value >= 80) {
            bar.style.backgroundColor = '#4CAF50';
        } else if (value >= 50) {
            bar.style.backgroundColor = '#FFC107';
        } else if (value >= 20) {
            bar.style.backgroundColor = '#FF9800';
        } else {
            bar.style.backgroundColor = '#f44336';
        }
    };

    updateBar('water-progress', gameState.water);
    updateBar('fertilizer-progress', gameState.fertilizer);
    updateBar('growth-progress', gameState.growth);
}

// 显示收获面板
function showHarvestPanel() {
    const harvestPanel = document.querySelector('.harvest-panel');
    harvestPanel.style.opacity = '0';
    harvestPanel.style.display = 'block';
    setTimeout(() => {
        harvestPanel.style.opacity = '1';
    }, 50);
}

// 装车获得金币
function loadTruck() {
    // 金币增加动画
    const oldCoins = gameState.coins;
    gameState.coins += 1;
    localStorage.setItem('coins', gameState.coins.toString());
    animateNumber(oldCoins, gameState.coins, 1000, (value) => {
        document.querySelector('.coin-count').textContent = Math.floor(value);
    });
    
    showGameTip('获得1金币！');
    
    // 重置游戏状态
    gameState.water = 0;
    gameState.fertilizer = 0;
    gameState.growth = 0;
    gameState.canHarvest = false;
    
    // 隐藏收获面板
    const harvestPanel = document.querySelector('.harvest-panel');
    harvestPanel.style.opacity = '0';
    setTimeout(() => {
        harvestPanel.style.display = 'none';
    }, 300);
    
    // 重置植物外观
    document.querySelector('.plant-image').src = growthStages.seed;
    
    // 更新进度条
    updateProgressBars();

    setTimeout(() => {
        showGameTip('开始新一轮种植吧！');
    }, 1500);
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

// 返回地图
function returnToMap() {
    window.location.href = 'world-map.html';
}

// 初始化游戏
initGame(); 