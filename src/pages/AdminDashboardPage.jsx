import React, { useState, useEffect } from 'react'
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

// ── MODAL DETALLE DOCTOR ──────────────────────────────────
const ModalDetalle = ({ doctor, onClose }) => {
  if (!doctor) return null
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
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white text-2xl font-bold">
              {(doctor.nombre || doctor.usuario?.nombre)?.charAt(0)}
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-900">
                {doctor.nombre || doctor.usuario?.nombre} {doctor.apellido || doctor.usuario?.apellido}
              </p>
              <p className="text-sm text-gray-500">{doctor.especialidad}</p>
              <EstadoBadge estado={doctor.estado || 'pendiente'} />
            </div>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3 text-gray-600">
              <Mail size={16} className="text-primary" />
              <span>{doctor.email || doctor.usuario?.email}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <Phone size={16} className="text-primary" />
              <span>{doctor.telefono || doctor.usuario?.telefono || 'No registrado'}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <Shield size={16} className="text-primary" />
              <span>Cédula: {doctor.cedula || doctor.usuario?.cedula || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <Clock size={16} className="text-primary" />
              <span>Registrado: {new Date(doctor.createdAt || doctor.usuario?.createdAt).toLocaleDateString('es-ES')}</span>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <Button onClick={onClose} variant="outline">Cerrar</Button>
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
  const { getPendingDoctors, approveDoctor } = useAuth()
  const [solicitudes, setSolicitudes] = useState([])
  const [cargando, setCargando] = useState(true)
  const [loadingBtn, setLoadingBtn] = useState({})
  const [toast, setToast] = useState(null)
  const [detalle, setDetalle] = useState(null)
  const [busqueda, setBusqueda] = useState('')

  const mostrarToast = (msg, tipo = 'success') => {
    setToast({ msg, tipo })
    setTimeout(() => setToast(null), 3000)
  }

  const cargar = async () => {
    setCargando(true)
    const result = await getPendingDoctors()
    if (result.success) setSolicitudes(result.data.datos?.doctores || [])
    else mostrarToast('Error al cargar solicitudes', 'error')
    setCargando(false)
  }

  useEffect(() => { cargar() }, [])

  const handleAccion = async (id, accion) => {
    setLoadingBtn(prev => ({ ...prev, [id]: true }))
    const result = await approveDoctor(id, accion)
    if (result.success) {
      mostrarToast(accion === 'aprobado' ? '✅ Doctor aprobado' : '⛔ Doctor rechazado', accion === 'aprobado' ? 'success' : 'error')
      await cargar()
    } else {
      mostrarToast(result.error || 'Error al procesar', 'error')
    }
    setLoadingBtn(prev => ({ ...prev, [id]: false }))
  }

  const pendientes = solicitudes.filter(s =>
    `${s.nombre || s.usuario?.nombre} ${s.apellido || s.usuario?.apellido} ${s.email || s.usuario?.email}` 
      .toLowerCase().includes(busqueda.toLowerCase())
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
                      {doctor.nombre || doctor.usuario?.nombre} {doctor.apellido || doctor.usuario?.apellido}
                    </p>
                    <p className="text-sm text-gray-500">{doctor.email || doctor.usuario?.email}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Stethoscope size={12} />
                        {doctor.especialidad || 'No especificada'}
                      </span>
                      <span>•</span>
                      <span>{new Date(doctor.createdAt || doctor.usuario?.createdAt).toLocaleDateString('es-ES')}</span>
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
                    onClick={() => handleAccion(doctor._id, 'aprobado')}
                    loading={loadingBtn[doctor._id]}
                    className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1.5"
                    size="small"
                  >
                    <CheckCircle size={14} className="mr-1" /> Aprobar
                  </Button>
                  <Button
                    onClick={() => handleAccion(doctor._id, 'rechazado')}
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
  const { getAllDoctors, approveDoctor, deleteDoctor } = useAuth()
  const [doctores, setDoctores] = useState([])
  const [cargando, setCargando] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [detalle, setDetalle] = useState(null)
  const [toast, setToast] = useState(null)

  const mostrarToast = (msg, tipo = 'success') => {
    setToast({ msg, tipo })
    setTimeout(() => setToast(null), 3000)
  }

  const cargar = async () => {
    setCargando(true)
    const result = await getAllDoctors()
    if (result.success) setDoctores(result.data.data || result.data || [])
    setCargando(false)
  }

  useEffect(() => { cargar() }, [])

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
    `${d.nombre} ${d.apellido} ${d.especialidad} ${d.email}` 
      .toLowerCase().includes(busqueda.toLowerCase())
  )

  return (
    <div>
      <Toast toast={toast} />
      <ModalDetalle doctor={detalle} onClose={() => setDetalle(null)} />

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
              className={`bg-white border rounded-xl p-5 transition-all ${
                doctor.activo ? 'border-gray-200 hover:shadow-md' : 'border-gray-100 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg
                    ${doctor.activo ? 'bg-gradient-to-r from-primary to-secondary' : 'bg-gray-400'}`}>
                    {doctor.usuario?.nombre?.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{doctor.usuario?.nombre} {doctor.usuario?.apellido}</p>
                    <p className="text-xs text-gray-500">{doctor.especialidad}</p>
                  </div>
                </div>
                <EstadoBadge estado={doctor.activo ? 'aprobado' : 'rechazado'} />
              </div>

              <div className="text-sm text-gray-500 space-y-1 mb-4">
                <p className="flex items-center gap-2">
                  <Mail size={13} className="text-primary" />{doctor.usuario?.email}
                </p>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                <button
                  onClick={() => setDetalle(doctor)}
                  className="flex items-center gap-1 text-xs text-gray-500 hover:text-primary transition-colors px-2 py-1.5 rounded-lg hover:bg-primary/10"
                >
                  <Eye size={13} /> Ver detalle
                </button>
                <button
                  onClick={() => toggleEstado(doctor)}
                  className={`ml-auto flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg transition-colors font-medium
                    ${doctor.activo
                      ? 'text-red-600 hover:bg-red-50 border border-red-200'
                      : 'text-green-600 hover:bg-green-50 border border-green-200'
                    }`}
                >
                  {doctor.activo
                    ? <><UserX size={13} /> Desactivar</>
                    : <><UserCheck size={13} /> Activar</>
                  }
                </button>
                <button
                  onClick={() => handleEliminar(doctor._id)}
                  className="flex items-center gap-1 text-xs text-red-500 hover:bg-red-50 px-2 py-1.5 rounded-lg border border-red-200 transition-colors"
                >
                  <Trash2 size={13} /> Eliminar
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
  const { getAdminPacientes } = useAuth()
  const [pacientes, setPacientes] = useState([])
  const [cargando, setCargando] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [pagination, setPagination] = useState({})

  useEffect(() => {
    const cargar = async () => {
      setCargando(true)
      const result = await getAdminPacientes()
      if (result.success) {
        setPacientes(result.data.datos?.pacientes || [])
        setPagination(result.data.datos?.pagination || {})
      }
      setCargando(false)
    }
    cargar()
  }, [])

  const filtrados = pacientes.filter(p =>
    `${p.nombre} ${p.apellido} ${p.email}`.toLowerCase().includes(busqueda.toLowerCase())
  )

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
                {['Paciente', 'Email', 'Teléfono', 'Doctor Asignado', 'Estado'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtrados.map(p => (
                <tr key={p._id} className="hover:bg-gray-50">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm">
                        {p.nombre?.charAt(0)}
                      </div>
                      <span className="font-medium text-gray-900 text-sm">{p.nombre} {p.apellido}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-500">{p.email}</td>
                  <td className="px-5 py-4 text-sm text-gray-500">{p.telefono || '—'}</td>
                  <td className="px-5 py-4">
                    {p.doctor
                      ? <div>
                          <p className="text-sm font-medium text-gray-900">
                            Dr. {p.doctor.usuario?.nombre} {p.doctor.usuario?.apellido}
                          </p>
                          <p className="text-xs text-gray-400">{p.doctor.especialidad}</p>
                        </div>
                      : <span className="text-xs text-orange-500 flex items-center gap-1">
                          <AlertTriangle size={12} />Sin asignar
                        </span>
                    }
                  </td>
                  <td className="px-5 py-4">
                    <EstadoBadge estado={p.activo ? 'aprobado' : 'rechazado'} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

const TabCitas = () => {
  const { getAdminCitas } = useAuth()
  const [citas, setCitas] = useState([])
  const [cargando, setCargando] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [toast, setToast] = useState(null)

  const mostrarToast = (msg, tipo = 'success') => {
    setToast({ msg, tipo })
    setTimeout(() => setToast(null), 3000)
  }

  useEffect(() => {
    const cargar = async () => {
      setCargando(true)
      const result = await getAdminCitas()
      if (result.success) {
        setCitas(result.data.datos?.citas || [])
      }
      setCargando(false)
    }
    cargar()
  }, [])

  const filtradas = citas.filter(c =>
    `${c.paciente?.nombre} ${c.paciente?.apellido} ${c.doctor?.usuario?.nombre}` 
      .toLowerCase().includes(busqueda.toLowerCase())
  )

  return (
    <div>
      <Toast toast={toast} />

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
              key={cita._id}
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
                    {cita.paciente?.nombre} {cita.paciente?.apellido}
                  </p>
                  <p className="text-xs text-gray-500">
                    Dr. {cita.doctor?.usuario?.nombre} {cita.doctor?.usuario?.apellido}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(cita.fecha).toLocaleDateString('es-ES')} • {cita.hora} — {cita.motivo}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <EstadoBadge estado={cita.estado} />
                {cita.estado !== 'cancelada' && (
                  <button
                    className="text-xs text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200 transition-colors"
                  >
                    {/* TODO: abrir modal reasignación con reasignarCitas() */}
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
  const { user, getPendingDoctors, getAllDoctors } = useAuth()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [tabActiva, setTabActiva] = useState(initialTab || 'solicitudes')
  const [statSolicitudes, setStatSolicitudes] = useState(0)
  const [statDoctores, setStatDoctores] = useState(0)

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
      if (r.success) setStatSolicitudes((r.data.datos?.doctores || []).length)
    })
    getAllDoctors().then(r => {
      if (r.success) setStatDoctores((r.data.data || []).length)
    })
  }, [])

  const stats = [
    { label: 'Solicitudes pendientes', value: statSolicitudes, color: 'text-yellow-600', bg: 'bg-yellow-50', icon: Clock },
    { label: 'Doctores registrados',   value: statDoctores,    color: 'text-green-600',  bg: 'bg-green-50',  icon: Users },
    { label: 'Pacientes',              value: '—',             color: 'text-blue-600',   bg: 'bg-blue-50',   icon: UserCheck },
    { label: 'Citas',                  value: '—',             color: 'text-purple-600', bg: 'bg-purple-50', icon: Calendar },
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
