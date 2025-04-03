// 游戏状态
const gameState = {
    coins: parseInt(localStorage.getItem('coins')) || 0
};

// 初始化页面
function initPage() {
    // 更新金币显示
    const coinCount = document.querySelector('.coin-count');
    coinCount.textContent = gameState.coins;

    // 设置附宝点击事件
    const fubaoCharacter = document.querySelector('.fubao-character');
    fubaoCharacter.addEventListener('click', () => {
        window.location.href = 'value.html';  // 点击跳转到价值页面
    });
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initPage);