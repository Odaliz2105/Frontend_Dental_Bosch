import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, User, Phone, Calendar, FileText, Stethoscope } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import Button from '../components/Button'
import Input from '../components/Input'
import Logo from '../components/Logo'

const especialidadesDisponibles = [
  "Ortodoncia",
  "Odontopediatría",
  "Endodoncia",
  "Periodoncia",
  "Cirugía Oral",
  "Prótesis Dental",
  "Odontología General",
  "Cosmética Dental"
];

const validarCedulaEcuatoriana = (cedula) => {
  if (!/^\d{10}$/.test(cedula)) return false;

  const provincia = parseInt(cedula.substring(0, 2), 10);
  if (provincia < 1 || (provincia > 24 && provincia !== 30)) {
    return false;
  }

  const tercerDigito = parseInt(cedula.substring(2, 3), 10);
  if (tercerDigito >= 6) {
    return false;
  }

  const coeficientes = [2, 1, 2, 1, 2, 1, 2, 1, 2];
  const verificador = parseInt(cedula.substring(9, 10), 10);

  let suma = 0;
  for (let i = 0; i < 9; i++) {
    let valor = parseInt(cedula.substring(i, i + 1), 10) * coeficientes[i];
    if (valor >= 10) {
      valor -= 9;
    }
    suma += valor;
  }

  const decenaSuperior = Math.ceil(suma / 10) * 10;
  let digitoCalculado = decenaSuperior - suma;
  if (digitoCalculado === 10) {
    digitoCalculado = 0;
  }

  return digitoCalculado === verificador;
};

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    confirmPassword: '',
    telefono: '',
    rol: 'doctor',
    cedula: '',
    especialidad: '',
    terminosAceptados: false
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    
    let newValue = type === 'checkbox' ? checked : value;
    
    if (name === 'telefono' || name === 'cedula') {
      newValue = value.replace(/\D/g, '').slice(0, 10);
    }
    
    setFormData(prev => {
      const updated = { ...prev, [name]: newValue };
      
      // Update confirmPassword validation error dynamic if it's already set or typed
      if (name === 'password' && updated.confirmPassword) {
         if (errors.confirmPassword && updated.password === updated.confirmPassword) {
            setErrors(errs => ({...errs, confirmPassword: ''}))
         }
      }
      return updated;
    })
    
    // Limpiar error cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
    if (errors.general) {
      setErrors(prev => ({
        ...prev,
        general: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    // Nombre
    const nombreLimpio = formData.nombre.trim().replace(/\s+/g, ' ');
    if (!nombreLimpio) {
      newErrors.nombre = 'El nombre es obligatorio';
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/.test(nombreLimpio)) {
      newErrors.nombre = 'El nombre solo puede contener letras y espacios';
    } else if (nombreLimpio.length < 3) {
      newErrors.nombre = 'El nombre debe tener al menos 3 caracteres';
    } else if (nombreLimpio.length > 50) {
      newErrors.nombre = 'El nombre no puede exceder los 50 caracteres';
    }
    
    // Apellido
    const apellidoLimpio = formData.apellido.trim().replace(/\s+/g, ' ');
    if (!apellidoLimpio) {
      newErrors.apellido = 'El apellido es obligatorio';
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/.test(apellidoLimpio)) {
      newErrors.apellido = 'El apellido solo puede contener letras y espacios';
    } else if (apellidoLimpio.length < 3) {
      newErrors.apellido = 'El apellido debe tener al menos 3 caracteres';
    } else if (apellidoLimpio.length > 50) {
      newErrors.apellido = 'El apellido no puede exceder los 50 caracteres';
    }
    
    // Email
    const emailLimpio = formData.email.trim();
    if (!emailLimpio) {
      newErrors.email = 'El correo electrónico es obligatorio';
    } else if (emailLimpio.includes(' ')) {
      newErrors.email = 'El correo electrónico no tiene un formato válido';
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(emailLimpio)) {
      newErrors.email = 'El correo electrónico no tiene un formato válido';
    }
    
    // Teléfono
    if (!formData.telefono) {
      newErrors.telefono = 'El teléfono es obligatorio';
    } else if (!/^\d{10}$/.test(formData.telefono)) {
      newErrors.telefono = 'El teléfono debe contener exactamente 10 números';
    }
    
    // Cédula
    if (!formData.cedula) {
      newErrors.cedula = 'La cédula es obligatoria';
    } else if (!/^\d{10}$/.test(formData.cedula)) {
      newErrors.cedula = 'La cédula debe contener exactamente 10 números';
    } else if (!validarCedulaEcuatoriana(formData.cedula)) {
      newErrors.cedula = 'La cédula ingresada no corresponde a una cédula ecuatoriana válida';
    }
    
    // Especialidad
    if (!formData.especialidad) {
      newErrors.especialidad = 'Seleccione una especialidad válida';
    } else if (!especialidadesDisponibles.includes(formData.especialidad)) {
      newErrors.especialidad = 'Seleccione una especialidad válida';
    }
    
    // Contraseña
    if (!formData.password) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (formData.password !== formData.password.trim()) {
      newErrors.password = 'La contraseña no debe comenzar ni terminar con espacios';
    } else if (!/^(?=.*[A-Z])(?=.*\d).{6,}$/.test(formData.password)) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres, una mayúscula y un número';
    }
    
    // Confirmar Contraseña
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }
    
    // Términos
    if (!formData.terminosAceptados) {
      newErrors.terminosAceptados = 'Debe aceptar los términos y la política de privacidad para continuar';
    }
    
    return newErrors;
  }

  const mapearErrorBackend = (mensaje) => {
    const errorMap = {};
    const textoNormalizado = mensaje.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    
    if (textoNormalizado.includes('cedula')) {
       if (textoNormalizado.includes('registrada')) {
           errorMap.cedula = 'Ya existe una cuenta registrada con esta cédula';
       } else {
           errorMap.cedula = 'La cédula ingresada no corresponde a una cédula ecuatoriana válida';
       }
    } else if (textoNormalizado.includes('telefono')) {
      errorMap.telefono = 'El teléfono debe contener exactamente 10 números';
    } else if (textoNormalizado.includes('email') || textoNormalizado.includes('correo')) {
       if (textoNormalizado.includes('registrado') || textoNormalizado.includes('existe')) {
           errorMap.email = 'Ya existe una cuenta registrada con este correo electrónico';
       } else {
           errorMap.email = 'El correo electrónico no tiene un formato válido';
       }
    } else if (textoNormalizado.includes('nombre')) {
      errorMap.nombre = 'Error en el nombre';
    } else if (textoNormalizado.includes('apellido')) {
      errorMap.apellido = 'Error en el apellido';
    } else if (textoNormalizado.includes('contrasena') || textoNormalizado.includes('password')) {
      errorMap.password = 'Error en la contraseña';
    } else if (textoNormalizado.includes('especialidad')) {
      errorMap.especialidad = 'Error en la especialidad';
    } else {
      errorMap.general = mensaje;
    }
    return errorMap;
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (isSubmitting) return;

    const validationErrors = validateForm()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      // Enfocar y hacer scroll al primer error
      const primerError = Object.keys(validationErrors)[0];
      const elemento = document.querySelector(`[name="${primerError}"]`);
      if (elemento) {
         elemento.focus();
         elemento.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return
    }
    
    setIsSubmitting(true);
    
    try {
        const nombreLimpio = formData.nombre.trim().replace(/\s+/g, ' ');
        const apellidoLimpio = formData.apellido.trim().replace(/\s+/g, ' ');
        const emailLimpio = formData.email.trim().toLowerCase();

        const registerData = {
          nombre: nombreLimpio,
          apellido: apellidoLimpio,
          email: emailLimpio,
          password: formData.password,
          telefono: formData.telefono,
          cedula: formData.cedula,
          especialidad: formData.especialidad,
          rol: 'doctor'
        };
        
        console.log('📤 Enviando datos de registro:', registerData)
        
        const result = await register(registerData)
        
        if (result.success) {
          console.log('✅ Registro exitoso:', result.data)
          
          const successMessage = result.data?.mensaje || 'Solicitud de registro enviada correctamente. La cuenta está pendiente de aprobación por el administrador.';
          
          navigate('/login', { 
            state: { 
              message: successMessage,
              type: 'success'
            } 
          })
        } else {
          console.error('❌ Error en registro:', result.error)
          const mapErrores = mapearErrorBackend(result.error);
          setErrors(mapErrores);
          const primerError = Object.keys(mapErrores)[0];
          if (primerError !== 'general') {
              const elemento = document.querySelector(`[name="${primerError}"]`);
              if (elemento) {
                 elemento.focus();
                 elemento.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
          } else {
              const formContenedor = document.querySelector('.bg-white.rounded-2xl');
              if (formContenedor) {
                 formContenedor.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
          }
        }
    } catch(err) {
        setErrors({ general: 'Ocurrió un error inesperado. Intente nuevamente.' })
    } finally {
        setIsSubmitting(false);
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
                Regístrate como doctor en Dental Bosch
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
                inputMode="numeric"
                maxLength={10}
                autoComplete="tel"
                required
              />

              <Input
                label="Cédula"
                type="text"
                name="cedula"
                value={formData.cedula}
                onChange={handleChange}
                placeholder="0117054321"
                error={errors.cedula}
                icon={FileText}
                inputMode="numeric"
                maxLength={10}
                autoComplete="off"
                required
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
                  required
                >
                  <option value="">Selecciona una especialidad</option>
                  {especialidadesDisponibles.map((esp) => (
                    <option key={esp} value={esp}>{esp}</option>
                  ))}
                </select>
                {errors.especialidad && (
                  <p className="mt-1 text-sm text-red-600">{errors.especialidad}</p>
                )}
              </div>

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

              <div className="flex flex-col">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="terms"
                    name="terminosAceptados"
                    checked={formData.terminosAceptados}
                    onChange={handleChange}
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                    Acepto los{' '}
                    <Link to="/terms" target="_blank" className="text-primary hover:text-primary/80 underline">
                      términos y condiciones
                    </Link>{' '}
                    y la{' '}
                    <Link to="/privacy" target="_blank" className="text-primary hover:text-primary/80 underline">
                      política de privacidad
                    </Link>
                  </label>
                </div>
                {errors.terminosAceptados && (
                    <p className="mt-1 text-sm text-red-600">{errors.terminosAceptados}</p>
                )}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Stethoscope className="w-5 h-5 text-blue-600 mr-2" />
                  <h3 className="text-sm font-medium text-blue-900">Información importante</h3>
                </div>
                <p className="text-xs text-blue-700">
                  Tu cuenta será revisada por un administrador antes de ser aprobada. 
                  Te notificaremos cuando tu cuenta sea activada.
                </p>
              </div>

              <Button
                type="submit"
                className="w-full"
                size="large"
                loading={isSubmitting}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creando cuenta..." : "Crear cuenta"}
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
