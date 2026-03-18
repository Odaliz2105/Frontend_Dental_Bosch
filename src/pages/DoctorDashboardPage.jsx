import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, 
  Calendar, 
  FileText, 
  Clock, 
  Package,
  Activity,
  User,
  Settings,
  LogOut
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Sidebar from '../components/Sidebar'
import Button from '../components/Button'
import Logo from '../components/Logo'

const DoctorDashboardPage = () => {
  const { user } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-light-bg">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <div className="lg:pl-64">
        <div className="p-6">
          {/* Header */}
          <div className="mb-8">
            <Logo size="medium" className="mb-4" />
            <h1 className="text-3xl font-bold text-dark mb-2">
              Panel de Doctor
            </h1>
            <p className="text-gray-600">
              Gestiona pacientes, citas y tu práctica médica
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Mis Pacientes</p>
                  <p className="text-2xl font-bold text-dark">-</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Citas Hoy</p>
                  <p className="text-2xl font-bold text-dark">-</p>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <Calendar className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Historias Clínicas</p>
                  <p className="text-2xl font-bold text-dark">-</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-lg">
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Tu Rol</p>
                  <p className="text-2xl font-bold text-dark">Doctor</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-lg">
                  <Activity className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8"
          >
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-dark flex items-center gap-2">
                <Settings className="w-5 h-5 text-purple-600" />
                Acciones del Doctor
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Button
                  onClick={() => {/* TODO: Gestionar pacientes */}}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Gestionar Pacientes
                </Button>
                
                <Button
                  onClick={() => {/* TODO: Gestionar citas */}}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Gestionar Citas
                </Button>
                
                <Button
                  onClick={() => {/* TODO: Gestionar horarios */}}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Gestionar Horarios
                </Button>
                
                <Button
                  onClick={() => {/* TODO: Registrar historias */}}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Registrar Historias
                </Button>
                
                <Button
                  onClick={() => {/* TODO: Gestionar tratamientos */}}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <Package className="w-4 h-4 mr-2" />
                  Tratamientos
                </Button>
                
                <Button
                  onClick={() => {/* TODO: Gestionar inventario */}}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <Package className="w-4 h-4 mr-2" />
                  Inventario
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200"
          >
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-dark flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-600" />
                Actividad Reciente
              </h2>
            </div>
            <div className="p-6">
              <div className="text-center text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p>No hay actividad reciente</p>
                <p className="text-sm">Las citas y actividades aparecerán aquí</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default DoctorDashboardPage
