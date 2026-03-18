import axios from "axios"

// Configuración de la API con variables de entorno
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.MODE === 'development' 
    ? '' // Usa proxy de Vite en desarrollo
    : 'https://backend-dental-bosch-vr8o.onrender.com') // URL directa en producción

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 segundos timeout
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor para agregar token de autorización
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api