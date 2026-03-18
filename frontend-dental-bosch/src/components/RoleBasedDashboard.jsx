import React from 'react'
import { useAuth } from '../context/AuthContext'
import AdminDashboardPage from '../pages/AdminDashboardPage'
import DoctorDashboardPage from '../pages/DoctorDashboardPage'
import PatientDashboardPage from '../pages/PatientDashboardPage'

const RoleBasedDashboard = () => {
  const { user } = useAuth()

  // Renderizar dashboard según el rol del usuario
  const renderDashboard = () => {
    // Detectar si es administrador por email o rol específico
    const isAdmin = user?.rol === 'admin' || 
                   user?.rol === 'administrador' || 
                   user?.email === 'admin@dentalbosch.com'
    
    if (isAdmin) {
      return <AdminDashboardPage />
    }
    
    if (user?.rol === 'doctor') {
      return <DoctorDashboardPage />
    }
    
    if (user?.rol === 'paciente') {
      return <PatientDashboardPage />
    }
    
    return <div className="min-h-screen bg-light-bg flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Rol no reconocido</h1>
        <p className="text-gray-600">Por favor contacta al administrador del sistema.</p>
      </div>
    </div>
  }

  return renderDashboard()
}

export default RoleBasedDashboard
