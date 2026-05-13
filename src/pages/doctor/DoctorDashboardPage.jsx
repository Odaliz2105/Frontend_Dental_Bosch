import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calendar,
  Users,
  FileText,
  Activity,
  Clock,
  Heart,
  TrendingUp,
  User,
  Settings,
  Menu,
  X,
  Stethoscope,
  ChevronRight
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import Sidebar from '../../components/Sidebar'
import Button from '../../components/Button'

// Importar componentes del doctor
import DoctorStats from './components/DoctorStats'
import QuickActions from './components/QuickActions'
import TabCitas from './components/TabCitas'
import TabPacientes from './components/TabPacientes'
import TabHistorias from './components/TabHistorias'
import TabOdontograma from './components/TabOdontograma'
import TabTratamientos from './components/TabTratamientos'

// ── TABS CONFIGURATION ──────────────────────────────────────────────────
const DOCTOR_TABS = [
  { id: 'citas', label: 'Mis Citas', icon: Calendar },
  { id: 'pacientes', label: 'Mis Pacientes', icon: Users },
  { id: 'historias', label: 'Historias Clínicas', icon: FileText },
  { id: 'odontograma', label: 'Odontograma', icon: Activity },
  { id: 'tratamientos', label: 'Tratamientos', icon: Heart },
  { id: 'perfil', label: 'Mi Perfil', icon: User }
]

// ── COMPONENTE PRINCIPAL ──────────────────────────────────────────────────
const DoctorDashboardPage = ({ initialTab } = {}) => {
  const { user, getDoctorCitas } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [tabActiva, setTabActiva] = useState(initialTab || 'citas')
  const [showProfile, setShowProfile] = useState(false)
  
  // Estados para las estadísticas
  const [stats, setStats] = useState({
    citasHoy: 0,
    pacientesActivos: 0,
    historiasMes: 0,
    tratamientosActivos: 0
  })
  
  // Estados para datos del doctor
  const [citas, setCitas] = useState([])
  const [pacientes, setPacientes] = useState([])
  const [cargando, setCargando] = useState(true)

  // ── EFFECTS ────────────────────────────────────────────────────────
  useEffect(() => {
    if (initialTab) setTabActiva(initialTab)
  }, [initialTab])

  useEffect(() => {
    cargarDatosDoctor()
  }, [])

  // ── FUNCTIONS ───────────────────────────────────────────────────────
  const cargarDatosDoctor = async () => {
    setCargando(true)
    
    try {
      // Cargar citas del doctor
      const fechaActual = new Date()
      const añoActual = fechaActual.getFullYear()
      
      const params = {
        estado: 'pendiente',
        desde: `${añoActual}-01-01`,
        hasta: `${añoActual}-12-31`,
        page: 1,
        limit: 10
      }
      
      const result = await getDoctorCitas(params)
      if (result.success) {
        const citasData = result.data.datos?.citas || []
        setCitas(citasData)
        
        // Actualizar estadísticas
        setStats(prev => ({
          ...prev,
          citasHoy: citasData.length,
          pacientesActivos: new Set(citasData.map(c => c.paciente?.id)).size
        }))
        
        console.log('📋 DoctorDashboard - Citas cargadas:', citasData.length)
      } else {
        console.error('❌ DoctorDashboard - Error al cargar citas:', result.error)
      }
    } catch (error) {
      console.error('❌ DoctorDashboard - Error general:', error)
    } finally {
      setCargando(false)
    }
  }

  // ── TAB CONTENT COMPONENTS ───────────────────────────────────────────
  const TabContent = {
    citas: TabCitas,
    pacientes: TabPacientes,
    historias: TabHistorias,
    odontograma: TabOdontograma,
    tratamientos: TabTratamientos,
    perfil: () => <div>Perfil del doctor</div>
  }

  const ComponenteActivo = TabContent[tabActiva]

  // ── RENDER ───────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-light-bg flex">
      <Sidebar 
        isOpen={sidebarOpen} 
        setIsOpen={setSidebarOpen}
        activeTab={tabActiva}
        setActiveTab={setTabActiva}
        userRole="doctor"
      />

      <div className="flex-1 min-w-0 overflow-auto">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
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
            <span className="hidden sm:flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1.5 rounded-full border border-blue-200">
              <Stethoscope size={12} /> Doctor
            </span>
          </div>
        </header>

        <div className="p-4 lg:p-5 w-full">
          {/* Stats Cards */}
          <DoctorStats stats={stats} loading={cargando} />

          {/* Quick Actions */}
          <QuickActions />

          {/* Panel con tabs */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden w-full mt-6">
            {/* Tab bar */}
            <div className="flex border-b border-gray-200 overflow-x-auto">
              {DOCTOR_TABS.map(tab => {
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
