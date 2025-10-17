# 🚀 GUÍA RÁPIDA - PRUEBA DEL DASHBOARD KPI 1

## ⚡ Inicio Rápido

### 1. Iniciar el Servidor

```powershell
# Navegar a la carpeta del dashboard
cd c:\Users\User\Desktop\AnalisisDatosLDS\dashboard

# Iniciar Flask
python app.py
```

**Salida esperada:**
```
 * Running on http://127.0.0.1:5000
 * Debug mode: on
```

---

### 2. Abrir el Dashboard KPI 1

1. Abre tu navegador (Chrome, Edge, Firefox)
2. Navega a: **http://localhost:5000/kpi1**
3. Abre DevTools (F12 o Ctrl+Shift+I)
4. Ve a la pestaña **Console**

---

### 3. Verificar Logs en Terminal (Backend)

Deberías ver logs como:

```
[KPI 1] Columnas disponibles: ['fecha_evento', 'numero_medidor', 'consumo_reportado', ...]
[KPI 1] Total registros válidos: 8000
[KPI 1] Porcentaje general calculado: 8.47%
[KPI 1] Total estimadas: 678, Total verificadas: 7322
[KPI 1] Tendencia temporal generada: 12 meses
[KPI 1] Respuesta generada exitosamente
```

✅ **Si ves estos logs** = Backend funciona correctamente

❌ **Si ves "KeyError: 'tarifa'"** = Algo salió mal (no debería ocurrir)

---

### 4. Verificar Logs en Browser Console (Frontend)

Deberías ver logs como:

```
[KPI 1] Datos recibidos desde API: {porcentaje_general: 8.47, total_estimadas: 678, ...}
[KPI 1] Actualizando visualizaciones...
[KPI 1] Creando gráfico de tendencia con 12 puntos
[KPI 1] Creando gráfico de segmento con 3 segmentos
[KPI 1] Creando gráfico de marca con 6 marcas
[KPI 1] Datos procesados exitosamente
```

✅ **Si ves estos logs** = Frontend funciona correctamente

❌ **Si ves errores rojos** = Revisar qué campo falta

---

### 5. Verificar Visualizaciones

Deberías ver en pantalla:

#### ✅ Métricas (parte superior):
- **Valor Actual:** 8.20% (o similar)
- **Total Estimadas:** 678 (o similar)
- **Total Verificadas:** 7,322 (o similar)
- **Desviación Meta:** 4.1x (o similar)

#### ✅ Gráficos (6 en total):
1. **Tendencia Temporal** - Línea con 12 puntos (meses)
2. **Análisis por Segmento** - Dona con colores
3. **Análisis por Marca** - Barras verticales
4. **Distribución Geográfica** - Barras horizontales
5. **Comparativa Global** - Pie chart (verde y rojo)
6. **Patrones por Día** - Radar de 7 puntos

#### ✅ Estadísticas (parte inferior):
- Promedio Mensual
- Desviación Estándar
- Tendencia (↗ ↘ →)
- Predicción 30 días
- Peor Segmento
- Mejor Marca

---

### 6. Probar Filtros

1. **Filtrar por fecha:**
   - Selecciona Fecha Inicio: 2024-01-01
   - Selecciona Fecha Fin: 2024-06-30
   - Click en "Aplicar Filtros"
   - Verifica que los gráficos se actualicen

2. **Filtrar por segmento:**
   - Selecciona "Residencial" en el dropdown
   - Click en "Aplicar Filtros"
   - Verifica que solo muestre datos de ese segmento

3. **Limpiar filtros:**
   - Click en "Limpiar"
   - Verifica que vuelvan a aparecer todos los datos

---

## 🔍 DEBUGGING

### Si NO ves datos:

1. **Verifica que el archivo de datos existe:**
   ```powershell
   dir c:\Users\User\Desktop\AnalisisDatosLDS\data\hislec_limpio.unl
   ```

