import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, 
  UserCheck, 
  UserX, 
  Clock, 
  Shield,
  CheckCircle,
  XCircle,
  Eye,
  Trash2,
  Calendar,
  FileText,
  Package,
  Activity
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Sidebar from '../components/Sidebar'
import Button from '../components/Button'
import Logo from '../components/Logo'

const AdminDashboardPage = () => {
  const { user, approveDoctor, getPendingDoctors } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [pendingDoctors, setPendingDoctors] = useState([])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [errors, setErrors] = useState({})

  const loadPendingDoctors = async () => {
    setLoading(true)
    const result = await getPendingDoctors()
    
    if (result.success) {
      setPendingDoctors(result.data.data || [])
    } else {
      setErrors({ general: result.error })
    }
    
    setLoading(false)
  }

  useEffect(() => {
    loadPendingDoctors()
  }, [])

  const handleApproveDoctor = async (doctorId, action) => {
    setLoading(true)
    setErrors({})
    setSuccess('')
    
    console.log(`🔄 Iniciando ${action} de doctor:`, doctorId)
    
    const result = await approveDoctor(doctorId, action)
    
    if (result.success) {
      console.log('✅ Doctor procesado exitosamente:', result.data)
      
      // Usar el mensaje del backend o un mensaje por defecto
      const successMessage = result.mensaje || result.data?.mensaje || `Doctor ${action} exitosamente`
      setSuccess(`✅ ${successMessage}`)
      
      // Mostrar detalles adicionales si están disponibles
      if (result.data?.data) {
        const doctorData = result.data.data
        console.log(`📋 Doctor ${doctorData.nombre} (${doctorData.email}) ahora está ${doctorData.estado}`)
      }
      
      // Recargar lista de doctores pendientes
      await loadPendingDoctors()
    } else {
      console.error('❌ Error al procesar doctor:', result.error)
      setErrors({ general: result.error })
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-light-bg flex">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <div className="flex-1 lg:ml-0">
        <div className="p-4 lg:p-6 max-w-full">
          {/* Header */}
          <div className="mb-6">
            <Logo size="medium" className="mb-3" />
            <h1 className="text-2xl lg:text-3xl font-bold text-dark mb-2">
              Panel de Administración
            </h1>
            <p className="text-gray-600 text-sm lg:text-base">
              Gestiona doctores y aprueba solicitudes de registro
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
                  <p className="text-sm text-gray-600 mb-1">Doctores Pendientes</p>
                  <p className="text-xl lg:text-2xl font-bold text-dark">{pendingDoctors.length}</p>
                </div>
                <div className="bg-blue-100 p-2 lg:p-3 rounded-lg">
                  <Clock className="w-5 h-5 lg:w-6 lg:h-6 text-blue-600" />
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
                  <p className="text-sm text-gray-600 mb-1">Total Doctores</p>
                  <p className="text-xl lg:text-2xl font-bold text-dark">-</p>
                </div>
                <div className="bg-green-100 p-2 lg:p-3 rounded-lg">
                  <Users className="w-5 h-5 lg:w-6 lg:h-6 text-green-600" />
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
                  <p className="text-sm text-gray-600 mb-1">Total Pacientes</p>
                  <p className="text-xl lg:text-2xl font-bold text-dark">-</p>
                </div>
                <div className="bg-blue-100 p-2 lg:p-3 rounded-lg">
                  <Activity className="w-5 h-5 lg:w-6 lg:h-6 text-blue-600" />
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
                  <p className="text-xl lg:text-2xl font-bold text-dark">Admin</p>
                </div>
                <div className="bg-red-100 p-2 lg:p-3 rounded-lg">
                  <Shield className="w-5 h-5 lg:w-6 lg:h-6 text-red-600" />
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
                <Shield className="w-4 h-4 lg:w-5 lg:h-5 text-red-600" />
                Acciones de Administrador
              </h2>
            </div>
            <div className="p-4 lg:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
                <Button
                  onClick={() => {/* TODO: Gestionar doctores */}}
                  className="w-full justify-start text-sm"
                  variant="outline"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Gestionar Doctores
                </Button>
                
                <Button
                  onClick={() => {/* TODO: Eliminar doctores */}}
                  className="w-full justify-start text-sm"
                  variant="outline"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Eliminar Doctores
                </Button>
                
                <Button
                  onClick={() => {/* TODO: Eliminar pacientes */}}
                  className="w-full justify-start text-sm"
                  variant="outline"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Eliminar Pacientes
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Success/Error Messages */}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg mb-6"
            >
              {success}
            </motion.div>
          )}

          {errors.general && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6"
            >
              {errors.general}
            </motion.div>
          )}

          {/* Pending Doctors Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200"
          >
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-dark flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                Doctores Pendientes de Aprobación
              </h2>
            </div>

            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <p className="mt-2 text-gray-600">Cargando doctores pendientes...</p>
                </div>
              ) : pendingDoctors.length === 0 ? (
                <div className="p-8 text-center">
                  <UserCheck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No hay doctores pendientes de aprobación</p>
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Doctor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Especialidad
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha Registro
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {pendingDoctors.map((doctor) => (
                      <motion.tr
                        key={doctor._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                <span className="text-sm font-medium text-gray-600">
                                  {doctor.usuario?.nombre?.charAt(0) || 'D'}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {doctor.usuario?.nombre} {doctor.usuario?.apellido}
                              </div>
                              <div className="text-sm text-gray-500">
                                {doctor.usuario?.cedula || 'N/A'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{doctor.usuario?.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{doctor.especialidad || 'No especificada'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {doctor.usuario?.createdAt ? 
                              new Date(doctor.usuario.createdAt).toLocaleDateString('es-ES') : 
                              'N/A'
                            }
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <Button
                              onClick={() => handleApproveDoctor(doctor._id, 'aprobado')}
                              icon={CheckCircle}
                              className="bg-green-600 hover:bg-green-700 text-white"
                              size="sm"
                              loading={loading}
                            >
                              Aprobar
                            </Button>
                            <Button
                              onClick={() => handleApproveDoctor(doctor._id, 'rechazado')}
                              icon={XCircle}
                              variant="outline"
                              className="border-red-300 text-red-700 hover:bg-red-50"
                              size="sm"
                              loading={loading}
                            >
                              Rechazar
                            </Button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboardPage
