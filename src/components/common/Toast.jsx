import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ── TOAST ─────────────────────────────────────────────────

const Toast = ({ toast }) => (

  <AnimatePresence>

    {toast && (

      <motion.div

        initial={{ opacity: 0, y: -20 }}

        animate={{ opacity: 1, y: 0 }}

        exit={{ opacity: 0, y: -20 }}

        className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg text-white text-sm font-medium

          ${toast.tipo === 'success' ? 'bg-green-600' : 'bg-red-600'}`}

      >

        {toast.msg}

      </motion.div>

    )}

  </AnimatePresence>

)

export default Toast
