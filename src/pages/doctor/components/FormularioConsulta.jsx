import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Trash2, Stethoscope } from 'lucide-react'
import Button from '../../../components/Button'
import doctorService from '../../../services/doctorService'

const ESTADOS_EXAMEN = ['normal', 'patológico']

const EXAMEN_INITIAL = {
  labios: { estado: 'normal', observacion: '' },
  mejillas: { estado: 'normal', observacion: '' },
  maxilarSuperior: { estado: 'normal', observacion: '' },
  maxilarInferior: { estado: 'normal', observacion: '' },
  lengua: { estado: 'normal', observacion: '' },
  paladar: { estado: 'normal', observacion: '' },
  pisoBoca: { estado: 'normal', observacion: '' },
  carrillos: { estado: 'normal', observacion: '' },
  glandulasSalivales: { estado: 'normal', observacion: '' },
  oroFaringe: { estado: 'normal', observacion: '' },
  atm: { estado: 'normal', observacion: '' },
  ganglios: { estado: 'normal', observacion: '' },
  observaciones: ''
}

const INITIAL_STATE = {
  motivoConsulta: '',
  enfermedadActual: {
    descripcion: '',
    tiempoEvolucion: '',
    sintomas: [],
    intensidadDolor: 0,
    observaciones: ''
  },
  antecedentes: {
    alergias: { antibioticos: false, anestesia: false },
    enfermedades: {
      hemorragias: false, vih: false, tuberculosis: false,
      asma: false, diabetes: false, hipertension: false, cardiacas: false
    },
    otros: false,
    observaciones: ''
  },
  signosVitales: {
    presionArterial: '',
    frecuenciaCardiaca: '',
    temperatura: '',
    frecuenciaRespiratoria: ''
  },
  examenEstomatognatico: JSON.parse(JSON.stringify(EXAMEN_INITIAL)),
  indicadoresSaludBucal: {
    higieneOral: { placa: 'leve', calculo: 'leve', gingivitis: 'leve' },
    enfermedadPeriodontal: 'leve',
    maloclusion: null,
    fluorosis: null,
    indiceCPO: { C: 0, P: 0, O: 0 }
  },
  planDiagnostico: {
    biometria: { solicitado: false, realizado: false, pendiente: false },
    quimicaSanguinea: { solicitado: false, realizado: false, pendiente: false },
    rayosX: { solicitado: false, realizado: false, pendiente: false },
    otros: '',
    observaciones: ''
  },
  diagnosticos: [],
  tratamientos: []
}

