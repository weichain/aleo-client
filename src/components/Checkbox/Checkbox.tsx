import { useState } from 'react'

interface CheckboxProps {
  labels: string[]
  handleChecked: (checked: boolean) => void
}

const Checkbox = ({ labels, handleChecked }: CheckboxProps) => {
  const [checked, setChecked] = useState(false)

  const handleChange = () => {
    setChecked(!checked)
    handleChecked(!checked)
  }

  return (
    <div>
      <input type="checkbox" checked={checked} onChange={handleChange} />
      <label>{labels[checked ? 0 : 1]}</label>
    </div>
  )
}

export default Checkbox
