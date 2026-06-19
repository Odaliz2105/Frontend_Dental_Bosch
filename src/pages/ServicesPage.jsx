import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, CheckCircle, Users, Clock, Heart } from 'lucide-react'
import Logo from '../components/Logo'

const ServicesPage = () => {
  const activities = [
    "Evaluación y diagnóstico: Realiza exámenes clínicos y radiográficos para evaluar la posición de los dientes y la mordida.",
    "Planificación de tratamiento: Desarrolla planes de tratamiento personalizados para cada paciente, considerando factores como la edad, la gravedad del problema y las necesidades estéticas y funcionales.",
    "Colocación de aparatos ortodónticos: Coloca y ajusta aparatos ortodónticos como brackets, alineadores transparentes y otros dispositivos para mover los dientes a su posición correcta.",
    "Ajustes y seguimiento: Realiza ajustes periódicos en los aparatos ortodónticos para asegurarse de que los dientes se están moviendo según lo planeado.",
    "Retenedores: Coloca retenedores después del tratamiento de ortodoncia para mantener los dientes en su nueva posición.",
    "Tratamiento de maloclusiones: Trata problemas de mordida, como la mordida cruzada, la mordida abierta y la mordida profunda.",
    "Alineación dental: Alinea los dientes para mejorar la apariencia y la función de la sonrisa.",
    "Mejora de la función masticatoria: Mejora la función masticatoria y reduce el riesgo de problemas de salud bucal asociados con la maloclusión.",
    "Trabajo en equipo: Colabora con otros especialistas, como cirujanos orales y maxilofaciales, para tratar casos complejos.",
    "Educación del paciente: Educa a los pacientes sobre la importancia de la higiene bucal y el cuidado de los aparatos ortodónticos."
  ]

  const treatments = [
    {
      name: "Brackets",
      description: "Aparatos ortodónticos fijos que se colocan en los dientes para moverlos a su posición correcta.",
      icon: <CheckCircle className="w-6 h-6" />
    },
    {
      name: "Alineadores transparentes",
      description: "Aparatos ortodónticos removibles que se utilizan para alinear los dientes.",
      icon: <Users className="w-6 h-6" />
    },
    {
      name: "Expansores",
      description: "Aparatos que se utilizan para ampliar la arcada dental y mejorar la alineación de los dientes.",
      icon: <Clock className="w-6 h-6" />
    },
    {
      name: "Retenedores",
      description: "Aparatos que se utilizan para mantener los dientes en su nueva posición después del tratamiento de ortodoncia.",
      icon: <Heart className="w-6 h-6" />
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center text-primary hover:text-primary/80 transition-colors">
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span className="font-medium">Volver al inicio</span>
            </Link>
            <Logo />
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-primary/90 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Ortodoncista Especialista
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
            Especialista en diagnóstico, prevención y tratamiento de problemas de alineación dental y maloclusión
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* About Section */}
        <div className="mb-20">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              ¿Qué es un Ortodoncista?
            </h2>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              Un ortodoncista es un especialista en odontología que se enfoca en el diagnóstico, 
              prevención y tratamiento de problemas de alineación dental y maloclusión. 
              Un ortodoncista puede tratar a pacientes de todas las edades, desde niños hasta adultos, 
              y puede ayudar a mejorar la apariencia y la función de la sonrisa.
            </p>
          </div>
        </div>

        {/* Activities Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Actividades que Realiza
          </h2>
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-6">
              {activities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <p className="text-gray-700 leading-relaxed">{activity}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Treatments Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Tratamientos Disponibles
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {treatments.map((treatment, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="text-primary mb-4">
                  {treatment.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {treatment.name}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {treatment.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-primary to-primary/90 rounded-2xl p-8 md:p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            ¿Listo para transformar tu sonrisa?
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Contáctanos para una consulta y descubre cómo podemos ayudarte a lograr la sonrisa que siempre has deseado.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/contact" 
              className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Contactar Ahora
            </Link>
            <Link 
              to="/registro" 
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary transition-colors"
            >
              Agendar Cita
            </Link>
          </div>
        </div>
      </div>

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
