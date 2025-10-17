// KPI 6 - Information Modals
// Información de negocio para KPI 6 - Exactitud de Continuidad

const KPI6_INFO = {
    'continuidad-lecturas': {
        'titulo': 'KPI 6: Exactitud de Lecturas Iniciales (Continuidad)',
        'justificacion': `
            <p>Valida que la <strong>lectura inicial de cada periodo coincida 
            con la lectura final del periodo anterior</strong> para el mismo medidor.</p>
            
            <h4>¿Por qué es crítico?</h4>
            <ul>
                <li><strong>Integridad de datos:</strong> Asegura coherencia temporal en los históricos de medición</li>
                <li><strong>Detección temprana:</strong> Identifica errores de captura o fallas del sistema AMI/HES</li>
                <li><strong>Cambios no registrados:</strong> Detecta reemplazos de medidor no documentados</li>
                <li><strong>Prevención de errores:</strong> Evita facturación incorrecta por datos inconsistentes</li>
                <li><strong>Auditoría:</strong> Permite rastrear anomalías en la cadena de lecturas</li>
            </ul>

            <h4>Concepto de Continuidad:</h4>
            <div style="background: #1e293b; padding: 1rem; border-radius: 8px; margin: 1rem 0;">
                <code>
                    Periodo t-1:  Lectura_Inicial(t-1) → <span style="color: #10b981">Lectura_Final(t-1)</span>
                                                                    ↓
                    Periodo t:    <span style="color: #10b981">Lectura_Inicial(t)</span>    → Lectura_Final(t)
                    
                    ¿Lectura_Inicial(t) == Lectura_Final(t-1)? → <span style="color: #10b981">CONTINUIDAD OK</span>
                </code>
            </div>
        `,
        'formula': `
            <div class="formula-section">
                <h4>Fórmula Principal:</h4>
                <code class="formula-highlight">Exactitud (%) = (# casos con Continuidad OK / Total casos) × 100</code>
                
                <h4>Validación de Continuidad:</h4>
                <code>Continuidad OK = abs(Lectura_Inicial(t) - Lectura_Final(t-1)) ≤ 0.1</code>
                
                <p><strong>Tolerancia de 0.1 kWh:</strong> Permite diferencias por redondeo del sistema.</p>
                
                <h4>Ejemplo Numérico:</h4>
                <div class="example-box">
                    <p><strong>Medidor 600001:</strong></p>
                    <ul>
                        <li>Periodo 25: Inicial=1000.0, Final=<span style="color: #10b981">1250.5</span></li>
                        <li>Periodo 26: Inicial=<span style="color: #10b981">1250.5</span>, Final=1480.2</li>
                        <li>✅ <strong>CONTINUIDAD OK</strong> (1250.5 == 1250.5)</li>
                    </ul>
                    
                    <p><strong>Medidor 600002:</strong></p>
                    <ul>
                        <li>Periodo 25: Inicial=500.0, Final=<span style="color: #ef4444">620.8</span></li>
                        <li>Periodo 26: Inicial=<span style="color: #ef4444">618.3</span>, Final=735.1</li>
                        <li>❌ <strong>ERROR CONTINUIDAD</strong> (620.8 ≠ 618.3, Diferencia: 2.5 kWh)</li>
                    </ul>
                </div>
            </div>
        `,
        'insights': `
            <h4>Interpretación del KPI:</h4>
            <div class="insight-levels">
                <div class="level success">
                    <strong>99-100%:</strong> Excelente calidad de datos
                    <p>Sistema funcionando correctamente, procesos de captura confiables.</p>
                </div>
                
                <div class="level warning">
                    <strong>97-98.9%:</strong> Requiere revisión
                    <p>Existen inconsistencias que deben investigarse. Revisar procesos.</p>
                </div>
                
                <div class="level danger">
                    <strong>&lt;97%:</strong> Problemas serios en proceso
                    <p>Fallas sistemáticas. Acción correctiva urgente requerida.</p>
                </div>
            </div>
            
            <h4>Causas Comunes de Discontinuidad:</h4>
            <ul>
                <li><strong>Cambio de medidor:</strong> Reemplazo no registrado en sistema</li>
                <li><strong>Reset de contador:</strong> Contador reiniciado por falla técnica</li>
                <li><strong>Error de captura:</strong> Error humano al ingresar lectura</li>
                <li><strong>Ajuste del sistema:</strong> Corrección administrativa no documentada</li>
                <li><strong>Fraude detectado:</strong> Manipulación del medidor</li>
                <li><strong>Falla de comunicación:</strong> Error en sistema AMI/AMR/HES</li>
            </ul>
            
            <h4>Clasificación por Magnitud:</h4>
            <table class="error-table">
                <thead>
                    <tr>
                        <th>Rango</th>
                        <th>Clasificación</th>
                        <th>Causa Probable</th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="success">
                        <td>≤ 0.1</td>
                        <td>OK</td>
                        <td>Continuidad perfecta</td>
                    </tr>
                    <tr class="info">
                        <td>0.1 - 1.0</td>
                        <td>LEVE</td>
                        <td>Error de redondeo</td>
                    </tr>
                    <tr class="warning">
                        <td>1.0 - 10.0</td>
                        <td>MODERADO</td>
                        <td>Error de captura</td>
                    </tr>
                    <tr class="danger">
                        <td>10.0 - 100.0</td>
                        <td>GRAVE</td>
                        <td>Posible cambio de medidor</td>
                    </tr>
                    <tr class="critical">
                        <td>&gt; 100.0</td>
                        <td>CRÍTICO</td>
                        <td>Reset de contador o fraude</td>
                    </tr>
                </tbody>
            </table>
        `,
        'acciones': `
            <h4>Plan de Acción Correctivo:</h4>
            
            <div class="action-plan">
                <div class="action-step">
                    <div class="step-number">1</div>
                    <div class="step-content">
                        <h5>Revisión de Top Medidores</h5>
                        <p>Analizar el top 10 de medidores con más errores de continuidad.</p>
                        <ul>
                            <li>Verificar historial de cambios de medidor</li>
                            <li>Revisar registros de mantenimiento</li>
                            <li>Validar en campo si es necesario</li>
                        </ul>
                    </div>
                </div>
                
                <div class="action-step">
                    <div class="step-number">2</div>
                    <div class="step-content">
                        <h5>Validación de Cambios no Documentados</h5>
                        <p>Cruzar datos de reemplazos de medidor con registros oficiales.</p>
                        <ul>
                            <li>Actualizar base de datos de activos</li>
                            <li>Documentar cambios retroactivos</li>
                            <li>Capacitar personal en procedimientos</li>
                        </ul>
                    </div>
                </div>
                
                <div class="action-step">
                    <div class="step-number">3</div>
                    <div class="step-content">
                        <h5>Corrección de Lecturas Iniciales Erróneas</h5>
                        <p>Ajustar lecturas iniciales que no correspondan.</p>
                        <ul>
                            <li>Aplicar correcciones en HES/MDM</li>
                            <li>Registrar justificación de cambios</li>
                            <li>Re-facturar si es necesario</li>
                        </ul>
                    </div>
                </div>
                
                <div class="action-step">
                    <div class="step-number">4</div>
                    <div class="step-content">
                        <h5>Capacitación de Personal</h5>
                        <p>Fortalecer conocimientos sobre importancia de continuidad.</p>
                        <ul>
                            <li>Procedimientos de captura de lectura</li>
                            <li>Registro correcto de cambios de medidor</li>
                            <li>Uso adecuado de sistemas HES/MDM</li>
                        </ul>
                    </div>
                </div>
                
                <div class="action-step">
                    <div class="step-number">5</div>
                    <div class="step-content">
                        <h5>Automatización de Validaciones</h5>
                        <p>Implementar controles automáticos en HES/MDM.</p>
                        <ul>
                            <li>Alerta automática de discontinuidad</li>
                            <li>Reglas de validación al momento de captura</li>
                            <li>Dashboard de monitoreo en tiempo real</li>
                        </ul>
                    </div>
                </div>
            </div>
            
            <h4>Beneficios Esperados:</h4>
            <ul class="benefits-list">
                <li>✅ Reducción de errores de facturación</li>
                <li>✅ Mayor confiabilidad de datos históricos</li>
                <li>✅ Detección temprana de fraudes</li>
                <li>✅ Menor cantidad de reclamos</li>
                <li>✅ Auditorías más eficientes</li>
                <li>✅ Mejor toma de decisiones basada en datos</li>
            </ul>
        `
    }
};

