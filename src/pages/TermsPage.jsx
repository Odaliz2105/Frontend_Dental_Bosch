import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FileText, ArrowLeft, ShieldAlert, KeyRound, Ban, Scale, RefreshCw } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import Logo from '../components/Logo'

const TermsPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user } = useAuth()

  const termsSections = [
    {
      title: "1. Condiciones de uso del sistema",
      description: "La plataforma Dental Bosch proporciona un sistema en línea para facilitar el registro de pacientes, la visualización del odontograma, el agendamiento y seguimiento de citas clínicas. El uso de esta plataforma implica la aceptación íntegra de los presentes términos.",
      icon: FileText
    },
    {
      title: "2. Responsabilidad sobre credenciales",
      description: "Como usuario (ya sea paciente, doctor o administrador), eres el único responsable de mantener la confidencialidad de tus credenciales de inicio de sesión, incluyendo la protección de tu cuenta vinculada a Google Sign-In. Cualquier actividad realizada con tus credenciales será de tu total responsabilidad.",
      icon: KeyRound
    },
    {
      title: "3. Restricción de uso indebido",
      description: "Queda estrictamente prohibido intentar vulnerar la seguridad del sistema, realizar inyecciones de código malicioso, suplantar la identidad de otros usuarios o profesionales de la salud, y utilizar la plataforma para fines comerciales o publicitarios ajenos a Dental Bosch.",
      icon: Ban
    },
    {
      title: "4. Limitación de responsabilidad",
      description: "Dental Bosch se esfuerza por mantener la máxima disponibilidad del sistema; sin embargo, no garantiza un servicio ininterrumpido o libre de errores debido a factores técnicos externos (como fallos de conectividad de internet o del proveedor de alojamiento). La información odontológica y clínica cargada en el sistema es referencial y de soporte para la práctica profesional presencial.",
      icon: Scale
    },
    {
      title: "5. Actualizaciones de los términos",
      description: "Nos reservamos el derecho de modificar o actualizar estos términos de servicio en cualquier momento para reflejar cambios legales o de funcionalidad en el sistema. Te recomendamos revisar esta página periódicamente para mantenerte informado sobre las condiciones vigentes.",
      icon: RefreshCw
    }
  ]

  return (
    <div className="min-h-screen bg-light-bg flex flex-col">
      <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} user={user} />

      <main className="flex-grow max-w-4xl w-full mx-auto px-4 py-12 md:py-16">
        {/* Back Link */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-gray-600 hover:text-primary transition-colors font-medium group">
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Volver al inicio
          </Link>
        </div>

        {/* Header Hero Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-secondary to-primary rounded-3xl p-8 md:p-12 text-white shadow-xl mb-12 relative overflow-hidden"
        >
          <div className="relative z-10">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-6 backdrop-blur-md">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
              Términos del Servicio
            </h1>
            <p className="text-white/90 text-lg max-w-2xl leading-relaxed">
              Lee detenidamente las condiciones de uso de la plataforma de Dental Bosch para comprender tus derechos y responsabilidades como usuario de nuestro sistema digital.
            </p>
          </div>
          {/* Decorative shapes */}
          <div className="absolute right-0 bottom-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-x-20 translate-y-20"></div>
          <div className="absolute left-1/3 top-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        </motion.div>

        {/* Terms list */}
        <div className="space-y-6">
          {termsSections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow flex items-start gap-5"
            >
              <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary flex-shrink-0">
                <section.icon className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-dark mb-3">
                  {section.title}
                </h2>
                <p className="text-gray-650 text-gray-600 leading-relaxed text-sm md:text-base">
                  {section.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-dark text-white py-12 mt-16 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
            <div className="flex items-center">
              <Logo />
            </div>
            <p className="text-gray-400 text-sm">
              © 2024 Dental Bosch. Todos los derechos reservados.
            </p>
            <div className="flex gap-6 text-sm text-gray-400">
              <Link to="/privacy" className="hover:text-primary transition-colors">
                Política de Privacidad
              </Link>
              <Link to="/terms" className="hover:text-primary transition-colors text-white font-medium">
                Términos del Servicio
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default TermsPage
