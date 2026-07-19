<div align="center">

# Dental Bosch — Frontend Web
### Trabajo de Integración Curricular
### Escuela Politécnica Nacional
#### Tecnología Superior en Desarrollo de Software

*Sistema web que automatiza procesos administrativos y clínicos del consultorio odontológico.*

</div>

## 1. Descripción

El Consultorio Odontológico Dental Bosch es un centro especializado en el cuidado de la salud bucal. Este repositorio contiene el **Frontend Web** del sistema de gestión odontológica, desarrollado para centralizar y optimizar tanto la información administrativa como clínica. 

El sistema reduce el manejo manual de registros y se comunica mediante una API REST con un backend independiente. Esta aplicación web está dirigida de manera exclusiva a los profesionales del consultorio, permitiendo la interacción de dos roles principales: **Administrador** y **Doctor**. Los pacientes no utilizan este sistema web, ya que cuentan con una aplicación móvil independiente para sus gestiones.

### Arquitectura General

```text
Frontend Web (React)
        │
        │ Axios
        ▼
Backend REST (Node.js + Express)
        │
        ▼
MongoDB Atlas
```

## 2. Aplicación en producción

El frontend de este proyecto se encuentra desplegado en la plataforma Vercel y está integrado con GitHub para permitir despliegues automáticos ante nuevos cambios en la rama principal. 

Puedes acceder a la aplicación mediante la siguiente URL pública:
**https://frontend-dental-bosch.vercel.app/**

## 3. Recursos importantes

