import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X, User, Calendar, Hash, FileText, DollarSign,
  Stethoscope, ClipboardList, Activity, AlertCircle
} from 'lucide-react'

const ESTADOS = {
  pendiente: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800' },
  en_progreso: { label: 'En Progreso', color: 'bg-blue-100 text-blue-800' },
  completado: { label: 'Completado', color: 'bg-green-100 text-green-800' },
  cancelado: { label: 'Cancelado', color: 'bg-red-100 text-red-800' },
}

const ModalDetalleTratamiento = ({ tratamiento, onClose }) => {
  if (!tratamiento) return null

  const doctorNombre = tratamiento.doctor?.nombre && tratamiento.doctor?.apellido
    ? `Dr. ${tratamiento.doctor.nombre} ${tratamiento.doctor.apellido}`
    : tratamiento.doctor?.nombreCompleto || 'No asignado'

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
            <h2 className="text-lg font-bold text-gray-900">Detalle del Tratamiento</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <X size={20} className="text-gray-400" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {tratamiento.doctor && (
              <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <User size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Doctor a cargo</p>
                    <p className="font-semibold text-gray-900">{doctorNombre}</p>
                    {tratamiento.firmaDoctor?.nombre && (
                      <p className="text-xs text-gray-500 mt-0.5">Firma: {tratamiento.firmaDoctor.nombre}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Informaci&oacute;n del Tratamiento</p>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Hash size={14} className="text-gray-400" />
                    <span className="text-gray-600">Diente: <strong className="text-gray-900">{tratamiento.diente}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Activity size={14} className="text-gray-400" />
                    <span className="text-gray-600">Procedimiento: <strong className="text-gray-900">{tratamiento.tipoProcedimiento?.replace('_', ' ')}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ClipboardList size={14} className="text-gray-400" />
                    <span className="text-gray-600">Estado: <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${ESTADOS[tratamiento.estado]?.color || 'bg-gray-100 text-gray-600'}`}>
                      {ESTADOS[tratamiento.estado]?.label || tratamiento.estado}
                    </span></span>
                  </div>
                  {tratamiento.sesion && (
                    <div className="flex items-center gap-2">
                      <FileText size={14} className="text-gray-400" />
                      <span className="text-gray-600">Sesi&oacute;n: <strong className="text-gray-900">{tratamiento.sesion}</strong></span>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Costos y Fechas</p>
                <div className="space-y-3 text-sm">
                  {tratamiento.costoEstimado > 0 && (
                    <div className="flex items-center gap-2">
                      <DollarSign size={14} className="text-gray-400" />
                      <span className="text-gray-600">Costo: <strong className="text-gray-900">${Number(tratamiento.costoEstimado).toFixed(2)}</strong></span>
                    </div>
                  )}
                  {tratamiento.fecha && (
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-gray-400" />
                      <span className="text-gray-600">Fecha: <strong className="text-gray-900">{new Date(tratamiento.fecha).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</strong></span>
                    </div>
                  )}
                  {tratamiento.fechaCreacion && (
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-gray-400" />
                      <span className="text-gray-600">Creado: <strong className="text-gray-900">{new Date(tratamiento.fechaCreacion).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</strong></span>
                    </div>
                  )}
                  {tratamiento.fechaCompletado && (
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-gray-400" />
                      <span className="text-gray-600">Completado: <strong className="text-gray-900">{new Date(tratamiento.fechaCompletado).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</strong></span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {tratamiento.procedimientos?.length > 0 && (
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Procedimientos Realizados</p>
                <div className="flex flex-wrap gap-2">
                  {tratamiento.procedimientos.map((proc, i) => (
                    <span key={i} className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full">
                      {proc}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {tratamiento.consultaId && (
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Consulta Asociada</p>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Stethoscope size={14} className="text-gray-400" />
                  <span className="font-mono text-xs">{typeof tratamiento.consultaId === 'object' ? tratamiento.consultaId._id : tratamiento.consultaId}</span>
                </div>
              </div>
            )}

            {tratamiento.notas && (
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Notas</p>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{tratamiento.notas}</p>
              </div>
            )}

            {!tratamiento.doctor && !tratamiento.procedimientos?.length && !tratamiento.notas && (
              <div className="text-center py-8">
                <AlertCircle size={32} className="mx-auto text-gray-300 mb-2" />
                <p className="text-sm text-gray-400">No hay informaci&oacute;n adicional disponible</p>
              </div>
            )}
          </div>

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

export default ModalDetalleTratamiento
