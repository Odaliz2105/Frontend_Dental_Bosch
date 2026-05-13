import React from 'react'
import { motion } from 'framer-motion'
import { Heart, Plus, Search, TrendingUp } from 'lucide-react'
import Button from '../../../components/Button'

const TabTratamientos = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Tratamientos</h2>
          <p className="text-sm text-gray-500">Planes de tratamiento y seguimiento</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Tratamiento
        </Button>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Activos', value: '12', color: 'bg-blue-100 text-blue-800' },
          { label: 'Completados', value: '45', color: 'bg-green-100 text-green-800' },
          { label: 'En Progreso', value: '8', color: 'bg-yellow-100 text-yellow-800' },
          { label: 'Pendientes', value: '3', color: 'bg-purple-100 text-purple-800' }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white border border-gray-200 rounded-lg p-4 text-center"
          >
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${stat.color} mb-2`}>
              {stat.label}
            </div>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Busqueda */}
      <div className="max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar tratamientos..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Contenido placeholder */}
      <div className="text-center py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md mx-auto"
        >
          <Heart className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Planes de Tratamiento</h3>
          <p className="text-gray-500 mb-6">
            Crea y gestiona planes de tratamiento personalizados para cada paciente. Incluye procedimientos, costos y seguimiento.
          </p>
          <Button size="lg">
            <Plus className="w-4 h-4 mr-2" />
            Crear Plan de Tratamiento
          </Button>
        </motion.div>
      </div>
    </div>
  )
}

export default TabTratamientos
