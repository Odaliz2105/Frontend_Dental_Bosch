import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Activity, User, Plus, X, ChevronDown, ChevronUp } from 'lucide-react'
import Button from '../../../components/Button'
import doctorService from '../../../services/doctorService'
import OdontogramaVisual from '../../../components/OdontogramaVisual'

const INITIAL_INDICADORES_SALUD_BUCAL = {
  higieneOral: { placa: 'leve', calculo: 'leve', gingivitis: 'leve' },
  enfermedadPeriodontal: 'leve',
  maloclusion: null,
  fluorosis: null,
  indiceCPO: { C: 0, P: 0, O: 0 }
}

const normalizarIndicadoresSaludBucal = (indicadores = {}) => ({
  higieneOral: {
    placa: indicadores.higieneOral?.placa || 'leve',
    calculo: indicadores.higieneOral?.calculo || 'leve',
    gingivitis: indicadores.higieneOral?.gingivitis || 'leve'
  },
  enfermedadPeriodontal: indicadores.enfermedadPeriodontal || 'leve',
  maloclusion: indicadores.maloclusion ?? null,
  fluorosis: indicadores.fluorosis ?? null,
  indiceCPO: {
    C: indicadores.indiceCPO?.C ?? 0,
    P: indicadores.indiceCPO?.P ?? 0,
    O: indicadores.indiceCPO?.O ?? 0
  }
})

