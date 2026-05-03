import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, ArrowLeft, Loader2 } from 'lucide-react'
import Navbar from '../components/Navbar'
import Button from '../components/Button'
import Input from '../components/Input'
import Logo from '../components/Logo'

const ForgotPasswordPage = () => {
  const [formData, setFormData] = useState({
    email: ''
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  
  const navigate = useNavigate()

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
      console.log('📤 Enviando recuperación para:', formData.email)
      
      const response = await fetch('https://backend-dental-bosch-vr8o.onrender.com/api/auth/recuperar-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email
        })
      })
      
      const data = await response.json()
      
      console.log('📥 Respuesta del backend:', data)
      console.log('📊 Status de la respuesta:', response.status)
      
      if (response.ok && data.success) {
        setSuccess(true)
        console.log('✅ Email de recuperación enviado')
      } else {
        setErrors({ general: data.mensaje || 'Error al enviar email de recuperación' })
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
                <h1 className="text-2xl font-bold text-gray-900 mt-4">Email Enviado</h1>
              </div>

              {/* Success Icon */}
              <div className="flex justify-center mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, type: "spring" }}
                  className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center"
                >
                  <Mail size={32} className="text-green-600" />
                </motion.div>
              </div>

              {/* Success Message */}
              <div className="text-center mb-8">
                <p className="text-gray-600 mb-4">
                  Hemos enviado un email a <strong>{formData.email}</strong> con instrucciones para restablecer tu contraseña.
                </p>
                <p className="text-sm text-gray-500">
                  Revisa tu bandeja de entrada y carpeta de spam.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button 
                  onClick={() => navigate('/login')}
                  className="w-full"
                >
                  Volver a Iniciar Sesión
                </Button>
                <Button 
                  onClick={() => {
                    setSuccess(false)
                    setFormData({ email: '' })
                  }}
                  variant="outline"
                  className="w-full"
                >
                  Enviar otro email
                </Button>
              </div>
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
              <h1 className="text-2xl font-bold text-gray-900 mt-4">¿Olvidaste tu contraseña?</h1>
              <p className="text-gray-600 mt-2">
                Ingresa tu correo electrónico y te enviaremos instrucciones para restablecer tu contraseña.
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

              <Button
                type="submit"
                className="w-full"
                loading={loading}
                disabled={loading}
              >
                {loading ? 'Enviando...' : 'Enviar Instrucciones'}
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

export default ForgotPasswordPage
