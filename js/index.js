// 添加种子生长函数
function startGrowth() {
    const clickArea = document.querySelector('.click-area');
    const seed = document.querySelector('.seed');
    const startBtn = document.querySelector('.start-btn');
    
    // 隐藏点击区域
    clickArea.style.display = 'none';
    
    // 显示种子并开始生长动画
    seed.style.opacity = '1';
    seed.classList.add('grow');
    
    // 生长动画完成后添加呼吸效果
    setTimeout(() => {
        seed.classList.remove('grow');
        seed.classList.add('breathing');
        startBtn.classList.add('show');
    }, 3000);
}

// 修改 startExplore 函数
function startExplore() {
    // 显示加载页面
    const loadingPage = document.querySelector('.loading-page');
    loadingPage.style.display = 'flex';
    
    // 模拟加载进度
    let progress = 0;
    const loadingBar = document.querySelector('.loading-bar');
    const loadingProgress = document.querySelector('.loading-progress');
    const duration = 4000; // 4秒加载时间
    const interval = 50; // 更新频率
    const step = 100 / (duration / interval); // 每次更新增加的进度
    
    const loadingInterval = setInterval(() => {
        progress += step;
        if (progress >= 100) {
            progress = 100;
            clearInterval(loadingInterval);
            
            // 加载完成后跳转
            setTimeout(() => {
                window.location.href = 'intro.html';
            }, 200);
        }
        
        loadingBar.style.width = `${progress}%`;
        loadingProgress.textContent = `${Math.floor(progress)}%`;
    }, interval);
}




document.addEventListener('DOMContentLoaded', function() {
    const seed = document.querySelector('.seed');
    const startBtn = document.querySelector('.start-btn');
    let growthStage = 0;

function growPlant() {
    if (growthStage === 0) {
        // 切换到小苗，并上移位置
        seed.style.background = "url('picture/sprout.png') no-repeat center/contain";
        seed.style.animation = "breathing-growing 2s ease-in-out infinite";
        seed.style.transform = "translateY(-250px)"; // 调整上移距离
        growthStage = 1;
        
        setTimeout(() => {
            // 第二阶段：中间形态
            seed.style.background = "url('picture/growing.png') no-repeat center/contain";
            seed.style.animation = "breathing-middle 2s ease-in-out infinite";
            seed.style.transform = "translateY(-60px)";
            growthStage = 2;
            
            setTimeout(() => {
                // 第三阶段：最终形态
                seed.style.background = "url('picture/character.png') no-repeat center/contain";
                seed.style.animation = "breathing-final 2s ease-in-out infinite";
                seed.style.transform = "translateY(-100px)";
                startBtn.classList.add('show');
            }, 2000);
        }, 2000);
    }
}
    
    // 绑定点击事件
    seed.addEventListener('click', growPlant);
    seed.addEventListener('touchend', function(e) {
        e.preventDefault();
        growPlant();
    });
});