| Recurso | Enlace |
| --- | --- |
| Aplicación en producción | https://frontend-dental-bosch.vercel.app/ |
| Repositorio | https://github.com/Odaliz2105/Frontend_Dental_Bosch |
| Política de privacidad | https://frontend-dental-bosch.vercel.app/privacy |
| Términos del servicio | https://frontend-dental-bosch.vercel.app/terms |
| Video demostrativo | https://epnecuador-my.sharepoint.com/:f:/g/personal/odaliz_balseca_epn_edu_ec/IgCOnKUxve-TQrvt-t-Oe8e4AdTKkX_GD-TC2bNlYuww1zs?e=hyEuvh |
| Documento de tesis | https://drive.google.com/file/d/1_uViQ7JipXcEG6grp8PstX-Z-3MhDNg8/view?usp=sharing |
| APK Android | [Descargar desde Google Drive](https://drive.google.com/drive/folders/1EPWnVI_3bKyHwBH9dlgu-_4HFAoDS9dB?usp=sharing) |

## 4. Funcionalidades públicas

Cualquier usuario que visite la aplicación web puede acceder a las siguientes funcionalidades sin necesidad de autenticación:

- **Landing Page**: Información general sobre el consultorio.
- **Página de servicios**: Catálogo de tratamientos ofrecidos.
- **Contacto mediante WhatsApp**: Enlaces directos a los números telefónicos del consultorio.
- **Descarga de APK Android**: Modal para descargar la app móvil de pacientes.
- **Inicio de sesión**: Formulario de acceso para Administradores y Doctores.
- **Registro de Doctor**: Formulario para que nuevos profesionales soliciten acceso al sistema.
- **Confirmación de cuenta**: Ruta para validar el correo electrónico.
- **Recuperación de contraseña**: Solicitud de enlace para restablecer credenciales.
- **Restablecimiento de contraseña**: Formulario de cambio seguro de clave mediante un token.
- **Política de Privacidad**.
- **Términos del Servicio**.

## 5. Roles del sistema

El sistema maneja dos roles que interactúan con paneles de control dedicados:

### Administrador
El administrador es un profesional del consultorio que posee privilegios administrativos totales. Sus funciones incluyen:
- Iniciar y cerrar sesión.
- Consultar y actualizar su perfil.
- Gestionar solicitudes de registro de doctores (visualizar pendientes, consultar detalle, aprobar o rechazar solicitudes).
- Listar, buscar, filtrar, consultar detalle y desactivar doctores aprobados.
- Consultar pacientes registrados, buscar y ver detalles de los mismos.
- Consultar citas, buscar, filtrar, ver el detalle de cada una y reasignar citas pendientes.
- Visualizar indicadores globales en el panel administrativo.

### Doctor
El doctor tiene acceso a las herramientas clínicas y a su agenda personal. Sus funciones incluyen:
- Iniciar y cerrar sesión.
- Consultar y actualizar su perfil profesional, incluyendo su contraseña y horarios de atención.
- Consultar y buscar pacientes que le han sido asignados.
- Consultar y filtrar citas asignadas, ver el detalle de las mismas, atender a los pacientes, o bien, finalizar y cancelar citas.
- Crear y consultar la historia clínica de los pacientes.
- Registrar y editar consultas clínicas, incluyendo antecedentes, signos vitales, examen estomatognático, diagnósticos CIE-10 y plan de diagnóstico.
- Gestionar el odontograma interactivo, seleccionando el tipo de dentición, piezas y superficies dentales para registrar hallazgos clínicos e indicadores de salud bucal, así como registrar tratamientos gráficos (modo edición activo solo durante la consulta).
- Registrar tratamientos odontológicos específicos, consultar tratamientos vigentes y el historial cronológico de los mismos.
- Agendar citas de seguimiento para los pacientes atendidos.

## 6. Módulos principales

### Autenticación y seguridad
El sistema cuenta con un flujo seguro basado en **JWT** (JSON Web Tokens). Incluye registro de nuevos doctores, inicio de sesión, confirmación de cuentas por correo electrónico, recuperación y restablecimiento de contraseñas mediante tokens. Las rutas están protegidas y controladas por roles. Además, el sistema intercepta respuestas HTTP 401 para efectuar cierres de sesión automáticos.

### Gestión administrativa
Módulo exclusivo del administrador, donde se centraliza la revisión de solicitudes de acceso, la gestión integral de doctores habilitados y de los pacientes registrados, la administración de todas las citas generadas y un dashboard administrativo.

### Gestión clínica
Herramientas para el trabajo diario del doctor. Permite la revisión de pacientes y citas asignadas. Maneja una historia clínica completa que engloba consultas donde se registran antecedentes, signos vitales, exámenes estomatognáticos y diagnósticos basados en la codificación CIE-10. También facilita agendar el seguimiento de los tratamientos.

### Odontograma digital
Componente interactivo y visual que permite al doctor evaluar gráficamente la boca del paciente. Soporta dentición permanente, temporal y mixta utilizando la nomenclatura FDI. Permite interactuar con piezas dentales y sus superficies para registrar hallazgos, simbología, patologías y tratamientos. Permite medir índices como el CPO y otros indicadores de salud bucal. Su edición está restringida exclusivamente a consultas activas, ofreciendo un modo de lectura para revisiones posteriores.

### Tratamientos odontológicos
Módulo vinculado a la historia clínica donde el doctor registra la ejecución de tratamientos, asociándolos a diagnósticos y procedimientos puntuales. Permite incorporar la prescripción respectiva, añadir observaciones generales y consultar el historial cronológico para hacer seguimiento de la evolución del paciente.

### Página pública y aplicación móvil
El frontend expone de forma pública la información del consultorio, los servicios brindados, horarios y medios de contacto. Adicionalmente, facilita a los pacientes el acceso directo para la descarga del archivo APK de la aplicación móvil exclusiva para ellos.

## 7. Pantallas del sistema

### Página principal
<img width="1593" height="861" alt="image" src="https://github.com/user-attachments/assets/2ac17a26-1d4d-4117-ab2b-272f9e2a344b" />


### Servicios
<img width="1602" height="862" alt="image" src="https://github.com/user-attachments/assets/0ba7323e-7655-4290-b227-e5c81a4c705c" />


### Inicio de sesión
<img width="1621" height="859" alt="image" src="https://github.com/user-attachments/assets/b6efaa96-4c56-4a56-8274-9c49a4deae8b" />


### Registro de Doctor
<img width="1599" height="858" alt="image" src="https://github.com/user-attachments/assets/79034f22-129b-4fbc-b503-a801814244be" />


### Recuperación de contraseña
<img width="645" height="706" alt="image" src="https://github.com/user-attachments/assets/dd531259-0fc0-40db-9a6d-e07f13f848ee" />


### Panel del Administrador y Solicitudes de doctores
<img width="1597" height="861" alt="image" src="https://github.com/user-attachments/assets/b6d94c9b-948c-450d-98be-9808171a8ddc" />


### Doctores
<img width="1600" height="855" alt="image" src="https://github.com/user-attachments/assets/c1f56614-d61d-4a3d-8d01-618111a8401d" />


### Pacientes
<img width="1598" height="864" alt="image" src="https://github.com/user-attachments/assets/586e0883-3f31-4121-a736-2626ba3ca78f" />


### Citas
<img width="1598" height="863" alt="image" src="https://github.com/user-attachments/assets/91272666-8403-4f60-af91-6d5aa3657867" />


### Panel del Doctor
<img width="1603" height="860" alt="image" src="https://github.com/user-attachments/assets/913cd4e2-7823-4ea4-9c38-65f9b3897010" />


### Historia clínica
<img width="1605" height="858" alt="image" src="https://github.com/user-attachments/assets/74b6e147-7bf5-4036-b2b1-196c940af491" />


### Consulta clínica
<img width="1600" height="858" alt="image" src="https://github.com/user-attachments/assets/1fb5aa9c-07fb-40e8-b6f3-026a647c8909" />


### Odontograma
<img width="654" height="420" alt="image" src="https://github.com/user-attachments/assets/de8729e5-e506-474a-8f38-4931dcf0828b" />


### Indicadores de salud bucal
<img width="654" height="216" alt="image" src="https://github.com/user-attachments/assets/5d1a9907-290b-497f-85ae-6b464745afc2" />


### Tratamientos
<img width="481" height="347" alt="image" src="https://github.com/user-attachments/assets/67f9a569-c8e4-46f6-a9bb-4cd784cdbc8b" />


### Cita de seguimiento
<img width="1577" height="705" alt="image" src="https://github.com/user-attachments/assets/9c96ff91-5742-4121-ae50-97d1241b0a7c" />


## 8. Tecnologías utilizadas

<div align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/axios-671ddf?style=for-the-badge&logo=axios&logoColor=white" alt="Axios" />
  <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/GIT-E44C30?style=for-the-badge&logo=git&logoColor=white" alt="Git" />
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
</div>
<br>

### Herramientas

| Herramienta | Uso en el proyecto |
| --- | --- |
| Visual Studio Code | Edición del código |
| Node.js | Ejecución del entorno de desarrollo |
| npm | Administración de dependencias |
| Vite | Servidor de desarrollo y compilación |
| Git | Control de versiones |
| GitHub | Repositorio remoto |
| Vercel | Despliegue |
| ESLint | Análisis estático |
| PostCSS | Procesamiento de estilos |

### Librerías

| Librería | Versión |
| --- | --- |
| React | ^19.2.0 |
| React DOM | ^19.2.0 |
| React Router DOM | ^7.13.1 |
| Axios | ^1.13.6 |
| Framer Motion | ^12.35.2 |
| Lucide React | ^0.577.0 |
| Tailwind CSS | ^3.4.3 |
| Autoprefixer | ^10.4.27 |

*Nota: Se emplea* **Context API**, *funcionalidad nativa de React utilizada para compartir el estado global de autenticación en la aplicación.*

## 9. Arquitectura del frontend

El proyecto utiliza una adaptación del patrón **Modelo–Vista–Controlador (MVC)**, orientada a la biblioteca React. Cabe aclarar que esta es una adaptación exclusiva para frontend y no una implementación clásica de backend MVC.

- **Modelo**: Constituido por los servicios y la instancia configurada de `api.js`. Engloba las operaciones administrativas y clínicas, la gestión de datos recibidos del servidor, el estado de la aplicación y la integración con el `AuthContext`.
- **Vista**: Representada por la capa visual a través de las páginas, los componentes reutilizables, los formularios, los paneles de control (dashboards), el odontograma visual y la interfaz de tratamientos.
- **Controlador**: Gestionado por las funciones manejadoras dentro de los componentes, el despacho de eventos, el uso de Hooks nativos y personalizados, las validaciones de negocio en el lado del cliente, las directrices de navegación, el consumo ordenado de la API y el uso de Context API.

## 10. Estructura del proyecto

```text
src/
├── admin/
│   └── components/
├── assets/
├── common/
├── components/
│   ├── Button.jsx
│   ├── Navbar.jsx
│   ├── OdontogramaVisual.jsx
│   ├── ProtectedRoute.jsx
│   └── Sidebar.jsx
├── context/
│   └── AuthContext.jsx
├── doctor/
│   └── components/
├── pages/
│   ├── admin/
│   │   ├── AdminDashboardPage.jsx
│   │   └── TabCitas.jsx
│   ├── doctor/
│   │   ├── DoctorDashboardPage.jsx
│   │   └── components/
│   │       ├── FormularioConsulta.jsx
│   │       ├── TabHistorias.jsx
│   │       ├── TabOdontograma.jsx
│   │       └── TabTratamientos.jsx
│   ├── LandingPage.jsx
│   ├── LoginPage.jsx
│   └── RegisterPage.jsx
├── services/
│   ├── api.js
│   └── doctorService.js
├── App.jsx
└── main.jsx
```

## 11. Flujo de autenticación

1. El Doctor se registra desde la ruta pública completando sus datos.
2. Se envían los datos al backend para su creación.
3. Se confirma la cuenta a través del enlace recibido por correo electrónico.
4. Una vez confirmada, la cuenta del Doctor queda en estado pendiente.
5. El Administrador revisa la solicitud en su panel de control.
6. El Administrador aprueba (o rechaza) la solicitud del profesional.
7. El usuario (Administrador o Doctor aprobado) inicia sesión.
8. El backend valida las credenciales y devuelve un token JWT.
9. El token se almacena localmente en `localStorage`.
10. Axios adjunta el token de forma automática mediante un interceptor en el encabezado `Authorization` para futuras peticiones.
11. El sistema identifica el rol asignado a la cuenta desde la respuesta del login.
12. Se redirige al dashboard correspondiente (Administrador o Doctor).
13. Una respuesta HTTP 401 (no autorizado) por parte del servidor provoca el cierre de sesión automático, limpia el `localStorage` y redirige al inicio de sesión.
14. En caso de pérdida, el usuario puede recuperar y restablecer su contraseña mediante el proceso de recuperación de clave.

## 12. Integración con el backend

El frontend interactúa exclusivamente a través del consumo de una API REST. Para esto, se hace uso de la librería **Axios** en una instancia centralizada configurada en `api.js`. 

Dicha instancia utiliza la variable de entorno `VITE_API_URL` para conectarse a los servicios web. La comunicación cuenta con interceptores encargados de añadir de manera automática el encabezado de `Authorization` con el token vigente. El código incluye manejo global de errores y tiempos de expiración (`timeout`), manteniendo una rigurosa separación de responsabilidades a través de distintos archivos de servicios (clínicos y administrativos). Se identifica en la configuración que el backend principal se encuentra desplegado en la plataforma Render.

## 13. Endpoints principales

### Autenticación y Usuarios
| Método | Ruta | Uso dentro del frontend |
| --- | --- | --- |
| POST | `/api/auth/login` | Iniciar sesión y obtener token JWT |
| POST | `/api/doctores/registro` | Registrar una nueva cuenta de doctor |
| GET | `/api/doctores/perfil/doctor` | Obtener el perfil profesional del doctor |
| PUT | `/api/doctores/perfil/doctor` | Actualizar la información del perfil del doctor |

### Citas del Doctor
| Método | Ruta | Uso dentro del frontend |
| --- | --- | --- |
| GET | `/api/doctores/mis-pacientes` | Obtener listado de pacientes asignados |
| GET | `/api/citas/doctor` | Consultar y buscar las citas asignadas al doctor |
| POST | `/api/doctores/citas` | Agendar citas desde el panel del doctor |
| PUT | `/api/doctores/citas/:citaId/estado` | Modificar estado de citas (finalizar/cancelar) |

### Historia Clínica y Consultas
| Método | Ruta | Uso dentro del frontend |
| --- | --- | --- |
| GET | `/api/historial-clinico/:pacienteId` | Obtener historia clínica de un paciente |
| POST | `/api/historial-clinico/:pacienteId` | Crear historia clínica base para un paciente |
| GET | `/api/historial-clinico/:pacienteId/consultas` | Filtrar y obtener consultas del paciente |
| POST | `/api/historial-clinico/:pacienteId/consulta` | Agregar una nueva consulta al historial |
| PUT | `/api/historial-clinico/:pacienteId/consulta/:consultaId` | Actualizar datos de una consulta específica |

### Odontograma
| Método | Ruta | Uso dentro del frontend |
| --- | --- | --- |
| POST | `/api/historial-clinico/:pacienteId/consulta/:consultaId/odontograma/inicializar` | Configurar tipo de dentición y habilitar odontograma |
| GET | `/api/historial-clinico/:pacienteId/consulta/:consultaId/odontograma/visual` | Consultar estado visual e indicadores del odontograma |
| PUT | `/api/historial-clinico/:pacienteId/consulta/:consultaId/odontograma/diente/:numeroDiente` | Actualizar estado de una pieza dental específica |

### Tratamientos
| Método | Ruta | Uso dentro del frontend |
| --- | --- | --- |
| GET | `/api/tratamientos/paciente/:pacienteId` | Consultar el historial de tratamientos aplicados |
| POST | `/api/tratamientos/paciente/:pacienteId` | Registrar un tratamiento a una consulta específica |
| PUT | `/api/tratamientos/:tratamientoId` | Actualizar un tratamiento registrado |
| DELETE | `/api/tratamientos/:tratamientoId` | Eliminar un tratamiento del historial |

## 14. Requisitos previos

Para poder ejecutar el entorno de desarrollo necesitas contar con:
- Git.
- Node.js (compatible con Vite 7, se recomienda v18 o superior).
- npm.
- Un editor de código recomendado (por ejemplo, Visual Studio Code).

## 15. Instalación y ejecución local

Clona el repositorio desde GitHub e ingresa al directorio generado:
```bash
git clone https://github.com/Odaliz2105/Frontend_Dental_Bosch.git
cd Frontend_Dental_Bosch
```

Instala las dependencias del proyecto:
```bash
npm install
```

Crea en la raíz del proyecto un archivo `.env` configurando la ruta de la API:
```env
VITE_API_URL=https://URL-DEL-BACKEND
```

Inicia el entorno de desarrollo local:
```bash
npm run dev
```

## 16. Despliegue

El despliegue de esta aplicación de página única (SPA) se efectúa a través de **Vercel**. La plataforma se encuentra directamente conectada con el repositorio de GitHub, ejecutando de manera automática un proceso de despliegue con cada nuevo commit en la rama de producción.

Vercel utiliza internamente el comando de compilación para producir los archivos estáticos en la carpeta de salida `dist`. Para que el enrutamiento funcione de forma idónea en un entorno SPA y evitar errores 404 al recargar páginas, se hace uso del archivo de configuración `vercel.json` incluido en el código fuente.

## 17. Metodología Scrum

El proyecto se organizó en un Sprint 0 y seis iteraciones posteriores, para un total de siete iteraciones documentadas.

| Sprint | Descripción |
| --- | --- |
| Sprint 0 | Preparación del entorno de desarrollo |
| Sprint 1 | Autenticación y gestión del perfil |
| Sprint 2 | Gestión administrativa |
| Sprint 3 | Gestión clínica |
| Sprint 4 | Gestión odontológica |
| Sprint 5 | Pruebas |
| Sprint 6 | Despliegue |

## 18. Pruebas realizadas

Para validar el correcto comportamiento de la interfaz gráfica y su compatibilidad en los dispositivos, se realizaron evaluaciones exhaustivas de:
- Compatibilidad.
- Accesibilidad.
- Rendimiento.

Herramientas empleadas durante la etapa de pruebas:
- Browserling / LambdaTest (para compatibilidad de navegadores).
- WAVE.
- Google PageSpeed Insights.

## 19. Scripts disponibles

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Genera la compilación de producción |
| `npm run preview` | Ejecuta una vista previa de producción |
| `npm run lint` | Analiza el código con ESLint |

## 20. Autora

**Odaliz Balseca Valencia**  
odaliz.balseca@epn.edu.ec

balsecaodaliz@gmail.com

Escuela Politécnica Nacional.  
Escuela de Formación de Tecnólogos.  
Carrera: Tecnología Superior en Desarrollo de Software.  
Año: 2026.  

Tutor o director: Ing. Ivonne Maldonado Soliz Msc.

---