2. **Verifica logs de backend:**
   - Busca líneas con `[KPI 1]`
   - Si dice "No se pudieron cargar los datos" → Revisa ruta del archivo

3. **Verifica logs de frontend:**
   - Abre DevTools > Console
   - Busca líneas con `[KPI 1]`
   - Si dice "Error desde API" → Revisa respuesta del backend

### Si ves gráficos vacíos:

1. **Verifica que lleguen datos:**
   ```javascript
   // En Console de DevTools
   fetch('/api/kpi1/analytics')
     .then(r => r.json())
     .then(d => console.log(d))
   ```

2. **Verifica estructura de respuesta:**
   - Debe tener `porcentaje_general`
   - Debe tener `tendencia_temporal` con array
   - Debe tener `analisis_segmento` con objeto

---

## ✅ CHECKLIST DE FUNCIONAMIENTO

### Backend:
- [ ] Servidor Flask iniciado sin errores
- [ ] Logs `[KPI 1]` aparecen en terminal
- [ ] NO hay error "KeyError: 'tarifa'"
- [ ] Endpoint `/api/kpi1/analytics` responde JSON válido

### Frontend:
- [ ] Página carga sin errores 404
- [ ] Logs `[KPI 1]` aparecen en Console
- [ ] Métricas numéricas se muestran correctamente
- [ ] Los 6 gráficos se renderizan
- [ ] Estadísticas inferiores tienen valores
- [ ] Filtros funcionan sin errores

---

## 🎯 CRITERIOS DE ÉXITO

✅ **TODO FUNCIONA SI:**
- No hay errores en Terminal (backend)
- No hay errores rojos en Console (frontend)
- Se ven números en las métricas (no "NaN" ni "--")
- Los 6 gráficos muestran visualizaciones con colores
- Filtros cambian los datos al aplicarse

---

## 🆘 SOLUCIÓN DE PROBLEMAS COMUNES

### Error: "No se pudieron cargar los datos"
**Causa:** Archivo `hislec_limpio.unl` no encontrado
**Solución:**
```powershell
# Verificar que existe el archivo
dir c:\Users\User\Desktop\AnalisisDatosLDS\data\hislec_limpio.unl

# Si no existe, verificar ruta alternativa en app.py líneas 35-39
```

### Error: "KeyError: 'tarifa'"
**Causa:** La corrección no se aplicó correctamente
**Solución:**
```powershell
# Verificar que app.py fue modificado
python -c "with open('app.py') as f: print('tarifa' in f.read())"
# Debe retornar: False (si dice True, la corrección falló)
```

### Gráficos no se muestran
**Causa:** Canvas no encontrado o Chart.js no cargó
**Solución:**
1. Verifica en DevTools > Network que `chart.js` se descargó (código 200)
2. Verifica en Console que no hay error de "Chart is not defined"
3. Recarga la página con Ctrl+F5 (hard refresh)

### Datos no se actualizan con filtros
**Causa:** Eventos no configurados correctamente
**Solución:**
1. Verifica en Console que al hacer click en "Aplicar Filtros" aparece log
2. Verifica que los IDs `fechaInicio`, `fechaFin`, `segmentoFilter` existan
3. Inspecciona elementos con DevTools > Elements

---

## 📞 AYUDA ADICIONAL

Si después de seguir esta guía aún hay problemas:

1. **Captura de pantalla** de Terminal con logs
2. **Captura de pantalla** de DevTools > Console
3. **Captura de pantalla** de DevTools > Network (pestaña XHR/Fetch)
4. **Copia el error exacto** que aparece

---

## 🎉 ¡ÉXITO!

Si todo funciona, deberías ver:
- ✅ Dashboard completamente funcional
- ✅ 6 gráficos renderizados con datos reales
- ✅ Métricas actualizadas
- ✅ Filtros operativos
- ✅ Logs claros en Terminal y Console

**¡El KPI 1 está listo para usar!** 🚀
