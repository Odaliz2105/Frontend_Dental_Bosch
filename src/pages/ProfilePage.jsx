import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Briefcase,
  Save,
  Camera,
  Loader2,
  CheckCircle,
  XCircle
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import Button from '../components/Button'
import Sidebar from '../components/Sidebar'

const ProfilePage = () => {
  const { user, updateUser, refreshUserData, syncDoctorData } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    nombre: user?.nombre || '',
    apellido: user?.apellido || '',
    telefono: user?.telefono || '',
    email: user?.email || '',
    especialidad: user?.especialidad || ''
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.nombre || '',
        apellido: user.apellido || '',
        telefono: user.telefono || '',
        email: user.email || '',
        especialidad: user.especialidad || ''
      })
    }
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Limpiar error cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
    
    // Limpiar mensajes
    setSuccess('')
    setError('')
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido'
    }
    
    if (!formData.apellido.trim()) {
      newErrors.apellido = 'El apellido es requerido'
    }
    
    if (!formData.telefono.trim()) {
      newErrors.telefono = 'El teléfono es requerido'
    } else if (!/^\d{10}$/.test(formData.telefono.replace(/\s/g, ''))) {
      newErrors.telefono = 'El teléfono debe tener 10 dígitos'
    }
    
    // Validación específica para doctor
    if (user?.rol === 'doctor') {
      if (!formData.especialidad.trim()) {
        newErrors.especialidad = 'La especialidad es requerida'
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setLoading(true)
    setError('')
    setSuccess('')
    
    try {
      let result
      
      // Para doctores, usar la función de sincronización especial
      if (user?.rol === 'doctor') {
        const doctorData = {
          nombre: formData.nombre,
          apellido: formData.apellido,
          telefono: formData.telefono,
          especialidad: formData.especialidad
        }
        result = await syncDoctorData(doctorData)
      } else {
        const response = await api.put('/api/auth/perfil', formData)
        result = { success: response.data.success }
        
        if (response.data.usuario) {
          updateUser(response.data.usuario)
        }
      }
      
      if (result.success) {
        setSuccess('Perfil actualizado exitosamente')
        
        // Limpiar mensajes después de 3 segundos
        setTimeout(() => {
          setSuccess('')
        }, 3000)
      } else {
        setError(result.error || 'Error al actualizar el perfil')
      }
    } catch (err) {
      console.error('Error al actualizar perfil:', err)
      setError(err.response?.data?.mensaje || 'Error al actualizar el perfil')
    } finally {
      setLoading(false)
    }
  }

  const renderField = (name, label, type = 'text', required = false, options = []) => {
    const value = formData[name] || ''
    const hasError = errors[name]
    
    // Solo mostrar campos permitidos por rol
    if (user?.rol === 'doctor') {
      if (!['nombre', 'apellido', 'telefono', 'especialidad'].includes(name)) return null
    }
    
    // El email es de solo lectura
    if (name === 'email') {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-2"
        >
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
          <input
            type={type}
            name={name}
            value={value}
            readOnly
            className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
          />
        </motion.div>
      )
    }
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-2"
      >
        <label className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        
        {type === 'select' ? (
          <select
            name={name}
            value={value}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
              hasError ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Seleccionar...</option>
            {options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            name={name}
            value={value}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
              hasError ? 'border-red-500' : 'border-gray-300'
            }`}
          />
        )}
        
        <AnimatePresence>
          {hasError && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-red-500 text-sm flex items-center gap-1"
            >
              <XCircle size={14} />
              {errors[name]}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <div className="flex-1 lg:ml-64">
        <div className="p-3 lg:p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-5xl mx-auto"
          >
            <div className="bg-white rounded-xl shadow-sm p-4 lg:p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Mi Perfil</h1>
                  <p className="text-gray-600 mt-1">
                    {user?.rol === 'doctor' ? 'Información del doctor' : 
                     'Información del administrador'}
                  </p>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Rol</p>
                    <p className="font-medium capitalize">{user?.rol}</p>
                  </div>
                  
                  <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center text-white text-xl font-bold">
                    {user?.nombre?.charAt(0)?.toUpperCase()}
                  </div>
                </div>
              </div>

              <AnimatePresence>
                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3"
                  >
                    <CheckCircle className="text-green-500" size={20} />
                    <p className="text-green-700">{success}</p>
                  </motion.div>
                )}
                
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3"
                  >
                    <XCircle className="text-red-500" size={20} />
                    <p className="text-red-700">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderField('nombre', 'Nombre', 'text', true)}
                  {renderField('apellido', 'Apellido', 'text', true)}
                  {renderField('email', 'Email', 'email')}
                  {renderField('telefono', 'Teléfono', 'tel', true)}
                </div>

                {/* Campo específico para doctor */}
                {user?.rol === 'doctor' && (
                  <div className="space-y-4">
                    <h3 className="text-base font-semibold text-gray-900 pt-3 border-t">Información Profesional</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {renderField('especialidad', 'Especialidad', 'text', true)}
                    </div>
                  </div>
                )}

                <div className="flex justify-end pt-4 border-t">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="min-w-[180px]"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin mr-2" size={18} />
                        Guardando...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2" size={18} />
                        Guardar Cambios
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
