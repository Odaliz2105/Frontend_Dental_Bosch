import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext();
/* eslint-disable */

export const useAuth = () => {

  const context = useContext(AuthContext);

  if (!context) {

    throw new Error("useAuth must be used within an AuthProvider");

  }

  return context;

};

/* eslint-enable */

const enriquecerUsuarioDoctor = async (usuarioBase) => {
  if (!usuarioBase || usuarioBase.rol !== 'doctor') {
    return usuarioBase
  }

  try {
    const response = await api.get(
      '/api/doctores/perfil/doctor'
    )

    const doctor =
      response.data?.data ||
      response.data ||
      {}

    const usuarioDoctor =
      doctor.usuario || {}

    return {
      ...usuarioBase,
      nombre:
        usuarioDoctor.nombre ??
        usuarioBase.nombre,
      apellido:
        usuarioDoctor.apellido ??
        usuarioBase.apellido,
      email:
        usuarioDoctor.email ??
        usuarioBase.email,
      telefono:
        usuarioDoctor.telefono ??
        usuarioBase.telefono,
      cedula:
        usuarioDoctor.cedula ??
        usuarioBase.cedula,
      especialidad:
        doctor.especialidad ??
        usuarioBase.especialidad ??
        '',
      horarioAtencion:
        doctor.horarioAtencion ??
        usuarioBase.horarioAtencion ??
        []
    }
  } catch (error) {
    console.error(
      'No se pudo cargar el perfil profesional:',
      error
    )

    return usuarioBase
  }
}


