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
  Search,
  Filter,
  RefreshCw
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Button from './Button'

const DoctorManagement = () => {
  const { 
    getAllDoctors, 
    getPendingDoctors, 
    getApprovedDoctors, 
    approveDoctor, 
    deleteDoctor,
    getDoctorById
  } = useAuth()
  
  const [doctors, setDoctors] = useState([])
  const [pendingDoctors, setPendingDoctors] = useState([])
  const [approvedDoctors, setApprovedDoctors] = useState([])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [errors, setErrors] = useState({})
  const [activeTab, setActiveTab] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const loadAllDoctors = async () => {
    setLoading(true)
    const result = await getAllDoctors()
    
    if (result.success) {
      setDoctors(result.data.doctores || [])
    } else {
      setErrors({ general: result.error })
    }
    
    setLoading(false)
  }

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

  const loadApprovedDoctors = async () => {
    setLoading(true)
    const result = await getApprovedDoctors()
    
    if (result.success) {
      setApprovedDoctors(result.data.doctores || [])
    } else {
      setErrors({ general: result.error })
    }
    
    setLoading(false)
  }

  useEffect(() => {
    const loadData = async () => {
      if (activeTab === 'all') {
        await loadAllDoctors()
      } else if (activeTab === 'pending') {
        await loadPendingDoctors()
      } else if (activeTab === 'approved') {
        await loadApprovedDoctors()
      }
    }
    
    loadData()
  }, [activeTab])

  const handleApproveDoctor = async (doctorId, action) => {
    setLoading(true)
    setErrors({})
    setSuccess('')
    
    const result = await approveDoctor(doctorId, action)
    
    if (result.success) {
      setSuccess(`Doctor ${action === 'aprobado' ? 'aprobado' : 'rechazado'} exitosamente`)
      
      // Recargar lista actual
      if (activeTab === 'pending') {
        loadPendingDoctors()
      } else if (activeTab === 'approved') {
        loadApprovedDoctors()
      } else {
        loadAllDoctors()
      }
    } else {
      setErrors({ general: result.error })
    }
    
    setLoading(false)
  }

  const handleDeleteDoctor = async (doctorId) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este doctor? Esta acción es irreversible.')) {
      return
    }
    
    setLoading(true)
    setErrors({})
    setSuccess('')
    
    const result = await deleteDoctor(doctorId)
    
    if (result.success) {
      setSuccess('Doctor eliminado exitosamente')
      loadAllDoctors()
    } else {
      setErrors({ general: result.error })
    }
    
    setLoading(false)
  }

  const handleViewDoctor = async (doctorId) => {
    setLoading(true)
    const result = await getDoctorById(doctorId)
    
    if (result.success) {
      // Aquí podrías mostrar un modal con los detalles del doctor
      alert(`Doctor: ${result.data.doctor?.usuario?.nombre} ${result.data.doctor?.usuario?.apellido}\nEmail: ${result.data.doctor?.usuario?.email}\nEspecialidad: ${result.data.doctor?.especialidad}`)
    } else {
      setErrors({ general: result.error })
    }
    
    setLoading(false)
  }

  const getDisplayDoctors = () => {
    let currentDoctors = []
    
    if (activeTab === 'all') {
      currentDoctors = doctors
    } else if (activeTab === 'pending') {
      currentDoctors = pendingDoctors
    } else if (activeTab === 'approved') {
      currentDoctors = approvedDoctors
    }
    
    if (searchTerm) {
      return currentDoctors.filter(doctor => 
        doctor.usuario?.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.usuario?.apellido?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.usuario?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.especialidad?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    return currentDoctors
  }

  const currentDoctors = getDisplayDoctors()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Gestión de Doctores
          </h2>
          
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar doctores..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <Button
              onClick={() => {
                if (activeTab === 'all') loadAllDoctors()
                else if (activeTab === 'pending') loadPendingDoctors()
                else loadApprovedDoctors()
              }}
              icon={RefreshCw}
              variant="outline"
              loading={loading}
            >
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mt-6 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'all'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Todos ({doctors.length})
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'pending'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Pendientes ({pendingDoctors.length})
          </button>
          <button
            onClick={() => setActiveTab('approved')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'approved'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Aprobados ({approvedDoctors.length})
          </button>
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg"
        >
          {success}
        </motion.div>
      )}

      {errors.general && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg"
        >
          {errors.general}
        </motion.div>
      )}

      {/* Doctors Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="mt-2 text-gray-600">Cargando doctores...</p>
            </div>
          ) : currentDoctors.length === 0 ? (
            <div className="p-8 text-center">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                {searchTerm ? 'No se encontraron doctores con esos criterios' : 'No hay doctores para mostrar'}
              </p>
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
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha Registro
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentDoctors.map((doctor) => (
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
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        doctor.estado === 'aprobado' 
                          ? 'bg-green-100 text-green-800' 
                          : doctor.estado === 'pendiente'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {doctor.estado || 'pendiente'}
                      </span>
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
                          onClick={() => handleViewDoctor(doctor._id)}
                          icon={Eye}
                          variant="outline"
                          size="sm"
                        >
                          Ver
                        </Button>
                        
                        {doctor.estado === 'pendiente' && (
                          <>
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
                          </>
                        )}
                        
                        <Button
                          onClick={() => handleDeleteDoctor(doctor._id)}
                          icon={Trash2}
                          variant="outline"
                          className="border-red-300 text-red-700 hover:bg-red-50"
                          size="sm"
                          loading={loading}
                        >
                          Eliminar
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

export default DoctorManagement
