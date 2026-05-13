import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Clock, User, Search, Filter, Eye, CheckCircle, XCircle } from 'lucide-react'
import { useAuth } from '../../../context/AuthContext'
import Button from '../../../components/Button'

const TabCitas = () => {
  const { getDoctorCitas } = useAuth()
  const [citas, setCitas] = useState([])
  const [loading, setLoading] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('todos')
  const [vista, setVista] = useState('lista') // 'lista' o 'calendario'

  useEffect(() => {
    cargarCitas()
  }, [])

  const cargarCitas = async () => {
    setLoading(true)
    try {
      const fechaActual = new Date()
      const añoActual = fechaActual.getFullYear()
      
      const params = {
        desde: `${añoActual}-01-01`,
        hasta: `${añoActual}-12-31`,
        page: 1,
        limit: 50
      }
      
      const result = await getDoctorCitas(params)
      if (result.success) {
        const citasData = result.data.datos?.citas || []
        setCitas(citasData)
        console.log('📋 TabCitas - Citas cargadas:', citasData.length)
      }
    } catch (error) {
      console.error('❌ TabCitas - Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const citasFiltradas = citas.filter(cita => {
    const coincideBusqueda = cita.paciente?.nombreCompleto?.toLowerCase().includes(busqueda.toLowerCase()) ||
                           cita.motivo?.toLowerCase().includes(busqueda.toLowerCase())
    
    const coincideEstado = filtroEstado === 'todos' || cita.estado?.valor === filtroEstado
    
    return coincideBusqueda && coincideEstado
  })

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'pendiente': return 'bg-yellow-100 text-yellow-800'
      case 'confirmada': return 'bg-green-100 text-green-800'
      case 'finalizada': return 'bg-blue-100 text-blue-800'
      case 'cancelada': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="text-gray-500 mt-2">Cargando citas...</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Filtros y búsqueda */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar por paciente o motivo..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="flex gap-2">
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="todos">Todos los estados</option>
            <option value="pendiente">Pendientes</option>
            <option value="confirmada">Confirmadas</option>
            <option value="finalizada">Finalizadas</option>
            <option value="cancelada">Canceladas</option>
          </select>
          
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setVista('lista')}
              className={`px-3 py-1 rounded ${vista === 'lista' ? 'bg-white shadow-sm' : ''}`}
            >
              Lista
            </button>
            <button
              onClick={() => setVista('calendario')}
              className={`px-3 py-1 rounded ${vista === 'calendario' ? 'bg-white shadow-sm' : ''}`}
            >
              Calendario
            </button>
          </div>
        </div>
      </div>

      {/* Lista de citas */}
      <div className="space-y-3">
        <AnimatePresence>
          {citasFiltradas.map((cita, index) => (
            <motion.div
              key={cita.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                      {cita.paciente?.nombreCompleto?.charAt(0) || 'P'}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{cita.paciente?.nombreCompleto}</h3>
                      <p className="text-sm text-gray-500">{cita.paciente?.email}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-700">{cita.fechaLarga}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-700">{cita.horaFormateada}</span>
                    </div>
                    <div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEstadoColor(cita.estado?.valor)}`}>
                        {cita.estado?.icono} {cita.estado?.etiqueta}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Motivo:</span> {cita.motivo}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => console.log('Ver detalles:', cita.id)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {citasFiltradas.length === 0 && !loading && (
        <div className="text-center py-12">
          <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron citas</h3>
          <p className="text-gray-500">
            {busqueda ? 'Intenta con otra búsqueda' : 'No tienes citas programadas'}
          </p>
        </div>
      )}
    </div>
  )
}

export default TabCitas
