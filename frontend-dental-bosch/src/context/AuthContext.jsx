import React, { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext()

/* eslint-disable */
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
/* eslint-enable */

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(localStorage.getItem('token'))

  useEffect(() => {
    if (token) {
      // Verificar token y obtener datos del usuario
      api.get('/api/auth/verificar-token')
        .then(response => {
          setUser(response.data.usuario)
        })
        .catch(() => {
          localStorage.removeItem('token')
          setToken(null)
          setUser(null)
        })
        .finally(() => {
          setTimeout(() => setLoading(false), 0)
        })
    } else {
      setTimeout(() => setLoading(false), 0)
    }
  }, [token])

  const login = async (credentials) => {
    try {
      const response = await api.post('/api/auth/login', credentials)
      const { token, usuario } = response.data
      
      localStorage.setItem('token', token)
      setToken(token)
      setUser(usuario)
      
      // Configurar Axios para incluir token en futuras peticiones
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.msg || 'Error al iniciar sesión' 
      }
    }
  }

  const register = async (userData) => {
    try {
      console.log('📤 Enviando al backend:', userData)
      console.log('📋 JSON.stringify:', JSON.stringify(userData))
      const response = await api.post('/api/auth/registro', userData)
      console.log('📥 Respuesta del backend:', response.data)
      return { success: true, data: response.data }
    } catch (error) {
      console.log('❌ Error del backend:', error.response?.data)
      console.log('❌ Status del error:', error.response?.status)
      console.log('❌ Error completo:', JSON.stringify(error.response?.data, null, 2))
      const errorMessage = error.response?.data?.mensaje || error.response?.data?.msg || error.response?.data?.error || 'Error al registrarse'
      return { 
        success: false, 
        error: errorMessage
      }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
    delete api.defaults.headers.common['Authorization']
  }

  const updateProfile = async (userData) => {
    try {
      const response = await api.put('/api/auth/perfil', userData)
      setUser(response.data.usuario)
      return { success: true, data: response.data }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.msg || 'Error al actualizar perfil' 
      }
    }
  }

  // Configurar Axios para incluir token si existe
  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }
  }, [token])

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!token
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
