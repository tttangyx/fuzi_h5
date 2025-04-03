// 图表配置
const chartConfig = {
    type: 'line',
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: {
                    color: 'rgba(255, 255, 255, 0.8)'
                }
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        return context.dataset.label + ': ' + context.parsed.y + getTooltipUnit(context.dataset.label);
                    }
                }
            }
        },
        onClick: (event, elements) => {
            if (elements.length > 0) {
                const element = elements[0];
                const dataset = element.dataset;
                const value = dataset.data[element.index];
                const year = dataset.labels[element.index];
                showDetailPopup(dataset.label, value, year);
            }
        },
        scales: {
            y: {
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                },
                ticks: {
                    color: 'rgba(255, 255, 255, 0.8)'
                }
            },
            x: {
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                },
                ticks: {
                    color: 'rgba(255, 255, 255, 0.8)'
                }
            }
        }
    }
};

// 获取数据单位
function getTooltipUnit(label) {
    if (label.includes('数量')) return ' 个';
    if (label.includes('亿元')) return ' 亿';
    if (label.includes('吨')) return ' 吨';
    if (label.includes('公顷')) return ' 公顷';
    if (label.includes('万元')) return ' 万元';
    return '';
}

// 显示详细信息弹窗
function showDetailPopup(label, value, year) {
    // 创建弹窗元素
    const popup = document.createElement('div');
    popup.className = 'detail-popup';
    popup.innerHTML = `
        <div class="popup-content">
            <h3>${label}</h3>
            <p>${year}年数据：${value}${getTooltipUnit(label)}</p>
            <button class="close-btn">关闭</button>
        </div>
    `;

    // 添加关闭按钮事件
    popup.querySelector('.close-btn').onclick = () => {
        popup.remove();
    };

    // 添加到页面
    document.body.appendChild(popup);

    // 3秒后自动关闭
    setTimeout(() => {
        if (document.body.contains(popup)) {
            popup.remove();
        }
    }, 3000);
}

// 添加板块折叠功能
function setupSectionToggle() {
    const sections = document.querySelectorAll('.value-section');
    
    // 初始化时收起所有板块
    sections.forEach(section => {
        const content = section.querySelector('.value-content');
        content.style.display = 'none';
        section.classList.add('collapsed');
    });

    sections.forEach(section => {
        const title = section.querySelector('h2');
        const content = section.querySelector('.value-content');
        
        title.style.cursor = 'pointer';
        title.addEventListener('click', () => {
            // 如果当前板块已展开，则收起
            if (content.style.display === 'grid') {
                content.style.display = 'none';
                section.classList.add('collapsed');
                return;
            }

            // 收起其他所有板块
            sections.forEach(otherSection => {
                if (otherSection !== section) {
                    const otherContent = otherSection.querySelector('.value-content');
                    otherContent.style.display = 'none';
                    otherSection.classList.add('collapsed');
                }
            });

            // 展开当前板块
            content.style.display = 'grid';
            section.classList.remove('collapsed');
            
            // 更新图表大小
            const chartId = section.querySelector('canvas').id;
            switch(chartId) {
                case 'medicalChart':
                    initMedicalChart();
                    break;
                case 'economicChart':
                    initEconomicChart();
                    break;
                case 'agricultureChart':
                    initAgricultureChart();
                    break;
            }
        });
    });
}


// 医药价值图表
function initMedicalChart() {
    const ctx = document.getElementById('medicalChart').getContext('2d');
    const data = {
        labels: ['2018', '2019', '2020', '2021', '2022'],
        datasets: [{
            label: '临床应用数量',
            data: [150, 180, 220, 280, 350],
            borderColor: '#4CAF50',
            backgroundColor: 'rgba(76, 175, 80, 0.2)',
            tension: 0.4
        }, {
            label: '研究论文数量',
            data: [80, 120, 160, 200, 250],
            borderColor: '#2196F3',
            backgroundColor: 'rgba(33, 150, 243, 0.2)',
            tension: 0.4
        }]
    };

    const config = {
        ...chartConfig,
        data,
        options: {
            ...chartConfig.options,
            maintainAspectRatio: false,
            responsive: true,
            layout: {
                padding: {
                    left: 10,
                    right: 10,
                    top: 10,
                    bottom: 10
                }
            },
            plugins: {
                ...chartConfig.options.plugins,
                legend: {
                    ...chartConfig.options.plugins.legend,
                    position: 'bottom',
                    labels: {
                        boxWidth: 40,
                        padding: 10,
                        font: {
                            size: 12
                        }
                    }
                }
            }
        }
    };

    new Chart(ctx, config);
}

// 经济价值图表
function initEconomicChart() {
    const ctx = document.getElementById('economicChart').getContext('2d');
    const data = {
        labels: ['2018', '2019', '2020', '2021', '2022'],
        datasets: [{
            label: '市场规模（亿元）',
            data: [6, 7.5, 8.8, 9.5, 10.2],
            borderColor: '#FFC107',
            backgroundColor: 'rgba(255, 193, 7, 0.2)',
            tension: 0.4
        }, {
            label: '出口量（吨）',
            data: [120, 150, 170, 185, 200],
            borderColor: '#FF5722',
            backgroundColor: 'rgba(255, 87, 34, 0.2)',
            tension: 0.4
        }]
    };

    new Chart(ctx, { ...chartConfig, data });
}

// 农业价值图表
function initAgricultureChart() {
    const ctx = document.getElementById('agricultureChart').getContext('2d');
    const data = {
        labels: ['2018', '2019', '2020', '2021', '2022'],
        datasets: [{
            label: '种植面积（公顷）',
            data: [800, 1000, 1200, 1400, 1600],
            borderColor: '#9C27B0',
            backgroundColor: 'rgba(156, 39, 176, 0.2)',
            tension: 0.4
        }, {
            label: '农户收入（万元/户）',
            data: [3, 3.5, 4.2, 4.8, 5.5],
            borderColor: '#E91E63',
            backgroundColor: 'rgba(233, 30, 99, 0.2)',
            tension: 0.4
        }]
    };

    new Chart(ctx, { ...chartConfig, data });
}

// 页面加载完成后初始化图表
document.addEventListener('DOMContentLoaded', () => {
    initMedicalChart();
    initEconomicChart();
    initAgricultureChart();
    setupSectionToggle();
}); 