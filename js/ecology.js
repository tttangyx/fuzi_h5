 // 生态保护措施数据
const measures = {
    rotation: {
        impact: { soil: 20, yield: 15, eco: 25 },
        suggestions: ['实施3-5年轮作计划', '选择合适的轮作作物']
    },
    organic: {
        impact: { soil: 30, yield: 10, eco: 20 },
        suggestions: ['使用农家肥', '控制施肥量']
    },
    water: {
        impact: { soil: 10, yield: 25, eco: 15 },
        suggestions: ['安装滴灌系统', '科学规划灌溉时间']
    },
    biodiversity: {
        impact: { soil: 15, yield: 20, eco: 30 },
        suggestions: ['种植防护林', '设置生态廊道']
    }
};

// 当前选择的措施
let selectedMeasures = new Set();

// 初始化页面
document.addEventListener('DOMContentLoaded', () => {
    initMeasureCards();
    updateSimulationResult();
});

// 初始化措施卡片
function initMeasureCards() {
    const cards = document.querySelectorAll('.measure-card');
    cards.forEach(card => {
        const btn = card.querySelector('.select-btn');
        btn.addEventListener('click', () => {
            const measureType = card.dataset.measure;
            toggleMeasure(card, measureType);
        });
    });
}

// 切换措施选择状态
function toggleMeasure(card, measureType) {
    card.classList.toggle('selected');
    if (selectedMeasures.has(measureType)) {
        selectedMeasures.delete(measureType);
    } else {
        selectedMeasures.add(measureType);
    }
    updateSimulationResult();
}

// 更新模拟结果
function updateSimulationResult() {
    let totalImpact = { soil: 0, yield: 0, eco: 0 };
    
    selectedMeasures.forEach(measure => {
        const impact = measures[measure].impact;
        totalImpact.soil += impact.soil;
        totalImpact.yield += impact.yield;
        totalImpact.eco += impact.eco;
    });

    // 更新显示
    document.getElementById('soilQuality').textContent = `${Math.min(totalImpact.soil, 100)}%`;
    document.getElementById('yield').textContent = `${Math.min(totalImpact.yield, 100)}%`;
    document.getElementById('ecoScore').textContent = `${Math.min(totalImpact.eco, 100)}%`;

    // 显示结果面板
    const resultPanel = document.querySelector('.simulation-result');
    if (selectedMeasures.size > 0) {
        resultPanel.classList.add('active');
    } else {
        resultPanel.classList.remove('active');
    }
}