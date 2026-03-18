# 🚀 Guía de Despliegue en Vercel - Dental Bosch Frontend

## 📋 Requisitos Previos

1. **Cuenta en Vercel**: Crear cuenta en [vercel.com](https://vercel.com)
2. **GitHub**: Repositorio del proyecto en GitHub
3. **Variables de entorno**: URL del backend configurada

## 🔧 Configuración Realizada

Ya he configurado los siguientes archivos para el despliegue:

### 1. `vercel.json` - Configuración de Vercel
- ✅ Versión 2 de configuración
- ✅ Build configuration para React/Vite
- ✅ Rewrites para SPA routing
- ✅ Headers CORS para API calls

### 2. `vite.config.js` - Optimizado para producción
- ✅ Configuración de build optimizada
- ✅ Source maps habilitados
- ✅ Code splitting manual para mejor rendimiento

### 3. Variables de Entorno
- ✅ `.env.production` - URL del backend para producción
- ✅ `.env.example` - Plantilla para desarrollo

## 🚀 Pasos para Despliegue

### Paso 1: Preparar Repositorio en GitHub
```bash
# Asegurarse que todos los cambios estén commiteados
git add .
git commit -m "Configuración para despliegue en Vercel"
git push origin main
```

### Paso 2: Conectar con Vercel
1. Iniciar sesión en [vercel.com](https://vercel.com)
2. Hacer clic en **"New Project"**
3. Importar el repositorio desde GitHub
4. Vercel detectará automáticamente que es un proyecto React/Vite

### Paso 3: Configurar Variables de Entorno
En el dashboard de Vercel:
1. Ir a **Settings** → **Environment Variables**
2. Agregar la variable:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://backend-dental-bosch-vr8o.onrender.com`
   - **Environment**: Production, Preview, Development

### Paso 4: Configurar Build Settings
Vercel debería detectar automáticamente:
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Paso 5: Desplegar
1. Hacer clic en **"Deploy"**
2. Esperar el proceso de build y despliegue
3. Obtener la URL del sitio desplegado

## 🔍 Verificación Post-Despliegue

### 1. Funcionalidad Básica
- ✅ Página principal carga correctamente
- ✅ Rutas funcionan (login, registro, dashboard)
- ✅ Redirecciones SPA funcionan

### 2. Conexión con Backend
- ✅ Login funciona con el backend
- ✅ Registro de usuarios
- ✅ Recuperación de contraseña

### 3. Optimización
- ✅ Tiempo de carga aceptable
- ✅ Responsive design funciona
- ✅ Animaciones cargan correctamente

## 🛠️ Comandos Útiles

### Build Local (para testing)
```bash
npm run build
npm run preview
```

### Verificar Build
```bash
# Revisar archivos generados
ls -la dist/
```

### Debug en Producción
```bash
# Verificar variables de entorno
vercel env ls
```

## ⚠️ Problemas Comunes y Soluciones

### 1. Error 404 en rutas
**Problema**: Las rutas no funcionan al recargar la página
**Solución**: El `vercel.json` ya tiene la configuración de rewrites

### 2. Error de conexión con backend
**Problema**: No se puede conectar al API
**Solución**: Verificar que `VITE_API_URL` esté configurada correctamente

### 3. Build falla
**Problema**: Error durante el build
**Solución**: 
```bash
# Limpiar cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### 4. Variables de entorno no funcionan
**Problema**: Las variables no se cargan en producción
**Solución**: Asegurarse que comiencen con `VITE_` y estén configuradas en Vercel

## 🔄 Despliegue Automático (CI/CD)

Una vez configurado, cada push a la rama principal:
1. **Trigger automático** del build
2. **Despliegue** automático a producción
3. **Preview URLs** para cada PR

## 📊 Monitoreo

Vercel proporciona:
- **Analytics**: Estadísticas de visitas
- **Speed Insights**: Rendimiento del sitio
- **Logs**: Errores y eventos
- **Build Logs**: Proceso de compilación

## 🎯 Optimizaciones Adicionales (Opcional)

### 1. Custom Domain
```bash
# En Vercel dashboard
Settings → Domains → Add custom domain
```

### 2. Edge Functions (si se necesita)
```javascript
// api/funcion.js
export default function handler(req, res) {
  // Lógica de edge function
}
```

### 3. Imagen Optimization
```javascript
// Usar next/image o similar si se migra a Next.js
```

---

## ✅ Checklist Final de Despliegue

- [ ] Repositorio en GitHub actualizado
- [ ] Cuenta Vercel creada
- [ ] Proyecto importado en Vercel
- [ ] Variables de entorno configuradas
- [ ] Build settings verificados
- [ ] Despliegue exitoso
- [ ] Funcionalidad básica probada
- [ ] Conexión con backend verificada
- [ ] Responsive design confirmado

## 🎉 ¡Listo para Producción!

Una vez completados estos pasos, tu aplicación Dental Bosch estará completamente desplegada y funcionando en Vercel con todas las optimizaciones necesarias.
