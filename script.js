// ==========================================
// 1. 設定與系統參數
// ==========================================
// 您的 CSV 連結 (請確認這是正確且已發布到網路的連結)
const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQZ3LLxMjR9y31TxuJCZ95wIfQ_0xvnFK94ycmaxJkrBZEsCkh4tCdDTtMkp6a8qElfJJZvJdawAH27/pub?output=csv';

// 關鍵字設定：程式會去 CSV 標題列搜尋這些字，自動定位欄位
const KEYWORDS = {
    creature: ['生物', '像哪種', 'Creature'], // 搜尋生物相關標題
    sleep:    ['睡眠', '睡多久', 'Sleep'],    // 搜尋睡眠相關標題
    survival: ['續命', '道具', 'Survival']    // 搜尋續命相關標題
};

let charts = {}; // 存放圖表實例

// ==========================================
// 2. 初始化流程
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    initAllCharts();
    fetchCSV();
});

// ==========================================
// 3. 圖表初始化 (建立空圖表架構)
// ==========================================
function initAllCharts() {
    // 設定全域字體與顏色 (科技風格)
    Chart.defaults.color = '#94a3b8';
    Chart.defaults.font.family = "'JetBrains Mono', 'Noto Sans TC', sans-serif";
    Chart.defaults.borderColor = 'rgba(255, 255, 255, 0.05)';

    // 1. 雷達圖 (Radar Chart)
    const ctxRadar = document.getElementById('creatureChart');
    if (ctxRadar) {
        charts.creature = new Chart(ctxRadar, {
            type: 'radar',
            data: {
                labels: ['貓頭鷹 🦉', '樹懶 🦥', '倉鼠 🐹', '海豚 🐬'],
                datasets: [{
                    label: '特質強度',
                    data: [0, 0, 0, 0], // 初始值
                    backgroundColor: 'rgba(59, 130, 246, 0.2)', // 藍色半透明
                    borderColor: '#3b82f6', // 藍色邊框
                    borderWidth: 2,
                    pointBackgroundColor: '#0f172a',
                    pointBorderColor: '#3b82f6'
                }]
            },
            options: {
                maintainAspectRatio: false,
                scales: {
                    r: {
                        angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
                        grid: { color: 'rgba(255, 255, 255, 0.05)' },
                        pointLabels: { color: '#e2e8f0', font: { size: 12 } },
                        ticks: { display: false, backdropColor: 'transparent' } // 隱藏刻度背景
                    }
                },
                plugins: { legend: { display: false } }
            }
        });
    }

    // 2. 睡眠圖 (Bar Chart)
    const ctxSleep = document.getElementById('sleepChart');
    if (ctxSleep) {
        charts.sleep = new Chart(ctxSleep, {
            type: 'bar',
            data: {
                labels: [], // 等待資料填入
                datasets: [{
                    label: '睡眠時數 (Hrs)',
                    data: [],
                    backgroundColor: '#06b6d4', // 青色
                    borderRadius: 4,
                    barThickness: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { grid: { display: false } },
                    y: { 
                        beginAtZero: true, 
                        max: 12, // 設定最大值讓圖表更美觀
                        grid: { color: 'rgba(255,255,255,0.05)' } 
                    }
                }
            }
        });
    }

    // 3. 續命圖 (Horizontal Bar Chart)
    const ctxSurv = document.getElementById('survivalChart');
    if (ctxSurv) {
        charts.survival = new Chart(ctxSurv, {
            type: 'bar',
            indexAxis: 'y', // 轉為橫向
            data: {
                labels: ['咖啡', '手搖飲', '甜食', '宵夜', '水', '意志力', '朋友鼓勵'],
                datasets: [{
                    label: '選擇人數',
                    data: [0, 0, 0, 0, 0, 0, 0],
                    backgroundColor: '#3b82f6', // 科技藍
                    borderRadius: 4,
                    barThickness: 15
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { grid: { color: 'rgba(255,255,255,0.05)' } },
                    y: { grid: { display: false } }
                }
            }
        });
    }
}

// ==========================================
// 4. 資料抓取與解析核心
// ==========================================
async function fetchCSV() {
    try {
        const response = await fetch(CSV_URL);
        const text = await response.text();
        
        // 檢查是否成功抓到內容
        if (!text || text.length < 10) {
            throw new Error("CSV內容為空");
        }
        
        console.log("✅ CSV 下載成功，開始解析...");
        parseAndAutoUpdate(text);

    } catch (err) {
        console.error("❌ 資料讀取失敗:", err);
        // 在頁面上顯示錯誤狀態
        const statusTag = document.getElementById('status-tag');
        if(statusTag) {
            statusTag.textContent = "CONNECTION_FAIL";
            statusTag.className = "text-[10px] font-mono text-red-500 border border-red-500/30 px-2 py-1 rounded bg-red-500/10";
        }
    }
}

// 智慧解析與更新
function parseAndAutoUpdate(csvText) {
    const rows = csvText.split('\n').map(r => r.trim()).filter(r => r); // 移除空行
    const headers = rows[0].split(','); // 取得標題列

    // --- 自動偵測欄位索引 (Auto-Detection) ---
    // 找出包含關鍵字的欄位在第幾行 (index)
    const colIndices = {
        creature: headers.findIndex(h => KEYWORDS.creature.some(k => h.includes(k))),
        sleep:    headers.findIndex(h => KEYWORDS.sleep.some(k => h.includes(k))),
        survival: headers.findIndex(h => KEYWORDS.survival.some(k => h.includes(k)))
    };

    console.log("🔍 欄位自動偵測結果:", colIndices); // Debug用：請在 Console 查看

    // 如果找不到欄位 (-1)，預設回 1, 2, 3 並發出警告
    if (colIndices.creature === -1) { console.warn("⚠️ 找不到生物欄位，使用預設值 1"); colIndices.creature = 1; }
    if (colIndices.sleep === -1)    { console.warn("⚠️ 找不到睡眠欄位，使用預設值 2"); colIndices.sleep = 2; }
    if (colIndices.survival === -1) { console.warn("⚠️ 找不到續命欄位，使用預設值 3"); colIndices.survival = 3; }

    // --- 統計數據容器 ---
    let stats = {
        creature: { '貓頭鷹': 0, '樹懶': 0, '倉鼠': 0, '海豚': 0 },
        survival: { '咖啡': 0, '手搖飲': 0, '甜食': 0, '宵夜': 0, '水': 0, '意志力': 0, '朋友鼓勵': 0 },
        sleeps: []
    };

    // --- 逐行分析數據 (從第1行開始，跳過標題) ---
    for (let i = 1; i < rows.length; i++) {
        // 使用更強大的正則表達式來分割 CSV (處理引號內的逗號)
        const cols = rows[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        
        // 1. 生物統計
        const cVal = (cols[colIndices.creature] || "").replace(/['"]/g, ''); // 去除引號
        for (let key in stats.creature) {
            if (cVal.includes(key)) stats.creature[key]++;
        }

        // 2. 睡眠統計 (更聰明的數字解析)
        const rawSleep = cols[colIndices.sleep] || "0";
        // 提取字串中的第一個數字 (例如 "約7小時" -> 7, "6.5hr" -> 6.5)
        const sleepMatch = rawSleep.match(/(\d+(\.\d+)?)/); 
        if (sleepMatch) {
            let val = parseFloat(sleepMatch[0]);
            if (val > 0 && val < 24) stats.sleeps.push(val); // 過濾不合理的數字
        }

        // 3. 續命統計
        const survVal = (cols[colIndices.survival] || "").replace(/['"]/g, '');
        for (let key in stats.survival) {
            if (survVal.includes(key)) stats.survival[key]++;
        }
    }

    updateDashboardUI(stats, rows.length - 1);
}

// 更新畫面與圖表
function updateDashboardUI(stats, sampleCount) {
    // 1. 更新樣本數
    const countEl = document.getElementById('sample-count');
    if (countEl) countEl.textContent = sampleCount;

    // 2. 更新雷達圖
    if (charts.creature) {
        charts.creature.data.datasets[0].data = Object.values(stats.creature);
        charts.creature.update();
    }

    // 3. 更新睡眠圖
    if (charts.sleep) {
        // 只取最近 14 筆數據顯示，以免圖表太擁擠
        const recentSleeps = stats.sleeps.slice(-14);
        charts.sleep.data.labels = recentSleeps.map((_, i) => `U${i+1}`); // 生成 U1, U2... 標籤
        charts.sleep.data.datasets[0].data = recentSleeps;
        charts.sleep.update();

        // 計算並顯示平均值
        if (stats.sleeps.length > 0) {
            const avg = (stats.sleeps.reduce((a, b) => a + b, 0) / stats.sleeps.length).toFixed(1);
            
            // 更新大數字
            const avgEl = document.getElementById('avg-sleep');
            if (avgEl) avgEl.innerHTML = `${avg} <span class="text-sm font-normal text-slate-500">Hrs</span>`;
            
            // 更新能量條
            const percentage = Math.min((avg / 8) * 100, 100).toFixed(0);
            const energyVal = document.getElementById('energy-val');
            const energyBar = document.getElementById('energy-bar');
            
            if (energyVal) energyVal.textContent = `${percentage}%`;
            if (energyBar) energyBar.style.width = `${percentage}%`;
            
            // 能量條變色邏輯
            if (percentage < 50) energyBar.classList.replace('bg-cyan-500', 'bg-red-500');
            else energyBar.classList.replace('bg-red-500', 'bg-cyan-500');
        }
    }

    // 4. 更新續命圖
    if (charts.survival) {
        charts.survival.data.datasets[0].data = Object.values(stats.survival);
        charts.survival.update();
    }

    console.log("✅ 儀表板數據更新完成！");
}