import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Shield, ArrowLeft, Mail, User, FileText, Database, Lock, CheckCircle2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import Logo from '../components/Logo'

const PrivacyPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user } = useAuth()

  const collectedData = [
    {
      title: "Información de Identificación",
      description: "Recopilamos tu nombre completo para el registro en nuestra plataforma y la correcta personalización de tu cuenta.",
      icon: User
    },
    {
      title: "Información de Contacto",
      description: "Recopilamos tu dirección de correo electrónico y/o número telefónico para fines de comunicación, notificaciones de citas y autenticación de seguridad.",
      icon: Mail
    },
    {
      title: "Información Clínica y Odontológica",
      description: "Para brindarte una atención médica óptima, almacenamos tu historial dental, diagnósticos, radiografías y evolución clínica.",
      icon: FileText
    }
  ]

  const dataUsage = [
    {
      title: "Autenticación y Seguridad",
      description: "Permite verificar tu identidad al iniciar sesión mediante Google Sign-In o credenciales de la cuenta para proteger tu información privada."
    },
    {
      title: "Gestión y Agenda de Citas",
      description: "Facilita la programación, reprogramación o cancelación de citas odontológicas con nuestros especialistas de forma rápida y remota."
    },
    {
      title: "Historial Clínico Digital",
      description: "Permite a los profesionales de la salud acceder y actualizar tu ficha dental, asegurando un seguimiento médico preciso y oportuno."
    },
    {
      title: "Mejora Continua del Servicio",
      description: "Analizamos de forma anónima el rendimiento de la plataforma para implementar mejoras de usabilidad y funcionalidad."
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
          className="bg-gradient-to-r from-primary to-secondary rounded-3xl p-8 md:p-12 text-white shadow-xl mb-12 relative overflow-hidden"
        >
          <div className="relative z-10">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-6 backdrop-blur-md">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
              Política de Privacidad
            </h1>
            <p className="text-white/90 text-lg max-w-2xl leading-relaxed">
              En Dental Bosch valoramos y protegemos la confidencialidad de tus datos. Conoce detalladamente cómo gestionamos tu información para ofrecerte el mejor servicio odontológico.
            </p>
          </div>
          {/* Decorative shapes */}
          <div className="absolute right-0 bottom-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-x-20 translate-y-20"></div>
          <div className="absolute left-1/3 top-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        </motion.div>

        {/* Content sections */}
        <div className="space-y-12">
          {/* 1. Recopilación de Datos */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm"
          >
            <h2 className="text-2xl font-bold text-dark mb-6 flex items-center gap-3">
              <Database className="w-6 h-6 text-primary" />
              1. Datos que recopilamos
            </h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Para cumplir con las funciones esenciales del sistema de gestión odontológica Dental Bosch, recopilamos información personal proporcionada directamente por ti al registrarte o iniciar sesión mediante Google:
            </p>

            <div className="grid gap-6 md:grid-cols-3">
              {collectedData.map((data, idx) => (
                <div key={idx} className="bg-light-bg rounded-xl p-5 border border-gray-50 flex flex-col">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4">
                    <data.icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-dark mb-2">{data.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed mt-auto">{data.description}</p>
                </div>
              ))}
            </div>
          </motion.section>

          {/* 2. Uso de los Datos */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm"
          >
            <h2 className="text-2xl font-bold text-dark mb-6 flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-secondary" />
              2. Cómo utilizamos tus datos
            </h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              La recopilación y el procesamiento de tus datos personales e información clínica se limitan estrictamente a los siguientes propósitos:
            </p>

            <div className="grid gap-4 md:grid-cols-2">
              {dataUsage.map((use, idx) => (
                <div key={idx} className="border border-gray-100 rounded-xl p-5 hover:border-secondary/30 transition-colors">
                  <h3 className="font-semibold text-dark mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-secondary"></span>
                    {use.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{use.description}</p>
                </div>
              ))}
            </div>
          </motion.section>

          {/* 3. Protección y Confidencialidad */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm"
          >
            <h2 className="text-2xl font-bold text-dark mb-4 flex items-center gap-3">
              <Lock className="w-6 h-6 text-primary" />
              3. Protección de datos y confidencialidad
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                En Dental Bosch nos tomamos la seguridad muy en serio. Implementamos medidas técnicas, administrativas y físicas avanzadas para proteger tu información personal e historial odontológico contra el acceso no autorizado, pérdida, alteración o divulgación indebida.
              </p>
              <p>
                Toda la transferencia de información se realiza bajo protocolos cifrados seguros (HTTPS). Además, la base de datos cumple con estándares de confidencialidad médica para resguardar la privacidad de tu ficha clínica, accesible únicamente por los profesionales odontológicos autorizados a cargo de tu tratamiento.
              </p>
            </div>
          </motion.section>

          {/* 4. Contacto */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-6"
          >
            <div>
              <h2 className="text-2xl font-bold text-dark mb-2">
                ¿Tienes preguntas o inquietudes?
              </h2>
              <p className="text-gray-600">
                Si requieres más información sobre el tratamiento de tus datos o quieres ejercer tus derechos de acceso, rectificación o eliminación, contáctanos.
              </p>
            </div>
            <a 
              href="mailto:admin@dentalbosch.com" 
              className="flex-shrink-0 bg-dark text-white px-6 py-3.5 rounded-xl font-medium hover:bg-primary transition-colors duration-300 shadow-md hover:shadow-lg flex items-center gap-2"
            >
              <Mail className="w-5 h-5" />
              Contacto del Administrador
            </a>
          </motion.section>
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
              <Link to="/privacy" className="hover:text-primary transition-colors text-white font-medium">
                Política de Privacidad
              </Link>
              <Link to="/terms" className="hover:text-primary transition-colors">
                Términos del Servicio
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default PrivacyPage
