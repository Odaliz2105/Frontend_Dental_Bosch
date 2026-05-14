import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import doctorService from '../services/doctorService'
import Input from './Input'
import Button from './Button'

const DoctorProfile = () => {
  const { user, updatePassword, refreshUserData } = useAuth()

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    especialidad: ''
  })

  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  // Sección contraseña
  const [showPasswordSection, setShowPasswordSection] = useState(false)
  const [passwordData, setPasswordData] = useState({
    passwordActual: '',
    passwordNuevo: '',
    confirmarPassword: ''
  })
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordSuccess, setPasswordSuccess] = useState('')
  const [passwordError, setPasswordError] = useState('')

  // Sincroniza user con form
  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.nombre || '',
        apellido: user.apellido || '',
        especialidad: user.especialidad || ''
      })
    }
  }, [user])

  // Carga especialidad desde el perfil del doctor
  useEffect(() => {
    const cargarEspecialidad = async () => {
      const result = await doctorService.getDoctorProfile()
      if (result.success) {
        const especialidad =
          result.data.data?.especialidad ||
          result.data.especialidad || ''
        if (especialidad) {
          setFormData(prev => ({ ...prev, especialidad }))
        }
      }
    }
    cargarEspecialidad()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const result = await doctorService.updateDoctorProfile(formData)
      if (result.success) {
        await refreshUserData()
        setSuccess('✅ Perfil actualizado correctamente')
        setIsEditing(false)
      } else {
        setError(result.error || 'Error al actualizar perfil')
      }
    } catch (err) {
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setFormData({
      nombre: user.nombre || '',
      apellido: user.apellido || '',
      especialidad: user.especialidad || ''
    })
    setError('')
    setSuccess('')
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData(prev => ({ ...prev, [name]: value }))
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    setPasswordError('')
    setPasswordSuccess('')

    if (passwordData.passwordNuevo !== passwordData.confirmarPassword) {
      setPasswordError('Las contraseñas nuevas no coinciden')
      return
    }

    if (passwordData.passwordNuevo.length < 6) {
      setPasswordError('La contraseña debe tener al menos 6 caracteres, incluir mayúsculas y números')
      return
    }

    setPasswordLoading(true)
    try {
      const result = await updatePassword({
        passwordActual: passwordData.passwordActual,
        passwordNuevo: passwordData.passwordNuevo
      })

      if (result.success) {
        setPasswordSuccess('✅ Contraseña actualizada correctamente')
        setPasswordData({ passwordActual: '', passwordNuevo: '', confirmarPassword: '' })
        setShowPasswordSection(false)
      } else {
        setPasswordError(result.error || 'Error al actualizar contraseña')
      }
    } catch (err) {
      setPasswordError('Error de conexión')
    } finally {
      setPasswordLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4">Perfil del Doctor</h2>

      {success && <p className="text-green-600 mb-2 text-sm">{success}</p>}
      {error && <p className="text-red-600 mb-2 text-sm">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          disabled={!isEditing}
        />

        <Input
          label="Apellido"
          name="apellido"
          value={formData.apellido}
          onChange={handleChange}
          disabled={!isEditing}
        />

        <Input
          label="Especialidad"
          name="especialidad"
          value={formData.especialidad}
          onChange={handleChange}
          disabled={!isEditing}
        />

        <Input
          label="Email"
          value={user?.email || ''}
          disabled
        />

        <Input
          label="Cédula"
          value={user?.cedula || ''}
          disabled
        />

        <div className="flex justify-end gap-2 mt-4">
          {isEditing ? (
            <>
              <Button type="button" onClick={handleCancel}>
                Cancelar
              </Button>
              <Button type="submit" loading={loading}>
                Guardar
              </Button>
            </>
          ) : (
            <Button type="button" onClick={() => setIsEditing(true)}>
              Editar
            </Button>
          )}
        </div>
      </form>

      {/* Sección cambio de contraseña */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Cambiar Contraseña
          </h3>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setShowPasswordSection(!showPasswordSection)
              setPasswordData({ passwordActual: '', passwordNuevo: '', confirmarPassword: '' })
              setPasswordError('')
              setPasswordSuccess('')
            }}
          >
            {showPasswordSection ? 'Cancelar' : 'Cambiar contraseña'}
          </Button>
        </div>

        {passwordSuccess && (
          <p className="text-green-600 mb-3 text-sm">{passwordSuccess}</p>
        )}

        {showPasswordSection && (
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <Input
              label="Contraseña actual"
              type="password"
              name="passwordActual"
              value={passwordData.passwordActual}
              onChange={handlePasswordChange}
              placeholder="Ingresa tu contraseña actual"
              required
            />

            <Input
              label="Nueva contraseña"
              type="password"
              name="passwordNuevo"
              value={passwordData.passwordNuevo}
              onChange={handlePasswordChange}
              placeholder="Mínimo 6 caracteres"
              required
            />

            <Input
              label="Confirmar nueva contraseña"
              type="password"
              name="confirmarPassword"
              value={passwordData.confirmarPassword}
              onChange={handlePasswordChange}
              placeholder="Repite la nueva contraseña"
              required
            />

            {passwordError && (
              <p className="text-red-600 text-sm">{passwordError}</p>
            )}

            <div className="flex justify-end">
              <Button
                type="submit"
                loading={passwordLoading}
                disabled={passwordLoading}
              >
                Actualizar Contraseña
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default DoctorProfile