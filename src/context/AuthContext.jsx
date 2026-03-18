import React, { createContext, useContext, useEffect, useState } from 'react'
import api from '../services/api'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(localStorage.getItem('token'))

  useEffect(() => {
    let isMounted = true
    
    if (token) {
      // Verificar token y obtener datos del usuario
      api.get('/api/auth/verificar-token')
        .then(response => {
          if (isMounted) {
            setUser(response.data.usuario)
          }
        })
        .catch(() => {
          if (isMounted) {
            localStorage.removeItem('token')
            setToken(null)
            setUser(null)
          }
        })
        .finally(() => {
          if (isMounted) {
            setLoading(false)
          }
        })
    } else {
      if (isMounted) {
        setLoading(false)
      }
    }
    
    return () => {
      isMounted = false
    }
  }, [token])

  const login = async (email, password) => {
    setLoading(true)
    
    console.log('Intentando login con:', { email, password: '***' })
    
    try {
      const response = await api.post('/api/auth/login', {
        email,
        password
      })
      
      console.log('Respuesta del servidor:', response.data)
      
      const { token, usuario } = response.data
      
      // Verificar si es un doctor pendiente de aprobación
      if (usuario.rol === 'doctor' && usuario.estado !== 'aprobado') {
        console.log('🚫 Doctor pendiente de aprobación:', usuario.estado)
        setLoading(false)
        return { 
          success: false, 
          error: 'Tu cuenta de doctor está pendiente de aprobación. Un administrador revisará tu solicitud y recibirás un email cuando sea aprobada.',
          requiresApproval: true
        }
      }
      
      // Verificar si el usuario está confirmado
      if (!usuario.confirmado) {
        console.log('🚫 Usuario no confirmado')
        setLoading(false)
        return { 
          success: false, 
          error: 'Por favor, confirma tu cuenta antes de iniciar sesión. Revisa tu email.',
          requiresConfirmation: true
        }
      }
      
      localStorage.setItem('token', token)
      setToken(token)
      setUser(usuario)
      setLoading(false)
      
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      
      return { success: true, data: response.data }
    } catch (error) {
      console.error('Error en login:', error.response?.data || error.message)
      setLoading(false)
      return { 
        success: false, 
        error: error.response?.data?.mensaje || error.response?.data?.msg || 'Error al iniciar sesión' 
      }
    }
  }

  const register = async (userData) => {
    setLoading(true)
    
    console.log('🔄 Registrando usuario:', userData)
    
    try {
      const response = await api.post('/api/auth/registro', userData)
      
      console.log('✅ Respuesta del servidor:', response.data)
      
      // Para doctores, no guardar el token hasta que sea aprobado
      if (userData.rol === 'doctor') {
        setLoading(false)
        return { 
          success: true, 
          data: response.data,
          mensaje: response.data.mensaje || 'Registro exitoso. Revisa tu email para confirmar tu cuenta.'
        }
      }
      
      // Para pacientes, guardar token y usuario
      const { token, usuario } = response.data
      
      localStorage.setItem('token', token)
      setToken(token)
      setUser(usuario)
      setLoading(false)
      
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      
      return { 
        success: true, 
        data: response.data,
        mensaje: response.data.mensaje || 'Registro exitoso.'
      }
    } catch (error) {
      console.error('❌ Error en registro:', error.response?.data || error.message)
      setLoading(false)
      return { 
        success: false, 
        error: error.response?.data?.mensaje || error.response?.data?.msg || 'Error al registrar usuario' 
      }
    }
  }

  const updateUser = async (userData, avatarFile = null) => {
    setLoading(true)
    
    try {
      let response
      
      if (avatarFile) {
        // Si hay archivo, usar FormData
        const formData = new FormData()
        
        console.log('📤 Datos del formulario:', userData)
        console.log('📸 Archivo seleccionado:', avatarFile.name, avatarFile.type, avatarFile.size)
        
        // Agregar campos de texto
        Object.keys(userData).forEach(key => {
          if (userData[key]) {
            formData.append(key, userData[key])
            console.log(`✅ Agregado al FormData: ${key} = ${userData[key]}`)
          }
        })
        
        // Agregar archivo de avatar
        formData.append('foto', avatarFile)
        console.log('📸 Foto agregada al FormData')
        
        // Debug: mostrar contenido del FormData
        for (let [key, value] of formData.entries()) {
          console.log(`🔍 FormData entry: ${key} =`, value instanceof File ? `File(${value.name}, ${value.type}, ${value.size})` : value)
        }
        
        response = await api.put('/api/pacientes/perfil/paciente', formData)
        // Axios establece automáticamente el Content-Type correcto para FormData
      } else {
        // Si no hay archivo, enviar JSON normal
        response = await api.put('/api/pacientes/perfil/paciente', userData)
      }
      
      setUser(response.data.usuario)
      setLoading(false)
      
      return { success: true, data: response.data }
    } catch (error) {
      console.error('❌ Error completo en updateUser:', error.response?.data || error.message)
      setLoading(false)
      return { 
        success: false, 
        error: error.response?.data?.msg || 'Error al actualizar perfil' 
      }
    }
  }

  const getProfile = async () => {
    setLoading(true)
    
    try {
      console.log('🔍 Obteniendo perfil del usuario')
      
      const response = await api.get('/api/auth/perfil')
      
      console.log('✅ Perfil obtenido:', response.data)
      
      setUser(response.data.data)
      setLoading(false)
      
      return { success: true, data: response.data }
    } catch (error) {
      console.error('❌ Error al obtener perfil:', error.response?.data || error.message)
      setLoading(false)
      return { 
        success: false, 
        error: error.response?.data?.mensaje || error.response?.data?.msg || 'Error al obtener perfil' 
      }
    }
  }

  const updateDoctorProfile = async (doctorData, avatarFile = null) => {
    setLoading(true)
    
    try {
      let response
      
      if (avatarFile) {
        // Si hay archivo, usar FormData
        const formData = new FormData()
        
        console.log('📤 Datos del doctor:', doctorData)
        console.log('📸 Archivo de foto:', avatarFile.name, avatarFile.type, avatarFile.size)
        
        // Agregar campos de texto
        Object.keys(doctorData).forEach(key => {
          if (doctorData[key]) {
            formData.append(key, doctorData[key])
            console.log(`✅ Agregado al FormData: ${key} = ${doctorData[key]}`)
          }
        })
        
        // Agregar archivo de foto
        formData.append('foto', avatarFile)
        console.log('📸 Foto agregada al FormData')
        
        // Debug: mostrar contenido del FormData
        for (let [key, value] of formData.entries()) {
          console.log(`🔍 FormData entry: ${key} =`, value instanceof File ? `File(${value.name}, ${value.type}, ${value.size})` : value)
        }
        
        response = await api.put('/api/doctores/perfil/doctor', formData)
      } else {
        // Si no hay archivo, enviar JSON normal
        response = await api.put('/api/doctores/perfil/doctor', doctorData)
      }
      
      console.log('✅ Perfil de doctor actualizado:', response.data)
      
      setUser(response.data.usuario || response.data.data)
      setLoading(false)
      
      return { success: true, data: response.data }
    } catch (error) {
      console.error('❌ Error al actualizar perfil de doctor:', error.response?.data || error.message)
      setLoading(false)
      return { 
        success: false, 
        error: error.response?.data?.mensaje || error.response?.data?.msg || 'Error al actualizar perfil' 
      }
    }
  }

  const updatePassword = async (passwordData) => {
    setLoading(true)
    
    try {
      console.log('🔄 Actualizando contraseña')
      
      const response = await api.put('/api/auth/actualizar-password', passwordData)
      
      console.log('✅ Contraseña actualizada:', response.data)
      
      setLoading(false)
      
      return { success: true, data: response.data }
    } catch (error) {
      console.error('❌ Error al actualizar contraseña:', error.response?.data || error.message)
      setLoading(false)
      return { 
        success: false, 
        error: error.response?.data?.mensaje || error.response?.data?.msg || 'Error al actualizar contraseña' 
      }
    }
  }

  const approveDoctor = async (doctorId, estado) => {
    setLoading(true)
    
    try {
      console.log(`🔄 ${estado === 'aprobado' ? 'Aprobando' : 'Rechazando'} doctor:`, doctorId)
      
      const response = await api.put(`/api/doctores/${doctorId}/estado`, {
        estado
      })
      
      console.log('✅ Respuesta del servidor:', response.data)
      
      setLoading(false)
      
      return { 
        success: true, 
        data: response.data,
        mensaje: response.data.mensaje || `Doctor ${estado} exitosamente`
      }
    } catch (error) {
      console.error('❌ Error al actualizar estado del doctor:', error.response?.data || error.message)
      setLoading(false)
      return { 
        success: false, 
        error: error.response?.data?.mensaje || error.response?.data?.msg || 'Error al actualizar estado del doctor' 
      }
    }
  }

  const getPendingDoctors = async () => {
    setLoading(true)
    
    try {
      const response = await api.get('/api/doctores/pendientes')
      
      setLoading(false)
      
      return { success: true, data: response.data }
    } catch (error) {
      setLoading(false)
      return { 
        success: false, 
        error: error.response?.data?.mensaje || 'Error al obtener doctores pendientes' 
      }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
    api.defaults.headers.common['Authorization'] = null
  }

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateUser,
    getProfile,
    updateDoctorProfile,
    updatePassword,
    approveDoctor,
    getPendingDoctors,
    isAuthenticated: !!token
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
