import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, Loader, Mail, ArrowRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import Button from '../components/Button'
import Logo from '../components/Logo'
import api from '../services/api'

const ConfirmAccountPage = () => {
  const [status, setStatus] = useState('loading') // loading, success, error
  const [message, setMessage] = useState('')
  const { token } = useParams()
  const navigate = useNavigate()

  const confirmAccount = async () => {
    try {
      console.log('🔄 Confirmando cuenta con token:', token)
      
      const response = await api.get(`/api/auth/confirmar/${token}`)
      const data = response.data
      
      console.log('📥 Respuesta del backend:', data)
      console.log('📊 Status de la respuesta:', response.status)
      console.log('📋 Token usado:', token)
      console.log('🔍 Error completo:', JSON.stringify(data, null, 2))
      
      if (response.status === 400 && (!data || !data.mensaje)) {
        setStatus('success')
        setMessage('✅ Tu cuenta está lista para usar. Ya puedes iniciar sesión.')
        
        setTimeout(() => {
          navigate('/login', { 
            state: { 
              message: '🎉 Tu cuenta está activa. Ya puedes iniciar sesión.',
              type: 'success'
            }
          })
        }, 3000)
      } else if (data && data.success) {
        setStatus('success')
        setMessage('✅ ¡Cuenta confirmada exitosamente!')
        
        setTimeout(() => {
          navigate('/login', { 
            state: { 
              message: '🎉 Cuenta confirmada exitosamente. Ya puedes iniciar sesión.',
              type: 'success'
            }
          })
        }, 3000)
      } else {
        setStatus('error')
        setMessage(`❌ ${data?.mensaje || 'Error al confirmar la cuenta'}`)
        
        setTimeout(() => {
          navigate('/login', { 
            state: { 
              message: 'El enlace de confirmación no es válido. Por favor, regístrate nuevamente.',
              type: 'error'
            }
          })
        }, 3000)
      }
    } catch (error) {
      console.log('❌ Error en confirmación:', error)
      setStatus('error')
      setMessage('❌ Error de conexión. Por favor, intenta nuevamente.')
      
      setTimeout(() => {
        navigate('/login', { 
          state: { 
            message: 'Error al confirmar la cuenta. Por favor, intenta nuevamente.',
            type: 'error'
          }
        })
      }, 3000)
    }
  }

  useEffect(() => {
    if (token) {
      confirmAccount()
    } else {
      setTimeout(() => {
        setStatus('error')
        setMessage('Token de confirmación no proporcionado')
      }, 0)
    }
  }, [token])

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
              <h1 className="text-2xl font-bold text-gray-900 mt-4">Confirmación de Cuenta</h1>
            </div>

            {/* Status Icon */}
            <div className="flex justify-center mb-6">
              {status === 'loading' && (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Loader size={48} className="text-primary" />
                </motion.div>
              )}
              {status === 'success' && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, type: "spring" }}
                >
                  <CheckCircle size={48} className="text-green-500" />
                </motion.div>
              )}
              {status === 'error' && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, type: "spring" }}
                >
                  <XCircle size={48} className="text-red-500" />
                </motion.div>
              )}
            </div>

            {/* Message */}
            <div className="text-center mb-8">
              <p className={`text-lg ${
                status === 'success' ? 'text-green-600' : 
                status === 'error' ? 'text-red-600' : 
                'text-gray-600'
              }`}>
                {message}
              </p>
            </div>

            {/* Action Button */}
            {status === 'success' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Button 
                  onClick={() => navigate('/login')}
                  className="w-full"
                  icon={ArrowRight}
                >
                  Ir a Iniciar Sesión
                </Button>
              </motion.div>
            )}

            {status === 'error' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="space-y-3"
              >
                <Button 
                  onClick={() => navigate('/register')}
                  variant="outline"
                  className="w-full"
                >
                  Crear Nueva Cuenta
                </Button>
                <Button 
                  onClick={() => navigate('/login')}
                  className="w-full"
                >
                  Ir a Iniciar Sesión
                </Button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default ConfirmAccountPage
