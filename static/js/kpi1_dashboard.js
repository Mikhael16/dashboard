// KPI 1 Dashboard JavaScript - Lecturas Estimadas
class KPI1Dashboard {
    constructor() {
        this.charts = {};
        this.analyticsData = null;
        this.isLoading = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadAnalyticsData();
        this.setupChartControls();
    }

    setupEventListeners() {
        // Controles de período
        document.querySelectorAll('.chart-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.chart-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                
                const period = e.target.dataset.period;
                this.updateTrendChart(period);
            });
        });

        // Controles de filtros
        const aplicarFiltrosBtn = document.getElementById('aplicarFiltros');
        const limpiarFiltrosBtn = document.getElementById('limpiarFiltros');
        
        if (aplicarFiltrosBtn) {
            aplicarFiltrosBtn.addEventListener('click', () => {
                this.applyFilters();
            });
        }
        
        if (limpiarFiltrosBtn) {
            limpiarFiltrosBtn.addEventListener('click', () => {
                this.clearFilters();
            });
        }

        // Auto-refresh
        setInterval(() => {
            if (!document.hidden) {
                this.loadAnalyticsData();
            }
        }, 300000); // 5 minutos
    }

    setupChartControls() {
        // Configurar controles interactivos de los gráficos
        this.initializeChartDefaults();
    }

    async loadAnalyticsData() {
        if (this.isLoading) return;
        
        this.showLoading(true);
        
        try {
            const response = await fetch('/api/kpi1/analytics');
            const data = await response.json();

            console.log('[KPI 1] Datos recibidos desde API:', data);

            if (data.error) {
                console.error('[KPI 1] Error desde API:', data.error);
                this.showError(data.error);
                return;
            }

            // Validar campos críticos usando la nueva estructura de API
            if (!data.kpi_principal || (data.kpi_principal.valor === undefined && data.kpi_principal.valor !== 0)) {
                console.error('[KPI 1] Campo kpi_principal.valor faltante');
                this.showError('Datos incompletos: falta kpi_principal');
                return;
            }

            if (!data.tendencia_mensual || !data.tendencia_mensual.labels || data.tendencia_mensual.labels.length === 0) {
                console.warn('[KPI 1] tendencia_mensual vacía o faltante');
            }

            if (!data.analisis_segmento) {
                console.warn('[KPI 1] analisis_segmento faltante');
            }

            this.analyticsData = data;
            this.updateAllVisualization(data);
            this.updateMetrics(data);
            this.updateStatistics(data);

            console.log('[KPI 1] Datos procesados exitosamente');

        } catch (error) {
            console.error('[KPI 1] Error loading analytics:', error);
            this.showError('Error cargando análisis detallado: ' + error.message);
        } finally {
            this.showLoading(false);
        }
    }

    applyFilters() {
        const fechaInicio = document.getElementById('fechaInicio').value;
        const fechaFin = document.getElementById('fechaFin').value;
        const segmento = document.getElementById('segmentoFilter').value;
        
        // Construir URL con parámetros de filtro
        let url = '/api/kpi1/analytics?';
        const params = [];
        
        if (fechaInicio) {
            params.push(`fecha_inicio=${fechaInicio}`);
        }
        
        if (fechaFin) {
            params.push(`fecha_fin=${fechaFin}`);
        }
        
        if (segmento) {
            params.push(`segmento=${segmento}`);
        }
        
        url += params.join('&');
        
        // Cargar datos con filtros
        this.loadAnalyticsDataWithFilters(url);
    }
    
    clearFilters() {
        document.getElementById('fechaInicio').value = '';
        document.getElementById('fechaFin').value = '';
        document.getElementById('segmentoFilter').value = '';
        
        // Recargar datos sin filtros
        this.loadAnalyticsData();
    }
    
    async loadAnalyticsDataWithFilters(url) {
        if (this.isLoading) return;
        
        this.showLoading(true);
        
        try {
            const response = await fetch(url);
            const data = await response.json();

            if (data.error) {
                this.showError(data.error);
                return;
            }

            this.analyticsData = data;
            this.updateAllVisualization(data);
            this.updateMetrics(data);
            this.updateStatistics(data);

        } catch (error) {
            console.error('Error loading filtered KPI 1 analytics:', error);
            this.showError('Error cargando análisis con filtros');
        } finally {
            this.showLoading(false);
        }
    }

    updateAllVisualization(data) {
        console.log('[KPI 1] Actualizando visualizaciones...');
        
        // Usar tendencia_mensual en lugar de tendencia_temporal
        if (data.tendencia_mensual && data.tendencia_mensual.labels && data.tendencia_mensual.labels.length > 0) {
            this.createTendenciaChart(data.tendencia_mensual);
        } else {
            console.warn('[KPI 1] No hay datos de tendencia mensual');
        }
        
        if (data.analisis_segmento && Object.keys(data.analisis_segmento).length > 0) {
            this.createSegmentoChart(data.analisis_segmento);
        } else {
            console.warn('[KPI 1] No hay datos de análisis por segmento');
        }
        
        if (data.analisis_marca && Object.keys(data.analisis_marca).length > 0) {
            this.createMarcaChart(data.analisis_marca);
        } else {
            console.warn('[KPI 1] No hay datos de análisis por marca');
        }
        
        // Usar distribucion_geografica en lugar de analisis_ubicacion
        if (data.distribucion_geografica && Object.keys(data.distribucion_geografica).length > 0) {
            this.createUbicacionChart(data.distribucion_geografica);
        } else {
            console.warn('[KPI 1] No hay datos de distribución geográfica');
        }
        
        // Usar comparativa_global
        if (data.comparativa_global) {
            this.createComparativaChart(data.comparativa_global);
        } else {
            console.warn('[KPI 1] No hay datos de comparativa global');
        }
        
        // Renderizar tabla de top divergencias
        if (data.top_divergencias && data.top_divergencias.length > 0) {
            this.renderTopDivergencias(data.top_divergencias);
        } else {
            console.warn('[KPI 1] No hay datos de top divergencias');
        }
        
        // Gráfico de patrones por día de la semana (usa datos simulados si no hay reales)
        if (data.patrones_semanales && data.patrones_semanales.length > 0) {
            this.createPatronesChart(data.patrones_semanales);
        } else {
            this.createPatronesChart();  // Fallback a datos simulados
        }
        
        console.log('[KPI 1] Visualizaciones actualizadas');
    }

    updateMetrics(data) {
        console.log('[KPI 1] Actualizando métricas...');
        
        // Extraer datos de la nueva estructura API
        const kpi = data.kpi_principal || {};
        const valorKpi = kpi.valor !== undefined ? kpi.valor : 0;
        
        // Actualizar métricas principales con validación
        if (valorKpi !== undefined) {
            const valorActualEl = document.getElementById('valorActual');
            const currentValueEl = document.getElementById('currentValue');
            
            if (valorActualEl) {
                valorActualEl.textContent = valorKpi.toFixed(2);
            }
            if (currentValueEl) {
                currentValueEl.textContent = valorKpi.toFixed(2);
            }
            
            // Aplicar color dinámico
            const color = this.getStatusColor(valorKpi);
            if (currentValueEl) {
                currentValueEl.style.color = color;
            }
        }
        
        // Facturas atípicas (antes: total_estimadas)
        if (kpi.facturas_atipicas !== undefined) {
            const facturasAtipicasEl = document.getElementById('facturasAtipicas');
            if (facturasAtipicasEl) {
                facturasAtipicasEl.textContent = this.formatNumber(kpi.facturas_atipicas);
            }
            const totalEstimadas = document.getElementById('totalEstimadas');
            if (totalEstimadas) {
                totalEstimadas.textContent = this.formatNumber(kpi.facturas_atipicas);
            }
        }

        // Facturas normales (antes: total_verificadas)
        if (kpi.facturas_normales !== undefined) {
            const facturasNormalesEl = document.getElementById('facturasNormales');
            if (facturasNormalesEl) {
                facturasNormalesEl.textContent = this.formatNumber(kpi.facturas_normales);
            }
            const totalVerificadas = document.getElementById('totalVerificadas');
            if (totalVerificadas) {
                totalVerificadas.textContent = this.formatNumber(kpi.facturas_normales);
            }
        }

        // Desviación de meta
        if (valorKpi !== undefined && kpi.meta) {
            const multiplicador = valorKpi / kpi.meta;
            const desviacionMetaEl = document.getElementById('desviacionMeta');
            if (desviacionMetaEl) {
                desviacionMetaEl.textContent = multiplicador.toFixed(1) + 'x';
            }
            
            // Desviación textual
            const desviacionTexto = (valorKpi - kpi.meta).toFixed(2);
            const deviationEl = document.getElementById('deviation');
            if (deviationEl) {
                if (valorKpi > kpi.meta) {
                    deviationEl.textContent = `+${desviacionTexto}% sobre meta`;
                } else {
                    deviationEl.textContent = `${Math.abs(desviacionTexto)}% bajo meta`;
                }
            }

            // Actualizar estados
            this.updateStatus(valorKpi);
        }
        
        console.log('[KPI 1] Métricas actualizadas');
    }

    updateStatus(valor) {
        let estado, className;
        
        if (valor <= 2.0) {
            estado = 'OK';
            className = 'ok';
        } else if (valor <= 4.0) {
            estado = 'ALERTA';
            className = 'warning';
        } else {
            estado = 'CRÍTICO';
            className = 'critical';
        }

        // Actualizar badges de estado
        document.querySelectorAll('.status-badge, #statusBadge').forEach(badge => {
            badge.textContent = estado;
            badge.className = `status-badge ${className}`;
        });

        // Actualizar iconos
        document.querySelectorAll('.kpi-icon-large, .current-value').forEach(icon => {
            icon.className = icon.className.replace(/(ok|warning|critical)/, className);
        });
    }

    updateStatistics(data) {
        console.log('[KPI 1] Actualizando estadísticas...');
        
        if (!data) {
            console.warn('[KPI 1] No hay datos para actualizar estadísticas');
            return;
        }
        
        // Calcular estadísticas avanzadas
        const tendencia = data.tendencia_temporal || [];
        
        if (tendencia.length >= 2) {
            const primero = tendencia[0].valor;
            const ultimo = tendencia[tendencia.length - 1].valor;
            const cambio = ultimo - primero;
            
            // Tendencia
            const tendenciaElement = document.getElementById('tendencia');
            if (cambio > 0) {
                tendenciaElement.textContent = '↗ Creciente';
                tendenciaElement.className = 'stat-value upward';
            } else if (cambio < 0) {
                tendenciaElement.textContent = '↘ Decreciente';
                tendenciaElement.className = 'stat-value downward';
            } else {
                tendenciaElement.textContent = '→ Estable';
                tendenciaElement.className = 'stat-value';
            }

            // Promedio mensual
            const promedio = tendencia.reduce((sum, item) => sum + item.valor, 0) / tendencia.length;
            document.getElementById('promedioMensual').textContent = promedio.toFixed(2) + '%';

            // Desviación estándar
            const varianza = tendencia.reduce((sum, item) => sum + Math.pow(item.valor - promedio, 2), 0) / tendencia.length;
            const desviacionEst = Math.sqrt(varianza);
            document.getElementById('desviacionEstandar').textContent = '±' + desviacionEst.toFixed(1) + '%';

            // Predicción (simple tendencia lineal)
            const prediccion = ultimo + cambio * 0.1; // Proyección conservadora
            const prediccionElement = document.getElementById('prediccion');
            prediccionElement.textContent = Math.max(0, prediccion).toFixed(1) + '%';
            
            if (prediccion > 4.0) {
                prediccionElement.className = 'stat-value warning';
            }
        }

        // Análisis de segmentos
        if (data.analisis_segmento && Object.keys(data.analisis_segmento).length > 0) {
            const segmentos = Object.entries(data.analisis_segmento);
            const peorSegmento = segmentos.reduce((max, current) => 
                current[1] > max[1] ? current : max
            );
            const peorSegmentoEl = document.getElementById('peorSegmento');
            if (peorSegmentoEl) {
                peorSegmentoEl.textContent = peorSegmento[0];
            }
        }

        // Análisis de marcas
        if (data.analisis_marca && Object.keys(data.analisis_marca).length > 0) {
            const marcas = Object.entries(data.analisis_marca);
            const mejorMarca = marcas.reduce((min, current) => 
                current[1] < min[1] ? current : min
            );
            const mejorMarcaEl = document.getElementById('mejorMarca');
            if (mejorMarcaEl) {
                mejorMarcaEl.textContent = mejorMarca[0];
            }
        }
        
        console.log('[KPI 1] Estadísticas actualizadas');
    }

    createTendenciaChart(tendenciaData) {
        const ctx = document.getElementById('tendenciaChart');
        if (!ctx) {
            console.warn('[KPI 1] Canvas tendenciaChart no encontrado');
            return;
        }
        
        if (!tendenciaData || !tendenciaData.labels || tendenciaData.labels.length === 0) {
            console.warn('[KPI 1] tendenciaData vacío o sin labels');
            return;
        }

        // Destruir gráfico anterior si existe
        if (this.charts.tendencia) {
            this.charts.tendencia.destroy();
            this.charts.tendencia = null;
        }

        // Manejar tanto strings como arrays (la API puede devolver ambos formatos)
        const labels = Array.isArray(tendenciaData.labels) 
            ? tendenciaData.labels 
            : tendenciaData.labels.split(' ');
        const values = Array.isArray(tendenciaData.valores)
            ? tendenciaData.valores.map(v => parseFloat(v))
            : tendenciaData.valores.split(' ').map(v => parseFloat(v));
        
        console.log('[KPI 1] Creando gráfico de tendencia con', labels.length, 'puntos');

        this.charts.tendencia = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Tasa de Facturación Atípica (%)',
                    data: values,
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#ef4444',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8
                }, {
                    label: 'Meta (2.0%)',
                    data: new Array(labels.length).fill(2.0),
                    borderColor: '#10b981',
                    backgroundColor: 'transparent',
                    borderWidth: 2,
                    borderDash: [10, 5],
                    pointRadius: 0,
                    pointHoverRadius: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            usePointStyle: true,
                            padding: 20
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                        titleColor: 'white',
                        bodyColor: 'white',
                        borderColor: '#ef4444',
                        borderWidth: 1,
                        cornerRadius: 8,
                        callbacks: {
                            label: function(context) {
                                if (context.datasetIndex === 0) {
                                    return `Estimadas: ${context.parsed.y.toFixed(2)}%`;
                                } else {
                                    return `Meta: ${context.parsed.y.toFixed(1)}%`;
                                }
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(226, 232, 240, 0.5)'
                        },
                        ticks: {
                            callback: function(value) {
                                return value.toFixed(1) + '%';
                            }
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(226, 232, 240, 0.5)'
                        }
                    }
                },
                interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                }
            }
        });
    }

    createSegmentoChart(segmentoData) {
        const ctx = document.getElementById('segmentoChart');
        if (!ctx) {
            console.warn('[KPI 1] Canvas segmentoChart no encontrado');
            return;
        }
        
        if (!segmentoData || !segmentoData.labels) {
            console.warn('[KPI 1] segmentoData vacío o sin labels');
            return;
        }

        // Destruir gráfico anterior si existe
        if (this.charts.segmento) {
            this.charts.segmento.destroy();
            this.charts.segmento = null;
        }

        // Manejar tanto strings como arrays
        const labels = Array.isArray(segmentoData.labels) 
            ? segmentoData.labels 
            : segmentoData.labels.split(' ');
        const values = Array.isArray(segmentoData.tasas)
            ? segmentoData.tasas.map(v => parseFloat(v))
            : segmentoData.tasas.split(' ').map(v => parseFloat(v));
        
        // Aplicar colores dinámicos según umbrales
        const colors = values.map(v => this.getStatusColor(v));
        
        console.log('[KPI 1] Creando gráfico de segmento con', labels.length, 'segmentos');

        this.charts.segmento = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Tasa (%)',
                    data: values,
                    backgroundColor: colors,
                    borderRadius: 8,
                    borderWidth: 3,
                    borderColor: '#ffffff',
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 15,
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                        titleColor: 'white',
                        bodyColor: 'white',
                        cornerRadius: 8,
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.parsed.toFixed(2);
                                return `${label}: ${value}%`;
                            }
                        }
                    }
                }
            }
        });
    }

    createMarcaChart(marcaData) {
        const ctx = document.getElementById('marcaChart');
        if (!ctx) {
            console.warn('[KPI 1] Canvas marcaChart no encontrado');
            return;
        }
        
        if (!marcaData || !marcaData.labels) {
            console.warn('[KPI 1] marcaData vacío o sin labels');
            return;
        }

        // Destruir gráfico anterior si existe
        if (this.charts.marca) {
            this.charts.marca.destroy();
            this.charts.marca = null;
        }

        // Manejar tanto strings como arrays
        const labels = Array.isArray(marcaData.labels) 
            ? marcaData.labels 
            : marcaData.labels.split(' ');
        const values = Array.isArray(marcaData.atipicas)
            ? marcaData.atipicas.map(v => parseInt(v))
            : marcaData.atipicas.split(' ').map(v => parseInt(v));
        
        console.log('[KPI 1] Creando gráfico de marca con', labels.length, 'marcas');

        this.charts.marca = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Porcentaje Estimadas por Marca',
                    data: values,
                    backgroundColor: values.map(val => 
                        val > 10 ? '#ef4444' : val > 5 ? '#f59e0b' : '#10b981'
                    ),
                    borderColor: '#ffffff',
                    borderWidth: 2,
                    borderRadius: 8,
                    borderSkipped: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                        titleColor: 'white',
                        bodyColor: 'white',
                        cornerRadius: 8,
                        callbacks: {
                            label: function(context) {
                                return `${context.parsed.y.toFixed(2)}% estimadas`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(226, 232, 240, 0.5)'
                        },
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    createUbicacionChart(ubicacionData) {
        const ctx = document.getElementById('ubicacionChart');
        if (!ctx) {
            console.warn('[KPI 1] Canvas ubicacionChart no encontrado');
            return;
        }
        
        if (!ubicacionData || !ubicacionData.labels) {
            console.warn('[KPI 1] ubicacionData vacío o sin labels');
            return;
        }

        // Destruir gráfico anterior si existe
        if (this.charts.ubicacion) {
            this.charts.ubicacion.destroy();
            this.charts.ubicacion = null;
        }

        // Manejar tanto strings como arrays
        const labels = Array.isArray(ubicacionData.labels) 
            ? ubicacionData.labels 
            : ubicacionData.labels.split(' ');
        const values = Array.isArray(ubicacionData.valores)
            ? ubicacionData.valores.map(v => parseInt(v))
            : ubicacionData.valores.split(' ').map(v => parseInt(v));
        
        console.log('[KPI 1] Creando gráfico de ubicación con', labels.length, 'ubicaciones');
        console.log('[KPI 1] Datos de ubicación:', {labels, values});

        this.charts.ubicacion = new Chart(ctx, {
            type: 'bar',  // ✅ CORREGIDO: 'bar' en lugar de 'horizontalBar'
            data: {
                labels: labels,
                datasets: [{
                    label: 'Porcentaje por Ubicación',
                    data: values,
                    backgroundColor: values.map(val => 
                        val > 10 ? '#ef4444' : val > 5 ? '#f59e0b' : '#3b82f6'
                    ),
                    borderColor: '#ffffff',
                    borderWidth: 2,
                    borderRadius: 6,
                    borderSkipped: false
                }]
            },
            options: {
                indexAxis: 'y',  // ✅ Esta opción hace que las barras sean horizontales
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                        titleColor: 'white',
                        bodyColor: 'white',
                        cornerRadius: 8,
                        padding: 12,
                        callbacks: {
                            label: function(context) {
                                return `${context.parsed.x.toFixed(2)}% estimadas`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(226, 232, 240, 0.5)',
                            drawBorder: false
                        },
                        ticks: {
                            callback: function(value) {
                                return value.toFixed(1) + '%';
                            },
                            font: {
                                size: 11
                            }
                        }
                    },
                    y: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            font: {
                                size: 11
                            }
                        }
                    }
                }
            }
        });
    }

    createComparativaChart(data) {
        const ctx = document.getElementById('comparativaChart');
        if (!ctx) {
            console.warn('[KPI 1] Canvas comparativaChart no encontrado');
            return;
        }
        
        // Nueva estructura: {atipicas: 7, normales: 74, porcentaje_atipicas: 8.64, porcentaje_normales: 91.36}
        if (!data || data.atipicas === undefined || data.normales === undefined) {
            console.warn('[KPI 1] Datos de comparativa incompletos');
            return;
        }

        // Destruir gráfico anterior si existe
        if (this.charts.comparativa) {
            this.charts.comparativa.destroy();
            this.charts.comparativa = null;
        }

        const totalFacturas = data.atipicas + data.normales;
        if (totalFacturas === 0) {
            console.warn('[KPI 1] Total de facturas es cero');
            return;
        }
        
        const pctAtipicas = data.porcentaje_atipicas;
        const pctNormales = data.porcentaje_normales;
        
        console.log('[KPI 1] Creando gráfico comparativo');
        console.log('[KPI 1] Datos comparativa:', {
            atipicas: data.atipicas,
            normales: data.normales,
            pctAtipicas,
            pctNormales
        });

        this.charts.comparativa = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Facturas Normales', 'Facturas Atípicas'],
                datasets: [{
                    data: [data.normales, data.atipicas],
                    backgroundColor: ['#10b981', '#ef4444'],
                    borderWidth: 3,
                    borderColor: '#ffffff',
                    hoverOffset: 10,
                    hoverBorderWidth: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '60%',  // ✅ Hace el agujero en el centro del doughnut
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true,
                            font: {
                                size: 13,
                                weight: '500'
                            },
                            boxWidth: 12,
                            boxHeight: 12
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(15, 23, 42, 0.95)',
                        titleColor: 'white',
                        bodyColor: 'white',
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                        borderWidth: 1,
                        cornerRadius: 8,
                        padding: 12,
                        displayColors: true,
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.parsed.toFixed(1);
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((context.parsed / total) * 100).toFixed(1);
                                return `${label}: ${value}% (${percentage}% del total)`;
                            }
                        }
                    }
                }
            }
        });
    }

    createPatronesChart(patronesData = null) {
        const ctx = document.getElementById('patronesChart');
        if (!ctx) {
            console.warn('[KPI 1] Canvas patronesChart no encontrado');
            return;
        }

        // Destruir gráfico anterior si existe
        if (this.charts.patrones) {
            this.charts.patrones.destroy();
            this.charts.patrones = null;
        }

        // Usar datos reales o simulados
        let diasSemana, valores;
        
        if (patronesData && patronesData.length > 0) {
            // Datos reales desde el backend
            diasSemana = patronesData.map(item => item.dia);
            valores = patronesData.map(item => item.valor);
            console.log('[KPI 1] Usando patrones semanales REALES');
        } else {
            // Datos simulados como fallback
            diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
            valores = [8.1, 8.3, 8.0, 7.9, 8.4, 8.8, 8.5];
            console.warn('[KPI 1] Usando patrones semanales SIMULADOS');
        }
        
        console.log('[KPI 1] Creando gráfico de patrones');
        console.log('[KPI 1] Datos patrones:', {diasSemana, valores});

        this.charts.patrones = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: diasSemana,
                datasets: [{
                    label: '% Lecturas Estimadas',
                    data: valores,
                    borderColor: '#8b5cf6',
                    backgroundColor: 'rgba(139, 92, 246, 0.2)',  // ✅ Aumenté opacidad
                    borderWidth: 3,  // ✅ Línea más gruesa
                    pointBackgroundColor: '#8b5cf6',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 5,  // ✅ Puntos más grandes
                    pointHoverRadius: 7,
                    pointHoverBackgroundColor: '#7c3aed',
                    pointHoverBorderColor: '#ffffff',
                    pointHoverBorderWidth: 3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,  // ✅ MOSTRAR leyenda
                        position: 'top',
                        labels: {
                            padding: 15,
                            usePointStyle: true,
                            font: {
                                size: 12,
                                weight: '500'
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                        titleColor: 'white',
                        bodyColor: 'white',
                        cornerRadius: 8,
                        padding: 12,
                        displayColors: true,
                        callbacks: {
                            label: function(context) {
                                return `${context.parsed.r.toFixed(2)}% estimadas`;
                            }
                        }
                    }
                },
                scales: {
                    r: {
                        beginAtZero: true,
                        min: 0,
                        max: 10,
                        ticks: {
                            stepSize: 2,  // ✅ Pasos de 2%
                            callback: function(value) {
                                return value.toFixed(0) + '%';
                            },
                            backdropColor: 'transparent',  // ✅ Fondo transparente
                            font: {
                                size: 11
                            }
                        },
                        grid: {
                            color: 'rgba(139, 92, 246, 0.1)',  // ✅ Grid con color del tema
                            lineWidth: 1
                        },
                        angleLines: {
                            color: 'rgba(139, 92, 246, 0.2)',  // ✅ Líneas angulares
                            lineWidth: 1
                        },
                        pointLabels: {
                            font: {
                                size: 12,
                                weight: '500'
                            },
                            color: '#64748b'
                        }
                    }
                }
            }
        });
    }

    updateTrendChart(period) {
        if (!this.analyticsData || !this.analyticsData.tendencia_temporal) return;

        let filteredData = [...this.analyticsData.tendencia_temporal];
        
        switch (period) {
            case '3m':
                filteredData = filteredData.slice(-3);
                break;
            case '6m':
                filteredData = filteredData.slice(-6);
                break;
            case '12m':
            default:
                // Ya están los últimos 12 meses
                break;
        }

        if (this.charts.tendencia) {
            const labels = filteredData.map(item => item.mes);
            const values = filteredData.map(item => item.valor);
            
            this.charts.tendencia.data.labels = labels;
            this.charts.tendencia.data.datasets[0].data = values;
            this.charts.tendencia.data.datasets[1].data = new Array(labels.length).fill(2.0);
            this.charts.tendencia.update('none');
        }
    }

    initializeChartDefaults() {
        Chart.defaults.font.family = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
        Chart.defaults.font.size = 12;
        Chart.defaults.color = '#64748b';
    }

    // Utility functions
    getStatusColor(valor) {
        if (valor <= 2.0) {
            return '#10b981';  // Verde - OK
        } else if (valor <= 3.0) {
            return '#f59e0b';  // Ámbar - Alerta
        } else {
            return '#ef4444';  // Rojo - Crítico
        }
    }

    getStatusText(valor) {
        if (valor <= 2.0) {
            return 'OK';
        } else if (valor <= 3.0) {
            return 'ALERTA';
        } else {
            return 'CRÍTICO';
        }
    }

    renderTopDivergencias(topData) {
        if (!topData || topData.length === 0) {
            console.warn('[KPI 1] No hay datos de top divergencias');
            return;
        }

        // Buscar o crear contenedor
        let container = document.getElementById('topDivergenciasTable');
        if (!container) {
            const section = document.querySelector('.statistics-section') || document.querySelector('.main-content');
            if (section) {
                const newSection = document.createElement('section');
                newSection.className = 'top-divergencias-section';
                newSection.innerHTML = `
                    <div class="section-header">
                        <h3><i class="fas fa-list-ol"></i> Top 10 Clientes con Mayor Divergencia</h3>
                    </div>
                    <div id="topDivergenciasTable"></div>
                `;
                section.parentNode.insertBefore(newSection, section.nextSibling);
                container = document.getElementById('topDivergenciasTable');
            }
        }

        if (!container) {
            console.warn('[KPI 1] No se pudo crear contenedor para tabla');
            return;
        }

        const tableHTML = `
            <table class="data-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Cliente</th>
                        <th>Medidor</th>
                        <th>Facturado (kWh)</th>
                        <th>Medido (kWh)</th>
                        <th>Divergencia</th>
                        <th>Fecha</th>
                    </tr>
                </thead>
                <tbody>
                    ${topData.map((row, idx) => `
                        <tr>
                            <td><strong>${idx + 1}</strong></td>
                            <td>${row.cliente}</td>
                            <td>${row.medidor}</td>
                            <td>${parseFloat(row.facturado).toLocaleString('es-PE', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                            <td>${parseFloat(row.medido).toLocaleString('es-PE', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                            <td>
                                <span class="badge badge-${parseFloat(row.divergencia) >= 100 ? 'danger' : parseFloat(row.divergencia) >= 50 ? 'warning' : 'info'}">
                                    ${parseFloat(row.divergencia).toFixed(1)}%
                                </span>
                            </td>
                            <td>${row.fecha || 'N/A'}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;

        container.innerHTML = tableHTML;
        console.log('[KPI 1] ✅ Tabla de top divergencias renderizada');
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
        console.error('KPI 1 Error:', message);
        
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
        `;
        
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            if (errorDiv.parentElement) {
                errorDiv.remove();
            }
        }, 5000);
    }
}

// Inicializar el dashboard KPI 1
document.addEventListener('DOMContentLoaded', () => {
    window.kpi1Dashboard = new KPI1Dashboard();
});