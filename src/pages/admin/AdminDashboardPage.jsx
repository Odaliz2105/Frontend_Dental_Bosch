import React, { useState, useEffect, useContext } from 'react'

import { useLocation } from 'react-router-dom'

import { motion, AnimatePresence } from 'framer-motion'

import {

  Clock, Users, UserCheck, UserX, Calendar,

  CheckCircle, XCircle, Eye, Search,

  Mail, Phone, Stethoscope, AlertTriangle,

  Shield, Menu, X, Edit2, Trash2

} from 'lucide-react'

import { useAuth } from '../../context/AuthContext'

import Sidebar from '../../components/Sidebar'

import Button from '../../components/Button'

import EstadoBadge from '../../components/common/EstadoBadge'

import Toast from '../../components/common/Toast'

import ModalDetalle from '../../components/admin/ModalDetalle'

import TabSolicitudes from './TabSolicitudes'

import TabDoctores from './TabDoctores'

import TabPacientes from './TabPacientes'

import TabCitas from './TabCitas'






// ── TABS ──────────────────────────────────────────────────

const TABS = [

  { id: 'solicitudes', label: 'Solicitudes', icon: Clock },

  { id: 'doctores',    label: 'Doctores',    icon: Users },

  { id: 'pacientes',   label: 'Pacientes',   icon: UserCheck },

  { id: 'citas',       label: 'Citas',       icon: Calendar },

]




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



  const TabContent = { solicitudes: TabSolicitudes, doctores: TabDoctores, pacientes: TabPacientes, citas: TabCitas };

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

