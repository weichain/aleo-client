import './InputGroup.css'

interface InputGroupProps {
  label: string
  id: string
  register: any
  placeholder: string
  errors: any
}

const InputGroup = ({
  label,
  id,
  register,
  placeholder,
  errors,
}: InputGroupProps) => {
  return (
    <div className="input-group">
      <label htmlFor={id}>{label}</label>
      <textarea id={id} {...register(id)} placeholder={placeholder} />
      {errors[id] && <p>{errors[id].message}</p>}
    </div>
  )
}

export default InputGroup
