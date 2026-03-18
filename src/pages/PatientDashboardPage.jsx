import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Calendar, 
  FileText, 
  Clock, 
  User,
  Settings,
  LogOut,
  Eye,
  XCircle,
  CheckCircle
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Sidebar from '../components/Sidebar'
import Button from '../components/Button'
import Logo from '../components/Logo'
import { useNavigate } from 'react-router-dom'

const PatientDashboardPage = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-light-bg flex">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <div className="flex-1 lg:ml-0">
        <div className="p-4 lg:p-6 max-w-full">
          {/* Header */}
          <div className="mb-6">
            <Logo size="medium" className="mb-3" />
            <h1 className="text-2xl lg:text-3xl font-bold text-dark mb-2">
              Panel de Paciente
            </h1>
            <p className="text-gray-600 text-sm lg:text-base">
              Gestiona tus citas y consulta tu historial médico
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 lg:gap-6 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm p-4 lg:p-6 border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Mis Citas</p>
                  <p className="text-xl lg:text-2xl font-bold text-dark">-</p>
                </div>
                <div className="bg-blue-100 p-2 lg:p-3 rounded-lg">
                  <Calendar className="w-5 h-5 lg:w-6 lg:h-6 text-blue-600" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-sm p-4 lg:p-6 border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Próxima Cita</p>
                  <p className="text-xl lg:text-2xl font-bold text-dark">-</p>
                </div>
                <div className="bg-green-100 p-2 lg:p-3 rounded-lg">
                  <Clock className="w-5 h-5 lg:w-6 lg:h-6 text-green-600" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm p-4 lg:p-6 border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Historial Clínico</p>
                  <p className="text-xl lg:text-2xl font-bold text-dark">-</p>
                </div>
                <div className="bg-purple-100 p-2 lg:p-3 rounded-lg">
                  <FileText className="w-5 h-5 lg:w-6 lg:h-6 text-purple-600" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-sm p-4 lg:p-6 border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Tu Rol</p>
                  <p className="text-xl lg:text-2xl font-bold text-dark">Paciente</p>
                </div>
                <div className="bg-blue-100 p-2 lg:p-3 rounded-lg">
                  <User className="w-5 h-5 lg:w-6 lg:h-6 text-blue-600" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6"
          >
            <div className="p-4 lg:p-6 border-b border-gray-200">
              <h2 className="text-lg lg:text-xl font-semibold text-dark flex items-center gap-2">
                <Settings className="w-4 h-4 lg:w-5 lg:h-5 text-blue-600" />
                Acciones del Paciente
              </h2>
            </div>
            <div className="p-4 lg:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
                <Button
                  onClick={() => {/* TODO: Ver disponibilidad */}}
                  className="w-full justify-start text-sm"
                  variant="outline"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Ver Disponibilidad
                </Button>
                
                <Button
                  onClick={() => {/* TODO: Solicitar cita */}}
                  className="w-full justify-start text-sm"
                  variant="outline"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Solicitar Cita
                </Button>
                
                <Button
                  onClick={() => {/* TODO: Ver citas */}}
                  className="w-full justify-start text-sm"
                  variant="outline"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Mis Citas
                </Button>
                
                <Button
                  onClick={() => {/* TODO: Cancelar cita */}}
                  className="w-full justify-start text-sm"
                  variant="outline"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Cancelar Cita
                </Button>
                
                <Button
                  onClick={() => {/* TODO: Ver historial */}}
                  className="w-full justify-start text-sm"
                  variant="outline"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Historial Clínico
                </Button>
                
                <Button
                  onClick={() => navigate('/dashboard/perfil')}
                  className="w-full justify-start text-sm"
                  variant="outline"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Editar Perfil
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Recent Appointments */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200"
          >
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-dark flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                Mis Próximas Citas
              </h2>
            </div>
            <div className="p-6">
              <div className="text-center text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p>No tienes citas programadas</p>
                <p className="text-sm">Usa el botón "Solicitar Cita" para agendar</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default PatientDashboardPage
