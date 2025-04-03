function updateCoinsDisplay() {
    const currentCoins = parseInt(localStorage.getItem('coins') || '0');
    document.querySelector('.coin-count').textContent = currentCoins;
}

// 工艺流程数据
const processData = [
    {
        title: "采收附子",
        tool: "picture/shovel.png",
        initialImage: "picture/initial.png",
        completeImage: "picture/mature.png",
        requiredActions: 4,
        tips: [
            "选择适当的采收时间",
            "注意分离时的完整性",
            "避免机械损伤"
        ],
        cautions: [
            "佩戴防护手套",
            "轻柔操作避免损伤",
            "保持工作环境清洁"
        ]
    },
    {
        title: "割根处理",
        tool: "picture/knife.png",
        initialImage: "picture/mature.png",
        completeImage: "picture/cut.png",
        requiredActions: 3,
        tips: [
            "使用专业工具进行切割",
            "保持切口平整",
            "仔细去除须根"
        ],
        cautions: [
            "注意操作安全",
            "保持刀具锋利",
            "避免过度切割"
        ]
    },
    {
        title: "清洗",
        tool: "picture/water.png",
        initialImage: "picture/cut.png",
        completeImage: "picture/clean.png",
        requiredActions: 4,
        tips: [
            "使用清洁水源",
            "确保清洗彻底",
            "控制水温适中"
        ],
        cautions: [
            "避免浸泡时间过长",
            "注意水质要求",
            "保持清洗区域卫生"
        ]
    },
    {
        title: "炮制",
        tool: "picture/pot.png",
        initialImage: "picture/clean.png",
        completeImage: "picture/processed.png",
        requiredActions: 3,
        tips: [
            "控制浸泡时间",
            "保持适当温度",
            "注意蒸煮火候"
        ],
        cautions: [
            "严格控制炮制时间",
            "保持温度均匀",
            "避免过度加热"
        ]
    },
    {
        title: "切片/粉碎",
        tool: "picture/grinder.png",
        initialImage: "picture/processed.png",
        completeImage: "picture/final.png",
        requiredActions: 4,
        tips: [
            "保持切片均匀",
            "控制厚度一致",
            "确保粉碎细度"
        ],
        cautions: [
            "注意机械安全",
            "控制粉尘扩散",
            "保持工具清洁"
        ]
    }
];

let currentStep = 0;
let currentActions = 0;
let isDragging = false;

// 重置进度
function resetProgress() {
    localStorage.removeItem('baseCompleted');
    currentStep = 0;
    currentActions = 0;
    setupDragAndDrop();
    updateContent();
}

// 初始化页面
function initPage() {
    // 检查是否已完成
    if (!checkCompletion()) {
        setupDragAndDrop();
        updateContent();
    }
    
    // 添加重置按钮事件监听
    const resetBtn = document.getElementById('resetBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetProgress);
    }
       // 初始化显示金币数量
       updateCoinsDisplay();
}

// 设置拖拽事件
function setupDragAndDrop() {
    const tool = document.getElementById('currentTool');
    const workArea = document.getElementById('workArea');
    
    // 确保工具可拖拽
    tool.draggable = true;
    tool.style.cursor = 'grab';
    tool.style.opacity = '1';
    
    // 工具拖拽事件
    tool.addEventListener('dragstart', (e) => {
        if (!checkCompletion()) {
            isDragging = true;
            tool.classList.add('dragging');
        }
    });

    tool.addEventListener('dragend', (e) => {
        isDragging = false;
        tool.classList.remove('dragging');
    });

    // 工作区域拖拽事件
    workArea.addEventListener('dragover', (e) => {
        if (!checkCompletion()) {
            e.preventDefault();
            workArea.classList.add('drag-over');
        }
    });

    workArea.addEventListener('dragleave', (e) => {
        workArea.classList.remove('drag-over');
    });

    workArea.addEventListener('drop', (e) => {
        e.preventDefault();
        workArea.classList.remove('drag-over');
        if (!checkCompletion()) {
            handleAction();
        }
    });

    // 移动端触摸事件支持
    tool.addEventListener('touchstart', handleTouchStart);
    tool.addEventListener('touchmove', handleTouchMove);
    tool.addEventListener('touchend', handleTouchEnd);
}

// 处理移动端触摸事件
function handleTouchStart(e) {
    if (!checkCompletion()) {
        isDragging = true;
        e.target.classList.add('dragging');
    }
}

