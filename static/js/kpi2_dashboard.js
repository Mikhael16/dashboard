console.log('[KPI2] Loading...');
class KPI2Dashboard {
    constructor() { this.data = null; this.charts = {}; this.init(); }
    async init() { await this.loadData(); if (this.data) { this.renderMetrics(); this.renderCharts(); } }
    async loadData() {
        try {
            const r = await fetch('/api/kpi2/analytics');
            if (!r.ok) throw new Error('HTTP ' + r.status);
            this.data = await r.json();
            if (this.data.error) throw new Error(this.data.error);
            console.log('[KPI2] OK', this.data);
        } catch (e) { console.error('[KPI2] Err:', e); alert('Error: ' + e.message); }
    }
    renderMetrics() {
        if (!this.data || !this.data.kpi_principal) return;
        const k = this.data.kpi_principal;
        const v = document.getElementById('valorPrincipalKPI2');
        if (v) v.innerHTML = '<span style="color:' + this.getColor(k.valor) + '">' + k.valor + '</span><span>%</span>';
    }
    renderCharts() {
        if (!this.data) return;
        this.renderTendenciaChart(); this.renderSegmentoChart(); this.renderDistribucionChart();
        this.renderImpactoCard(); this.renderTopErroresTable(); this.renderEvolucionChart();
    }
    renderTendenciaChart() {
        const c = document.getElementById('tendenciaChartKPI2');
        if (!c || !this.data.tendencia_mensual) return;
        if (this.charts.t) this.charts.t.destroy();
        const d = this.data.tendencia_mensual;
        this.charts.t = new Chart(c, {
            type: 'line', data: { labels: d.labels, datasets: [
                { label: 'Precision', data: d.valores, borderColor: '#667eea', fill: true },
                { label: 'Meta 98%', data: Array(d.labels.length).fill(98), borderColor: '#10b981', borderDash: [10,5], pointRadius: 0 }
            ]},
            options: { responsive: true, maintainAspectRatio: false, scales: { y: { min: 95, max: 100 } } }
        });
    }
    renderSegmentoChart() {
        const c = document.getElementById('segmentoChartKPI2');
        if (!c || !this.data.precision_por_segmento) return;
        if (this.charts.s) this.charts.s.destroy();
        const d = this.data.precision_por_segmento;
        this.charts.s = new Chart(c, {
            type: 'bar', data: { labels: d.labels, datasets: [{ data: d.valores, backgroundColor: d.valores.map(v => this.getColor(v)) }] },
            options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false, scales: { x: { min: 95, max: 100 } } }
        });
    }
    renderDistribucionChart() {
        const c = document.getElementById('distribucionChartKPI2');
        if (!c || !this.data.distribucion_errores) return;
        if (this.charts.d) this.charts.d.destroy();
        const dt = this.data.distribucion_errores;
        this.charts.d = new Chart(c, {
            type: 'bar', data: { labels: dt.labels, datasets: [{ data: dt.valores, backgroundColor: '#667eea' }] },
            options: { responsive: true, maintainAspectRatio: false }
        });
    }
    renderImpactoCard() {
        const c = document.getElementById('impactoEconomico');
        if (!c || !this.data.impacto_economico) return;
        const i = this.data.impacto_economico;
        c.innerHTML = '<div style="padding:2rem;background:#1e293b;border-radius:12px"><h4>Impacto Economico</h4><div style="font-size:2rem;color:#667eea">S/ ' + this.formatNumber(i.impacto_economico) + '</div><p>Diferencia: ' + this.formatNumber(i.diferencia_energia) + ' kWh</p></div>';
    }
    renderTopErroresTable() {
        const c = document.getElementById('topErroresTable');
        if (!c || !this.data.top_errores) return;
        let h = '<table style="width:100%"><thead><tr><th>Medidor</th><th>Facturado</th><th>Medido</th><th>Dif</th><th>%</th></tr></thead><tbody>';
        this.data.top_errores.forEach(r => {
            h += '<tr><td>' + r.medidor + '</td><td>' + r.facturado.toFixed(2) + '</td><td>' + r.medido.toFixed(2) + '</td><td>' + r.diferencia.toFixed(2) + '</td><td>' + r.porcentaje.toFixed(2) + '%</td></tr>';
        });
        c.innerHTML = h + '</tbody></table>';
    }
    renderEvolucionChart() {
        const c = document.getElementById('evolucionErrorChart');
        if (!c || !this.data.evolucion_error) return;
        if (this.charts.e) this.charts.e.destroy();
        const d = this.data.evolucion_error;
        this.charts.e = new Chart(c, {
            type: 'line', data: { labels: d.labels, datasets: [{ label: 'Error', data: d.valores, borderColor: '#f59e0b' }] },
            options: { responsive: true, maintainAspectRatio: false }
        });
    }
    getColor(v) { return v >= 98 ? '#10b981' : v >= 96 ? '#f59e0b' : '#ef4444'; }
    formatNumber(n) { return n >= 1e6 ? (n/1e6).toFixed(2) + 'M' : n >= 1e3 ? (n/1e3).toFixed(2) + 'K' : n.toLocaleString('es-PE', {maximumFractionDigits:2}); }
}
if (typeof Chart !== 'undefined') { Chart.defaults.font.family = 'Inter'; Chart.defaults.color = '#64748b'; }
document.addEventListener('DOMContentLoaded', () => { console.log('[KPI2] Starting'); window.kpi2Dashboard = new KPI2Dashboard(); });
