import React, { useState, useCallback, useEffect, useMemo } from 'react'

const COLOR_MAP = {
  ROJO: '#ef4444',
  AZUL: '#3b82f6',
}

// ── CONSTANTES CLÍNICAS ────────────────────────────────────
const SIMBOLOS_OPCIONES = [
  { key: 'CARIES', label: 'Caries', simbolo: '\u25CF', color: 'rojo', grupo: 'patologia' },
  { key: 'SELLANTE_NECESARIO', label: 'Sellante Necesario', simbolo: '\u00DC', color: 'rojo', grupo: 'patologia' },
  { key: 'EXTRACCION_INDICADA', label: 'Extracci\u00f3n Indicada', simbolo: '\u2715', color: 'rojo', grupo: 'patologia' },
  { key: 'OBTURADO', label: 'Obturado', simbolo: '\u25CF', color: 'azul', grupo: 'tratamiento' },
  { key: 'CORONA', label: 'Corona', simbolo: '\u2501', color: 'azul', grupo: 'tratamiento' },
  { key: 'ENDODONCIA', label: 'Endodoncia', simbolo: '\u00A8', color: 'neutro', grupo: 'tratamiento' },
  { key: 'SELLANTE_REALIZADO', label: 'Sellante Realizado', simbolo: 'U', color: 'azul', grupo: 'tratamiento' },
  { key: 'PROTESIS_FIJA', label: 'Pr\u00f3tesis Fija', simbolo: '\u2501', color: 'neutro', grupo: 'tratamiento' },
  { key: 'PROTESIS_REMOVIBLE', label: 'Pr\u00f3tesis Removible', simbolo: '\u2550', color: 'neutro', grupo: 'tratamiento' },
  { key: 'PROTESIS_TOTAL', label: 'Pr\u00f3tesis Total', simbolo: '\u00AA', color: 'neutro', grupo: 'tratamiento' },
  { key: 'PERDIDA_POR_CARIES', label: 'P\u00e9rdida por Caries', simbolo: '\u2715', color: 'azul', grupo: 'perdida' },
  { key: 'PERDIDA_OTRA_CAUSA', label: 'P\u00e9rdida Otra Causa', simbolo: '\u2014', color: 'neutro', grupo: 'perdida' },
]

const SIMBOLOS_PATOLOGIA = ['CARIES', 'SELLANTE_NECESARIO', 'EXTRACCION_INDICADA']
const SIMBOLOS_TRATAMIENTO = ['OBTURADO', 'CORONA', 'ENDODONCIA', 'SELLANTE_REALIZADO', 'PROTESIS_FIJA', 'PROTESIS_REMOVIBLE', 'PROTESIS_TOTAL']
const SIMBOLOS_PERDIDA = ['PERDIDA_POR_CARIES', 'PERDIDA_OTRA_CAUSA']

const PRIORIDAD_SIMBOLO = [
  'EXTRACCION_INDICADA', 'PERDIDA_POR_CARIES', 'PERDIDA_OTRA_CAUSA',
  'ENDODONCIA', 'SELLANTE_NECESARIO', 'SELLANTE_REALIZADO',
  'PROTESIS_TOTAL', 'PROTESIS_FIJA', 'PROTESIS_REMOVIBLE', 'CORONA',
]

const SIMBOLO_CHAR = {
  'EXTRACCION_INDICADA': '\u2715',
  'PERDIDA_POR_CARIES': '\u2715',
  'PERDIDA_OTRA_CAUSA': '\u2014',
  'ENDODONCIA': '\u00A8',
  'SELLANTE_NECESARIO': '\u00DC',
  'SELLANTE_REALIZADO': 'U',
  'PROTESIS_TOTAL': '\u00AA',
  'PROTESIS_FIJA': '\u2501',
  'PROTESIS_REMOVIBLE': '\u2550',
  'CORONA': '\u2501',
}

const SIMBOLO_COLOR_CLS = {
  'EXTRACCION_INDICADA': 'text-red-600',
  'PERDIDA_POR_CARIES': 'text-blue-600',
  'PERDIDA_OTRA_CAUSA': 'text-gray-500',
  'ENDODONCIA': 'text-gray-800',
  'SELLANTE_NECESARIO': 'text-red-600',
  'SELLANTE_REALIZADO': 'text-blue-600',
  'PROTESIS_TOTAL': 'text-gray-800',
  'PROTESIS_FIJA': 'text-gray-800',
  'PROTESIS_REMOVIBLE': 'text-gray-800',
  'CORONA': 'text-blue-600',
}

const OPCIONES_RECESION = [
  { value: null, label: '\u2014' },
  { value: '0', label: 'Grado 0' },
  { value: 'I', label: 'I' },
  { value: 'II', label: 'II' },
  { value: 'III', label: 'III' },
]

const OPCIONES_MOVILIDAD = [
  { value: null, label: '\u2014' },
  { value: '0', label: 'Grado 0' },
  { value: 'I', label: 'Grado I' },
  { value: 'II', label: 'Grado II' },
  { value: 'III', label: 'Grado III' },
]

// ── HELPERS ────────────────────────────────────────────────
const migrarSuperficie = (s) => {
  if (s === null || s === undefined) {
    return { color: null, tratamiento: null, patologia: null, simbolos: [] }
  }
  if (typeof s === 'string') {
    if (s === 'ROJO') return { color: 'ROJO', tratamiento: null, patologia: 'CARIES', simbolos: ['CARIES'] }
    if (s === 'AZUL') return { color: 'AZUL', tratamiento: 'OBTURADO', patologia: null, simbolos: ['OBTURADO'] }
    return { color: null, tratamiento: null, patologia: null, simbolos: [] }
  }
  return {
    color: s.color || null,
    tratamiento: s.tratamiento || null,
    patologia: s.patologia || null,
    simbolos: s.simbolos || [],
  }
}

const determinarColor = (simbolos) => {
  if (simbolos.some(s => SIMBOLOS_PATOLOGIA.includes(s))) return 'ROJO'
  if (simbolos.some(s => [...SIMBOLOS_TRATAMIENTO, ...SIMBOLOS_PERDIDA].includes(s))) return 'AZUL'
  return null
}

const determinarPatologia = (simbolos) => simbolos.find(s => SIMBOLOS_PATOLOGIA.includes(s)) || null
const determinarTratamiento = (simbolos) => simbolos.find(s => SIMBOLOS_TRATAMIENTO.includes(s)) || null

const obtenerSimboloPrioritario = (simbolos) => {
  if (!simbolos || simbolos.length === 0) return null
  for (const p of PRIORIDAD_SIMBOLO) {
    if (simbolos.includes(p)) return p
  }
  return null
}

const ESTADO_A_SIMBOLO = {
  CARIES: 'CARIES',
  SELLANTE_NECESARIO: 'SELLANTE_NECESARIO',
  EXTRACCION_INDICADA: 'EXTRACCION_INDICADA',
  OBTURADO: 'OBTURADO',
  CORONA: 'CORONA',
  ENDODONCIA: 'ENDODONCIA',
  SELLANTE_REALIZADO: 'SELLANTE_REALIZADO',
  PROTESIS_FIJA: 'PROTESIS_FIJA',
  PROTESIS_REMOVIBLE: 'PROTESIS_REMOVIBLE',
  PROTESIS_TOTAL: 'PROTESIS_TOTAL',
  PERDIDA_POR_CARIES: 'PERDIDA_POR_CARIES',
  PERDIDA_OTRA_CAUSA: 'PERDIDA_OTRA_CAUSA',
}

const HCU_TO_BACKEND = {
  arriba: 'V',
  abajo: 'L',
  izquierda: 'M',
  derecha: 'D',
  centro: 'O',
}

const ESTADOS_POR_SUPERFICIE = ['SANO', 'CARIES', 'OBTURADO', 'SELLANTE_REALIZADO', 'SELLANTE_NECESARIO']
const ESTADOS_DIENTE_COMPLETO = [
  'ENDODONCIA',
  'CORONA',
  'EXTRACCION_INDICADA',
  'PERDIDA_POR_CARIES',
  'PERDIDA_OTRA_CAUSA',
  'PROTESIS_FIJA',
  'PROTESIS_REMOVIBLE',
  'PROTESIS_TOTAL',
]

const adaptarSuperficieBackend = (superficie) => {
  const estado = superficie?.estado || 'SANO'
  const simbolo = ESTADO_A_SIMBOLO[estado]
  const simbolos = simbolo ? [simbolo] : []

  return {
    color: determinarColor(simbolos),
    tratamiento: determinarTratamiento(simbolos),
    patologia: determinarPatologia(simbolos),
    simbolos,
  }
}

const superficiesBackendAHCU = (superficies = {}) => ({
  arriba: adaptarSuperficieBackend(superficies.V),
  abajo: adaptarSuperficieBackend(superficies.L || superficies.P),
  izquierda: adaptarSuperficieBackend(superficies.M),
  derecha: adaptarSuperficieBackend(superficies.D),
  centro: adaptarSuperficieBackend(superficies.O),
})

export const superficiesHCUABackend = (diente, superficiesHCU = {}) => {
  const superficies = {
    M: diente.superficies?.M || { estado: 'SANO', observacion: '' },
    D: diente.superficies?.D || { estado: 'SANO', observacion: '' },
    O: diente.superficies?.O || { estado: 'SANO', observacion: '' },
    V: diente.superficies?.V || { estado: 'SANO', observacion: '' },
    L: diente.superficies?.L || { estado: 'SANO', observacion: '' },
    P: diente.superficies?.P || { estado: 'SANO', observacion: '' },
  }

  Object.entries(HCU_TO_BACKEND).forEach(([hcuKey, backendKey]) => {
    const hcu = superficiesHCU[hcuKey] || {}
    const estado = hcu.patologia || hcu.tratamiento || hcu.simbolos?.[0] || 'SANO'
    superficies[backendKey] = {
      ...superficies[backendKey],
      estado,
    }
  })

  return superficies
}

export const calcularEstadoGeneralBackend = (superficies = {}) => {
  const estados = Object.values(superficies).map((s) => s?.estado).filter(Boolean)
  if (estados.some((estado) => SIMBOLOS_PATOLOGIA.includes(estado))) return 'CARIES'
  if (estados.some((estado) => [...SIMBOLOS_TRATAMIENTO, ...SIMBOLOS_PERDIDA].includes(estado))) return 'OBTURADO'
  return 'SANO'
}

export const crearPayloadCambioHCU = (diente, superficieHCU, estadoHCU) => {
  const simbolo = estadoHCU?.patologia || estadoHCU?.tratamiento || estadoHCU?.simbolos?.[0] || 'SANO'
  const backendKey = HCU_TO_BACKEND[superficieHCU]

  if (ESTADOS_POR_SUPERFICIE.includes(simbolo) && backendKey) {
    return {
      superficies: {
        [backendKey]: {
          ...(diente.superficies?.[backendKey] || { observacion: '' }),
          estado: simbolo,
        },
      },
    }
  }

  if (ESTADOS_DIENTE_COMPLETO.includes(simbolo)) {
    return { estadoGeneral: simbolo }
  }

  return { estadoGeneral: 'SANO' }
}

const ORDEN_CUADRANTES = {
  superior: [
    { label: 'Sup. Izq', cuadrante: 2 },
    { label: 'Sup. Der', cuadrante: 1 },
  ],
  inferior: [
    { label: 'Inf. Izq', cuadrante: 3 },
    { label: 'Inf. Der', cuadrante: 4 },
  ],
  temporalSuperior: [
    { label: 'Temp. Sup. Izq', cuadrante: 6 },
    { label: 'Temp. Sup. Der', cuadrante: 5 },
  ],
  temporalInferior: [
    { label: 'Temp. Inf. Izq', cuadrante: 7 },
    { label: 'Temp. Inf. Der', cuadrante: 8 },
  ],
}

const ORDEN_HCU = {
  superiorPermanente: ['18', '17', '16', '15', '14', '13', '12', '11', '21', '22', '23', '24', '25', '26', '27', '28'],
  temporalSuperior: ['55', '54', '53', '52', '51', '61', '62', '63', '64', '65'],
  temporalInferior: ['85', '84', '83', '82', '81', '71', '72', '73', '74', '75'],
  inferiorPermanente: ['48', '47', '46', '45', '44', '43', '42', '41', '31', '32', '33', '34', '35', '36', '37', '38'],
}

const obtenerCuadrante = (diente) => diente.visual?.cuadrante || parseInt(diente.codigoFDI?.[0]) || 0
const obtenerPosicion = (diente) => diente.visual?.posicion || parseInt(diente.codigoFDI?.[1]) || 0

const clonarEstadoSuperficie = (superficie) => ({
  color: superficie?.color || null,
  tratamiento: superficie?.tratamiento || null,
  patologia: superficie?.patologia || null,
  simbolos: [...(superficie?.simbolos || [])],
})

const clonarSuperficiesHCU = (superficies = {}) => {
  const clon = {}
  for (const key of ['arriba', 'abajo', 'izquierda', 'derecha', 'centro']) {
    clon[key] = clonarEstadoSuperficie(superficies[key])
  }
  return clon
}

const obtenerSuperficiesHCUDeDiente = (diente) => {
  const raw = diente.superficies || diente.superficiesClasico || {}
  if (diente.superficies) return clonarSuperficiesHCU(superficiesBackendAHCU(raw))

  const superficies = {}
  for (const k of ['arriba', 'abajo', 'izquierda', 'derecha', 'centro']) {
    superficies[k] = clonarEstadoSuperficie(migrarSuperficie(raw[k]))
  }
  return superficies
}

// ── TOOTH COMPONENTS ───────────────────────────────────────
const ToothSquare = ({ superficies, onAbrirSelector, bloqueado = false }) => {
  const sup = (name) => migrarSuperficie(superficies?.[name])

  const handleClick = (e, name) => {
    e.stopPropagation()
    if (bloqueado || !onAbrirSelector) return
    const rect = e.currentTarget.getBoundingClientRect()
    onAbrirSelector({
      superficie: name,
      posicion: { x: rect.left, y: rect.bottom + 2 },
      simbolosActuales: sup(name).simbolos,
    })
  }

  const supProps = (name) => ({
    onClick: (e) => handleClick(e, name),
  })

  const bgStyle = (name) => ({ backgroundColor: sup(name).color ? COLOR_MAP[sup(name).color] : 'transparent' })
  const baseCls = `${bloqueado ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:opacity-80'} border-black relative`

  const renderCentro = () => {
    const s = sup('centro')
    const simboloKey = obtenerSimboloPrioritario(s.simbolos)
    return (
      <div {...supProps('centro')} className={`${baseCls} flex items-center justify-center`} style={bgStyle('centro')}>
        {simboloKey && (
          <span className={`text-[7px] font-bold leading-none ${SIMBOLO_COLOR_CLS[simboloKey]}`}>
            {SIMBOLO_CHAR[simboloKey]}
          </span>
        )}
      </div>
    )
  }

  return (
    <div className="inline-grid grid-rows-[8px_1fr_8px] w-[26px] h-[36px] border border-black overflow-hidden relative">
      {sup('arriba').simbolos.includes('CORONA') && (
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-blue-500 z-10" />
      )}
      <div {...supProps('arriba')} className={`${baseCls} border-b border-black`} style={bgStyle('arriba')} />
      <div className="grid grid-cols-[8px_1fr_8px]">
        <div {...supProps('izquierda')} className={`${baseCls} border-r border-black`} style={bgStyle('izquierda')} />
        {renderCentro()}
        <div {...supProps('derecha')} className={`${baseCls} border-l border-black`} style={bgStyle('derecha')} />
      </div>
      <div {...supProps('abajo')} className={`${baseCls} border-t border-black`} style={bgStyle('abajo')} />
    </div>
  )
}

const ToothCircle = ({ superficies, onAbrirSelector, bloqueado = false }) => {
  const sup = (name) => migrarSuperficie(superficies?.[name])
  const fill = (name) => (sup(name).color ? COLOR_MAP[sup(name).color] : 'transparent')

  const handleClick = (e, name) => {
    e.stopPropagation()
    if (bloqueado || !onAbrirSelector) return
    const rect = e.currentTarget.getBoundingClientRect()
    onAbrirSelector({
      superficie: name,
      posicion: { x: rect.left, y: rect.bottom + 2 },
      simbolosActuales: sup(name).simbolos,
    })
  }

  const sectorProps = (name) => ({
    style: { cursor: bloqueado ? 'not-allowed' : 'pointer', opacity: bloqueado ? 0.6 : 1 },
    onClick: (e) => handleClick(e, name),
  })

  return (
    <div className="w-[26px] h-[26px]">
      <svg viewBox="0 0 44 44" width="26" height="26">
        <path d="M22,2 A20,20 0 0,1 42,22 L22,22 Z" fill={fill('arriba')} stroke="#000" strokeWidth="1" {...sectorProps('arriba')} />
        <path d="M42,22 A20,20 0 0,1 22,42 L22,22 Z" fill={fill('derecha')} stroke="#000" strokeWidth="1" {...sectorProps('derecha')} />
        <path d="M22,42 A20,20 0 0,1 2,22 L22,22 Z" fill={fill('abajo')} stroke="#000" strokeWidth="1" {...sectorProps('abajo')} />
        <path d="M2,22 A20,20 0 0,1 22,2 L22,22 Z" fill={fill('izquierda')} stroke="#000" strokeWidth="1" {...sectorProps('izquierda')} />
        <circle cx="22" cy="22" r="7" fill={fill('centro')} stroke="#000" strokeWidth="1" {...sectorProps('centro')} />
      </svg>
    </div>
  )
}

