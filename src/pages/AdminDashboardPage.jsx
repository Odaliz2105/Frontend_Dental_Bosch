import React, { useState, useEffect, useContext } from 'react'

import { useLocation } from 'react-router-dom'

import { motion, AnimatePresence } from 'framer-motion'

import {

  Clock, Users, UserCheck, UserX, Calendar,

  CheckCircle, XCircle, Eye, Search,

  Mail, Phone, Stethoscope, AlertTriangle,

  Shield, Menu, X, Edit2, Trash2

} from 'lucide-react'

import { useAuth } from '../context/AuthContext'

import Sidebar from '../components/Sidebar'

import Button from '../components/Button'



// ── BADGE ESTADO ──────────────────────────────────────────

const EstadoBadge = ({ estado }) => {

  const config = {

    pendiente:  'bg-yellow-100 text-yellow-700 border-yellow-200',

    aprobado:   'bg-green-100  text-green-700  border-green-200',

    rechazado:  'bg-red-100    text-red-700    border-red-200',

    confirmada: 'bg-blue-100   text-blue-700   border-blue-200',

    cancelada:  'bg-gray-100   text-gray-600   border-gray-200',

  }

  const labels = {

    pendiente: 'Pendiente', aprobado: 'Aprobado',

    rechazado: 'Rechazado', confirmada: 'Confirmada', cancelada: 'Cancelada',

  }

  return (

    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config[estado] || config.pendiente}`}>

      {labels[estado] || estado}

    </span>

  )

}



// ── TOAST ─────────────────────────────────────────────────

const Toast = ({ toast }) => (

  <AnimatePresence>

    {toast && (

      <motion.div

        initial={{ opacity: 0, y: -20 }}

        animate={{ opacity: 1, y: 0 }}

        exit={{ opacity: 0, y: -20 }}

        className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg text-white text-sm font-medium

          ${toast.tipo === 'success' ? 'bg-green-600' : 'bg-red-600'}`}

      >

        {toast.msg}

      </motion.div>

    )}

  </AnimatePresence>

)



