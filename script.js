// ==========================================
// PART 1: 資料抓取核心 (Data Fetching Core)
// ==========================================

// 您的 CSV 連結
const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSY7NZUZlhrODZPFRNQ40zm5MKqbIGiXLwwfFOP_C_Kc78c8jQi3OFFaK7CVqtgGY6p65PCn1aVRVyB/pub?output=csv';

// 初始化圖表變數 (讓後面的 fetch 可以存取)
let creatureChart, sleepChart, survivalChart, timeChart;

// 執行抓取
fetch(csvUrl)
    .then(response => response.text())
    .then(csvRawText => {
        console.log("✅ 系統連線成功：資料已接收");
        console.log(csvRawText); 
        
        // 在這裡呼叫解析函式 (如果您之後要讓圖表變動，要在這裡處理)
        // processData(csvRawText); 
    })
    .catch(error => {
        console.error('❌ 系統連線失敗 (Connection Failed):', error);
    });

// (選用) 範例解析函式：您可以之後在這裡把 csvRawText 轉成陣列，然後更新圖表
function processData(csvText) {
    // 範例：chart.data.datasets[0].data = [新數據...];
    // chart.update();
}


// ==========================================
// PART 2: 視覺化儀表板設定 (Visualization Config)
// ==========================================

// 初始化 Icon
lucide.createIcons();

// 全域 Chart.js 設定 (科技風格)
Chart.defaults.color = '#94a3b8'; // Slate 400 (文字顏色)
Chart.defaults.font.family = "'Inter', 'Noto Sans TC', sans-serif";
Chart.defaults.borderColor = 'rgba(255, 255, 255, 0.05)'; // 網格線顏色

// --------------------------------------------------
// Chart 1: Section A - 日常人格分佈 (Radar)
// --------------------------------------------------
const ctxCreature = document.getElementById('creatureChart').getContext('2d');
creatureChart = new Chart(ctxCreature, {
    type: 'radar',
    data: {
        labels: ['貓頭鷹', '早起鳥', '樹懶', '倉鼠', '海豚'],
        datasets: [{
            label: '特徵值 (Metrics)',
            data: [90, 20, 75, 40, 60], // 預設資料
            backgroundColor: 'rgba(59, 130, 246, 0.2)', // Tech Blue 半透明
            borderColor: '#3b82f6', // Tech Blue 實線
            pointBackgroundColor: '#0f172a', // 深色背景
            pointBorderColor: '#3b82f6',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: '#3b82f6',
            borderWidth: 2
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            r: {
                angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
                grid: { color: 'rgba(255, 255, 255, 0.05)', circular: true },
                pointLabels: {
                    font: { size: 12, family: "'JetBrains Mono', sans-serif" },
                    color: '#e2e8f0'
                },
                ticks: { display: false, backdropColor: 'transparent' }
            }
        },
        plugins: { legend: { display: false } }
    }
});

// --------------------------------------------------
// Chart 2: Section B - 睡眠時數 (Bar + Line Target)
// --------------------------------------------------
const ctxSleep = document.getElementById('sleepChart').getContext('2d');
sleepChart = new Chart(ctxSleep, {
    type: 'bar',
    data: {
        labels: ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9', 'D10', 'D11', 'D12', 'D13', 'D14'],
        datasets: [
            {
                label: '睡眠時數',
                data: [6, 5.5, 7, 6.5, 4, 8, 9, 6.5, 6, 5, 5.5, 7, 8, 6.5],
                backgroundColor: '#3b82f6',
                borderRadius: 2,
                order: 2
            },
            {
                type: 'line',
                label: '目標 (Target)',
                data: Array(14).fill(8),
                borderColor: '#22d3ee', // Cyan 螢光青
                borderWidth: 1,
                borderDash: [5, 5],
                pointRadius: 0,
                order: 1,
                tension: 0
            }
        ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                titleColor: '#fff',
                bodyColor: '#94a3b8',
                borderColor: 'rgba(255,255,255,0.1)',
                borderWidth: 1,
                titleFont: { family: "'JetBrains Mono'" }
            }
        },
        scales: {
            x: { 
                grid: { display: false }, 
                ticks: { font: { family: "'JetBrains Mono'" } } 
            },
            y: { 
                grid: { color: 'rgba(255,255,255,0.05)' }, 
                min: 0, 
                max: 12 
            }
        }
    }
});

// --------------------------------------------------
// Chart 3: Section C - 續命與飲食 (Horizontal Bar)
// --------------------------------------------------
const ctxSurvival = document.getElementById('survivalChart').getContext('2d');
survivalChart = new Chart(ctxSurvival, {
    type: 'bar',
    indexAxis: 'y',
    data: {
        labels: ['咖啡', '手搖飲', '甜食', '宵夜', '水', '意志力', '朋友鼓勵'],
        datasets: [{
            label: '依賴度 (%)',
            data: [90, 85, 60, 45, 20, 10, 30],
            backgroundColor: [
                '#3b82f6', // Blue
                '#60a5fa', // Light Blue
                '#22d3ee', // Cyan
                '#94a3b8', // Slate
                '#475569', // Dark Slate
                '#1e293b', // Darker
                '#64748b'  
            ],
            borderWidth: 0,
            barThickness: 15
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            x: { grid: { color: 'rgba(255,255,255,0.05)' } },
            y: { 
                grid: { display: false }, 
                ticks: { font: { family: "'Noto Sans TC'" }, color: '#e2e8f0' } 
            }
        }
    }
});

// --------------------------------------------------
// Chart 4: Section D - 時間分配 (Doughnut)
// --------------------------------------------------
const ctxTime = document.getElementById('timeChart').getContext('2d');
timeChart = new Chart(ctxTime, {
    type: 'doughnut',
    data: {
        labels: ['上課＋讀書', '打工/社團', '追劇/遊戲', '睡眠'],
        datasets: [{
            data: [6, 3, 8, 7],
            backgroundColor: [
                '#3b82f6', // Blue
                '#22d3ee', // Cyan
                '#6366f1', // Indigo
                '#334155'  // Slate
            ],
            borderColor: '#0f172a', // 背景色切割
            borderWidth: 4,
            hoverOffset: 10
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '75%', // 中空比例
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                borderColor: 'rgba(255,255,255,0.1)',
                borderWidth: 1,
                bodyFont: { family: "'JetBrains Mono'" }
            }
        }
    }
});