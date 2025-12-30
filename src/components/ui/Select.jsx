export function Select({ 
  label, 
  value, 
  onChange, 
  placeholder,
  required = false,
  error,
  helpText,
  className = '',
  options = [],
  ...props 
}) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium mb-2 text-white">
          {label}
          {required && <span className="text-white/60 ml-1">*</span>}
        </label>
      )}
      <select
        value={value}
        onChange={onChange}
        required={required}
        className={`
          w-full px-4 py-2 bg-transparent border border-white/20 rounded
          text-white
          focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/20
          transition-colors
          ${error ? 'border-red-500' : ''}
          ${className}
        `}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option 
            key={typeof option === 'string' ? option : option.value} 
            value={typeof option === 'string' ? option : option.value}
            className="bg-black text-white"
          >
            {typeof option === 'string' ? option : option.label}
          </option>
        ))}
      </select>
      {helpText && !error && (
        <p className="mt-1 text-sm text-white/60">{helpText}</p>
      )}
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  )
}

