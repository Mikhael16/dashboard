// Dashboard JavaScript - Luz del Sur KPIs
class Dashboard {
    constructor() {
        this.charts = {};
        this.kpisData = {};
        this.isLoading = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadInitialData();
        this.startAutoRefresh();
    }

    setupEventListeners() {
        // Botón de actualización
        document.getElementById('refreshBtn').addEventListener('click', () => {
            this.loadKPIs();
        });

        // Actualización automática cada 5 minutos
        setInterval(() => {
            this.loadKPIs();
        }, 300000);
    }

    async loadInitialData() {
        this.showLoading(true);
        await this.loadKPIs();
        await this.loadTendencias();
        this.showLoading(false);
    }

    showLoading(show) {
        const overlay = document.getElementById('loadingOverlay');
        if (show) {
            overlay.classList.remove('hidden');
            this.isLoading = true;
        } else {
            overlay.classList.add('hidden');
            this.isLoading = false;
        }
    }

    async loadKPIs() {
        if (this.isLoading) return;

        try {
            const response = await fetch('/api/kpis');
            const data = await response.json();

            if (data.error) {
                this.showError('Error cargando KPIs: ' + data.error);
                return;
            }

            this.kpisData = data;
            this.updateKPICards(data.kpis);
            this.updateSummary(data.resumen);
            this.updateLastUpdateTime(data.timestamp);
            this.updateAlertas(data.kpis);
            this.updateEstadosChart(data.kpis);

        } catch (error) {
            console.error('Error loading KPIs:', error);
            this.showError('Error de conexión al cargar los KPIs');
        }
    }

    async loadTendencias() {
        try {
            const response = await fetch('/api/tendencias');
            const data = await response.json();

            if (data.error) {
                console.error('Error cargando tendencias:', data.error);
                return;
            }

            this.updateTendenciasChart(data.tendencias);

        } catch (error) {
            console.error('Error loading tendencias:', error);
        }
    }

    updateKPICards(kpis) {
        Object.entries(kpis).forEach(([kpiId, kpiData]) => {
            // Actualizar valor
            const valorElement = document.getElementById(`valor_${kpiId}`);
            if (valorElement) {
                valorElement.textContent = kpiData.valor;
            }

            // Actualizar meta
            const metaElement = document.getElementById(`meta_${kpiId}`);
            if (metaElement) {
                metaElement.textContent = kpiData.meta;
            }

            // Actualizar estado
            const statusElement = document.getElementById(`status_${kpiId}`);
            if (statusElement) {
                statusElement.textContent = kpiData.estado;
                statusElement.className = `kpi-status ${kpiData.estado}`;
            }

            // Aplicar colores según estado
            const card = document.querySelector(`[data-kpi="${kpiId}"]`);
            if (card) {
                card.classList.remove('critical', 'warning', 'ok');
                switch (kpiData.estado) {
                    case 'CRÍTICO':
                        card.classList.add('critical');
                        break;
                    case 'ALERTA':
                        card.classList.add('warning');
                        break;
                    case 'OK':
                        card.classList.add('ok');
                        break;
                }
            }
        });
    }

    updateSummary(resumen) {
        // Formatear números grandes
        const formatNumber = (num) => {
            if (num >= 1000000) {
                return (num / 1000000).toFixed(1) + 'M';
            } else if (num >= 1000) {
                return (num / 1000).toFixed(1) + 'K';
            }
            return num.toLocaleString();
        };

        document.getElementById('totalRegistros').textContent = formatNumber(resumen.total_registros);
        document.getElementById('totalMedidores').textContent = formatNumber(resumen.total_medidores);
        document.getElementById('consumoPromedio').textContent = resumen.consumo_promedio;
        
        const periodoElement = document.getElementById('periodoAnalisis');
        if (resumen.fecha_inicio && resumen.fecha_fin) {
            const fechaInicio = new Date(resumen.fecha_inicio).toLocaleDateString('es-ES');
            const fechaFin = new Date(resumen.fecha_fin).toLocaleDateString('es-ES');
            periodoElement.textContent = `${fechaInicio} - ${fechaFin}`;
        } else {
            periodoElement.textContent = 'N/A';
        }
    }

