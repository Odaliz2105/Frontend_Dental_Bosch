import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Lock, Eye, EyeOff, CheckCircle, XCircle, Loader, ArrowLeft } from 'lucide-react'
import Navbar from '../components/Navbar'
import Button from '../components/Button'
import Input from '../components/Input'
import Logo from '../components/Logo'

const ResetPasswordPage = () => {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState(false)
  const [tokenValid, setTokenValid] = useState(true) // Asumimos que es válido hasta probarlo
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  
  const { token } = useParams()
  const navigate = useNavigate()

  // Eliminamos la validación previa para no consumir el token

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

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida'
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres'
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden'
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
    
    try {
      console.log('📤 Restableciendo contraseña con token:', token)
      
      const response = await fetch(`https://backend-dental-bosch-vr8o.onrender.com/api/auth/restablecer-password/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          password: formData.password
        })
      })
      
      const data = await response.json()
      
      console.log('📥 Respuesta del backend:', data)
      console.log('📊 Status de la respuesta:', response.status)
      
      if (response.ok && data.success) {
        setSuccess(true)
        console.log('✅ Contraseña restablecida')
      } else {
        // Si el token es inválido, mostrar página de error
        if (response.status === 400 && data.mensaje && data.mensaje.includes('inválido')) {
          setTokenValid(false)
        } else {
          setErrors({ general: data.mensaje || 'Error al restablecer la contraseña' })
        }
        console.log('❌ Error:', data.mensaje)
      }
    } catch (error) {
      console.log('❌ Error de conexión:', error)
      setErrors({ general: 'Error de conexión. Por favor, intenta nuevamente.' })
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar isMenuOpen={false} setIsMenuOpen={() => {}} user={null} />
        
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)] px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
          >
            <div className="bg-white rounded-2xl shadow-xl p-8">
              {/* Logo */}
              <div className="text-center mb-8">
                <Logo size="medium" className="justify-center" />
                <h1 className="text-2xl font-bold text-gray-900 mt-4">¡Contraseña Restablecida!</h1>
              </div>

              {/* Success Icon */}
              <div className="flex justify-center mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, type: "spring" }}
                  className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center"
                >
                  <CheckCircle size={32} className="text-green-600" />
                </motion.div>
              </div>

              {/* Success Message */}
              <div className="text-center mb-8">
                <p className="text-gray-600 mb-4">
                  Tu contraseña ha sido restablecida exitosamente.
                </p>
                <p className="text-sm text-gray-500">
                  Ya puedes iniciar sesión con tu nueva contraseña.
                </p>
              </div>

              {/* Action Button */}
              <Button 
                onClick={() => navigate('/login')}
                className="w-full"
              >
                Iniciar Sesión
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  if (!tokenValid) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar isMenuOpen={false} setIsMenuOpen={() => {}} user={null} />
        
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)] px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
          >
            <div className="bg-white rounded-2xl shadow-xl p-8">
              {/* Logo */}
              <div className="text-center mb-8">
                <Logo size="medium" className="justify-center" />
                <h1 className="text-2xl font-bold text-gray-900 mt-4">Enlace Inválido</h1>
              </div>

              {/* Error Icon */}
              <div className="flex justify-center mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, type: "spring" }}
                  className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center"
                >
                  <XCircle size={32} className="text-red-600" />
                </motion.div>
              </div>

              {/* Error Message */}
              <div className="text-center mb-8">
                <p className="text-gray-600 mb-4">
                  Este enlace de recuperación de contraseña es inválido o ha expirado.
                </p>
                <p className="text-sm text-gray-500">
                  Por favor, solicita un nuevo enlace de recuperación.
                </p>
              </div>

              {/* Action Button */}
              <Button 
                onClick={() => navigate('/olvidar-contraseña')}
                className="w-full"
              >
                Solicitar Nuevo Enlace
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} user={null} />
      
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {/* Logo */}
            <div className="text-center mb-8">
              <Logo size="medium" className="justify-center" />
              <h1 className="text-2xl font-bold text-gray-900 mt-4">Restablecer Contraseña</h1>
              <p className="text-gray-600 mt-2">
                Ingresa tu nueva contraseña.
              </p>
            </div>

            {/* Error general */}
            {errors.general && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6"
              >
                {errors.general}
              </motion.div>
            )}

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <Input
                  label="Nueva Contraseña"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  error={errors.password}
                  icon={Lock}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <div className="relative">
                <Input
                  label="Confirmar Contraseña"
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  error={errors.confirmPassword}
                  icon={Lock}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <Button
                type="submit"
                className="w-full"
                loading={loading}
                disabled={loading}
              >
                {loading ? 'Restableciendo...' : 'Restablecer Contraseña'}
              </Button>
            </form>

            {/* Volver */}
            <div className="mt-6 text-center">
              <Button
                onClick={() => navigate('/login')}
                variant="ghost"
                icon={ArrowLeft}
              >
                Volver a Iniciar Sesión
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default ResetPasswordPage
