import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, UserCheck, Eye, CheckCircle, XCircle, Stethoscope } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import Toast from "../../components/common/Toast"
import ModalDetalle from '../../components/admin/ModalDetalle'
import Button from '../../components/Button'

const TabSolicitudes = () => {
  const { getPendingDoctors, aprobarDoctorAdmin, rechazarDoctorAdmin, getAllDoctors } = useAuth()
  const [solicitudes, setSolicitudes] = useState([])
  const [cargando, setCargando] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [loadingBtn, setLoadingBtn] = useState({})
  const [toast, setToast] = useState(null)
  const [detalle, setDetalle] = useState(null)

  const mostrarToast = (msg, tipo = 'success') => {
    setToast({ msg, tipo })
    setTimeout(() => setToast(null), 3000)
  }

  const cargar = async () => {
    console.log('🔄 TabSolicitudes.cargar() iniciado')
    setCargando(true)
    const result = await getPendingDoctors()
    console.log('📥 getPendingDoctors response:', result)
    if (result.success) {
      const solicitudesData = result.data.datos?.doctores || []
      console.log('📋 Solicitudes pendientes cargadas:', solicitudesData.length, solicitudesData)
      setSolicitudes(solicitudesData)
    } else {
      console.error('❌ Error cargando solicitudes:', result.error)
      mostrarToast('Error al cargar solicitudes', 'error')
    }
    setCargando(false)
  }

  useEffect(() => { cargar() }, [])

  const handleAccion = async (doctor, accion) => {
    const doctorId = doctor._id
    const usuarioId = doctor.usuario?._id
    console.log('🔄 handleAccion iniciado:', { doctorId, usuarioId, accion, doctor })
    console.log('🎯 Usando usuario._id para la acción:', usuarioId)
    setLoadingBtn(prev => ({ ...prev, [doctor._id]: true }))
    
    let result
    if (accion === 'aprobado') {
      console.log('📤 Enviando solicitud de aprobación para usuario:', usuarioId)
      result = await aprobarDoctorAdmin(usuarioId)
    } else {
      console.log('📤 Enviando solicitud de rechazo para usuario:', usuarioId)
      result = await rechazarDoctorAdmin(usuarioId)
    }
    
    console.log('📥 Respuesta del backend:', result)
    
    if (result.success) {
      console.log('✅ Acción exitosa, recargando listas...')
      mostrarToast(
        accion === 'aprobado' 
          ? '✅ Doctor aprobado y notificado por email' 
          : '⛔ Doctor rechazado y notificado por email',
        accion === 'aprobado' ? 'success' : 'error'
      )
      
      // Recargar ambas listas: solicitudes pendientes y doctores aprobados
      console.log('🔄 Recargando lista de solicitudes pendientes...')
      await cargar()
      console.log('✅ Lista de solicitudes recargada')
      
      // Notificar a la pestaña de doctores que recargue los datos
      console.log('📢 Enviando evento doctorStatusChanged:', { action: accion, doctorId })
      window.dispatchEvent(new CustomEvent('doctorStatusChanged', { 
        detail: { action: accion, doctorId } 
      }))
    } else {
      console.error('❌ Error en la acción:', result.error)
      mostrarToast(result.error || 'Error al procesar', 'error')
    }
    setLoadingBtn(prev => ({ ...prev, [doctor._id]: false }))
  }

  const pendientes = solicitudes.filter(s => 
    // getPendingDoctors devuelve solo pendientes, no necesita filtro de estado
    `${s.nombreCompleto || `${s.usuario?.nombre} ${s.usuario?.apellido}`.trim()} ${s.usuario?.email}` 
      .toLowerCase()
      .includes(busqueda.toLowerCase())
  )

  return (
    <div>
      <Toast toast={toast} />
      <ModalDetalle doctor={detalle} onClose={() => setDetalle(null)} />

      <div className="relative mb-6">
        <Search size={18} className="absolute left-3 top-3 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar por nombre o email..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
        />
      </div>

      {cargando ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-3"></div>
          <p className="text-gray-500 text-sm">Cargando solicitudes...</p>
        </div>
      ) : pendientes.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <UserCheck size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 text-sm">No hay solicitudes pendientes</p>
        </div>
      ) : (
        <div className="space-y-3">
          {pendientes.map(doctor => (
            <motion.div
              key={doctor._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 flex items-center justify-center text-primary font-bold text-lg flex-shrink-0">
                    {(doctor.nombre || doctor.usuario?.nombre)?.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {doctor.nombreCompleto || `${doctor.usuario?.nombre} ${doctor.usuario?.apellido}`.trim()}
                    </p>
                    <p className="text-sm text-gray-500">{doctor.usuario?.email}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Stethoscope size={12} />
                        {doctor.especialidad || 'No especificada'}
                      </span>
                      <span>•</span>
                      <span>{new Date(doctor.createdAt).toLocaleDateString('es-ES')}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => setDetalle(doctor)}
                    className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                    title="Ver detalle"
                  >
                    <Eye size={16} />
                  </button>
                  <Button
                    onClick={() => handleAccion(doctor, 'aprobado')}
                    loading={loadingBtn[doctor._id]}
                    className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1.5"
                    size="small"
                  >
                    <CheckCircle size={14} className="mr-1" /> Aprobar
                  </Button>
                  <Button
                    onClick={() => handleAccion(doctor, 'rechazado')}
                    loading={loadingBtn[doctor._id]}
                    variant="outline"
                    className="border-red-300 text-red-600 hover:bg-red-50 text-xs px-3 py-1.5"
                    size="small"
                  >
                    <XCircle size={14} className="mr-1" /> Rechazar
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export default TabSolicitudes
