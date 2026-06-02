import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calendar,
  FileText,
  Activity,
  Heart,
  User,
  Menu,
  Stethoscope,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import doctorService from '../../services/doctorService'
import Sidebar from '../../components/Sidebar'
import Button from '../../components/Button'
import DoctorProfile from '../../components/DoctorProfile'

import DoctorStats from './components/DoctorStats'
import TabCitas from './components/TabCitas'
import TabHistorias from './components/TabHistorias'
import TabOdontograma from './components/TabOdontograma'
import TabTratamientos from './components/TabTratamientos'

// ── TABS CONFIGURATION ──────────────────────────────────────────────────
const DOCTOR_TABS = [
  { id: 'citas', label: 'Mis Citas', icon: Calendar },
  { id: 'historias', label: 'Historias Clínicas', icon: FileText },
  { id: 'odontograma', label: 'Odontograma', icon: Activity },
  { id: 'tratamientos', label: 'Tratamientos', icon: Heart },
  { id: 'perfil', label: 'Mi Perfil', icon: User }
]

// ── COMPONENTE PRINCIPAL ──────────────────────────────────────────────────
const DoctorDashboardPage = ({ initialTab } = {}) => {
  const { user } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [tabActiva, setTabActiva] = useState(initialTab || 'citas')
  const [showProfile, setShowProfile] = useState(false)
  
  const [stats, setStats] = useState({
    citasHoy: 0,
    pacientesActivos: 0,
    historiasMes: 0,
    tratamientosActivos: 0
  })
  
  const [citas, setCitas] = useState([])
  const [cargando, setCargando] = useState(true)
  const [pacienteAtender, setPacienteAtender] = useState(null)

  useEffect(() => {
    if (initialTab) setTabActiva(initialTab)
  }, [initialTab])

  useEffect(() => {
    cargarDatosDoctor()
  }, [])

  const cargarDatosDoctor = async () => {
    setCargando(true)
    try {
      const hoy = new Date()
      const hoyStr = hoy.toISOString().split('T')[0]

      const citasResult = await doctorService.getDoctorCitas({ page: 1, limit: 50 })

      let citasHoy = 0
      let pacientesActivos = 0

      if (citasResult.success) {
        const todasCitas = citasResult.data.datos?.citas || []
        citasHoy = todasCitas.filter(c => {
          const fc = c.fecha ? new Date(c.fecha).toISOString().split('T')[0] : ''
          return fc === hoyStr
        }).length
        pacientesActivos = new Set(todasCitas.map(c => c.paciente?.id || c.paciente?._id).filter(Boolean)).size
        setCitas(todasCitas)
      }

      setStats({ citasHoy, pacientesActivos, historiasMes: 0, tratamientosActivos: 0 })
    } catch (error) {
      console.error('❌ DoctorDashboard - Error general:', error)
    } finally {
      setCargando(false)
    }
  }

  const handleAtenderPaciente = useCallback(async (cita) => {
    let pacienteId = cita.paciente?._id || cita.paciente?.id

    if (!pacienteId) {
      const result = await doctorService.getDoctorPacientes()
      if (result.success) {
        const pacientes = result.data.data || []
        const paciente = pacientes.find(p =>
          p.email === cita.paciente?.email ||
          p.nombreCompleto === cita.paciente?.nombreCompleto
        )
        if (paciente) {
          pacienteId = paciente._id || paciente.id
        }
      }
      if (!pacienteId) {
        console.error('No se pudo encontrar el ID del paciente')
        return
      }
    }

    setPacienteAtender({
      pacienteId,
      pacienteNombre: cita.paciente?.nombreCompleto || '',
      citaId: cita._id || cita.id,
      fechaCita: cita.fecha || cita.fechaISO,
      horaInicio: cita.horaInicio || cita.hora,
      horaFin: cita.horaFin,
      motivoCita: cita.motivo || ''
    })
    setTabActiva('historias')
  }, [])

  const handleLimpiarPacienteAtender = useCallback(() => {
    setPacienteAtender(null)
  }, [])

  const estadisticasPendientes = React.useMemo(() => {
    const pendientes = citas.filter(c => {
      const v = c.estado?.valor || c.estado || ''
      return v === 'pendiente' || v === 'confirmada'
    })
    return pendientes.length
  }, [citas])

  const getNotificacionesTab = (tabId) => {
    if (tabId === 'citas' && estadisticasPendientes > 0) {
      return estadisticasPendientes
    }
    return null
  }

  const TabContent = {
    citas: () => <TabCitas onAtender={handleAtenderPaciente} />,
    historias: () => (
      <TabHistorias
        pacienteSeleccionadoId={pacienteAtender?.pacienteId}
        pacienteNombre={pacienteAtender?.pacienteNombre}
        citaId={pacienteAtender?.citaId}
        motivoCita={pacienteAtender?.motivoCita}
        onLimpiarPaciente={handleLimpiarPacienteAtender}
        onSeleccionarPaciente={(paciente) => {
          setPacienteAtender({
            pacienteId: paciente._id || paciente.id,
            pacienteNombre: paciente.nombreCompleto || `${paciente.nombre} ${paciente.apellido}`,
            citaId: null,
            fechaCita: null,
            horaInicio: null,
            horaFin: null,
            motivoCita: ''
          })
        }}
      />
    ),
    odontograma: () => (
      <TabOdontograma
        pacienteSeleccionadoId={pacienteAtender?.pacienteId}
        pacienteNombre={pacienteAtender?.pacienteNombre}
        citaId={pacienteAtender?.citaId}
        fechaCita={pacienteAtender?.fechaCita}
        horaInicioCita={pacienteAtender?.horaInicio}
        horaFinCita={pacienteAtender?.horaFin}
        onLimpiarPaciente={handleLimpiarPacienteAtender}
      />
    ),
    tratamientos: () => (
      <TabTratamientos
        pacienteSeleccionadoId={pacienteAtender?.pacienteId}
        pacienteNombre={pacienteAtender?.pacienteNombre}
        citaId={pacienteAtender?.citaId}
        onLimpiarPaciente={handleLimpiarPacienteAtender}
      />
    ),
    perfil: DoctorProfile
  }

  const ComponenteActivo = TabContent[tabActiva]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 flex">
      <Sidebar 
        isOpen={sidebarOpen} 
        setIsOpen={setSidebarOpen}
        activeTab={tabActiva}
        setActiveTab={setTabActiva}
        userRole="doctor"
      />

      <div className="flex-1 min-w-0 overflow-auto">
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-30">
          <div className="px-4 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setSidebarOpen(true)} 
                className="lg:hidden text-gray-500 hover:text-gray-700 p-1"
              >
                <Menu size={22} />
              </button>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Panel de Doctor</h1>
                <p className="text-xs text-gray-500 hidden sm:block">Dental Bosch • {user?.nombre}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {estadisticasPendientes > 0 && (
                <span className="hidden sm:flex items-center gap-1.5 bg-amber-50 text-amber-700 text-xs font-medium px-3 py-1.5 rounded-full border border-amber-200">
                  <Clock size={12} />
                  {estadisticasPendientes} pendiente(s)
                </span>
              )}
              <span className="hidden sm:flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1.5 rounded-full border border-blue-200">
                <Stethoscope size={12} /> Doctor
              </span>
            </div>
          </div>
        </header>

        <div className="p-4 lg:p-6 w-full max-w-7xl mx-auto">
          <DoctorStats stats={stats} loading={cargando} />

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden w-full mt-6">
            <div className="flex border-b border-gray-200 overflow-x-auto">
              {DOCTOR_TABS.map(tab => {
                const Icon = tab.icon
                const activa = tabActiva === tab.id
                const notif = getNotificacionesTab(tab.id)
                return (
                  <button
                    key={tab.id}
                    data-tab={tab.id}
                    onClick={() => setTabActiva(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition-all border-b-2 relative
                      ${activa ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
                  >
                    <Icon size={16} />
                    {tab.label}
                    {notif !== null && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full shadow-sm">
                        {notif}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>

            <div className="p-4 lg:p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={tabActiva}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {ComponenteActivo && <ComponenteActivo />}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DoctorDashboardPage
