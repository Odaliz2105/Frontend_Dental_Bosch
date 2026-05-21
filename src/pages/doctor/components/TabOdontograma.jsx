import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Activity, User, Plus, X, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react'
import Button from '../../../components/Button'
import doctorService from '../../../services/doctorService'

const TabOdontograma = ({ pacienteSeleccionadoId, pacienteNombre, onLimpiarPaciente }) => {
  const [historial, setHistorial] = useState(null)
  const [cargandoHistorial, setCargandoHistorial] = useState(false)
  const [consultaSeleccionada, setConsultaSeleccionada] = useState(null)
  const [tipoDenticion, setTipoDenticion] = useState('permanente')
  const [inicializando, setInicializando] = useState(false)
  const [cargandoOdontograma, setCargandoOdontograma] = useState(false)
  const [odontograma, setOdontograma] = useState(null)
  const [toast, setToast] = useState(null)
  const [mostrarSelectorConsulta, setMostrarSelectorConsulta] = useState(false)
  const [dienteSeleccionado, setDienteSeleccionado] = useState(null)
  const [actualizandoDiente, setActualizandoDiente] = useState(false)

  useEffect(() => {
    if (pacienteSeleccionadoId) {
      cargarHistorial()
    } else {
      setHistorial(null)
      setConsultaSeleccionada(null)
      setOdontograma(null)
    }
  }, [pacienteSeleccionadoId])

  const cargarHistorial = async () => {
    setCargandoHistorial(true)
    const result = await doctorService.getHistorialClinico(pacienteSeleccionadoId)
    if (result.success) {
      setHistorial(result.data.datos)
    }
    setCargandoHistorial(false)
  }

  const mostrarToast = (msg, tipo = 'success') => {
    setToast({ msg, tipo })
    setTimeout(() => setToast(null), 3000)
  }

  const cargarOdontogramaExistente = async (consulta) => {
    setCargandoOdontograma(true)
    const result = await doctorService.verOdontograma(
      pacienteSeleccionadoId,
      consulta._id
    )

    const odontogramaData = result.data?.datos?.odontograma || result.data?.odontograma
    if (result.success && odontogramaData) {
      setOdontograma(odontogramaData)
      setTipoDenticion(odontogramaData.tipoDenticion || 'permanente')
    } else {
      setOdontograma(null)
    }
    setCargandoOdontograma(false)
  }

  const handleInicializarOdontograma = async () => {
    if (!consultaSeleccionada) {
      mostrarToast('Selecciona una consulta primero', 'error')
      return
    }

    setInicializando(true)
    const result = await doctorService.inicializarOdontograma(
      pacienteSeleccionadoId,
      consultaSeleccionada._id,
      tipoDenticion
    )

    const odontogramaData = result.data?.datos?.odontograma || result.data?.odontograma
    if (result.success && odontogramaData) {
      setOdontograma(odontogramaData)
      mostrarToast('✅ Odontograma inicializado correctamente')
      await cargarHistorial()
    } else {
      console.error('Error al inicializar odontograma:', result)
      const errorMsg = result.error || 'Error al inicializar odontograma'
      mostrarToast(`${errorMsg} (Status: ${result.status || '500'})`, 'error')
    }
    setInicializando(false)
  }

  const handleActualizarDiente = async (diente, nuevoEstado) => {
    if (!consultaSeleccionada) return

    setActualizandoDiente(true)
    const result = await doctorService.actualizarDienteOdontograma(
      pacienteSeleccionadoId,
      consultaSeleccionada._id,
      diente.codigoFDI,
      { estadoGeneral: nuevoEstado }
    )

    if (result.success) {
      mostrarToast('✅ Diente actualizado correctamente')
      await cargarOdontogramaExistente(consultaSeleccionada)
    } else {
      mostrarToast(result.error || 'Error al actualizar diente', 'error')
    }
    setActualizandoDiente(false)
    setDienteSeleccionado(null)
  }

  const handleLimpiarPaciente = () => {
    if (onLimpiarPaciente) onLimpiarPaciente()
  }

  const consultas = historial?.consultas || []

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
          <h2 className="text-lg font-semibold text-gray-900">Odontograma</h2>
          <p className="text-sm text-gray-500">Examen dental interactivo</p>
        </div>
        {pacienteSeleccionadoId && (
          <Button variant="outline" onClick={handleLimpiarPaciente}>
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
            para crear su odontograma
          </p>
        </div>
      ) : cargandoHistorial ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
          <p className="text-gray-500">Cargando historial...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Info paciente */}
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
                {pacienteNombre?.charAt(0) || 'P'}
              </div>
              <div>
                <p className="font-medium text-gray-900">{pacienteNombre}</p>
                <p className="text-sm text-gray-500">Paciente seleccionado</p>
              </div>
            </div>
          </div>

          {/* Selector de consulta */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <button
              onClick={() => setMostrarSelectorConsulta(!mostrarSelectorConsulta)}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Activity className="w-5 h-5 text-primary" />
                <div className="text-left">
                  <p className="font-medium text-gray-900 text-sm">
                    {consultaSeleccionada
                      ? `Consulta del ${new Date(consultaSeleccionada.fecha).toLocaleDateString('es-ES')}`
                      : 'Seleccionar Consulta'
                    }
                  </p>
                  <p className="text-xs text-gray-500">
                    {consultaSeleccionada
                      ? consultaSeleccionada.motivoConsulta
                      : 'Elige una consulta para inicializar el odontograma'
                    }
                  </p>
                </div>
              </div>
              {mostrarSelectorConsulta ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
            </button>

            <AnimatePresence>
              {mostrarSelectorConsulta && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-gray-100 overflow-hidden"
                >
                  <div className="p-4 space-y-2 max-h-64 overflow-y-auto">
                    {consultas.length === 0 ? (
                      <p className="text-sm text-gray-500 text-center py-4">
                        No hay consultas registradas
                      </p>
                    ) : (
                      consultas.map((consulta) => (
                        <button
                          key={consulta._id}
                          onClick={async () => {
                            setConsultaSeleccionada(consulta)
                            setMostrarSelectorConsulta(false)
                            await cargarOdontogramaExistente(consulta)
                          }}
                          className={`w-full text-left p-3 rounded-lg transition-colors
                            ${consultaSeleccionada?._id === consulta._id
                              ? 'bg-primary/10 border border-primary'
                              : 'bg-gray-50 hover:bg-gray-100 border border-transparent'
                            }`}
                        >
                          <p className="text-sm font-medium text-gray-900">
                            {new Date(consulta.fecha).toLocaleDateString('es-ES', {
                              year: 'numeric', month: 'long', day: 'numeric'
                            })}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {consulta.motivoConsulta || 'Sin motivo'}
                          </p>
                        </button>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Tipo de dentición */}
          {consultaSeleccionada && !odontograma && (
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Dentición
              </label>
              <select
                value={tipoDenticion}
                onChange={(e) => setTipoDenticion(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="permanente">Permanente</option>
                <option value="temporal">Temporal (Decidua)</option>
                <option value="mixta">Mixta</option>
              </select>
            </div>
          )}

          {/* Cargando odontograma existente */}
          {cargandoOdontograma && (
            <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary mb-2"></div>
              <p className="text-sm text-gray-500">Verificando odontograma existente...</p>
            </div>
          )}

          {/* Botón inicializar */}
          {consultaSeleccionada && !odontograma && !cargandoOdontograma && (
            <Button
              onClick={handleInicializarOdontograma}
              loading={inicializando}
              disabled={inicializando}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Inicializar Odontograma
            </Button>
          )}

          {/* Odontograma inicializado */}
          {odontograma && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-gray-200 rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Odontograma Inicializado</h3>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                  {odontograma.tipoDenticion}
                </span>
              </div>

              {odontograma.tipoDenticion === 'mixta' ? (
                <>
                  <div className="mb-6">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                      Dientes Permanentes
                    </p>
                    <div className="grid grid-cols-8 gap-2">
                      {odontograma.dientes.slice(0, 32).map((diente) => (
                        <button
                          key={diente._id}
                          onClick={() => setDienteSeleccionado(diente)}
                          className={`bg-gray-50 rounded-lg p-2 text-center border transition-all hover:shadow-md
                            ${dienteSeleccionado?._id === diente._id
                              ? 'border-primary ring-2 ring-primary/30'
                              : 'border-gray-200 hover:border-primary/50'
                            }
                            ${diente.estadoGeneral !== 'SANO' ? 'bg-red-50' : ''}
                          `}
                        >
                          <p className="text-xs font-semibold text-gray-700">{diente.codigoFDI}</p>
                          <p className="text-[10px] text-gray-500">{diente.estadoGeneral}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                      Dientes Temporales
                    </p>
                    <div className="grid grid-cols-5 gap-2">
                      {odontograma.dientes.slice(32).map((diente) => (
                        <button
                          key={diente._id}
                          onClick={() => setDienteSeleccionado(diente)}
                          className={`bg-gray-50 rounded-lg p-2 text-center border transition-all hover:shadow-md
                            ${dienteSeleccionado?._id === diente._id
                              ? 'border-primary ring-2 ring-primary/30'
                              : 'border-gray-200 hover:border-primary/50'
                            }
                            ${diente.estadoGeneral !== 'SANO' ? 'bg-red-50' : ''}
                          `}
                        >
                          <p className="text-xs font-semibold text-gray-700">{diente.codigoFDI}</p>
                          <p className="text-[10px] text-gray-500">{diente.estadoGeneral}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className={`grid ${odontograma.tipoDenticion === 'temporal' ? 'grid-cols-5' : 'grid-cols-8'} gap-2`}>
                  {odontograma.dientes.map((diente) => (
                    <button
                      key={diente._id}
                      onClick={() => setDienteSeleccionado(diente)}
                      className={`bg-gray-50 rounded-lg p-2 text-center border transition-all hover:shadow-md
                        ${dienteSeleccionado?._id === diente._id
                          ? 'border-primary ring-2 ring-primary/30'
                          : 'border-gray-200 hover:border-primary/50'
                        }
                        ${diente.estadoGeneral !== 'SANO' ? 'bg-red-50' : ''}
                      `}
                    >
                      <p className="text-xs font-semibold text-gray-700">{diente.codigoFDI}</p>
                      <p className="text-[10px] text-gray-500">{diente.estadoGeneral}</p>
                    </button>
                  ))}
                </div>
              )}

              <p className="text-xs text-gray-500 mt-4">
                Total dientes: {odontograma.dientes.length}
              </p>
            </motion.div>
          )}

          {/* Modal para actualizar diente */}
          <AnimatePresence>
            {dienteSeleccionado && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                onClick={() => setDienteSeleccionado(null)}
              >
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  className="bg-white rounded-xl p-6 w-full max-w-md"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">
                      Actualizar Diente {dienteSeleccionado.codigoFDI}
                    </h3>
                    <button
                      onClick={() => setDienteSeleccionado(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Estado General
                      </label>
                      <select
                        defaultValue={dienteSeleccionado.estadoGeneral}
                        onChange={(e) => handleActualizarDiente(dienteSeleccionado, e.target.value)}
                        disabled={actualizandoDiente}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                      >
                        <option value="SANO">Sano</option>
                        <option value="CARIES">Caries</option>
                        <option value="FRACTURA">Fractura</option>
                        <option value="AUSENTE">Ausente</option>
                        <option value="PROTESIS">Prótesis</option>
                        <option value="OBTURACION">Obturación</option>
                        <option value="ENDODONCIA">Endodoncia</option>
                        <option value="EXTRACCION">Extracción</option>
                      </select>
                    </div>

                    <p className="text-xs text-gray-500">
                      Estado actual: <span className="font-medium">{dienteSeleccionado.estadoGeneral}</span>
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}

export default TabOdontograma
