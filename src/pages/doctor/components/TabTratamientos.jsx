import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Plus, Search, User, X, AlertCircle, Edit3, Trash2, CheckCircle, ArrowRight, Eye, Calendar, DollarSign, Hash, ClipboardList, Stethoscope, Activity, FileText, Loader } from 'lucide-react'
import Button from '../../../components/Button'
import doctorService from '../../../services/doctorService'

const TIPOS_PROCEDIMIENTO = [
  'LIMPIEZA', 'BLANQUEAMIENTO', 'CARIES', 'ENDODONCIA', 'EXTRACCION',
  'PROTESIS', 'OBTURACION', 'CORONA', 'PUENTE', 'IMPLANTE', 'ORTODONCIA',
  'SELLANTES', 'FLUORIZACION', 'RADIOGRAFIA', 'CONSULTA'
]

const ESTADOS = [
  { valor: 'pendiente', label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800' },
  { valor: 'en_progreso', label: 'En Progreso', color: 'bg-blue-100 text-blue-800' },
  { valor: 'completado', label: 'Completado', color: 'bg-green-100 text-green-800' },
  { valor: 'cancelado', label: 'Cancelado', color: 'bg-red-100 text-red-800' },
]

const ESTADO_COLORS = {
  pendiente: { bg: 'bg-yellow-50 border-yellow-200', dot: 'bg-yellow-400', label: 'bg-yellow-100 text-yellow-800' },
  en_progreso: { bg: 'bg-blue-50 border-blue-200', dot: 'bg-blue-400', label: 'bg-blue-100 text-blue-800' },
  completado: { bg: 'bg-green-50 border-green-200', dot: 'bg-green-400', label: 'bg-green-100 text-green-800' },
  cancelado: { bg: 'bg-red-50 border-red-200', dot: 'bg-red-400', label: 'bg-red-100 text-red-800' },
}

const ModalTratamiento = ({ tratamiento, pacienteId, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    diente: tratamiento?.diente || '',
    tipoProcedimiento: tratamiento?.tipoProcedimiento || '',
    estado: tratamiento?.estado || 'pendiente',
    costoEstimado: tratamiento?.costoEstimado || '',
    notas: tratamiento?.notas || ''
  })
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.diente.trim() || !formData.tipoProcedimiento) {
      setError('Completa los campos obligatorios')
      return
    }
    setEnviando(true)
    setError(null)

    const payload = {
      ...formData,
      costoEstimado: Number(formData.costoEstimado) || 0
    }

    const result = tratamiento
      ? await doctorService.actualizarTratamiento(tratamiento._id, payload)
      : await doctorService.crearTratamiento(pacienteId, payload)

    if (result.success) {
      onSuccess()
      onClose()
    } else {
      setError(result.error || 'Error al guardar tratamiento')
    }
    setEnviando(false)
  }

  const FDI_OPTIONS = []
  for (let c = 1; c <= 8; c++) {
    const maxPos = c >= 5 ? 5 : 8
    for (let p = 1; p <= maxPos; p++) {
      FDI_OPTIONS.push(`${c}${p}`)
    }
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
        className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900">
            {tratamiento ? 'Editar Tratamiento' : 'Nuevo Tratamiento'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Diente (FDI) <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.diente}
                onChange={e => setFormData(prev => ({ ...prev, diente: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                required
              >
                <option value="">Seleccionar diente</option>
                {FDI_OPTIONS.map(code => (
                  <option key={code} value={code}>{code}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Procedimiento <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.tipoProcedimiento}
                onChange={e => setFormData(prev => ({ ...prev, tipoProcedimiento: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                required
              >
                <option value="">Seleccionar</option>
                {TIPOS_PROCEDIMIENTO.map(tipo => (
                  <option key={tipo} value={tipo}>{tipo.replace('_', ' ')}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
              <select
                value={formData.estado}
                onChange={e => setFormData(prev => ({ ...prev, estado: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                {ESTADOS.map(est => (
                  <option key={est.valor} value={est.valor}>{est.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Costo Estimado ($)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.costoEstimado}
                onChange={e => setFormData(prev => ({ ...prev, costoEstimado: e.target.value }))}
                placeholder="0.00"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notas</label>
            <textarea
              value={formData.notas}
              onChange={e => setFormData(prev => ({ ...prev, notas: e.target.value }))}
              placeholder="Observaciones del tratamiento..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" loading={enviando}>
              {tratamiento ? 'Guardar Cambios' : 'Crear Tratamiento'}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

const TabTratamientos = ({ pacienteSeleccionadoId, pacienteNombre, citaId, onLimpiarPaciente }) => {
  const [tratamientos, setTratamientos] = useState([])
  const [cargando, setCargando] = useState(false)
  const [busqueda, setBusqueda] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('todos')
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [editandoTratamiento, setEditandoTratamiento] = useState(null)
  const [toast, setToast] = useState(null)
  const [confirmarEliminar, setConfirmarEliminar] = useState(null)
  const [detalleExpandidoId, setDetalleExpandidoId] = useState(null)
  const [detalleData, setDetalleData] = useState({})
  const [detalleCargandoId, setDetalleCargandoId] = useState(null)
  const [detallePacienteData, setDetallePacienteData] = useState(null)
  const [detallePacienteCargando, setDetallePacienteCargando] = useState(false)
  const [detallePacienteError, setDetallePacienteError] = useState(null)

  const mostrarToast = (msg, tipo = 'success') => {
    setToast({ msg, tipo })
    setTimeout(() => setToast(null), 3000)
  }

  const cargarTratamientos = useCallback(async () => {
    if (!pacienteSeleccionadoId) return
    setCargando(true)
    const result = await doctorService.getTratamientosPaciente(pacienteSeleccionadoId)
    if (result.success) {
      const data = result.data?.datos?.tratamientos || result.data?.tratamientos || result.data?.data || []
      setTratamientos(data)
    }
    setCargando(false)
  }, [pacienteSeleccionadoId])

  useEffect(() => {
    if (pacienteSeleccionadoId) {
      cargarTratamientos()
    } else {
      setTratamientos([])
    }
  }, [pacienteSeleccionadoId, cargarTratamientos])

  const handleEliminar = async (tratamientoId) => {
    const result = await doctorService.eliminarTratamiento(tratamientoId)
    if (result.success) {
      mostrarToast('✅ Tratamiento eliminado')
      await cargarTratamientos()
    } else {
      mostrarToast(result.error || 'Error al eliminar', 'error')
    }
    setConfirmarEliminar(null)
  }

  const tratamientosFiltrados = tratamientos.filter(t => {
    const coincideBusqueda =
      t.diente?.toLowerCase().includes(busqueda.toLowerCase()) ||
      t.tipoProcedimiento?.toLowerCase().includes(busqueda.toLowerCase()) ||
      t.notas?.toLowerCase().includes(busqueda.toLowerCase())
    const coincideEstado = filtroEstado === 'todos' || t.estado === filtroEstado
    return coincideBusqueda && coincideEstado
  })

  return (
    <div className="space-y-6">
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

      {/* Modal formulario */}
      <AnimatePresence>
        {mostrarFormulario && (
          <ModalTratamiento
            tratamiento={editandoTratamiento}
            pacienteId={pacienteSeleccionadoId}
            onClose={() => { setMostrarFormulario(false); setEditandoTratamiento(null) }}
            onSuccess={() => {
              mostrarToast(editandoTratamiento ? '✅ Tratamiento actualizado' : '✅ Tratamiento creado')
              cargarTratamientos()
            }}
          />
        )}
      </AnimatePresence>

      {/* Modal confirmar eliminar */}
      <AnimatePresence>
        {confirmarEliminar && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setConfirmarEliminar(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm"
              onClick={e => e.stopPropagation()}
            >
              <div className="text-center">
                <Trash2 className="w-12 h-12 mx-auto mb-3 text-red-400" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">Eliminar Tratamiento</h3>
                <p className="text-sm text-gray-500 mb-6">
                  ¿Estás seguro de eliminar este tratamiento? Esta acción no se puede deshacer.
                </p>
                <div className="flex gap-2 justify-center">
                  <Button variant="outline" onClick={() => setConfirmarEliminar(null)}>
                    Cancelar
                  </Button>
                  <Button variant="danger" onClick={() => handleEliminar(confirmarEliminar)}>
                    Eliminar
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Tratamientos</h2>
          <p className="text-sm text-gray-500">Planes de tratamiento y seguimiento</p>
        </div>
        {pacienteSeleccionadoId && (
          <div className="flex gap-2">
            <Button variant="outline" onClick={onLimpiarPaciente}>
              <X className="w-4 h-4 mr-2" />
              Limpiar Paciente
            </Button>
            {citaId && (
              <Button onClick={() => { setEditandoTratamiento(null); setMostrarFormulario(true) }}>
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Tratamiento
              </Button>
            )}
          </div>
        )}
      </div>

      {pacienteSeleccionadoId && !citaId && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs px-4 py-3 rounded-xl flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Modo de Solo Lectura</p>
            <p className="mt-0.5 text-amber-700">
              Para poder crear o modificar planes de tratamiento, debes iniciar la atención desde una cita activa en el calendario. Actualmente solo puedes visualizar los registros existentes de este paciente.
            </p>
          </div>
        </div>
      )}

      {!pacienteSeleccionadoId ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <User className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500 font-medium">Selecciona un paciente desde Historias Clínicas</p>
          <p className="text-gray-400 text-sm mt-1">
            para crear y gestionar sus planes de tratamiento
          </p>
        </div>
      ) : (
        <>
          {/* Info paciente */}
          <div className="bg-white border border-gray-200 rounded-xl">
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
                    {pacienteNombre?.charAt(0) || 'P'}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{pacienteNombre || 'Paciente'}</p>
                    <p className="text-sm text-gray-500">
                      {tratamientos.length} tratamiento{tratamientos.length !== 1 ? 's' : ''} registrado{tratamientos.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <button
                  onClick={async () => {
                    if (detallePacienteData) {
                      setDetallePacienteData(null)
                      return
                    }
                    const t = tratamientos.find(t => t.consultaId && t.sesion)
                    if (!t) return
                    setDetallePacienteCargando(true)
                    setDetallePacienteError(null)
                    const consultaId = typeof t.consultaId === 'object' ? t.consultaId._id : t.consultaId
                    const result = await doctorService.getDetalleTratamiento(pacienteSeleccionadoId, consultaId, t.sesion)
                    if (result.success) {
                      setDetallePacienteData(result.data?.datos || result.data)
                    } else {
                      setDetallePacienteError(result.error)
                    }
                    setDetallePacienteCargando(false)
                  }}
                  className="text-xs px-2 py-1.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors"
                  title="Ver detalle de tratamientos"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Detalle expandible del tratamiento del paciente */}
            <AnimatePresence>
              {detallePacienteData && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden border-t border-gray-200"
                >
                  <div className="p-4 space-y-4">
                    {(() => {
                      const d = detallePacienteData
                      return (
                        <>
                          <div className="flex items-center gap-2 flex-wrap">
                            {d.codigo && (
                              <span className="text-xs font-mono bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold">
                                {d.codigo}
                              </span>
                            )}
                            {d.doctor?.especialidad && (
                              <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                                {d.doctor.especialidad}
                              </span>
                            )}
                            <span className="text-xs text-gray-400">Sesión {d.sesion}</span>
                          </div>

                          {d.consulta?.motivoConsulta && (
                            <div className="bg-gray-50 rounded-xl p-3">
                              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Motivo de Consulta</p>
                              <p className="text-sm text-gray-700">{d.consulta.motivoConsulta}</p>
                            </div>
                          )}

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {d.procedimientos?.length > 0 && (
                              <div className="bg-gray-50 rounded-xl p-3">
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Procedimientos</p>
                                <div className="flex flex-wrap gap-1.5">
                                  {d.procedimientos.map((proc, i) => (
                                    <span key={i} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{proc}</span>
                                  ))}
                                </div>
                              </div>
                            )}
                            {d.prescripciones?.length > 0 && (
                              <div className="bg-gray-50 rounded-xl p-3">
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Prescripciones</p>
                                <div className="flex flex-wrap gap-1.5">
                                  {d.prescripciones.map((pres, i) => (
                                    <span key={i} className="text-xs bg-orange-50 text-orange-700 px-2 py-0.5 rounded-full border border-orange-200">{pres}</span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                          {d.diagnosticosComplicaciones && (
                            <div className="bg-gray-50 rounded-xl p-3">
                              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Diagnósticos / Complicaciones</p>
                              <p className="text-sm text-gray-700">{d.diagnosticosComplicaciones}</p>
                            </div>
                          )}

                          {d.firmaDoctor && (
                            <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl p-3">
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-primary" />
                                <div>
                                  <p className="text-xs text-gray-500">Doctor a cargo</p>
                                  <p className="text-sm font-semibold text-gray-900">{d.firmaDoctor.nombreDoctor}</p>
                                </div>
                                {d.firmaDoctor.fecha && (
                                  <span className="text-xs text-gray-400 ml-auto">{new Date(d.firmaDoctor.fecha).toLocaleDateString('es-ES')}</span>
                                )}
                              </div>
                            </div>
                          )}

                          {d.fecha && (
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <Calendar className="w-3.5 h-3.5" />
                              Fecha del tratamiento: <strong className="text-gray-700">{new Date(d.fecha).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</strong>
                            </div>
                          )}
                        </>
                      )
                    })()}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Loading state for patient detail */}
            {detallePacienteCargando && (
              <div className="border-t border-gray-200 p-4 text-center">
                <Loader className="w-5 h-5 mx-auto mb-1 text-primary animate-spin" />
                <p className="text-xs text-gray-400">Cargando detalle...</p>
              </div>
            )}

            {/* Error state */}
            {detallePacienteError && (
              <div className="border-t border-gray-200 p-4 text-center">
                <AlertCircle className="w-5 h-5 mx-auto mb-1 text-red-400" />
                <p className="text-xs text-red-500">{detallePacienteError}</p>
              </div>
            )}
          </div>

          {/* Filtros */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="flex-1 max-w-md relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar por diente, procedimiento o notas..."
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
              {ESTADOS.map(est => (
                <option key={est.valor} value={est.valor}>{est.label}</option>
              ))}
            </select>
          </div>

          {/* Lista de tratamientos */}
          {cargando ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-3"></div>
              <p className="text-gray-500 text-sm">Cargando tratamientos...</p>
            </div>
          ) : tratamientosFiltrados.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <Heart className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-gray-500 text-sm">
                {busqueda || filtroEstado !== 'todos'
                  ? 'No se encontraron tratamientos con esos filtros'
                  : 'No hay tratamientos registrados para este paciente'
                }
              </p>
              {!busqueda && filtroEstado === 'todos' && citaId && (
                <Button
                  variant="outline"
                  size="small"
                  className="mt-4"
                  onClick={() => { setEditandoTratamiento(null); setMostrarFormulario(true) }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Crear primer tratamiento
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {tratamientosFiltrados.map((tratamiento, index) => {
                  const estColor = ESTADO_COLORS[tratamiento.estado] || ESTADO_COLORS.pendiente
                  return (
                    <motion.div
                      key={tratamiento._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ delay: index * 0.03 }}
                      className={`bg-white border rounded-xl p-4 hover:shadow-md transition-shadow ${estColor.bg} ${estColor.border}`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div className={`w-1 self-stretch rounded-full ${estColor.dot}`} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-semibold text-gray-900 text-sm">
                                Diente {tratamiento.diente}
                              </span>
                              <span className="text-xs bg-white/80 text-gray-600 px-2 py-0.5 rounded-full border border-gray-200">
                                {tratamiento.tipoProcedimiento?.replace('_', ' ')}
                              </span>
                              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${estColor.label}`}>
                                {ESTADOS.find(e => e.valor === tratamiento.estado)?.label || tratamiento.estado}
                              </span>
                            </div>
                            {tratamiento.notas && (
                              <p className="text-xs text-gray-500 mt-1.5 line-clamp-2">{tratamiento.notas}</p>
                            )}
                            <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                              {tratamiento.doctor?.nombre && (
                                <span className="flex items-center gap-1 text-gray-500">
                                  <User className="w-3 h-3" />
                                  Dr. {tratamiento.doctor.nombre} {tratamiento.doctor.apellido || ''}
                                </span>
                              )}
                              {tratamiento.costoEstimado > 0 && (
                                <span className="font-medium text-gray-600">
                                  ${Number(tratamiento.costoEstimado).toFixed(2)}
                                </span>
                              )}
                              {tratamiento.fechaCreacion && (
                                <span>
                                  Creado: {new Date(tratamiento.fechaCreacion).toLocaleDateString('es-ES')}
                                </span>
                              )}
                              {tratamiento.fechaCompletado && (
                                <span className="flex items-center gap-1">
                                  <CheckCircle className="w-3 h-3 text-green-500" />
                                  {new Date(tratamiento.fechaCompletado).toLocaleDateString('es-ES')}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-1 flex-shrink-0">
                          <button
                            onClick={async () => {
                              const id = tratamiento._id
                              if (detalleExpandidoId === id) {
                                setDetalleExpandidoId(null)
                                return
                              }
                              setDetalleExpandidoId(id)
                              const consultaId = typeof tratamiento.consultaId === 'object'
                                ? tratamiento.consultaId._id
                                : tratamiento.consultaId
                              const sesion = tratamiento.sesion
                              if (consultaId && sesion && !detalleData[id]) {
                                setDetalleCargandoId(id)
                                const result = await doctorService.getDetalleTratamiento(pacienteSeleccionadoId, consultaId, sesion)
                                if (result.success) {
                                  setDetalleData(prev => ({ ...prev, [id]: result.data?.datos || result.data }))
                                } else {
                                  setDetalleData(prev => ({ ...prev, [id]: { error: result.error } }))
                                }
                                setDetalleCargandoId(null)
                              }
                            }}
                            className={`text-xs px-2 py-1.5 rounded-lg border transition-colors ${
                              detalleExpandidoId === tratamiento._id
                                ? 'bg-primary/10 text-primary border-primary/30'
                                : 'text-gray-600 hover:bg-gray-100 border-gray-300'
                            }`}
                            title={detalleExpandidoId === tratamiento._id ? 'Ocultar detalle' : 'Ver detalle'}
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          {citaId && (
                            <>
                              <button
                                onClick={() => { setEditandoTratamiento(tratamiento); setMostrarFormulario(true) }}
                                className="text-xs text-primary hover:bg-primary/10 px-2 py-1.5 rounded-lg border border-primary/30 transition-colors"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  const estados = ['pendiente', 'en_progreso', 'completado', 'cancelado']
                                  const idx = estados.indexOf(tratamiento.estado)
                                  const siguiente = idx < estados.length - 1 ? estados[idx + 1] : null
                                  if (!siguiente) return
                                  doctorService.actualizarTratamiento(tratamiento._id, {
                                    ...tratamiento,
                                    estado: siguiente,
                                    fechaCompletado: siguiente === 'completado' ? new Date().toISOString() : undefined
                                  }).then(result => {
                                    if (result.success) {
                                      mostrarToast(`✅ Estado actualizado a ${ESTADOS.find(e => e.valor === siguiente)?.label}`)
                                      cargarTratamientos()
                                    }
                                  })
                                }}
                                className="text-xs text-emerald-700 hover:bg-emerald-50 px-2 py-1.5 rounded-lg border border-emerald-300 transition-colors"
                                title="Avanzar estado"
                              >
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setConfirmarEliminar(tratamiento._id)}
                                className="text-xs text-red-600 hover:bg-red-50 px-2 py-1.5 rounded-lg border border-red-300 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Inline detail expandible */}
                      <AnimatePresence>
                        {detalleExpandidoId === tratamiento._id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            {detalleCargandoId === tratamiento._id ? (
                              <div className="mt-4 pt-4 border-t border-gray-200 text-center py-6">
                                <Loader className="w-5 h-5 mx-auto mb-2 text-primary animate-spin" />
                                <p className="text-xs text-gray-400">Cargando detalle...</p>
                              </div>
                            ) : detalleData[tratamiento._id]?.error ? (
                              <div className="mt-4 pt-4 border-t border-gray-200 text-center py-4">
                                <AlertCircle className="w-5 h-5 mx-auto mb-1 text-red-400" />
                                <p className="text-xs text-red-500">{detalleData[tratamiento._id].error}</p>
                              </div>
                            ) : detalleData[tratamiento._id] ? (
                              (() => {
                                const d = detalleData[tratamiento._id]
                                return (
                                  <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
                                    {/* Código y especialidad */}
                                    <div className="flex items-center gap-2 flex-wrap">
                                      {d.codigo && (
                                        <span className="text-xs font-mono bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold">
                                          {d.codigo}
                                        </span>
                                      )}
                                      {d.doctor?.especialidad && (
                                        <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                                          {d.doctor.especialidad}
                                        </span>
                                      )}
                                      <span className="text-xs text-gray-400">
                                        Sesión {d.sesion || tratamiento.sesion}
                                      </span>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                      {/* Procedimientos */}
                                      <div className="bg-gray-50 rounded-xl p-3">
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                          Procedimientos Realizados
                                        </p>
                                        {d.procedimientos?.length > 0 ? (
                                          <div className="flex flex-wrap gap-1.5">
                                            {d.procedimientos.map((proc, i) => (
                                              <span key={i} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                                {proc}
                                              </span>
                                            ))}
                                          </div>
                                        ) : (
                                          <p className="text-xs text-gray-400">Ninguno registrado</p>
                                        )}
                                      </div>

                                      {/* Prescripciones */}
                                      <div className="bg-gray-50 rounded-xl p-3">
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                          Prescripciones
                                        </p>
                                        {d.prescripciones?.length > 0 ? (
                                          <div className="flex flex-wrap gap-1.5">
                                            {d.prescripciones.map((pres, i) => (
                                              <span key={i} className="text-xs bg-orange-50 text-orange-700 px-2 py-0.5 rounded-full border border-orange-200">
                                                {pres}
                                              </span>
                                            ))}
                                          </div>
                                        ) : (
                                          <p className="text-xs text-gray-400">Ninguna registrada</p>
                                        )}
                                      </div>
                                    </div>

                                    {/* Motivo de consulta */}
                                    {d.consulta?.motivoConsulta && (
                                      <div className="bg-gray-50 rounded-xl p-3">
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                                          Motivo de Consulta
                                        </p>
                                        <p className="text-sm text-gray-700">{d.consulta.motivoConsulta}</p>
                                      </div>
                                    )}

                                    {/* Diagnósticos / Complicaciones */}
                                    {d.diagnosticosComplicaciones && (
                                      <div className="bg-gray-50 rounded-xl p-3">
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                                          Diagnósticos / Complicaciones
                                        </p>
                                        <p className="text-sm text-gray-700">{d.diagnosticosComplicaciones}</p>
                                      </div>
                                    )}

                                    {/* Doctor a cargo */}
                                    {d.firmaDoctor && (
                                      <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl p-3">
                                        <div className="flex items-center gap-2">
                                          <User className="w-4 h-4 text-primary" />
                                          <div>
                                            <p className="text-xs text-gray-500">Doctor a cargo</p>
                                            <p className="text-sm font-semibold text-gray-900">{d.firmaDoctor.nombreDoctor}</p>
                                          </div>
                                          {d.firmaDoctor.fecha && (
                                            <span className="text-xs text-gray-400 ml-auto">
                                              {new Date(d.firmaDoctor.fecha).toLocaleDateString('es-ES')}
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    )}

                                    {/* Fecha del tratamiento */}
                                    {d.fecha && (
                                      <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <Calendar className="w-3.5 h-3.5" />
                                        Fecha del tratamiento: <strong className="text-gray-700">{new Date(d.fecha).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</strong>
                                      </div>
                                    )}
                                  </div>
                                )
                              })()
                            ) : null}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default TabTratamientos
