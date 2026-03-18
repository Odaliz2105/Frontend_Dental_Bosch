import React from 'react'
import dentalBoschLogo from '../assets/DentalBosch.png'

const Logo = ({ className = "", size = "medium" }) => {
  const sizeClasses = {
    small: "w-8 h-8",
    medium: "w-10 h-10", 
    large: "w-12 h-12"
  }

  const textSizes = {
    small: "text-lg",
    medium: "text-xl", 
    large: "text-2xl"
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img 
        src={dentalBoschLogo}
        alt="Dental Bosch Logo"
        className={`${sizeClasses[size]}`}
      />
      
      <span className={`font-bold ${textSizes[size]} bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent`}>
        Dental Bosch
      </span>
    </div>
  )
}

export default Logo
