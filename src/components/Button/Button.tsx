import React from 'react'
import './Button.css'

interface ButtonProps {
  text: string
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void
  className?: string
}

export const Button = ({ text, onClick, className = 'btn' }: ButtonProps) => {
  return (
    <button className={className} onClick={onClick}>
      {text}
    </button>
  )
}

export default Button
