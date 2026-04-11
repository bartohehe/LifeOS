const variants = {
  primary: 'bg-accent-violet hover:bg-accent-violet-dark text-offwhite shadow-violet transition-colors',
  ghost: 'glass-sm hover:bg-glass-highlight text-offwhite transition-colors',
  danger: 'bg-red-600 hover:bg-red-700 text-white transition-colors',
}

export default function Button({ variant = 'primary', className = '', children, ...props }) {
  return (
    <button
      className={`px-4 py-2 rounded-lg font-medium text-sm ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
