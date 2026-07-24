export const obtenerFechaLocalCita = citaOFecha => {
  const valor = typeof citaOFecha === 'object' && citaOFecha !== null
    ? citaOFecha.fecha || citaOFecha.fechaISO
    : citaOFecha;

  if (!valor) return null;

  if (typeof valor === 'string' && /^\d{4}-\d{2}-\d{2}/.test(valor)) {
    const [anio, mes, dia] = valor.split('T')[0].split('-').map(Number);
    const fecha = new Date(anio, mes - 1, dia);
    return Number.isNaN(fecha.getTime()) ? null : fecha;
  }

  const fecha = new Date(valor);
  return Number.isNaN(fecha.getTime()) ? null : fecha;
};

export const formatearFechaCita = (citaOFecha, { formato = 'corto' } = {}) => {
  const fecha = obtenerFechaLocalCita(citaOFecha);

  if (!fecha) return 'Fecha no disponible';

  if (formato === 'largo') {
    const texto = fecha.toLocaleDateString('es-EC', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    return texto.charAt(0).toUpperCase() + texto.slice(1);
  }

  if (formato === 'corto-mes') {
    const texto = fecha.toLocaleDateString('es-EC', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
    return texto.charAt(0).toUpperCase() + texto.slice(1);
  }

  return fecha.toLocaleDateString('es-EC');
};
