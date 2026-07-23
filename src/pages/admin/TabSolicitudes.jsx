import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, UserCheck, Eye, CheckCircle, XCircle, Stethoscope } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import Toast from "../../components/common/Toast"
import ModalDetalle from '../../components/admin/ModalDetalle'
import Button from '../../components/Button'

const TabSolicitudes = () => {
  const { getPendingDoctors, aprobarDoctorAdmin, rechazarDoctorAdmin } = useAuth()
  const [solicitudes, setSolicitudes] = useState([])
  const [cargando, setCargando] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [loadingBtn, setLoadingBtn] = useState({})
  const [toast, setToast] = useState(null)
  const [detalle, setDetalle] = useState(null)
  
  // Estados para el modal de rechazo
  const [doctorARechazar, setDoctorARechazar] = useState(null)
  const [motivoRechazo, setMotivoRechazo] = useState('')
  const [rechazando, setRechazando] = useState(false)

  const mostrarToast = (msg, tipo = 'success') => {
    setToast({ msg, tipo })
    setTimeout(() => setToast(null), 3000)
  }

  const cargar = async () => {
    setCargando(true)
    try {
      const result = await getPendingDoctors()
      if (result.success) {
        const solicitudesData = result.data.datos?.doctores || []
        setSolicitudes(solicitudesData)
      } else {
        mostrarToast('Error al cargar solicitudes', 'error')
      }
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => { cargar() }, [])

  const handleAprobar = async (doctor) => {
    const usuarioId = doctor.usuario?._id;
    if (!usuarioId) {
      mostrarToast('No se encontró el identificador del usuario asociado al doctor', 'error');
      return;
    }

    setLoadingBtn(prev => ({ ...prev, [doctor._id]: true }));
    try {
      const result = await aprobarDoctorAdmin(usuarioId);
      if (result.success) {
        mostrarToast('Doctor aprobado correctamente. El sistema intentó enviar la notificación por correo electrónico', 'success');
        await cargar();
        window.dispatchEvent(new CustomEvent('doctorStatusChanged', { 
          detail: { action: 'aprobado', doctorId: doctor._id } 
        }));
      } else {
        mostrarToast(result.error || 'Error al aprobar doctor', 'error');
      }
    } finally {
      setLoadingBtn(prev => ({ ...prev, [doctor._id]: false }));
    }
  };

  const confirmarRechazo = async () => {
    if (!doctorARechazar) return;

    const usuarioId = doctorARechazar.usuario?._id;
    if (!usuarioId) {
      mostrarToast('No se encontró el identificador del usuario asociado al doctor', 'error');
      return;
    }

    setRechazando(true);
    try {
      const result = await rechazarDoctorAdmin(usuarioId, motivoRechazo);
      if (result.success) {
        mostrarToast('Solicitud rechazada correctamente. El sistema intentó enviar la notificación por correo electrónico', 'success');
        await cargar();
        window.dispatchEvent(new CustomEvent('doctorStatusChanged', { 
          detail: { action: 'rechazado', doctorId: doctorARechazar._id } 
        }));
        // Cerrar modal
        setDoctorARechazar(null);
        setMotivoRechazo('');
      } else {
        mostrarToast(result.error || 'Error al rechazar doctor', 'error');
      }
    } finally {
      setRechazando(false);
    }
  };

  const pendientes = solicitudes.filter(s => 
    `${s.nombreCompleto || `${s.usuario?.nombre} ${s.usuario?.apellido}`.trim()} ${s.usuario?.email}` 
      .toLowerCase()
      .includes(busqueda.toLowerCase())
  )

  return (
    <div>
      <Toast toast={toast} />
      <ModalDetalle doctor={detalle} onClose={() => setDetalle(null)} />

      {/* Modal de Rechazo */}
      {doctorARechazar && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden"
          >
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Rechazar solicitud</h3>
              <div className="mb-4 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100">
                <p><span className="font-semibold text-gray-700">Doctor:</span> {doctorARechazar.nombreCompleto || `${doctorARechazar.usuario?.nombre} ${doctorARechazar.usuario?.apellido}`.trim()}</p>
                <p><span className="font-semibold text-gray-700">Correo:</span> {doctorARechazar.usuario?.email}</p>
                <p><span className="font-semibold text-gray-700">Especialidad:</span> {doctorARechazar.especialidad}</p>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Motivo del rechazo (Opcional)
                </label>
                <textarea
                  value={motivoRechazo}
                  onChange={(e) => setMotivoRechazo(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/50 resize-none h-24 text-sm"
                  placeholder="Ej: Documentación incompleta..."
                />
                <p className="mt-1 text-xs text-gray-500">
                  El motivo será incluido en el correo enviado al doctor
                </p>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => {
                    setDoctorARechazar(null);
                    setMotivoRechazo('');
                  }}
                  disabled={rechazando}
                >
                  Cancelar
                </Button>
                <Button
                  className="bg-red-600 hover:bg-red-700 text-white"
                  onClick={confirmarRechazo}
                  loading={rechazando}
                >
                  Confirmar rechazo
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      <div className="relative mb-6">
        <Search size={18} className="absolute left-3 top-3 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar por nombre o email..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
        />
      </div>

      {cargando ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-3"></div>
          <p className="text-gray-500 text-sm">Cargando solicitudes...</p>
        </div>
      ) : pendientes.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <UserCheck size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 text-sm">No hay solicitudes pendientes</p>
        </div>
      ) : (
        <div className="space-y-3">
          {pendientes.map(doctor => (
            <motion.div
              key={doctor._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 flex items-center justify-center text-primary font-bold text-lg flex-shrink-0">
                    {(doctor.nombre || doctor.usuario?.nombre)?.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {doctor.nombreCompleto || `${doctor.usuario?.nombre} ${doctor.usuario?.apellido}`.trim()}
                    </p>
                    <p className="text-sm text-gray-500">{doctor.usuario?.email}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Stethoscope size={12} />
                        {doctor.especialidad || 'No especificada'}
                      </span>
                      <span>•</span>
                      <span>{new Date(doctor.createdAt).toLocaleDateString('es-ES')}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => setDetalle(doctor)}
                    className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                    title="Ver detalle"
                  >
                    <Eye size={16} />
                  </button>
                  <Button
                    onClick={() => handleAprobar(doctor)}
                    loading={loadingBtn[doctor._id]}
                    className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1.5"
                    size="small"
                  >
                    <CheckCircle size={14} className="mr-1" /> Aprobar
                  </Button>
                  <Button
                    onClick={() => {
                       setDoctorARechazar(doctor);
                       setMotivoRechazo('');
                    }}
                    disabled={loadingBtn[doctor._id]}
                    variant="outline"
                    className="border-red-300 text-red-600 hover:bg-red-50 text-xs px-3 py-1.5"
                    size="small"
                  >
                    <XCircle size={14} className="mr-1" /> Rechazar
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export default TabSolicitudes
