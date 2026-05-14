import api from './api'

const handleError = (error) => {
  const msg = error.response?.data?.mensaje ||
    error.response?.data?.msg ||
    error.response?.data?.error ||
    'Error en la comunicación con el servidor'
  return { success: false, error: msg }
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

const doctorService = {
  getDoctorPacientes,
  getDoctorCitas,
  updateCitaEstado,
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
}

export default doctorService
