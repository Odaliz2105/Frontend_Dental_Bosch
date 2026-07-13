import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Calendar, Eye, X } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import Toast from '../../components/common/Toast'
import EstadoBadge from '../../components/common/EstadoBadge'
import Button from '../../components/Button'

const TabCitas = () => {
  const { getAdminCitas, getAdminCitaById, reasignarCitas, getAllDoctors, getAdminPacientes } = useAuth()
  const [citas, setCitas] = useState([])
  const [doctores, setDoctores] = useState([])
  const [pacientes, setPacientes] = useState([])
  const [cargando, setCargando] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [toast, setToast] = useState(null)
  const [detalleCita, setDetalleCita] = useState(null)
  const [reasignando, setReasignando] = useState(false)
  const [doctorDestino, setDoctorDestino] = useState('')
  const [loadingDetalle, setLoadingDetalle] = useState(null)

  // Función para obtener nombre de paciente por ID o objeto
  const getNombrePaciente = (pacienteData) => {
    console.log('🔍 getNombrePaciente - pacienteData:', pacienteData)
    console.log('🔍 getNombrePaciente - pacientes.length:', pacientes.length)
    // Si es un string (ID), buscar en la lista de pacientes
    if (typeof pacienteData === 'string') {
      const paciente = pacientes.find(p => 
        p._id === pacienteData || 
        p.id === pacienteData || 
        p.usuario?._id === pacienteData ||
        p.usuario === pacienteData ||
        p.usuario?.id === pacienteData
      )
      if (paciente) {
        // Manejar ambas estructuras: con objeto usuario o con datos directos
        if (paciente.usuario?.nombre) {
          const nombre = `${paciente.usuario.nombre} ${paciente.usuario.apellido || ''}`.trim()
          return nombre
        } else if (paciente.nombre) {
          const nombre = `${paciente.nombre} ${paciente.apellido || ''}`.trim()
          return nombre
        }
      }
      return `Paciente ID: ${pacienteData?.slice(-6) || 'Desconocido'}`
    }
    
    // Si es un objeto, extraer el nombre directamente
    if (pacienteData && typeof pacienteData === 'object') {
      // Si tiene nombre y apellido directamente
      if (pacienteData.nombre || pacienteData.apellido) {
        return `${pacienteData.nombre || ''} ${pacienteData.apellido || ''}`.trim() || 'Paciente sin nombre'
      }
      
      // Si tiene el objeto usuario, usar los datos de ahí
      if (pacienteData.usuario?.nombre) {
        return `${pacienteData.usuario.nombre} ${pacienteData.usuario.apellido || ''}`.trim()
      }
      
      // Si tiene _id o id pero no datos de usuario, buscar en la lista
      if (pacienteData._id || pacienteData.id) {
        const paciente = pacientes.find(p => 
          p._id === pacienteData._id || 
          p._id === pacienteData.id ||
          p.id === pacienteData._id || 
          p.id === pacienteData.id ||
          p.usuario?._id === pacienteData._id ||
          p.usuario?._id === pacienteData.id ||
          p.usuario?.id === pacienteData._id ||
          p.usuario?.id === pacienteData.id
        )
        if (paciente) {
          if (paciente.usuario?.nombre) {
            return `${paciente.usuario.nombre} ${paciente.usuario.apellido || ''}`.trim()
          } else if (paciente.nombre) {
            return `${paciente.nombre} ${paciente.apellido || ''}`.trim()
          }
        }
      }
      
      return `Paciente ID: ${pacienteData._id?.slice(-6) || pacienteData.usuario?.slice(-6) || 'Desconocido'}`
    }
    
    return 'Paciente desconocido'
  }

  // Función para obtener nombre de doctor por ID o objeto
  const getNombreDoctor = (doctorData) => {
    // Si es un string (ID), buscar en la lista de doctores
    if (typeof doctorData === 'string') {
      const doctor = doctores.find(d => d._id === doctorData || d.id === doctorData || d.usuario?._id === doctorData)
      if (doctor) {
        const nombre = doctor.nombreCompleto || 
               (doctor.usuario?.nombre ? `${doctor.usuario.nombre} ${doctor.usuario.apellido || ''}`.trim() : 'Sin nombre')
        return nombre
      }
      return `Doctor ID: ${doctorData?.slice(-6) || 'Desconocido'}`
    }
    
    // Si es un objeto, extraer el nombre directamente
    if (doctorData && typeof doctorData === 'object') {
      // Si tiene nombreCompleto o nombre directamente
      if (doctorData.nombreCompleto || doctorData.nombre) {
        return doctorData.nombreCompleto || 
               `${doctorData.nombre || ''} ${doctorData.apellido || ''}`.trim() || 'Doctor sin nombre'
      }
      
      // Si tiene el objeto usuario, usar los datos de ahí
      if (doctorData.usuario?.nombre) {
        return `${doctorData.usuario.nombre} ${doctorData.usuario.apellido || ''}`.trim()
      }
      
      // Si solo tiene el ID del usuario, buscar en la lista
      if (doctorData.usuario) {
        const doctor = doctores.find(d => d._id === doctorData._id || d.usuario?._id === doctorData.usuario)
        if (doctor) {
          return doctor.nombreCompleto || 
                 (doctor.usuario?.nombre ? `${doctor.usuario.nombre} ${doctor.usuario.apellido || ''}`.trim() : 'Sin nombre')
        }
      }
      
      return `Doctor ID: ${doctorData._id?.slice(-6) || doctorData.usuario?.slice(-6) || 'Desconocido'}`
    }
    
    return 'Doctor desconocido'
  }

  const mostrarToast = (msg, tipo = 'success') => {
    setToast({ msg, tipo })
    setTimeout(() => setToast(null), 3000)
  }

  const puedeReasignarCita = (cita) => {
    if (!cita || cita.estado !== 'pendiente') return false

    const fechaCita = new Date(cita.fecha)
    const hoy = new Date()
    
    // Comparamos solo la fecha, permitiendo reasignar citas de hoy o del futuro
    fechaCita.setHours(0, 0, 0, 0)
    hoy.setHours(0, 0, 0, 0)

    return fechaCita >= hoy
  }

  useEffect(() => {
    const cargar = async () => {
      setCargando(true)
      
      // Cargar citas
      const citasResult = await getAdminCitas()
      if (citasResult.success) {
        const citasData = citasResult.data.datos?.citas || []
        console.log('📋 TabCitas - Cargadas:', citasData.length, 'citas')
        setCitas(citasData)
      }
      
      // Cargar doctores para reasignación y mostrar nombres
      const doctoresResult = await getAllDoctors()
      if (doctoresResult.success) {
        const todos = doctoresResult.data.data || doctoresResult.data || []
        setDoctores(todos.filter(d => d.estado === 'aprobado'))
      }
      
      // Cargar pacientes para mostrar nombres
      const pacientesResult = await getAdminPacientes()
      if (pacientesResult.success) {
        const pacientesData = pacientesResult.data.datos?.pacientes || []
        setPacientes(pacientesData)
      }
      
      setCargando(false)
    }
    cargar()
  }, [])

  const verDetalleCita = async (citaId) => {
    setLoadingDetalle(citaId)
    try {
      // Asegurarse de que los pacientes estén cargados para mostrar nombres
      if (pacientes.length === 0) {
        const pacientesResult = await getAdminPacientes()
        if (pacientesResult.success) {
          const pacientesData = pacientesResult.data.datos?.pacientes || []
          setPacientes(pacientesData)
        }
      }
      
      const result = await getAdminCitaById(citaId)
      if (result.success) {
        setDetalleCita(result.data.data || result.data)
      } else {
        mostrarToast(result.error || 'Error al cargar detalles', 'error')
      }
    } catch (error) {
      mostrarToast('Error al cargar detalles', 'error')
    }
    setLoadingDetalle(null)
  }

  // Función para reasignar cita
  const handleReasignar = async () => {
    if (!doctorDestino || !detalleCita) {
      mostrarToast('Selecciona un doctor destino', 'error')
      return
    }

    if (!puedeReasignarCita(detalleCita)) {
      mostrarToast('Solo se pueden reasignar citas pendientes que aún no han pasado', 'error')
      return
    }

    if (!window.confirm('¿Estás seguro de reasignar esta cita?')) return

    setReasignando(true)
    try {
      const result = await reasignarCitas(detalleCita._id || detalleCita.id, doctorDestino)
      if (result.success) {
        mostrarToast('✅ Cita reasignada exitosamente')
        setDetalleCita(null)
        // Recargar citas
        const citasResult = await getAdminCitas()
        if (citasResult.success) {
          setCitas(citasResult.data.datos?.citas || [])
        }
      } else {
        mostrarToast(result.error || 'Error al reasignar cita', 'error')
      }
    } catch (error) {
      mostrarToast('Error al reasignar cita', 'error')
    }
    setReasignando(false)
  }

  const filtradas = citas.filter(c => {
    const nombrePaciente = typeof c.paciente === 'string' 
      ? getNombrePaciente(c.paciente)
      : `${c.paciente?.nombre || ''} ${c.paciente?.apellido || ''}`.trim()
    
    const nombreDoctor = typeof c.doctor === 'string'
      ? getNombreDoctor(c.doctor)
      : c.doctor?.nombreCompleto || `${c.doctor?.usuario?.nombre || ''} ${c.doctor?.usuario?.apellido || ''}`.trim()
    
    return `${nombrePaciente} ${nombreDoctor}`.toLowerCase().includes(busqueda.toLowerCase())
  })

  return (
    <div>
      <Toast toast={toast} />

      {/* Modal de Detalles de Cita */}
      {detalleCita && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setDetalleCita(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Detalle de Cita</h2>
                <button onClick={() => setDetalleCita(null)} className="text-gray-400 hover:text-gray-600">
                  <X size={20} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Paciente</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-gray-500">Nombre:</span> {getNombrePaciente(detalleCita.paciente)}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Doctor</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-gray-500">Nombre:</span> Dr. {getNombreDoctor(detalleCita.doctor)}</p>
                    <p><span className="text-gray-500">Especialidad:</span> {detalleCita.doctor?.especialidad}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Fecha y Hora</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-gray-500">Fecha:</span> {new Date(detalleCita.fecha).toLocaleDateString('es-ES')}</p>
                    <p><span className="text-gray-500">Hora:</span> {detalleCita.horaInicio} - {detalleCita.horaFin}</p>
                    <p><span className="text-gray-500">Duración:</span> {detalleCita.duracion} minutos</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Información</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-gray-500">Estado:</span> <EstadoBadge estado={detalleCita.estado} /></p>
                    <p><span className="text-gray-500">Motivo:</span> {detalleCita.motivo}</p>
                    <p><span className="text-gray-500">Creada por:</span> {detalleCita.creadoPor}</p>
                  </div>
                </div>
              </div>

              {/* Reasignación */}
              {puedeReasignarCita(detalleCita) && (
              <div className="border-t border-gray-100 pt-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Reasignar Cita</h3>
                <div className="flex gap-3">
                  <select
                    value={doctorDestino}
                    onChange={(e) => setDoctorDestino(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    <option value="">Seleccionar doctor destino...</option>
                    {doctores
                      .filter(d => d._id !== detalleCita.doctor?._id)
                      .map(doctor => (
                        <option key={doctor._id} value={doctor._id}>
                          Dr. {doctor.nombreCompleto || `${doctor.nombre} ${doctor.apellido}`.trim()} - {doctor.especialidad}
                        </option>
                      ))}
                  </select>
                  <button
                    onClick={handleReasignar}
                    disabled={reasignando || !doctorDestino}
                    className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {reasignando ? 'Reasignando...' : 'Reasignar'}
                  </button>
                </div>
              </div>
              )}

              <div className="mt-6 flex justify-end">
                <Button onClick={() => setDetalleCita(null)} variant="outline">
                  Cerrar
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}

      <div className="relative mb-6">
        <Search size={18} className="absolute left-3 top-3 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar cita..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
        />
      </div>

      {cargando ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-3"></div>
          <p className="text-gray-500 text-sm">Cargando citas...</p>
        </div>
      ) : filtradas.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <Calendar size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 text-sm">No hay citas registradas</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtradas.map(cita => (
            <motion.div
              key={cita._id || cita.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-white border rounded-xl p-5 flex items-center justify-between gap-4
                ${!puedeReasignarCita(cita) ? 'opacity-75 border-gray-100' : 'border-gray-200 hover:shadow-sm'}`}
            >
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-xl">
                  <Calendar size={18} className="text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">
                    {typeof cita.paciente === 'string' 
                      ? getNombrePaciente(cita.paciente)
                      : cita.paciente?.nombreCompleto || `${cita.paciente?.nombre || ''} ${cita.paciente?.apellido || ''}`.trim() || 'Paciente desconocido'
                    }
                  </p>
                  <p className="text-xs text-gray-500">
                    Dr. {typeof cita.doctor === 'string'
                      ? getNombreDoctor(cita.doctor)
                      : cita.doctor?.nombreCompleto || `${cita.doctor?.usuario?.nombre || ''} ${cita.doctor?.usuario?.apellido || ''}`.trim() || 'Doctor desconocido'
                    }
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(cita.fecha).toLocaleDateString('es-ES')} • {cita.horaInicio || cita.hora} - {cita.horaFin || '---'} • {cita.motivo}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <EstadoBadge estado={cita.estado} />
                <button
                  onClick={() => verDetalleCita(cita._id || cita.id)}
                  className="text-xs text-gray-500 hover:text-primary hover:bg-primary/10 px-2 py-1.5 rounded-lg transition-colors"
                  disabled={loadingDetalle === (cita._id || cita.id)}
                >
                  {loadingDetalle === (cita._id || cita.id) ? (
                    <div className="w-3 h-3 border border-primary border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Eye size={12} />
                  )}
                </button>
                {puedeReasignarCita(cita) && (
                  <button
                    onClick={() => verDetalleCita(cita._id || cita.id)}
                    className="text-xs text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200 transition-colors"
                  >
                    Reasignar
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export default TabCitas
