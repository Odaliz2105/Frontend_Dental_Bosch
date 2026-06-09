import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Search, User, X, AlertCircle, Eye, Calendar, ClipboardList, Loader, Plus, Save } from 'lucide-react'
import Button from '../../../components/Button'
import doctorService from '../../../services/doctorService'

const INITIAL_NUEVO_TRATAMIENTO = {
  codigo: '',
  fecha: new Date().toISOString().slice(0, 16),
  diagnosticosComplicaciones: '',
  procedimientosInput: '',
  prescripcionesInput: ''
}

const TabTratamientos = ({ pacienteSeleccionadoId, pacienteNombre, citaId, onLimpiarPaciente }) => {
  const [tratamientos, setTratamientos] = useState([])
  const [cargando, setCargando] = useState(false)
  const [busqueda, setBusqueda] = useState('')
  const [toast, setToast] = useState(null)
  const [detalleExpandidoId, setDetalleExpandidoId] = useState(null)
  const [detalleData, setDetalleData] = useState({})
  const [detalleCargandoId, setDetalleCargandoId] = useState(null)
  const [consultaActual, setConsultaActual] = useState(null)
  const [mostrandoFormulario, setMostrandoFormulario] = useState(false)
  const [nuevoTratamiento, setNuevoTratamiento] = useState(INITIAL_NUEVO_TRATAMIENTO)
  const [guardando, setGuardando] = useState(false)

  const mostrarToast = (msg, tipo = 'success') => {
    setToast({ msg, tipo })
    setTimeout(() => setToast(null), 3000)
  }

  const cargarTratamientos = useCallback(async () => {
    if (!pacienteSeleccionadoId) return
    setCargando(true)
    const result = await doctorService.getHistorialClinico(pacienteSeleccionadoId)
    if (result.success) {
      const consultas = result.data?.datos?.consultas || result.data?.consultas || []
      // Detectar consulta de la cita actual
      let encontrada = null
      if (citaId) {
        encontrada = consultas.find(c => {
          const ref = c.cita || c.citaId
          if (!ref) return false
          const id = typeof ref === 'string' ? ref : ref._id || ref.id || ''
          return id === citaId
        })
      }
      setConsultaActual(encontrada || null)
      // Extraer tratamientos de cada consulta y aplanarlos
      const tratamientosExtraidos = []
      consultas.forEach(consulta => {
        if (consulta.tratamientos && consulta.tratamientos.length > 0) {
          consulta.tratamientos.forEach(tratamiento => {
            tratamientosExtraidos.push({
              ...tratamiento,
              consultaId: consulta._id,
              consultaFecha: consulta.fecha,
              consultaMotivo: consulta.motivoConsulta
            })
          })
        }
      })
      setTratamientos(tratamientosExtraidos)
    }
    setCargando(false)
  }, [pacienteSeleccionadoId, citaId])

  useEffect(() => {
    if (pacienteSeleccionadoId) {
      cargarTratamientos()
    } else {
      setTratamientos([])
    }
  }, [pacienteSeleccionadoId, cargarTratamientos])

  const tratamientosFiltrados = tratamientos.filter(t => {
    const coincideBusqueda =
      t.codigo?.toLowerCase().includes(busqueda.toLowerCase()) ||
      t.procedimientos?.some(p => p.toLowerCase().includes(busqueda.toLowerCase())) ||
      t.prescripciones?.some(p => p.toLowerCase().includes(busqueda.toLowerCase())) ||
      t.diagnosticosComplicaciones?.toLowerCase().includes(busqueda.toLowerCase()) ||
      String(t.sesion).includes(busqueda)
    return coincideBusqueda
  })

  const handleGuardarTratamiento = async () => {
    if (!consultaActual || !pacienteSeleccionadoId) return
    if (!nuevoTratamiento.codigo.trim() && !nuevoTratamiento.diagnosticosComplicaciones.trim()) {
      setToast({ msg: 'Ingresa al menos un código o diagnósticos', tipo: 'error' })
      setTimeout(() => setToast(null), 3000)
      return
    }

    setGuardando(true)
    const procedimientos = nuevoTratamiento.procedimientosInput
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)
    const prescripciones = nuevoTratamiento.prescripcionesInput
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)
    const sesion = (consultaActual.tratamientos?.length || 0) + 1
    const tratamiento = {
      sesion,
      codigo: nuevoTratamiento.codigo,
      fecha: nuevoTratamiento.fecha,
      diagnosticosComplicaciones: nuevoTratamiento.diagnosticosComplicaciones,
      procedimientos,
      prescripciones
    }

    const tratamientosActualizados = [...(consultaActual.tratamientos || []), tratamiento]
    const result = await doctorService.actualizarConsulta(
      pacienteSeleccionadoId,
      consultaActual._id,
      { tratamientos: tratamientosActualizados }
    )

    if (result.success) {
      setToast({ msg: 'Tratamiento registrado correctamente', tipo: 'success' })
      setTimeout(() => setToast(null), 3000)
      setNuevoTratamiento(INITIAL_NUEVO_TRATAMIENTO)
      setMostrandoFormulario(false)
      await cargarTratamientos()
    } else {
      setToast({ msg: result.error || 'Error al guardar tratamiento', tipo: 'error' })
      setTimeout(() => setToast(null), 3000)
    }
    setGuardando(false)
  }

  const resetFormulario = () => {
    setNuevoTratamiento(INITIAL_NUEVO_TRATAMIENTO)
    setMostrandoFormulario(false)
  }

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

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Tratamientos</h2>
          <p className="text-sm text-gray-500">Tratamientos registrados en historias clínicas</p>
        </div>
        {pacienteSeleccionadoId && (
          <Button variant="outline" onClick={onLimpiarPaciente}>
            <X className="w-4 h-4 mr-2" />
            Limpiar Paciente
          </Button>
        )}
      </div>

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
            </div>
          </div>

          {/* Filtros */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="flex-1 max-w-md relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar por código, procedimientos, prescripciones o diagnósticos..."
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-transparent text-sm"
              />
            </div>
            {consultaActual && (
              <Button
                type="button"
                onClick={() => setMostrandoFormulario(!mostrandoFormulario)}
                variant={mostrandoFormulario ? 'outline' : 'primary'}
              >
                <Plus className="w-4 h-4 mr-1.5" />
                {mostrandoFormulario ? 'Cancelar' : 'Nuevo Tratamiento'}
              </Button>
            )}
          </div>

          {/* Formulario nuevo tratamiento */}
          <AnimatePresence>
            {consultaActual && mostrandoFormulario && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-white border border-primary/30 rounded-xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-900">Nuevo Tratamiento</h3>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                      Sesión {(consultaActual.tratamientos?.length || 0) + 1}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Código</label>
                      <input
                        type="text"
                        value={nuevoTratamiento.codigo}
                        onChange={e => setNuevoTratamiento(prev => ({ ...prev, codigo: e.target.value }))}
                        placeholder="Ej: TRAT-001"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary/30 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Fecha</label>
                      <input
                        type="datetime-local"
                        value={nuevoTratamiento.fecha}
                        onChange={e => setNuevoTratamiento(prev => ({ ...prev, fecha: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary/30 focus:border-transparent"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-gray-600 mb-1">Diagnósticos / Complicaciones</label>
                      <input
                        type="text"
                        value={nuevoTratamiento.diagnosticosComplicaciones}
                        onChange={e => setNuevoTratamiento(prev => ({ ...prev, diagnosticosComplicaciones: e.target.value }))}
                        placeholder="Describir diagnósticos o complicaciones"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary/30 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Procedimientos</label>
                      <input
                        type="text"
                        value={nuevoTratamiento.procedimientosInput}
                        onChange={e => setNuevoTratamiento(prev => ({ ...prev, procedimientosInput: e.target.value }))}
                        placeholder="Separados por coma: Ej: Extracción, Limpieza"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary/30 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Prescripciones</label>
                      <input
                        type="text"
                        value={nuevoTratamiento.prescripcionesInput}
                        onChange={e => setNuevoTratamiento(prev => ({ ...prev, prescripcionesInput: e.target.value }))}
                        placeholder="Separadas por coma: Ej: Amoxicilina, Ibuprofeno"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary/30 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                    <Button type="button" variant="outline" onClick={resetFormulario}>
                      Cancelar
                    </Button>
                    <Button type="button" onClick={handleGuardarTratamiento} loading={guardando}>
                      <Save className="w-4 h-4 mr-1.5" />
                      Guardar Tratamiento
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

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
                {busqueda
                  ? 'No se encontraron tratamientos con esa búsqueda'
                  : 'No hay tratamientos registrados en las historias clínicas de este paciente'}
              </p>
              {!busqueda && (
                <p className="text-gray-400 text-xs mt-2">
                  {consultaActual
                    ? 'Usa el botón "Nuevo Tratamiento" para registrar un tratamiento en la consulta actual'
                    : 'Los tratamientos se registran desde la pestaña Historias Clínicas al crear o editar una consulta'}
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {tratamientosFiltrados.map((tratamiento, index) => {
                  return (
                    <motion.div
                      key={`${tratamiento.consultaId}-${tratamiento.sesion}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ delay: index * 0.03 }}
                      className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div className="bg-blue-100 p-2 rounded-lg flex-shrink-0">
                            <ClipboardList size={16} className="text-blue-700" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              {tratamiento.codigo && (
                                <span className="text-xs font-mono bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold">
                                  {tratamiento.codigo}
                                </span>
                              )}
                              <span className="font-semibold text-gray-900 text-sm">
                                Sesión {tratamiento.sesion}
                              </span>
                              {tratamiento.fecha && (
                                <span className="text-xs text-gray-500">
                                  {new Date(tratamiento.fecha).toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' })}
                                </span>
                              )}
                            </div>
                            {tratamiento.consultaMotivo && (
                              <p className="text-xs text-gray-500 mt-1">
                                Consulta: {tratamiento.consultaMotivo}
                              </p>
                            )}
                            {tratamiento.procedimientos?.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {tratamiento.procedimientos.map((proc, i) => (
                                  <span key={i} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{proc}</span>
                                ))}
                              </div>
                            )}
                            {tratamiento.prescripciones?.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {tratamiento.prescripciones.map((pres, i) => (
                                  <span key={i} className="text-xs bg-orange-50 text-orange-700 px-2 py-0.5 rounded-full border border-orange-200">{pres}</span>
                                ))}
                              </div>
                            )}
                            {tratamiento.diagnosticosComplicaciones && (
                              <p className="text-xs text-gray-500 mt-1.5 line-clamp-2">{tratamiento.diagnosticosComplicaciones}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-1 flex-shrink-0">
                          <button
                            onClick={() => {
                              const id = `${tratamiento.consultaId}-${tratamiento.sesion}`
                              if (detalleExpandidoId === id) {
                                setDetalleExpandidoId(null)
                                return
                              }
                              setDetalleExpandidoId(id)
                              if (!detalleData[id]) {
                                setDetalleCargandoId(id)
                                setDetalleData(prev => ({ ...prev, [id]: tratamiento }))
                                setDetalleCargandoId(null)
                              }
                            }}
                            className={`text-xs px-2 py-1.5 rounded-lg border transition-colors ${
                              detalleExpandidoId === `${tratamiento.consultaId}-${tratamiento.sesion}`
                                ? 'bg-primary/10 text-primary border-primary/30'
                                : 'text-gray-600 hover:bg-gray-100 border-gray-300'
                            }`}
                            title={detalleExpandidoId === `${tratamiento.consultaId}-${tratamiento.sesion}` ? 'Ocultar detalle' : 'Ver detalle'}
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Inline detail expandible */}
                      <AnimatePresence>
                        {detalleExpandidoId === `${tratamiento.consultaId}-${tratamiento.sesion}` && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            {detalleCargandoId === `${tratamiento.consultaId}-${tratamiento.sesion}` ? (
                              <div className="mt-4 pt-4 border-t border-gray-200 text-center py-6">
                                <Loader className="w-5 h-5 mx-auto mb-2 text-primary animate-spin" />
                                <p className="text-xs text-gray-400">Cargando detalle...</p>
                              </div>
                            ) : detalleData[`${tratamiento.consultaId}-${tratamiento.sesion}`]?.error ? (
                              <div className="mt-4 pt-4 border-t border-gray-200 text-center py-4">
                                <AlertCircle className="w-5 h-5 mx-auto mb-1 text-red-400" />
                                <p className="text-xs text-red-500">{detalleData[`${tratamiento.consultaId}-${tratamiento.sesion}`].error}</p>
                              </div>
                            ) : detalleData[`${tratamiento.consultaId}-${tratamiento.sesion}`] ? (
                              (() => {
                                const d = detalleData[`${tratamiento.consultaId}-${tratamiento.sesion}`]
                                return (
                                  <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
                                    {/* Código y especialidad */}
                                    <div className="flex items-center gap-2 flex-wrap">
                                      {d.codigo && (
                                        <span className="text-xs font-mono bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold">
                                          {d.codigo}
                                        </span>
                                      )}
                                      <span className="text-xs text-gray-400">
                                        Sesión {d.sesion}
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
                                    {d.consultaMotivo && (
                                      <div className="bg-gray-50 rounded-xl p-3">
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                                          Motivo de Consulta
                                        </p>
                                        <p className="text-sm text-gray-700">{d.consultaMotivo}</p>
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
