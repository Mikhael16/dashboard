// kpi2_info_modals.js - Modales de información para KPI 2: Precisión de Facturación

const informacionGraficos = {
    'tendencia': {
        titulo: 'Evolución de Precisión - Tendencia Mensual',
        contenido: `
            <div class="info-section">
                <h4><i class="fas fa-chart-line"></i> ¿Qué muestra este gráfico?</h4>
                <p>Este gráfico de línea temporal muestra la evolución mensual del indicador de <strong>Precisión de Facturación Energética</strong> calculado como:</p>
                <div class="formula-box">
                    <strong>Precisión (%) = [1 − (Σ|Facturado − Medido| / ΣMedido)] × 100</strong>
                </div>
                <p>Compara la energía facturada vs. la energía realmente medida agregada mensualmente.</p>
            </div>

            <div class="info-section">
                <h4><i class="fas fa-bullseye"></i> Objetivo y Meta</h4>
                <ul class="info-list">
                    <li><strong>Meta:</strong> ≥ 98% de precisión mensual</li>
                    <li><strong>Color verde:</strong> Precisión ≥ 98% (cumple meta)</li>
                    <li><strong>Color ámbar:</strong> Precisión 96-98% (requiere atención)</li>
                    <li><strong>Color rojo:</strong> Precisión < 96% (crítico)</li>
                </ul>
            </div>

            <div class="info-section">
                <h4><i class="fas fa-clipboard-check"></i> Sustento Técnico</h4>
                <p><strong>Justificación Regulatoria:</strong></p>
                <ul class="info-list">
                    <li>Norma Técnica de Calidad de Servicios Eléctricos (NTCSE) del OSINERGMIN</li>
                    <li>Obligación de facturar basándose en mediciones reales y precisas</li>
                    <li>Estándar internacional IEC 62052-11 para sistemas de medición</li>
                </ul>
                <p><strong>Impacto Operacional:</strong></p>
                <ul class="info-list">
                    <li>Precisión baja → Subfacturación → Pérdida de ingresos</li>
                    <li>Precisión baja → Sobrefacturación → Reclamos de clientes</li>
                    <li>Variabilidad alta indica problemas en calibración de medidores</li>
                </ul>
            </div>

            <div class="info-section">
                <h4><i class="fas fa-lightbulb"></i> Interpretación</h4>
                <p><strong>Tendencia ascendente:</strong> Mejora en procesos de medición y facturación</p>
                <p><strong>Tendencia descendente:</strong> Deterioro de equipos o procesos que requiere intervención inmediata</p>
                <p><strong>Picos hacia abajo:</strong> Pueden indicar eventos masivos (tormentas, fallas de sistema, errores en lectura masiva)</p>
            </div>
        `
    },
    
    'segmento': {
        titulo: 'Precisión por Segmento de Cliente',
        contenido: `
            <div class="info-section">
                <h4><i class="fas fa-users"></i> ¿Qué muestra este gráfico?</h4>
                <p>Desagregación del indicador de precisión por tres segmentos de consumo:</p>
                <ul class="info-list">
                    <li><strong>RESIDENCIAL:</strong> Consumo < 1,000 kWh/mes</li>
                    <li><strong>COMERCIAL:</strong> Consumo entre 1,000 - 10,000 kWh/mes</li>
                    <li><strong>INDUSTRIAL:</strong> Consumo > 10,000 kWh/mes</li>
                </ul>
            </div>

            <div class="info-section">
                <h4><i class="fas fa-clipboard-check"></i> Sustento Técnico</h4>
                <p><strong>Diferencias por Segmento:</strong></p>
                <ul class="info-list">
                    <li><strong>Industrial:</strong> Medidores de alta precisión (clase 0.2S), telemetría en tiempo real, mayor criticidad económica</li>
                    <li><strong>Comercial:</strong> Medidores digitales (clase 1.0), lecturas más frecuentes, perfil de consumo variable</li>
                    <li><strong>Residencial:</strong> Mayor volumen de medidores, tecnología más heterogénea, acceso físico más complejo</li>
                </ul>
                <p><strong>Implicaciones Regulatorias:</strong></p>
                <ul class="info-list">
                    <li>OSINERGMIN establece requisitos diferenciados por segmento</li>
                    <li>Grandes clientes requieren medición con registrador de carga</li>
                    <li>Supervisión más estricta en segmentos de alta demanda</li>
                </ul>
            </div>

            <div class="info-section">
                <h4><i class="fas fa-search"></i> Interpretación</h4>
                <p><strong>Precisión baja en Industrial:</strong> Alto impacto económico, revisar contratos de suministro y equipos de medición especializados</p>
                <p><strong>Precisión baja en Residencial:</strong> Puede indicar problemas masivos de infraestructura, medidores obsoletos o fraude</p>
                <p><strong>Disparidad entre segmentos:</strong> Evaluar si los procesos operativos están balanceados o si hay descuido en algún segmento</p>
            </div>

            <div class="info-section">
                <h4><i class="fas fa-exclamation-triangle"></i> Alertas</h4>
                <ul class="info-list">
                    <li>Si Industrial < 98%: Auditoría inmediata de grandes clientes</li>
                    <li>Si Residencial < 95%: Problema estructural en red de baja tensión</li>
                    <li>Gran diferencia entre segmentos: Inequidad en asignación de recursos técnicos</li>
                </ul>
            </div>
        `
    },
    
    'distribucion': {
        titulo: 'Distribución de Errores de Facturación',
        contenido: `
            <div class="info-section">
                <h4><i class="fas fa-chart-bar"></i> ¿Qué muestra este gráfico?</h4>
                <p>Histograma que clasifica los medidores según el <strong>error porcentual absoluto</strong> entre energía facturada y medida:</p>
                <div class="formula-box">
                    <strong>Error (%) = |Facturado - Medido| / Medido × 100</strong>
                </div>
                <p>Los rangos de error son:</p>
                <ul class="info-list">
                    <li><strong>0-1%:</strong> Error mínimo (precisión excelente)</li>
                    <li><strong>1-2%:</strong> Error bajo (dentro de tolerancia normal)</li>
                    <li><strong>2-5%:</strong> Error medio (requiere monitoreo)</li>
                    <li><strong>5-10%:</strong> Error alto (requiere intervención)</li>
                    <li><strong>>10%:</strong> Error crítico (acción inmediata)</li>
                </ul>
            </div>

            <div class="info-section">
                <h4><i class="fas fa-clipboard-check"></i> Sustento Técnico</h4>
                <p><strong>Normas de Calidad de Medidores:</strong></p>
                <ul class="info-list">
                    <li>IEC 62052-11: Tolerancia de ±2% para medidores clase 1.0</li>
                    <li>IEC 62053-21: Tolerancia de ±1% para medidores clase 0.5S</li>
                    <li>Resolución OSINERGMIN 123-2007: Límites de error de medición</li>
                </ul>
                <p><strong>Causas Técnicas de Errores:</strong></p>
                <ul class="info-list">
                    <li><strong>0-2%:</strong> Variación normal, imprecisión inherente del equipo</li>
                    <li><strong>2-5%:</strong> Descalibración, envejecimiento, sobrecarga</li>
                    <li><strong>5-10%:</strong> Fallas parciales, conexiones defectuosas, pérdidas técnicas</li>
                    <li><strong>>10%:</strong> Manipulación, fraude, falla total del equipo, error de lectura</li>
                </ul>
            </div>

            <div class="info-section">
                <h4><i class="fas fa-search"></i> Interpretación</h4>
                <p><strong>Distribución normal (campana):</strong> Mayoría en 0-2%, cola larga hacia la derecha es esperada</p>
                <p><strong>Distribución sesgada:</strong> Si >30% está fuera de 0-2%, indica problema sistémico</p>
                <p><strong>Bimodal (dos picos):</strong> Dos poblaciones distintas (ej: medidores nuevos vs antiguos)</p>
                <p><strong>Concentración en >10%:</strong> Crisis operacional que requiere plan de reemplazo masivo</p>
            </div>

            <div class="info-section">
                <h4><i class="fas fa-tools"></i> Acciones Correctivas</h4>
                <ul class="info-list">
                    <li><strong>Rango 0-2%:</strong> Mantenimiento preventivo rutinario</li>
                    <li><strong>Rango 2-5%:</strong> Calibración selectiva, revisión de transformadores</li>
                    <li><strong>Rango 5-10%:</strong> Reemplazo programado, auditoría de conexiones</li>
                    <li><strong>Rango >10%:</strong> Reemplazo inmediato, investigación de fraude</li>
                </ul>
            </div>
        `
    },
    
    'impacto': {
        titulo: 'Impacto Económico de las Diferencias',
        contenido: `
            <div class="info-section">
                <h4><i class="fas fa-dollar-sign"></i> ¿Qué muestra este indicador?</h4>
                <p>Cuantificación monetaria del impacto de las <strong>diferencias entre energía facturada y medida</strong>:</p>
                <div class="formula-box">
                    <strong>Impacto (S/) = |Energía Facturada - Energía Medida| × Precio Promedio kWh</strong>
                </div>
                <p>Se utiliza un precio promedio de <strong>S/ 0.45 por kWh</strong> (tarifa regulada BT5 + ajustes)</p>
            </div>

            <div class="info-section">
                <h4><i class="fas fa-clipboard-check"></i> Sustento Técnico</h4>
                <p><strong>Clasificación del Impacto:</strong></p>
                <ul class="info-list">
                    <li><strong>Subfacturación:</strong> Energía medida > Energía facturada → <strong>Pérdida de ingresos</strong> para la empresa</li>
                    <li><strong>Sobrefacturación:</strong> Energía facturada > Energía medida → <strong>Riesgo de reclamos</strong> y sanciones regulatorias</li>
                </ul>
                <p><strong>Marco Regulatorio:</strong></p>
                <ul class="info-list">
                    <li>Resolución OSINERGMIN 028-2021: Procedimiento de reclamos por errores de facturación</li>
                    <li>Ley 27838 (Ley de Transparencia): Obligación de facturar correctamente y compensar errores</li>
                    <li>Código Nacional de Electricidad: Requisitos de precisión en sistemas de medición</li>
                </ul>
            </div>

            <div class="info-section">
                <h4><i class="fas fa-calculator"></i> Componentes del Cálculo</h4>
                <ul class="info-list">
                    <li><strong>Energía Total Medida:</strong> Suma de lecturas de terreno × constante del medidor</li>
                    <li><strong>Energía Total Facturada:</strong> Suma de lecturas facturadas × constante</li>
                    <li><strong>Diferencia Absoluta:</strong> Valor absoluto de la diferencia agregada</li>
                    <li><strong>Precio Promedio:</strong> Tarifa regulada vigente promedio ponderado por segmento</li>
                </ul>
            </div>

            <div class="info-section">
                <h4><i class="fas fa-search"></i> Interpretación</h4>
                <p><strong>Impacto > S/ 100,000/mes:</strong> Requiere plan de acción prioritario con asignación de recursos</p>
                <p><strong>Tipo Subfacturación:</strong> Riesgo financiero directo, afecta flujo de caja y márgenes</p>
                <p><strong>Tipo Sobrefacturación:</strong> Riesgo reputacional y legal, posibles multas OSINERGMIN</p>
                <p><strong>Tendencia creciente:</strong> Deterioro progresivo del parque de medidores, requiere plan de inversión CAPEX</p>
            </div>

            <div class="info-section">
                <h4><i class="fas fa-chart-line"></i> Benchmarking</h4>
                <ul class="info-list">
                    <li><strong>Óptimo:</strong> < S/ 50,000/mes (< 0.5% de facturación total)</li>
                    <li><strong>Aceptable:</strong> S/ 50,000 - S/ 200,000/mes (0.5% - 2%)</li>
                    <li><strong>Preocupante:</strong> S/ 200,000 - S/ 500,000/mes (2% - 5%)</li>
                    <li><strong>Crítico:</strong> > S/ 500,000/mes (> 5% de facturación)</li>
                </ul>
            </div>
        `
    },
    
    'topErrores': {
        titulo: 'Top 10 Medidores con Mayor Error',
        contenido: `
            <div class="info-section">
                <h4><i class="fas fa-list-ol"></i> ¿Qué muestra esta tabla?</h4>
                <p>Ranking de los 10 medidores con <strong>mayor diferencia absoluta</strong> entre energía facturada y medida, priorizados por impacto económico:</p>
                <ul class="info-list">
                    <li><strong>Medidor:</strong> Código único del equipo de medición</li>
                    <li><strong>Facturado:</strong> Energía registrada en sistema de facturación (kWh)</li>
                    <li><strong>Medido:</strong> Energía real registrada en terreno (kWh)</li>
                    <li><strong>Diferencia:</strong> Valor absoluto de la discrepancia (kWh)</li>
                    <li><strong>Error %:</strong> Porcentaje de error respecto a lo medido</li>
                </ul>
            </div>

            <div class="info-section">
                <h4><i class="fas fa-clipboard-check"></i> Sustento Técnico</h4>
                <p><strong>Criterios de Priorización:</strong></p>
                <ul class="info-list">
                    <li>Se ordenan por <strong>diferencia absoluta</strong> (no porcentual) para maximizar impacto de intervenciones</li>
                    <li>Un error de 1000 kWh en cliente industrial es más crítico que 50% de error en residencial de 10 kWh</li>
                    <li>Principio de Pareto: 20% de medidores concentran 80% del impacto económico</li>
                </ul>
                <p><strong>Causas Frecuentes en Top Errores:</strong></p>
                <ul class="info-list">
                    <li><strong>Grandes clientes:</strong> Transformadores de corriente descalibrados, errores en multiplicadores</li>
                    <li><strong>Medidores antiguos:</strong> Desgaste mecánico, pérdida de precisión por más de 15 años de uso</li>
                    <li><strong>Fraude/Manipulación:</strong> Desviación de carga, bypass de medidor, imanes externos</li>
                    <li><strong>Errores de configuración:</strong> Constante incorrecta en sistema MDM/HES</li>
                </ul>
            </div>

            <div class="info-section">
                <h4><i class="fas fa-wrench"></i> Plan de Acción Recomendado</h4>
                <ol class="info-list">
                    <li><strong>Verificación en campo (24-48h):</strong> Inspección física del medidor y conexiones</li>
                    <li><strong>Prueba de exactitud:</strong> Comparación con patrón de referencia clase 0.05</li>
                    <li><strong>Revisión de base de datos:</strong> Validar constante, multiplicador y parámetros en sistema</li>
                    <li><strong>Decisión:</strong>
                        <ul>
                            <li>Si error < 3%: Calibración/ajuste</li>
                            <li>Si error 3-10%: Reemplazo programado (30 días)</li>
                            <li>Si error > 10%: Reemplazo inmediato + investigación fraude</li>
                        </ul>
                    </li>
                    <li><strong>Seguimiento:</strong> Revalidar precisión post-intervención en siguiente ciclo</li>
                </ol>
            </div>

            <div class="info-section">
                <h4><i class="fas fa-money-bill-wave"></i> ROI de Intervención</h4>
                <p>Ejemplo: Medidor con error de 5000 kWh/mes</p>
                <ul class="info-list">
                    <li><strong>Pérdida mensual:</strong> 5000 kWh × S/ 0.45 = S/ 2,250</li>
                    <li><strong>Pérdida anual:</strong> S/ 27,000</li>
                    <li><strong>Costo reemplazo:</strong> S/ 800 (medidor) + S/ 400 (instalación) = S/ 1,200</li>
                    <li><strong>Payback:</strong> 1,200 / 2,250 = <strong>0.53 meses (16 días)</strong></li>
                </ul>
                <p><strong>Conclusión:</strong> Intervención altamente rentable, justifica acción inmediata</p>
            </div>
        `
    },
    
    'evolucion': {
        titulo: 'Evolución del Error Promedio',
        contenido: `
            <div class="info-section">
                <h4><i class="fas fa-chart-area"></i> ¿Qué muestra este gráfico?</h4>
                <p>Tendencia temporal del <strong>error promedio absoluto</strong> de todos los medidores activos:</p>
                <div class="formula-box">
                    <strong>Error Promedio (kWh) = Σ|Facturado - Medido| / N° Medidores</strong>
                </div>
                <p>Complementa el indicador de precisión mostrando la <strong>magnitud absoluta</strong> del problema (no solo el porcentaje)</p>
            </div>

            <div class="info-section">
                <h4><i class="fas fa-clipboard-check"></i> Sustento Técnico</h4>
                <p><strong>Diferencia vs. Gráfico de Precisión:</strong></p>
                <ul class="info-list">
                    <li><strong>Precisión (%):</strong> Métrica <strong>relativa</strong>, sensible a la base de consumo</li>
                    <li><strong>Error Promedio (kWh):</strong> Métrica <strong>absoluta</strong>, muestra impacto real en kWh</li>
                    <li>Un error de 50 kWh/mes es 50% en un cliente de 100 kWh, pero 0.5% en uno de 10,000 kWh</li>
                    <li>Este gráfico evita sesgo por cambios en composición de clientes</li>
                </ul>
                <p><strong>Factores que Afectan la Tendencia:</strong></p>
                <ul class="info-list">
                    <li><strong>Edad del parque de medidores:</strong> Envejecimiento natural aumenta error promedio</li>
                    <li><strong>Plan de reemplazo:</strong> Renovación masiva reduce error temporalmente</li>
                    <li><strong>Condiciones ambientales:</strong> Humedad, temperatura extrema aceleran deterioro</li>
                    <li><strong>Crecimiento de demanda:</strong> Sobrecarga de medidores dimensionados para carga menor</li>
                </ul>
            </div>

            <div class="info-section">
                <h4><i class="fas fa-search"></i> Interpretación</h4>
                <p><strong>Tendencia creciente sostenida:</strong> El parque de medidores está envejeciendo sin reposición adecuada</p>
                <p><strong>Picos estacionales:</strong> Pueden relacionarse con clima extremo (verano/invierno) que afecta equipos</p>
                <p><strong>Caída brusca:</strong> Indica campaña exitosa de reemplazo o recalibración masiva</p>
                <p><strong>Estabilidad horizontal:</strong> Balance adecuado entre deterioro y mantenimiento</p>
            </div>

            <div class="info-section">
                <h4><i class="fas fa-bullseye"></i> Metas y Benchmarks</h4>
                <ul class="info-list">
                    <li><strong>Excelente:</strong> < 5 kWh/medidor/mes (sistema de medición clase mundial)</li>
                    <li><strong>Bueno:</strong> 5-15 kWh/medidor/mes (parque de medidores moderno y bien mantenido)</li>
                    <li><strong>Regular:</strong> 15-30 kWh/medidor/mes (requiere plan de mejora)</li>
                    <li><strong>Deficiente:</strong> > 30 kWh/medidor/mes (crisis operacional)</li>
                </ul>
            </div>

            <div class="info-section">
                <h4><i class="fas fa-tools"></i> Estrategia de Mejora</h4>
                <ol class="info-list">
                    <li><strong>Análisis de Causa Raíz:</strong> Desagregar por edad, marca, ubicación geográfica</li>
                    <li><strong>Plan de Renovación:</strong> Priorizar reemplazo de medidores con >15 años</li>
                    <li><strong>Mantenimiento Predictivo:</strong> Usar este gráfico para proyectar deterioro futuro</li>
                    <li><strong>Inversión CAPEX:</strong> Justificar presupuesto mostrando correlación error vs. pérdidas económicas</li>
                    <li><strong>Monitoreo Post-Intervención:</strong> Validar que intervenciones reducen efectivamente el error promedio</li>
                </ol>
            </div>
        `
    }
};

// Función para mostrar modal
function mostrarInfoModal(tipo) {
    const modal = document.getElementById('infoModal');
    const title = document.getElementById('modalTitle');
    const body = document.getElementById('modalBody');
    
    const info = informacionGraficos[tipo];
    if (info) {
        title.innerHTML = `<i class="fas fa-info-circle"></i> ${info.titulo}`;
        body.innerHTML = info.contenido;
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Prevenir scroll del body
    }
}

// Función para cerrar modal
function cerrarInfoModal() {
    const modal = document.getElementById('infoModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto'; // Restaurar scroll
}

// Cerrar modal con tecla ESC
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        cerrarInfoModal();
    }
});

console.log('[KPI2 Info Modals] Modales de información cargados');
