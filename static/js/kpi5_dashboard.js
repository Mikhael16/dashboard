// KPI 5 Dashboard JavaScript - Tasa de Reclamos por Cobro Excesivo

class KPI5Dashboard {
    constructor() {
        this.charts = {};
        this.currentData = null;
        this.init();
    }

    async init() {
        try {
            await this.loadKPIData();
            await this.loadAnalyticsData();
            this.hideLoading();
        } catch (error) {
            console.error('Error inicializando KPI 5 dashboard:', error);
            this.showError('Error cargando los datos del KPI 5');
        }
    }

    async loadKPIData() {
        try {
            const response = await fetch('/api/kpis');
            const data = await response.json();
            
            if (data.error) {
                throw new Error(data.error);
            }

            const kpi5 = data.kpi5;
            this.updateKPIDisplay(kpi5);
        } catch (error) {
            throw new Error(`Error cargando KPI: ${error.message}`);
        }
    }

    async loadAnalyticsData() {
        try {
            const response = await fetch('/api/kpi5/analytics');
            const data = await response.json();
            
            if (data.error) {
                throw new Error(data.error);
            }

            this.currentData = data;
            this.createCharts(data);
            this.updateDetailedStats(data);
        } catch (error) {
            throw new Error(`Error cargando análisis: ${error.message}`);
        }
    }

    updateKPIDisplay(kpi) {
        const valueDisplay = document.getElementById('kpi-value-display');
        const statusDisplay = document.getElementById('kpi-status');

        valueDisplay.innerHTML = `
            <div class="kpi-main-value">${kpi.valor}${kpi.unidad}</div>
        `;
        valueDisplay.className = `kpi-value ${kpi.estado.toLowerCase()}`;

        statusDisplay.innerHTML = `
            <span class="status-badge ${kpi.estado.toLowerCase()}">${kpi.estado}</span>
        `;
    }

    createCharts(data) {
        this.createReclamosChart(data.reclamos_mes);
        this.createTiposChart(data.tipos_reclamo);
        this.createDistribucionChart(data.distribucion_geografica);
        this.createTendenciaChart(data.tendencia_mensual);
        this.createResolucionChart(data.tiempo_resolucion);
    }

    createReclamosChart(data) {
        const ctx = document.getElementById('reclamosChart').getContext('2d');
        
        this.charts.reclamos = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.fechas,
                datasets: [{
                    label: 'Reclamos por día',
                    data: data.reclamos_diarios,
                    borderColor: 'rgba(231, 76, 60, 1)',
                    backgroundColor: 'rgba(231, 76, 60, 0.1)',
                    fill: true,
                    tension: 0.4
                }, {
                    label: 'Promedio móvil (7 días)',
                    data: data.promedio_movil,
                    borderColor: 'rgba(52, 152, 219, 1)',
                    backgroundColor: 'transparent',
                    borderWidth: 2,
                    pointRadius: 0
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Número de Reclamos'
                        }
                    }
                }
            }
        });
    }

    createTiposChart(data) {
        const ctx = document.getElementById('tiposChart').getContext('2d');
        
        this.charts.tipos = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: data.tipos,
                datasets: [{
                    data: data.cantidades,
                    backgroundColor: [
                        'rgba(231, 76, 60, 0.8)',
                        'rgba(52, 152, 219, 0.8)',
                        'rgba(46, 204, 113, 0.8)',
                        'rgba(241, 196, 15, 0.8)',
                        'rgba(155, 89, 182, 0.8)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    createDistribucionChart(data) {
        const ctx = document.getElementById('distribucionChart').getContext('2d');
        
        this.charts.distribucion = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.distritos,
                datasets: [{
                    label: 'Tasa de Reclamos (‰)',
                    data: data.tasas,
                    backgroundColor: 'rgba(52, 152, 219, 0.8)',
                    borderColor: 'rgba(52, 152, 219, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                indexAxis: 'y',
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Tasa de Reclamos (‰)'
                        }
                    }
                }
            }
        });
    }

    createTendenciaChart(data) {
        const ctx = document.getElementById('tendenciaChart').getContext('2d');
        
        this.charts.tendencia = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.meses,
                datasets: [{
                    label: 'Tasa de Reclamos (‰)',
                    data: data.tasas_mensuales,
                    borderColor: 'rgba(231, 76, 60, 1)',
                    backgroundColor: 'rgba(231, 76, 60, 0.1)',
                    fill: true,
                    tension: 0.4
                }, {
                    label: 'Meta (5‰)',
                    data: new Array(data.meses.length).fill(5),
                    borderColor: 'rgba(46, 204, 113, 1)',
                    borderDash: [5, 5],
                    fill: false
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Tasa de Reclamos (‰)'
                        }
                    }
                }
            }
        });
    }

    createResolucionChart(data) {
        const ctx = document.getElementById('resolucionChart').getContext('2d');
        
        this.charts.resolucion = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.rangos_tiempo,
                datasets: [{
                    label: 'Número de Casos',
                    data: data.casos,
                    backgroundColor: [
                        'rgba(46, 204, 113, 0.8)',   // 0-24h
                        'rgba(241, 196, 15, 0.8)',   // 1-3 días
                        'rgba(230, 126, 34, 0.8)',   // 3-7 días
                        'rgba(231, 76, 60, 0.8)',    // >7 días
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Número de Casos'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Tiempo de Resolución'
                        }
                    }
                }
            }
        });
    }

    updateDetailedStats(data) {
        const statsContainer = document.getElementById('detailed-stats');
        
        statsContainer.innerHTML = `
            <div class="stat-item">
                <h4>Total Reclamos</h4>
                <span class="stat-value">${data.stats.total_reclamos.toLocaleString()}</span>
            </div>
            <div class="stat-item">
                <h4>Tasa Actual</h4>
                <span class="stat-value">${data.stats.tasa_actual.toFixed(2)}‰</span>
            </div>
            <div class="stat-item">
                <h4>Tiempo Prom. Resolución</h4>
                <span class="stat-value">${data.stats.tiempo_promedio.toFixed(1)}</span>
                <small>días</small>
            </div>
            <div class="stat-item">
                <h4>Satisfacción Cliente</h4>
                <span class="stat-value">${data.stats.satisfaccion.toFixed(1)}%</span>
            </div>
            <div class="stat-item">
                <h4>Casos Resueltos < 24h</h4>
                <span class="stat-value">${data.stats.resueltos_24h.toFixed(1)}%</span>
            </div>
            <div class="stat-item">
                <h4>Tendencia vs Mes Anterior</h4>
                <span class="stat-value ${data.stats.tendencia > 0 ? 'negative' : 'positive'}">
                    ${data.stats.tendencia > 0 ? '+' : ''}${data.stats.tendencia.toFixed(2)}%
                </span>
            </div>
        `;
        
        statsContainer.classList.remove('loading');
    }

    showError(message) {
        const valueDisplay = document.getElementById('kpi-value-display');
        valueDisplay.innerHTML = `
            <div class="error-message">
                <i class="error-icon">⚠</i>
                <span>${message}</span>
            </div>
        `;
        valueDisplay.className = 'kpi-value error';
        this.hideLoading();
    }

    hideLoading() {
        const loadingOverlay = document.getElementById('loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.style.display = 'none';
        }
    }
}

// Inicializar dashboard cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    new KPI5Dashboard();
});