export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {

    if (token) {

      // Verificar token y obtener datos del usuario
      api

        .get("/api/auth/verificar-token")

        .then(async (response) => {

          const usuario = response.data.usuario;

          // Verificación adicional para doctores pendientes

          if (usuario.rol === "doctor" && usuario.estado !== "aprobado") {

            // Si es doctor pendiente, cerrar sesión

            localStorage.removeItem("token");

            setToken(null);

            setUser(null);

            return;

          }

          const usuarioCompleto = await enriquecerUsuarioDoctor(usuario);
          setUser(usuarioCompleto);

        })

        .catch(() => {

          localStorage.removeItem("token");
          setToken(null);
          setUser(null);

        })

        .finally(() => {

          setTimeout(() => setLoading(false), 0);
        });

    } else {

      setTimeout(() => setLoading(false), 0);
    }

  }, [token]);

  const login = async (credentials) => {

    try {

      const credentialsNormalizadas = {
        email: credentials.email?.trim().toLowerCase(),
        password: credentials.password
      }

      const response = await api.post("/api/auth/login", credentialsNormalizadas);
      const { token, usuario } = response.data;

      // Verificación adicional para doctores pendientes

      if (usuario.rol === "doctor" && usuario.estado !== "aprobado") {

        let mensaje = "Tu cuenta de doctor está pendiente de aprobación";

        if (usuario.estado === "pendiente") {

          mensaje =

            "Tu cuenta de doctor está pendiente de aprobación por un administrador. Te notificaremos por email cuando sea aprobada.";

        } else if (usuario.estado === "rechazado") {

          mensaje =

            "Tu cuenta de doctor ha sido rechazada. Por favor contacta al administrador.";
        }

        return {

          success: false,
          requiresApproval: true,
          error: mensaje,
          userState: usuario.estado,

        };
      }

      localStorage.setItem("token", token);
      setToken(token);

      // Configurar Axios para incluir token en futuras peticiones antes de enriquecer
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const usuarioCompleto = await enriquecerUsuarioDoctor(usuario);
      setUser(usuarioCompleto);

      return { success: true };

    } catch (error) {
      const errorData = error.response?.data;
      let errorMessage = "Error al iniciar sesión";

      if (errorData) {
        errorMessage =
          errorData.mensaje ||
          errorData.msg ||
          errorData.error ||
          "Error al iniciar sesión";
      }

      // Mejorar mensajes genéricos
      const textoNormalizado = errorMessage.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
      
      if (textoNormalizado.includes('rechaz')) {
        return {
          success: false,
          rejected: true,
          requiresApproval: false,
          userState: 'rechazado',
          error: errorMessage
        };
      }
      
      if (textoNormalizado.includes('pendient') || textoNormalizado.includes('aprobacion')) {
        return {
          success: false,
          requiresApproval: true,
          userState: 'pendiente',
          error: errorMessage
        };
      }
      
      if (textoNormalizado.includes('credencial') || textoNormalizado.includes('incorrect')) {
        errorMessage = "Correo o contraseña incorrectos";
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  };



  const register = async (userData) => {
    try {

      console.log("📤 Enviando al backend:", userData);
      console.log("📋 JSON.stringify:", JSON.stringify(userData));
      const response = await api.post("/api/auth/registro", userData);
      console.log("📥 Respuesta del backend:", response.data);
      return { success: true, data: response.data };
    } catch (error) {

      console.log("❌ Error completo:", error);
      console.log("❌ Error response:", error.response);
      console.log("❌ Error request:", error.request);
      console.log("❌ Error message:", error.message);
      console.log("❌ Status del error:", error.response?.status);
      console.log("❌ Data del error:", error.response?.data);

      let errorMessage = "Error al registrarse";
      let errorData = null;
      let errorStatus = null;

      if (error.response) {
        // El servidor respondió con un estado de error
        errorStatus = error.response.status;
        errorData = error.response.data;

        let rawMessage = errorData?.mensaje || errorData?.message || errorData?.msg || errorData?.error;
        if (Array.isArray(rawMessage)) {
          errorMessage = rawMessage.join(', ');
        } else if (typeof rawMessage === 'string') {
          errorMessage = rawMessage;
        } else {
          errorMessage = `Error del servidor (${errorStatus})`;
        }

      } else if (error.request) {

        // La solicitud se hizo pero no hubo respuesta

        errorMessage =
          "No se pudo conectar con el servidor. Intenta nuevamente.";

      } else {

        // Error en la configuración de la solicitud
        errorMessage =
          error.message || "Error en la configuración de la solicitud";
      }

      return {
        success: false,
        error: errorMessage,
        status: errorStatus,
        errorData: errorData
      };
    }
  };



  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    delete api.defaults.headers.common["Authorization"];

  };

  const updateProfile = async (userData) => {
    try {

      const response = await api.put("/api/auth/perfil", userData);
      setUser(response.data.usuario);
      return { success: true, data: response.data };
    } catch (error) {

      return {

        success: false,
        error: error.response?.data?.msg || "Error al actualizar perfil",
      };
    }
  };

  const updateUser = async (userData, file = null) => {
    try {
      let response;

      const cleanData = {};
      Object.keys(userData).forEach((key) => {
        if (userData[key] !== null && userData[key] !== undefined && userData[key] !== "") {
          cleanData[key] = userData[key];
        }
      });

      if (file) {
        const formData = new FormData();
        Object.keys(cleanData).forEach((key) => formData.append(key, cleanData[key]));
        formData.append("foto", file);
        response = await api.put("/api/auth/perfil", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        response = await api.put("/api/auth/perfil", cleanData);
      }

      const updatedUser = response.data.data || response.data.usuario;
      setUser((prev) => ({ ...prev, ...updatedUser }));

      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.mensaje || error.response?.data?.msg || "Error al actualizar perfil",
      };
    }
  };


  // 🔥 Nueva función para refrescar datos del usuario

  const refreshUserData = async () => {

    try {

      const response = await api.get("/api/auth/verificar-token");
      const usuario = response.data.usuario;
      
      // Verificación adicional para doctores pendientes

      if (usuario.rol === "doctor" && usuario.estado !== "aprobado") {

        localStorage.removeItem("token");

        setToken(null);

        setUser(null);

        return;

      }


      const usuarioCompleto = await enriquecerUsuarioDoctor(usuario);
      setUser(usuarioCompleto);
      return usuarioCompleto;

    } catch (error) {

      console.error("Error refrescando datos del usuario:", error);

      // En caso de error, mantener el usuario actual pero loguear el problema

    }

  };



  const updatePassword = async (passwordData) => {
  try {
    const response = await api.put(
      "/api/auth/actualizar-password",
      passwordData
    )
    return { success: true, data: response.data }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.mensaje || 
             error.response?.data?.msg || 
             "Error al actualizar contraseña",
    }
  }
};

  const getPendingDoctors = async () => {

    try {

      const response = await api.get('/api/admin/doctores-pendientes')
      return { success: true, data: response.data }

    } catch (error) {

      return {
        success: false,
        error: error.response?.data?.mensaje || 'Error al obtener doctores pendientes'
      }
    }
  }

  const approveDoctor = async (doctorId, accion) => {

    try {

      const response = await api.put(
        `/api/admin/doctores/${doctorId}`,
        { activo: accion === 'aprobado' }
      )

      return { success: true, data: response.data }

    } catch (error) {

      return {

        success: false,
        error: error.response?.data?.mensaje || 'Error al cambiar estado del doctor'
      }
    }
  }


  const getAllDoctors = async () => {
    try {
      const response = await api.get("/api/doctores");
      return { success: true, data: response.data };

    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.msg || "Error al obtener doctores",
      };
    }
  };

  const getAllDoctorsIncludingInactive = async () => {
    try {
      const response = await api.get("/api/admin/doctores");
      return { success: true, data: response.data };

    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.msg || "Error al obtener todos los doctores",
      };
    }
  };

  const getInactiveDoctors = async () => {
    try {
      const response = await api.get("/api/admin/doctores-inactivos");
      return { success: true, data: response.data };

    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.msg || "Error al obtener doctores inactivos",
      };
    }
  };



  const getDoctorById = async (id) => {

    try {
      const response = await api.get(`/api/doctores/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.msg || "Error al obtener doctor",
      };
    }

  };



  const getApprovedDoctors = async () => {

    try {

      const response = await api.get("/api/doctores/aprobados/lista");
      return { success: true, data: response.data };
    } catch (error) {

      return {
        success: false,
        error:
          error.response?.data?.msg || "Error al obtener doctores aprobados",

      };
    }
  };

  const deleteDoctor = async (id) => {

    try {

      const response = await api.delete(`/api/admin/doctores/${id}`);

      return { success: true, data: response.data };

    } catch (error) {

      return {

        success: false,

        error: error.response?.data?.msg || "Error al eliminar doctor",

      };

    }

  };



  const getAdminCitas = async (page = 1) => {

    try {

      const response = await api.get(`/api/admin/citas?page=${page}`)

      console.log('📤 getAdminCitas - Enviando solicitud:', `/api/admin/citas?page=${page}`)

      console.log('📥 getAdminCitas - Respuesta del backend:', response.data)

      return { success: true, data: response.data }

    } catch (error) {

      console.error('❌ getAdminCitas - Error:', error.response?.data)

      return {

        success: false,

        error: error.response?.data?.mensaje || 'Error al obtener citas'

      }

    }

  }



  const getAdminCitaById = async (id) => {

    try {

      const response = await api.get(`/api/admin/citas/${id}`)

      return { success: true, data: response.data }

    } catch (error) {

      return {

        success: false,

        error: error.response?.data?.mensaje || 'Error al obtener detalle de cita'

      }

    }

  }



  const getAdminPacientes = async (page = 1) => {

    try {

      const response = await api.get(`/api/admin/pacientes?page=${page}`)

      console.log('📤 getAdminPacientes - Enviando solicitud:', `/api/admin/pacientes?page=${page}`)

      console.log('📥 getAdminPacientes - Respuesta del backend:', response.data)

      return { success: true, data: response.data }

    } catch (error) {

      console.error('❌ getAdminPacientes - Error:', error.response?.data)

      return {

        success: false,

        error: error.response?.data?.mensaje || 'Error al obtener pacientes'

      }

    }

  }

  const getAdminUsers = async (page = 1) => {

    try {

      const response = await api.get(`/api/admin/usuarios?page=${page}`)

      return { success: true, data: response.data }

    } catch (error) {

      return {

        success: false,

        error: error.response?.data?.mensaje || 'Error al obtener usuarios'

      }

    }

  }



  const reasignarCitas = async (citaId, doctorDestinoId) => {

    try {

      console.log('📤 reasignarCitas - Enviando solicitud:', `/api/admin/citas/${citaId}/reasignar`)
      console.log('📤 reasignarCitas - Datos:', { doctorDestino: doctorDestinoId })

      const response = await api.put(

        `/api/admin/citas/${citaId}/reasignar`,

        { doctorDestino: doctorDestinoId }

      )

      console.log('📥 reasignarCitas - Respuesta:', response.data)

      return { success: true, data: response.data }

    } catch (error) {

      console.error('❌ reasignarCitas - Error:', error.response?.data)

      return {

        success: false,

        error: error.response?.data?.mensaje || 'Error al reasignar citas'

      }

    }

  }

  const getAdminPacienteById = async (id) => {

    try {

      const response = await api.get(`/api/admin/pacientes/${id}`)

      return { success: true, data: response.data }

    } catch (error) {

      return {

        success: false,

        error: error.response?.data?.mensaje || 'Error al obtener paciente'

      }

    }

  }



  const deleteAdminPaciente = async (id) => {

    try {

      const response = await api.delete(`/api/admin/pacientes/${id}`)

      return { success: true, data: response.data }

    } catch (error) {

      return {

        success: false,

        error: error.response?.data?.mensaje || 'Error al eliminar paciente'

      }

    }

  }

  

  // Configurar Axios para incluir token si existe

  useEffect(() => {

    if (token) {

      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    }

  }, [token]);



  const getAdminEstadisticas = async () => {

    try {

      const response = await api.get('/api/admin/estadisticas')

      return { success: true, data: response.data }

    } catch (error) {

      return {

        success: false,

        error: error.response?.data?.mensaje || 'Error al obtener estadísticas'

      }

    }

  }



  const aprobarDoctorAdmin = async (usuarioId) => {
    try {
      const response = await api.put(`/api/admin/doctores/${usuarioId}/aprobar`)

      return { success: true, data: response.data }

    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.mensaje || error.response?.data?.message || 'Error al aprobar doctor'
      }
    }
  }

  const rechazarDoctorAdmin = async (usuarioId, motivo = '') => {
    try {
      const response = await api.put(`/api/admin/doctores/${usuarioId}/rechazar`, {
        motivo: motivo.trim()
      })

      return { success: true, data: response.data }

    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.mensaje || error.response?.data?.message || 'Error al rechazar doctor'
      }
    }
  }

  const verificarCitasDoctor = async (doctorId) => {
    try {
      console.log('📤 verificarCitasDoctor - Verificando citas del doctor:', doctorId)
      
      // Usar directamente el endpoint general de citas y filtrar
      console.log('🔄 Usando endpoint general de citas para verificar')
      const citasResponse = await api.get('/api/admin/citas')
      
      console.log('📥 Todas las citas:', citasResponse.data)
      
      // Filtrar citas del doctor y que estén pendientes
      const citasDoctor = citasResponse.data.data?.filter(cita => {
        const doctorIdCita = cita.doctor?._id || cita.doctor
        const esMismoDoctor = doctorIdCita === doctorId
        const estaPendiente = ['pendiente', 'confirmada', 'programada'].includes(cita.estado)
        
        console.log(`📋 Cita ${cita._id}: doctor=${doctorIdCita}, mismoDoctor=${esMismoDoctor}, estado=${cita.estado}, pendiente=${estaPendiente}`)
        
        return esMismoDoctor && estaPendiente
      }) || []
      
      console.log(`🎯 Citas pendientes del doctor ${doctorId}:`, citasDoctor.length, citasDoctor)
      
      return {
        success: true, 
        data: {
          tieneCitasPendientes: citasDoctor.length > 0,
          totalCitasPendientes: citasDoctor.length,
          citas: citasDoctor
        }
      }
    } catch (error) {
      console.error('❌ verificarCitasDoctor - Error:', error.response?.data)
      return {
        success: false,
        error: error.response?.data?.mensaje || 'Error al verificar citas del doctor'
      }
    }
  }

  const softDeleteDoctor = async (doctorId) => {
    try {
      console.log('📤 softDeleteDoctor - Desactivando doctor:', doctorId)
      
      // Primero verificar si tiene citas pendientes
      const citasCheck = await verificarCitasDoctor(doctorId)
      
      if (!citasCheck.success) {
        return citasCheck
      }
      
      // Si tiene citas pendientes, retornar error con información
      if (citasCheck.data?.tieneCitasPendientes) {
        console.log('🚫 Doctor tiene citas pendientes, no se puede desactivar')
        return {
          success: false,
          tieneCitasPendientes: true,
          datosCitas: citasCheck.data,
          error: `No se puede desactivar al doctor. Tiene ${citasCheck.data.totalCitasPendientes} cita(s) pendiente(s). Debe reasignar las citas a otro doctor primero.`
        }
      }
      
      console.log('✅ Doctor no tiene citas pendientes, procediendo con desactivación')
      
      // Usar el endpoint DELETE correcto según especificación del backend
      console.log('🔄 Usando endpoint DELETE /api/doctores/:id')
      const token = localStorage.getItem('token')
      
      const response = await fetch(`https://backend-dental-bosch-vr8o.onrender.com/api/doctores/${doctorId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      const data = await response.json()
      console.log('� Respuesta DELETE:', data)
      
      if (!response.ok) {
        throw new Error(data.mensaje || 'Error al desactivar doctor')
      }
      
      // Emitir evento para que otros componentes se actualicen
      window.dispatchEvent(new CustomEvent('doctorStatusChanged', {
        detail: { doctorId, action: 'deactivated' }
      }))
      
      return { success: true, data }
    } catch (error) {
      console.error('❌ softDeleteDoctor - Error:', error)
      
      return {
        success: false,
        error: error.message || 'Error al desactivar doctor'
      }
    }
  }

  const reactivarDoctor = async (doctorId) => {
    try {
      console.log('📤 reactivarDoctor - Reactivando doctor:', doctorId)
      
      // TODO: Esperando endpoint de reactivación del backend
      // Por ahora, mostrar mensaje informativo
      return {
        success: false,
        error: 'Función de reactivación no disponible temporalmente. Contacte al administrador del sistema.'
      }
    } catch (error) {
      console.error('❌ reactivarDoctor - Error:', error)
      return {
        success: false,
        error: error.message || 'Error al reactivar doctor'
      }
    }
  }

  const value = {

    user,

    token,

    loading,

    login,

    register,

    logout,

    updateProfile,

    updateUser,

    updatePassword,

    refreshUserData,

    getPendingDoctors,

    approveDoctor,

    getAllDoctors,

    getAllDoctorsIncludingInactive,

    getInactiveDoctors,

    getDoctorById,

    getApprovedDoctors,

    deleteDoctor,

    getAdminCitas,

    getAdminCitaById,

    getAdminPacientes,

    getAdminPacienteById,

    getAdminUsers,

    deleteAdminPaciente,

    reasignarCitas,

    getAdminEstadisticas,

    aprobarDoctorAdmin,

    rechazarDoctorAdmin,

    verificarCitasDoctor,

    softDeleteDoctor,

    reactivarDoctor,

    isAuthenticated: !!token,

  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;

};

export default AuthContext;
