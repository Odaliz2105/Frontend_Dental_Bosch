import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import Input from './Input'
import Button from './Button'
import { validarCambioPassword, tieneErrores } from '../utils/profileValidation'

const ChangePasswordForm = () => {
  const { updatePassword } = useAuth()
  
  const [showPasswordSection, setShowPasswordSection] = useState(false)
  const [passwordData, setPasswordData] = useState({
    passwordActual: '',
    passwordNuevo: '',
    confirmarPassword: ''
  })
  
  const [errors, setErrors] = useState({
    passwordActual: '',
    passwordNuevo: '',
    confirmarPassword: ''
  })
  
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordSuccess, setPasswordSuccess] = useState('')
  const [globalError, setGlobalError] = useState('')

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: '' }))
    setPasswordSuccess('')
    setGlobalError('')
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    
    if (passwordLoading) return

    setGlobalError('')
    setPasswordSuccess('')

    const nuevosErrores = validarCambioPassword(passwordData)
    if (tieneErrores(nuevosErrores)) {
      setErrors(nuevosErrores)
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
        setErrors({ passwordActual: '', passwordNuevo: '', confirmarPassword: '' })
      } else {
        setGlobalError(result.error || 'Error al actualizar contraseña')
      }
    } catch (err) {
      setGlobalError('Error de conexión')
    } finally {
      setPasswordLoading(false)
    }
  }

  return (
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
            if (!showPasswordSection) {
              setPasswordData({ passwordActual: '', passwordNuevo: '', confirmarPassword: '' })
              setErrors({ passwordActual: '', passwordNuevo: '', confirmarPassword: '' })
              setGlobalError('')
              setPasswordSuccess('')
            }
          }}
        >
          {showPasswordSection ? 'Cancelar' : 'Cambiar contraseña'}
        </Button>
      </div>

      {passwordSuccess && (
        <p className="text-green-600 mb-3 text-sm">{passwordSuccess}</p>
      )}

      {globalError && (
        <p className="text-red-600 mb-3 text-sm">{globalError}</p>
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
            error={errors.passwordActual}
            autoComplete="current-password"
            required
          />

          <div>
            <Input
              label="Nueva contraseña"
              type="password"
              name="passwordNuevo"
              value={passwordData.passwordNuevo}
              onChange={handlePasswordChange}
              placeholder="Mínimo 6 caracteres"
              error={errors.passwordNuevo}
              autoComplete="new-password"
              required
            />
            <p className="text-xs text-gray-500 mt-1 ml-1">
              Mínimo 6 caracteres, una mayúscula y un número.
            </p>
          </div>

          <Input
            label="Confirmar nueva contraseña"
            type="password"
            name="confirmarPassword"
            value={passwordData.confirmarPassword}
            onChange={handlePasswordChange}
            placeholder="Repite la nueva contraseña"
            error={errors.confirmarPassword}
            autoComplete="new-password"
            required
          />

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
  )
}

export default ChangePasswordForm
