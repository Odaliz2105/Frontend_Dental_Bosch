import React from 'react'

// ── BADGE ESTADO ──────────────────────────────────────────

const EstadoBadge = ({ estado }) => {

  const config = {

    pendiente:  'bg-amber-100 text-amber-800 border-amber-300',

    aprobado:   'bg-green-100  text-green-700  border-green-200',

    rechazado:  'bg-red-100    text-red-700    border-red-200',

    confirmada: 'bg-blue-100   text-blue-700   border-blue-200',

    finalizada: 'bg-emerald-100 text-emerald-800 border-emerald-300',

    cancelada:  'bg-red-100    text-red-700    border-red-200',

  }

  const labels = {

    pendiente: 'Pendiente', aprobado: 'Aprobado',

    rechazado: 'Rechazado', confirmada: 'Confirmada', finalizada: 'Finalizada', cancelada: 'Cancelada',

  }

  return (

    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config[estado] || config.pendiente}`}>

      {labels[estado] || estado}

    </span>

  )

}

export default EstadoBadge
