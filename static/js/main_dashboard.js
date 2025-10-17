// Main Dashboard JavaScript - Luz del Sur
class MainDashboard {
    constructor() {
        this.charts = {};
        this.kpisData = {};
        this.isLoading = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadInitialData();
        this.setupAutoRefresh();
        this.initMiniCharts();
    }

    setupEventListeners() {
        document.getElementById('refreshBtn').addEventListener('click', () => {
            this.refreshAllData();
        });

        // Navegación activa
        this.setActiveNavigation();
    }

    setActiveNavigation() {
        const currentPath = window.location.pathname;
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === currentPath) {
                item.classList.add('active');
            }
        });
    }

    async loadInitialData() {
        this.showLoading(true);
        try {
            await Promise.all([
                this.loadKPIs(),
                this.loadSummaryData(),
                this.loadGlobalTrends()
            ]);
        } catch (error) {
            console.error('Error loading initial data:', error);
            this.showError('Error cargando datos iniciales');
        } finally {
            this.showLoading(false);
        }
    }

    async refreshAllData() {
        if (this.isLoading) return;
        
        const refreshBtn = document.getElementById('refreshBtn');
        const icon = refreshBtn.querySelector('i');
        
        icon.style.animation = 'spin 1s linear infinite';
        
        try {
            await this.loadInitialData();
        } finally {
            icon.style.animation = '';
        }
    }

    async loadKPIs() {
        try {
            const response = await fetch('/api/kpis');
            const data = await response.json();

            if (data.error) {
                this.showError(data.error);
                return;
            }

            this.kpisData = data.kpis;
            this.updateKPICards(data.kpis);
            this.updateNavigationStatus(data.kpis);
            this.updateLastUpdate(data.timestamp);
            this.updateMiniCharts(data.kpis);

        } catch (error) {
            console.error('Error loading KPIs:', error);
            this.showError('Error de conexión al cargar KPIs');
        }
    }

    async loadSummaryData() {
        try {
            const response = await fetch('/api/kpis');
            const data = await response.json();

            if (data.error || !data.resumen) return;

            this.updateSummaryStats(data.resumen);

        } catch (error) {
            console.error('Error loading summary:', error);
        }
    }

    async loadGlobalTrends() {
        try {
            const response = await fetch('/api/tendencias');
            const data = await response.json();

            if (data.error || !data.tendencias) return;

            this.updateGlobalTrendsChart(data.tendencias);

        } catch (error) {
            console.error('Error loading trends:', error);
        }
    }

    updateKPICards(kpis) {
        Object.entries(kpis).forEach(([kpiId, kpiData]) => {
            const kpiNumber = kpiId.replace('kpi_', '');
            
            // Actualizar valor
            const valueElement = document.getElementById(`kpi${kpiNumber}-value`);
            if (valueElement) {
                this.animateValue(valueElement, kpiData.valor);
            }

            // Actualizar estado del badge
            const badgeElement = document.getElementById(`status-badge-${kpiNumber}`);
            if (badgeElement) {
                badgeElement.textContent = kpiData.estado;
                badgeElement.className = `kpi-status-badge ${kpiData.estado.toLowerCase()}`;
            }

            // Actualizar tarjeta según estado
            const card = document.querySelector(`[data-kpi="${kpiId}"]`);
            if (card) {
                card.className = `kpi-card ${this.getCardClass(kpiData.estado)}`;
            }
        });
    }

    updateNavigationStatus(kpis) {
        Object.entries(kpis).forEach(([kpiId, kpiData]) => {
            const kpiNumber = kpiId.replace('kpi_', '');
            const statusElement = document.getElementById(`nav-kpi${kpiNumber}-status`);
            
            if (statusElement) {
                statusElement.textContent = kpiData.estado;
                statusElement.className = `kpi-status ${kpiData.estado}`;
            }
        });
    }

    updateSummaryStats(resumen) {
        // Total registros
        const totalRegistros = document.getElementById('totalRegistros');
        if (totalRegistros) {
            totalRegistros.textContent = this.formatNumber(resumen.total_registros);
        }

        // Total medidores
        const totalMedidores = document.getElementById('totalMedidores');
        if (totalMedidores) {
            totalMedidores.textContent = this.formatNumber(resumen.total_medidores);
        }

        // Período
        const periodoAnalisis = document.getElementById('periodoAnalisis');
        if (periodoAnalisis && resumen.fecha_inicio && resumen.fecha_fin) {
            const inicio = new Date(resumen.fecha_inicio).toLocaleDateString('es-ES');
            const fin = new Date(resumen.fecha_fin).toLocaleDateString('es-ES');
            periodoAnalisis.textContent = `${inicio} - ${fin}`;
        }

        // Alertas activas
        const alertasActivas = document.getElementById('alertasActivas');
        if (alertasActivas) {
            const alertas = Object.values(this.kpisData).filter(
                kpi => kpi.estado === 'CRÍTICO' || kpi.estado === 'ALERTA'
            ).length;
            alertasActivas.textContent = alertas;
        }
    }

    updateLastUpdate(timestamp) {
        const lastUpdateElement = document.getElementById('lastUpdate');
        if (timestamp && lastUpdateElement) {
            const date = new Date(timestamp);
            const formatted = `${date.toLocaleDateString('es-ES')} ${date.toLocaleTimeString('es-ES', {
                hour: '2-digit',
                minute: '2-digit'
            })}`;
            lastUpdateElement.textContent = `Actualizado: ${formatted}`;
        }
    }

    initMiniCharts() {
        // Inicializar gráficos pequeños para cada KPI
        const kpiIds = ['kpi1', 'kpi2', 'kpi3', 'kpi6'];
        
        kpiIds.forEach(kpiId => {
            const canvas = document.getElementById(`${kpiId}-mini-chart`);
            if (canvas) {
                const ctx = canvas.getContext('2d');
                this.charts[kpiId] = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: [],
                        datasets: [{
                            data: [],
                            borderColor: this.getKPIColor(kpiId),
                            backgroundColor: this.getKPIColor(kpiId, 0.1),
                            borderWidth: 2,
                            fill: true,
                            tension: 0.4,
                            pointRadius: 0,
                            pointHoverRadius: 4
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: { display: false },
                            tooltip: { enabled: false }
                        },
                        scales: {
                            x: { display: false },
                            y: { display: false }
                        },
                        animation: {
                            duration: 1000,
                            easing: 'easeInOutQuart'
                        }
                    }
                });
            }
        });
    }

    updateMiniCharts(kpis) {
        // Generar datos simulados de tendencia para los mini-charts
        Object.entries(kpis).forEach(([kpiId, kpiData]) => {
            const chartId = kpiId.replace('_', '');
            const chart = this.charts[chartId];
            
            if (chart) {
                // Simular tendencia basada en el valor actual
                const currentValue = kpiData.valor;
                const trendData = this.generateTrendData(currentValue, 12);
                const labels = Array.from({length: 12}, (_, i) => `M${i+1}`);
                
                chart.data.labels = labels;
                chart.data.datasets[0].data = trendData;
                chart.data.datasets[0].borderColor = this.getKPIColor(chartId);
                chart.data.datasets[0].backgroundColor = this.getKPIColor(chartId, 0.1);
                chart.update('none');
            }
        });
    }

    updateGlobalTrendsChart(tendencias) {
        const ctx = document.getElementById('globalTrendsChart');
        if (!ctx) return;

        if (this.charts.globalTrends) {
            this.charts.globalTrends.destroy();
        }

        const labels = tendencias.map(t => t.mes);
        
        this.charts.globalTrends = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'KPI 1: Lecturas Estimadas (%)',
                        data: tendencias.map(t => t.kpi_1),
                        borderColor: '#ef4444',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        borderWidth: 3,
                        tension: 0.4,
                        fill: false
                    },
                    {
                        label: 'KPI 2: Consumo Cero (%)',
                        data: tendencias.map(t => t.kpi_2),
                        borderColor: '#f59e0b',
                        backgroundColor: 'rgba(245, 158, 11, 0.1)',
                        borderWidth: 3,
                        tension: 0.4,
                        fill: false
                    },
                    {
                        label: 'KPI 3: Diferencias Significativas (%)',
                        data: tendencias.map(t => t.kpi_3),
                        borderColor: '#3b82f6',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        borderWidth: 3,
                        tension: 0.4,
                        fill: false
                    },
                    {
                        label: 'KPI 6: Continuidad (%)',
                        data: tendencias.map(t => t.kpi_6 || 98.5),
                        borderColor: '#667eea',
                        backgroundColor: 'rgba(102, 126, 234, 0.1)',
                        borderWidth: 3,
                        tension: 0.4,
                        fill: false
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            usePointStyle: true,
                            padding: 20,
                            font: {
                                size: 12,
                                weight: '500'
                            }
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                        titleColor: 'white',
                        bodyColor: 'white',
                        borderColor: 'rgba(59, 130, 246, 0.5)',
                        borderWidth: 1,
                        cornerRadius: 8,
                        padding: 12
                    }
                },
                interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                },
                scales: {
                    x: {
                        grid: {
                            color: 'rgba(226, 232, 240, 0.5)',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#64748b',
                            font: {
                                size: 11
                            }
                        }
                    },
                    y: {
                        grid: {
                            color: 'rgba(226, 232, 240, 0.5)',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#64748b',
                            font: {
                                size: 11
                            }
                        }
                    }
                },
                animation: {
                    duration: 1500,
                    easing: 'easeInOutQuart'
                }
            }
        });
    }

    // Utility functions
    generateTrendData(currentValue, points) {
        const data = [];
        const variation = currentValue * 0.3; // 30% de variación
        
        for (let i = 0; i < points; i++) {
            const randomVariation = (Math.random() - 0.5) * variation;
            const trendValue = Math.max(0, currentValue + randomVariation);
            data.push(Number(trendValue.toFixed(2)));
        }
        
        // Asegurar que el último valor sea el actual
        data[points - 1] = currentValue;
        
        return data;
    }

    getKPIColor(kpiId, alpha = 1) {
        const colors = {
            kpi1: `rgba(239, 68, 68, ${alpha})`,  // Red
            kpi2: `rgba(245, 158, 11, ${alpha})`, // Orange
            kpi3: `rgba(59, 130, 246, ${alpha})`, // Blue
            kpi4: `rgba(168, 85, 247, ${alpha})`, // Purple
            kpi5: `rgba(16, 185, 129, ${alpha})`, // Green
            kpi6: `rgba(34, 197, 94, ${alpha})`   // Emerald
        };
        
        return colors[kpiId] || `rgba(107, 114, 128, ${alpha})`;
    }

    getCardClass(estado) {
        switch (estado) {
            case 'CRÍTICO': return 'critical';
            case 'ALERTA': return 'warning';
            case 'OK': return 'ok';
            default: return 'warning';
        }
    }

    animateValue(element, newValue) {
        const currentValue = parseFloat(element.textContent) || 0;
        const increment = (newValue - currentValue) / 60; // 1 segundo de animación
        let current = currentValue;
        
        const timer = setInterval(() => {
            current += increment;
            if (
                (increment > 0 && current >= newValue) ||
                (increment < 0 && current <= newValue)
            ) {
                element.textContent = newValue.toFixed(2);
                clearInterval(timer);
            } else {
                element.textContent = current.toFixed(2);
            }
        }, 16); // ~60fps
    }

    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toLocaleString();
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
        
        // Estilos para la notificación
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #fee2e2;
            color: #7f1d1d;
            padding: 1rem;
            border-radius: 12px;
            border-left: 4px solid #ef4444;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            z-index: 10000;
            max-width: 400px;
            animation: slideIn 0.3s ease-out;
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
            border-radius: 4px;
        `;
        
        // Agregar CSS de animación
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(errorDiv);
        
        // Auto-remover después de 5 segundos
        setTimeout(() => {
            if (errorDiv.parentElement) {
                errorDiv.style.animation = 'slideIn 0.3s ease-out reverse';
                setTimeout(() => errorDiv.remove(), 300);
            }
        }, 5000);
    }

    setupAutoRefresh() {
        // Actualización automática cada 5 minutos
        setInterval(() => {
            if (!document.hidden) {
                this.loadKPIs();
            }
        }, 300000);

        // Recargar cuando la página vuelve a ser visible
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                this.loadKPIs();
            }
        });
    }
}

// Inicializar el dashboard cuando se cargue la página
document.addEventListener('DOMContentLoaded', () => {
    window.mainDashboard = new MainDashboard();
});

// Utilidades globales
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
    },

    formatDate: (dateString) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }
};