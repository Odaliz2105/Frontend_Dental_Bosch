import axios from "axios"

const api = axios.create({
  baseURL: import.meta.env.MODE === 'development' 
    ? '' // Usa proxy de Vite en desarrollo
    : 'https://backend-dental-bosch-vr8o.onrender.com' // URL directa en producción
})

export default api