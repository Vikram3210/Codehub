import React from 'react'
import logo from '/vite.svg'

export default function Logo({ size = 64 }) {
  return (
    <img
      src={logo}
      alt="CodeHub"
      width={size}
      height={size}
      style={{ filter: 'drop-shadow(0 0 8px rgba(0, 234, 255, 0.6))' }}
    />
  )
}