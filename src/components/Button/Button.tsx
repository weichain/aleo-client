import React from 'react';
import './Button.css'

interface ButtonProps {
    text: string
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  }
  

export const Button = ({ text, onClick }: ButtonProps) => {
    return <button className="btn" onClick={onClick}>{text}</button>
}

export default Button;