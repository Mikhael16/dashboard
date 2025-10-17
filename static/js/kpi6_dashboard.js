class KPI6Dashboard {
    constructor() {
        this.data = null;
        this.charts = {};
        this.init();
    }

    async init() {
        console.log('[KPI 6] Inicializando...');
        this.showLoading();
        try {
            await this.loadData();
            this.renderMetrics();
            this.renderCharts();
            this.hideLoading();
            console.log('[KPI 6] Dashboard inicializado correctamente');
        } catch (error) {
            console.error('[KPI 6] Error:', error);
            this.hideLoading();
            alert('Error al cargar los datos del KPI 6: ' + error.message);
        }
    }

    showLoading() {
        const el = document.getElementById('loadingOverlay');
        if (el) el.classList.remove('hidden');
    }

    hideLoading() {
        const el = document.getElementById('loadingOverlay');
        if (el) el.classList.add('hidden');
    }

    async loadData() {
        const response = await fetch('/api/kpi6/analytics');
        if (!response.ok) {
            throw new Error('Error HTTP: ' + response.status);
        }
        this.data = await response.json();
        console.log('[KPI 6] Datos cargados:', this.data);
        if (this.data.error) throw new Error(this.data.error);
    }

    renderMetrics() {
        console.log('[KPI 6] Renderizando métricas...');
        const kpi = this.data.kpi_principal;
        
        // Métrica principal
        const valorEl = document.getElementById('valorPrincipalKPI6');
        if (valorEl) {
            valorEl.innerHTML = `<span class="value" style="color: ${this.getColor(kpi.valor)}">${kpi.valor}</span><span class="unit">%</span>`;
        }
        
        // Casos OK y Errores
        const casosOK = document.getElementById('casosOK');
        if (casosOK) casosOK.textContent = kpi.casos_continuidad_ok.toLocaleString();
        
        const casosError = document.getElementById('casosError');
        if (casosError) casosError.textContent = kpi.casos_error.toLocaleString();
        
        // Total Casos
        const totalCasos = document.getElementById('totalCasos');
        if (totalCasos) totalCasos.textContent = kpi.total_casos.toLocaleString();
        
        // Diferencia Promedio
        const diferenciaPromedio = document.getElementById('diferenciaPromedio');
        if (diferenciaPromedio) diferenciaPromedio.textContent = kpi.diferencia_promedio.toFixed(2);
        
        // Diferencia Máxima
        const diferenciaMaxima = document.getElementById('diferenciaMaxima');
        if (diferenciaMaxima) diferenciaMaxima.textContent = kpi.diferencia_maxima.toFixed(2);
        
        // Errores Críticos
        const erroresCriticos = document.getElementById('erroresCriticos');
        if (erroresCriticos && this.data.estadisticas_detalladas) {
            erroresCriticos.textContent = this.data.estadisticas_detalladas.errores_criticos.toLocaleString();
        }
        
        // Estado de Meta
        const estadoMeta = document.getElementById('estadoMeta');
        if (estadoMeta) {
            if (kpi.cumple_meta) {
                estadoMeta.innerHTML = '<i class="fas fa-check-circle"></i> Cumpliendo meta';
                estadoMeta.className = 'status-badge status-success';
            } else {
                estadoMeta.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Requiere atención';
                estadoMeta.className = 'status-badge status-warning';
            }
        }
        
        console.log('[KPI 6] Métricas renderizadas');
    }

    renderCharts() {
        console.log('[KPI 6] Renderizando gráficos...');
        try {
            this.renderTendenciaChart();
            this.renderDistribucionChart();
            this.renderTopMedidoresChart();
            this.renderMarcaChart();
            this.renderGeografiaChart();
            this.renderEvolucionChart();
            console.log('[KPI 6] Gráficos renderizados');
        } catch (error) {
            console.error('[KPI 6] Error renderizando gráficos:', error);
        }
    }

    renderTendenciaChart() {
        const ctx = document.getElementById('tendenciaChartKPI6');
        if (!ctx) {
            console.warn('[KPI 6] Canvas tendenciaChartKPI6 no encontrado');
            return;
        }
        
        if (this.charts.tendencia) this.charts.tendencia.destroy();
        
        const data = this.data.tendencia_mensual;
        
        this.charts.tendencia = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Exactitud (%)',
                    data: data.valores,
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointRadius: 4,
                    pointHoverRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: true, labels: { color: '#94a3b8' } }
                },
                scales: {
                    y: {
                        min: 95,
                        max: 100,
                        ticks: {
                            color: '#94a3b8',
                            callback: function(value) { return value + '%'; }
                        },
                        grid: { color: 'rgba(148, 163, 184, 0.1)' }
                    },
                    x: {
                        ticks: { color: '#94a3b8' },
                        grid: { color: 'rgba(148, 163, 184, 0.1)' }
                    }
                }
            }
        });
    }

    renderDistribucionChart() {
        const ctx = document.getElementById('distribucionChartKPI6');
        if (!ctx) return;
        
        const data = this.data.distribucion_errores;
        
        if (!data.labels || data.labels.length === 0) {
            ctx.parentElement.innerHTML = '<p style="text-align:center;color:#94a3b8;padding:2rem;">No hay errores de continuidad</p>';
            return;
        }
        
        if (this.charts.distribucion) this.charts.distribucion.destroy();
        
        this.charts.distribucion = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Cantidad',
                    data: data.valores,
                    backgroundColor: ['#10b981', '#f59e0b', '#ef4444', '#7f1d1d']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { color: '#94a3b8' },
                        grid: { color: 'rgba(148, 163, 184, 0.1)' }
                    },
                    x: {
                        ticks: { color: '#94a3b8' },
                        grid: { display: false }
                    }
                }
            }
        });
    }

    renderTopMedidoresChart() {
        const ctx = document.getElementById('topMedidoresChartKPI6');
        if (!ctx) return;
        
        const data = this.data.top_medidores_error;
        
        if (!data.labels || data.labels.length === 0) {
            ctx.parentElement.innerHTML = '<p style="text-align:center;color:#94a3b8;padding:2rem;">No hay medidores con errores</p>';
            return;
        }
        
        if (this.charts.topMedidores) this.charts.topMedidores.destroy();
        
        this.charts.topMedidores = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Errores',
                    data: data.valores,
                    backgroundColor: '#ef4444'
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: {
                        beginAtZero: true,
                        ticks: { color: '#94a3b8' },
                        grid: { color: 'rgba(148, 163, 184, 0.1)' }
                    },
                    y: {
                        ticks: { color: '#94a3b8' },
                        grid: { display: false }
                    }
                }
            }
        });
    }

    renderMarcaChart() {
        const ctx = document.getElementById('marcaChartKPI6');
        if (!ctx) return;
        
        const data = this.data.analisis_marca;
        
        if (!data.labels || data.labels.length === 0) {
            ctx.parentElement.innerHTML = '<p style="text-align:center;color:#94a3b8;padding:2rem;">No hay datos de marca</p>';
            return;
        }
        
        if (this.charts.marca) this.charts.marca.destroy();
        
        this.charts.marca = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Exactitud (%)',
                    data: data.valores,
                    backgroundColor: data.valores.map(v => this.getColor(v))
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: {
                        min: 95,
                        max: 100,
                        ticks: {
                            color: '#94a3b8',
                            callback: function(value) { return value + '%'; }
                        },
                        grid: { color: 'rgba(148, 163, 184, 0.1)' }
                    },
                    x: {
                        ticks: { color: '#94a3b8' },
                        grid: { display: false }
                    }
                }
            }
        });
    }

    renderGeografiaChart() {
        const ctx = document.getElementById('geografiaChartKPI6');
        if (!ctx) return;
        
        const data = this.data.distribucion_geografica;
        
        if (!data.labels || data.labels.length === 0) {
            ctx.parentElement.innerHTML = '<p style="text-align:center;color:#94a3b8;padding:2rem;">No hay datos geográficos</p>';
            return;
        }
        
        if (this.charts.geografia) this.charts.geografia.destroy();
        
        this.charts.geografia = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Errores',
                    data: data.valores,
                    backgroundColor: '#667eea'
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: {
                        beginAtZero: true,
                        ticks: { color: '#94a3b8' },
                        grid: { color: 'rgba(148, 163, 184, 0.1)' }
                    },
                    y: {
                        ticks: { color: '#94a3b8' },
                        grid: { display: false }
                    }
                }
            }
        });
    }

    renderEvolucionChart() {
        const ctx = document.getElementById('evolucionChartKPI6');
        if (!ctx) return;
        
        const data = this.data.evolucion_error_promedio;
        
        if (!data.labels || data.labels.length === 0) {
            ctx.parentElement.innerHTML = '<p style="text-align:center;color:#94a3b8;padding:2rem;">No hay datos de evolución</p>';
            return;
        }
        
        if (this.charts.evolucion) this.charts.evolucion.destroy();
        
        this.charts.evolucion = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Error Promedio (kWh)',
                    data: data.valores,
                    borderColor: '#f59e0b',
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: true, labels: { color: '#94a3b8' } } },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { color: '#94a3b8' },
                        grid: { color: 'rgba(148, 163, 184, 0.1)' }
                    },
                    x: {
                        ticks: { color: '#94a3b8' },
                        grid: { color: 'rgba(148, 163, 184, 0.1)' }
                    }
                }
            }
        });
    }

    getColor(v) {
        if (v >= 99) return '#10b981';
        if (v >= 97) return '#f59e0b';
        return '#ef4444';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('[KPI 6] Inicializando dashboard...');
    window.kpi6Dashboard = new KPI6Dashboard();
});
