import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, Search, Mail, Phone, Calendar, Heart, Eye } from 'lucide-react'
import { useAuth } from '../../../context/AuthContext'
import Button from '../../../components/Button'

const TabPacientes = () => {
  const [pacientes, setPacientes] = useState([])
  const [loading, setLoading] = useState(true)
  const [busqueda, setBusqueda] = useState('')

  useEffect(() => {
    // Simulación de carga de pacientes
    setTimeout(() => {
      setPacientes([
        {
          id: '1',
          nombreCompleto: 'Juan Pérez González',
          email: 'juan.perez@email.com',
          telefono: '809-123-4567',
          edad: 35,
          ultimaVisita: '2024-05-10',
          historiasCount: 3,
          tratamientosActivos: 2
        },
        {
          id: '2',
          nombreCompleto: 'María Rodríguez López',
          email: 'maria.rodriguez@email.com',
          telefono: '809-987-6543',
          edad: 28,
          ultimaVisita: '2024-05-08',
          historiasCount: 1,
          tratamientosActivos: 1
        }
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const pacientesFiltrados = pacientes.filter(paciente =>
    paciente.nombreCompleto.toLowerCase().includes(busqueda.toLowerCase()) ||
    paciente.email.toLowerCase().includes(busqueda.toLowerCase())
  )

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="text-gray-500 mt-2">Cargando pacientes...</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Búsqueda */}
      <div className="flex items-center gap-4">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar pacientes..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        <Button>
          <Users className="w-4 h-4 mr-2" />
          Nuevo Paciente
        </Button>
      </div>

      {/* Lista de pacientes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pacientesFiltrados.map((paciente, index) => (
          <motion.div
            key={paciente.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-lg">
                  {paciente.nombreCompleto.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{paciente.nombreCompleto}</h3>
                  <p className="text-sm text-gray-500">{paciente.edad} años</p>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Mail className="w-4 h-4" />
                <span>{paciente.email}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Phone className="w-4 h-4" />
                <span>{paciente.telefono}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>Última visita: {paciente.ultimaVisita}</span>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
              <div className="flex gap-4 text-sm">
                <span className="text-gray-500">
                  <Heart className="w-4 h-4 inline mr-1" />
                  {paciente.historiasCount} historias
                </span>
                <span className="text-blue-600 font-medium">
                  {paciente.tratamientosActivos} activos
                </span>
              </div>
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        ))}
      </div>

      {pacientesFiltrados.length === 0 && !loading && (
        <div className="text-center py-12">
          <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron pacientes</h3>
          <p className="text-gray-500">
            {busqueda ? 'Intenta con otra búsqueda' : 'No tienes pacientes registrados'}
          </p>
        </div>
      )}
    </div>
  )
}

export default TabPacientes
