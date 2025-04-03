document.addEventListener('DOMContentLoaded', function() {
    // 获取所有可点击区域
    const clickableAreas = document.querySelectorAll('.clickable-area');
    let activeArea = null;
    let isFirstClick = true;
    
    // 为每个区域添加点击事件
    clickableAreas.forEach(area => {
        area.addEventListener('click', function() {
            const areaType = this.dataset.area;
            
            // 如果点击了其他区域，移除之前区域的高亮
            if (activeArea && activeArea !== this) {
                activeArea.classList.remove('active');
                isFirstClick = true;
            }
            
            // 第一次点击
            if (isFirstClick) {
                // 添加高亮效果
                this.classList.add('active');
                activeArea = this;
                isFirstClick = false;
            } else if (activeArea === this) {
                // 第二次点击同一个区域，执行跳转
                handleAreaClick(areaType);
            }
        });
    });
});

// 处理区域点击跳转
function handleAreaClick(areaType) {
    switch(areaType) {
        case 'planting':
            window.location.href = 'planting-game.html';
            break;
        case 'base':
            window.location.href = 'base.html';
            break;
        case 'cooperative':
            window.location.href = 'cooperative.html';
            break;
    }
}