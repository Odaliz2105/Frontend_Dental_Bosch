import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Mail, Phone, Calendar, MapPin, User, AlertCircle, Clock, FileText } from 'lucide-react'
import doctorService from '../../../services/doctorService'

const ESTADO_CITA = {
  pendiente: 'bg-yellow-100 text-yellow-700',
  confirmada: 'bg-green-100 text-green-700',
  completada: 'bg-blue-100 text-blue-700',
  cancelada: 'bg-red-100 text-red-700',
}

const ModalDetallePaciente = ({ pacienteId, onClose }) => {
  const [paciente, setPaciente] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const cargar = async () => {
      setCargando(true)
      const result = await doctorService.getDetallePaciente(pacienteId)
      if (result.success) {
        setPaciente(result.data)
      } else {
        setError(result.error || 'Error al cargar detalle')
      }
      setCargando(false)
    }
    cargar()
  }, [pacienteId])

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
          className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden"
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">Detalle del Paciente</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <X size={20} className="text-gray-400" />
            </button>
          </div>

          {cargando ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-3"></div>
              <p className="text-gray-500 text-sm">Cargando detalle...</p>
            </div>
          ) : error ? (
            <div className="p-12 text-center">
              <AlertCircle size={48} className="mx-auto text-red-400 mb-4" />
              <p className="text-gray-700 font-medium mb-1">Error al cargar</p>
              <p className="text-gray-500 text-sm">{error}</p>
            </div>
          ) : paciente ? (
            <div className="p-6 space-y-6">
              {/* Información básica */}
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xl flex-shrink-0">
                  {paciente.usuario?.nombre?.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-gray-900">
                      {paciente.usuario?.nombre} {paciente.usuario?.apellido}
                    </h3>
                    {paciente.numeroHistoriaClinica && (
                      <span className="text-xs font-mono bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                        {paciente.numeroHistoriaClinica}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Mail size={14} />
                      {paciente.usuario?.email}
                    </span>
                    {paciente.usuario?.telefono && (
                      <span className="flex items-center gap-1">
                        <Phone size={14} />
                        {paciente.usuario.telefono}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Datos personales */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Datos Personales</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-gray-400" />
                      <span className="text-gray-600">
                        {paciente.fechaNacimiento
                          ? new Date(paciente.fechaNacimiento).toLocaleDateString('es-ES', {
                              year: 'numeric', month: 'long', day: 'numeric'
                            })
                          : 'No registrada'}
                      </span>
                    </div>
                    {paciente.genero && (
                      <div className="flex items-center gap-2">
                        <User size={14} className="text-gray-400" />
                        <span className="text-gray-600 capitalize">{paciente.genero}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-gray-400" />
                      <span className="text-gray-600">
                        Registrado {new Date(paciente.createdAt).toLocaleDateString('es-ES', {
                          year: 'numeric', month: 'long', day: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        paciente.usuario?.estado === 'aprobado'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {paciente.usuario?.estado}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Dirección</p>
                  {paciente.direccion ? (
                    <div className="space-y-1 text-sm text-gray-600">
                      {paciente.direccion.calle && <p>{paciente.direccion.calle}</p>}
                      <p>{paciente.direccion.ciudad}, {paciente.direccion.provincia}</p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400">No registrada</p>
                  )}
                </div>
              </div>

              {/* Contacto de emergencia */}
              {paciente.contactoEmergencia?.nombre && (
                <div className="bg-orange-50 rounded-xl p-4">
                  <p className="text-xs font-semibold text-orange-600 uppercase tracking-wider mb-2">
                    Contacto de Emergencia
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-700">
                    <span className="font-medium">{paciente.contactoEmergencia.nombre}</span>
                    <span className="flex items-center gap-1">
                      <Phone size={14} className="text-gray-400" />
                      {paciente.contactoEmergencia.telefono}
                    </span>
                    {paciente.contactoEmergencia.parentesco && (
                      <span className="text-gray-500 capitalize">({paciente.contactoEmergencia.parentesco})</span>
                    )}
                  </div>
                </div>
              )}

              {/* Info médica */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Alergias</p>
                  {paciente.infoMedica?.alergias?.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {paciente.infoMedica.alergias.map((a, i) => (
                        <span key={i} className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">{a}</span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400">Ninguna registrada</p>
                  )}
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Condiciones</p>
                  {paciente.infoMedica?.condiciones?.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {paciente.infoMedica.condiciones.map((c, i) => (
                        <span key={i} className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">{c}</span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400">Ninguna registrada</p>
                  )}
                </div>
              </div>

              {/* Historial de citas */}
              {paciente.historialCitas?.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Citas ({paciente.historialCitas.length})
                    </p>
                    {paciente.citasStats?.pendiente > 0 && (
                      <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
                        {paciente.citasStats.pendiente} pendiente(s)
                      </span>
                    )}
                  </div>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {paciente.historialCitas.map((cita) => (
                      <div key={cita._id} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center gap-3">
                          <div className="bg-white p-1.5 rounded-lg">
                            <Calendar size={14} className="text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-800">
                              {new Date(cita.fecha).toLocaleDateString('es-ES', {
                                weekday: 'short', day: 'numeric', month: 'short'
                              })}
                            </p>
                            <p className="text-xs text-gray-500">
                              {cita.horaInicio} - {cita.horaFin} · {cita.motivo}
                            </p>
                          </div>
                        </div>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${ESTADO_CITA[cita.estado] || 'bg-gray-100 text-gray-600'}`}>
                          {cita.estado}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : null}

          <div className="flex justify-end px-6 py-4 border-t border-gray-200 bg-gray-50">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default ModalDetallePaciente
