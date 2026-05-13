import React from 'react'
import { motion } from 'framer-motion'
import { Calendar, Users, FileText, Heart, TrendingUp } from 'lucide-react'

const DoctorStats = ({ stats, loading }) => {
  const statsCards = [
    {
      title: 'Citas Hoy',
      value: loading ? '...' : stats.citasHoy,
      change: '+2',
      icon: Calendar,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Pacientes Activos',
      value: loading ? '...' : stats.pacientesActivos,
      change: '+12%',
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Historias Este Mes',
      value: loading ? '...' : stats.historiasMes,
      change: '+5%',
      icon: FileText,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      title: 'Tratamientos Activos',
      value: loading ? '...' : stats.tratamientosActivos,
      change: '+8%',
      icon: Heart,
      color: 'from-pink-500 to-pink-600',
      bgColor: 'bg-pink-50',
      textColor: 'text-pink-600'
    }
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statsCards.map((stat, index) => {
        const Icon = stat.icon
        return (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`${stat.bgColor} p-3 rounded-lg`}>
                <Icon className={`w-6 h-6 ${stat.textColor}`} />
              </div>
              {stat.change && (
                <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  {stat.change}
                </span>
              )}
            </div>
            <div>
              <h3 className={`text-2xl font-bold ${stat.textColor} mb-1`}>
                {stat.value}
              </h3>
              <p className="text-sm text-gray-600">{stat.title}</p>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

export default DoctorStats
