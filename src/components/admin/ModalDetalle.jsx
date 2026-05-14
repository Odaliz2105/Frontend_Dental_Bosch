import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Phone, Clock, X, Edit2, Trash2 } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import doctorService from '../../services/doctorService'
import EstadoBadge from '../common/EstadoBadge'
import Button from '../Button'

const ModalDetalle = ({ doctor, onClose, onUpdate }) => {
  const [editandoHorario, setEditandoHorario] = useState(false)
  const [horarioForm, setHorarioForm] = useState([])
  const [loadingHorario, setLoadingHorario] = useState(false)
  const [doctorCompleto, setDoctorCompleto] = useState(doctor)
  const { getDoctorById } = useAuth()

  // Función para mostrar toast local
  const mostrarToastLocal = (msg, tipo = 'success') => {
    // Crear un toast temporal
    const toastElement = document.createElement('div')
    toastElement.className = `fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg text-white text-sm font-medium ${
      tipo === 'success' ? 'bg-green-600' : 'bg-red-600'
    }`
    toastElement.textContent = msg
    document.body.appendChild(toastElement)
    
    setTimeout(() => {
      toastElement.remove()
    }, 3000)
  }

  const validarHorario = (horaInicio, horaFin) => {
    const inicio = parseInt(horaInicio.replace(':', ''))
    const fin = parseInt(horaFin.replace(':', ''))
    const minimo = 900   // 09:00
    const maximo = 1900  // 19:00
    
    if (inicio < minimo) return 'La hora de inicio no puede ser antes de las 09:00'
    if (fin > maximo) return 'La hora de fin no puede ser después de las 19:00'
    if (fin <= inicio) return 'La hora de fin debe ser mayor que la hora de inicio'
    return null
  }

  // Función para actualizar un día del horario
  const actualizarDia = (index, campo, valor) => {
    const nuevoHorario = [...horarioForm]
    const diaActual = { ...nuevoHorario[index] }
    
    // Aplicar validaciones
    if (campo === 'horaInicio' || campo === 'horaFin') {
      // Solo bloquear si ambas horas están completas Y hay error claro
      // Permitir edición intermedia sin bloquear
      const horaInicio = campo === 'horaInicio' ? valor : diaActual.horaInicio
      const horaFin = campo === 'horaFin' ? valor : diaActual.horaFin
      
      if (horaInicio && horaFin && horaInicio >= '19:00') {
        mostrarToastLocal('⚠️ La hora de inicio no puede ser después de las 19:00', 'error')
        return
      }
      if (horaInicio && horaFin && horaFin > '19:00') {
        mostrarToastLocal('⚠️ La hora de fin no puede ser después de las 19:00', 'error')
        return
      }
    }
    
    nuevoHorario[index] = { ...diaActual, [campo]: valor }
    setHorarioForm(nuevoHorario)
  }

  // Función para guardar el horario
  const guardarHorario = async () => {
    console.log('🔄 guardarHorario iniciado')
    console.log('🔍 IDs disponibles en doctorCompleto:', {
      '_id': doctorCompleto._id,
      'id': doctorCompleto.id,
      'usuario._id': doctorCompleto.usuario?._id,
      'usuario.id': doctorCompleto.usuario?.id
    })
    console.log('📋 Horario a guardar:', horarioForm)
    
    // Validar todos los días antes de guardar
    for (let i = 0; i < horarioForm.length; i++) {
      const dia = horarioForm[i]
      if (!dia.disponible) continue // Skip si no está disponible
      
      const error = validarHorario(dia.horaInicio, dia.horaFin)
      if (error) {
        mostrarToastLocal(`⚠️ ${dia.dia}: ${error}`, 'error')
        return
      }
    }
    
    setLoadingHorario(true)
    try {
      const result = await doctorService.updateDoctorHorario(doctorCompleto._id, horarioForm)
      if (result.success) {
        mostrarToastLocal('✅ Horario actualizado exitosamente')
        setEditandoHorario(false)
        
        // Actualizar los datos del doctor con el nuevo horario
        if (result.data && result.data.horarioAtencion) {
          // Actualizar el objeto doctor localmente
          setDoctorCompleto(prev => ({ ...prev, horarioAtencion: result.data.horarioAtencion }))
        }
        
        // Forzar recarga de la lista para actualizar datos
        if (onUpdate && typeof onUpdate === 'function') {
          await onUpdate()
        }
      } else {
        mostrarToastLocal(result.error || 'Error al actualizar horario', 'error')
      }
    } catch (error) {
      console.error('Error guardando horario:', error)
      mostrarToastLocal('Error al actualizar horario', 'error')
    }
    setLoadingHorario(false)
  }

  // Cargar datos completos del doctor y configurar horario
  useEffect(() => {
    const cargarDoctorCompleto = async () => {
      console.log('🔍 ModalDetalle - Doctor recibido:', doctor)
      console.log('🔍 ModalDetalle - doctor.horarioAtencion:', doctor?.horarioAtencion)
      
      if (doctor && (!doctor.horarioAtencion || doctor.horarioAtencion.length === 0)) {
        console.log('🔄 Cargando datos completos del doctor...')
        const result = await getDoctorById(doctor._id || doctor.id)
        if (result.success && result.data) {
          console.log('✅ Doctor completo cargado:', result.data)
          console.log('🔍 Estructura de result.data:', {
            'result.data': result.data,
            'result.data.data': result.data.data,
            'typeof result.data': typeof result.data,
            'isArray': Array.isArray(result.data)
          })
          // Usar result.data directamente, no el objeto completo
          const doctorData = result.data.data || result.data // Manejar ambas estructuras posibles
          setDoctorCompleto(doctorData)
        }
      } else {
        setDoctorCompleto(doctor)
      }
    }
    
    if (doctor) {
      cargarDoctorCompleto()
    }
  }, [doctor, getDoctorById])

  // Configurar formulario de horario cuando cambia doctorCompleto
  useEffect(() => {
    console.log('🔍 ModalDetalle - doctorCompleto:', doctorCompleto)
    console.log('🔍 ModalDetalle - doctorCompleto.horarioAtencion:', doctorCompleto?.horarioAtencion)
    
    if (doctorCompleto && doctorCompleto.horarioAtencion && doctorCompleto.horarioAtencion.length > 0) {
      console.log('✅ Cargando horarios existentes:', doctorCompleto.horarioAtencion)
      const horariosExistentes = [...doctorCompleto.horarioAtencion]
      // Usar setTimeout para evitar el warning de React
      setTimeout(() => {
        setHorarioForm(horariosExistentes)
      }, 0)
    } else {
      console.log('⚠️ No hay horarios, cargando horario por defecto')
      // Horario por defecto si no tiene
      const horarioDefecto = [
        { dia: 'lunes', horaInicio: '09:00', horaFin: '17:00', disponible: true },
        { dia: 'martes', horaInicio: '09:00', horaFin: '17:00', disponible: true },
        { dia: 'miercoles', horaInicio: '09:00', horaFin: '17:00', disponible: true },
        { dia: 'jueves', horaInicio: '09:00', horaFin: '17:00', disponible: true },
        { dia: 'viernes', horaInicio: '09:00', horaFin: '17:00', disponible: true }
      ]
      // Usar setTimeout para evitar el warning de React
      setTimeout(() => {
        setHorarioForm(horarioDefecto)
      }, 0)
    }
  }, [doctorCompleto])

  // Verificación de seguridad
  if (!doctor) return null

  const nombre = doctorCompleto?.usuario?.nombre || doctorCompleto?.nombre || ''
  const apellido = doctorCompleto?.usuario?.apellido || doctorCompleto?.apellido || ''
  const nombreCompleto = doctorCompleto?.usuario?.nombreCompleto || 
                         doctorCompleto?.nombreCompleto ||
                         `${nombre} ${apellido}`.trim() || 
                         'Sin nombre'
  const email = doctorCompleto?.usuario?.email || doctorCompleto?.email || 'No registrado'
  const telefono = doctorCompleto?.usuario?.telefono || doctorCompleto?.telefono || 'No registrado'
  const foto = doctorCompleto?.usuario?.foto || doctorCompleto?.foto || null
  const especialidad = doctorCompleto?.especialidad || 'No especificada'
  const activo = doctorCompleto?.activo
  const fecha = doctorCompleto?.createdAt 
    ? new Date(doctorCompleto.createdAt).toLocaleDateString('es-ES')
    : 'No disponible'
  const estado = doctorCompleto?.estado || doctorCompleto?.usuario?.estado || 'pendiente'

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Detalle del Doctor</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
          </div>

          <div className="flex items-center gap-4 mb-6">
            {foto ? (
              <img 
                src={foto} 
                alt={nombreCompleto}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white text-2xl font-bold">
                {nombreCompleto.charAt(0)}
              </div>
            )}
            <div>
              <p className="text-lg font-semibold text-gray-900">{nombreCompleto}</p>
              <p className="text-sm text-gray-500">{especialidad}</p>
              <EstadoBadge estado={estado} />
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3 text-gray-600">
              <Mail size={16} className="text-primary flex-shrink-0" />
              <span>{email}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <Phone size={16} className="text-primary flex-shrink-0" />
              <span>{telefono}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <Clock size={16} className="text-primary flex-shrink-0" />
              <span>Registrado: {fecha}</span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-gray-700">Horario de Atención</p>
              {!editandoHorario && (
                <button
                  onClick={() => setEditandoHorario(true)}
                  className="text-xs text-primary hover:text-primary/80 flex items-center gap-1"
                >
                  <Edit2 size={12} />
                  Editar
                </button>
              )}
            </div>

            {!editandoHorario ? (
              // Vista normal del horario
              doctorCompleto?.horarioAtencion && doctorCompleto.horarioAtencion.length > 0 ? (
                <div className="space-y-1">
                  {doctorCompleto?.horarioAtencion?.map((h, i) => (
                    <div key={i} className="flex justify-between text-xs text-gray-500">
                      <span className="capitalize">{h.dia}</span>
                      <span>{h.disponible ? `${h.horaInicio} - ${h.horaFin}` : 'No disponible'}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400">No hay horario configurado</p>
              )
            ) : (
              // Formulario de edición
              <div className="space-y-2">
                {horarioForm.map((dia, index) => (
                  <div key={dia.dia} className="flex items-center gap-2 text-xs">
                    <span className="w-16 capitalize font-medium text-gray-600">{dia.dia}</span>
                    <div className="flex items-center gap-1">
                      <input
                        type="time"
                        value={dia.horaInicio}
                        onChange={(e) => actualizarDia(index, 'horaInicio', e.target.value)}
                        className="px-2 py-1 border border-gray-200 rounded text-xs"
                        min="09:00"
                        max="19:00"
                        title="Horario de consultorio: 9:00 AM - 7:00 PM"
                      />
                      <span className="text-gray-400">a</span>
                      <input
                        type="time"
                        value={dia.horaFin}
                        onChange={(e) => actualizarDia(index, 'horaFin', e.target.value)}
                        className="px-2 py-1 border border-gray-200 rounded text-xs"
                        min="09:00"
                        max="19:00"
                        title="Horario de consultorio: 9:00 AM - 7:00 PM"
                      />
                    </div>
                    <label className="flex items-center gap-1 ml-2">
                      <input
                        type="checkbox"
                        checked={dia.disponible}
                        onChange={(e) => actualizarDia(index, 'disponible', e.target.checked)}
                        className="w-3 h-3 text-primary"
                      />
                      <span className="text-gray-600">Disponible</span>
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>

          {editandoHorario && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex gap-2">
                <button
                  onClick={guardarHorario}
                  disabled={loadingHorario}
                  className="px-3 py-1 bg-primary text-white text-xs rounded hover:bg-primary/80 disabled:opacity-50"
                >
                  {loadingHorario ? 'Guardando...' : 'Guardar'}
                </button>
                <button
                  onClick={() => setEditandoHorario(false)}
                  className="px-3 py-1 border border-gray-300 text-gray-600 text-xs rounded hover:bg-gray-50"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
          <div className="mt-6 flex justify-end">
            <Button onClick={onClose} variant="outline">
              Cerrar
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default ModalDetalle
