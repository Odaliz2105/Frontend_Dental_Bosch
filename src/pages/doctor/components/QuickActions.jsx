import React from 'react'
import { motion } from 'framer-motion'
import { Calendar, Users, FileText, Clock, Heart, Plus, ChevronRight } from 'lucide-react'
import Button from '../../../components/Button'

const QuickActions = () => {
  const actions = [
    {
      title: 'Nueva Cita',
      description: 'Programar nueva cita',
      icon: Calendar,
      color: 'bg-blue-500 hover:bg-blue-600',
      onClick: () => console.log('Nueva cita')
    },
    {
      title: 'Nuevo Paciente',
      description: 'Registrar paciente',
      icon: Users,
      color: 'bg-green-500 hover:bg-green-600',
      onClick: () => console.log('Nuevo paciente')
    },
    {
      title: 'Historia Clínica',
      description: 'Crear historia',
      icon: FileText,
      color: 'bg-purple-500 hover:bg-purple-600',
      onClick: () => console.log('Nueva historia')
    },
    {
      title: 'Odontograma',
      description: 'Examen dental',
      icon: Heart,
      color: 'bg-pink-500 hover:bg-pink-600',
      onClick: () => console.log('Nuevo odontograma')
    }
  ]

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-600" />
          Acciones Rápidas
        </h2>
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
          Ver todas
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action, index) => {
          const Icon = action.icon
          return (
            <motion.button
              key={action.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              onClick={action.onClick}
              className={`${action.color} text-white rounded-lg p-4 hover:shadow-lg transition-all duration-200 group`}
            >
              <div className="flex flex-col items-center gap-2">
                <Icon className="w-6 h-6 mb-1" />
                <span className="text-sm font-medium">{action.title}</span>
                <span className="text-xs opacity-90">{action.description}</span>
              </div>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}

export default QuickActions
