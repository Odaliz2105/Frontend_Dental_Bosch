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

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    if (token) {
      // Verificar token y obtener datos del usuario
      api
        .get("/api/auth/verificar-token")
        .then((response) => {
          const usuario = response.data.usuario;

          // Verificación adicional para doctores pendientes
          if (usuario.rol === "doctor" && usuario.estado !== "aprobado") {
            // Si es doctor pendiente, cerrar sesión
            localStorage.removeItem("token");
            setToken(null);
            setUser(null);
            return;
          }

          setUser(usuario);
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
      const response = await api.post("/api/auth/login", credentials);
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
      setUser(usuario);

      // Configurar Axios para incluir token en futuras peticiones
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.msg || "Error al iniciar sesión",
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

      if (error.response) {
        // El servidor respondió con un estado de error
        errorMessage =
          error.response.data?.mensaje ||
          error.response.data?.msg ||
          error.response.data?.error ||
          `Error del servidor (${error.response.status})`;
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

      // Limpiar datos vacíos para evitar problemas en el backend
      const cleanData = {};
      Object.keys(userData).forEach((key) => {
        if (
          userData[key] !== null &&
          userData[key] !== undefined &&
          userData[key] !== ""
        ) {
          cleanData[key] = userData[key];
        }
      });

      if (file) {
        const formData = new FormData();
        Object.keys(cleanData).forEach((key) => {
          formData.append(key, cleanData[key]);
        });
        formData.append("foto", file);
        // Usar endpoint específico según el rol
        if (user?.rol === "doctor") {
          response = await api.put("/api/doctores/perfil/doctor", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        } else {
          response = await api.put("/api/auth/perfil", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        }
      } else {
        // Usar endpoint específico según el rol - solo enviar datos limpios sin foto
        if (user?.rol === "doctor") {
          response = await api.put("/api/doctores/perfil/doctor", cleanData);
        } else {
          response = await api.put("/api/auth/perfil", cleanData);
        }
      }

      // 🔥 Actualizar el usuario con la respuesta del backend
      const updatedUser = response.data.data || response.data.usuario;

      setUser((prev) => ({
        ...prev,
        ...updatedUser,
      }));

      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.mensaje ||
          error.response?.data?.msg ||
          "Error al actualizar perfil",
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

      setUser(usuario);
    } catch (error) {
      console.error("Error refrescando datos del usuario:", error);
      // En caso de error, mantener el usuario actual pero loguear el problema
    }
  };

  // 🔥 Función para sincronizar datos del doctor
  const syncDoctorData = async (userData) => {
    try {
      // 1. Actualizar en el endpoint específico de doctores
      const response = await api.put("/api/doctores/perfil/doctor", userData);
      
      // 2. Actualizar el estado del usuario con la respuesta
      if (response.data.usuario) {
        setUser((prev) => ({
          ...prev,
          ...response.data.usuario,
        }));
      }
      
      // 3. Refrescar datos del usuario para asegurar persistencia
      await refreshUserData();
      
      return { success: true };
    } catch (error) {
      console.error("Error sincronizando datos del doctor:", error);
      return { 
        success: false, 
        error: error.response?.data?.mensaje || "Error al sincronizar datos" 
      };
    }
  };

  const updatePassword = async (passwordData) => {
    try {
      const response = await api.put(
        "/api/auth/actualizar-password",
        passwordData,
      );
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.msg || "Error al actualizar contraseña",
      };
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
      const activo = accion === 'aprobado' ? true : false
      const response = await api.put(
        `/api/admin/doctores/${doctorId}/estado`,
        { activo }
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
      return { success: true, data: response.data }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.mensaje || 'Error al obtener citas'
      }
    }
  }

  const getAdminPacientes = async (page = 1) => {
    try {
      const response = await api.get(`/api/admin/pacientes?page=${page}`)
      return { success: true, data: response.data }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.mensaje || 'Error al obtener pacientes'
      }
    }
  }

  const reasignarCitas = async (doctorOrigenId, doctorDestinoId, reasignarTodas = true) => {
    try {
      const response = await api.put(
        `/api/admin/doctores/${doctorOrigenId}/reasignar-citas`,
        { doctorDestino: doctorDestinoId, reasignarTodas }
      )
      return { success: true, data: response.data }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.mensaje || 'Error al reasignar citas'
      }
    }
  }

  const updateDoctorHorario = async (doctorId, horarioAtencion) => {
    try {
      const response = await api.put(`/api/doctores/${doctorId}`, { horarioAtencion })
      return { success: true, data: response.data }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.mensaje || 'Error al actualizar horario'
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

  
  const getDoctorProfile = async () => {
    try {
      const response = await api.get("/api/doctores/perfil/doctor");
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.msg || "Error al obtener perfil de doctor",
      };
    }
  };

  const updateDoctorProfile = async (userData) => {
    try {
      const response = await api.put("/api/doctores/perfil/doctor", userData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.msg || "Error al actualizar perfil de doctor",
      };
    }
  };

  // Configurar Axios para incluir token si existe
  useEffect(() => {
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, [token]);

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
    syncDoctorData,
    getPendingDoctors,
    approveDoctor,
    getAllDoctors,
    getDoctorById,
    getApprovedDoctors,
    deleteDoctor,
    getAdminCitas,
    getAdminPacientes,
    getAdminPacienteById,
    deleteAdminPaciente,
    reasignarCitas,
    updateDoctorHorario,
    getDoctorProfile,
    updateDoctorProfile,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
