// KPI 4 Dashboard JavaScript - Índice de Morosidad Asociada a Facturación Atípica

class KPI4Dashboard {
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
            console.error('Error inicializando KPI 4 dashboard:', error);
            this.showError('Error cargando los datos del KPI 4');
        }
    }

    async loadKPIData() {
        try {
            const response = await fetch('/api/kpis');
            const data = await response.json();
            
            if (data.error) {
                throw new Error(data.error);
            }

            const kpi4 = data.kpi4;
            this.updateKPIDisplay(kpi4);
        } catch (error) {
            throw new Error(`Error cargando KPI: ${error.message}`);
        }
    }

    async loadAnalyticsData() {
        try {
            const response = await fetch('/api/kpi4/analytics');
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
        this.createMorosidadChart(data.morosidad_grupos);
        this.createFactoresChart(data.factores_riesgo);
        this.createDivergenciasChart(data.divergencias_hist);
        this.createTendenciaChart(data.tendencia_mensual);
        this.createCorrelacionChart(data.correlacion_data);
    }

    createMorosidadChart(data) {
        const ctx = document.getElementById('morosidadChart').getContext('2d');
        
        this.charts.morosidad = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Atípicos', 'Normales'],
                datasets: [{
                    label: 'Tasa de Morosidad (%)',
                    data: [data.atipicos, data.normales],
                    backgroundColor: [
                        'rgba(231, 76, 60, 0.8)',
                        'rgba(52, 152, 219, 0.8)'
                    ],
                    borderColor: [
                        'rgba(231, 76, 60, 1)',
                        'rgba(52, 152, 219, 1)'
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
                            text: 'Tasa de Morosidad (%)'
                        }
                    }
                }
            }
        });
    }

    createFactoresChart(data) {
        const ctx = document.getElementById('factoresChart').getContext('2d');
        
        this.charts.factores = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Factores de Riesgo',
                    data: data.valores,
                    backgroundColor: 'rgba(231, 76, 60, 0.2)',
                    borderColor: 'rgba(231, 76, 60, 1)',
                    borderWidth: 2,
                    pointBackgroundColor: 'rgba(231, 76, 60, 1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(231, 76, 60, 1)'
                }]
            },
            options: {
                responsive: true,
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });
    }

    createDivergenciasChart(data) {
        const ctx = document.getElementById('divergenciasChart').getContext('2d');
        
        this.charts.divergencias = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.rangos,
                datasets: [{
                    label: 'Número de Medidores',
                    data: data.frecuencias,
                    backgroundColor: 'rgba(52, 152, 219, 0.8)',
                    borderColor: 'rgba(52, 152, 219, 1)',
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
                    x: {
                        title: {
                            display: true,
                            text: 'Rango de Divergencia (%)'
                        }
                    },
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Número de Medidores'
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
                    label: 'Morosidad Atípicos (%)',
                    data: data.morosidad_atipicos,
                    borderColor: 'rgba(231, 76, 60, 1)',
                    backgroundColor: 'rgba(231, 76, 60, 0.1)',
                    fill: true
                }, {
                    label: 'Meta (15%)',
                    data: new Array(data.meses.length).fill(15),
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
                            text: 'Tasa de Morosidad (%)'
                        }
                    }
                }
            }
        });
    }

    createCorrelacionChart(data) {
        const ctx = document.getElementById('correlacionChart').getContext('2d');
        
        this.charts.correlacion = new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Divergencia vs Morosidad',
                    data: data.puntos,
                    backgroundColor: 'rgba(52, 152, 219, 0.6)',
                    borderColor: 'rgba(52, 152, 219, 1)',
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Divergencia (%)'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Probabilidad de Morosidad'
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
                <h4>Total Medidores Analizados</h4>
                <span class="stat-value">${data.stats.total_medidores.toLocaleString()}</span>
            </div>
            <div class="stat-item">
                <h4>Medidores Atípicos</h4>
                <span class="stat-value">${data.stats.medidores_atipicos.toLocaleString()}</span>
                <small>(${data.stats.porcentaje_atipicos.toFixed(1)}%)</small>
            </div>
            <div class="stat-item">
                <h4>Divergencia Promedio</h4>
                <span class="stat-value">${data.stats.divergencia_promedio.toFixed(2)}%</span>
            </div>
            <div class="stat-item">
                <h4>Impacto Financiero</h4>
                <span class="stat-value">S/ ${data.stats.impacto_financiero.toLocaleString()}</span>
                <small>Estimado mensual</small>
            </div>
            <div class="stat-item">
                <h4>Coeficiente de Correlación</h4>
                <span class="stat-value">${data.stats.correlacion.toFixed(3)}</span>
                <small>Divergencia-Morosidad</small>
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
    new KPI4Dashboard();
});