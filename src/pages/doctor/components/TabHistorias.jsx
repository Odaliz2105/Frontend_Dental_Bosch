import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileText, Search, ChevronDown, ChevronUp,
  Calendar, User, Plus, AlertCircle, Clock,
  Stethoscope, Activity, Edit2
} from 'lucide-react'
import { useAuth } from '../../../context/AuthContext'
import doctorService from '../../../services/doctorService'
import Button from '../../../components/Button'
import FormularioConsulta from './FormularioConsulta'
import ModalDetallePaciente from './ModalDetallePaciente'

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
const DetalleConsulta = ({ consulta, onEdit }) => {
  const [expandido, setExpandido] = useState(false)

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

              {/* Botón editar */}
              {onEdit && (
                <div className="border-t border-gray-100 pt-3">
                  <button
                    type="button"
                    onClick={() => onEdit(consulta)}
                    className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary-dark transition-colors"
                  >
                    <Edit2 size={13} />
                    Editar consulta
                  </button>
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── COMPONENTE PRINCIPAL ──────────────────────────────────
const TabHistorias = () => {
  const { getAdminPacientes } = useAuth()

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
  const [editandoConsulta, setEditandoConsulta] = useState(null)

  const handleEditConsulta = (consulta) => {
    setEditandoConsulta(consulta)
    setMostrarFormulario(true)
  }

  const handleNuevaConsulta = () => {
    setEditandoConsulta(null)
    setMostrarFormulario(true)
  }

  const handleConsultaCreada = async () => {
    const result = await doctorService.getHistorialClinico(pacienteSeleccionado._id)
    if (result.success) {
      setHistorial(result.data.datos)
    }
  }

  const mostrarToast = (msg, tipo = 'success') => {
    setToast({ msg, tipo })
    setTimeout(() => setToast(null), 3000)
  }

  // Cargar pacientes al inicio
  useEffect(() => {
    const cargarPacientes = async () => {
      setCargandoPacientes(true)
      const result = await doctorService.getDoctorPacientes()
      if (result.success) {
        setPacientes(result.data.data || [])
      }
      setCargandoPacientes(false)
    }
    cargarPacientes()
  }, [])

  // Cargar historial cuando se selecciona un paciente
  const seleccionarPaciente = async (paciente) => {
    setPacienteSeleccionado(paciente)
    setHistorial(null)
    setSinHistorial(false)
    setCargandoHistorial(true)

    const result = await doctorService.getHistorialClinico(paciente._id)

    if (result.success) {
      setHistorial(result.data.datos)
      setSinHistorial(false)
    } else if (result.status === 404) {
      setSinHistorial(true)
    } else {
      mostrarToast(result.error || 'Error al cargar historial', 'error')
    }

    setCargandoHistorial(false)
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

      {/* Modal de nueva consulta / edición */}
      {mostrarFormulario && (
        <FormularioConsulta
          pacienteId={pacienteSeleccionado._id}
          pacienteNombre={`${pacienteSeleccionado.nombre} ${pacienteSeleccionado.apellido}`}
          consultaEdit={editandoConsulta}
          onClose={() => { setMostrarFormulario(false); setEditandoConsulta(null) }}
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
                <Button
                  variant="primary"
                  size="small"
                  onClick={handleNuevaConsulta}
                >
                  <Plus size={14} className="mr-1" />
                  Nueva Consulta
                </Button>
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
                        <DetalleConsulta consulta={consulta} onEdit={handleEditConsulta} />
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