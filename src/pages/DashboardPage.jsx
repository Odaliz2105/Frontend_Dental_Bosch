import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Calendar,
  Users,
  Clock,
  TrendingUp,
  Activity,
  Heart,
  Star,
  ChevronRight,
  Bell,
  Search,
  FileText
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Sidebar from '../components/Sidebar'
import Button from '../components/Button'

const DashboardPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user } = useAuth()
  
  const isDoctor = user?.rol === 'doctor' || user?.rol === 'administrador'

  // Datos de ejemplo
  const stats = isDoctor ? [
    {
      title: 'Pacientes Activos',
      value: '156',
      change: '+12%',
      icon: Users,
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Citas Hoy',
      value: '8',
      change: '+2',
      icon: Calendar,
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Tratamientos',
      value: '42',
      change: '+5%',
      icon: Heart,
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Ingresos Mes',
      value: '$12.5k',
      change: '+18%',
      icon: TrendingUp,
      color: 'from-orange-500 to-orange-600'
    }
  ] : [
    {
      title: 'Próxima Cita',
      value: 'Mañana',
      change: '10:00 AM',
      icon: Calendar,
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Tratamiento',
      value: 'Ortodoncia',
      change: '60% completo',
      icon: Heart,
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Última Visita',
      value: 'Hace 2 semanas',
      change: 'Revisión',
      icon: Clock,
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Progreso',
      value: 'Bien',
      change: 'Mejorando',
      icon: Activity,
      color: 'from-orange-500 to-orange-600'
    }
  ]

  const recentAppointments = isDoctor ? [
    { id: 1, patient: 'María García', time: '09:00 AM', treatment: 'Limpieza', status: 'confirmada' },
    { id: 2, patient: 'Juan Pérez', time: '10:30 AM', treatment: 'Revisión', status: 'confirmada' },
    { id: 3, patient: 'Ana López', time: '11:00 AM', treatment: 'Brackets', status: 'pendiente' },
    { id: 4, patient: 'Carlos Ruiz', time: '02:00 PM', treatment: 'Consulta', status: 'confirmada' }
  ] : [
    { id: 1, date: '15 Mar 2024', time: '10:00 AM', doctor: 'Dr. Smith', treatment: 'Revisión' },
    { id: 2, date: '22 Mar 2024', time: '11:30 AM', doctor: 'Dra. Johnson', treatment: 'Ajuste' },
    { id: 3, date: '05 Abr 2024', time: '09:00 AM', doctor: 'Dr. Smith', treatment: 'Limpieza' }
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
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <div className="flex-1 lg:ml-72">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                
                <h1 className="ml-4 text-2xl font-bold text-dark">
                  {isDoctor ? 'Panel Doctor' : 'Mi Panel'}
                </h1>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar..."
                    className="w-64 px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                </div>
                
                <button className="relative p-2 text-gray-500 hover:text-gray-700">
                  <Bell size={20} />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h2 className="text-3xl font-bold text-dark mb-2">
              ¡Bienvenido de vuelta, {user?.nombre}!
            </h2>
            <p className="text-gray-600">
              {isDoctor 
                ? 'Aquí está el resumen de tu clínica hoy' 
                : 'Aquí está el estado de tu tratamiento dental'
              }
            </p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}>
                      <Icon size={24} className="text-white" />
                    </div>
                    <span className={`text-sm font-medium ${
                      stat.change.startsWith('+') ? 'text-green-600' : 'text-gray-600'
                    }`}>
                      {stat.change}
                    </span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-dark mb-1">
                    {stat.value}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {stat.title}
                  </p>
                </motion.div>
              )
            })}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Appointments */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100"
            >
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-dark">
                    {isDoctor ? 'Citas de Hoy' : 'Mis Próximas Citas'}
                  </h3>
                  <Button variant="ghost" size="small">
                    Ver todas
                    <ChevronRight size={16} className="ml-1" />
                  </Button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  {recentAppointments.map((appointment) => (
                    <div key={appointment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <Calendar size={18} className="text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-dark">
                            {isDoctor ? appointment.patient : appointment.doctor}
                          </p>
                          <p className="text-sm text-gray-600">
                            {isDoctor ? appointment.treatment : `${appointment.date} - ${appointment.time}`}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-sm text-gray-600">
                          {isDoctor ? appointment.time : appointment.treatment}
                        </p>
                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                          appointment.status === 'confirmada' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {appointment.status === 'confirmada' ? 'Confirmada' : 'Pendiente'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100"
            >
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-dark">
                  Acciones Rápidas
                </h3>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  {isDoctor ? [
                    { icon: Users, label: 'Nuevo Paciente', color: 'bg-blue-500' },
                    { icon: Calendar, label: 'Agendar Cita', color: 'bg-green-500' },
                    { icon: FileText, label: 'Historial', color: 'bg-purple-500' },
                    { icon: TrendingUp, label: 'Reportes', color: 'bg-orange-500' }
                  ] : [
                    { icon: Calendar, label: 'Agendar Cita', color: 'bg-blue-500' },
                    { icon: Heart, label: 'Mi Tratamiento', color: 'bg-purple-500' },
                    { icon: Activity, label: 'Odontograma', color: 'bg-green-500' },
                    { icon: FileText, label: 'Historial', color: 'bg-orange-500' }
                  ].map((action, index) => {
                    const Icon = action.icon
                    return (
                      <button
                        key={index}
                        className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                      >
                        <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                          <Icon size={24} className="text-white" />
                        </div>
                        <span className="text-sm font-medium text-dark">
                          {action.label}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default DashboardPage
