# Guía de Despliegue - Dashboard Luz del Sur

## 🚀 Despliegue en Render (RECOMENDADO)

### Requisitos Previos
- Cuenta en GitHub (gratis)
- Cuenta en Render (gratis)
- Código subido a GitHub

---

## PASO A PASO

### **1. Subir el Proyecto a GitHub**

#### 1.1 Crear Repositorio en GitHub
1. Ve a https://github.com/new
2. Nombre del repositorio: `luz-del-sur-dashboard`
3. Descripción: `Dashboard de análisis de facturación atípica - Luz del Sur`
4. Marca como **Público**
5. Click en "Create repository"

#### 1.2 Subir el código desde tu computadora
Abre PowerShell en la carpeta `dashboard`:

```powershell
# Ir a la carpeta del dashboard
cd C:\Users\User\Desktop\AnalisisDatosLDS\dashboard

# Inicializar Git (si no está inicializado)
git init

# Agregar todos los archivos
git add .

# Hacer commit
git commit -m "Initial commit - Dashboard Luz del Sur"

# Conectar con tu repositorio de GitHub
git remote add origin https://github.com/TU_USUARIO/luz-del-sur-dashboard.git

# Subir a GitHub
git branch -M main
git push -u origin main
```

**⚠️ IMPORTANTE**: Reemplaza `TU_USUARIO` con tu nombre de usuario de GitHub.

---

### **2. Configurar el Servidor de Producción**

#### 2.1 Modificar app.py para producción

Abre `app.py` y al final del archivo, cambia:

```python
# ❌ ANTES (desarrollo)
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
```

Por:

```python
# ✅ DESPUÉS (producción)
if __name__ == '__main__':
    import os
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
```

Guarda y sube el cambio:
```powershell
git add app.py
git commit -m "Configuración para producción"
git push
```

---

### **3. Desplegar en Render**

#### 3.1 Crear cuenta en Render
1. Ve a https://render.com
2. Click en "Get Started for Free"
3. Regístrate con tu cuenta de GitHub

#### 3.2 Crear nuevo Web Service
1. En el Dashboard de Render, click en **"New +"** → **"Web Service"**
2. Conecta tu repositorio de GitHub:
   - Click en "Connect account" si es tu primera vez
   - Autoriza a Render para acceder a tus repositorios
3. Selecciona el repositorio `luz-del-sur-dashboard`

#### 3.3 Configurar el servicio

Llena el formulario con estos datos:

| Campo | Valor |
|-------|-------|
| **Name** | `luz-del-sur-dashboard` |
| **Region** | `Oregon (US West)` o el más cercano |
| **Branch** | `main` |
| **Root Directory** | (dejar vacío) |
| **Runtime** | `Python 3` |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `gunicorn app:app` |
| **Plan Type** | **Free** |

#### 3.4 Variables de Entorno (opcional)
En la sección "Environment Variables", agrega:
```
FLASK_ENV=production
SECRET_KEY=tu_clave_secreta_aqui_generala_aleatoria
```

4. Click en **"Create Web Service"**

---

### **4. Esperar el Despliegue** ⏱️

Render comenzará a:
1. ✅ Clonar tu repositorio
2. ✅ Instalar dependencias (`requirements.txt`)
3. ✅ Construir la aplicación
4. ✅ Iniciar el servidor

**Tiempo estimado**: 3-5 minutos

---

### **5. Obtener la URL de tu Dashboard** 🌐

Una vez completado, verás:
```
==> Your service is live 🎉
https://luz-del-sur-dashboard.onrender.com
```

**¡Listo!** Tu dashboard está en línea en:
`https://TU-NOMBRE-DE-SERVICIO.onrender.com`

---

## 🔄 Actualizaciones Automáticas

Cada vez que hagas cambios y los subas a GitHub:

```powershell
git add .
git commit -m "Descripción de cambios"
git push
```

Render automáticamente:
1. Detectará el cambio
2. Reconstruirá la aplicación
3. Desplegará la nueva versión

---

## 📊 Verificación del Despliegue

### Probar que todo funciona:

1. **Página principal**: `https://tu-app.onrender.com/`
2. **KPI 1**: `https://tu-app.onrender.com/kpi1`
3. **KPI 2**: `https://tu-app.onrender.com/kpi2`
4. **KPI 3**: `https://tu-app.onrender.com/kpi3`
5. **KPI 6**: `https://tu-app.onrender.com/kpi6`
6. **API KPIs**: `https://tu-app.onrender.com/api/kpis`

---

## ⚠️ LIMITACIONES DEL PLAN GRATUITO

### Render Free Tier:
- ✅ **Gratis para siempre**
- ✅ SSL/HTTPS automático
- ✅ Despliegues ilimitados
- ⚠️ La app se "duerme" después de 15 min sin uso (primer acceso puede tardar 30 seg)
- ⚠️ 750 horas/mes de tiempo activo
- ⚠️ 512 MB RAM
- ⚠️ Compartido con otros usuarios

### Si necesitas más recursos:
**Plan Starter** ($7/mes):
- Sin suspensión automática
- Más RAM y CPU
- Métricas detalladas

---

## 🐛 Solución de Problemas

### Error: "Build failed"
```bash
# Verificar que requirements.txt esté correcto
cat requirements.txt

# Debe contener:
# Flask==3.0.0
# pandas==2.1.4
# numpy==1.26.2
# gunicorn==21.2.0
```

### Error: "Application failed to start"
1. Verifica que `Procfile` exista y contenga: `web: gunicorn app:app`
2. Verifica que `app.py` tenga configuración de puerto dinámica

### Los archivos .unl no se cargan
Los archivos de datos están en `data/` y deben estar en el repositorio.

Verifica en GitHub que la carpeta `data/` con los archivos `.unl` esté subida:
```powershell
# Asegurar que data/ esté incluida
git add data/
git commit -m "Agregar archivos de datos"
git push
```

---

## 🎯 Resumen Rápido (TL;DR)

```powershell
# 1. Crear repo en GitHub
# 2. En tu carpeta dashboard:

git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/TU_USUARIO/luz-del-sur-dashboard.git
git push -u origin main

# 3. Ir a render.com
# 4. New + → Web Service → Conectar GitHub repo
# 5. Configurar:
#    - Build: pip install -r requirements.txt
#    - Start: gunicorn app:app
#    - Plan: Free
# 6. Deploy!

# ¡Listo! Tu URL: https://tu-app.onrender.com
```

---

## 🌟 Opciones Alternativas

### Railway.app
- Similar a Render
- $5/mes de crédito gratis
- Más fácil de configurar
- https://railway.app

### PythonAnywhere
- Especializado en Python
- Plan gratuito con limitaciones
- https://www.pythonanywhere.com

### Heroku
- Muy popular pero ya no es gratis
- $7/mes mínimo
- https://heroku.com

---

## 📞 Contacto y Soporte

Si tienes problemas:
1. Revisa los logs en Render Dashboard
2. Verifica que todos los archivos estén en GitHub
3. Comprueba que los archivos de configuración estén correctos

---

**¡Tu Dashboard está listo para producción!** 🎉
