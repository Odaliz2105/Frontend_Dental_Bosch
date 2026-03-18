import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Edit2, 
  Save, 
  X,
  Camera,
  Shield,
  Clock,
  Upload,
  Settings
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Sidebar from '../components/Sidebar'
import Button from '../components/Button'
import Input from '../components/Input'
import Logo from '../components/Logo'
import { useNavigate } from 'react-router-dom'

const ProfilePage = () => {
  const { user, updateUser } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const fileInputRef = useRef(null)
  
  // Detectar si es administrador
  const isAdmin = user?.rol === 'admin' || 
                 user?.rol === 'administrador' || 
                 user?.email === 'admin@dentalbosch.com'
  
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    cedula: '',
    email: ''
  })

  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.nombre || '',
        apellido: user.apellido || '',
        telefono: user.telefono || '',
        cedula: user.cedula || '',
        email: user.email || ''
      })
    }
  }, [user])

  // Actualizar datos del usuario - eliminamos esta función redundante
  // const updateUserProfile = (userData) => {
  //   updateUser(userData)
  // }

  // Auto-ocultar mensaje de éxito
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess('')
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [success])

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
  }

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
      
      // Crear preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
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
    } else if (!/^[0-9]{9,10}$/.test(formData.telefono.replace(/\s/g, ''))) {
      newErrors.telefono = 'El teléfono no es válido'
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
    setErrors({})
    setSuccess('')
    
    try {
      // Si hay archivo seleccionado, intentar subirlo
      // Si no, actualizar solo los datos de texto
      let result
      
      if (selectedFile) {
        // Intentar actualizar con imagen
        result = await updateUser(formData, selectedFile)
        
        // Si falla por error de imagen, intentar solo con datos
        if (!result.success && result.error?.includes('imagen')) {
          console.log('⚠️ Error con imagen, intentando solo datos de texto...')
          result = await updateUser(formData, null)
        }
      } else {
        // Actualizar solo datos de texto
        result = await updateUser(formData, null)
      }
      
      if (result.success) {
        setSuccess('✅ Perfil actualizado exitosamente')
        setIsEditing(false)
        setSelectedFile(null)
        setPreviewUrl('')
      } else {
        setErrors({ general: result.error })
      }
    } catch (error) {
      console.log('❌ Error de conexión:', error)
      setErrors({ general: 'Error de conexión. Por favor, intenta nuevamente.' })
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    // Resetear formulario a los datos originales
    if (user) {
      setFormData({
        nombre: user.nombre || '',
        apellido: user.apellido || '',
        telefono: user.telefono || '',
        cedula: user.cedula || '',
        email: user.email || ''
      })
    }
    setErrors({})
    setSuccess('')
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="hidden lg:block lg:w-64 lg:flex-shrink-0">
        <Sidebar isOpen={false} setIsOpen={() => {}} />
      </div>
      
      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="fixed left-0 top-0 h-full w-72 bg-white">
            <Sidebar isOpen={true} setIsOpen={setSidebarOpen} />
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <h1 className="ml-4 text-2xl font-bold text-gray-900">Mi Perfil</h1>
              </div>
              
              <div className="flex items-center space-x-4">
                {isAdmin && (
                  <Button
                    onClick={() => navigate('/admin/dashboard')}
                    icon={Settings}
                    variant="outline"
                  >
                    Panel Admin
                  </Button>
                )}
                {isEditing ? (
                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={handleCancel}
                      icon={X}
                      variant="outline"
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      icon={Save}
                      loading={loading}
                      disabled={loading}
                    >
                      {loading ? 'Guardando...' : 'Guardar'}
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={() => setIsEditing(true)}
                    icon={Edit2}
                    variant="outline"
                  >
                    Editar Perfil
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 px-4 sm:px-6 lg:px-8 py-8 overflow-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            {/* Profile Card */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* Profile Header */}
              <div className="bg-gradient-to-r from-primary to-primary/80 p-8">
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <img
                      src={previewUrl || user.foto || 'https://res.cloudinary.com/dpk1tw1us/image/upload/v1/avatars/default-avatar.jpg'}
                      alt="Profile"
                      className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
                    />
                    {isEditing && (
                      <button
                        onClick={handleUploadClick}
                        className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors"
                      >
                        <Upload size={16} className="text-gray-600" />
                      </button>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-white">
                      {user.nombre} {user.apellido}
                    </h2>
                    <p className="text-white/80 mt-1">{user.email}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        isAdmin 
                          ? 'bg-red-100 text-red-800' 
                          : user.rol === 'doctor' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {isAdmin ? 'Administrador' : user.rol === 'doctor' ? 'Doctor' : 'Paciente'}
                      </span>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        user.confirmado 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {user.confirmado ? 'Activo' : 'Pendiente'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile Form */}
              <div className="p-8">
                {/* Success Message */}
                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg mb-6"
                  >
                    {success}
                  </motion.div>
                )}

                {/* Error Message */}
                {errors.general && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6"
                  >
                    {errors.general}
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Nombre"
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      placeholder="Tu nombre"
                      error={errors.nombre}
                      icon={User}
                      disabled={!isEditing}
                      required
                    />

                    <Input
                      label="Apellido"
                      type="text"
                      name="apellido"
                      value={formData.apellido}
                      onChange={handleChange}
                      placeholder="Tu apellido"
                      error={errors.apellido}
                      icon={User}
                      disabled={!isEditing}
                      required
                    />

                    <Input
                      label="Email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="tu@email.com"
                      icon={Mail}
                      disabled={true} // Email no se puede editar
                      required
                    />

                    <Input
                      label="Teléfono"
                      type="tel"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                      placeholder="0991234567"
                      error={errors.telefono}
                      icon={Phone}
                      disabled={!isEditing}
                      required
                    />

                    <Input
                      label="Cédula"
                      type="text"
                      name="cedula"
                      value={formData.cedula}
                      onChange={handleChange}
                      placeholder="1720106663"
                      icon={Shield}
                      disabled={true} // Cédula no se puede editar
                      required
                    />

                    <Input
                      label="Fecha de Registro"
                      type="text"
                      value={new Date(user.createdAt).toLocaleDateString('es-ES')}
                      icon={Calendar}
                      disabled={true}
                    />
                  </div>

                  {/* Additional Info */}
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Información de Cuenta</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-3">
                        <Clock size={20} className="text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Última actualización</p>
                          <p className="text-sm font-medium text-gray-900">
                            {new Date(user.updatedAt).toLocaleDateString('es-ES')}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Shield size={20} className="text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Estado de cuenta</p>
                          <p className="text-sm font-medium text-gray-900">
                            {user.activo ? 'Activa' : 'Inactiva'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
