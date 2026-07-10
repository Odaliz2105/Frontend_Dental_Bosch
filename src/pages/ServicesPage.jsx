import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, 
  CheckCircle, 
  Heart, 
  Smile, 
  Shield, 
  Clock, 
  Star,
  Sparkles,
  Phone,
  Calendar,
  Smartphone,
  X,
  Download,
  Droplets
} from 'lucide-react'
import Logo from '../components/Logo'
import Button from '../components/Button'
import Navbar from '../components/Navbar'

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
          <button
            onClick={() => setShowAppModal(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-primary to-secondary rounded-2xl flex items-center justify-center shadow-lg">
              <Smartphone size={40} className="text-white" />
            </div>
          </div>
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              ¡Descarga nuestra App!
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Para agendar citas, registrarte como paciente y hacer seguimiento 
              de tu tratamiento, descarga nuestra aplicación móvil.
            </p>
          </div>
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

const ServicesPage = () => {
  const [showAppModal, setShowAppModal] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const services = [
    {
      icon: Heart,
      title: 'Evaluación y Diagnóstico',
      description: 'Realiza exámenes clínicos y radiográficos para evaluar la posición de los dientes y la mordida. Análisis completo con tecnología de última generación para pacientes de todas las edades.',
      image: '/images/evaluacion-diagnostico.jpg',
      color: 'from-pink-500 to-rose-400',
      bgColor: 'bg-pink-50',
      features: ['Examen clínico completo', 'Radiografías digitales', 'Plan de tratamiento personalizado']
    },
    {
      icon: Smile,
      title: 'Brackets',
      description: 'Aparatos ortodónticos fijos que se colocan en los dientes para moverlos a su posición correcta. Tratamiento ortodóntico tradicional con resultados comprobados.',
      image: '/images/brackets.png',
      color: 'from-blue-500 to-cyan-400',
      bgColor: 'bg-blue-50',
      features: ['Brackets metálicos y estéticos', 'Ajustes periódicos', 'Resultados garantizados']
    },
    {
      icon: Shield,
      title: 'Alineadores Transparentes',
      description: 'Aparatos ortodónticos removibles que se utilizan para alinear los dientes. Casi invisibles, cómodos y perfectos para quienes buscan discreción.',
      image: '/images/alineadores-transparentes.jpg',
      color: 'from-teal-500 to-emerald-400',
      bgColor: 'bg-teal-50',
      features: ['Casi invisibles', 'Removibles para comer', 'Cómodos y discretos']
    },
    {
      icon: Clock,
      title: 'Expansores Dentales',
      description: 'Aparatos que se utilizan para ampliar la arcada dental y mejorar la alineación de los dientes. Ideal para corrección de problemas de espacio en pacientes jóvenes.',
      image: '/images/expansores-dentales.png',
      color: 'from-purple-500 to-violet-400',
      bgColor: 'bg-purple-50',
      features: ['Ampliación de arcada dental', 'Ideal para niños y jóvenes', 'Mejora de alineación']
    },
    {
      icon: Star,
      title: 'Retenedores',
      description: 'Aparatos que se utilizan para mantener los dientes en su nueva posición después del tratamiento de ortodoncia. Esenciales para conservar tu sonrisa perfecta.',
      image: '/images/retenedores.png',
      color: 'from-amber-500 to-orange-400',
      bgColor: 'bg-amber-50',
      features: ['Fijos y removibles', 'Mantenimiento de resultados', 'Seguimiento continuo']
    },
    {
      icon: CheckCircle,
      title: 'Corrección de Mordida',
      description: 'Tratamiento especializado para problemas de mordida como la mordida cruzada, abierta y profunda. Mejora la función masticatoria y la estética dental.',
      image: '/images/correccion-mordida.png',
      color: 'from-indigo-500 to-blue-400',
      bgColor: 'bg-indigo-50',
      features: ['Mordida cruzada y abierta', 'Mordida profunda', 'Mejora funcional y estética']
    },
    {
      icon: Sparkles,
      title: 'Aplicación de Toxina Botulínica',
      description: 'Tratamiento estético complementario para mejorar la armonía facial. Aplicación profesional con resultados naturales para rejuvenecer tu rostro.',
      image: '/images/toxina-botulinica.png',
      color: 'from-rose-400 to-pink-300',
      bgColor: 'bg-rose-50',
      features: ['Resultados naturales', 'Procedimiento rápido', 'Armonía facial']
    },
    {
      icon: Droplets,
      title: 'Limpieza Dental + Blanqueamiento',
      description: 'Servicio profesional de limpieza dental combinado con blanqueamiento para una sonrisa más brillante y saludable. ¡Promoción especial por $80!',
      image: '/images/limpieza-blanqueamiento.png',
      color: 'from-cyan-500 to-blue-500',
      bgColor: 'bg-cyan-50',
      features: ['Limpieza profunda profesional', 'Blanqueamiento dental', 'Promoción especial $80']
    }
  ]

  const activities = [
    "Evaluación y diagnóstico: Realiza exámenes clínicos y radiográficos para evaluar la posición de los dientes y la mordida.",
    "Planificación de tratamiento: Desarrolla planes de tratamiento personalizados para cada paciente.",
    "Colocación de aparatos ortodónticos: Coloca y ajusta brackets, alineadores transparentes y otros dispositivos.",
    "Ajustes y seguimiento: Realiza ajustes periódicos para asegurar que los dientes se están moviendo correctamente.",
    "Retenedores: Coloca retenedores para mantener los dientes en su nueva posición.",
    "Tratamiento de maloclusiones: Trata mordida cruzada, abierta y profunda.",
    "Alineación dental: Mejora la apariencia y la función de la sonrisa.",
    "Mejora de la función masticatoria: Reduce el riesgo de problemas de salud bucal.",
    "Trabajo en equipo: Colabora con otros especialistas para tratar casos complejos.",
    "Educación del paciente: Educa sobre la importancia de la higiene bucal y cuidado de aparatos."
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  }

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AppModal showAppModal={showAppModal} setShowAppModal={setShowAppModal} />
      
      <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-secondary text-white py-24">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-60 h-60 bg-white rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div 
              className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm px-5 py-2 rounded-full text-sm font-medium mb-8 border border-white/20"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Sparkles size={16} />
              Especialistas en Ortodoncia
            </motion.div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Nuestros Servicios
              <br />
              <span className="text-white/90 font-normal text-3xl md:text-4xl">
                Transformamos sonrisas con tecnología de punta
              </span>
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
              Especialistas en diagnóstico, prevención y tratamiento de problemas 
              de alineación dental y maloclusión para pacientes de todas las edades
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="space-y-16"
          >
            {services.map((service, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 lg:gap-12 items-center`}
              >
                {/* Image Side */}
                <div className="w-full lg:w-1/2">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                    className="relative group"
                  >
                    {service.image ? (
                      <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3]">
                        <img 
                          src={service.image} 
                          alt={service.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                        {/* Badge */}
                        <div className={`absolute top-4 left-4 bg-gradient-to-r ${service.color} text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg flex items-center gap-2`}>
                          <service.icon size={16} />
                          {service.title}
                        </div>
                      </div>
                    ) : (
                      <div className={`relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3] ${service.bgColor} flex items-center justify-center`}>
                        <div className="text-center p-8">
                          <div className={`w-24 h-24 bg-gradient-to-r ${service.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                            <service.icon size={48} className="text-white" />
                          </div>
                          <p className="text-gray-500 font-medium text-lg">{service.title}</p>
                          <p className="text-gray-400 text-sm mt-2">Imagen próximamente</p>
                        </div>
                        {/* Badge */}
                        <div className={`absolute top-4 left-4 bg-gradient-to-r ${service.color} text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg flex items-center gap-2`}>
                          <service.icon size={16} />
                          {service.title}
                        </div>
                      </div>
                    )}
                  </motion.div>
                </div>

                {/* Content Side */}
                <div className="w-full lg:w-1/2">
                  <div className="max-w-lg">
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-4 ${service.bgColor}`}>
                      <service.icon size={16} className={`bg-gradient-to-r ${service.color} bg-clip-text`} style={{ color: 'var(--color-primary)' }} />
                      <span className="text-gray-700">Servicio especializado</span>
                    </div>
                    
                    <h3 className="text-3xl font-bold text-gray-900 mb-4">
                      {service.title}
                    </h3>
                    
                    <p className="text-gray-600 text-lg leading-relaxed mb-6">
                      {service.description}
                    </p>

                    {/* Features List */}
                    <div className="space-y-3 mb-8">
                      {service.features.map((feature, fIndex) => (
                        <div key={fIndex} className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${service.color} flex items-center justify-center flex-shrink-0`}>
                            <CheckCircle size={14} className="text-white" />
                          </div>
                          <span className="text-gray-700 font-medium">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <Button
                      icon={Calendar}
                      iconPosition="right"
                      onClick={() => setShowAppModal(true)}
                      className="shadow-lg hover:shadow-xl transition-shadow"
                    >
                      Agendar consulta
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              ¿Qué es un Ortodoncista?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Un ortodoncista es un especialista en odontología que se enfoca en el diagnóstico, 
              prevención y tratamiento de problemas de alineación dental y maloclusión. 
              Puede tratar a pacientes de todas las edades, desde niños hasta adultos, 
              y ayuda a mejorar la apariencia y la función de la sonrisa.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Actividades que Realiza
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {activities.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-3 bg-gray-50 rounded-xl p-4 hover:bg-primary/5 transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle size={14} className="text-white" />
                  </div>
                  <p className="text-gray-700 leading-relaxed text-sm">{activity}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-20 w-40 h-40 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-20 w-60 h-60 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              ¿Lista para transformar tu sonrisa?
            </h2>
            <p className="text-xl text-white/90 mb-4">
              Contáctanos para una consulta y descubre cómo podemos ayudarte
            </p>
            <div className="flex items-center justify-center gap-2 text-white/80 mb-8">
              <Phone size={18} />
              <span className="text-lg font-medium">098 406 2668</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="outline" 
                size="large" 
                className="bg-white text-primary hover:bg-gray-50 border-white"
                icon={Calendar}
                onClick={() => setShowAppModal(true)}
              >
                Agendar consulta
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6 text-center sm:text-left">
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

export default ServicesPage
