class KPI3Dashboard {
    constructor() {
        this.charts = {};
        this.currentData = null;
        this.init();
    }

    init() {
        this.loadData();
        this.setupEventListeners();
    }

    setupEventListeners() {
        const refreshBtn = document.getElementById('refreshDataKPI3');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.loadData());
        }
    }

    async loadData() {
        try {
            console.log('[KPI3] Iniciando carga de datos...');
            this.showLoading(true);
            
            const response = await fetch('/api/kpi3/analytics');
            console.log('[KPI3] Response status:', response.status);
            
            if (!response.ok) throw new Error('Error al cargar datos');
            
            const data = await response.json();
            console.log('[KPI3] Datos recibidos:', data);
            console.log('[KPI3] KPI Principal:', data.kpi_principal);
            
            this.currentData = data;
            this.updateDashboard(data);
            this.showLoading(false);
            
            console.log('[KPI3] Dashboard actualizado correctamente');
        } catch (error) {
            console.error('[KPI3] Error:', error);
            console.error('[KPI3] Error stack:', error.stack);
            this.showError('Error al cargar los datos del KPI 3');
            this.showLoading(false);
        }
    }

    updateDashboard(data) {
        console.log('[KPI3] Actualizando dashboard...');
        
        try {
            console.log('[KPI3] Actualizando métricas...');
            this.updateMetrics(data.kpi_principal);
            
            console.log('[KPI3] Actualizando estadísticas...');
            this.updateStatistics(data.estadisticas, data.kpi_principal);
            
            console.log('[KPI3] Creando gráfico de tendencia...');
            this.createTendenciaChart(data.tendencia_mensual);
            
            console.log('[KPI3] Creando gráfico de motivos...');
            this.createMotivosChart(data.distribucion_motivos);
            
            console.log('[KPI3] Creando gráfico de ubicaciones...');
            this.createUbicacionesChart(data.top_ubicaciones);
            
            console.log('[KPI3] Creando gráfico de marca...');
            this.createMarcaChart(data.analisis_marca);
            
            console.log('[KPI3] Creando gráfico de contratistas...');
            this.createContratistaChart(data.analisis_contratista);
            
            console.log('[KPI3] Creando gráfico de patrones...');
            this.createPatronesChart(data.patrones_semanales);
            
            console.log('[KPI3] Dashboard completado');
        } catch (error) {
            console.error('[KPI3] Error en updateDashboard:', error);
            throw error;
        }
    }

    updateMetrics(kpiData) {
        console.log('[KPI3] updateMetrics - kpiData:', kpiData);
        
        // Métrica principal
        const valorElement = document.querySelector('#valorPrincipalKPI3 .value');
        console.log('[KPI3] valorElement:', valorElement);
        if (valorElement) {
            valorElement.textContent = kpiData.valor.toFixed(2);
            valorElement.parentElement.className = `metric-value ${this.getColorClass(kpiData.valor)}`;
            console.log('[KPI3] Valor actualizado:', kpiData.valor);
        } else {
            console.warn('[KPI3] No se encontró #valorPrincipalKPI3 .value');
        }

        // Números estimadas/reales
        const estimadasEl = document.getElementById('numEstimadas');
        if (estimadasEl) {
            estimadasEl.textContent = `Estimadas: ${kpiData.lecturas_estimadas.toLocaleString('es-PE')}`;
        }
        
        const realesEl = document.getElementById('numReales');
        if (realesEl) {
            realesEl.textContent = `Reales: ${kpiData.lecturas_reales.toLocaleString('es-PE')}`;
        }

        // Total facturas
        const totalEl = document.getElementById('totalFacturas');
        if (totalEl) {
            totalEl.textContent = kpiData.total_facturas.toLocaleString('es-PE');
        }

        // Estado meta
        const estadoEl = document.getElementById('estadoMeta');
        const estadoTextoEl = document.getElementById('estadoMetaTexto');
        if (estadoEl) {
            estadoEl.textContent = kpiData.cumple_meta ? '✓ Cumple' : '✗ No Cumple';
            estadoEl.className = `metric-value ${kpiData.cumple_meta ? 'text-success' : 'text-danger'}`;
        }
        if (estadoTextoEl) {
            estadoTextoEl.textContent = `Meta: ≤ 5.0%`;
        }

        // Valor actual en header
        const currentValueEl = document.getElementById('currentValue');
        if (currentValueEl) {
            currentValueEl.textContent = `${kpiData.valor.toFixed(2)}%`;
        }

        // Badge de estado
        const statusBadgeEl = document.getElementById('statusBadge');
        if (statusBadgeEl) {
            statusBadgeEl.textContent = kpiData.cumple_meta ? 'Cumple' : 'No Cumple';
            statusBadgeEl.className = `status-badge ${kpiData.cumple_meta ? 'success' : 'danger'}`;
        }

        // Porcentaje reales
        const porcentajeRealesEl = document.getElementById('porcentajeReales');
        if (porcentajeRealesEl) {
            porcentajeRealesEl.textContent = `${kpiData.porcentaje_reales.toFixed(2)}%`;
        }
    }

    updateStatistics(stats, kpiData) {
        // Motivo principal
        const motivoEl = document.getElementById('motivoPrincipal');
        if (motivoEl && stats.motivo_principal) {
            motivoEl.textContent = stats.motivo_principal;
        }

        // Zona crítica
        const zonaEl = document.getElementById('zonaCritica');
        if (zonaEl && stats.zona_critica) {
            zonaEl.textContent = stats.zona_critica;
        }

        // Día con más estimadas
        const diaEl = document.getElementById('diaMaxEstimadas');
        if (diaEl && stats.dia_con_mas_estimadas) {
            diaEl.textContent = stats.dia_con_mas_estimadas;
        }
    }

    getColorClass(value) {
        if (value <= 5.0) return 'text-success';
        if (value <= 7.0) return 'text-warning';
        return 'text-danger';
    }

    createTendenciaChart(data) {
        const ctx = document.getElementById('tendenciaChartKPI3');
        if (!ctx || !data || !data.labels || data.labels.length === 0) return;

        if (this.charts.tendencia) this.charts.tendencia.destroy();

        this.charts.tendencia = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [{
                    label: '% Estimadas',
                    data: data.valores,
                    borderColor: 'rgb(75, 192, 192)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    tension: 0.1
                }, {
                    label: 'Meta (5%)',
                    data: data.labels.map(() => 5.0),
                    borderColor: 'rgb(255, 99, 132)',
                    borderDash: [5, 5],
                    fill: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'top' },
                    title: {
                        display: true,
                        text: 'Tendencia Mensual - Lecturas Estimadas'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: { display: true, text: 'Porcentaje (%)' }
                    }
                }
            }
        });
    }

    createMotivosChart(data) {
        const ctx = document.getElementById('motivosChartKPI3');
        if (!ctx || !data || !data.labels || data.labels.length === 0) return;

        if (this.charts.motivos) this.charts.motivos.destroy();

        this.charts.motivos = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: data.labels,
                datasets: [{
                    data: data.valores,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.7)',
                        'rgba(54, 162, 235, 0.7)',
                        'rgba(255, 206, 86, 0.7)',
                        'rgba(75, 192, 192, 0.7)',
                        'rgba(153, 102, 255, 0.7)'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'right' },
                    title: {
                        display: true,
                        text: 'Distribución por Motivo de Estimación'
                    }
                }
            }
        });
    }

    createUbicacionesChart(data) {
        const ctx = document.getElementById('ubicacionesChartKPI3');
        if (!ctx || !data || !data.labels || data.labels.length === 0) return;

        if (this.charts.ubicaciones) this.charts.ubicaciones.destroy();

        this.charts.ubicaciones = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Cantidad Estimadas',
                    data: data.valores,
                    backgroundColor: 'rgba(54, 162, 235, 0.7)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y',
                plugins: {
                    legend: { display: false },
                    title: {
                        display: true,
                        text: 'Top 10 Ubicaciones con Más Lecturas Estimadas'
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        title: { display: true, text: 'Cantidad' }
                    }
                }
            }
        });
    }

    createMarcaChart(data) {
        const ctx = document.getElementById('marcaChartKPI3');
        if (!ctx || !data || !data.labels || data.labels.length === 0) return;

        if (this.charts.marca) this.charts.marca.destroy();

        this.charts.marca = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Lecturas Reales',
                    data: data.reales,
                    backgroundColor: 'rgba(75, 192, 192, 0.7)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }, {
                    label: 'Lecturas Estimadas',
                    data: data.estimadas,
                    backgroundColor: 'rgba(255, 99, 132, 0.7)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'top' },
                    title: {
                        display: true,
                        text: 'Análisis por Marca de Medidor'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: { display: true, text: 'Cantidad' }
                    }
                }
            }
        });
    }

    createContratistaChart(data) {
        const ctx = document.getElementById('contratistaChartKPI3');
        if (!ctx || !data || !data.labels || data.labels.length === 0) return;

        if (this.charts.contratista) this.charts.contratista.destroy();

        this.charts.contratista = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.labels.map(c => `Contratista ${c}`),
                datasets: [{
                    label: '% Estimadas',
                    data: data.valores,
                    backgroundColor: data.valores.map(v => {
                        if (v <= 5.0) return 'rgba(75, 192, 192, 0.7)';
                        if (v <= 7.0) return 'rgba(255, 206, 86, 0.7)';
                        return 'rgba(255, 99, 132, 0.7)';
                    }),
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    title: {
                        display: true,
                        text: 'Desempeño por Contratista'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: { display: true, text: 'Porcentaje (%)' }
                    }
                }
            }
        });
    }

    createPatronesChart(data) {
        const ctx = document.getElementById('patronesChartKPI3');
        if (!ctx || !data || !data.labels || data.labels.length === 0) return;

        if (this.charts.patrones) this.charts.patrones.destroy();

        this.charts.patrones = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.labels,
                datasets: [{
                    label: '% Estimadas',
                    data: data.valores,
                    backgroundColor: 'rgba(153, 102, 255, 0.7)',
                    borderColor: 'rgba(153, 102, 255, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    title: {
                        display: true,
                        text: 'Patrones por Día de la Semana'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: { display: true, text: 'Porcentaje (%)' }
                    }
                }
            }
        });
    }

    showLoading(show) {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.classList.toggle('hidden', !show);
        }
    }

    showError(message) {
        console.error(message);
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.classList.add('hidden');
        }
        alert(message);
    }

    downloadChart(chartName) {
        if (this.charts[chartName]) {
            const url = this.charts[chartName].toBase64Image();
            const link = document.createElement('a');
            link.download = `kpi3_${chartName}.png`;
            link.href = url;
            link.click();
        }
    }

    showChartInfo(chartType) {
        const modal = document.getElementById('chartInfoModal');
        const modalBody = document.getElementById('modalBody');
        
        const chartInfoContent = {
            'tendencia': {
                title: 'Evolución Mensual de Lecturas Estimadas',
                description: 'Muestra la tendencia histórica del porcentaje de lecturas estimadas en los últimos 12 meses.',
                businessValue: 'Permite identificar patrones temporales y evaluar si las acciones correctivas están reduciendo las lecturas estimadas.',
                insights: [
                    'Detectar tendencias crecientes o decrecientes en lecturas estimadas',
                    'Identificar meses con picos anormales que requieren investigación',
                    'Evaluar el cumplimiento de la meta del 5% a lo largo del tiempo',
                    'Medir el impacto de iniciativas de mejora implementadas'
                ],
                actions: [
                    'Si la tendencia es creciente: revisar causas raíz y planificar acciones correctivas',
                    'Si hay picos: investigar eventos específicos (clima, fallas, huelgas)',
                    'Establecer alertas tempranas cuando se aproxime al límite del 5%'
                ]
            },
            'motivos': {
                title: 'Distribución por Motivo de Estimación',
                description: 'Muestra la proporción de cada causa que genera lecturas estimadas.',
                businessValue: 'Identifica las causas raíz principales para priorizar acciones correctivas y asignar recursos eficientemente.',
                insights: [
                    'Determinar cuál es la causa más frecuente de lecturas estimadas',
                    'Entender si el problema es operativo, técnico o de acceso',
                    'Cuantificar el impacto de cada motivo para priorizar soluciones',
                    'Identificar si medidores ficticios son un problema significativo'
                ],
                actions: [
                    'Sin lectura terreno: mejorar coordinación con clientes para acceso',
                    'Medidor ficticio: regularizar instalaciones pendientes',
                    'Observaciones estimadas: revisar procesos de validación de lecturas'
                ]
            },
            'ubicaciones': {
                title: 'Top 10 Zonas con Más Lecturas Estimadas',
                description: 'Identifica las zonas geográficas con mayor cantidad de lecturas estimadas.',
                businessValue: 'Permite focalizar esfuerzos operativos en áreas críticas y optimizar rutas de lectura.',
                insights: [
                    'Identificar zonas con problemas sistemáticos de acceso',
                    'Detectar áreas que requieren intervención prioritaria',
                    'Evaluar si hay concentración geográfica del problema',
                    'Correlacionar con factores externos (seguridad, infraestructura)'
                ],
                actions: [
                    'Implementar estrategias específicas por zona (horarios alternativos, coordinación con autoridades)',
                    'Evaluar tecnologías de lectura remota (AMI/AMR) en zonas críticas',
                    'Asignar recursos adicionales o contratistas especializados'
                ]
            },
            'marca': {
                title: 'Análisis por Marca de Medidor',
                description: 'Compara el desempeño de diferentes marcas de medidores en cuanto a lecturas estimadas vs reales.',
                businessValue: 'Permite evaluar la calidad y confiabilidad de equipos para futuras adquisiciones.',
                insights: [
                    'Identificar marcas con mayor proporción de lecturas estimadas',
                    'Detectar problemas técnicos recurrentes por fabricante',
                    'Evaluar el ROI de diferentes marcas de medidores',
                    'Fundamentar decisiones de compra basadas en datos'
                ],
                actions: [
                    'Revisar contratos con fabricantes de marcas problemáticas',
                    'Priorizar reemplazo de medidores de marcas con mal desempeño',
                    'Considerar estos datos en futuras licitaciones de medidores'
                ]
            },
            'contratista': {
                title: 'Desempeño por Contratista',
                description: 'Evalúa el porcentaje de lecturas estimadas generadas por cada contratista de lectura.',
                businessValue: 'Permite evaluar la calidad del servicio de contratistas y tomar decisiones sobre renovaciones contractuales.',
                insights: [
                    'Identificar contratistas con bajo desempeño en lectura',
                    'Detectar necesidades de capacitación o supervisión',
                    'Comparar eficiencia operativa entre proveedores',
                    'Fundamentar renovaciones o terminaciones contractuales'
                ],
                actions: [
                    'Contratistas >7%: plan de mejora inmediato o penalizaciones',
                    'Contratistas 5-7%: capacitación y supervisión reforzada',
                    'Contratistas <5%: reconocimiento y mejores prácticas compartidas',
                    'Revisar SLAs y ajustar incentivos por desempeño'
                ]
            },
            'patrones': {
                title: 'Patrones por Día de la Semana',
                description: 'Muestra si existen patrones de lecturas estimadas según el día de lectura.',
                businessValue: 'Optimiza la planificación de rutas y recursos según patrones temporales identificados.',
                insights: [
                    'Detectar días con mayor dificultad para obtener lecturas reales',
                    'Identificar si fines de semana tienen más problemas de acceso',
                    'Evaluar si el calendario laboral afecta la calidad de lectura',
                    'Optimizar asignación de recursos según día de la semana'
                ],
                actions: [
                    'Ajustar horarios de lectura en días problemáticos',
                    'Reforzar equipos en días con mayor dificultad de acceso',
                    'Implementar estrategias de coordinación preventiva con clientes',
                    'Considerar lectura remota en áreas con patrones adversos'
                ]
            }
        };

        const info = chartInfoContent[chartType];
        if (!info) return;

        modalBody.innerHTML = `
            <div class="modal-section">
                <h4><i class="fas fa-chart-bar"></i> Descripción</h4>
                <p>${info.description}</p>
            </div>

            <div class="business-value">
                <h5><i class="fas fa-lightbulb"></i> Valor de Negocio</h5>
                <p>${info.businessValue}</p>
            </div>

            <div class="modal-section">
                <h4><i class="fas fa-search"></i> Insights Clave</h4>
                <ul>
                    ${info.insights.map(insight => `<li>${insight}</li>`).join('')}
                </ul>
            </div>

            <div class="modal-section">
                <h4><i class="fas fa-tasks"></i> Acciones Recomendadas</h4>
                <ul>
                    ${info.actions.map(action => `<li>${action}</li>`).join('')}
                </ul>
            </div>
        `;

        modal.classList.add('active');
    }

    closeModal() {
        const modal = document.getElementById('chartInfoModal');
        modal.classList.remove('active');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.kpi3Dashboard = new KPI3Dashboard();
});
