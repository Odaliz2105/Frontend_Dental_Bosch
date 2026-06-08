import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileText, Search, ChevronDown, ChevronUp,
  Calendar, User, Plus, AlertCircle, Clock,
  Stethoscope, Activity, CalendarPlus, X
} from 'lucide-react'
import { useAuth } from '../../../context/AuthContext'
import doctorService from '../../../services/doctorService'
import Button from '../../../components/Button'
import FormularioConsulta from './FormularioConsulta'
import ModalDetallePaciente from './ModalDetallePaciente'
import OdontogramaVisual from '../../../components/OdontogramaVisual'

const DIAS_SEMANA = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado']
const DURACION_BLOQUE_MINUTOS = 60

const timeToMinutes = (time) => {
  if (!time) return NaN
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

const minutesToTime = (totalMinutes) => {
  const hours = String(Math.floor(totalMinutes / 60)).padStart(2, '0')
  const minutes = String(totalMinutes % 60).padStart(2, '0')
  return `${hours}:${minutes}`
}

const obtenerHorarioAtencion = (profileData) => {
  const data = profileData?.data || profileData?.datos || profileData?.doctor || profileData
  return data?.horarioAtencion || data?.usuario?.doctor?.horarioAtencion || []
}

const generarBloquesHorario = (horarioDia, citasDia = [], fechaSeleccionadaStr = '') => {
  if (!horarioDia?.disponible || !horarioDia?.horaInicio || !horarioDia?.horaFin) return []

  const inicio = timeToMinutes(horarioDia.horaInicio)
  const fin = timeToMinutes(horarioDia.horaFin)
  const citasOcupadas = citasDia
    .filter(cita => !['cancelada', 'cancelado'].includes(String(cita.estado || '').toLowerCase()))
    .map(cita => ({
      inicio: timeToMinutes(cita.horaInicio || cita.hora),
      fin: timeToMinutes(cita.horaFin || cita.horaInicio || cita.hora)
    }))
    .filter(cita => Number.isFinite(cita.inicio) && Number.isFinite(cita.fin))

  let limiteMinutoHoy = 0
  const hoy = new Date()
  if (fechaSeleccionadaStr) {
    const [año, mes, dia] = fechaSeleccionadaStr.split('-').map(Number)
    const fechaCita = new Date(año, mes - 1, dia)
    fechaCita.setHours(0, 0, 0, 0)
    
    const hoySinHora = new Date()
    hoySinHora.setHours(0, 0, 0, 0)
    
    if (fechaCita.getTime() === hoySinHora.getTime()) {
      limiteMinutoHoy = hoy.getHours() * 60 + hoy.getMinutes()
    }
  }

  const bloques = []
  for (let minuto = inicio; minuto + DURACION_BLOQUE_MINUTOS <= fin; minuto += DURACION_BLOQUE_MINUTOS) {
    const bloqueInicio = minuto
    const bloqueFin = minuto + DURACION_BLOQUE_MINUTOS

    if (limiteMinutoHoy > 0 && bloqueInicio < limiteMinutoHoy) {
      continue
    }

    const ocupado = citasOcupadas.some(cita => bloqueInicio < cita.fin && bloqueFin > cita.inicio)

    if (!ocupado) {
      bloques.push({
        horaInicio: minutesToTime(bloqueInicio),
        horaFin: minutesToTime(bloqueFin)
      })
    }
  }

  return bloques
}

// ── BADGE TIPO DIAGNÓSTICO ────────────────────────────────
const TipoBadge = ({ tipo }) => (
  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
    ${tipo === 'definitivo'
      ? 'bg-blue-100 text-blue-700'
      : 'bg-yellow-100 text-yellow-700'
    }`}>
    {tipo}
  </span>
)

// ── DETALLE EXPANDIBLE DE CONSULTA ────────────────────────
const DetalleConsulta = ({ consulta, pacienteId }) => {
  const [expandido, setExpandido] = useState(false)
  const [odontogramaDetalle, setOdontogramaDetalle] = useState(null)
  const [cargandoOdontogramaDetalle, setCargandoOdontogramaDetalle] = useState(false)
  const [errorOdontogramaDetalle, setErrorOdontogramaDetalle] = useState(null)

  const cargarOdontogramaDetalle = async () => {
    setCargandoOdontogramaDetalle(true)
    const result = await doctorService.verOdontogramaVisual(pacienteId, consulta._id)
    const odontogramaData = result.data?.odontograma || result.data?.datos?.odontograma
    if (result.success && odontogramaData) {
      setOdontogramaDetalle(odontogramaData)
      setErrorOdontogramaDetalle(null)
    } else {
      setOdontogramaDetalle(null)
      if (!result.success) {
        setErrorOdontogramaDetalle(result.error || 'Error al cargar odontograma')
      }
    }
    setCargandoOdontogramaDetalle(false)
  }

  useEffect(() => {
    if (expandido && consulta._id && pacienteId) {
      cargarOdontogramaDetalle()
    } else if (!expandido) {
      setOdontogramaDetalle(null)
    }
  }, [expandido, consulta._id, pacienteId])

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      {/* Header de la consulta */}
      <button
        onClick={() => setExpandido(!expandido)}
        className="w-full flex items-start justify-between p-4 hover:bg-gray-50 transition-colors text-left"
      >
        <div className="flex items-start gap-3">
          <div className="bg-primary/10 p-2 rounded-lg flex-shrink-0">
            <FileText size={16} className="text-primary" />
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm">
              {consulta.motivoConsulta || 'Sin motivo registrado'}
            </p>
            <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Calendar size={11} />
                {new Date(consulta.fecha).toLocaleDateString('es-ES', {
                  year: 'numeric', month: 'long', day: 'numeric'
                })}
              </span>
              {consulta.doctor && (
                <span className="flex items-center gap-1">
                  <Stethoscope size={11} />
                  Dr. {consulta.doctor?.usuario?.nombre} {consulta.doctor?.usuario?.apellido}
                </span>
              )}
            </div>
            {/* Diagnósticos en resumen */}
            {consulta.diagnosticos?.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {consulta.diagnosticos.slice(0, 2).map((d, i) => (
                  <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                    {d.cie10 && <span className="font-mono mr-1">{d.cie10}</span>}
                    {d.descripcion}
                  </span>
                ))}
                {consulta.diagnosticos.length > 2 && (
                  <span className="text-xs text-gray-400">
                    +{consulta.diagnosticos.length - 2} más
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="flex-shrink-0 ml-4">
          {expandido
            ? <ChevronUp size={16} className="text-gray-400" />
            : <ChevronDown size={16} className="text-gray-400" />
          }
        </div>
      </button>

      {/* Detalle expandido */}
      <AnimatePresence>
        {expandido && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 border-t border-gray-100 space-y-4 pt-4">

              {/* Enfermedad actual */}
              {consulta.enfermedadActual?.descripcion && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                    Enfermedad Actual
                  </p>
                  <p className="text-sm text-gray-700">
                    {consulta.enfermedadActual.descripcion}
                  </p>
                  {consulta.enfermedadActual.tiempoEvolucion && (
                    <p className="text-xs text-gray-500 mt-1">
                      Tiempo de evolución: {consulta.enfermedadActual.tiempoEvolucion}
                    </p>
                  )}
                  {consulta.enfermedadActual.intensidadDolor > 0 && (
                    <p className="text-xs text-gray-500">
                      Intensidad del dolor: {consulta.enfermedadActual.intensidadDolor}/10
                    </p>
                  )}
                  {consulta.enfermedadActual.sintomas?.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs font-medium text-gray-500 mb-1">Síntomas</p>
                      <div className="flex flex-wrap gap-1">
                        {consulta.enfermedadActual.sintomas.map((s, i) => (
                          <span key={i} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Signos vitales */}
              {consulta.signosVitales && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Signos Vitales
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {consulta.signosVitales.presionArterial && (
                      <div className="bg-gray-50 rounded-lg p-2 text-center">
                        <p className="text-xs text-gray-500">Presión</p>
                        <p className="text-sm font-semibold text-gray-800">
                          {consulta.signosVitales.presionArterial}
                        </p>
                      </div>
                    )}
                    {consulta.signosVitales.frecuenciaCardiaca && (
                      <div className="bg-gray-50 rounded-lg p-2 text-center">
                        <p className="text-xs text-gray-500">F. Cardíaca</p>
                        <p className="text-sm font-semibold text-gray-800">
                          {consulta.signosVitales.frecuenciaCardiaca} lpm
                        </p>
                      </div>
                    )}
                    {consulta.signosVitales.temperatura && (
                      <div className="bg-gray-50 rounded-lg p-2 text-center">
                        <p className="text-xs text-gray-500">Temperatura</p>
                        <p className="text-sm font-semibold text-gray-800">
                          {consulta.signosVitales.temperatura}°C
                        </p>
                      </div>
                    )}
                    {consulta.signosVitales.frecuenciaRespiratoria && (
                      <div className="bg-gray-50 rounded-lg p-2 text-center">
                        <p className="text-xs text-gray-500">F. Resp.</p>
                        <p className="text-sm font-semibold text-gray-800">
                          {consulta.signosVitales.frecuenciaRespiratoria} rpm
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Examen Estomatognático */}
              {consulta.examenEstomatognatico && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Examen Estomatognático
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {Object.entries(consulta.examenEstomatognatico)
                      .filter(([key]) => key !== 'observaciones')
                      .map(([key, val]) => (
                        <div key={key} className={`rounded-lg p-2 text-xs ${val.estado === 'patológico' ? 'bg-red-50 ring-1 ring-red-200' : 'bg-gray-50'}`}>
                          <p className="font-medium text-gray-700 capitalize mb-1">
                            {key === 'atm' ? 'ATM' : key === 'oroFaringe' ? 'Orofarínge' : key === 'pisoBoca' ? 'Piso de boca' : key === 'glandulasSalivales' ? 'Gl. Salivales' : key}
                          </p>
                          <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${
                            val.estado === 'patológico' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                          }`}>
                            {val.estado}
                          </span>
                          {val.observacion && (
                            <p className="text-gray-500 mt-1">{val.observacion}</p>
                          )}
                        </div>
                    ))}
                  </div>
                  {consulta.examenEstomatognatico.observaciones && (
                    <p className="text-xs text-gray-500 mt-2">
                      {consulta.examenEstomatognatico.observaciones}
                    </p>
                  )}
                </div>
              )}

              {/* Salud Bucal */}
              {consulta.indicadoresSaludBucal && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Salud Bucal
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {consulta.indicadoresSaludBucal.higieneOral && (
                      <div className="bg-gray-50 rounded-lg p-2">
                        <p className="text-xs font-medium text-gray-600 mb-1">Higiene Oral</p>
                        {Object.entries(consulta.indicadoresSaludBucal.higieneOral).map(([key, val]) => (
                          <p key={key} className="text-xs text-gray-500 capitalize">
                            {key}: <span className="font-medium text-gray-700">{val}</span>
                          </p>
                        ))}
                      </div>
                    )}
                    {consulta.indicadoresSaludBucal.enfermedadPeriodontal && (
                      <div className="bg-gray-50 rounded-lg p-2">
                        <p className="text-xs font-medium text-gray-600 mb-1">Enf. Periodontal</p>
                        <p className="text-xs font-medium text-gray-700 capitalize">
                          {consulta.indicadoresSaludBucal.enfermedadPeriodontal}
                        </p>
                      </div>
                    )}
                    {consulta.indicadoresSaludBucal.maloclusion && (
                      <div className="bg-gray-50 rounded-lg p-2">
                        <p className="text-xs font-medium text-gray-600 mb-1">Maloclusión</p>
                        <p className="text-xs font-medium text-gray-700">{consulta.indicadoresSaludBucal.maloclusion}</p>
                      </div>
                    )}
                    {consulta.indicadoresSaludBucal.indiceCPO && (
                      <div className="bg-gray-50 rounded-lg p-2">
                        <p className="text-xs font-medium text-gray-600 mb-1">Índice CPO</p>
                        <p className="text-xs text-gray-500">
                          C: <span className="font-medium text-gray-700">{consulta.indicadoresSaludBucal.indiceCPO.C}</span>
                          {' | '}P: <span className="font-medium text-gray-700">{consulta.indicadoresSaludBucal.indiceCPO.P}</span>
                          {' | '}O: <span className="font-medium text-gray-700">{consulta.indicadoresSaludBucal.indiceCPO.O}</span>
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Plan Diagnóstico */}
              {consulta.planDiagnostico && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Plan Diagnóstico
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { key: 'biometria', label: 'Biometría' },
                      { key: 'quimicaSanguinea', label: 'Química Sanguínea' },
                      { key: 'rayosX', label: 'Rayos X' },
                    ].map(({ key, label }) => {
                      const item = consulta.planDiagnostico[key]
                      if (!item || (!item.solicitado && !item.realizado && !item.pendiente)) return null
                      const estados = []
                      if (item.solicitado) estados.push('Solicitado')
                      if (item.realizado) estados.push('Realizado')
                      if (item.pendiente) estados.push('Pendiente')
                      return (
                        <span key={key} className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded-full">
                          {label}: {estados.join(', ')}
                        </span>
                      )
                    })}
                  </div>
                  {consulta.planDiagnostico.otros && (
                    <p className="text-xs text-gray-500 mt-2">
                      <span className="font-medium">Otros: </span>{consulta.planDiagnostico.otros}
                    </p>
                  )}
                  {consulta.planDiagnostico.observaciones && (
                    <p className="text-xs text-gray-500 mt-1">
                      {consulta.planDiagnostico.observaciones}
                    </p>
                  )}
                </div>
              )}

              {/* Diagnósticos completos */}
              {consulta.diagnosticos?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Diagnósticos
                  </p>
                  <div className="space-y-2">
                    {consulta.diagnosticos.map((d, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <TipoBadge tipo={d.tipo} />
                        <div>
                          {d.cie10 && (
                            <span className="text-xs font-mono text-gray-500 mr-2">
                              {d.cie10}
                            </span>
                          )}
                          <span className="text-sm text-gray-700">{d.descripcion}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tratamientos */}
              {consulta.tratamientos?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Tratamientos
                  </p>
                  <div className="space-y-2">
                    {consulta.tratamientos.map((t, i) => (
                      <div key={i} className="bg-blue-50 rounded-lg p-3">
                        <p className="text-xs font-medium text-blue-700 mb-1">
                          Sesión {t.sesion}
                        </p>
                        {t.procedimientos?.length > 0 && (
                          <p className="text-xs text-gray-600">
                            <span className="font-medium">Procedimientos: </span>
                            {t.procedimientos.join(', ')}
                          </p>
                        )}
                        {t.prescripciones?.length > 0 && (
                          <p className="text-xs text-gray-600 mt-1">
                            <span className="font-medium">Prescripciones: </span>
                            {t.prescripciones.join(', ')}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Antecedentes relevantes */}
              {consulta.antecedentes && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Antecedentes Relevantes
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(consulta.antecedentes.alergias || {}).map(([key, val]) =>
                      val ? (
                        <span key={key} className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                          Alergia: {key}
                        </span>
                      ) : null
                    )}
                    {Object.entries(consulta.antecedentes.enfermedades || {}).map(([key, val]) =>
                      val ? (
                        <span key={key} className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full capitalize">
                          {key}
                        </span>
                      ) : null
                    )}
                    {!Object.values(consulta.antecedentes.alergias || {}).some(Boolean) &&
                     !Object.values(consulta.antecedentes.enfermedades || {}).some(Boolean) && (
                      <span className="text-xs text-gray-400">Sin antecedentes relevantes</span>
                    )}
                  </div>
                </div>
              )}

              {/* Indicadores de Salud Bucal */}
              {consulta.indicadoresSaludBucal && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Indicadores de Salud Bucal
                  </p>
                  <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                    {/* CPO Index */}
                    {consulta.indicadoresSaludBucal.indiceCPO && (
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-medium text-gray-600">Índice CPO:</span>
                        <div className="flex gap-2">
                          <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                            C: {consulta.indicadoresSaludBucal.indiceCPO.C || 0}
                          </span>
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                            P: {consulta.indicadoresSaludBucal.indiceCPO.P || 0}
                          </span>
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                            O: {consulta.indicadoresSaludBucal.indiceCPO.O || 0}
                          </span>
                        </div>
                      </div>
                    )}
                    {/* Higiene Oral */}
                    {consulta.indicadoresSaludBucal.higieneOral && (
                      <div className="flex flex-wrap gap-2">
                        <span className="text-xs font-medium text-gray-600">Higiene:</span>
                        {Object.entries(consulta.indicadoresSaludBucal.higieneOral).map(([key, val]) => (
                          <span key={key} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full capitalize">
                            {key === 'calculo' ? 'Cálculo' : key}: {val}
                          </span>
                        ))}
                      </div>
                    )}
                    {/* Enfermedad Periodontal */}
                    {consulta.indicadoresSaludBucal.enfermedadPeriodontal && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-gray-600">Periodontal:</span>
                        <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">
                          {consulta.indicadoresSaludBucal.enfermedadPeriodontal}
                        </span>
                      </div>
                    )}
                    {/* Maloclusión */}
                    {consulta.indicadoresSaludBucal.maloclusion && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-gray-600">Maloclusión:</span>
                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                          {consulta.indicadoresSaludBucal.maloclusion}
                        </span>
                      </div>
                    )}
                    {/* Fluorosis */}
                    {consulta.indicadoresSaludBucal.fluorosis && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-gray-600">Fluorosis:</span>
                        <span className="text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full">
                          {consulta.indicadoresSaludBucal.fluorosis}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Odontograma */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Odontograma
                </p>
                {errorOdontogramaDetalle && (
                  <div className="mb-2 text-xs text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
                    {errorOdontogramaDetalle}
                  </div>
                )}
                {cargandoOdontogramaDetalle ? (
                  <div className="flex items-center gap-2 text-sm text-gray-500 py-2">
                    <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                    Cargando odontograma...
                  </div>
                ) : !odontogramaDetalle ? (
                  <p className="text-xs text-gray-400">Esta consulta no tiene odontograma.</p>
                  ) : (
                    <OdontogramaVisual
                      odontograma={odontogramaDetalle}
                      readOnly={true}
                    />
                )}
              </div>


            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── COMPONENTE PRINCIPAL ──────────────────────────────────
const TabHistorias = ({ pacienteSeleccionadoId, pacienteNombre, citaId, motivoCita, onLimpiarPaciente, onSeleccionarPaciente }) => {
  const { getAdminPacientes, user } = useAuth()

  const [pacientes, setPacientes] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null)
  const [historial, setHistorial] = useState(null)
  const [cargandoPacientes, setCargandoPacientes] = useState(true)
  const [cargandoHistorial, setCargandoHistorial] = useState(false)
  const [creandoHistorial, setCreandoHistorial] = useState(false)
  const [sinHistorial, setSinHistorial] = useState(false)
  const [toast, setToast] = useState(null)
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [mostrarDetallePaciente, setMostrarDetallePaciente] = useState(false)
  const [autoSeleccionando, setAutoSeleccionando] = useState(false)
  const [mostrarAgendarCita, setMostrarAgendarCita] = useState(false)
  const [agendandoCita, setAgendandoCita] = useState(false)
  const [formCita, setFormCita] = useState({
    fecha: '',
    horaInicio: '',
    horaFin: '',
    motivo: 'Control post tratamiento'
  })
  const [horarioAtencionDoctor, setHorarioAtencionDoctor] = useState([])
  const [horariosDisponibles, setHorariosDisponibles] = useState([])
  const [cargandoHorarios, setCargandoHorarios] = useState(false)
  const [mensajeHorarios, setMensajeHorarios] = useState('')

  const handleNuevaConsulta = () => {
    setMostrarFormulario(true)
  }

  const handleConsultaCreada = async () => {
    const result = await doctorService.getHistorialClinico(pacienteSeleccionado._id)
    if (result.success) {
      setHistorial(result.data.datos)
    }
  }

  const cargarHorarioDoctor = async () => {
    const result = await doctorService.getDoctorProfile()
    if (result.success) {
      setHorarioAtencionDoctor(obtenerHorarioAtencion(result.data))
    } else {
      mostrarToast(result.error || 'Error al cargar horario de atención', 'error')
    }
  }

  const cargarHorariosDisponibles = async (fecha) => {
    if (!fecha) {
      setHorariosDisponibles([])
      setMensajeHorarios('')
      return
    }

    if (horarioAtencionDoctor.length === 0) {
      setHorariosDisponibles([])
      setMensajeHorarios('No tienes horario de atención configurado.')
      return
    }

    setCargandoHorarios(true)
    setMensajeHorarios('')

    const diaSemana = DIAS_SEMANA[new Date(`${fecha}T00:00:00`).getDay()]
    const horarioDia = horarioAtencionDoctor.find(horario =>
      String(horario.dia || '').toLowerCase() === diaSemana
    )

    if (!horarioDia?.disponible) {
      setHorariosDisponibles([])
      setMensajeHorarios('No tienes horario de atención configurado para esta fecha.')
      setCargandoHorarios(false)
      return
    }

    const result = await doctorService.getDoctorCitas({
      desde: fecha,
      hasta: fecha,
      page: 1,
      limit: 100
    })

    const citasDia = result.success
      ? result.data.datos?.citas || result.data.data?.citas || result.data.citas || []
      : []
    const bloques = generarBloquesHorario(horarioDia, citasDia, fecha)

    setHorariosDisponibles(bloques)
    setMensajeHorarios(bloques.length === 0 ? 'No hay horarios disponibles para esta fecha.' : '')
    setCargandoHorarios(false)

    if (!result.success) {
      mostrarToast(result.error || 'No se pudieron verificar las citas existentes', 'error')
    }
  }

  const handleAgendarCita = async (e) => {
    e.preventDefault()
    if (!formCita.fecha || !formCita.horaInicio || !formCita.horaFin) {
      mostrarToast('Completa todos los campos de fecha y hora', 'error')
      return
    }

    setAgendandoCita(true)
    const result = await doctorService.crearCitaDoctor({
      paciente: pacienteSeleccionado._id,
      fecha: formCita.fecha,
      horaInicio: formCita.horaInicio,
      horaFin: formCita.horaFin,
      motivo: formCita.motivo
    })

    if (result.success) {
      mostrarToast('✅ Cita de seguimiento agendada correctamente')
      setMostrarAgendarCita(false)
      setFormCita({ fecha: '', horaInicio: '', horaFin: '', motivo: 'Control post tratamiento' })
      setHorariosDisponibles([])
      setMensajeHorarios('')
    } else {
      const msg = result.status === 409
        ? 'El paciente ya fue atendido hoy. Agenda para una fecha posterior.'
        : result.error || 'Error al agendar cita'
      mostrarToast(msg, 'error')
    }
    setAgendandoCita(false)
  }

  const mostrarToast = (msg, tipo = 'success') => {
    setToast({ msg, tipo })
    setTimeout(() => setToast(null), 3000)
  }

  useEffect(() => {
    if (mostrarAgendarCita && horarioAtencionDoctor.length === 0) {
      cargarHorarioDoctor()
    }
  }, [mostrarAgendarCita])

  useEffect(() => {
    if (mostrarAgendarCita) {
      cargarHorariosDisponibles(formCita.fecha)
    }
  }, [mostrarAgendarCita, formCita.fecha, horarioAtencionDoctor])

  // Cargar pacientes al inicio
  useEffect(() => {
    const cargarPacientes = async () => {
      setCargandoPacientes(true)
      const result = await doctorService.getDoctorPacientes()
      if (result.success) {
        const data = result.data.data || []
        setPacientes(data)

        if (pacienteSeleccionadoId) {
          const encontrado = data.find(p =>
            p._id === pacienteSeleccionadoId || p.id === pacienteSeleccionadoId ||
            p.usuario?._id === pacienteSeleccionadoId
          )
          if (encontrado) {
            setAutoSeleccionando(true)
            setPacienteSeleccionado(encontrado)
          }
        }
      }
      setCargandoPacientes(false)
    }
    cargarPacientes()
  }, [])

  // Auto-seleccionar paciente cuando llega desde "Atender"
  useEffect(() => {
    if (!pacienteSeleccionadoId || pacientes.length === 0) return

    const encontrado = pacientes.find(p =>
      p._id === pacienteSeleccionadoId || p.id === pacienteSeleccionadoId ||
      p.usuario?._id === pacienteSeleccionadoId
    )

    if (encontrado && (!pacienteSeleccionado || pacienteSeleccionado._id !== encontrado._id)) {
      setAutoSeleccionando(true)
      setPacienteSeleccionado(encontrado)
    }
  }, [pacienteSeleccionadoId, pacientes])

  // Cargar historial automáticamente cuando se selecciona paciente
  useEffect(() => {
    if (!pacienteSeleccionado) return

    const cargarHistorial = async () => {
      setHistorial(null)
      setSinHistorial(false)
      setCargandoHistorial(true)

      const result = await doctorService.getHistorialClinico(pacienteSeleccionado._id)

      if (result.success) {
        setHistorial(result.data.datos)
        setSinHistorial(false)

        if (autoSeleccionando) {
          setAutoSeleccionando(false)
        }
      } else if (result.status === 404) {
        setSinHistorial(true)
        setAutoSeleccionando(false)
      } else {
        mostrarToast(result.error || 'Error al cargar historial', 'error')
        setAutoSeleccionando(false)
      }

      setCargandoHistorial(false)
    }

    cargarHistorial()
  }, [pacienteSeleccionado])

  const seleccionarPaciente = (paciente) => {
    setPacienteSeleccionado(paciente)
    if (onSeleccionarPaciente) {
      onSeleccionarPaciente(paciente)
    }
  }

  const handleCrearHistorial = async () => {
    setCreandoHistorial(true)
    const result = await doctorService.crearHistorialClinico(pacienteSeleccionado._id)
    if (result.success) {
      setHistorial(result.data.datos)
      setSinHistorial(false)
      mostrarToast('✅ Historial clínico creado correctamente')
    } else {
      mostrarToast(result.error || 'Error al crear historial', 'error')
    }
    setCreandoHistorial(false)
  }

  const pacientesFiltrados = pacientes.filter(p =>
    `${p.nombre} ${p.apellido} ${p.email}`
      .toLowerCase().includes(busqueda.toLowerCase())
  )

  return (
    <div className="flex gap-6 h-full">

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

      {/* Modal de detalle de paciente */}
      {mostrarDetallePaciente && (
        <ModalDetallePaciente
          pacienteId={pacienteSeleccionado._id}
          onClose={() => setMostrarDetallePaciente(false)}
        />
      )}

      {/* Modal agendar cita de seguimiento */}
      {mostrarAgendarCita && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setMostrarAgendarCita(false) }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <CalendarPlus size={20} className="text-primary" />
                Agendar cita de seguimiento
              </h2>
              <button onClick={() => setMostrarAgendarCita(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              Paciente: <span className="font-semibold">{pacienteSeleccionado?.nombre} {pacienteSeleccionado?.apellido}</span>
            </p>

            <form onSubmit={handleAgendarCita} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                <input
                  type="date"
                  value={formCita.fecha}
                  min={(() => {
                    const hoy = new Date()
                    return `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`
                  })()}
                  onChange={e => setFormCita({ ...formCita, fecha: e.target.value, horaInicio: '', horaFin: '' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Horario disponible</label>
                <select
                  value={formCita.horaInicio && formCita.horaFin ? `${formCita.horaInicio}|${formCita.horaFin}` : ''}
                  onChange={e => {
                    const [horaInicio, horaFin] = e.target.value.split('|')
                    setFormCita({ ...formCita, horaInicio: horaInicio || '', horaFin: horaFin || '' })
                  }}
                  disabled={!formCita.fecha || cargandoHorarios || horariosDisponibles.length === 0}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:bg-gray-100 disabled:text-gray-500"
                  required
                >
                  <option value="">
                    {cargandoHorarios ? 'Cargando horarios...' : 'Selecciona un horario'}
                  </option>
                  {horariosDisponibles.map(horario => (
                    <option
                      key={`${horario.horaInicio}-${horario.horaFin}`}
                      value={`${horario.horaInicio}|${horario.horaFin}`}
                    >
                      {horario.horaInicio} - {horario.horaFin}
                    </option>
                  ))}
                </select>
                {mensajeHorarios && (
                  <p className="text-xs text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2 mt-2">
                    {mensajeHorarios}
                  </p>
                )}
                {formCita.fecha && !mensajeHorarios && !cargandoHorarios && horariosDisponibles.length > 0 && (
                  <p className="text-xs text-gray-500 mt-2">
                    Horarios generados según tu horario de atención configurado por administración.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Motivo</label>
                <input
                  type="text"
                  value={formCita.motivo}
                  onChange={e => setFormCita({ ...formCita, motivo: e.target.value })}
                  placeholder="Ej: Control post tratamiento"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setMostrarAgendarCita(false)}>
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  loading={agendandoCita}
                  disabled={agendandoCita || !formCita.horaInicio || !formCita.horaFin}
                >
                  <CalendarPlus size={16} className="mr-1.5" />
                  Agendar cita
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}

      {/* Modal de nueva consulta / edición */}
      {mostrarFormulario && (
        <FormularioConsulta
          pacienteId={pacienteSeleccionado._id}
          pacienteNombre={`${pacienteSeleccionado.nombre} ${pacienteSeleccionado.apellido}`}
          citaId={citaId}
          motivoCita={motivoCita}
          onClose={() => setMostrarFormulario(false)}
          onSuccess={handleConsultaCreada}
        />
      )}

      {/* Panel izquierdo — Lista de pacientes */}
      <div className="w-72 flex-shrink-0">
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800 text-sm mb-3">
              Seleccionar Paciente
            </h3>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar paciente..."
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {cargandoPacientes ? (
              <div className="p-6 text-center">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary mb-2"></div>
                <p className="text-xs text-gray-500">Cargando pacientes...</p>
              </div>
            ) : pacientesFiltrados.length === 0 ? (
              <div className="p-6 text-center">
                <User size={24} className="mx-auto text-gray-300 mb-2" />
                <p className="text-xs text-gray-500">No hay pacientes</p>
              </div>
            ) : (
              pacientesFiltrados.map(paciente => (
                <button
                  key={paciente._id}
                  onClick={() => seleccionarPaciente(paciente)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors border-b border-gray-50 last:border-0
                    ${pacienteSeleccionado?._id === paciente._id
                      ? 'bg-primary/10 border-l-2 border-l-primary'
                      : 'hover:bg-gray-50'
                    }`}
                >
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold text-sm flex-shrink-0">
                    {paciente.nombre?.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {paciente.nombre} {paciente.apellido}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{paciente.email}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Panel derecho — Historial */}
      <div className="flex-1 min-w-0">
        {!pacienteSeleccionado ? (
          <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
            <FileText size={48} className="mx-auto text-gray-200 mb-4" />
            <p className="text-gray-500 font-medium">Selecciona un paciente</p>
            <p className="text-gray-400 text-sm mt-1">
              para ver su historial clínico
            </p>
          </div>
        ) : cargandoHistorial ? (
          <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-3"></div>
            <p className="text-gray-500 text-sm">Cargando historial...</p>
          </div>
        ) : sinHistorial ? (
          <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
            <AlertCircle size={48} className="mx-auto text-yellow-400 mb-4" />
            <p className="text-gray-700 font-semibold mb-1">Sin historial clínico</p>
            <p className="text-gray-500 text-sm mb-6">
              {pacienteSeleccionado.nombre} {pacienteSeleccionado.apellido} no tiene
              historial clínico registrado.
            </p>
            <Button
              onClick={handleCrearHistorial}
              loading={creandoHistorial}
              disabled={creandoHistorial}
            >
              <Plus size={16} className="mr-2" />
              Crear Historial Clínico
            </Button>
          </div>
        ) : historial ? (
          <div className="space-y-4">
            {/* Header del historial */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                      {historial.numeroHistoriaClinica}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-gray-900">
                      {historial.informacionComplementaria?.nombreCompleto ||
                       `${pacienteSeleccionado.nombre} ${pacienteSeleccionado.apellido}`}
                    </h2>
                    <button
                      onClick={() => setMostrarDetallePaciente(true)}
                      className="text-xs text-primary hover:text-primary/80 font-medium underline underline-offset-2"
                    >
                      Ver detalle
                    </button>
                  </div>
                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                    {historial.informacionComplementaria?.edad && (
                      <span>{historial.informacionComplementaria.edad} años</span>
                    )}
                    {historial.informacionComplementaria?.grupoEtario && (
                      <span className="bg-gray-100 px-2 py-0.5 rounded-full text-xs">
                        {historial.informacionComplementaria.grupoEtario}
                      </span>
                    )}
                  </div>
                </div>

                {/* Métricas */}
                <div className="flex gap-4 text-center">
                  <div className="bg-gray-50 rounded-xl px-4 py-2">
                    <p className="text-2xl font-bold text-primary">
                      {historial.metricas?.totalConsultas || 0}
                    </p>
                    <p className="text-xs text-gray-500">Consultas</p>
                  </div>
                  {historial.metricas?.ultimaVisita && (
                    <div className="bg-gray-50 rounded-xl px-4 py-2">
                      <p className="text-sm font-semibold text-gray-700">
                        {new Date(historial.metricas.ultimaVisita).toLocaleDateString('es-ES', {
                          day: 'numeric', month: 'short'
                        })}
                      </p>
                      <p className="text-xs text-gray-500">Última visita</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Lista de consultas */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                  <Clock size={16} className="text-primary" />
                  Consultas ({historial.consultas?.length || 0})
                </h3>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="small"
                    onClick={() => {
                      setFormCita(prev => ({ ...prev, fecha: new Date().toISOString().split('T')[0] }))
                      setMostrarAgendarCita(true)
                    }}
                  >
                    <CalendarPlus size={14} className="mr-1" />
                    Agendar cita
                  </Button>
                  <Button
                    variant="primary"
                    size="small"
                    onClick={handleNuevaConsulta}
                  >
                    <Plus size={14} className="mr-1" />
                    Nueva Consulta
                  </Button>
                </div>
              </div>

              {!historial.consultas || historial.consultas.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
                  <Activity size={32} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-500 text-sm">No hay consultas registradas</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {[...historial.consultas]
                    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
                    .map((consulta, i) => (
                      <motion.div
                        key={consulta._id || i}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <DetalleConsulta consulta={consulta} pacienteId={pacienteSeleccionado._id} />
                      </motion.div>
                    ))
                  }
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default TabHistorias