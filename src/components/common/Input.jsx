import './Input.css'

export default function Input({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  disabled = false,
  required = false,
  name,
  id,
  className = '',
  suffix // New prop for eye icons, etc.
}) {
  const inputId = id || name || label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className={`input-group ${className}`}>
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      <div className="input-wrapper" style={{ position: 'relative' }}>
        <input
          id={inputId}
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`input-field ${error ? 'error' : ''}`}
          style={{ width: '100%', paddingRight: suffix ? '3.5rem' : '1rem' }}
        />
        {suffix && (
          <div className="input-suffix">
            {suffix}
          </div>
        )}
      </div>
      {error && <span className="input-error">{error}</span>}
    </div>
  )
}
