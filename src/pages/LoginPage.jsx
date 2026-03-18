import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import Button from '../components/Button'
import Input from '../components/Input'
import Logo from '../components/Logo'

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (location.state?.message) {
      setTimeout(() => {
        if (location.state.type === 'success') {
          setSuccessMessage(location.state.message)
        } else {
          setErrors({ general: location.state.message })
        }
        // Limpiar el estado después de mostrar el mensaje
        window.history.replaceState({}, document.title)
      }, 0)
    }
  }, [location.state])

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
    
    if (!formData.email) {
      newErrors.email = 'El correo electrónico es requerido'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El correo electrónico no es válido'
    }
    
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida'
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres'
    }
    
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const validationErrors = validateForm()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    
    const result = await login(formData.email, formData.password)
    
    if (result.success) {
      navigate('/dashboard')
    } else {
      // Mostrar mensaje específico según el tipo de error
      let errorMessage = result.error
      let errorType = 'general'
      
      if (result.requiresApproval) {
        errorType = 'approval'
        errorMessage = result.error
      } else if (result.requiresConfirmation) {
        errorType = 'confirmation'
        errorMessage = result.error
      } else if (result.error?.toLowerCase().includes('contraseña')) {
        errorMessage = 'Contraseña incorrecta. Por favor, verifica tus credenciales.'
      } else if (result.error?.toLowerCase().includes('email')) {
        errorMessage = 'El correo electrónico no está registrado. Por favor, regístrate primero.'
      } else if (result.error?.toLowerCase().includes('usuario')) {
        errorMessage = 'Usuario no encontrado. Verifica tus credenciales.'
      } else if (result.error?.toLowerCase().includes('credenciales')) {
        errorMessage = 'Credenciales incorrectos. Por favor, intenta nuevamente.'
      }
      
      setErrors({ general: errorMessage, type: errorType })
    }
  }

  return (
    <div className="min-h-screen bg-light-bg">
      <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {/* Logo y título */}
            <div className="text-center mb-8">
              <Logo size="large" className="justify-center mb-4" />
              <h2 className="text-2xl font-bold text-dark mb-2">
                Bienvenido de vuelta
              </h2>
              <p className="text-gray-600">
                Inicia sesión para acceder a tu panel
              </p>
            </div>

            {/* Error general */}
            {errors.general && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`px-4 py-3 rounded-lg mb-6 border ${
                  errors.type === 'approval' 
                    ? 'bg-yellow-50 border-yellow-200 text-yellow-700'
                    : errors.type === 'confirmation'
                    ? 'bg-orange-50 border-orange-200 text-orange-700'
                    : 'bg-red-50 border-red-200 text-red-600'
                }`}
              >
                <div className="flex items-center">
                  {errors.type === 'approval' && (
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  )}
                  {errors.type === 'confirmation' && (
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                  {errors.type === 'general' && (
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  )}
                  <span>{errors.general}</span>
                </div>
                
                {/* Mensaje adicional para doctores pendientes */}
                {errors.type === 'approval' && (
                  <div className="mt-3 pt-3 border-t border-yellow-200 text-sm">
                  </div>
                )}
                
                {/* Mensaje adicional para no confirmados */}
                {errors.type === 'confirmation' && (
                  <div className="mt-3 pt-3 border-t border-orange-200 text-sm">
                    <p className="font-medium">¿No recibiste el email?</p>
                    <p className="text-xs mt-1">Revisa tu carpeta de spam o solicita un nuevo email de confirmación.</p>
                  </div>
                )}
              </motion.div>
            )}

            {/* Mensaje de éxito */}
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg mb-6"
              >
                ✅ {successMessage}
              </motion.div>
            )}

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Correo electrónico"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="tu@email.com"
                error={errors.email}
                icon={Mail}
                required
              />

              <div className="relative">
                <Input
                  label="Contraseña"
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

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    Recordarme
                  </span>
                </label>
                
                <Link 
                  to="/olvidar-contraseña" 
                  className="text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full"
                size="large"
              >
                Iniciar sesión
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  ¿No tienes cuenta?
                </span>
              </div>
            </div>

            {/* Registro */}
            <div className="text-center">
              <Link 
                to="/registro" 
                className="inline-flex items-center text-primary hover:text-primary/80 font-medium transition-colors"
              >
                <User size={18} className="mr-2" />
                Crear cuenta nueva
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default LoginPage
