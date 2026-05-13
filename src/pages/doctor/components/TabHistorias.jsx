import React from 'react'
import { motion } from 'framer-motion'
import { FileText, Plus, Search, User, Calendar } from 'lucide-react'
import Button from '../../../components/Button'

const TabHistorias = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Historias Clínicas</h2>
          <p className="text-sm text-gray-500">Gestiona las historias clínicas de tus pacientes</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Nueva Historia
        </Button>
      </div>

      {/* Busqueda */}
      <div className="max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar historias..."
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
          <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Historias Clínicas</h3>
          <p className="text-gray-500 mb-6">
            Aquí podrás crear y gestionar las historias clínicas completas de tus pacientes, incluyendo antecedentes, exámenes y diagnósticos.
          </p>
          <Button size="lg">
            <Plus className="w-4 h-4 mr-2" />
            Crear Primera Historia
          </Button>
        </motion.div>
      </div>
    </div>
  )
}

export default TabHistorias
