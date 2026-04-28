import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import Input from './Input'
import Button from './Button'

const DoctorProfile = () => {
  const { user, updateUser, refreshUserData, syncDoctorData } = useAuth()

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    especialidad: ''
  })

  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  // 🔥 SINCRONIZA USER → FORM
  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.nombre || '',
        apellido: user.apellido || '',
        telefono: user.telefono || '',
        especialidad: user.especialidad || ''
      })
    }
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      console.log('Enviando datos del perfil:', formData);
      
      // 🔥 Usar syncDoctorData para asegurar persistencia en ambos endpoints
      const result = await syncDoctorData(formData)

      console.log('Resultado de syncDoctorData:', result);

      if (result.success) {
        setSuccess('✅ Perfil actualizado correctamente')
        setIsEditing(false)
      } else {
        console.error('Error en syncDoctorData:', result.error);
        setError(result.error)
      }

    } catch (err) {
      console.error('Error en handleSubmit:', err);
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)

    // 🔥 volver a valores originales
    setFormData({
      nombre: user.nombre || '',
      apellido: user.apellido || '',
      telefono: user.telefono || '',
      especialidad: user.especialidad || ''
    })

    setError('')
    setSuccess('')
  }

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow">

      <h2 className="text-xl font-bold mb-4">Perfil del Doctor</h2>

      {/* MENSAJES */}
      {success && <p className="text-green-600 mb-2">{success}</p>}
      {error && <p className="text-red-600 mb-2">{error}</p>}

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
          label="Teléfono"
          name="telefono"
          value={formData.telefono}
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

        {/* 🔥 EMAIL NO EDITABLE */}
        <Input
          label="Email"
          value={user?.email || ''}
          disabled
        />

        {/* 🔥 CÉDULA NO EDITABLE */}
        <Input
          label="Cédula"
          value={user?.cedula || ''}
          disabled
        />

        {/* BOTONES */}
        <div className="flex justify-end gap-2 mt-4">
          {isEditing ? (
            <>
              <Button onClick={handleCancel}>
                Cancelar
              </Button>

              <Button type="submit" loading={loading}>
                Guardar
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              Editar
            </Button>
          )}
        </div>

      </form>
    </div>
  )
}

export default DoctorProfile