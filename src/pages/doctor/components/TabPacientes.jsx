import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, Search, Mail, Phone, Calendar, Eye } from 'lucide-react'
import doctorService from '../../../services/doctorService'
import Button from '../../../components/Button'
import ModalDetallePaciente from './ModalDetallePaciente'

const TabPacientes = () => {
  const [pacientes, setPacientes] = useState([])
  const [loading, setLoading] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [detallePacienteId, setDetallePacienteId] = useState(null)

  useEffect(() => {
    cargarPacientes()
  }, [])

  const cargarPacientes = async () => {
    setLoading(true)
    try {
      const result = await doctorService.getDoctorPacientes()
      if (result.success) {
        const pacientesData = result.data.data || []
        console.log('📋 TabPacientes - Primer paciente:', pacientesData[0])
        console.log('📋 TabPacientes - Keys del primer item:', Object.keys(pacientesData[0] || {}))
        setPacientes(pacientesData)
        console.log('📋 TabPacientes - Pacientes cargados:', pacientesData.length)
      } else {
        console.error('❌ TabPacientes - Error al cargar pacientes:', result.error)
      }
    } catch (error) {
      console.error('❌ TabPacientes - Error general:', error)
    } finally {
      setLoading(false)
    }
  }

  const extraer = (obj, ...campos) => {
    for (const c of campos) {
      const val = c.split('.').reduce((o, k) => o?.[k], obj)
      if (val) return val
    }
    return null
  }
  const obtenerNombre = (p) =>
    extraer(p, 'nombreCompleto', 'nombre', 'nombres', 'paciente.nombreCompleto', 'paciente.nombre', 'usuario.nombreCompleto', 'usuario.nombre') ||
    `Paciente #${p._id?.slice(-4)}`
  const obtenerEmail = (p) => extraer(p, 'email', 'correo', 'paciente.email', 'paciente.correo', 'usuario.email') || ''
  const obtenerTelefono = (p) => extraer(p, 'telefono', 'celular', 'paciente.telefono', 'paciente.celular', 'usuario.telefono') || ''
  const calcularEdad = (fechaNac) => {
    if (!fechaNac) return null
    const hoy = new Date()
    const nac = new Date(fechaNac)
    let edad = hoy.getFullYear() - nac.getFullYear()
    const m = hoy.getMonth() - nac.getMonth()
    if (m < 0 || (m === 0 && hoy.getDate() < nac.getDate())) edad--
    return edad
  }

  const pacientesFiltrados = pacientes.filter(paciente => {
    const q = busqueda.toLowerCase()
    return (
      obtenerNombre(paciente).toLowerCase().includes(q) ||
      obtenerEmail(paciente).toLowerCase().includes(q) ||
      (paciente.ultimoMotivo || '').toLowerCase().includes(q)
    )
  })

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="text-gray-500 mt-2">Cargando pacientes...</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Búsqueda */}
      <div className="flex items-center gap-4">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar pacientes..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        <Button>
          <Users className="w-4 h-4 mr-2" />
          Nuevo Paciente
        </Button>
      </div>

      {/* Lista de pacientes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pacientesFiltrados.map((paciente, index) => {
          const nombre = obtenerNombre(paciente)
          const email = obtenerEmail(paciente)
          const telefono = obtenerTelefono(paciente)
          const edad = calcularEdad(paciente.fechaNacimiento)
          const ultimaVisita = paciente.fechaUltimaCita
            ? new Date(paciente.fechaUltimaCita).toLocaleDateString()
            : 'Sin visitas'

          return (
            <motion.div
              key={paciente._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-lg">
                    {nombre.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{nombre}</h3>
                    <p className="text-sm text-gray-500">{edad !== null ? `${edad} años` : ''}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                {email && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span>{email}</span>
                  </div>
                )}
                {telefono && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{telefono}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>Última visita: {ultimaVisita}</span>
                </div>
                {paciente.ultimoMotivo && (
                  <div className="text-xs text-gray-400 italic">
                    Motivo: {paciente.ultimoMotivo}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                <div className="flex gap-4 text-sm">
                  <span className="text-gray-500">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    {paciente.totalCitas || 0} citas
                  </span>
                  {paciente.numeroHistoriaClinica && (
                    <span className="text-blue-600 font-medium">
                      HC: {paciente.numeroHistoriaClinica}
                    </span>
                  )}
                </div>
                <Button variant="outline" size="small" onClick={() => setDetallePacienteId(paciente._id)}>
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Modal de detalle */}
      {detallePacienteId && (
        <ModalDetallePaciente
          pacienteId={detallePacienteId}
          onClose={() => setDetallePacienteId(null)}
        />
      )}

      {pacientesFiltrados.length === 0 && !loading && (
        <div className="text-center py-12">
          <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron pacientes</h3>
          <p className="text-gray-500">
            {busqueda ? 'Intenta con otra búsqueda' : 'No tienes pacientes registrados'}
          </p>
        </div>
      )}
    </div>
  )
}

export default TabPacientes