    updateLastUpdateTime(timestamp) {
        const timeElement = document.getElementById('lastUpdate');
        if (timestamp) {
            const date = new Date(timestamp);
            const formatted = date.toLocaleDateString('es-ES') + ' ' + 
                            date.toLocaleTimeString('es-ES', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                            });
            timeElement.textContent = `Actualizado: ${formatted}`;
        }
    }

    updateAlertas(kpis) {
        const alertsList = document.getElementById('alertsList');
        const alertas = [];

        Object.entries(kpis).forEach(([kpiId, kpiData]) => {
            if (kpiData.estado === 'CRÍTICO') {
                alertas.push({
                    type: 'critical',
                    icon: 'fas fa-exclamation-circle',
                    message: `KPI ${kpiId.replace('kpi_', '')}: Valor crítico de ${kpiData.valor}${kpiData.unidad} (Meta: ${kpiData.meta}${kpiData.unidad})`
                });
            } else if (kpiData.estado === 'ALERTA') {
                alertas.push({
                    type: 'warning',
                    icon: 'fas fa-exclamation-triangle',
                    message: `KPI ${kpiId.replace('kpi_', '')}: Valor en alerta de ${kpiData.valor}${kpiData.unidad} (Meta: ${kpiData.meta}${kpiData.unidad})`
                });
            }
        });

        if (alertas.length === 0) {
            alertsList.innerHTML = '<div class="no-alerts">✅ Todos los KPIs están dentro de los parámetros normales</div>';
        } else {
            alertsList.innerHTML = alertas.map(alerta => `
                <div class="alert-item ${alerta.type}">
                    <i class="${alerta.icon}"></i>
                    <span>${alerta.message}</span>
                </div>
            `).join('');
        }
    }

    updateTendenciasChart(tendencias) {
        const ctx = document.getElementById('tendenciasChart').getContext('2d');
        
        if (this.charts.tendencias) {
            this.charts.tendencias.destroy();
        }

        if (!tendencias || tendencias.length === 0) {
            ctx.font = '16px Arial';
            ctx.fillStyle = '#666';
            ctx.textAlign = 'center';
            ctx.fillText('No hay datos de tendencias disponibles', ctx.canvas.width / 2, ctx.canvas.height / 2);
            return;
        }

        const labels = tendencias.map(t => t.mes);
        
        this.charts.tendencias = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'KPI 1: Lecturas Estimadas (%)',
                        data: tendencias.map(t => t.kpi_1),
                        borderColor: '#ef4444',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        tension: 0.4
                    },
                    {
                        label: 'KPI 2: Consumo Cero (%)',
                        data: tendencias.map(t => t.kpi_2),
                        borderColor: '#f59e0b',
                        backgroundColor: 'rgba(245, 158, 11, 0.1)',
                        tension: 0.4
                    },
                    {
                        label: 'KPI 3: Diferencias Significativas (%)',
                        data: tendencias.map(t => t.kpi_3),
                        borderColor: '#3b82f6',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        tension: 0.4
                    },
                    {
                        label: 'KPI 5: Tasa de Reclamos (‰)',
                        data: tendencias.map(t => t.kpi_5),
                        borderColor: '#10b981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: '#e5e7eb'
                        }
                    },
                    x: {
                        grid: {
                            color: '#e5e7eb'
                        }
                    }
                }
            }
        });
    }

    updateEstadosChart(kpis) {
        const ctx = document.getElementById('estadosChart').getContext('2d');
        
        if (this.charts.estados) {
            this.charts.estados.destroy();
        }

        const estados = { 'OK': 0, 'ALERTA': 0, 'CRÍTICO': 0, 'ERROR': 0 };
        
        Object.values(kpis).forEach(kpi => {
            estados[kpi.estado]++;
        });

        this.charts.estados = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(estados),
                datasets: [{
                    data: Object.values(estados),
                    backgroundColor: [
                        '#10b981',  // OK - Verde
                        '#f59e0b',  // ALERTA - Amarillo
                        '#ef4444',  // CRÍTICO - Rojo
                        '#6b7280'   // ERROR - Gris
                    ],
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    showError(message) {
        // Crear notificación de error
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-notification';
        errorDiv.innerHTML = `
            <div class="error-content">
                <i class="fas fa-exclamation-circle"></i>
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        // Agregar estilos para la notificación
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #fee2e2;
            color: #7f1d1d;
            padding: 1rem;
            border-radius: 8px;
            border-left: 4px solid #ef4444;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            z-index: 1000;
            max-width: 400px;
        `;
        
        const errorContent = errorDiv.querySelector('.error-content');
        errorContent.style.cssText = `
            display: flex;
            align-items: center;
            gap: 0.75rem;
        `;
        
        const closeButton = errorDiv.querySelector('button');
        closeButton.style.cssText = `
            background: none;
            border: none;
            color: #7f1d1d;
            cursor: pointer;
            padding: 0.25rem;
        `;
        
        document.body.appendChild(errorDiv);
        
        // Auto-remover después de 5 segundos
        setTimeout(() => {
            if (errorDiv.parentElement) {
                errorDiv.remove();
            }
        }, 5000);
    }

    startAutoRefresh() {
        // Verificar si la página está visible antes de actualizar
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                this.loadKPIs();
            }
        });
    }
}

// Inicializar el dashboard cuando se cargue la página
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new Dashboard();
});

// Utilidades adicionales
window.dashboardUtils = {
    formatNumber: (num) => {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toLocaleString();
    },

    formatPercentage: (value, decimals = 2) => {
        return parseFloat(value).toFixed(decimals) + '%';
    },

    getStatusColor: (status) => {
        const colors = {
            'OK': '#10b981',
            'ALERTA': '#f59e0b', 
            'CRÍTICO': '#ef4444',
            'ERROR': '#6b7280'
        };
        return colors[status] || '#6b7280';
    }
};