const SelectorEstado = ({ value, onChange, label }) => (
  <div>
    <p className="text-xs text-gray-500 mb-1">{label}</p>
    <div className="flex gap-2">
      {ESTADOS_EXAMEN.map(e => (
        <button
          key={e}
          type="button"
          onClick={() => onChange(e)}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
            value === e
              ? e === 'patológico'
                ? 'bg-red-100 text-red-700 ring-1 ring-red-300'
                : 'bg-green-100 text-green-700 ring-1 ring-green-300'
              : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
          }`}
        >
          {e}
        </button>
      ))}
    </div>
  </div>
)

const FormularioConsulta = ({ pacienteId, pacienteNombre, onClose, onSuccess, consultaEdit }) => {
  const getInitialState = () => {
    if (!consultaEdit) return JSON.parse(JSON.stringify(INITIAL_STATE))
    const c = consultaEdit
    return {
      motivoConsulta: c.motivoConsulta || '',
      enfermedadActual: {
        descripcion: c.enfermedadActual?.descripcion || '',
        tiempoEvolucion: c.enfermedadActual?.tiempoEvolucion || '',
        sintomas: c.enfermedadActual?.sintomas || [],
        intensidadDolor: c.enfermedadActual?.intensidadDolor ?? 0,
        observaciones: c.enfermedadActual?.observaciones || '',
      },
      antecedentes: {
        alergias: {
          antibioticos: c.antecedentes?.alergias?.antibioticos ?? false,
          anestesia: c.antecedentes?.alergias?.anestesia ?? false,
        },
        enfermedades: {
          hemorragias: c.antecedentes?.enfermedades?.hemorragias ?? false,
          vih: c.antecedentes?.enfermedades?.vih ?? false,
          tuberculosis: c.antecedentes?.enfermedades?.tuberculosis ?? false,
          asma: c.antecedentes?.enfermedades?.asma ?? false,
          diabetes: c.antecedentes?.enfermedades?.diabetes ?? false,
          hipertension: c.antecedentes?.enfermedades?.hipertension ?? false,
          cardiacas: c.antecedentes?.enfermedades?.cardiacas ?? false,
        },
        otros: c.antecedentes?.otros ?? false,
        observaciones: c.antecedentes?.observaciones || '',
      },
      signosVitales: {
        presionArterial: c.signosVitales?.presionArterial || '',
        frecuenciaCardiaca: c.signosVitales?.frecuenciaCardiaca ?? '',
        temperatura: c.signosVitales?.temperatura ?? '',
        frecuenciaRespiratoria: c.signosVitales?.frecuenciaRespiratoria ?? '',
      },
      examenEstomatognatico: c.examenEstomatognatico
        ? Object.keys(EXAMEN_INITIAL).reduce((acc, key) => {
            acc[key] = {
              estado: c.examenEstomatognatico[key]?.estado || 'normal',
              observacion: c.examenEstomatognatico[key]?.observacion || '',
            }
            return acc
          }, {})
        : JSON.parse(JSON.stringify(EXAMEN_INITIAL)),
      indicadoresSaludBucal: {
        higieneOral: {
          placa: c.indicadoresSaludBucal?.higieneOral?.placa || 'leve',
          calculo: c.indicadoresSaludBucal?.higieneOral?.calculo || 'leve',
          gingivitis: c.indicadoresSaludBucal?.higieneOral?.gingivitis || 'leve',
        },
        enfermedadPeriodontal: c.indicadoresSaludBucal?.enfermedadPeriodontal || 'leve',
        maloclusion: c.indicadoresSaludBucal?.maloclusion ?? null,
        fluorosis: c.indicadoresSaludBucal?.fluorosis ?? null,
        indiceCPO: {
          C: c.indicadoresSaludBucal?.indiceCPO?.C ?? 0,
          P: c.indicadoresSaludBucal?.indiceCPO?.P ?? 0,
          O: c.indicadoresSaludBucal?.indiceCPO?.O ?? 0,
        },
      },
      planDiagnostico: {
        biometria: {
          solicitado: c.planDiagnostico?.biometria?.solicitado ?? false,
          realizado: c.planDiagnostico?.biometria?.realizado ?? false,
          pendiente: c.planDiagnostico?.biometria?.pendiente ?? false,
        },
        quimicaSanguinea: {
          solicitado: c.planDiagnostico?.quimicaSanguinea?.solicitado ?? false,
          realizado: c.planDiagnostico?.quimicaSanguinea?.realizado ?? false,
          pendiente: c.planDiagnostico?.quimicaSanguinea?.pendiente ?? false,
        },
        rayosX: {
          solicitado: c.planDiagnostico?.rayosX?.solicitado ?? false,
          realizado: c.planDiagnostico?.rayosX?.realizado ?? false,
          pendiente: c.planDiagnostico?.rayosX?.pendiente ?? false,
        },
        otros: c.planDiagnostico?.otros || '',
        observaciones: c.planDiagnostico?.observaciones || '',
      },
      diagnosticos: c.diagnosticos?.map(d => ({
        descripcion: d.descripcion || '',
        cie10: d.cie10 || '',
        tipo: d.tipo || 'presuntivo',
      })) || [],
      tratamientos: c.tratamientos?.map(t => ({
        sesion: t.sesion || 1,
        fecha: t.fecha ? new Date(t.fecha).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
        diagnosticosComplicaciones: t.diagnosticosComplicaciones || '',
        procedimientos: t.procedimientos || [],
        prescripciones: t.prescripciones || [],
        codigo: t.codigo || '',
      })) || [],
    }
  }

  const [formData, setFormData] = useState(getInitialState)
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState(null)
  const [sintomaInput, setSintomaInput] = useState('')
  const [seccionActiva, setSeccionActiva] = useState('principal')
  const [examActualKey, setExamActualKey] = useState('')

  const update = (path, value) => {
    setFormData(prev => {
      const keys = path.split('.')
      const newData = { ...prev }
      let obj = newData
      for (let i = 0; i < keys.length - 1; i++) {
        obj[keys[i]] = { ...obj[keys[i]] }
        obj = obj[keys[i]]
      }
      obj[keys[keys.length - 1]] = value
      return newData
    })
  }

  const agregarSintoma = () => {
    const s = sintomaInput.trim()
    if (!s) return
    update('enfermedadActual.sintomas', [...formData.enfermedadActual.sintomas, s])
    setSintomaInput('')
  }

  const quitarSintoma = (i) => {
    const arr = formData.enfermedadActual.sintomas.filter((_, idx) => idx !== i)
    update('enfermedadActual.sintomas', arr)
  }

  const agregarDiagnostico = () => {
    setFormData(prev => ({
      ...prev,
      diagnosticos: [...prev.diagnosticos, { descripcion: '', cie10: '', tipo: 'presuntivo' }]
    }))
  }

  const actualizarDiagnostico = (i, field, value) => {
    setFormData(prev => {
      const d = [...prev.diagnosticos]
      d[i] = { ...d[i], [field]: value }
      return { ...prev, diagnosticos: d }
    })
  }

  const quitarDiagnostico = (i) => {
    setFormData(prev => ({
      ...prev,
      diagnosticos: prev.diagnosticos.filter((_, idx) => idx !== i)
    }))
  }

  const agregarTratamiento = () => {
    setFormData(prev => ({
      ...prev,
      tratamientos: [...prev.tratamientos, {
        sesion: prev.tratamientos.length + 1,
        fecha: new Date().toISOString().slice(0, 16),
        diagnosticosComplicaciones: '',
        procedimientos: [],
        prescripciones: [],
        codigo: ''
      }]
    }))
  }

  const limpiarPayload = (data) => {
    const p = JSON.parse(JSON.stringify(data))

    p.signosVitales.frecuenciaCardiaca = p.signosVitales.frecuenciaCardiaca
      ? Number(p.signosVitales.frecuenciaCardiaca) : null
    p.signosVitales.temperatura = p.signosVitales.temperatura
      ? Number(p.signosVitales.temperatura) : null
    p.signosVitales.frecuenciaRespiratoria = p.signosVitales.frecuenciaRespiratoria
      ? Number(p.signosVitales.frecuenciaRespiratoria) : null

    p.tratamientos = p.tratamientos.map(t => ({
      ...t,
      fecha: t.fecha ? new Date(t.fecha).toISOString() : new Date().toISOString(),
      procedimientos: t.procedimientos.filter(Boolean),
      prescripciones: t.prescripciones.filter(Boolean),
    }))

    if (!p.enfermedadActual.descripcion) p.enfermedadActual.descripcion = undefined
    if (!p.antecedentes.observaciones) p.antecedentes.observaciones = undefined

    return p
  }

  const actualizarTratamiento = (i, field, value) => {
    setFormData(prev => {
      const t = [...prev.tratamientos]
      t[i] = { ...t[i], [field]: value }
      return { ...prev, tratamientos: t }
    })
  }

  const quitarTratamiento = (i) => {
    setFormData(prev => ({
      ...prev,
      tratamientos: prev.tratamientos.filter((_, idx) => idx !== i)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setEnviando(true)
    setError(null)

    if (!formData.motivoConsulta.trim()) {
      setError('El motivo de consulta es obligatorio')
      setEnviando(false)
      return
    }

    const payload = limpiarPayload(formData)

    const result = consultaEdit
      ? await doctorService.actualizarConsulta(pacienteId, consultaEdit._id, payload)
      : await doctorService.agregarConsulta(pacienteId, payload)
    if (result.success) {
      onSuccess()
      onClose()
    } else {
      setError(result.error || 'Error al guardar consulta')
    }
    setEnviando(false)
  }

  const secciones = [
    { id: 'principal', label: 'Motivo y Enf. Actual' },
    { id: 'antecedentes', label: 'Antecedentes' },
    { id: 'signos', label: 'Signos Vitales' },
    { id: 'examen', label: 'Examen Estomatognático' },
    { id: 'salud', label: 'Salud Bucal' },
    { id: 'diagnostico', label: 'Plan Dx y Diagnósticos' },
    { id: 'tratamientos', label: 'Tratamientos' },
  ]

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center pt-6 pb-6 overflow-y-auto"
        onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-4 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-lg font-bold text-gray-900">{consultaEdit ? 'Editar Consulta' : 'Nueva Consulta'}</h2>
              <p className="text-sm text-gray-500 mt-1">
                Paciente: <span className="font-medium text-gray-700">{pacienteNombre}</span>
              </p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <X size={20} className="text-gray-400" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Navegación de secciones */}
            <div className="flex gap-1 px-6 pt-4 pb-2 overflow-x-auto border-b border-gray-100">
              {secciones.map(s => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSeccionActiva(s.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                    seccionActiva === s.id
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {error && (
              <div className="mx-6 mt-3 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2 rounded-lg">
                {error}
              </div>
            )}

            {/* Contenido */}
            <div className="p-6 max-h-[60vh] overflow-y-auto space-y-6">
              {/* ── SECCIÓN PRINCIPAL ── */}
              {seccionActiva === 'principal' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Motivo de Consulta *
                    </label>
                    <textarea
                      value={formData.motivoConsulta}
                      onChange={e => update('motivoConsulta', e.target.value)}
                      rows={2}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                      placeholder="Ej: Dolor molar inferior derecho"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descripción de Enfermedad Actual
                    </label>
                    <textarea
                      value={formData.enfermedadActual.descripcion}
                      onChange={e => update('enfermedadActual.descripcion', e.target.value)}
                      rows={2}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                      placeholder="Ej: Caries profunda en pieza 4.6"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tiempo de Evolución
                      </label>
                      <input
                        type="text"
                        value={formData.enfermedadActual.tiempoEvolucion}
                        onChange={e => update('enfermedadActual.tiempoEvolucion', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                        placeholder="Ej: 3 días"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Intensidad del Dolor (0-10)
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="10"
                        value={formData.enfermedadActual.intensidadDolor}
                        onChange={e => update('enfermedadActual.intensidadDolor', Number(e.target.value))}
                        className="w-full"
                      />
                      <p className="text-xs text-gray-500 text-center">
                        {formData.enfermedadActual.intensidadDolor}/10
                      </p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Síntomas
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={sintomaInput}
                        onChange={e => setSintomaInput(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); agregarSintoma() } }}
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                        placeholder="Escribir síntoma y presionar Enter"
                      />
                      <Button type="button" variant="outline" size="small" onClick={agregarSintoma}>
                        <Plus size={14} className="mr-1" /> Agregar
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {formData.enfermedadActual.sintomas.map((s, i) => (
                        <span key={i} className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full">
                          {s}
                          <button type="button" onClick={() => quitarSintoma(i)} className="hover:text-red-500">
                            <X size={12} />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Observaciones
                    </label>
                    <textarea
                      value={formData.enfermedadActual.observaciones}
                      onChange={e => update('enfermedadActual.observaciones', e.target.value)}
                      rows={2}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                      placeholder="Observaciones adicionales"
                    />
                  </div>
                </div>
              )}

              {/* ── ANTECEDENTES ── */}
              {seccionActiva === 'antecedentes' && (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Alergias</p>
                    <div className="flex gap-4">
                      {Object.keys(formData.antecedentes.alergias).map(key => (
                        <label key={key} className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={formData.antecedentes.alergias[key]}
                            onChange={e => update(`antecedentes.alergias.${key}`, e.target.checked)}
                            className="rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          {key}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Enfermedades</p>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.keys(formData.antecedentes.enfermedades).map(key => (
                        <label key={key} className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={formData.antecedentes.enfermedades[key]}
                            onChange={e => update(`antecedentes.enfermedades.${key}`, e.target.checked)}
                            className="rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          {key === 'hemorragias' ? 'Hemorragias' :
                           key === 'vih' ? 'VIH' :
                           key.charAt(0).toUpperCase() + key.slice(1)}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={formData.antecedentes.otros}
                        onChange={e => update('antecedentes.otros', e.target.checked)}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      Otros antecedentes
                    </label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Observaciones de Antecedentes
                    </label>
                    <textarea
                      value={formData.antecedentes.observaciones}
                      onChange={e => update('antecedentes.observaciones', e.target.value)}
                      rows={2}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                      placeholder="Sin antecedentes de importancia"
                    />
                  </div>
                </div>
              )}

              {/* ── SIGNOS VITALES ── */}
              {seccionActiva === 'signos' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Presión Arterial
                    </label>
                    <input
                      type="text"
                      value={formData.signosVitales.presionArterial}
                      onChange={e => update('signosVitales.presionArterial', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                      placeholder="120/80"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Frecuencia Cardíaca (lpm)
                    </label>
                    <input
                      type="number"
                      value={formData.signosVitales.frecuenciaCardiaca}
                      onChange={e => update('signosVitales.frecuenciaCardiaca', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                      placeholder="72"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Temperatura (°C)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.signosVitales.temperatura}
                      onChange={e => update('signosVitales.temperatura', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                      placeholder="36.5"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Frecuencia Respiratoria (rpm)
                    </label>
                    <input
                      type="number"
                      value={formData.signosVitales.frecuenciaRespiratoria}
                      onChange={e => update('signosVitales.frecuenciaRespiratoria', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                      placeholder="16"
                    />
                  </div>
                </div>
              )}

              {/* ── EXAMEN ESTOMATOGNÁTICO ── */}
              {seccionActiva === 'examen' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {Object.keys(EXAMEN_INITIAL).filter(k => k !== 'observaciones').map(key => (
                      <div key={key} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <SelectorEstado
                            label={key === 'atm' ? 'ATM' : key.charAt(0).toUpperCase() + key.slice(1)}
                            value={formData.examenEstomatognatico[key].estado}
                            onChange={v => update(`examenEstomatognatico.${key}.estado`, v)}
                          />
                          <input
                            type="text"
                            value={formData.examenEstomatognatico[key].observacion}
                            onChange={e => update(`examenEstomatognatico.${key}.observacion`, e.target.value)}
                            className="w-full mt-1 border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary/30"
                            placeholder="Observación"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Observaciones Generales
                    </label>
                    <textarea
                      value={formData.examenEstomatognatico.observaciones}
                      onChange={e => update('examenEstomatognatico.observaciones', e.target.value)}
                      rows={2}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                      placeholder="Paciente colaborador"
                    />
                  </div>
                </div>
              )}

              {/* ── SALUD BUCAL ── */}
              {seccionActiva === 'salud' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    {['placa', 'calculo', 'gingivitis'].map(key => (
                      <div key={key}>
                        <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                          {key === 'calculo' ? 'Cálculo' : key}
                        </label>
                        <select
                          value={formData.indicadoresSaludBucal.higieneOral[key]}
                          onChange={e => update(`indicadoresSaludBucal.higieneOral.${key}`, e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                        >
                          <option value="leve">Leve</option>
                          <option value="moderada">Moderada</option>
                          <option value="severa">Severa</option>
                        </select>
                      </div>
                    ))}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Enfermedad Periodontal
                    </label>
                    <select
                      value={formData.indicadoresSaludBucal.enfermedadPeriodontal}
                      onChange={e => update('indicadoresSaludBucal.enfermedadPeriodontal', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    >
                      <option value="leve">Leve</option>
                      <option value="moderada">Moderada</option>
                      <option value="severa">Severa</option>
                      <option value="">Ninguna</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Maloclusión
                      </label>
                      <select
                        value={formData.indicadoresSaludBucal.maloclusion === null ? 'no' : formData.indicadoresSaludBucal.maloclusion}
                        onChange={e => update('indicadoresSaludBucal.maloclusion', e.target.value === 'no' ? null : e.target.value)}
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
                    <div className="flex gap-4">
                      {['C', 'P', 'O'].map(key => (
                        <div key={key} className="flex-1">
                          <label className="block text-xs text-gray-500 mb-1">{key}</label>
                          <input
                            type="number"
                            min="0"
                            value={formData.indicadoresSaludBucal.indiceCPO[key]}
                            onChange={e => update(`indicadoresSaludBucal.indiceCPO.${key}`, Number(e.target.value))}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── PLAN DX Y DIAGNÓSTICOS ── */}
              {seccionActiva === 'diagnostico' && (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Plan Diagnóstico</p>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      {[
                        { key: 'biometria', label: 'Biometría' },
                        { key: 'quimicaSanguinea', label: 'Química Sanguínea' },
                        { key: 'rayosX', label: 'Rayos X' },
                      ].map(({ key, label }) => (
                        <div key={key} className="bg-gray-50 rounded-lg p-3">
                          <p className="text-xs font-medium text-gray-600 mb-2">{label}</p>
                          {['solicitado', 'realizado', 'pendiente'].map(f => (
                            <label key={f} className="flex items-center gap-2 text-xs mb-1">
                              <input
                                type="checkbox"
                                checked={formData.planDiagnostico[key][f]}
                                onChange={e => update(`planDiagnostico.${key}.${f}`, e.target.checked)}
                                className="rounded border-gray-300 text-primary focus:ring-primary"
                              />
                              {f.charAt(0).toUpperCase() + f.slice(1)}
                            </label>
                          ))}
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Otros estudios
                        </label>
                        <input
                          type="text"
                          value={formData.planDiagnostico.otros}
                          onChange={e => update('planDiagnostico.otros', e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                          placeholder="Otros estudios solicitados"
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Observaciones del Plan
                      </label>
                      <textarea
                        value={formData.planDiagnostico.observaciones}
                        onChange={e => update('planDiagnostico.observaciones', e.target.value)}
                        rows={2}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                        placeholder="Se solicita radiografía periapical"
                      />
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-medium text-gray-700">Diagnósticos</p>
                      <Button type="button" variant="outline" size="small" onClick={agregarDiagnostico}>
                        <Plus size={14} className="mr-1" /> Agregar
                      </Button>
                    </div>
                    {formData.diagnosticos.length === 0 ? (
                      <p className="text-xs text-gray-400">No hay diagnósticos registrados</p>
                    ) : (
                      <div className="space-y-2">
                        {formData.diagnosticos.map((d, i) => (
                          <div key={i} className="flex items-start gap-2 bg-gray-50 rounded-lg p-3">
                            <div className="flex-1 grid grid-cols-3 gap-2">
                              <div className="col-span-1">
                                <input
                                  type="text"
                                  value={d.cie10}
                                  onChange={e => actualizarDiagnostico(i, 'cie10', e.target.value)}
                                  className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary/30"
                                  placeholder="CIE-10"
                                />
                              </div>
                              <div className="col-span-1">
                                <input
                                  type="text"
                                  value={d.descripcion}
                                  onChange={e => actualizarDiagnostico(i, 'descripcion', e.target.value)}
                                  className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary/30"
                                  placeholder="Descripción"
                                />
                              </div>
                              <div className="col-span-1 flex items-center gap-2">
                                <select
                                  value={d.tipo}
                                  onChange={e => actualizarDiagnostico(i, 'tipo', e.target.value)}
                                  className="flex-1 border border-gray-300 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary/30"
                                >
                                  <option value="presuntivo">Presuntivo</option>
                                  <option value="definitivo">Definitivo</option>
                                </select>
                                <button type="button" onClick={() => quitarDiagnostico(i)} className="text-red-400 hover:text-red-600">
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ── TRATAMIENTOS ── */}
              {seccionActiva === 'tratamientos' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-700">Tratamientos</p>
                    <Button type="button" variant="outline" size="small" onClick={agregarTratamiento}>
                      <Plus size={14} className="mr-1" /> Agregar
                    </Button>
                  </div>
                  {formData.tratamientos.length === 0 ? (
                    <p className="text-xs text-gray-400">No hay tratamientos registrados</p>
                  ) : (
                    <div className="space-y-3">
                      {formData.tratamientos.map((t, i) => (
                        <div key={i} className="bg-blue-50 rounded-xl p-4">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-semibold text-blue-700">
                              Sesión {t.sesion}
                            </span>
                            <button type="button" onClick={() => quitarTratamiento(i)} className="text-red-400 hover:text-red-600">
                              <Trash2 size={14} />
                            </button>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Código</label>
                              <input
                                type="text"
                                value={t.codigo}
                                onChange={e => actualizarTratamiento(i, 'codigo', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary/30"
                                placeholder="END001"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Fecha</label>
                              <input
                                type="datetime-local"
                                value={t.fecha}
                                onChange={e => actualizarTratamiento(i, 'fecha', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary/30"
                              />
                            </div>
                          </div>
                          <div className="mt-3">
                            <label className="block text-xs text-gray-500 mb-1">
                              Dx / Complicaciones
                            </label>
                            <input
                              type="text"
                              value={t.diagnosticosComplicaciones}
                              onChange={e => actualizarTratamiento(i, 'diagnosticosComplicaciones', e.target.value)}
                              className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary/30"
                              placeholder="Sin complicaciones"
                            />
                          </div>
                          <div className="mt-3">
                            <label className="block text-xs text-gray-500 mb-1">
                              Procedimientos (separados por coma)
                            </label>
                            <input
                              type="text"
                              value={t.procedimientos.join(', ')}
                              onChange={e => actualizarTratamiento(i, 'procedimientos', e.target.value.split(',').map(s => s.trim()))}
                              className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary/30"
                              placeholder="Endodoncia parcial pieza 4.6"
                            />
                          </div>
                          <div className="mt-3">
                            <label className="block text-xs text-gray-500 mb-1">
                              Prescripciones (separadas por coma)
                            </label>
                            <input
                              type="text"
                              value={t.prescripciones.join(', ')}
                              onChange={e => actualizarTratamiento(i, 'prescripciones', e.target.value.split(',').map(s => s.trim()))}
                              className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary/30"
                              placeholder="Ibuprofeno 400mg cada 8 horas por 5 días"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
              <Button type="button" variant="ghost" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" loading={enviando} disabled={enviando}>
                <Stethoscope size={16} className="mr-2" />
                {consultaEdit ? 'Actualizar Consulta' : 'Guardar Consulta'}
              </Button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default FormularioConsulta
