import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  Home,
  Calendar,
  FileText,
  Users,
  User,
  Settings,
  LogOut,
  Activity,
  Heart,
  Clock,
  ChevronDown,
  Menu,
  X
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Logo from './Logo'

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { user, logout } = useAuth()
  const location = useLocation()

  const isDoctor = user?.rol === 'doctor'
  const isAdmin = user?.rol === 'administrador'

  const patientMenuItems = [
    {
      title: 'Inicio',
      path: '/dashboard',
      icon: Home
    },
    {
      title: 'Mis Citas',
      path: '/dashboard/citas',
      icon: Calendar
    },
    {
      title: 'Tratamientos',
      path: '/dashboard/tratamientos',
      icon: Heart
    },
    {
      title: 'Odontograma',
      path: '/dashboard/odontograma',
      icon: Activity
    },
    {
      title: 'Historial',
      path: '/dashboard/historial',
      icon: FileText
    }
  ]

  const doctorMenuItems = [
    {
      title: 'Inicio',
      path: '/dashboard',
      icon: Home
    },
    {
      title: 'Citas',
      path: '/dashboard/citas-doctor',
      icon: Calendar
    },
    {
      title: 'Pacientes',
      path: '/dashboard/pacientes',
      icon: Users
    },
    {
      title: 'Tratamientos',
      path: '/dashboard/tratamientos-doctor',
      icon: Heart
    },
    {
      title: 'Historial Clínico',
      path: '/dashboard/historial-clinico',
      icon: FileText
    }
  ]

  const menuItems = isDoctor || isAdmin ? doctorMenuItems : patientMenuItems

  const isActive = (path) => {
    return location.pathname === path
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 z-50 h-full bg-white shadow-xl transition-all duration-300 transform
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        w-72 lg:translate-x-0 lg:static lg:z-0
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <Logo size="medium" />
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        {/* User info */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-lg">
                {user?.nombre?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="font-semibold text-dark">{user?.nombre}</p>
              <p className="text-sm text-gray-500 capitalize">{user?.rol}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`
                    flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200
                    ${isActive(item.path)
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-primary'
                    }
                  `}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.title}</span>
                </Link>
              )
            })}
          </div>

          {/* Settings section */}
          <div className="mt-8 pt-8 border-t border-gray-100">
            <Link
              to="/dashboard/perfil"
              onClick={() => setIsOpen(false)}
              className={`
                flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 mb-1
                ${isActive('/dashboard/perfil')
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-primary'
                }
              `}
            >
              <User size={20} />
              <span className="font-medium">Mi Perfil</span>
            </Link>

            <Link
              to="/dashboard/configuracion"
              onClick={() => setIsOpen(false)}
              className={`
                flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 mb-1
                ${isActive('/dashboard/configuracion')
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-primary'
                }
              `}
            >
              <Settings size={20} />
              <span className="font-medium">Configuración</span>
            </Link>

            <button
              onClick={() => {
                logout()
                setIsOpen(false)
              }}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200"
            >
              <LogOut size={20} />
              <span className="font-medium">Cerrar sesión</span>
            </button>
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100">
          <div className="text-center text-xs text-gray-500">
            <p>Dental Bosch v1.0</p>
            <p className="mt-1">© 2024 Todos los derechos reservados</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar
