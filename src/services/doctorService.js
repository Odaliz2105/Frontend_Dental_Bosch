import api from './api'

const handleError = (error) => {
  console.error('Error detallado:', error.response?.data)
  const msg = error.response?.data?.mensaje ||
    error.response?.data?.msg ||
    error.response?.data?.error ||
    error.response?.data?.message ||
    'Error en la comunicación con el servidor'
  return { success: false, error: msg, status: error.response?.status }
}

// ── PACIENTES ──────────────────────────────────────────
export const getDoctorPacientes = async () => {
  try {
    const response = await api.get('/api/doctores/mis-pacientes')
    return { success: true, data: response.data }
  } catch (error) {
    return handleError(error)
  }
}

// ── CITAS ──────────────────────────────────────────────
export const getDoctorCitas = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams(params).toString()
    const url = queryParams ? `/api/citas/doctor?${queryParams}` : '/api/citas/doctor'
    const response = await api.get(url)
    return { success: true, data: response.data }
  } catch (error) {
    return handleError(error)
  }
}

export const updateCitaEstado = async (citaId, estado, motivoCancelacion = '', notas = '') => {
  try {
    const response = await api.put(`/api/doctores/citas/${citaId}/estado`, {
      estado,
      motivoCancelacion,
      notas
    })
    return { success: true, data: response.data }
  } catch (error) {
    return handleError(error)
  }
}

// ── CREAR CITA (DOCTOR) ─────────────────────────────────
export const crearCitaDoctor = async (citaData) => {
  try {
    const response = await api.post('/api/doctores/citas', citaData)
    return { success: true, data: response.data }
  } catch (error) {
    return {
      success: false,
      status: error.response?.status,
      error: error.response?.data?.mensaje ||
        error.response?.data?.msg ||
        error.response?.data?.error ||
        'Error al crear cita'
    }
  }
}

// ── PERFIL ─────────────────────────────────────────────
export const getDoctorProfile = async () => {
  try {
    const response = await api.get('/api/doctores/perfil/doctor')
    return { success: true, data: response.data }
  } catch (error) {
    return handleError(error)
  }
}

export const updateDoctorProfile = async (userData) => {
  try {
    const response = await api.put('/api/doctores/perfil/doctor', userData)
    return { success: true, data: response.data }
  } catch (error) {
    return handleError(error)
  }
}

export const updateDoctorHorario = async (doctorId, horarioAtencion) => {
  try {
    const response = await api.put(`/api/doctores/${doctorId}`, { horarioAtencion })
    return { success: true, data: response.data }
  } catch (error) {
    return handleError(error)
  }
}

// ── DETALLE DE PACIENTE ────────────────────────────────
export const getDetallePaciente = async (pacienteId) => {
  try {
    const response = await api.get(`/api/doctores/pacientes/${pacienteId}`)
    return { success: true, data: response.data.data }
  } catch (error) {
    return handleError(error)
  }
}

// ── HISTORIAL CLÍNICO ──────────────────────────────────
export const getHistorialClinico = async (pacienteId) => {
  try {
    const response = await api.get(`/api/historial-clinico/${pacienteId}`)
    return { success: true, data: response.data }
  } catch (error) {
    return {
      success: false,
      status: error.response?.status,
      error: error.response?.data?.mensaje || 'Error al obtener historial'
    }
  }
}

export const crearHistorialClinico = async (pacienteId) => {
  try {
    const response = await api.post(`/api/historial-clinico/${pacienteId}`, {})
    return { success: true, data: response.data }
  } catch (error) {
    return handleError(error)
  }
}

export const agregarConsulta = async (pacienteId, consultaData) => {
  try {
    const response = await api.post(`/api/historial-clinico/${pacienteId}/consulta`, consultaData)
    return { success: true, data: response.data }
  } catch (error) {
    return handleError(error)
  }
}

export const getConsultasFiltradas = async (pacienteId, filtros = {}) => {
  try {
    const params = new URLSearchParams(filtros).toString()
    const response = await api.get(`/api/historial-clinico/${pacienteId}/consultas?${params}`)
    return { success: true, data: response.data }
  } catch (error) {
    return handleError(error)
  }
}

export const getEstadisticas = async (pacienteId) => {
  try {
    const response = await api.get(`/api/historial-clinico/${pacienteId}/estadisticas`)
    return { success: true, data: response.data }
  } catch (error) {
    return handleError(error)
  }
}

export const actualizarConsulta = async (pacienteId, consultaId, datosActualizacion) => {
  try {
    const response = await api.put(
      `/api/historial-clinico/${pacienteId}/consulta/${consultaId}`,
      datosActualizacion
    )
    return { success: true, data: response.data }
  } catch (error) {
    return handleError(error)
  }
}

export const eliminarConsulta = async (pacienteId, consultaId) => {
  try {
    const response = await api.delete(`/api/historial-clinico/${pacienteId}/consulta/${consultaId}`)
    return { success: true, data: response.data }
  } catch (error) {
    return handleError(error)
  }
}

export const eliminarHistorial = async (pacienteId) => {
  try {
    const response = await api.delete(`/api/historial-clinico/${pacienteId}`)
    return { success: true, data: response.data }
  } catch (error) {
    return handleError(error)
  }
}

export const inicializarOdontograma = async (pacienteId, consultaId, tipoDenticion) => {
  try {
    const response = await api.post(
      `/api/historial-clinico/${pacienteId}/consulta/${consultaId}/odontograma/inicializar`,
      { tipoDenticion }
    )
    return { success: true, data: response.data }
  } catch (error) {
    return handleError(error)
  }
}

export const verOdontograma = async (pacienteId, consultaId) => {
  try {
    const response = await api.get(
      `/api/historial-clinico/${pacienteId}/consulta/${consultaId}/odontograma`
    )
    return { success: true, data: response.data }
  } catch (error) {
    return handleError(error)
  }
}

export const verOdontogramaVisual = async (pacienteId, consultaId) => {
  try {
    const response = await api.get(
      `/api/historial-clinico/${pacienteId}/consulta/${consultaId}/odontograma/visual`
    )
    return { success: true, data: response.data }
  } catch (error) {
    return handleError(error)
  }
}

export const actualizarDienteOdontograma = async (pacienteId, consultaId, numeroDiente, datosActualizacion) => {
  try {
    const response = await api.put(
      `/api/historial-clinico/${pacienteId}/consulta/${consultaId}/odontograma/diente/${numeroDiente}`,
      datosActualizacion
    )
    return { success: true, data: response.data }
  } catch (error) {
    return handleError(error)
  }
}

// ── TRATAMIENTOS ─────────────────────────────────────────
export const getTratamientosPaciente = async (pacienteId) => {
  try {
    const response = await api.get(`/api/tratamientos/paciente/${pacienteId}`)
    return { success: true, data: response.data }
  } catch (error) {
    return handleError(error)
  }
}

export const crearTratamiento = async (pacienteId, data) => {
  try {
    const response = await api.post(`/api/tratamientos/paciente/${pacienteId}`, data)
    return { success: true, data: response.data }
  } catch (error) {
    return handleError(error)
  }
}

export const actualizarTratamiento = async (tratamientoId, data) => {
  try {
    const response = await api.put(`/api/tratamientos/${tratamientoId}`, data)
    return { success: true, data: response.data }
  } catch (error) {
    return handleError(error)
  }
}

export const eliminarTratamiento = async (tratamientoId) => {
  try {
    const response = await api.delete(`/api/tratamientos/${tratamientoId}`)
    return { success: true, data: response.data }
  } catch (error) {
    return handleError(error)
  }
}

export const getDetalleTratamiento = async (pacienteId, consultaId, sesion) => {
  try {
    const response = await api.get(`/api/tratamientos/paciente/${pacienteId}/consulta/${consultaId}/sesion/${sesion}`)
    return { success: true, data: response.data }
  } catch (error) {
    return handleError(error)
  }
}

export const actualizarObservacionesGenerales = async (pacienteId, consultaId, observacionesGenerales) => {
  try {
    const response = await api.put(
      `/api/historial-clinico/${pacienteId}/consulta/${consultaId}/odontograma/observaciones`,
      { observacionesGenerales }
    )
    return { success: true, data: response.data }
  } catch (error) {
    return handleError(error)
  }
}

const doctorService = {
  getDoctorPacientes,
  getDoctorCitas,
  updateCitaEstado,
  crearCitaDoctor,
  getDoctorProfile,
  updateDoctorProfile,
  updateDoctorHorario,
  getDetallePaciente,
  getHistorialClinico,
  crearHistorialClinico,
  agregarConsulta,
  getConsultasFiltradas,
  getEstadisticas,
  actualizarConsulta,
  eliminarConsulta,
  eliminarHistorial,
  inicializarOdontograma,
  verOdontograma,
  verOdontogramaVisual,
  actualizarDienteOdontograma,
  actualizarObservacionesGenerales,
  getTratamientosPaciente,
  crearTratamiento,
  actualizarTratamiento,
  eliminarTratamiento,
  getDetalleTratamiento,
}

export default doctorService
