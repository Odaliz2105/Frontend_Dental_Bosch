import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import doctorService from '../services/doctorService'
import Input from './Input'
import Button from './Button'

import ChangePasswordForm from './ChangePasswordForm'
import { validarNombrePersonal, validarEspecialidad, normalizarTextoPerfil, tieneErrores } from '../utils/profileValidation'

const DoctorProfile = () => {
  const { user, refreshUserData } = useAuth()

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    especialidad: ''
  })

  const [profileErrors, setProfileErrors] = useState({
    nombre: '',
    apellido: '',
    especialidad: ''
  })

  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

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


  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setProfileErrors(prev => ({ ...prev, [name]: '' }))
    setError('')
    setSuccess('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    setError('')
    setSuccess('')
    
    const nuevosErrores = {
      nombre: validarNombrePersonal(formData.nombre, 'nombre'),
      apellido: validarNombrePersonal(formData.apellido, 'apellido'),
      especialidad: validarEspecialidad(formData.especialidad)
    }
    
    if (tieneErrores(nuevosErrores)) {
      setProfileErrors(nuevosErrores)
      return
    }

    setLoading(true)

    try {
      const payload = {
        nombre: normalizarTextoPerfil(formData.nombre),
        apellido: normalizarTextoPerfil(formData.apellido),
        especialidad: normalizarTextoPerfil(formData.especialidad)
      }

      const result = await doctorService.updateDoctorProfile(payload)
      if (result.success) {
        await refreshUserData()
        setSuccess('✅ Perfil actualizado correctamente')
        setIsEditing(false)
        setProfileErrors({ nombre: '', apellido: '', especialidad: '' })
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
      nombre: user?.nombre || '',
      apellido: user?.apellido || '',
      especialidad: user?.especialidad || ''
    })
    setProfileErrors({ nombre: '', apellido: '', especialidad: '' })
    setError('')
    setSuccess('')
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
          error={profileErrors.nombre}
          required={isEditing}
        />

        <Input
          label="Apellido"
          name="apellido"
          value={formData.apellido}
          onChange={handleChange}
          disabled={!isEditing}
          error={profileErrors.apellido}
          required={isEditing}
        />

        <Input
          label="Especialidad"
          name="especialidad"
          value={formData.especialidad}
          onChange={handleChange}
          disabled={!isEditing}
          error={profileErrors.especialidad}
          required={isEditing}
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

      <ChangePasswordForm />
    </div>
  )
}

export default DoctorProfile