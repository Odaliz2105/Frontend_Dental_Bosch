export const validarNombrePersonal = (valor, etiqueta) => {
  if (!valor || valor.trim() === '') {
    return `El ${etiqueta} es obligatorio`
  }
  
  const trimmed = valor.trim()
  if (trimmed.length < 2 || trimmed.length > 50) {
    return `El ${etiqueta} debe tener entre 2 y 50 caracteres`
  }

  const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/
  if (!regex.test(trimmed)) {
    return `El ${etiqueta} solo puede contener letras y espacios`
  }

  return ''
}

export const validarTelefonoEcuador = (valor) => {
  if (!valor || valor.trim() === '') {
    return 'El teléfono es obligatorio'
  }

  const trimmed = valor.trim()
  const regex = /^09\d{8}$/
  
  if (!regex.test(trimmed)) {
    if (trimmed.length !== 10) {
      return 'El teléfono debe tener 10 dígitos'
    }
    if (!trimmed.startsWith('09')) {
      return 'El teléfono debe comenzar por 09'
    }
    return 'El teléfono solo puede contener números'
  }

  return ''
}

export const validarEspecialidad = (valor) => {
  if (!valor || valor.trim() === '') {
    return 'La especialidad es obligatoria'
  }

  const trimmed = valor.trim()
  if (trimmed.length < 2 || trimmed.length > 100) {
    return 'La especialidad debe tener entre 2 y 100 caracteres'
  }

  const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s.,()/-]+$/
  if (!regex.test(trimmed)) {
    return 'La especialidad contiene caracteres no permitidos'
  }

  return ''
}

export const normalizarTextoPerfil = (valor) => {
  if (!valor) return ''
  return valor.trim().replace(/\s+/g, ' ')
}

export const validarCambioPassword = ({ passwordActual, passwordNuevo, confirmarPassword }) => {
  const errores = {
    passwordActual: '',
    passwordNuevo: '',
    confirmarPassword: ''
  }

  if (!passwordActual) {
    errores.passwordActual = 'La contraseña actual es obligatoria'
  }

  if (!passwordNuevo) {
    errores.passwordNuevo = 'La nueva contraseña es obligatoria'
  } else {
    if (passwordNuevo.length < 6) {
      errores.passwordNuevo = 'La nueva contraseña debe tener al menos 6 caracteres'
    } else if (!/[A-Z]/.test(passwordNuevo)) {
      errores.passwordNuevo = 'La nueva contraseña debe incluir una letra mayúscula'
    } else if (!/[0-9]/.test(passwordNuevo)) {
      errores.passwordNuevo = 'La nueva contraseña debe incluir un número'
    } else if (passwordNuevo === passwordActual) {
      errores.passwordNuevo = 'La nueva contraseña debe ser diferente de la contraseña actual'
    }
  }

  if (!confirmarPassword) {
    errores.confirmarPassword = 'Debes confirmar la nueva contraseña'
  } else if (confirmarPassword !== passwordNuevo) {
    errores.confirmarPassword = 'Las contraseñas nuevas no coinciden'
  }

  return errores
}

export const tieneErrores = (errores) => {
  return Object.values(errores).some(error => error !== '')
}
