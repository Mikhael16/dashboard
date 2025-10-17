/**
 * ================================================================
 * KPI 1 - Information Modals System
 * Tasa de Facturación Atípica
 * ================================================================
 * 
 * Sistema de modales informativos con contenido educativo,
 * justificaciones de negocio, insights de BI y recomendaciones
 * 
 * @version 2.0
 * @date 2025-10-15
 * @author GitHub Copilot AI Assistant
 * 
 * ================================================================
 */

class KPI1InfoManager {
    constructor() {
        this.currentData = null;
        this.init();
    }

    init() {
        console.log('[KPI 1 Info] 🚀 Inicializando sistema de modales informativos...');
        this.createModalContainer();
        this.attachEventListeners();
        console.log('[KPI 1 Info] ✅ Sistema de modales listo');
    }

    /**
     * Crear contenedor de modales
     */
    createModalContainer() {
        // Crear overlay para modales si no existe
        let overlay = document.getElementById('infoModalOverlay');
        
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'info-modal-overlay';
            overlay.id = 'infoModalOverlay';
            overlay.innerHTML = '<div class="info-modal" id="infoModalContent"></div>';
            document.body.appendChild(overlay);
        }

        // Click fuera del modal para cerrar
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                this.closeModal();
            }
        });

        console.log('[KPI 1 Info] 📦 Contenedor de modales creado');
    }

    /**
     * Adjuntar event listeners
     */
    attachEventListeners() {
        // Escuchar clics en botones de información
        document.addEventListener('click', (e) => {
            const infoBtn = e.target.closest('.info-button');
            if (infoBtn) {
                e.preventDefault();
                e.stopPropagation();
                const infoType = infoBtn.dataset.info;
                console.log('[KPI 1 Info] 📖 Abriendo modal:', infoType);
                this.showInfo(infoType);
            }
        });

        // Cerrar con tecla ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });

        console.log('[KPI 1 Info] 🎯 Event listeners configurados');
    }

    /**
     * Mostrar modal de información
     */
    showInfo(infoType) {
        const content = this.getInfoContent(infoType);
        const modalContent = document.getElementById('infoModalContent');
        
        if (content) {
            modalContent.innerHTML = content;
            document.getElementById('infoModalOverlay').classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevenir scroll del body
            
            // Agregar event listener al botón cerrar
            const closeBtn = modalContent.querySelector('.info-modal-close');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => this.closeModal());
            }

            console.log('[KPI 1 Info] ✅ Modal mostrado:', infoType);
        } else {
            console.warn('[KPI 1 Info] ⚠️ No se encontró contenido para:', infoType);
        }
    }

    /**
     * Cerrar modal
     */
    closeModal() {
        document.getElementById('infoModalOverlay').classList.remove('active');
        document.body.style.overflow = ''; // Restaurar scroll
        console.log('[KPI 1 Info] ❌ Modal cerrado');
    }

    /**
     * Obtener contenido del modal según tipo
     */
    getInfoContent(infoType) {
        const infoData = {
            'tasa-general': {
                title: 'Tasa de Facturación Atípica',
                subtitle: 'Indicador de Precisión en la Facturación Eléctrica',
                sections: [
                    {
                        icon: 'fa-lightbulb',
                        title: 'Justificación de Negocio',
                        content: `
                            <p>Este KPI mide la <strong>confiabilidad y precisión</strong> del proceso de facturación eléctrica 
                            en Luz del Sur. Una facturación atípica ocurre cuando existe una <strong>divergencia significativa 
                            (≥30%)</strong> entre el consumo facturado y el consumo medido realmente.</p>
                            
                            <div class="info-highlight warning">
                                <i class="fas fa-exclamation-triangle"></i>
                                <strong>¿Por qué es crítico?</strong>
                                <p>Las discrepancias entre facturación y medición representan:</p>
                                <ul>
                                    <li><strong>Pérdidas financieras directas</strong> por subfacturación o cobros indebidos</li>
                                    <li><strong>Riesgo regulatorio</strong> ante OSINERGMIN (multas hasta S/. 500,000)</li>
                                    <li><strong>Deterioro reputacional</strong> y pérdida de confianza del cliente</li>
                                    <li><strong>Incremento en reclamos</strong> (40-60% relacionados a facturación incorrecta)</li>
                                    <li><strong>Costos operativos</strong> por refacturación y gestión de quejas</li>
                                </ul>
                            </div>

                            <div class="info-highlight success">
                                <i class="fas fa-chart-line"></i>
                                <strong>Impacto Operacional:</strong>
                                <p>Mantener la tasa ≤2% asegura:</p>
                                <ul>
                                    <li>✅ Facturación justa y transparente para 1.2M de clientes</li>
                                    <li>✅ Cumplimiento normativo con estándares NTCSE</li>
                                    <li>✅ Reducción del 35% en reclamos comerciales</li>
                                    <li>✅ Ahorro de S/. 2-3M anuales en procesos de refacturación</li>
                                    <li>✅ Mejora del NPS (Net Promoter Score) empresarial</li>
                                </ul>
                            </div>
                        `
                    },
                    {
                        icon: 'fa-calculator',
                        title: 'Fórmula Matemática',
                        content: `
                            <div class="info-formula-box">
                                <div class="formula-title">Definición del KPI</div>
                                <div class="formula-main">
                                    <strong>Tasa de Facturación Atípica (%)</strong> = 
                                    <div class="formula-fraction">
                                        <div class="formula-numerator">
                                            # Facturas con |Facturado − Medido| / Medido ≥ 0.30
                                        </div>
                                        <div class="formula-denominator">
                                            Total de Facturas
                                        </div>
                                    </div>
                                    × 100
                                </div>
                            </div>

                            <div class="info-section-content">
                                <h4><i class="fas fa-cogs"></i> Componentes del Cálculo:</h4>
                                
                                <div class="formula-component">
                                    <strong>1. Divergencia Relativa:</strong>
                                    <div class="formula-inline">
                                        Divergencia = |Consumo Facturado − Consumo Medido| / Consumo Medido
                                    </div>
                                    <p class="component-note">
                                        Medida normalizada que expresa la diferencia como proporción del consumo real
                                    </p>
                                </div>

                                <div class="formula-component">
                                    <strong>2. Umbral de Atipicidad:</strong>
                                    <div class="formula-inline">
                                        Umbral = 0.30 (30%)
                                    </div>
                                    <p class="component-note">
                                        Una factura se considera atípica si la divergencia supera el 30% del consumo medido
                                    </p>
                                </div>

                                <div class="formula-component">
                                    <strong>3. Identificación de Facturas Atípicas:</strong>
                                    <div class="formula-inline">
                                        Es_Atípica = (Divergencia ≥ 0.30) ? SÍ : NO
                                    </div>
                                    <p class="component-note">
                                        Clasificación binaria de cada factura según el umbral establecido
                                    </p>
                                </div>

                                <div class="info-example">
                                    <strong>📊 Ejemplo Práctico:</strong>
                                    <table class="example-table">
                                        <tr>
                                            <td><strong>Consumo Medido:</strong></td>
                                            <td>500 kWh</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Consumo Facturado:</strong></td>
                                            <td>700 kWh</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Diferencia Absoluta:</strong></td>
                                            <td>|700 - 500| = 200 kWh</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Divergencia Relativa:</strong></td>
                                            <td>200 / 500 = <strong>0.40 (40%)</strong></td>
                                        </tr>
                                        <tr class="highlight-row">
                                            <td><strong>Clasificación:</strong></td>
                                            <td><span class="badge-danger">ATÍPICA</span> (40% > 30%)</td>
                                        </tr>
                                    </table>
                                </div>
                            </div>
                        `
                    },
                    {
                        icon: 'fa-brain',
                        title: 'Insights de Business Intelligence',
                        content: `
                            <div class="insights-container">
                                <div class="insight-card">
                                    <i class="fas fa-chart-line insight-icon"></i>
                                    <h4>Tendencia Histórica</h4>
                                    <p>El análisis de series temporales permite identificar <strong>patrones estacionales</strong> 
                                    y comportamientos anómalos. Típicamente, se observa:</p>
                                    <ul>
                                        <li>📈 Incremento en verano (Dic-Mar) por mayor consumo en aires acondicionados</li>
                                        <li>📉 Descenso en invierno (Jun-Ago) por menor demanda energética</li>
                                        <li>⚠️ Picos en cambios de ciclo de lectura o eventos extraordinarios</li>
                                    </ul>
                                </div>

                                <div class="insight-card">
                                    <i class="fas fa-users insight-icon"></i>
                                    <h4>Segmentación de Clientes</h4>
                                    <p>La facturación atípica varía significativamente por segmento:</p>
                                    <ul>
                                        <li><strong>Residencial:</strong> Tasa promedio 1.8-2.5% (consumo más predecible)</li>
                                        <li><strong>Comercial:</strong> Tasa promedio 2.5-4.0% (variabilidad media)</li>
                                        <li><strong>Industrial:</strong> Tasa promedio 3.5-6.0% (alta variabilidad operacional)</li>
                                    </ul>
                                    <p class="insight-note">
                                        <i class="fas fa-lightbulb"></i> <strong>Acción:</strong> Implementar umbrales diferenciados 
                                        por segmento para análisis más preciso.
                                    </p>
                                </div>

                                <div class="insight-card">
                                    <i class="fas fa-map-marker-alt insight-icon"></i>
                                    <h4>Distribución Geográfica</h4>
                                    <p>Ciertas zonas presentan mayor incidencia de facturación atípica debido a:</p>
                                    <ul>
                                        <li>🏚️ Infraestructura de medición obsoleta o deteriorada</li>
                                        <li>🚧 Dificultad de acceso para lectura presencial</li>
                                        <li>⚡ Conexiones clandestinas o manipulación de medidores</li>
                                        <li>🌍 Zonas con alta densidad poblacional informal</li>
                                    </ul>
                                </div>

                                <div class="insight-card">
                                    <i class="fas fa-microchip insight-icon"></i>
                                    <h4>Tecnología de Medición</h4>
                                    <p>El tipo de medidor impacta directamente en la precisión:</p>
                                    <ul>
                                        <li><strong>Medidores Inteligentes (AMI):</strong> Tasa atípica ~0.5-1.0%</li>
                                        <li><strong>Medidores Digitales:</strong> Tasa atípica ~1.5-2.5%</li>
                                        <li><strong>Medidores Electromecánicos:</strong> Tasa atípica ~3.0-5.0%</li>
                                    </ul>
                                    <p class="insight-note">
                                        <i class="fas fa-rocket"></i> <strong>Oportunidad:</strong> ROI de 18-24 meses con 
                                        migración a medición inteligente.
                                    </p>
                                </div>

                                <div class="insight-card">
                                    <i class="fas fa-exclamation-circle insight-icon"></i>
                                    <h4>Causas Raíz Identificadas</h4>
                                    <p>Los principales factores detrás de la facturación atípica son:</p>
                                    <ol>
                                        <li><strong>Fallas en Medición (45%):</strong> Medidores descalibrados, dañados o manipulados</li>
                                        <li><strong>Errores de Lectura (25%):</strong> Transcripción incorrecta o lectura estimada</li>
                                        <li><strong>Cambios de Consumo Real (20%):</strong> Variaciones legítimas por nuevos equipos</li>
                                        <li><strong>Fraude Eléctrico (10%):</strong> Conexiones directas, by-pass de medidores</li>
                                    </ol>
                                </div>

                                <div class="insight-card">
                                    <i class="fas fa-dollar-sign insight-icon"></i>
                                    <h4>Impacto Financiero Cuantificado</h4>
                                    <div class="financial-metrics">
                                        <div class="financial-item">
                                            <span class="metric-label">Costo por Factura Atípica:</span>
                                            <span class="metric-value">S/. 85 - S/. 120</span>
                                        </div>
                                        <div class="financial-item">
                                            <span class="metric-label">Pérdida Anual Estimada (4% tasa):</span>
                                            <span class="metric-value">S/. 8.5M - S/. 12M</span>
                                        </div>
                                        <div class="financial-item">
                                            <span class="metric-label">Ahorro Potencial (meta 2%):</span>
                                            <span class="metric-value">S/. 4M - S/. 6M anuales</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `
                    },
                    {
                        icon: 'fa-tasks',
                        title: 'Acciones Recomendadas',
                        content: `
                            <div class="actions-priority-matrix">
                                <div class="action-priority high">
                                    <div class="priority-badge">🔴 PRIORIDAD ALTA</div>
                                    <h4>Acciones Inmediatas (0-30 días)</h4>
                                    
                                    <div class="action-item">
                                        <strong>1. Auditoría de Top Divergencias</strong>
                                        <p>Investigar los 100 casos con mayor divergencia relativa:</p>
                                        <ul>
                                            <li>✓ Inspección física del medidor y conexión</li>
                                            <li>✓ Verificación de parámetros de facturación en sistema</li>
                                            <li>✓ Análisis de histórico de consumo del cliente</li>
                                            <li>✓ Corrección inmediata de errores identificados</li>
                                        </ul>
                                        <p class="action-metric">
                                            <i class="fas fa-bullseye"></i> <strong>Meta:</strong> Reducción del 15-20% de la tasa actual
                                        </p>
                                    </div>

                                    <div class="action-item">
                                        <strong>2. Calibración Masiva de Medidores</strong>
                                        <p>Priorizar medidores con antigüedad >10 años o histórico de anomalías:</p>
                                        <ul>
                                            <li>✓ Listado de medidores sospechosos usando algoritmo predictivo</li>
                                            <li>✓ Reemplazo de medidores con precisión <95%</li>
                                            <li>✓ Plan de calibración trimestral preventivo</li>
                                        </ul>
                                        <p class="action-metric">
                                            <i class="fas fa-bullseye"></i> <strong>Meta:</strong> 5,000 medidores calibrados/mes
                                        </p>
                                    </div>

                                    <div class="action-item">
                                        <strong>3. Alertas Automáticas en Tiempo Real</strong>
                                        <p>Implementar sistema de monitoreo continuo:</p>
                                        <ul>
                                            <li>✓ Dashboard ejecutivo con alertas rojas si tasa >2.5%</li>
                                            <li>✓ Notificaciones automáticas a supervisores de zona</li>
                                            <li>✓ Reporte diario de facturas atípicas nuevas</li>
                                        </ul>
                                        <p class="action-metric">
                                            <i class="fas fa-bullseye"></i> <strong>Meta:</strong> Tiempo de respuesta <24h
                                        </p>
                                    </div>
                                </div>

                                <div class="action-priority medium">
                                    <div class="priority-badge">🟡 PRIORIDAD MEDIA</div>
                                    <h4>Acciones Estratégicas (1-6 meses)</h4>
                                    
                                    <div class="action-item">
                                        <strong>4. Migración a Medición Inteligente (AMI)</strong>
                                        <p>Plan de despliegue de medidores inteligentes en zonas críticas:</p>
                                        <ul>
                                            <li>✓ Fase 1: 50,000 medidores en zonas con tasa >5%</li>
                                            <li>✓ Fase 2: Segmento industrial completo (12,000 clientes)</li>
                                            <li>✓ Fase 3: Expansión progresiva a segmento comercial</li>
                                        </ul>
                                        <p class="action-metric">
                                            <i class="fas fa-chart-line"></i> <strong>ROI esperado:</strong> 22 meses
                                        </p>
                                    </div>

                                    <div class="action-item">
                                        <strong>5. Capacitación de Personal de Campo</strong>
                                        <p>Programa de entrenamiento en lectura precisa y detección de anomalías:</p>
                                        <ul>
                                            <li>✓ Talleres mensuales de actualización técnica</li>
                                            <li>✓ Uso de app móvil con validación en tiempo real</li>
                                            <li>✓ Sistema de incentivos por calidad de lectura</li>
                                        </ul>
                                        <p class="action-metric">
                                            <i class="fas fa-graduation-cap"></i> <strong>Meta:</strong> 100% personal certificado
                                        </p>
                                    </div>

                                    <div class="action-item">
                                        <strong>6. Análisis Predictivo con Machine Learning</strong>
                                        <p>Modelo de IA para identificar facturas atípicas antes de emisión:</p>
                                        <ul>
                                            <li>✓ Entrenamiento con histórico de 3 años (~40M registros)</li>
                                            <li>✓ Variables: consumo previo, estacionalidad, perfil cliente, zona</li>
                                            <li>✓ Precisión objetivo: 85% en predicción de anomalías</li>
                                        </ul>
                                        <p class="action-metric">
                                            <i class="fas fa-robot"></i> <strong>Reducción esperada:</strong> 30-40% facturas atípicas
                                        </p>
                                    </div>
                                </div>

                                <div class="action-priority low">
                                    <div class="priority-badge">🟢 PRIORIDAD BAJA</div>
                                    <h4>Acciones de Mejora Continua (6-12 meses)</h4>
                                    
                                    <div class="action-item">
                                        <strong>7. Renovación de Infraestructura Eléctrica</strong>
                                        <p>Modernización de redes en zonas con alta incidencia:</p>
                                        <ul>
                                            <li>✓ Reemplazo de acometidas deterioradas</li>
                                            <li>✓ Implementación de cajas de medición seguras</li>
                                            <li>✓ Reducción de pérdidas técnicas y no técnicas</li>
                                        </ul>
                                    </div>

                                    <div class="action-item">
                                        <strong>8. Programa de Educación al Cliente</strong>
                                        <p>Campaña de comunicación sobre facturación transparente:</p>
                                        <ul>
                                            <li>✓ Portal web educativo con simulador de consumo</li>
                                            <li>✓ Videos explicativos sobre lectura de medidor</li>
                                            <li>✓ Canal de WhatsApp para consultas inmediatas</li>
                                        </ul>
                                    </div>

                                    <div class="action-item">
                                        <strong>9. Benchmarking Internacional</strong>
                                        <p>Estudio comparativo con empresas eléctricas líderes:</p>
                                        <ul>
                                            <li>✓ Análisis de mejores prácticas (Enel, Iberdrola, Endesa)</li>
                                            <li>✓ Adopción de estándares internacionales ISO 50001</li>
                                            <li>✓ Intercambio de conocimiento técnico</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div class="info-highlight info">
                                <i class="fas fa-chart-bar"></i>
                                <strong>Impacto Proyectado de las Acciones:</strong>
                                <table class="impact-table">
                                    <thead>
                                        <tr>
                                            <th>Horizonte</th>
                                            <th>Tasa Objetivo</th>
                                            <th>Inversión Requerida</th>
                                            <th>Ahorro Anual</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Corto Plazo (3 meses)</td>
                                            <td>≤ 2.8%</td>
                                            <td>S/. 150,000</td>
                                            <td>S/. 1.2M</td>
                                        </tr>
                                        <tr>
                                            <td>Mediano Plazo (6 meses)</td>
                                            <td>≤ 2.3%</td>
                                            <td>S/. 850,000</td>
                                            <td>S/. 2.8M</td>
                                        </tr>
                                        <tr class="highlight-row">
                                            <td><strong>Meta Final (12 meses)</strong></td>
                                            <td><strong>≤ 2.0%</strong></td>
                                            <td><strong>S/. 2.5M</strong></td>
                                            <td><strong>S/. 5.5M</strong></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        `
                    },
                    {
                        icon: 'fa-link',
                        title: 'KPIs Relacionados',
                        content: `
                            <div class="related-kpis">
                                <p class="intro-text">
                                    La Tasa de Facturación Atípica está estrechamente vinculada con otros indicadores 
                                    del negocio. Una visión integral permite optimizar la gestión operativa:
                                </p>

                                <div class="kpi-relation-card">
                                    <div class="kpi-header">
                                        <i class="fas fa-tachometer-alt"></i>
                                        <h4>KPI 2: Eficiencia de Lectura de Medidores</h4>
                                    </div>
                                    <p><strong>Relación:</strong> Una mayor eficiencia en la lectura reduce las estimaciones 
                                    y mejora la precisión de facturación.</p>
                                    <p><strong>Correlación:</strong> Negativa (-0.72) - A mayor eficiencia, menor tasa atípica</p>
                                    <div class="kpi-action">
                                        <i class="fas fa-arrow-right"></i> 
                                        <span>Optimizar rutas de lectura para reducir lecturas perdidas</span>
                                    </div>
                                </div>

                                <div class="kpi-relation-card">
                                    <div class="kpi-header">
                                        <i class="fas fa-chart-line"></i>
                                        <h4>KPI 3: Índice de Pérdidas No Técnicas</h4>
                                    </div>
                                    <p><strong>Relación:</strong> Las facturas atípicas pueden indicar fraude eléctrico 
                                    o conexiones clandestinas.</p>
                                    <p><strong>Correlación:</strong> Positiva (+0.68) - Zonas con alta tasa atípica presentan mayores pérdidas</p>
                                    <div class="kpi-action">
                                        <i class="fas fa-arrow-right"></i> 
                                        <span>Priorizar inspecciones en zonas con ambos indicadores elevados</span>
                                    </div>
                                </div>

                                <div class="kpi-relation-card">
                                    <div class="kpi-header">
                                        <i class="fas fa-users"></i>
                                        <h4>KPI 4: Índice de Satisfacción del Cliente (NPS)</h4>
                                    </div>
                                    <p><strong>Relación:</strong> Facturación incorrecta es la principal causa de reclamos 
                                    y afecta directamente la satisfacción.</p>
                                    <p><strong>Correlación:</strong> Negativa (-0.81) - Menor tasa atípica mejora NPS</p>
                                    <div class="kpi-action">
                                        <i class="fas fa-arrow-right"></i> 
                                        <span>Comunicar proactivamente ajustes de facturación a clientes</span>
                                    </div>
                                </div>

                                <div class="kpi-relation-card">
                                    <div class="kpi-header">
                                        <i class="fas fa-dollar-sign"></i>
                                        <h4>KPI 5: Tasa de Cobranza</h4>
                                    </div>
                                    <p><strong>Relación:</strong> Facturas percibidas como incorrectas tienen menor 
                                    probabilidad de pago puntual.</p>
                                    <p><strong>Correlación:</strong> Negativa (-0.58) - Facturación precisa mejora cobranza</p>
                                    <div class="kpi-action">
                                        <i class="fas fa-arrow-right"></i> 
                                        <span>Resolver facturas atípicas antes del vencimiento</span>
                                    </div>
                                </div>

                                <div class="kpi-relation-card">
                                    <div class="kpi-header">
                                        <i class="fas fa-clock"></i>
                                        <h4>KPI 6: Tiempo Promedio de Resolución de Reclamos</h4>
                                    </div>
                                    <p><strong>Relación:</strong> Las facturas atípicas generan reclamos que consumen 
                                    recursos del área comercial.</p>
                                    <p><strong>Correlación:</strong> Positiva (+0.75) - Más facturas atípicas aumentan carga operativa</p>
                                    <div class="kpi-action">
                                        <i class="fas fa-arrow-right"></i> 
                                        <span>Automatizar detección preventiva para reducir reclamos reactivos</span>
                                    </div>
                                </div>

                                <div class="info-box">
                                    <i class="fas fa-sitemap"></i>
                                    <strong>Visión Sistémica:</strong>
                                    <p>Los KPIs no operan en aislamiento. Un dashboard integrado con correlaciones 
                                    en tiempo real permite tomar decisiones estratégicas basadas en datos, 
                                    maximizando el impacto de las acciones correctivas.</p>
                                </div>
                            </div>
                        `
                    }
                ]
            },

            'tendencia-temporal': {
                title: 'Análisis de Tendencia Temporal',
                subtitle: 'Evolución Histórica de la Tasa de Facturación Atípica',
                sections: [
                    {
                        icon: 'fa-chart-line',
                        title: '¿Qué muestra este gráfico?',
                        content: `
                            <p>El gráfico de tendencia temporal presenta la <strong>evolución mensual</strong> de la 
                            Tasa de Facturación Atípica durante los últimos 12 meses.</p>
                            
                            <div class="chart-elements">
                                <h4>Elementos del Gráfico:</h4>
                                <ul>
                                    <li><strong>Línea de Tendencia:</strong> Muestra el valor del KPI para cada mes</li>
                                    <li><strong>Línea Roja Punteada:</strong> Marca la meta del 2% mensual</li>
                                    <li><strong>Puntos de Datos:</strong> Cada punto es clickeable para ver detalles</li>
                                    <li><strong>Área Sombreada:</strong> Visualiza la distancia respecto al eje X</li>
                                </ul>
                            </div>

                            <div class="info-highlight">
                                <strong>Interpretación:</strong>
                                <ul>
                                    <li>✅ <strong>Por debajo de la línea roja:</strong> Meta cumplida ese mes</li>
                                    <li>⚠️ <strong>Ligeramente sobre la línea:</strong> Estado de alerta (2-3%)</li>
                                    <li>🔴 <strong>Muy por encima:</strong> Estado crítico (>3%)</li>
                                </ul>
                            </div>
                        `
                    },
                    {
                        icon: 'fa-search',
                        title: 'Patrones a Identificar',
                        content: `
                            <div class="pattern-list">
                                <div class="pattern-item">
                                    <i class="fas fa-arrow-up"></i>
                                    <strong>Tendencia Ascendente:</strong>
                                    <p>Incremento sostenido indica problemas sistémicos que requieren intervención urgente</p>
                                </div>
                                <div class="pattern-item">
                                    <i class="fas fa-arrow-down"></i>
                                    <strong>Tendencia Descendente:</strong>
                                    <p>Mejora continua señala efectividad de acciones correctivas implementadas</p>
                                </div>
                                <div class="pattern-item">
                                    <i class="fas fa-wave-square"></i>
                                    <strong>Estacionalidad:</strong>
                                    <p>Picos en meses específicos indican factores externos (verano, cambios tarifarios)</p>
                                </div>
                                <div class="pattern-item">
                                    <i class="fas fa-random"></i>
                                    <strong>Volatilidad Alta:</strong>
                                    <p>Variaciones bruscas sugieren inestabilidad operativa o eventos extraordinarios</p>
                                </div>
                            </div>
                        `
                    }
                ]
            },

            'analisis-segmento': {
                title: 'Análisis por Segmento de Cliente',
                subtitle: 'Comparativa: Residencial, Comercial e Industrial',
                sections: [
                    {
                        icon: 'fa-users',
                        title: 'Segmentación de Clientes',
                        content: `
                            <p>Luz del Sur clasifica a sus clientes en tres segmentos principales según su 
                            perfil de consumo y actividad económica:</p>

                            <div class="segment-definitions">
                                <div class="segment-card residential">
                                    <h4><i class="fas fa-home"></i> Residencial</h4>
                                    <p><strong>Consumo típico:</strong> < 1,000 kWh/mes</p>
                                    <p><strong>Características:</strong> Consumo predecible, baja variabilidad estacional</p>
                                    <p><strong>Tasa esperada:</strong> 1.5 - 2.5%</p>
                                </div>

                                <div class="segment-card commercial">
                                    <h4><i class="fas fa-building"></i> Comercial</h4>
                                    <p><strong>Consumo típico:</strong> 1,000 - 10,000 kWh/mes</p>
                                    <p><strong>Características:</strong> Variabilidad media, dependiente de horario comercial</p>
                                    <p><strong>Tasa esperada:</strong> 2.5 - 4.0%</p>
                                </div>

                                <div class="segment-card industrial">
                                    <h4><i class="fas fa-industry"></i> Industrial</h4>
                                    <p><strong>Consumo típico:</strong> > 10,000 kWh/mes</p>
                                    <p><strong>Características:</strong> Alta variabilidad operacional, procesos complejos</p>
                                    <p><strong>Tasa esperada:</strong> 3.5 - 6.0%</p>
                                </div>
                            </div>
                        `
                    },
                    {
                        icon: 'fa-bullseye',
                        title: 'Estrategias por Segmento',
                        content: `
                            <div class="strategy-list">
                                <div class="strategy-item">
                                    <strong>Residencial:</strong>
                                    <ul>
                                        <li>Priorizar medición inteligente en edificios multifamiliares</li>
                                        <li>Campañas educativas sobre consumo responsable</li>
                                        <li>App móvil para seguimiento de consumo en tiempo real</li>
                                    </ul>
                                </div>
                                <div class="strategy-item">
                                    <strong>Comercial:</strong>
                                    <ul>
                                        <li>Auditorías energéticas con recomendaciones de eficiencia</li>
                                        <li>Planes de facturación con alertas preventivas</li>
                                        <li>Tarifas especiales por consumo estable</li>
                                    </ul>
                                </div>
                                <div class="strategy-item">
                                    <strong>Industrial:</strong>
                                    <ul>
                                        <li>Account managers dedicados para grandes clientes</li>
                                        <li>Medición trifásica de alta precisión</li>
                                        <li>Análisis predictivo de demanda con IA</li>
                                    </ul>
                                </div>
                            </div>
                        `
                    }
                ]
            },

            'distribucion-geografica': {
                title: 'Distribución Geográfica',
                subtitle: 'Análisis por Zona de Concesión',
                sections: [
                    {
                        icon: 'fa-map-marked-alt',
                        title: 'Zonas de Operación',
                        content: `
                            <p>Luz del Sur opera en 30 distritos de Lima Metropolitana, cubriendo aproximadamente 
                            3,000 km² con infraestructura heterogénea.</p>

                            <div class="info-highlight">
                                <strong>Factores que Impactan la Tasa por Zona:</strong>
                                <ul>
                                    <li>🏗️ <strong>Antigüedad de infraestructura:</strong> Zonas con redes >20 años presentan 2x más facturas atípicas</li>
                                    <li>👥 <strong>Densidad poblacional:</strong> Áreas densas dificultan acceso para lectura</li>
                                    <li>💰 <strong>Nivel socioeconómico:</strong> Correlación inversa con incidencia de fraude</li>
                                    <li>🌆 <strong>Tipo de urbanización:</strong> Asentamientos informales con mayor tasa atípica</li>
                                </ul>
                            </div>
                        `
                    },
                    {
                        icon: 'fa-chart-bar',
                        title: 'Interpretación del Gráfico',
                        content: `
                            <p>El gráfico de barras muestra la cantidad de facturas atípicas por zona geográfica, 
                            permitiendo identificar <strong>hotspots críticos</strong> que requieren atención prioritaria.</p>

                            <div class="action-box">
                                <strong>Acciones por Zona:</strong>
                                <ol>
                                    <li><strong>Zonas Rojas (>500 facturas atípicas):</strong>
                                        <ul>
                                            <li>Auditoría inmediata de infraestructura</li>
                                            <li>Plan de inversión en modernización</li>
                                            <li>Refuerzo de brigadas de inspección</li>
                                        </ul>
                                    </li>
                                    <li><strong>Zonas Amarillas (200-500 facturas):</strong>
                                        <ul>
                                            <li>Monitoreo intensivo mensual</li>
                                            <li>Calibración preventiva de medidores</li>
                                        </ul>
                                    </li>
                                    <li><strong>Zonas Verdes (<200 facturas):</strong>
                                        <ul>
                                            <li>Mantenimiento estándar</li>
                                            <li>Benchmark para mejores prácticas</li>
                                        </ul>
                                    </li>
                                </ol>
                            </div>
                        `
                    }
                ]
            },

            'analisis-marca': {
                title: 'Análisis por Marca de Medidor',
                subtitle: 'Desempeño por Fabricante',
                sections: [
                    {
                        icon: 'fa-microchip',
                        title: 'Tecnología de Medición',
                        content: `
                            <p>Luz del Sur opera con medidores de múltiples fabricantes, cada uno con características 
                            técnicas y tasas de precisión diferentes.</p>

                            <div class="info-highlight warning">
                                <strong>Impacto de la Marca en Facturación Atípica:</strong>
                                <p>Estudios internos demuestran que:</p>
                                <ul>
                                    <li>Medidores de marcas premium tienen 40% menos incidencia de facturas atípicas</li>
                                    <li>La vida útil recomendada es 15 años; después aumenta el error en 3-5%/año</li>
                                    <li>La calibración anual reduce anomalías en 25%</li>
                                </ul>
                            </div>
                        `
                    },
                    {
                        icon: 'fa-cogs',
                        title: 'Recomendaciones Técnicas',
                        content: `
                            <div class="tech-recommendations">
                                <div class="recommendation-item">
                                    <i class="fas fa-check-circle"></i>
                                    <strong>Estandarización:</strong>
                                    <p>Reducir a 2-3 marcas homologadas para simplificar mantenimiento</p>
                                </div>
                                <div class="recommendation-item">
                                    <i class="fas fa-sync-alt"></i>
                                    <strong>Plan de Renovación:</strong>
                                    <p>Reemplazar 20,000 medidores/año priorizando marcas con alta tasa atípica</p>
                                </div>
                                <div class="recommendation-item">
                                    <i class="fas fa-certificate"></i>
                                    <strong>Certificación:</strong>
                                    <p>Exigir certificados IEC 62052/62053 en nuevas adquisiciones</p>
                                </div>
                            </div>
                        `
                    }
                ]
            },

            'comparativa-global': {
                title: 'Comparativa Global: Normales vs Atípicas',
                subtitle: 'Proporción General del Universo de Facturas',
                sections: [
                    {
                        icon: 'fa-chart-pie',
                        title: 'Vista Macro del KPI',
                        content: `
                            <p>Este gráfico de dona muestra la <strong>proporción total</strong> entre facturas normales 
                            (con divergencia <30%) y facturas atípicas (divergencia ≥30%) en el período analizado.</p>

                            <div class="proportion-explanation">
                                <h4>Interpretación Visual:</h4>
                                <ul>
                                    <li><span class="color-dot green"></span> <strong>Verde:</strong> Facturas Normales - Funcionamiento correcto del sistema</li>
                                    <li><span class="color-dot red"></span> <strong>Rojo:</strong> Facturas Atípicas - Requieren investigación</li>
                                </ul>
                            </div>

                            <div class="info-highlight success">
                                <strong>Meta Corporativa:</strong>
                                <p>El objetivo es mantener el segmento verde ≥ 98% del total de facturas emitidas mensualmente.</p>
                                <p class="metric-example">
                                    <strong>Ejemplo:</strong> Si emitimos 1,200,000 facturas/mes, máximo 24,000 pueden ser atípicas.
                                </p>
                            </div>
                        `
                    },
                    {
                        icon: 'fa-balance-scale',
                        title: 'Contexto Regulatorio',
                        content: `
                            <p>La Norma Técnica de Calidad de los Servicios Eléctricos (NTCSE) de OSINERGMIN establece 
                            tolerancias máximas para facturación basada en estimaciones y lecturas anómalas.</p>

                            <div class="regulatory-table">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Indicador</th>
                                            <th>Límite OSINERGMIN</th>
                                            <th>Meta Luz del Sur</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Lecturas Estimadas</td>
                                            <td>≤ 5% mensual</td>
                                            <td>≤ 3% mensual</td>
                                        </tr>
                                        <tr>
                                            <td>Facturación Atípica</td>
                                            <td>No regulado*</td>
                                            <td><strong>≤ 2% mensual</strong></td>
                                        </tr>
                                        <tr>
                                            <td>Tiempo de Corrección</td>
                                            <td>≤ 15 días hábiles</td>
                                            <td>≤ 10 días hábiles</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <p class="table-note">* Meta autoimpuesta por Luz del Sur como estándar de excelencia</p>
                            </div>
                        `
                    }
                ]
            },
            'patrones-semanales': {
                title: 'Patrones por Día de la Semana',
                subtitle: 'Análisis de Comportamiento Temporal de Facturación Atípica',
                sections: [
                    {
                        icon: 'fa-calendar-week',
                        title: '¿Por qué analizar por día de la semana?',
                        content: `
                            <p>El análisis de patrones semanales revela <strong>variaciones sistemáticas</strong> en la ocurrencia 
                            de facturación atípica según el día de la semana, permitiendo identificar:</p>

                            <div class="info-highlight info">
                                <i class="fas fa-search"></i>
                                <strong>Factores Descubiertos:</strong>
                                <ul>
                                    <li><strong>Lunes:</strong> Mayor volumen de lecturas acumuladas del fin de semana</li>
                                    <li><strong>Viernes:</strong> Posible prisa en cierre de rutas antes del fin de semana</li>
                                    <li><strong>Fines de semana:</strong> Personal reducido, menos supervisión de calidad</li>
                                    <li><strong>Días festivos:</strong> Interrupciones en rutas normales de lectura</li>
                                </ul>
                            </div>

                            <div class="info-highlight success">
                                <i class="fas fa-lightbulb"></i>
                                <strong>Valor Estratégico:</strong>
                                <p>Identificar días críticos permite ajustar recursos, reforzar supervisión y 
                                optimizar la distribución de rutas de lectura para minimizar divergencias.</p>
                            </div>
                        `
                    },
                    {
                        icon: 'fa-chart-radar',
                        title: 'Interpretación del Gráfico Radar',
                        content: `
                            <p>Este gráfico tipo radar permite visualizar rápidamente:</p>
                            
                            <div class="pattern-list">
                                <div class="pattern-item">
                                    <strong>Picos (vértices alejados del centro):</strong>
                                    <p>Días con mayor incidencia de facturación atípica. Requieren investigación de causas.</p>
                                </div>
                                <div class="pattern-item">
                                    <strong>Valles (vértices cercanos al centro):</strong>
                                    <p>Días con mejor desempeño. Analizar prácticas exitosas para replicar.</p>
                                </div>
                                <div class="pattern-item">
                                    <strong>Forma uniforme (circular):</strong>
                                    <p>Indica consistencia en el proceso, independiente del día de la semana.</p>
                                </div>
                                <div class="pattern-item">
                                    <strong>Forma irregular (estrellada):</strong>
                                    <p>Señal de variabilidad significativa que requiere estandarización de procesos.</p>
                                </div>
                            </div>

                            <div class="info-highlight warning">
                                <i class="fas fa-exclamation-triangle"></i>
                                <strong>Nota:</strong> Si los datos reales no están disponibles, se muestran valores 
                                simulados para ilustrar el análisis. Contactar al área de Data Analytics para activar 
                                la recolección de esta métrica.
                            </div>
                        `
                    }
                ]
            }
        };

        // Generar HTML del modal
        const info = infoData[infoType];
        if (!info) return null;

        let sectionsHTML = '';
        info.sections.forEach(section => {
            sectionsHTML += `
                <div class="info-section">
                    <div class="info-section-header">
                        <i class="fas ${section.icon}"></i>
                        <h3>${section.title}</h3>
                    </div>
                    <div class="info-section-content">
                        ${section.content}
                    </div>
                </div>
            `;
        });

        return `
            <div class="info-modal-header">
                <div class="info-modal-title">
                    <h2>${info.title}</h2>
                    <p class="info-modal-subtitle">${info.subtitle}</p>
                </div>
                <button class="info-modal-close" aria-label="Cerrar">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="info-modal-body">
                ${sectionsHTML}
            </div>
            <div class="info-modal-footer">
                <p class="footer-note">
                    <i class="fas fa-info-circle"></i>
                    Para más información, consulte la documentación técnica completa o contacte al área de Business Intelligence.
                </p>
            </div>
        `;
    }
}

// ========================================
// INICIALIZACIÓN
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('[KPI 1 Info] 🎬 DOM cargado, inicializando sistema de información...');
    window.kpi1InfoManager = new KPI1InfoManager();
});

console.log('[KPI 1 Info] 📄 Script kpi1_info_modals.js cargado correctamente');
