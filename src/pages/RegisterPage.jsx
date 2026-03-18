import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, User, Phone, Calendar, FileText, Stethoscope } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import Button from '../components/Button'
import Input from '../components/Input'
import Logo from '../components/Logo'

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '', // Campo requerido por el backend
    email: '',
    password: '',
    confirmPassword: '',
    telefono: '',
    fechaNacimiento: '',
    rol: 'paciente',
    cedula: '', // Campo para doctores
    especialidad: '' // Campo para doctores
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  
  const { register } = useAuth()
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
    
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido'
    } else if (formData.nombre.trim().length < 3) {
      newErrors.nombre = 'El nombre debe tener al menos 3 caracteres'
    }
    
    if (!formData.apellido.trim()) {
      newErrors.apellido = 'El apellido es requerido'
    } else if (formData.apellido.trim().length < 3) {
      newErrors.apellido = 'El apellido debe tener al menos 3 caracteres'
    }
    
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
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden'
    }
    
    if (!formData.telefono) {
      newErrors.telefono = 'El teléfono es requerido'
    } else if (!/^\d{10}$/.test(formData.telefono.replace(/\D/g, ''))) {
      newErrors.telefono = 'El teléfono debe tener 10 dígitos'
    }
    
    // Validaciones específicas para doctores
    if (formData.rol === 'doctor') {
      if (!formData.cedula.trim()) {
        newErrors.cedula = 'La cédula es requerida para doctores'
      } else if (!/^\d{10}$/.test(formData.cedula.replace(/\D/g, ''))) {
        newErrors.cedula = 'La cédula debe tener 10 dígitos'
      }
      
      if (!formData.especialidad.trim()) {
        newErrors.especialidad = 'La especialidad es requerida para doctores'
      }
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
    
    const { confirmPassword, ...registerData } = formData
    
    console.log('📤 Enviando datos de registro:', registerData)
    
    const result = await register(registerData)
    
    if (result.success) {
      console.log('✅ Registro exitoso:', result.data)
      
      // Mensaje específico según el rol
      const successMessage = result.mensaje || 
        (formData.rol === 'doctor' 
          ? 'Registro exitoso. Tu cuenta será revisada por un administrador. Revisa tu email para confirmar tu cuenta.'
          : 'Registro exitoso. Por favor, inicia sesión.'
        )
      
      navigate('/login', { 
        state: { 
          message: successMessage,
          type: 'success'
        } 
      })
    } else {
      console.error('❌ Error en registro:', result.error)
      setErrors({ general: result.error })
    }
  }

  return (
    <div className="min-h-screen bg-light-bg">
      <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-lg"
        >
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {/* Logo y título */}
            <div className="text-center mb-8">
              <Logo size="large" className="justify-center mb-4" />
              <h2 className="text-2xl font-bold text-dark mb-2">
                Crear cuenta
              </h2>
              <p className="text-gray-600">
                Únete a Dental Bosch y cuida tu sonrisa
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
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Nombre"
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Juan"
                error={errors.nombre}
                icon={User}
                required
              />

              <Input
                label="Apellido"
                type="text"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                placeholder="Pérez"
                error={errors.apellido}
                icon={User}
                required
              />

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

              <Input
                label="Teléfono"
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                placeholder="1234567890"
                error={errors.telefono}
                icon={Phone}
                required
              />

              <Input
                label="Fecha de nacimiento"
                type="date"
                name="fechaNacimiento"
                value={formData.fechaNacimiento}
                onChange={handleChange}
                error={errors.fechaNacimiento}
                icon={Calendar}
              />

              {/* Campos específicos para doctores */}
              {formData.rol === 'doctor' && (
                <>
                  <Input
                    label="Cédula profesional"
                    type="text"
                    name="cedula"
                    value={formData.cedula}
                    onChange={handleChange}
                    placeholder="0117054321"
                    error={errors.cedula}
                    icon={FileText}
                    required={formData.rol === 'doctor'}
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Especialidad
                    </label>
                    <select
                      name="especialidad"
                      value={formData.especialidad}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      required={formData.rol === 'doctor'}
                    >
                      <option value="">Selecciona una especialidad</option>
                      <option value="Ortodoncia">Ortodoncia</option>
                      <option value="Odontopediatría">Odontopediatría</option>
                      <option value="Endodoncia">Endodoncia</option>
                      <option value="Periodoncia">Periodoncia</option>
                      <option value="Cirugía Oral">Cirugía Oral</option>
                      <option value="Prótesis Dental">Prótesis Dental</option>
                      <option value="Odontología General">Odontología General</option>
                      <option value="Cosmética Dental">Cosmética Dental</option>
                    </select>
                    {errors.especialidad && (
                      <p className="mt-1 text-sm text-red-600">{errors.especialidad}</p>
                    )}
                  </div>
                </>
              )}

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

              <div className="relative">
                <Input
                  label="Confirmar contraseña"
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de cuenta
                </label>
                <select
                  name="rol"
                  value={formData.rol}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="paciente">👤 Paciente</option>
                  <option value="doctor">🩺 Doctor</option>
                </select>
              </div>

              {/* Información adicional según rol */}
              {formData.rol === 'doctor' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <Stethoscope className="w-5 h-5 text-blue-600 mr-2" />
                    <h3 className="text-sm font-medium text-blue-900">Información para Doctores</h3>
                  </div>
                  <p className="text-xs text-blue-700">
                    Tu cuenta será revisada por un administrador antes de ser aprobada. 
                    Recibirás un correo electrónico cuando tu cuenta sea activada.
                  </p>
                </div>
              )}

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="terms"
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  required
                />
                <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                  Acepto los{' '}
                  <Link to="/terminos" className="text-primary hover:text-primary/80">
                    términos y condiciones
                  </Link>{' '}
                  y la{' '}
                  <Link to="/privacidad" className="text-primary hover:text-primary/80">
                    política de privacidad
                  </Link>
                </label>
              </div>

              <Button
                type="submit"
                className="w-full"
                size="large"
              >
                Crear cuenta
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  ¿Ya tienes cuenta?
                </span>
              </div>
            </div>

            {/* Iniciar sesión */}
            <div className="text-center">
              <Link 
                to="/login" 
                className="inline-flex items-center text-primary hover:text-primary/80 font-medium transition-colors"
              >
                <User size={18} className="mr-2" />
                Iniciar sesión
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default RegisterPage
