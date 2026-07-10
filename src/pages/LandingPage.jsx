import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Heart, 
  Smile, 
  Clock, 
  Shield, 
  Star,
  CheckCircle,
  Phone,
  Mail,
  MapPin,
  Calendar,
  ArrowRight,
  Smartphone,
  X,
  Download
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Button from '../components/Button'
import Logo from '../components/Logo'

const AppModal = ({ showAppModal, setShowAppModal }) => (
    <AnimatePresence>
      {showAppModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          onClick={() => setShowAppModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md relative"
            onClick={e => e.stopPropagation()}
          >
            {/* Botón cerrar */}
            <button
              onClick={() => setShowAppModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>

            {/* Ícono */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-primary to-secondary rounded-2xl flex items-center justify-center shadow-lg">
                <Smartphone size={40} className="text-white" />
              </div>
            </div>

            {/* Contenido */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                ¡Descarga nuestra App!
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Para agendar citas, registrarte como paciente y hacer seguimiento 
                de tu tratamiento, descarga nuestra aplicación móvil.
              </p>
            </div>

            {/* Beneficios */}
            <div className="space-y-3 mb-8">
              {[
                'Agenda citas desde tu celular',
                'Consulta tu historial clínico',
                'Recibe recordatorios de citas',
                'Seguimiento de tu tratamiento'
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <CheckCircle size={12} className="text-primary" />
                  </div>
                  <span className="text-sm text-gray-700">{item}</span>
                </div>
              ))}
            </div>

            {/* Botón de descarga */}
            <a
              href="https://drive.google.com/drive/folders/1EPWnVI_3bKyHwBH9dlgu-_4HFAoDS9dB?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-3 bg-primary text-white py-4 rounded-xl hover:bg-primary/90 transition-colors font-semibold text-lg shadow-lg hover:shadow-primary/30"
            >
              <Download size={22} />
              Descargar APK para Android
            </a>

            <p className="text-center text-xs text-gray-400 mt-4">
              Descarga directa · Solo para Android
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
)

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showAppModal, setShowAppModal] = useState(false)

  const services = [
    {
      icon: Heart,
      title: 'Evaluación y diagnóstico',
      description: 'Análisis completo de tu salud bucal con tecnología de última generación',
      color: 'from-primary to-pink-400'
    },
    {
      icon: Smile,
      title: 'Brackets',
      description: 'Tratamiento ortodóntico tradicional para corregir la posición de tus dientes',
      color: 'from-secondary to-cyan-400'
    },
    {
      icon: Shield,
      title: 'Alineadores transparentes',
      description: 'Sonrisa perfecta sin brackets, casi invisibles y cómodos',
      color: 'from-accent to-teal-400'
    },
    {
      icon: Clock,
      title: 'Expansores dentales',
      description: 'Corrección de problemas de espacio y alineación en pacientes jóvenes',
      color: 'from-purple-400 to-pink-400'
    },
    {
      icon: CheckCircle,
      title: 'Retenedores',
      description: 'Mantenimiento de los resultados de tu tratamiento ortodóntico',
      color: 'from-blue-400 to-cyan-400'
    },
    {
      icon: Star,
      title: 'Corrección de mordida',
      description: 'Solución a problemas de oclusión y funcionalidad dental',
      color: 'from-indigo-400 to-purple-400'
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  }

  
  return (
    <div className="min-h-screen bg-light-bg">
      <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      <AppModal showAppModal={showAppModal} setShowAppModal={setShowAppModal} />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-white to-secondary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-8"
            >
              <Logo size="large" className="justify-center" />
            </motion.div>
            
            <motion.h1 
              className="text-4xl lg:text-6xl font-bold text-dark mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Sonrisas saludables,
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {' '}vida feliz
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              Expertos en ortodoncia y salud bucal. Transformamos sonrisas con tecnología de punta y atención personalizada.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <Button 
                size="large"
                className="group"
                icon={Calendar}
                iconPosition="right"
                onClick={() => setShowAppModal(true)}
              >
                Agendar cita
              </Button>
              
              <Link to="/login">
                <Button 
                  variant="outline" 
                  size="large"
                  className="group hover:border-primary hover:text-primary"
                >
                  Iniciar sesión
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-primary/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-secondary/20 rounded-full blur-xl"></div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-dark mb-4">
              Nuestros Servicios
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Ofrecemos tratamientos especializados para cuidar tu salud bucal
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {services.map((service, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="group"
              >
                <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300">
                  <div className={`w-16 h-16 bg-gradient-to-r ${service.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <service.icon size={32} className="text-white" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-dark mb-3">
                    {service.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              ¿Lista para transformar tu sonrisa?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Agenda tu consulta hoy y descubre el tratamiento ideal para ti
            </p>
            <Button 
              variant="outline" 
              size="large" 
              className="bg-white text-primary hover:bg-gray-50 border-white"
              icon={Calendar}
              onClick={() => setShowAppModal(true)}
            >
              Agendar consulta gratuita
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <Logo size="medium" className="mb-4" />
              <p className="text-gray-400">
                Expertos en ortodoncia y salud bucal, transformando sonrisas con tecnología de punta.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Contacto</h3>
              <div className="space-y-2 text-gray-400">
                <div className="flex items-center gap-2">
                  <Phone size={16} />
                  <span>098 406 2668</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={16} />
                  <span>info@dentalbosch.com</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin size={16} className="flex-shrink-0 mt-1" />
                  <span>Avenida 10 de Agosto N21, 2do piso 182, Oficina 202, Quito</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Horario</h3>
              <div className="text-gray-400 space-y-1">
                <p>Lunes: 9 a.m. – 7 p.m.</p>
                <p>Martes: 9 a.m. – 7 p.m.</p>
                <p>Miércoles: 9 a.m. – 7 p.m.</p>
                <p>Jueves: 9 a.m. – 7 p.m.</p>
                <p>Viernes: 9 a.m. – 7 p.m.</p>
                <p>Sábado: Cerrado</p>
                <p>Domingo: Cerrado</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p>&copy; 2024 Dental Bosch. Todos los derechos reservados.</p>
              <div className="flex gap-6 text-sm">
                <Link to="/privacy" className="hover:text-primary transition-colors">
                  Política de Privacidad
                </Link>
                <Link to="/terms" className="hover:text-primary transition-colors">
                  Términos del Servicio
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
