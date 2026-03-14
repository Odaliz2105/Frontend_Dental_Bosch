import React from 'react'

const Logo = ({ className = "", size = "medium" }) => {
  const sizeClasses = {
    small: "w-8 h-8",
    medium: "w-10 h-10", 
    large: "w-12 h-12"
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg 
        className={`${sizeClasses[size]}`}
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Diente estilizado */}
        <path 
          d="M50 10C35 10 25 20 25 35C25 45 30 50 30 60C30 70 25 85 35 90C40 92 45 85 50 85C55 85 60 92 65 90C75 85 70 70 70 60C70 50 75 45 75 35C75 20 65 10 50 10Z" 
          fill="url(#toothGradient)"
          stroke="#FF4FA3"
          strokeWidth="2"
        />
        
        {/* Detalles del diente */}
        <circle cx="40" cy="40" r="3" fill="#38D6C4" opacity="0.8"/>
        <circle cx="60" cy="40" r="3" fill="#38D6C4" opacity="0.8"/>
        <path 
          d="M45 50Q50 55 55 50" 
          stroke="#38D6C4" 
          strokeWidth="2" 
          fill="none" 
          opacity="0.8"
        />
        
        {/* Gradiente */}
        <defs>
          <linearGradient id="toothGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF4FA3" stopOpacity="0.1"/>
            <stop offset="100%" stopColor="#38D6C4" stopOpacity="0.1"/>
          </linearGradient>
        </defs>
      </svg>
      
      <span className="font-bold text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
        Dental Bosch
      </span>
    </div>
  )
}

export default Logo