const TabOdontograma = ({ pacienteSeleccionadoId, pacienteNombre, citaId, fechaCita, onLimpiarPaciente }) => {
  const [historial, setHistorial] = useState(null)
  const [cargandoHistorial, setCargandoHistorial] = useState(false)
  const [consultaSeleccionada, setConsultaSeleccionada] = useState(null)
  const [tipoDenticion, setTipoDenticion] = useState('mixta')
  const [inicializando, setInicializando] = useState(false)
  const [cargandoOdontograma, setCargandoOdontograma] = useState(false)
  const [odontograma, setOdontograma] = useState(null)
  const [toast, setToast] = useState(null)
  const [mostrarSelectorConsulta, setMostrarSelectorConsulta] = useState(false)
  const [actualizandoDiente, setActualizandoDiente] = useState(false)
  const [indicadoresSaludBucal, setIndicadoresSaludBucal] = useState(INITIAL_INDICADORES_SALUD_BUCAL)
  const [guardandoIndicadores, setGuardandoIndicadores] = useState(false)

  const cargarHistorial = async () => {
    setCargandoHistorial(true)
    const result = await doctorService.getHistorialClinico(pacienteSeleccionadoId)
    if (result.success) {
      setHistorial(result.data.datos)
    }
    setCargandoHistorial(false)
  }

  useEffect(() => {
    if (pacienteSeleccionadoId) {
      cargarHistorial()
    } else {
      setHistorial(null)
      setConsultaSeleccionada(null)
      setOdontograma(null)
    }
  }, [pacienteSeleccionadoId])

  useEffect(() => {
    if (consultaSeleccionada) {
      setIndicadoresSaludBucal(normalizarIndicadoresSaludBucal(consultaSeleccionada.indicadoresSaludBucal))
    } else {
      setIndicadoresSaludBucal(INITIAL_INDICADORES_SALUD_BUCAL)
    }
  }, [consultaSeleccionada])

  const mostrarToast = (msg, tipo = 'success') => {
    setToast({ msg, tipo })
    setTimeout(() => setToast(null), 3000)
  }

  const cargarOdontogramaExistente = async (consulta) => {
    setCargandoOdontograma(true)
    const result = await doctorService.verOdontogramaVisual(
      pacienteSeleccionadoId,
      consulta._id
    )

    const odontogramaData = result.data?.odontograma || result.data?.datos?.odontograma
    if (result.success && odontogramaData) {
      setOdontograma(odontogramaData)
      setTipoDenticion(odontogramaData.tipoDenticion || 'mixta')
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
    if (!puedeEditarConsulta(consultaSeleccionada)) {
      mostrarToast('Solo puedes inicializar el odontograma de la consulta asociada a la cita actual', 'error')
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

  const handleSuperficieClick = async (
    diente,
    superficie,
    nuevoEstado,
    superficiesActualizadas,
    payloadBackend
  ) => {
    if (!consultaSeleccionada) return
    if (!puedeEditarConsulta(consultaSeleccionada)) {
      mostrarToast('Solo puedes editar el odontograma de la consulta asociada a la cita actual', 'error')
      return
    }

    setActualizandoDiente(true)
    const result = await doctorService.actualizarDienteOdontograma(
      pacienteSeleccionadoId,
      consultaSeleccionada._id,
      diente.codigoFDI,
      payloadBackend
    )

    if (!result.success) {
      mostrarToast(result.error || 'Error al actualizar superficie', 'error')
    }
    setActualizandoDiente(false)
  }

  const handleDienteUpdate = async (diente, field, value) => {
    if (!consultaSeleccionada) return
    if (!puedeEditarConsulta(consultaSeleccionada)) {
      mostrarToast('Solo puedes editar el odontograma de la consulta asociada a la cita actual', 'error')
      return
    }
    setActualizandoDiente(true)
    const result = await doctorService.actualizarDienteOdontograma(
      pacienteSeleccionadoId,
      consultaSeleccionada._id,
      diente.codigoFDI,
      { [field]: value }
    )
    if (!result.success) {
      mostrarToast(result.error || 'Error al actualizar diente', 'error')
    }
    setActualizandoDiente(false)
  }

  const actualizarIndicador = (path, value) => {
    setIndicadoresSaludBucal(prev => {
      const next = JSON.parse(JSON.stringify(prev))
      const keys = path.split('.')
      let current = next
      keys.slice(0, -1).forEach(key => {
        current[key] = current[key] || {}
        current = current[key]
      })
      current[keys[keys.length - 1]] = value
      return next
    })
  }

  const handleGuardarIndicadores = async () => {
    if (!consultaSeleccionada) return
    if (!puedeEditarConsulta(consultaSeleccionada)) {
      mostrarToast('Solo puedes editar indicadores de la consulta asociada a la cita actual', 'error')
      return
    }

    setGuardandoIndicadores(true)
    const result = await doctorService.actualizarConsulta(
      pacienteSeleccionadoId,
      consultaSeleccionada._id,
      { indicadoresSaludBucal }
    )

    if (result.success) {
      const consultaActualizada = { ...consultaSeleccionada, indicadoresSaludBucal }
      setConsultaSeleccionada(consultaActualizada)
      setHistorial(prev => ({
        ...prev,
        consultas: prev.consultas.map(consulta =>
          consulta._id === consultaSeleccionada._id ? consultaActualizada : consulta
        )
      }))
      mostrarToast('✅ Indicadores de salud bucal guardados')
    } else {
      mostrarToast(result.error || 'Error al guardar indicadores de salud bucal', 'error')
    }
    setGuardandoIndicadores(false)
  }

  const handleLimpiarPaciente = () => {
    if (onLimpiarPaciente) onLimpiarPaciente()
  }

  const consultas = historial?.consultas || []

  const getConsultaCitaId = (consulta) => {
    const cita = consulta?.cita || consulta?.citaId
    if (!cita) return ''
    return typeof cita === 'string' ? cita : cita._id || cita.id || ''
  }

  const esMismaFechaCita = (consulta) => {
    if (!fechaCita || !consulta?.fecha) return false
    return new Date(consulta.fecha).toISOString().split('T')[0] === new Date(fechaCita).toISOString().split('T')[0]
  }

  const puedeEditarConsulta = (consulta) => {
    if (!consulta) return false
    const consultaCitaId = getConsultaCitaId(consulta)
    if (citaId && consultaCitaId) return consultaCitaId === citaId
    if (citaId) return esMismaFechaCita(consulta)
    return false
  }

  const consultasEditables = citaId
    ? consultas.filter(consulta => puedeEditarConsulta(consulta))
    : []

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
                    ) : consultasEditables.length === 0 ? (
                      <p className="text-sm text-gray-500 text-center py-4">
                        No hay una consulta asociada a la cita actual
                      </p>
                    ) : (
                      consultasEditables.map((consulta) => (
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
              <p className="text-xs text-gray-500 mt-2">
                El formato HCU se mostrará completo, pero solo se podrán editar las piezas correspondientes al tipo seleccionado.
              </p>
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
                <h3 className="font-semibold text-gray-900">Odontograma Visual</h3>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                  {odontograma.tipoDenticion}
                </span>
              </div>

              <OdontogramaVisual 
                odontograma={odontograma}
                onSuperficieClick={handleSuperficieClick}
                onDienteUpdate={handleDienteUpdate}
              />
            </motion.div>
          )}

          {odontograma && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-gray-200 rounded-xl p-6"
            >
              <div className="flex items-start justify-between gap-4 mb-5">
                <div>
                  <h3 className="font-semibold text-gray-900">Indicadores de Salud Bucal</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Completa estos datos después de revisar el odontograma. Se reflejarán en la historia clínica.
                  </p>
                </div>
                <Button
                  type="button"
                  onClick={handleGuardarIndicadores}
                  loading={guardandoIndicadores}
                  disabled={guardandoIndicadores}
                >
                  Guardar indicadores
                </Button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {['placa', 'calculo', 'gingivitis'].map(key => (
                    <div key={key}>
                      <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                        {key === 'calculo' ? 'Cálculo' : key}
                      </label>
                      <select
                        value={indicadoresSaludBucal.higieneOral[key]}
                        onChange={e => actualizarIndicador(`higieneOral.${key}`, e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                      >
                        <option value="leve">Leve</option>
                        <option value="moderada">Moderada</option>
                        <option value="severa">Severa</option>
                      </select>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Enfermedad Periodontal
                    </label>
                    <select
                      value={indicadoresSaludBucal.enfermedadPeriodontal}
                      onChange={e => actualizarIndicador('enfermedadPeriodontal', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    >
                      <option value="leve">Leve</option>
                      <option value="moderada">Moderada</option>
                      <option value="severa">Severa</option>
                      <option value="">Ninguna</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Maloclusión
                    </label>
                    <select
                      value={indicadoresSaludBucal.maloclusion === null ? 'no' : indicadoresSaludBucal.maloclusion}
                      onChange={e => actualizarIndicador('maloclusion', e.target.value === 'no' ? null : e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    >
                      <option value="no">No</option>
                      <option value="angle I">Angle I</option>
                      <option value="angle II">Angle II</option>
                      <option value="angle III">Angle III</option>
                    </select>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Índice CPO</p>
                  <div className="grid grid-cols-3 gap-4">
                    {['C', 'P', 'O'].map(key => (
                      <div key={key}>
                        <label className="block text-xs text-gray-500 mb-1">{key}</label>
                        <input
                          type="number"
                          min="0"
                          value={indicadoresSaludBucal.indiceCPO[key]}
                          onChange={e => actualizarIndicador(`indiceCPO.${key}`, Number(e.target.value))}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}


        </div>
      )}
    </div>
  )
}

export default TabOdontograma
