# 🦷 Dental Bosch - Frontend

Aplicación web moderna para la gestión de consultorio dental, construida con React 19, Vite y TailwindCSS.

## 🚀 Características

### 🔐 Autenticación Completa
- ✅ Registro de usuarios con validación
- ✅ Login con manejo de errores específicos
- ✅ Confirmación de cuenta por email
- ✅ Recuperación de contraseña con token
- ✅ Restablecimiento de contraseña seguro

### 👥 Gestión de Usuarios
- ✅ Perfil de usuario con edición
- ✅ Subida de fotos de perfil
- ✅ Actualización de datos en tiempo real
- ✅ Dashboard según rol (paciente/doctor/admin)

### 🎨 UI/UX Moderna
- ✅ Diseño responsive con TailwindCSS
- ✅ Animaciones con Framer Motion
- ✅ Componentes reutilizables
- ✅ Navegación intuitiva con sidebar

### 🔧 Características Técnicas
- ✅ React 19 con hooks modernos
- ✅ React Router para navegación
- ✅ Axios para comunicación con backend
- ✅ Context API para manejo de estado
- ✅ ESLint para código limpio

## 🛠️ Tecnologías

- **Frontend**: React 19, Vite, TailwindCSS
- **Animaciones**: Framer Motion
- **Iconos**: Lucide React
- **HTTP**: Axios
- **Routing**: React Router DOM
- **Estado**: Context API

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Construir para producción
npm run build

# Verificar código con ESLint
npm run lint
```

## 🔗 Backend

El frontend se conecta con el backend de Dental Bosch:
- **URL**: `https://backend-dental-bosch-vr8o.onrender.com`
- **API**: RESTful con autenticación JWT
- **Base de datos**: MongoDB

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── Button.jsx      # Botón estilizado
│   ├── Input.jsx       # Input con validación
│   ├── Logo.jsx        # Logo de la app
│   ├── Navbar.jsx      # Barra de navegación
│   ├── Sidebar.jsx     # Sidebar de navegación
│   └── ProtectedRoute.jsx # Rutas protegidas
├── context/            # Contexto de autenticación
│   └── AuthContext.jsx # Manejo de estado de auth
├── pages/              # Páginas de la aplicación
│   ├── LandingPage.jsx         # Página principal
│   ├── LoginPage.jsx           # Login
│   ├── RegisterPage.jsx        # Registro
│   ├── DashboardPage.jsx       # Dashboard principal
│   ├── ProfilePage.jsx         # Perfil de usuario
│   ├── ForgotPasswordPage.jsx  # Recuperar contraseña
│   ├── ResetPasswordPage.jsx   # Restablecer contraseña
│   ├── ConfirmAccountPage.jsx  # Confirmar cuenta
│   └── TestAPI.jsx             # Tests de API
├── services/           # Servicios de API
│   └── api.js         # Configuración de Axios
└── App.jsx            # Componente principal con rutas
```

## 🔐 Flujo de Autenticación

1. **Registro**: Usuario se registra → Email de confirmación
2. **Confirmación**: Usuario confirma email → Cuenta activada
3. **Login**: Usuario inicia sesión → Token JWT
4. **Dashboard**: Acceso según rol → Funcionalidades específicas
5. **Perfil**: Edición de datos y foto
6. **Recuperación**: Olvido de contraseña → Email con token

## 🎯 Endpoints Principales

- `POST /api/auth/registro` - Registro
- `POST /api/auth/login` - Login
- `GET /api/auth/confirmar/:token` - Confirmar cuenta
- `POST /api/auth/recuperar-password` - Recuperar contraseña
- `POST /api/auth/restablecer-password/:token` - Restablecer contraseña
- `GET /api/auth/perfil` - Ver perfil
- `PUT /api/pacientes/perfil/paciente` - Actualizar perfil

## 🚀 Despliegue

El proyecto está configurado para despliegue en Vercel con `vercel.json`.

## 📄 Licencia

 2024 Dental Bosch - Todos los derechos reservados

## 🤝 Contribuciones

¡Contribuciones son bienvenidas! Por favor sigue las guías de código y haz un pull request.

---

**Desarrollado con ❤️ para Dental Bosch**