// Función para abrir modal
function openModal(modalKey) {
    const info = KPI6_INFO[modalKey];
    if (!info) {
        console.error('[KPI 6] Modal no encontrado:', modalKey);
        return;
    }
    
    // Crear modal dinámicamente
    const modal = document.createElement('div');
    modal.className = 'info-modal';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="closeModal(this)"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h2>${info.titulo}</h2>
                <button class="modal-close" onclick="closeModal(this)">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="modal-section">
                    <h3><i class="fas fa-info-circle"></i> Justificación</h3>
                    ${info.justificacion}
                </div>
                <div class="modal-section">
                    <h3><i class="fas fa-calculator"></i> Fórmula y Cálculo</h3>
                    ${info.formula}
                </div>
                <div class="modal-section">
                    <h3><i class="fas fa-lightbulb"></i> Insights</h3>
                    ${info.insights}
                </div>
                <div class="modal-section">
                    <h3><i class="fas fa-tasks"></i> Acciones Recomendadas</h3>
                    ${info.acciones}
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn-primary" onclick="closeModal(this)">Cerrar</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Añadir clase para animación
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
}

// Función para cerrar modal
function closeModal(element) {
    const modal = element.closest('.info-modal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

// Cerrar modal con tecla ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const modals = document.querySelectorAll('.info-modal');
        modals.forEach(modal => {
            modal.classList.remove('active');
            setTimeout(() => {
                modal.remove();
            }, 300);
        });
    }
});

console.log('[KPI 6] Info modals cargados correctamente');
