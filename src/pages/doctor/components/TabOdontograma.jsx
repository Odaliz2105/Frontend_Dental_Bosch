import React from 'react'
import { motion } from 'framer-motion'
import { Activity, Search, User, Plus } from 'lucide-react'
import Button from '../../../components/Button'

const TabOdontograma = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Odontograma</h2>
          <p className="text-sm text-gray-500">Examen dental interactivo</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Odontograma
        </Button>
      </div>

      {/* Selector de paciente */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Seleccionar Paciente</label>
        <div className="flex gap-4">
          <select className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option>Selecciona un paciente...</option>
            <option>Juan Pérez González</option>
            <option>María Rodríguez López</option>
          </select>
          <Button>
            <Activity className="w-4 h-4 mr-2" />
            Cargar Odontograma
          </Button>
        </div>
      </div>

      {/* Contenido placeholder odontograma */}
      <div className="text-center py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md mx-auto"
        >
          <Activity className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Odontograma Interactivo</h3>
          <p className="text-gray-500 mb-6">
            Selecciona un paciente para comenzar el examen dental interactivo. Podrás marcar caries, obturaciones, extracciones y más.
          </p>
          <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto">
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <div className="w-8 h-8 bg-blue-500 rounded-lg mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Dientes Sanos</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <div className="w-8 h-8 bg-red-500 rounded-lg mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Caries</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <div className="w-8 h-8 bg-yellow-500 rounded-lg mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Obturaciones</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <div className="w-8 h-8 bg-purple-500 rounded-lg mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Tratamientos</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default TabOdontograma
