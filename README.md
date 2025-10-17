# 📊 Dashboard KPIs - Luz del Sur

Dashboard profesional para el monitoreo y análisis de KPIs críticos de detección de facturación atípica en Luz del Sur.

![Status](https://img.shields.io/badge/status-production-green)
![Python](https://img.shields.io/badge/python-3.11.7-blue)
![Flask](https://img.shields.io/badge/flask-3.0.0-lightgrey)

## 🎯 KPIs Implementados

1. **KPI 1**: Lecturas Estimadas (Meta: ≤ 2.0%)
2. **KPI 2**: Consumo Cero (Meta: ≤ 1.0%)  
3. **KPI 3**: Diferencias Significativas >15% (Meta: ≤ 5.0%)
6. **KPI 6**: Exactitud de Continuidad de Lecturas (Meta: ≥ 99.0%)

## 🚀 Instalación y Ejecución

### Prerrequisitos
- Python 3.8 o superior
- Archivo de datos: `../data/hislec_limpio.unl`

### Pasos de instalación

1. **Instalar dependencias:**
```bash
pip install -r requirements.txt
```

2. **Ejecutar la aplicación:**
```bash
python app.py
```

3. **Abrir en navegador:**
```
http://localhost:5000
```

## 📊 Características del Dashboard

### Visualizaciones Principales
- **Panel de Resumen**: Métricas generales del dataset
- **Tarjetas de KPIs**: Valores actuales con estados (OK/ALERTA/CRÍTICO)
- **Gráfico de Tendencias**: Evolución mensual de KPIs principales
- **Gráfico de Estados**: Distribución actual de estados de KPIs
- **Panel de Alertas**: Notificaciones automáticas de KPIs fuera de meta

### Funcionalidades Técnicas
- **Actualización automática**: Cada 5 minutos
- **Cálculos en tiempo real**: Procesamiento dinámico de 9M+ registros
- **Estados inteligentes**: 
  - 🟢 **OK**: Dentro de meta
  - 🟡 **ALERTA**: Entre meta y 2x meta
  - 🔴 **CRÍTICO**: Mayor a 2x meta
- **Responsive Design**: Adaptable a móviles y tablets
- **Manejo de errores**: Notificaciones y recuperación automática

## 🔧 Estructura del Proyecto

```
dashboard/
├── app.py                 # Aplicación Flask principal
├── requirements.txt       # Dependencias Python
├── README.md             # Este archivo
├── static/
│   ├── css/
│   │   └── dashboard.css # Estilos principales
│   └── js/
│       └── dashboard.js  # Lógica JavaScript
└── templates/
    └── dashboard.html    # Plantilla HTML principal
```

## 📡 API Endpoints

### `/api/kpis`
Retorna todos los KPIs calculados en tiempo real:
```json
{
  "kpis": {
    "kpi_1": {"valor": 8.20, "meta": 2.0, "estado": "CRÍTICO", "unidad": "%"},
    "kpi_2": {"valor": 0.85, "meta": 1.0, "estado": "OK", "unidad": "%"},
    ...
  },
  "resumen": {
    "total_registros": 9000000,
    "total_medidores": 150000,
    "fecha_inicio": "2023-01-01",
    "fecha_fin": "2023-12-31"
  }
}
```

### `/api/tendencias`
Retorna evolución mensual de KPIs principales:
```json
{
  "tendencias": [
    {"mes": "2023-01", "kpi_1": 8.1, "kpi_2": 0.9, "kpi_3": 16.2, "kpi_5": 3.2},
    ...
  ]
}
```

## 🎨 Tecnologías Utilizadas

- **Backend**: Flask (Python)
- **Frontend**: HTML5, CSS3, JavaScript ES6
- **Visualizaciones**: Chart.js
- **Análisis**: Pandas, NumPy
- **UI/UX**: CSS Grid, Flexbox, Animaciones CSS

## 📈 Datos de Entrada

El dashboard procesa el archivo `hislec_limpio.unl` con las siguientes columnas:
- `numero_medidor`: Identificador único del medidor
- `fecha_evento`: Fecha de la lectura
- `lectura_actual`: Lectura registrada
- `tipo_lectura`: VERIFICADA o ESTIMADA
- `consumo_teorico`: Consumo calculado teóricamente
- `consumo_reportado`: Consumo reportado final
- `evento`: Códigos de eventos (R=Reclamo)
- `segmento`: Segmentación de cliente
- Y otros campos auxiliares

## ⚡ Rendimiento

- **Procesamiento**: Optimizado para datasets de 9M+ registros
- **Tiempo de carga**: < 3 segundos para cálculos completos
- **Memoria**: Procesamiento por chunks para eficiencia
- **Actualización**: Incremental para mantener responsividad

## 🔍 Interpretación de KPIs

### Estados Críticos Actuales:
- **KPI 1**: 8.20% vs Meta 2.0% → **4x superior** (Requiere atención inmediata)
- **KPI 3**: 16.5% vs Meta 5.0% → **3x superior** (Diferencias significativas altas)
- **KPI 5**: 3.4‰ vs Meta 1.0‰ → **3x superior** (Tasa de reclamos elevada)

### Recomendaciones:
1. **Priorizar** revisión de procesos de estimación de lecturas
2. **Investigar** causas de diferencias entre consumo teórico y reportado
3. **Implementar** mejoras en atención de reclamos

## 🚨 Alertas y Monitoreo

El sistema genera automáticamente:
- **Alertas visuales** en tiempo real
- **Códigos de color** intuitivos
- **Notificaciones** de cambios de estado
- **Histórico** de evolución de KPIs

## 📞 Contacto y Soporte

Para soporte técnico o consultas sobre el dashboard:
- Revise la documentación en este README
- Verifique los logs de la aplicación Flask
- Confirme la disponibilidad del archivo de datos