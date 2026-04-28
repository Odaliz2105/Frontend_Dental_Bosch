import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { 
  Home, Calendar, FileText, Users, User,
  Settings, LogOut, Activity, Heart, Clock,
  X, Shield, UserCheck, Stethoscope
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Logo from './Logo'

const Sidebar = ({ isOpen, setIsOpen, activeTab, setActiveTab }) => {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const isDoctor = user?.rol === 'doctor'
  const isAdmin = user?.rol === 'admin' || 
                  user?.rol === 'administrador' || 
                  user?.email === 'admin@dentalbosch.com'

  const adminMenuItems = [
    { title: 'Solicitudes', tab: 'solicitudes', icon: Clock },
    { title: 'Doctores', tab: 'doctores', icon: Users },
    { title: 'Pacientes', tab: 'pacientes', icon: UserCheck },
    { title: 'Citas', tab: 'citas', icon: Calendar },
  ]

  const doctorMenuItems = [
    { title: 'Inicio', path: '/dashboard', icon: Home },
    { title: 'Citas', path: '/dashboard/citas-doctor', icon: Calendar },
    { title: 'Pacientes', path: '/dashboard/pacientes', icon: Users },
    { title: 'Tratamientos', path: '/dashboard/tratamientos-doctor', icon: Heart },
    { title: 'Historial Clínico', path: '/dashboard/historial-clinico', icon: FileText },
  ]

  const isActive = (path) => location.pathname === path

  const handleAdminTab = (tab) => {
    if (setActiveTab) setActiveTab(tab)
    navigate('/dashboard', { state: { tab } })
    setIsOpen(false)
  }

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div className={`
        fixed top-0 left-0 z-40 h-full bg-white shadow-xl transition-all duration-300 transform
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        w-64 lg:translate-x-0 lg:static lg:z-0 lg:block lg:flex-shrink-0
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <Logo size="medium" />
          <button onClick={() => setIsOpen(false)} className="lg:hidden text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        {/* User info */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white font-semibold">
                {user?.nombre?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-dark text-sm truncate">{user?.nombre}</p>
              <p className="text-xs text-gray-500 capitalize truncate">
                {isAdmin ? 'Administrador' : user?.rol}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          
          {/* Admin navigation — pestañas del dashboard */}
          {isAdmin && (
            <div className="space-y-1 mb-6">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-3">
                Gestión
              </p>
              {adminMenuItems.map((item) => {
                const Icon = item.icon
                const activa = activeTab === item.tab
                return (
                  <button
                    key={item.tab}
                    onClick={() => handleAdminTab(item.tab)}
                    className={`
                      w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-left
                      ${activa
                        ? 'bg-primary text-white shadow-sm'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-primary'
                      }
                    `}
                  >
                    <Icon size={18} />
                    <span className="font-medium text-sm">{item.title}</span>
                    {item.tab === 'solicitudes' && (
                      <span className={`ml-auto text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold
                        ${activa ? 'bg-white text-primary' : 'bg-yellow-400 text-white'}`}>
                        !
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          )}

          {/* Doctor navigation */}
          {isDoctor && (
            <div className="space-y-1 mb-6">
              {doctorMenuItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`
                      flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200
                      ${isActive(item.path)
                        ? 'bg-primary text-white shadow-sm'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-primary'
                      }
                    `}
                  >
                    <Icon size={18} />
                    <span className="font-medium text-sm">{item.title}</span>
                  </Link>
                )
              })}
            </div>
          )}

          {/* Sección inferior — común para todos */}
          <div className="pt-4 border-t border-gray-100 space-y-1">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-3">
              Cuenta
            </p>
            <Link
              to="/dashboard/perfil"
              onClick={() => setIsOpen(false)}
              className={`
                flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200
                ${isActive('/dashboard/perfil')
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-primary'
                }
              `}
            >
              <User size={18} />
              <span className="font-medium text-sm">Mi Perfil</span>
            </Link>

            <button
              onClick={() => { logout(); setIsOpen(false) }}
              className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200"
            >
              <LogOut size={18} />
              <span className="font-medium text-sm">Cerrar sesión</span>
            </button>
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100">
          <p className="text-center text-xs text-gray-400">Dental Bosch v1.0</p>
        </div>
      </div>
    </>
  )
}

export default Sidebar
