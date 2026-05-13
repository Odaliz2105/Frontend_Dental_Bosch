import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, UserCheck, X } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const TabPacientes = () => {
  const { getAdminPacientes, getAdminPacienteById } = useAuth()
  const [pacientes, setPacientes] = useState([])
  const [cargando, setCargando] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [pagination, setPagination] = useState({})
  const [detallePaciente, setDetallePaciente] = useState(null)
  const [loadingDetalle, setLoadingDetalle] = useState(null)

  // Función para obtener datos completos del paciente
  const getPacienteCompleto = (paciente) => {
    // Si el paciente ya tiene los datos del usuario como objeto
    if (paciente.usuario && typeof paciente.usuario === 'object') {
      return {
        ...paciente,
        nombre: paciente.usuario.nombre || '',
        apellido: paciente.usuario.apellido || '',
        email: paciente.usuario.email || '',
        telefono: paciente.usuario.telefono || '',
        foto: paciente.usuario.foto || '',
        estado: paciente.usuario.estado || paciente.estado || 'desconocido',
        activo: paciente.usuario.activo !== undefined ? paciente.usuario.activo : paciente.activo
      }
    }
    
    // Si el paciente tiene el ID del usuario (string), mostrar información limitada
    if (paciente.usuario && typeof paciente.usuario === 'string') {
      return {
        ...paciente,
        nombre: `Usuario ID: ${paciente.usuario.slice(-6)}`,
        apellido: '',
        email: '',
        telefono: paciente.telefono || '',
        foto: '',
        estado: paciente.estado || 'desconocido',
        activo: paciente.activo
      }
    }
    
    // Si no tiene datos de usuario, devolver el paciente con valores por defecto
    return {
      ...paciente,
      nombre: 'Paciente sin datos',
      apellido: '',
      email: '',
      telefono: paciente.telefono || '',
      foto: '',
      estado: paciente.estado || 'desconocido',
      activo: paciente.activo
    }
  }

  // Función para ver detalle de paciente
  const verDetallePaciente = async (pacienteId) => {
    setLoadingDetalle(pacienteId)
    try {
      const result = await getAdminPacienteById(pacienteId)
      if (result.success) {
        setDetallePaciente(result.data.datos || result.data)
      } else {
        console.error('Error al cargar detalles del paciente:', result.error)
      }
    } catch (error) {
      console.error('Error al cargar detalles del paciente:', error)
    }
    setLoadingDetalle(null)
  }

  useEffect(() => {
    const cargar = async () => {
      setCargando(true)
      const result = await getAdminPacientes()
      
      if (result.success) {
        const pacientesData = result.data.datos?.pacientes || []
        console.log('👥 TabPacientes - Cargados:', pacientesData.length, 'pacientes')
        console.log('🆔 IDs de pacientes recibidos:', pacientesData.map(p => p._id))
        
        // Forzar limpieza del estado
        setPacientes([]) // Limpiar primero
        setTimeout(() => {
          setPacientes(pacientesData) // Luego asignar los nuevos datos
        }, 100)

        setPagination(result.data.datos?.pagination || {})
      } else {
        console.log('❌ TabPacientes - Error:', result.error)
      }
      setCargando(false)
    }

    cargar()
  }, [])

  const filtrados = pacientes.filter(p => {
    const pacienteCompleto = getPacienteCompleto(p)
    return `${pacienteCompleto.nombre || ''} ${pacienteCompleto.apellido || ''} ${pacienteCompleto.email || ''}`
      .toLowerCase().includes(busqueda.toLowerCase())
  })

  return (
    <div>
      <div className="relative mb-6">
        <Search size={18} className="absolute left-3 top-3 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar paciente..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
        />
      </div>

      {cargando ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-3"></div>
          <p className="text-gray-500 text-sm">Cargando pacientes...</p>
        </div>
      ) : filtrados.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <UserCheck size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 text-sm">No hay pacientes registrados</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Paciente', 'Email', 'Teléfono', 'Acciones'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtrados.map(p => {
                const pacienteCompleto = getPacienteCompleto(p)
                return (
                  <tr key={p._id} className="hover:bg-gray-50">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm">
                          {(pacienteCompleto.nombre || 'P').charAt(0)}
                        </div>
                        <span className="font-medium text-gray-900 text-sm">
                          {pacienteCompleto.nombre || ''} {pacienteCompleto.apellido || ''}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-500">{pacienteCompleto.email || ''}</td>
                    <td className="px-5 py-4 text-sm text-gray-500">{pacienteCompleto.telefono || '—'}</td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => verDetallePaciente(p._id || p.id)}
                        className="text-xs text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200 transition-colors"
                        disabled={loadingDetalle === (p._id || p.id)}
                      >
                        {loadingDetalle === (p._id || p.id) ? (
                          <div className="w-3 h-3 border border-blue-600 border-t-transparent rounded-full animate-spin inline-block" />
                        ) : (
                          'Ver Detalle'
                        )}
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
      {/* Modal para mostrar detalle de paciente */}
      {detallePaciente && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setDetallePaciente(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                      {(detallePaciente.usuario?.nombre || 'P').charAt(0)}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        {detallePaciente.usuario?.nombre} {detallePaciente.usuario?.apellido}
                      </h2>
                      <p className="text-sm text-gray-500">Detalles del paciente</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setDetallePaciente(null)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Información Personal */}
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Información Personal</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-gray-500">Nombre:</span> {detallePaciente.usuario?.nombre} {detallePaciente.usuario?.apellido}</p>
                      <p><span className="text-gray-500">Email:</span> {detallePaciente.usuario?.email}</p>
                      <p><span className="text-gray-500">Teléfono:</span> {detallePaciente.usuario?.telefono}</p>
                      <p><span className="text-gray-500">Fecha de Nacimiento:</span> {new Date(detallePaciente.fechaNacimiento).toLocaleDateString('es-ES')}</p>
                      <p><span className="text-gray-500">Género:</span> {detallePaciente.genero}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Dirección</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-gray-500">Calle:</span> {detallePaciente.direccion?.calle}</p>
                      <p><span className="text-gray-500">Ciudad:</span> {detallePaciente.direccion?.ciudad}</p>
                      <p><span className="text-gray-500">Provincia:</span> {detallePaciente.direccion?.provincia}</p>
                    </div>
                  </div>
                </div>

                {/* Contacto de Emergencia */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Contacto de Emergencia</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-gray-500">Nombre:</span> {detallePaciente.contactoEmergencia?.nombre}</p>
                    <p><span className="text-gray-500">Teléfono:</span> {detallePaciente.contactoEmergencia?.telefono}</p>
                    <p><span className="text-gray-500">Parentesco:</span> {detallePaciente.contactoEmergencia?.parentesco}</p>
                  </div>
                </div>

                {/* Información Médica */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Información Médica</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-gray-500">Alergias:</span> {detallePaciente.infoMedica?.alergias?.length > 0 ? detallePaciente.infoMedica.alergias.join(', ') : 'Ninguna'}</p>
                    <p><span className="text-gray-500">Condiciones:</span> {detallePaciente.infoMedica?.condiciones?.length > 0 ? detallePaciente.infoMedica.condiciones.join(', ') : 'Ninguna'}</p>
                  </div>
                </div>

                {/* Estadísticas de Citas */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Estadísticas de Citas</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-yellow-50 p-3 rounded-lg">
                      <p className="text-yellow-600 font-semibold">{detallePaciente.citasStats?.pendiente || 0}</p>
                      <p className="text-xs text-gray-600">Pendientes</p>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-green-600 font-semibold">{detallePaciente.citasStats?.completada || 0}</p>
                      <p className="text-xs text-gray-600">Completadas</p>
                    </div>
                    <div className="bg-red-50 p-3 rounded-lg">
                      <p className="text-red-600 font-semibold">{detallePaciente.citasStats?.cancelada || 0}</p>
                      <p className="text-xs text-gray-600">Canceladas</p>
                    </div>
                  </div>
                </div>

                {/* Botón de cierre */}
                <div className="flex justify-end">
                  <button
                    onClick={() => setDetallePaciente(null)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  )
}

export default TabPacientes