const RendTooth = ({ diente, superficiesMap, onAbrirSelector, esTemporal, bloqueado = false }) => {
  const ToothComp = esTemporal ? ToothCircle : ToothSquare
  return (
    <div className="flex items-center justify-center" title={bloqueado ? 'No editable para este tipo de dentición' : ''}>
      <ToothComp
        superficies={superficiesMap[diente._id] || {}}
        onAbrirSelector={onAbrirSelector ? (data) => onAbrirSelector(diente, data) : undefined}
        bloqueado={bloqueado}
      />
    </div>
  )
}

// ── SELECTOR CLÍNICO (superficies) ─────────────────────────
const GRUPOS_SELECTOR = [
  { key: 'patologia', label: 'Patolog\u00edas', colorCls: 'text-red-700', bgCls: 'hover:bg-red-50' },
  { key: 'tratamiento', label: 'Tratamientos', colorCls: 'text-blue-700', bgCls: 'hover:bg-blue-50' },
  { key: 'perdida', label: 'P\u00e9rdidas', colorCls: 'text-gray-700', bgCls: 'hover:bg-gray-50' },
]

const SelectorClinico = ({ posicion, diente, superficie, simbolosActuales, onAccept, onClose, modo = 'flotante' }) => {
  const [seleccionados, setSeleccionados] = useState(simbolosActuales || [])

  const toggle = (key) => {
    setSeleccionados(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    )
  }

  useEffect(() => {
    if (modo === 'panel') return undefined
    const handleClick = (e) => {
      if (!e.target.closest('[data-selector-clinico]')) {
        onClose()
      }
    }
    const timer = setTimeout(() => document.addEventListener('click', handleClick), 0)
    return () => { clearTimeout(timer); document.removeEventListener('click', handleClick) }
  }, [onClose, modo])

  const handleAccept = () => {
    onAccept({
      color: determinarColor(seleccionados),
      tratamiento: determinarTratamiento(seleccionados),
      patologia: determinarPatologia(seleccionados),
      simbolos: seleccionados,
    })
  }

  const popX = posicion ? Math.min(posicion.x, window.innerWidth - 300) : 0
  const popY = posicion ? Math.min(posicion.y, window.innerHeight - 360) : 0

  const renderOpcion = (item) => {
    const activo = seleccionados.includes(item.key)
    const bgCls = item.color === 'rojo' ? 'bg-red-100' : item.color === 'azul' ? 'bg-blue-100' : 'bg-gray-100'
    const textoCls = item.color === 'rojo' ? 'text-red-600' : item.color === 'azul' ? 'text-blue-600' : 'text-gray-800'
    return (
      <button
        key={item.key}
        onClick={() => toggle(item.key)}
        className={`flex w-full items-center gap-1.5 rounded-lg border px-2 py-1 text-left text-[10px] transition-all ${
          activo ? 'border-primary bg-primary/5 shadow-sm' : 'border-transparent hover:bg-gray-50'
        }`}
      >
        <span className={`inline-flex h-5 w-5 items-center justify-center rounded-md border border-gray-200 text-[10px] font-black leading-none ${textoCls} ${bgCls}`}>
          {item.simbolo}
        </span>
        <span className="flex-1 font-medium text-gray-700">{item.label}</span>
        {activo && <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[8px] font-bold text-white">\u2713</span>}
      </button>
    )
  }

  return (
    <div
      data-selector-clinico
      className={`${modo === 'panel' ? 'sticky top-4 w-full' : 'fixed z-[9999]'} overflow-hidden rounded-2xl border border-secondary/30 bg-white shadow-2xl`}
      style={modo === 'panel' ? undefined : { left: `${popX}px`, top: `${popY}px`, width: '290px' }}
    >
      <div className="flex items-center justify-between bg-gradient-to-r from-primary to-secondary px-3 py-2 text-white">
        <div>
          <p className="text-xs font-bold leading-tight">Diente {diente.codigoFDI}</p>
          <p className="text-[10px] font-medium text-white/85">{superficie.charAt(0).toUpperCase() + superficie.slice(1)}</p>
        </div>
        <button onClick={onClose} className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/15 text-xs font-bold text-white transition hover:bg-white/25">\u2715</button>
      </div>

      {GRUPOS_SELECTOR.map(grupo => {
        const items = SIMBOLOS_OPCIONES.filter(o => o.grupo === grupo.key)
        if (items.length === 0) return null
        return (
          <div key={grupo.key} className="border-b border-gray-100 px-2 py-1.5 last:border-b-0">
            <div className={`mb-0.5 text-[9px] font-bold uppercase tracking-wide ${grupo.colorCls}`}>
              {grupo.label}
            </div>
            <div className="space-y-0.5">
              {items.map(renderOpcion)}
            </div>
          </div>
        )
      })}

      <div className="flex gap-1.5 border-t border-gray-100 bg-light-bg/60 p-2">
        <button
          onClick={handleAccept}
          className="flex-1 rounded-lg bg-primary px-2 py-1.5 text-[10px] font-bold text-white shadow-sm transition hover:bg-primary/90"
        >
          Aceptar
        </button>
        <button
          onClick={() => onAccept({
            color: null,
            tratamiento: null,
            patologia: null,
            simbolos: [],
          })}
          className="rounded-lg bg-white px-2 py-1.5 text-[10px] font-bold text-gray-600 ring-1 ring-gray-200 transition hover:bg-gray-50"
        >
          Limpiar
        </button>
        <button
          onClick={onClose}
          className="rounded-lg bg-gray-100 px-2 py-1.5 text-[10px] font-medium text-gray-500 transition hover:bg-gray-200"
        >
          Cancelar
        </button>
      </div>
    </div>
  )
}

// ── INLINE SELECTOR (recesión / movilidad) ─────────────────
const InlineSelector = ({ posicion, opciones, onSelect, onClose }) => {
  useEffect(() => {
    const handleClick = (e) => {
      if (!e.target.closest('[data-inline-selector]')) {
        onClose()
      }
    }
    const timer = setTimeout(() => document.addEventListener('click', handleClick), 0)
    return () => { clearTimeout(timer); document.removeEventListener('click', handleClick) }
  }, [onClose])

  const popX = Math.min(posicion.x, window.innerWidth - 130)
  const popY = Math.min(posicion.y, window.innerHeight - 200)

  return (
    <div
      data-inline-selector
      className="fixed z-[9999] overflow-hidden rounded-xl border border-secondary/30 bg-white shadow-xl"
      style={{ left: `${popX}px`, top: `${popY}px`, width: '140px' }}
    >
      {opciones.map((opt) => (
        <button
          key={String(opt.value)}
          onClick={() => { onSelect(opt.value); onClose() }}
          className="block w-full border-b border-gray-100 px-3 py-2 text-left text-xs font-medium text-gray-700 transition hover:bg-secondary/10 last:border-0"
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

// ── ARCH SECTION ───────────────────────────────────────────
const ArchSection = ({ titulo, cuadrantes, dientesPorCuadrante, superficiesMap, datosPorDiente, onAbrirSelector, onDienteClickValor, esTemporal, mostrarRecesionMovilidad }) => {
  const izq = cuadrantes[0]
  const der = cuadrantes[1]

  const isLeftQuadrant = (q) => q === 2 || q === 3 || q === 6 || q === 7
  const isRightQuadrant = (q) => q === 1 || q === 4 || q === 5 || q === 8

  const dientesIzq = (dientesPorCuadrante[izq.cuadrante] || [])
    .slice()
    .sort((a, b) => (isLeftQuadrant(izq.cuadrante) ? obtenerPosicion(b) - obtenerPosicion(a) : obtenerPosicion(a) - obtenerPosicion(b)))

  const dientesDer = (dientesPorCuadrante[der.cuadrante] || [])
    .slice()
    .sort((a, b) => (isRightQuadrant(der.cuadrante) ? obtenerPosicion(a) - obtenerPosicion(b) : obtenerPosicion(b) - obtenerPosicion(a)))

  const totalIzq = Math.max(dientesIzq.length, 8)
  const totalDer = Math.max(dientesDer.length, 8)
  const GRID_COLS = `52px repeat(${totalIzq}, minmax(26px, 1fr)) 6px repeat(${totalDer}, minmax(26px, 1fr)) 52px`

  const labelCls = 'flex items-center text-[9px] font-bold text-gray-700 uppercase border-r border-black bg-blue-100 px-1'
  const labelClsR = 'flex items-center justify-end text-[9px] font-bold text-gray-700 uppercase border-l border-black bg-blue-100 px-1'

  const renderFDI = (d) => (
    <div key={d._id} className="flex items-center justify-center py-px">
      <span className="text-[8px] font-bold font-mono text-gray-600">{d.codigoFDI}</span>
    </div>
  )

  const renderLingual = (d) => {
    const s = migrarSuperficie(superficiesMap[d._id]?.abajo)
    const c = s.color === 'ROJO' ? 'bg-red-500' : s.color === 'AZUL' ? 'bg-blue-500' : 'bg-transparent'
    return (
      <div key={d._id} className="flex items-center justify-center py-px">
        <span className={`inline-block w-2 h-2 rounded-full border border-black ${c}`} />
      </div>
    )
  }

  const renderValor = (d, field) => {
    const val = datosPorDiente?.[d._id]?.[field]
    return (
      <div
        key={d._id}
        className="flex items-center justify-center py-px text-[8px] text-gray-600 font-mono cursor-pointer hover:bg-gray-100"
        onClick={(e) => {
          e.stopPropagation()
          const rect = e.currentTarget.getBoundingClientRect()
          onDienteClickValor(d, field, { x: rect.left, y: rect.bottom + 2 })
        }}
      >
        {val != null ? val : '\u2014'}
      </div>
    )
  }

  const renderToothCell = (d) => (
    <RendTooth key={d._id} diente={d} superficiesMap={superficiesMap} onAbrirSelector={onAbrirSelector} esTemporal={esTemporal} />
  )

  return (
    <div className="mb-1">
      {titulo && (
        <div className="bg-purple-800 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 border border-black">
          {titulo}
        </div>
      )}
      <div className="border border-black bg-blue-50">
        <div style={{ gridTemplateColumns: GRID_COLS }} className="grid border-b border-black">
          <div className={labelCls}>DIENTE</div>
          {dientesIzq.map(renderFDI)}
          <div className="bg-blue-100" />
          {dientesDer.map(renderFDI)}
          <div className={labelClsR}>DIENTE</div>
        </div>

        <div style={{ gridTemplateColumns: GRID_COLS }} className="grid border-b border-black">
          <div className={`${labelCls} h-[36px]`}>VESTIB</div>
          {dientesIzq.map(renderToothCell)}
          <div className="bg-blue-100" />
          {dientesDer.map(renderToothCell)}
          <div className={`${labelClsR} h-[36px]`} />
        </div>

        <div style={{ gridTemplateColumns: GRID_COLS }} className="grid border-b border-black">
          <div className={labelCls}>LINGUAL</div>
          {dientesIzq.map(renderLingual)}
          <div className="bg-blue-100" />
          {dientesDer.map(renderLingual)}
          <div className={labelClsR} />
        </div>

        {mostrarRecesionMovilidad && (
          <>
            <div style={{ gridTemplateColumns: GRID_COLS }} className="grid border-b border-black">
              <div className={labelCls}>RECESI\u00d3N</div>
              {dientesIzq.map((d) => renderValor(d, 'recesion'))}
              <div className="bg-blue-100" />
              {dientesDer.map((d) => renderValor(d, 'recesion'))}
              <div className={labelClsR} />
            </div>

            <div style={{ gridTemplateColumns: GRID_COLS }} className="grid">
              <div className={labelCls}>MOVILIDAD</div>
              {dientesIzq.map((d) => renderValor(d, 'movilidad'))}
              <div className="bg-blue-100" />
              {dientesDer.map((d) => renderValor(d, 'movilidad'))}
              <div className={labelClsR} />
            </div>
          </>
        )}
      </div>
    </div>
  )
}

const HcuCell = ({ children, className = '' }) => (
  <div className={`flex items-center justify-center min-h-[22px] ${className}`}>
    {children}
  </div>
)

const HcuLabel = ({ children }) => (
  <div className="flex items-center justify-end pr-2 text-[10px] font-black uppercase text-black">
    {children}
  </div>
)

const HcuFilaValores = ({ label, orden, dientesPorCodigo, datosPorDiente, field, onDienteClickValor, bloqueado = false }) => (
  <div className="grid items-center gap-x-3" style={{ gridTemplateColumns: '78px repeat(8, 32px) 52px repeat(8, 32px)' }}>
    <HcuLabel>{label}</HcuLabel>
    {orden.map((codigo, index) => {
      const diente = dientesPorCodigo.get(codigo)
      const value = diente ? datosPorDiente?.[diente._id]?.[field] : null
      return (
        <React.Fragment key={`${field}-${codigo}`}>
          {index === 8 && <div />}
          <button
            type="button"
            className="w-[31px] h-[17px] bg-white border border-black text-[9px] font-bold hover:bg-gray-50"
            onClick={(e) => {
              if (!diente || bloqueado) return
              e.stopPropagation()
              const rect = e.currentTarget.getBoundingClientRect()
              onDienteClickValor(diente, field, { x: rect.left, y: rect.bottom + 2 })
            }}
          >
            {value || ''}
          </button>
        </React.Fragment>
      )
    })}
  </div>
)

const HcuFilaPermanentes = ({ label, orden, dientesPorCodigo, superficiesMap, onAbrirSelector, bloqueado = false }) => (
  <div className="grid items-center gap-x-3" style={{ gridTemplateColumns: '78px repeat(8, 32px) 52px repeat(8, 32px)' }}>
    <HcuLabel>{label}</HcuLabel>
    {orden.map((codigo, index) => {
      const diente = dientesPorCodigo.get(codigo)
      return (
        <React.Fragment key={`hcu-perm-${codigo}`}>
          {index === 8 && <div />}
          <HcuCell className="flex-col gap-0.5">
            <span className="text-[10px] font-black leading-none">{codigo}</span>
            {diente ? (
              <RendTooth diente={diente} superficiesMap={superficiesMap} onAbrirSelector={onAbrirSelector} esTemporal={false} bloqueado={bloqueado} />
            ) : (
              <div className="w-[26px] h-[36px]" />
            )}
          </HcuCell>
        </React.Fragment>
      )
    })}
  </div>
)

const HcuFilaTemporales = ({ orden, dientesPorCodigo, superficiesMap, onAbrirSelector, numeroAbajo = false, bloqueado = false }) => (
  <div className="grid items-center gap-x-3" style={{ gridTemplateColumns: '78px repeat(5, 32px) 148px repeat(5, 32px)' }}>
    <div />
    {orden.map((codigo, index) => {
      const diente = dientesPorCodigo.get(codigo)
      const placeholder = { _id: `placeholder-${codigo}`, codigoFDI: codigo }
      return (
        <React.Fragment key={`hcu-temp-${codigo}`}>
          {index === 5 && <div />}
          <HcuCell className="flex-col gap-0.5">
            {!numeroAbajo && <span className="text-[10px] font-black leading-none">{codigo}</span>}
            <RendTooth
              diente={diente || placeholder}
              superficiesMap={diente ? superficiesMap : {}}
              onAbrirSelector={diente ? onAbrirSelector : undefined}
              esTemporal={true}
              bloqueado={bloqueado || !diente}
            />
            {numeroAbajo && <span className="text-[10px] font-black leading-none">{codigo}</span>}
          </HcuCell>
        </React.Fragment>
      )
    })}
  </div>
)

const HcuOdontogramaLayout = ({ odontograma, superficiesMap, datosPorDiente, onAbrirSelector, onDienteClickValor }) => {
  const dientesPorCodigo = useMemo(() => {
    const map = new Map()
    odontograma.dientes.forEach((diente) => map.set(String(diente.codigoFDI), diente))
    return map
  }, [odontograma.dientes])

  const mostrarTemporalesHcu = true
  const tienePerm = odontograma.tipoDenticion !== 'temporal'
  const bloquearPermanentes = odontograma.tipoDenticion === 'temporal'
  const bloquearTemporales = odontograma.tipoDenticion === 'permanente'

  return (
    <div className="min-w-[950px] overflow-hidden rounded-2xl border border-secondary/30 bg-gradient-to-br from-secondary/10 via-white to-primary/5 shadow-sm">
      <div className="border-b border-secondary/20 bg-white/85 px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-gray-600">
          <span className="font-semibold text-gray-800">
            Selecciona una superficie dental para registrar hallazgos o tratamientos.
          </span>
          <span className="rounded-full bg-secondary/10 px-3 py-1 font-medium text-gray-700">
            Recesión y movilidad: elige el grado desde cada casilla.
          </span>
        </div>
      </div>

      <div className="px-4 py-4 space-y-1">
        {tienePerm && (
          <>
            <HcuFilaValores label="Recesión" orden={ORDEN_HCU.superiorPermanente} dientesPorCodigo={dientesPorCodigo} datosPorDiente={datosPorDiente} field="recesion" onDienteClickValor={onDienteClickValor} bloqueado={bloquearPermanentes} />
            <HcuFilaValores label="Movilidad" orden={ORDEN_HCU.superiorPermanente} dientesPorCodigo={dientesPorCodigo} datosPorDiente={datosPorDiente} field="movilidad" onDienteClickValor={onDienteClickValor} bloqueado={bloquearPermanentes} />
            <HcuFilaPermanentes label="Vestibular" orden={ORDEN_HCU.superiorPermanente} dientesPorCodigo={dientesPorCodigo} superficiesMap={superficiesMap} onAbrirSelector={onAbrirSelector} bloqueado={bloquearPermanentes} />
          </>
        )}

        <div className={mostrarTemporalesHcu ? 'pt-3 pb-0.5' : 'pt-4'}>
          {mostrarTemporalesHcu && (
            <HcuFilaTemporales orden={ORDEN_HCU.temporalSuperior} dientesPorCodigo={dientesPorCodigo} superficiesMap={superficiesMap} onAbrirSelector={onAbrirSelector} bloqueado={bloquearTemporales} />
          )}
        </div>
        <div className="grid items-center gap-x-3 min-h-[22px]" style={{ gridTemplateColumns: '78px 1fr' }}>
          <HcuLabel>Lingual</HcuLabel>
          <div />
        </div>
        {mostrarTemporalesHcu && (
          <div className="pt-0.5">
            <HcuFilaTemporales orden={ORDEN_HCU.temporalInferior} dientesPorCodigo={dientesPorCodigo} superficiesMap={superficiesMap} onAbrirSelector={onAbrirSelector} numeroAbajo={true} bloqueado={bloquearTemporales} />
          </div>
        )}

        {tienePerm && (
          <div className={mostrarTemporalesHcu ? 'pt-4 space-y-1' : 'pt-2 space-y-1'}>
            <HcuFilaPermanentes label="Vestibular" orden={ORDEN_HCU.inferiorPermanente} dientesPorCodigo={dientesPorCodigo} superficiesMap={superficiesMap} onAbrirSelector={onAbrirSelector} bloqueado={bloquearPermanentes} />
            <HcuFilaValores label="Movilidad" orden={ORDEN_HCU.inferiorPermanente} dientesPorCodigo={dientesPorCodigo} datosPorDiente={datosPorDiente} field="movilidad" onDienteClickValor={onDienteClickValor} bloqueado={bloquearPermanentes} />
            <HcuFilaValores label="Recesión" orden={ORDEN_HCU.inferiorPermanente} dientesPorCodigo={dientesPorCodigo} datosPorDiente={datosPorDiente} field="recesion" onDienteClickValor={onDienteClickValor} bloqueado={bloquearPermanentes} />
          </div>
        )}
      </div>
    </div>
  )
}

// ── SIMBOLOGÍA ────────────────────────────────────────────
const SIMBOLOGIA_ITEMS = [
  { simbolo: '\u25CF', label: 'Caries', color: 'text-red-600', bg: 'bg-red-500', tipo: 'rojo' },
  { simbolo: '\u25CF', label: 'Obturado', color: 'text-blue-600', bg: 'bg-blue-500', tipo: 'azul' },
  { simbolo: '\u00DC', label: 'Sellante Necesario', color: 'text-red-600', bg: 'bg-red-100', tipo: 'rojo' },
  { simbolo: 'U', label: 'Sellante Realizado', color: 'text-blue-600', bg: 'bg-blue-100', tipo: 'azul' },
  { simbolo: '\u00A8', label: 'Endodoncia', color: 'text-gray-900', bg: 'bg-yellow-50', tipo: 'neutro' },
  { simbolo: '\u2501', label: 'Corona', color: 'text-blue-600', bg: 'bg-blue-100', tipo: 'azul' },
  { simbolo: '\u2501', label: 'Pr\u00f3tesis Fija', color: 'text-gray-800', bg: 'bg-gray-100', tipo: 'neutro' },
  { simbolo: '\u2550', label: 'Pr\u00f3tesis Removible', color: 'text-gray-800', bg: 'bg-gray-100', tipo: 'neutro' },
  { simbolo: '\u00AA', label: 'Pr\u00f3tesis Total', color: 'text-gray-800', bg: 'bg-gray-100', tipo: 'neutro' },
  { simbolo: '\u2715', label: 'Extracci\u00f3n Indicada', color: 'text-red-600', bg: 'bg-red-100', tipo: 'rojo' },
  { simbolo: '\u2715', label: 'P\u00e9rdida por Caries', color: 'text-blue-600', bg: 'bg-blue-100', tipo: 'azul' },
  { simbolo: '\u2014', label: 'P\u00e9rdida Otra Causa', color: 'text-gray-500', bg: 'bg-gray-100', tipo: 'neutro' },
]

const SimbologiaOdontograma = () => (
  <div className="mt-4 overflow-hidden rounded-2xl border border-secondary/30 bg-white shadow-sm">
    <div className="bg-gradient-to-r from-primary to-secondary px-4 py-2 text-sm font-bold uppercase tracking-wide text-white">
      SIMBOLOG\u00cdA DEL ODONTOGRAMA
    </div>
    <div className="bg-gradient-to-br from-light-bg to-white p-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {SIMBOLOGIA_ITEMS.map((item) => (
          <div key={item.label} className="flex items-center gap-2 rounded-xl border border-gray-100 bg-white px-3 py-2 text-xs shadow-sm">
            <span className={`inline-flex h-7 w-7 items-center justify-center rounded-lg border border-gray-200 text-sm font-black leading-none ${item.color} ${item.bg}`}>
              {item.simbolo}
            </span>
            <span className="font-medium text-gray-700">{item.label}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-gray-200 pt-3 text-xs text-gray-600">
        <span className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-red-700">
          <span className="h-3 w-3 rounded-full bg-red-500" />
          Rojo = Patolog\u00eda actual
        </span>
        <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-blue-700">
          <span className="h-3 w-3 rounded-full bg-blue-500" />
          Azul: tratamiento realizado
        </span>
        <span className="inline-flex items-center gap-2 rounded-full bg-secondary/10 px-3 py-1 text-gray-700">
          Click en superficie = Abrir selector cl\u00ednico
        </span>
      </div>
    </div>
  </div>
)

// ── INFO PIE ───────────────────────────────────────────────
const InfoPie = ({ odontograma }) => (
  <div className="mt-3 flex flex-wrap items-center justify-between gap-2 px-1 text-xs text-gray-600">
    <div className="flex flex-wrap items-center gap-2">
      <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 font-medium text-gray-700">
        <span className="font-bold text-primary">Tipo:</span> {odontograma.tipoDenticion}
      </span>
      <span className="inline-flex items-center gap-1 rounded-full bg-secondary/10 px-3 py-1 font-medium text-gray-700">
        <span className="font-bold text-secondary">Total:</span> {odontograma.dientes?.length || 0} dientes
      </span>
    </div>
    {odontograma.fechaActualizacion && (
      <span className="rounded-full bg-gray-100 px-3 py-1 font-medium text-gray-500">Act: {new Date(odontograma.fechaActualizacion).toLocaleDateString('es-ES')}</span>
    )}
  </div>
)

// ── MAIN COMPONENT ─────────────────────────────────────────
const OdontogramaVisual = ({ odontograma, onSuperficieClick, onDienteUpdate }) => {
  // Estado unificado por diente: { superficies: {}, recesion, movilidad }
  const [datosPorDiente, setDatosPorDiente] = useState(() => {
    const map = {}
    if (odontograma?.dientes) {
      odontograma.dientes.forEach((d) => {
        map[d._id] = {
          superficies: obtenerSuperficiesHCUDeDiente(d),
          recesion: d.recesion ?? null,
          movilidad: d.movilidad ?? null,
        }
      })
    }
    return map
  })

  const superficiesMap = useMemo(() => {
    const map = {}
    for (const [id, data] of Object.entries(datosPorDiente)) {
      map[id] = data.superficies
    }
    return map
  }, [datosPorDiente])

  const [selectorAbierto, setSelectorAbierto] = useState(null)
  const [inlineAbierto, setInlineAbierto] = useState(null)

  useEffect(() => {
    const map = {}
    if (odontograma?.dientes) {
      odontograma.dientes.forEach((d) => {
        map[d._id] = {
          superficies: obtenerSuperficiesHCUDeDiente(d),
          recesion: d.recesion ?? null,
          movilidad: d.movilidad ?? null,
        }
      })
    }
    setDatosPorDiente(map)
  }, [odontograma])

  const handleAbrirSelector = useCallback((diente, data) => {
    if (!onSuperficieClick) return
    setSelectorAbierto({ diente, ...data })
  }, [onSuperficieClick])

  const handleSelectorAccept = useCallback(
    (diente, superficie, nuevoEstado) => {
      const estadoClonado = clonarEstadoSuperficie(nuevoEstado)
      setDatosPorDiente((prev) => ({
        ...prev,
        [diente._id]: {
          ...prev[diente._id],
          superficies: { ...prev[diente._id].superficies, [superficie]: estadoClonado },
        },
      }))
      setSelectorAbierto(null)

      if (onSuperficieClick) {
        const updatedSuperficies = {
          ...datosPorDiente[diente._id].superficies,
          [superficie]: estadoClonado,
        }
        
        const payloadBackend = crearPayloadCambioHCU(diente, superficie, estadoClonado)
        onSuperficieClick(diente, superficie, estadoClonado, updatedSuperficies, payloadBackend)
      }
    },
    [onSuperficieClick, datosPorDiente]
  )

  const handleDienteClickValor = useCallback((diente, field, posicion) => {
    if (!onDienteUpdate) return
    const opciones = field === 'recesion' ? OPCIONES_RECESION : OPCIONES_MOVILIDAD
    setInlineAbierto({ diente, field, posicion, opciones })
  }, [onDienteUpdate])

  const handleDienteValorSelect = useCallback(
    (diente, field, value) => {
      setDatosPorDiente((prev) => ({
        ...prev,
        [diente._id]: { ...prev[diente._id], [field]: value },
      }))
      setInlineAbierto(null)

      if (onDienteUpdate) {
        onDienteUpdate(diente, field, value)
      }
    },
    [onDienteUpdate]
  )

  if (!odontograma?.dientes) return null

  return (
    <div className="w-full font-sans">
      {inlineAbierto && (
        <InlineSelector
          posicion={inlineAbierto.posicion}
          opciones={inlineAbierto.opciones}
          onSelect={(value) => handleDienteValorSelect(inlineAbierto.diente, inlineAbierto.field, value)}
          onClose={() => setInlineAbierto(null)}
        />
      )}

      <div className="grid gap-4 xl:grid-cols-[290px_1fr]">
        <aside className="order-2 xl:order-1">
          {selectorAbierto ? (
            <SelectorClinico
              modo="panel"
              diente={selectorAbierto.diente}
              superficie={selectorAbierto.superficie}
              simbolosActuales={selectorAbierto.simbolosActuales}
              onAccept={(nuevoEstado) =>
                handleSelectorAccept(selectorAbierto.diente, selectorAbierto.superficie, nuevoEstado)
              }
              onClose={() => setSelectorAbierto(null)}
            />
          ) : (
            <div className="rounded-2xl border border-dashed border-secondary/40 bg-gradient-to-br from-secondary/10 to-primary/5 p-4 text-sm text-gray-600 xl:sticky xl:top-4">
              <p className="font-bold text-gray-800">Panel de edición</p>
              <p className="mt-1 text-xs leading-relaxed">
                Selecciona una superficie dental del odontograma para registrar patologías, tratamientos o pérdidas.
              </p>
            </div>
          )}
        </aside>

        <div className="order-1 overflow-x-auto xl:order-2">
          <HcuOdontogramaLayout
            odontograma={odontograma}
            superficiesMap={superficiesMap}
            datosPorDiente={datosPorDiente}
            onAbrirSelector={handleAbrirSelector}
            onDienteClickValor={handleDienteClickValor}
          />
        </div>
      </div>

      <SimbologiaOdontograma />
      <InfoPie odontograma={odontograma} />
    </div>
  )
}

export default OdontogramaVisual
