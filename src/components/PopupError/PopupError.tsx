import { useState, useEffect } from 'react'
import Popup from 'reactjs-popup'
import 'reactjs-popup/dist/index.css'

interface PopupErrorProps {
  message: Error | undefined
}

const PopupError = ({ message }: PopupErrorProps) => {
  const [open, setOpen] = useState<boolean>()
  const closeModal = () => setOpen(false)

  useEffect(() => {
    setOpen(message ? true : false)
  }, [message])

  return (
    <Popup open={open} closeOnDocumentClick onClose={closeModal}>
      <div className="modal">
        <a className="close" onClick={closeModal}>
          &times;
        </a>
        {message?.message}
      </div>
    </Popup>
  )
}

export default PopupError
