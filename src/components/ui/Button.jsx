export function Button({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary',
  disabled = false,
  className = '',
  as,
  ...props 
}) {
  const baseClasses = 'px-4 py-2 rounded font-medium transition-colors min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variants = {
    primary: 'bg-white text-black hover:bg-white/90',
    secondary: 'bg-transparent border border-white/20 text-white hover:bg-white/5 hover:border-white/30',
    danger: 'bg-white text-black hover:bg-white/90',
  }

  const Component = as || 'button'
  const buttonProps = as === 'span' ? {} : { type, onClick, disabled }

  return (
    <Component
      {...buttonProps}
      className={`${baseClasses} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </Component>
  )
}

