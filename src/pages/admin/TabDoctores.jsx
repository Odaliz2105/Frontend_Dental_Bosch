import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Eye, Mail, Users } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import Toast from '../../components/common/Toast'
import ModalDetalle from '../../components/admin/ModalDetalle'
import EstadoBadge from '../../components/common/EstadoBadge'
import Button from '../../components/Button'

const TabDoctores = () => {
  const { getAllDoctors, getAllDoctorsIncludingInactive, getInactiveDoctors, getDoctorById, deleteDoctor, approveDoctor, verificarCitasDoctor, softDeleteDoctor, reactivarDoctor } = useAuth()
  const [doctores, setDoctores] = useState([])
  const [cargando, setCargando] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [detalle, setDetalle] = useState(null)
  const [toast, setToast] = useState(null)
  const [loadingDetalle, setLoadingDetalle] = useState(null)
  const [filtroActivo, setFiltroActivo] = useState('todos') // 'todos', 'activos', 'inactivos'

  const mostrarToast = (msg, tipo = 'success') => {
    setToast({ msg, tipo })
    setTimeout(() => setToast(null), 3000)
  }

  const cargar = async () => {
    console.log('🔄 TabDoctores.cargar() iniciado')
    setCargando(true)
    
    try {
      // Obtener doctores activos
      const activosResult = await getAllDoctors()
      console.log('📥 getAllDoctors response:', activosResult)
      
      // Obtener doctores inactivos
      const inactivosResult = await getInactiveDoctors()
      console.log('� getInactiveDoctors response:', inactivosResult)
      
      let todos = []
      
      // Procesar doctores activos
      if (activosResult.success) {
        const activos = activosResult.data.data || activosResult.data.datos?.doctores || activosResult.data || []
        console.log('🟢 Doctores activos:', activos.length, activos)
        todos = todos.concat(activos)
      }
      
      // Procesar doctores inactivos
      if (inactivosResult.success) {
        const inactivos = inactivosResult.data.datos?.doctores || []
        console.log('🔴 Doctores inactivos:', inactivos.length, inactivos)
        todos = todos.concat(inactivos)
      }
      
      console.log('📊 Todos los doctores combinados:', todos.length, todos)
      console.log('🔍 Estructura de doctores:', todos.map(d => ({
        _id: d._id,
        nombre: d.usuario?.nombre || d.nombre || d.nombreCompleto,
        nombreCompleto: d.usuario?.nombreCompleto || d.nombreCompleto,
        estado: d.usuario?.estado || d.estado,
        activo: d.activo,
        eliminado: d.eliminado,
        email: d.usuario?.email || d.email
      })))
      
      // Filtrar por doctor.estado === 'aprobado' o 'inactivo' (mostrar activos e inactivos)
      const aprobados = todos.filter(d => 
        (d.usuario?.estado === 'aprobado' || d.estado === 'aprobado') ||
        (d.usuario?.estado === 'inactivo' || d.estado === 'inactivo')
      )
      console.log('✅ Doctores filtrados:', aprobados.length, aprobados)
      setDoctores(aprobados)
      
    } catch (error) {
      console.error('❌ Error cargando doctores:', error)
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => { 
    console.log('🚀 TabDoctores montado, cargando datos iniciales')
    cargar() 
  }, [])

  useEffect(() => {
    const handleDoctorStatusChange = (event) => {
      console.log('📢 Evento doctorStatusChanged recibido:', event.detail)
      console.log('🔄 Recargando lista de doctores por cambio de estado...')
      cargar()
    }

    console.log('👂 Configurando listener para doctorStatusChanged')
    window.addEventListener('doctorStatusChanged', handleDoctorStatusChange)
    return () => {
      console.log('🔇 Removiendo listener para doctorStatusChanged')
      window.removeEventListener('doctorStatusChanged', handleDoctorStatusChange)
    }
  }, [])

  const toggleEstado = async (doctor) => {
    const nuevoActivo = !doctor.activo
    const accion = nuevoActivo ? 'activar' : 'desactivar'
    
    // Confirmación del usuario
    if (!window.confirm(`¿Estás seguro de ${accion} este doctor?`)) return
    
    if (nuevoActivo) {
      // Reactivar doctor usando el nuevo endpoint
      const result = await reactivarDoctor(doctor._id)
      if (result.success) {
        mostrarToast('✅ Doctor reactivado correctamente', 'success')
        await cargar()
      } else {
        mostrarToast(result.error || 'Error al reactivar doctor', 'error')
      }
    } else {
      // Desactivar doctor usando soft delete (el backend ya verifica las citas)
      setCargando(true)
      const result = await softDeleteDoctor(doctor._id)
      setCargando(false)
      
      if (result.success) {
        mostrarToast('✅ Doctor desactivado correctamente', 'success')
        await cargar()
      } else {
        // Mostrar error específico del backend (incluyendo el error 409 por citas pendientes)
        if (result.tieneCitasPendientes && result.datosCitas) {
          const totalCitas = result.datosCitas.totalCitasPendientes || result.datosCitas.citas?.length || 0
          mostrarToast(
            `❌ No se puede desactivar al doctor. Tiene ${totalCitas} cita(s) pendiente(s). Debe reasignar las citas a otro doctor primero.`, 
            'error'
          )
        } else {
          mostrarToast(result.error || 'Error al desactivar doctor', 'error')
        }
      }
    }
  }

  
  const filtrados = doctores.filter(d => {
    console.log(`🔍 Filtrando doctor ${d._id}: activo=${d.activo}, filtroActivo=${filtroActivo}`)
    
    // Aplicar filtro de estado primero
    if (filtroActivo === 'activos' && !d.activo) {
      console.log(`❌ Doctor ${d._id} excluido de activos (activo=${d.activo})`)
      return false
    }
    if (filtroActivo === 'inactivos' && d.activo) {
      console.log(`❌ Doctor ${d._id} excluido de inactivos (activo=${d.activo})`)
      return false
    }
    
    // Luego aplicar filtro de búsqueda
    const incluyeBusqueda = `${d.usuario?.nombre || ''} ${d.usuario?.apellido || ''} ${d.nombreCompleto || ''} ${d.especialidad || ''} ${d.usuario?.email || d.email || ''}` 
      .toLowerCase().includes(busqueda.toLowerCase())
    
    console.log(`✅ Doctor ${d._id} incluido: activo=${d.activo}, incluyeBusqueda=${incluyeBusqueda}`)
    
    return incluyeBusqueda
  })

  return (
    <div>
      <Toast toast={toast} />
      <ModalDetalle 
        doctor={detalle} 
        onClose={() => setDetalle(null)}
        onUpdate={async () => {
          await cargar()
        }}
      />

      {/* Pestañas de filtrado */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setFiltroActivo('todos')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filtroActivo === 'todos'
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Todos ({doctores.length})
        </button>
        <button
          onClick={() => setFiltroActivo('activos')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filtroActivo === 'activos'
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Activos ({doctores.filter(d => d.activo).length})
        </button>
        <button
          onClick={() => setFiltroActivo('inactivos')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filtroActivo === 'inactivos'
              ? 'bg-red-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Inactivos ({doctores.filter(d => !d.activo).length})
        </button>
      </div>

      <div className="relative mb-6">
        <Search size={18} className="absolute left-3 top-3 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar doctor..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
        />
      </div>

      {cargando ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-3"></div>
          <p className="text-gray-500 text-sm">Cargando doctores...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtrados.map(doctor => (
            <motion.div
              key={doctor._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {doctor.usuario?.foto ? (
                    <img 
                      src={doctor.usuario.foto} 
                      alt={doctor.usuario.nombreCompleto}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                        doctor.activo ? 'bg-gradient-to-r from-primary to-secondary' : 'bg-gray-400'
                      }`}>
                      {doctor.usuario?.nombre?.charAt(0) || 
                       doctor.nombreCompleto?.charAt(0) || 'D'}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-gray-900">
                      {doctor.usuario?.nombreCompleto || 
                       (doctor.usuario?.nombre 
                         ? `${doctor.usuario.nombre} ${doctor.usuario.apellido || ''}`.trim()
                         : doctor.nombreCompleto || 'Sin nombre')}
                    </p>
                    <p className="text-xs text-gray-500">{doctor.especialidad}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <EstadoBadge estado={doctor.usuario?.estado || doctor.estado} />
                      {!doctor.activo && (
                        <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                          Inactivo
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-sm text-gray-500 mb-4">
                <p className="flex items-center gap-2">
                  <Mail size={13} className="text-primary" />
                  {doctor.usuario?.email || doctor.email || 'Email no disponible'}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <button
                  onClick={async () => {
                    setLoadingDetalle(doctor._id)
                    const result = await getDoctorById(doctor._id)
                    console.log('resultado getDoctorById:', result)
                    if (result.success && result.data?.data) {
                      setDetalle(result.data.data)
                    } else if (result.success && result.data) {
                      setDetalle(result.data)
                    } else {
                      setDetalle(doctor)
                    }
                    setLoadingDetalle(null)
                  }}
                  className="flex items-center gap-1 text-xs text-gray-500 hover:text-primary transition-colors px-2 py-1.5 rounded-lg hover:bg-primary/10"
                >
                  {loadingDetalle === doctor._id 
                    ? <div className="w-3 h-3 border border-primary border-t-transparent rounded-full animate-spin" />
                    : <Eye size={13} />
                  }
                  Ver detalle
                </button>
                
                <button
                  onClick={() => toggleEstado(doctor)}
                  className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg transition-colors ${
                    doctor.activo 
                      ? 'text-red-600 hover:bg-red-50 border border-red-200' 
                      : 'text-green-600 hover:bg-green-50 border border-green-200'
                  }`}
                >
                  {doctor.activo ? 'Desactivar' : 'Activar'}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export default TabDoctores
