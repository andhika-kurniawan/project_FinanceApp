// stats.js - Statistik logic

let currentPeriodType = 'weekly';
let currentDate = new Date();

function setPeriodType(type) {
    currentPeriodType = type;
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('tab--active'));
    document.getElementById(`tab-${type}`).classList.add('tab--active');
    
    // Update summary text
    const summaryText = document.querySelector('.section-pad div[style*="color:var(--neutral-500)"]');
    if (summaryText) {
        summaryText.innerText = type === 'weekly' ? 'Ringkasan mingguan' : 'Ringkasan bulanan';
    }
    
    // Update period label small text
    const periodSubLabel = document.querySelector('#period-label + div');
    if (periodSubLabel) {
        periodSubLabel.innerText = type === 'weekly' ? 'Minggu ini' : 'Bulan ini';
    }

    updateStats();
}

function changePeriod(delta) {
    if (currentPeriodType === 'monthly') {
        currentDate.setMonth(currentDate.getMonth() + delta);
    } else {
        currentDate.setDate(currentDate.getDate() + (delta * 7));
    }
    updateStats();
}

function getWeekRange(date) {
    const start = new Date(date);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1);
    start.setDate(diff);
    start.setHours(0,0,0,0);
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    end.setHours(23,59,59,999);
    return { start, end };
}