function handleTouchMove(e) {
    if (!isDragging) return;
    e.preventDefault();
    
    const touch = e.touches[0];
    const workArea = document.getElementById('workArea');
    const workAreaRect = workArea.getBoundingClientRect();
    
    if (touch.clientX >= workAreaRect.left && 
        touch.clientX <= workAreaRect.right &&
        touch.clientY >= workAreaRect.top && 
        touch.clientY <= workAreaRect.bottom) {
        workArea.classList.add('drag-over');
    } else {
        workArea.classList.remove('drag-over');
    }
}

function handleTouchEnd(e) {
    if (!isDragging) return;
    
    const touch = e.changedTouches[0];
    const workArea = document.getElementById('workArea');
    const workAreaRect = workArea.getBoundingClientRect();
    
    if (touch.clientX >= workAreaRect.left && 
        touch.clientX <= workAreaRect.right &&
        touch.clientY >= workAreaRect.top && 
        touch.clientY <= workAreaRect.bottom) {
        handleAction();
    }
    
    isDragging = false;
    e.target.classList.remove('dragging');
    workArea.classList.remove('drag-over');
}

// 处理操作动作
function handleAction() {
    currentActions++;
    updateProgress();
    
    if (currentActions >= processData[currentStep].requiredActions) {
        completeCurrentStep();
    }
}

// 更新进度条
function updateProgress() {
    const progress = (currentActions / processData[currentStep].requiredActions) * 100;
    document.getElementById('progressBar').style.width = `${progress}%`;
}

// 完成当前步骤
function completeCurrentStep() {
    const processImage = document.getElementById('processImage');
    processImage.src = processData[currentStep].completeImage;
    
    setTimeout(() => {
        if (currentStep < processData.length - 1) {
            currentStep++;
            currentActions = 0;
            updateContent();
        } else {
            showCompletionPanel();
        }
    }, 1000);
}

// 更新页面内容
function updateContent() {
    const data = processData[currentStep];
    
    // 更新工具图片
    document.getElementById('toolImage').src = data.tool;
    
    // 更新工作区域图片
    document.getElementById('processImage').src = data.initialImage;
    
    // 重置进度条
    document.getElementById('progressBar').style.width = '0%';
    
    // 更新工艺要点
    document.getElementById('processTips').innerHTML = 
        data.tips.map(tip => `<li>${tip}</li>`).join('');
    
    // 更新注意事项
    document.getElementById('processCautions').innerHTML = 
        data.cautions.map(caution => `<li>${caution}</li>`).join('');
    
    // 更新进度指示器
    updateProgressIndicator();
}

// 更新进度指示器
function updateProgressIndicator() {
    const steps = document.querySelectorAll('.process-step');
    steps.forEach((step, index) => {
        step.classList.remove('active', 'completed');
        if (index === currentStep) {
            step.classList.add('active');
        } else if (index < currentStep) {
            step.classList.add('completed');
        }
    });
}

// 显示完成面板
function showCompletionPanel() {
    // 更新金币数量
    updateCoins();
    // 禁用工具拖拽
    disableTools();
    // 显示完成面板
    const completionPanel = document.querySelector('.completion-panel');
    completionPanel.style.display = 'block';

    // 3秒后自动隐藏完成面板
    setTimeout(() => {
        completionPanel.style.display = 'none';
    }, 3000); // 3000毫秒 = 3秒
}

// 禁用工具拖拽
function disableTools() {
    const tool = document.getElementById('currentTool');
    tool.draggable = false;
    tool.style.cursor = 'not-allowed';
    tool.style.opacity = '0.5';
}

// 检查是否已完成
function checkCompletion() {
    const isCompleted = localStorage.getItem('baseCompleted') === 'true';
    if (isCompleted) {
        showCompletionPanel();
        disableTools();
    }
    return isCompleted;
}

// 修改 updateCoins 函数
function updateCoins() {
    const coins = 1; // 每轮完成奖励的金币数量
    // 获取当前金币数量
    let currentCoins = parseInt(localStorage.getItem('coins') || '0');
    // 更新金币总数
    currentCoins += coins;
    // 保存新的金币数量
    localStorage.setItem('coins', currentCoins.toString());
    // 更新显示
    document.getElementById('coinAmount').textContent = coins;
    // 更新顶部金币显示
    updateCoinsDisplay();
}

// 返回地图
function returnToMap() {
    // 返回世界地图
    window.location.href = 'world-map.html';
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initPage); 