const ModalDetalle = ({ doctor, onClose, onDelete, onUpdate }) => {

  if (!doctor) return null



  const [editandoHorario, setEditandoHorario] = useState(false)

  const [horarioForm, setHorarioForm] = useState([])

  const [loadingHorario, setLoadingHorario] = useState(false)

  const [doctorCompleto, setDoctorCompleto] = useState(doctor)

  const { updateDoctorHorario, getDoctorById } = useAuth()



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



  // Cargar datos completos del doctor si no tiene horarioAtencion

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



  // Inicializar formulario de horario

  useEffect(() => {

    console.log('🔍 ModalDetalle - doctorCompleto:', doctorCompleto)

    console.log('🔍 ModalDetalle - doctorCompleto.horarioAtencion:', doctorCompleto?.horarioAtencion)

    

    if (doctorCompleto && doctorCompleto.horarioAtencion && doctorCompleto.horarioAtencion.length > 0) {

      console.log('✅ Cargando horarios existentes:', doctorCompleto.horarioAtencion)

      setHorarioForm([...doctorCompleto.horarioAtencion])

    } else {

      console.log('⚠️ No hay horarios, cargando horario por defecto')

      // Horario por defecto si no tiene

      setHorarioForm([

        { dia: 'lunes', horaInicio: '09:00', horaFin: '17:00', disponible: true },

        { dia: 'martes', horaInicio: '09:00', horaFin: '17:00', disponible: true },

        { dia: 'miercoles', horaInicio: '09:00', horaFin: '17:00', disponible: true },

        { dia: 'jueves', horaInicio: '09:00', horaFin: '17:00', disponible: true },

        { dia: 'viernes', horaInicio: '09:00', horaFin: '17:00', disponible: true }

      ])

    }

  }, [doctorCompleto])



  // Función para actualizar un día del horario

  const actualizarDia = (index, campo, valor) => {

    const nuevoHorario = [...horarioForm]

    nuevoHorario[index] = { ...nuevoHorario[index], [campo]: valor }

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

    

    setLoadingHorario(true)

    try {

      const result = await updateDoctorHorario(doctorCompleto._id, horarioForm)

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



  // Verificación de seguridad
  if (!doctorCompleto) {
    return null
  }

  const nombre = doctorCompleto.usuario?.nombre || doctorCompleto.nombre || ''
  const apellido = doctorCompleto.usuario?.apellido || doctorCompleto.apellido || ''
  const nombreCompleto = doctorCompleto.usuario?.nombreCompleto || 
                         doctorCompleto.nombreCompleto ||
                         `${nombre} ${apellido}`.trim() || 
                         'Sin nombre'
  const email = doctorCompleto.usuario?.email || doctorCompleto.email || 'No registrado'
  const telefono = doctorCompleto.usuario?.telefono || doctorCompleto.telefono || 'No registrado'
  const foto = doctorCompleto.usuario?.foto || doctorCompleto.foto || null
  const especialidad = doctorCompleto.especialidad || 'No especificada'
  const activo = doctorCompleto.activo
  const fecha = doctorCompleto.createdAt 
    ? new Date(doctorCompleto.createdAt).toLocaleDateString('es-ES')
    : 'No disponible'
  const estado = doctorCompleto.estado || doctorCompleto.usuario?.estado || 'pendiente'



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

              doctorCompleto.horarioAtencion && doctorCompleto.horarioAtencion.length > 0 ? (

                <div className="space-y-1">

                  {doctorCompleto.horarioAtencion.map((h, i) => (

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

                    <input

                      type="time"

                      value={dia.horaInicio}

                      onChange={(e) => actualizarDia(index, 'horaInicio', e.target.value)}

                      className="px-2 py-1 border border-gray-200 rounded text-xs"

                    />

                    <span className="text-gray-400">a</span>

                    <input

                      type="time"

                      value={dia.horaFin}

                      onChange={(e) => actualizarDia(index, 'horaFin', e.target.value)}

                      className="px-2 py-1 border border-gray-200 rounded text-xs"

                    />

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

                

                <div className="flex gap-2 pt-2 border-t border-gray-100">

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

          </div>



          <div className="mt-6 flex items-center justify-between">

            {onDelete && (

              <button

                onClick={() => {

                  if (!window.confirm('¿Estás seguro? El doctor será eliminado del sistema.')) return

                  onDelete(doctorCompleto._id)

                }}

                className="flex items-center gap-2 text-sm text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg border border-red-200 transition-colors"

              >

                <Trash2 size={15} />

                Eliminar Doctor

              </button>

            )}

            <Button onClick={onClose} variant="outline" className="ml-auto">

              Cerrar

            </Button>

          </div>

        </motion.div>

      </motion.div>

    </AnimatePresence>

  )

}



// ── TABS ──────────────────────────────────────────────────

const TABS = [

  { id: 'solicitudes', label: 'Solicitudes', icon: Clock },

  { id: 'doctores',    label: 'Doctores',    icon: Users },

  { id: 'pacientes',   label: 'Pacientes',   icon: UserCheck },

  { id: 'citas',       label: 'Citas',       icon: Calendar },

]



// ── PESTAÑA: SOLICITUDES ──────────────────────────────────

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



// ── PESTAÑA: DOCTORES ─────────────────────────────────────

const TabDoctores = () => {

  const { getAllDoctors, getDoctorById, deleteDoctor } = useAuth()

  const [doctores, setDoctores] = useState([])

  const [cargando, setCargando] = useState(true)

  const [busqueda, setBusqueda] = useState('')

  const [detalle, setDetalle] = useState(null)

  const [toast, setToast] = useState(null)

  const [loadingDetalle, setLoadingDetalle] = useState(null)



  const mostrarToast = (msg, tipo = 'success') => {

    setToast({ msg, tipo })

    setTimeout(() => setToast(null), 3000)

  }



  const cargar = async () => {

    console.log('🔄 TabDoctores.cargar() iniciado')

    setCargando(true)

    const result = await getAllDoctors()

    console.log('📥 getAllDoctors response:', result)

    if (result.success) {

      const todos = result.data.data || result.data || []

      console.log('📊 Todos los doctores:', todos.length, todos)

      // Filtrar por doctor.activo === true y doctor.usuario.estado === 'aprobado'

      const aprobados = todos.filter(d => 

        d.activo === true && 

        (d.usuario?.estado === 'aprobado' || d.estado === 'aprobado')

      )

      console.log('✅ Doctores aprobados filtrados:', aprobados.length, aprobados)

      setDoctores(aprobados)

    } else {

      console.error('❌ Error cargando doctores:', result.error)

    }

    setCargando(false)

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

    const result = await approveDoctor(

      doctor._id, 

      nuevoActivo ? 'aprobado' : 'rechazado'

    )

    if (result.success) {

      mostrarToast(

        nuevoActivo ? '✅ Doctor activado' : '⛔ Doctor desactivado',

        nuevoActivo ? 'success' : 'error'

      )

      await cargar()

    } else {

      mostrarToast(result.error || 'Error al cambiar estado', 'error')

    }

  }



  const handleEliminar = async (id) => {

    if (!window.confirm('¿Estás seguro de eliminar este doctor?')) return

    const result = await deleteDoctor(id)

    if (result.success) {

      mostrarToast('✅ Doctor eliminado correctamente')

      await cargar()

    } else {

      mostrarToast(result.error || 'Error al eliminar', 'error')

    }

  }



  const filtrados = doctores.filter(d =>

    `${d.usuario?.nombre || ''} ${d.usuario?.apellido || ''} ${d.especialidad || ''} ${d.usuario?.email || ''}` 

      .toLowerCase().includes(busqueda.toLowerCase())

  )



  return (

    <div>

      <Toast toast={toast} />

      <ModalDetalle 

        doctor={detalle} 

        onClose={() => setDetalle(null)}

        onUpdate={async () => {

          await cargar()

        }}

        onDelete={async (id) => {

          const result = await deleteDoctor(id)

          if (result.success) {

            mostrarToast('✅ Doctor eliminado correctamente')

            setDetalle(null)

            await cargar()

          } else {

            mostrarToast(result.error || 'Error al eliminar', 'error')

          }

        }}

      />



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

                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white font-bold text-lg">

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

                  </div>

                </div>

                <EstadoBadge estado={doctor.usuario?.estado} />

              </div>



              <div className="text-sm text-gray-500 mb-4">

                <p className="flex items-center gap-2">

                  <Mail size={13} className="text-primary" />

                  {doctor.usuario?.email || doctor.email || 'Email no disponible'}

                </p>

              </div>



              <div className="flex items-center pt-3 border-t border-gray-100">

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

              </div>

            </motion.div>

          ))}

        </div>

      )}

    </div>

  )

}



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
        console.log('� IDs de pacientes recibidos:', pacientesData.map(p => p._id))
        
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

                ${cita.estado === 'cancelada' ? 'opacity-50 border-gray-100' : 'border-gray-200 hover:shadow-sm'}`}

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

                {cita.estado !== 'cancelada' && (

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



// ── COMPONENTE PRINCIPAL ──────────────────────────────────

const AdminDashboardPage = ({ initialTab } = {}) => {

  const { user, getPendingDoctors, getAllDoctors, getAdminPacientes, getAdminCitas, getAdminPacienteById } = useAuth()

  const location = useLocation()

  const [sidebarOpen, setSidebarOpen] = useState(false)

  const [tabActiva, setTabActiva] = useState(initialTab || 'solicitudes')

  const [statSolicitudes, setStatSolicitudes] = useState(0)

  const [statDoctores, setStatDoctores] = useState(0)

  const [statPacientes, setStatPacientes] = useState(0)

  const [statCitas, setStatCitas] = useState(0)



  useEffect(() => {

    if (initialTab) setTabActiva(initialTab)

  }, [initialTab])



  useEffect(() => {

    if (location.state?.tab) {

      setTabActiva(location.state.tab)

    }

  }, [location.state])



  useEffect(() => {

    getPendingDoctors().then(r => {

      if (r.success) {
        const count = (r.data.datos?.doctores || []).length
        console.log('🔢 Actualizando statSolicitudes:', count)
        setStatSolicitudes(count)
      } else {
        console.log('❌ Error en getPendingDoctors, estableciendo statSolicitudes a 0')
        setStatSolicitudes(0)
      }

    }).catch(error => {
      console.error('❌ Error en getPendingDoctors:', error)
      setStatSolicitudes(0)
    })

    getAllDoctors().then(r => {

      if (r.success) {

        const todos = r.data.data || []

        // Contar solo doctores activos/aprobados, no los pendientes

        setStatDoctores(todos.filter(d => 

          d.activo === true && 

          (d.usuario?.estado === 'aprobado' || d.estado === 'aprobado')

        ).length)

      }

    })

    // Cargar datos de pacientes
    getAdminPacientes().then(r => {
      if (r.success) {
        const count = (r.data.datos?.pacientes || []).length
        console.log('🔢 Actualizando statPacientes:', count)
        setStatPacientes(count)
      } else {
        console.log('❌ Error en getAdminPacientes, estableciendo statPacientes a 0')
        setStatPacientes(0)
      }
    }).catch(error => {
      console.error('❌ Error en getAdminPacientes:', error)
      setStatPacientes(0)
    })

    // Cargar datos de citas
    getAdminCitas().then(r => {
      if (r.success) {
        const count = (r.data.datos?.citas || []).length
        console.log('🔢 Actualizando statCitas:', count)
        setStatCitas(count)
      } else {
        console.log('❌ Error en getAdminCitas, estableciendo statCitas a 0')
        setStatCitas(0)
      }
    }).catch(error => {
      console.error('❌ Error en getAdminCitas:', error)
      setStatCitas(0)
    })

  }, [])



  const stats = [

    { label: 'Solicitudes pendientes', value: statSolicitudes, color: 'text-yellow-600', bg: 'bg-yellow-50', icon: Clock },

    { label: 'Doctores registrados',   value: statDoctores,    color: 'text-green-600',  bg: 'bg-green-50',  icon: Users },

    { label: 'Pacientes',              value: statPacientes,   color: 'text-blue-600',   bg: 'bg-blue-50',   icon: UserCheck },

    { label: 'Citas',                  value: statCitas,       color: 'text-purple-600', bg: 'bg-purple-50', icon: Calendar },

  ]



  const TabContent = { solicitudes: TabSolicitudes, doctores: TabDoctores, pacientes: TabPacientes, citas: TabCitas }

  const ComponenteActivo = TabContent[tabActiva]



  return (

    <div className="min-h-screen bg-gray-50 flex">

      <Sidebar 

        isOpen={sidebarOpen} 

        setIsOpen={setSidebarOpen}

        activeTab={tabActiva}

        setActiveTab={setTabActiva}

        statSolicitudes={statSolicitudes}

      />



      <div className="flex-1 min-w-0 overflow-auto">

        {/* Header */}

        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">

          <div className="px-4 lg:px-8 h-16 flex items-center justify-between">

            <div className="flex items-center gap-4">

              <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-500 hover:text-gray-700 p-1">

                <Menu size={22} />

              </button>

              <div>

                <h1 className="text-lg font-bold text-gray-900">Panel de Administración</h1>

                <p className="text-xs text-gray-500 hidden sm:block">Dental Bosch • {user?.nombre}</p>

              </div>

            </div>

            <span className="hidden sm:flex items-center gap-1.5 bg-red-50 text-red-700 text-xs font-medium px-3 py-1.5 rounded-full border border-red-200">

              <Shield size={12} /> Administrador

            </span>

          </div>

        </header>



        <div className="p-4 lg:p-5 w-full">

          {/* Stats */}

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">

            {stats.map((s, i) => {

              const Icon = s.icon

              return (

                <motion.div

                  key={i}

                  initial={{ opacity: 0, y: 16 }}

                  animate={{ opacity: 1, y: 0 }}

                  transition={{ delay: i * 0.08 }}

                  className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4"

                >

                  <div className={`${s.bg} p-2.5 rounded-lg`}>

                    <Icon size={18} className={s.color} />

                  </div>

                  <div>

                    <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>

                    <p className="text-xs text-gray-500 leading-tight">{s.label}</p>

                  </div>

                </motion.div>

              )

            })}

          </div>



          {/* Panel con tabs */}

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden w-full">

            {/* Tab bar */}

            <div className="flex border-b border-gray-200 overflow-x-auto">

              {TABS.map(tab => {

                const Icon = tab.icon

                const activa = tabActiva === tab.id

                return (

                  <button

                    key={tab.id}

                    onClick={() => setTabActiva(tab.id)}

                    className={`flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition-all border-b-2

                      ${activa ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}

                  >

                    <Icon size={16} />

                    {tab.label}

                    {tab.id === 'solicitudes' && statSolicitudes > 0 && (

                      <span className="bg-yellow-400 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">

                        {statSolicitudes}

                      </span>

                    )}

                  </button>

                )

              })}

            </div>



            {/* Contenido */}

            <div className="p-4 lg:p-6">

              <AnimatePresence mode="wait">

                <motion.div

                  key={tabActiva}

                  initial={{ opacity: 0, x: 10 }}

                  animate={{ opacity: 1, x: 0 }}

                  exit={{ opacity: 0, x: -10 }}

                  transition={{ duration: 0.2 }}

                >

                  <ComponenteActivo />

                </motion.div>

              </AnimatePresence>

            </div>

          </div>

        </div>

      </div>

    </div>

  )

}



export default AdminDashboardPage