function updateStats() {
    const periodLabel = document.getElementById('period-label');
    const { store, categories, format } = PW;
    const txns = store.getAll();
    
    if (currentPeriodType === 'monthly') {
        const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
        periodLabel.innerText = `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    } else {
        const { start, end } = getWeekRange(currentDate);
        const monthsShort = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
        periodLabel.innerText = `${start.getDate()} - ${end.getDate()} ${monthsShort[end.getMonth()]} ${end.getFullYear()}`;
    }

    let filtered = [];
    if (currentPeriodType === 'monthly') {
        const m = currentDate.getMonth() + 1;
        const y = currentDate.getFullYear();
        filtered = txns.filter(t => {
            const [ty, tm] = t.date.split('-');
            return parseInt(ty) === y && parseInt(tm) === m;
        });
    } else {
        const { start, end } = getWeekRange(currentDate);
        filtered = txns.filter(t => {
            const d = new Date(t.date);
            return d >= start && d <= end;
        });
    }

    let totalInc = 0, totalExp = 0;
    const catTotals = {};

    filtered.forEach(t => {
        if (t.type === 'income') {
            totalInc += t.amount;
        } else {
            totalExp += t.amount;
            catTotals[t.category] = (catTotals[t.category] || 0) + t.amount;
        }
    });

    document.getElementById('total-income').innerText = format.rpCompact(totalInc);
    document.getElementById('total-expense').innerText = format.rpCompact(totalExp);
    const net = totalInc - totalExp;
    const netEl = document.getElementById('total-net');
    netEl.innerText = (net >= 0 ? '+' : '') + format.rpCompact(net);
    netEl.style.color = net >= 0 ? 'var(--accent-400)' : '#fff';

    if (filtered.length === 0) {
        if(document.getElementById('chart-total-amount')) document.getElementById('chart-total-amount').innerText = format.rpCompact(0);
        document.getElementById('breakdown-list').innerHTML = '<div style="text-align:center; padding:20px; color:var(--neutral-400);">Belum ada data transaksi</div>';
        if (barChartInstance) barChartInstance.destroy();
        if (doughnutChartInstance) doughnutChartInstance.destroy();
        barChartInstance = null;
        doughnutChartInstance = null;
    } else {
        renderBarChart(filtered);
        const catArray = Object.keys(catTotals).map(catKey => {
            const catInfo = categories.expense.find(c => c.id === catKey) || 
                            categories.income.find(c => c.id === catKey) || 
                            { label: catKey, icon: 'circle' };
            return { name: catInfo.label, icon: catInfo.icon, amount: catTotals[catKey] };
        }).sort((a, b) => b.amount - a.amount);
        renderDoughnutChart(catArray);
    }
}

let barChartInstance = null;
let doughnutChartInstance = null;

function renderBarChart(txns) {
    const ctx = document.getElementById('barChart').getContext('2d');
    if (barChartInstance) barChartInstance.destroy();

    let labels = [];
    let incomeData = [];
    let expenseData = [];

    if (currentPeriodType === 'weekly') {
        labels = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
        const { start } = getWeekRange(currentDate);
        for (let i = 0; i < 7; i++) {
            const d = new Date(start);
            d.setDate(d.getDate() + i);
            const dStr = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
            const dayTxns = txns.filter(t => t.date === dStr);
            incomeData.push(dayTxns.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0));
            expenseData.push(dayTxns.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0));
        }
    } else {
        // Monthly: Group by week
        labels = ['Mgg 1', 'Mgg 2', 'Mgg 3', 'Mgg 4', 'Mgg 5'];
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        for (let i = 0; i < 5; i++) {
            const startDay = i * 7 + 1;
            const endDay = Math.min((i + 1) * 7, new Date(year, month + 1, 0).getDate());
            const weekTxns = txns.filter(t => {
                const day = parseInt(t.date.split('-')[2]);
                return day >= startDay && day <= endDay;
            });
            incomeData.push(weekTxns.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0));
            expenseData.push(weekTxns.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0));
        }
    }

    barChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Income',
                data: incomeData,
                backgroundColor: '#22c55e',
                borderRadius: 4
            }, {
                label: 'Expense',
                data: expenseData,
                backgroundColor: '#ef4444',
                borderRadius: 4
            }]
        },
        options: { 
            responsive: true,
            scales: {
                y: { beginAtZero: true, ticks: { callback: value => PW.format.rpCompact(value) } }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: context => context.dataset.label + ': ' + PW.format.rpFull(context.raw)
                    }
                }
            }
        }
    });
}

function renderDoughnutChart(categoriesData) {
    const ctx = document.getElementById('doughnutChart').getContext('2d');
    if (doughnutChartInstance) doughnutChartInstance.destroy();

    const labels = categoriesData.map(c => c.name);
    const amounts = categoriesData.map(c => c.amount);
    
    doughnutChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: amounts,
                backgroundColor: ['#3b82f6', '#f59e0b', '#84cc16', '#ef4444', '#8b5cf6'],
                borderWidth: 0,
                cutout: '75%'
            }]
        },
        options: { 
            responsive: true,
            plugins: { legend: { display: false } }
        }
    });

    const total = amounts.reduce((a, b) => a + b, 0);
    document.getElementById('chart-total-amount').innerText = PW.format.rpCompact(total);

    const listEl = document.getElementById('breakdown-list');
    listEl.innerHTML = categoriesData.map(c => `
        <div style="display:flex; align-items:center; gap:12px; margin-bottom:16px;">
            <div style="width:40px;height:40px;border-radius:12px;background:var(--neutral-100);display:flex;align-items:center;justify-content:center;">
                <i data-lucide="${c.icon}" style="width:20px;height:20px;color:var(--neutral-700);"></i>
            </div>
            <div style="flex:1;">
                <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                    <span style="font-weight:600;font-size:14px;">${c.name}</span>
                    <span style="font-weight:700;font-size:14px;">${PW.format.rpCompact(c.amount)}</span>
                </div>
                <div style="height:4px;background:var(--neutral-200);border-radius:2px;overflow:hidden;">
                    <div style="width:${total > 0 ? (c.amount/total)*100 : 0}%;height:100%;background:var(--primary-500);"></div>
                </div>
            </div>
            <span style="font-size:12px;color:var(--neutral-500);min-width:32px;text-align:right;">${total > 0 ? Math.round((c.amount/total)*100) : 0}%</span>
        </div>
    `).join('');
    lucide.createIcons();
}

document.addEventListener('DOMContentLoaded', () => {
    updateStats();
    PW.modal.init(() => updateStats());
});

window.closeModal = function () { PW.modal.close(); };
window.setTxnType = function (type) { PW.modal.setType(type); };
// Remove handleFormSubmit from global as form is handled by PW.modal.init via submit listener
