import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Clock, Search, Eye, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { useAuth } from '../../../context/AuthContext'
import Button from '../../../components/Button'

const EstadoBadge = ({ estado }) => {
  const config = {
    pendiente: 'bg-yellow-100 text-yellow-800',
    confirmada: 'bg-green-100 text-green-800',
    finalizada: 'bg-blue-100 text-blue-800',
    cancelada: 'bg-red-100 text-red-800',
  }
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config[estado?.valor || estado] || 'bg-gray-100 text-gray-800'}`}>
      {estado?.etiqueta || estado || 'Sin estado'}
    </span>
  )
}

const ModalAccion = ({ cita, onClose, onConfirm }) => {
  const [accion, setAccion] = useState('')
  const [notas, setNotas] = useState('')
  const [motivo, setMotivo] = useState('')
  const [loading, setLoading] = useState(false)

  const handleConfirmar = async () => {
    if (!accion) return
    setLoading(true)
    await onConfirm(cita._id || cita.id, accion, motivo, notas)
    setLoading(false)
    onClose()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          Actualizar estado de cita
        </h2>

        <div className="mb-4 p-3 bg-gray-50 rounded-xl text-sm text-gray-600">
          <p><span className="font-medium">Paciente:</span> {cita.paciente?.nombreCompleto}</p>
          <p><span className="font-medium">Fecha:</span> {cita.fechaLarga}</p>
          <p><span className="font-medium">Hora:</span> {cita.horaFormateada}</p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nuevo estado
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { valor: 'confirmada', label: 'Confirmar', color: 'border-green-300 text-green-700 bg-green-50' },
              { valor: 'finalizada', label: 'Finalizar', color: 'border-blue-300 text-blue-700 bg-blue-50' },
              { valor: 'cancelada', label: 'Cancelar', color: 'border-red-300 text-red-700 bg-red-50' },
            ].map(op => (
              <button
                key={op.valor}
                onClick={() => setAccion(op.valor)}
                className={`py-2 px-3 rounded-lg border text-sm font-medium transition-all
                  ${accion === op.valor ? op.color + ' ring-2 ring-offset-1' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
              >
                {op.label}
              </button>
            ))}
          </div>
        </div>

        {accion === 'cancelada' && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Motivo de cancelación
            </label>
            <input
              type="text"
              value={motivo}
              onChange={e => setMotivo(e.target.value)}
              placeholder="Ingresa el motivo..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        )}

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notas (opcional)
          </label>
          <textarea
            value={notas}
            onChange={e => setNotas(e.target.value)}
            placeholder="Observaciones de la cita..."
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleConfirmar}
            loading={loading}
            disabled={!accion || loading}
          >
            Confirmar
          </Button>
        </div>
      </motion.div>
    </motion.div>
  )
}

const TabCitas = () => {
  const { getDoctorCitas, updateCitaEstado } = useAuth()
  const [citas, setCitas] = useState([])
  const [loading, setLoading] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('todos')
  const [citaSeleccionada, setCitaSeleccionada] = useState(null)
  const [toast, setToast] = useState(null)

  const mostrarToast = (msg, tipo = 'success') => {
    setToast({ msg, tipo })
    setTimeout(() => setToast(null), 3000)
  }

  useEffect(() => {
    cargarCitas()
  }, [])

  const cargarCitas = async () => {
    setLoading(true)
    try {
      const añoActual = new Date().getFullYear()
      const result = await getDoctorCitas({
        desde: `${añoActual}-01-01`,
        hasta: `${añoActual}-12-31`,
        page: 1,
        limit: 50
      })
      if (result.success) {
        setCitas(result.data.datos?.citas || [])
      }
    } catch (error) {
      console.error('Error cargando citas:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleActualizarEstado = async (citaId, estado, motivoCancelacion, notas) => {
    const result = await updateCitaEstado(citaId, estado, motivoCancelacion, notas)
    if (result.success) {
      mostrarToast(`✅ Cita ${estado} correctamente`)
      await cargarCitas()
    } else {
      mostrarToast(result.error || 'Error al actualizar cita', 'error')
    }
  }

  const getEstadoValor = (cita) => {
    return cita.estado?.valor || cita.estado || ''
  }

  const citasFiltradas = citas.filter(cita => {
    const coincideBusqueda =
      cita.paciente?.nombreCompleto?.toLowerCase().includes(busqueda.toLowerCase()) ||
      cita.motivo?.toLowerCase().includes(busqueda.toLowerCase())
    const estadoValor = getEstadoValor(cita)
    const coincideEstado = filtroEstado === 'todos' || estadoValor === filtroEstado
    return coincideBusqueda && coincideEstado
  })

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-3"></div>
        <p className="text-gray-500 text-sm">Cargando citas...</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg text-white text-sm font-medium
              ${toast.tipo === 'success' ? 'bg-green-600' : 'bg-red-600'}`}
          >
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal actualizar estado */}
      <AnimatePresence>
        {citaSeleccionada && (
          <ModalAccion
            cita={citaSeleccionada}
            onClose={() => setCitaSeleccionada(null)}
            onConfirm={handleActualizarEstado}
          />
        )}
      </AnimatePresence>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex-1 max-w-md relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar por paciente o motivo..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-transparent text-sm"
          />
        </div>

        <select
          value={filtroEstado}
          onChange={e => setFiltroEstado(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary/30"
        >
          <option value="todos">Todos los estados</option>
          <option value="pendiente">Pendientes</option>
          <option value="confirmada">Confirmadas</option>
          <option value="finalizada">Finalizadas</option>
          <option value="cancelada">Canceladas</option>
        </select>
      </div>

      {/* Lista de citas */}
      <div className="space-y-3">
        <AnimatePresence>
          {citasFiltradas.map((cita, index) => {
            const estadoValor = getEstadoValor(cita)
            return (
              <motion.div
                key={cita._id || cita.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold flex-shrink-0">
                      {cita.paciente?.nombreCompleto?.charAt(0) || 'P'}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">
                        {cita.paciente?.nombreCompleto}
                      </p>
                      <p className="text-xs text-gray-500">{cita.paciente?.email}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <Calendar size={11} />
                          {cita.fechaLarga}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={11} />
                          {cita.horaFormateada}
                        </span>
                      </div>
                      {cita.motivo && (
                        <p className="text-xs text-gray-500 mt-1">
                          <span className="font-medium">Motivo:</span> {cita.motivo}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <EstadoBadge estado={cita.estado} />
                    {estadoValor !== 'finalizada' && estadoValor !== 'cancelada' && (
                      <button
                        onClick={() => setCitaSeleccionada(cita)}
                        className="text-xs text-primary hover:bg-primary/10 px-3 py-1.5 rounded-lg border border-primary/30 transition-colors"
                      >
                        Actualizar estado
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {citasFiltradas.length === 0 && !loading && (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="text-gray-500 text-sm">
            {busqueda ? 'No se encontraron citas con esa búsqueda' : 'No tienes citas programadas'}
          </p>
        </div>
      )}
    </div>
  )
}

export default TabCitas