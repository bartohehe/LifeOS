const variants = {
  violet: 'bg-accent-violet/20 border border-accent-violet/40 text-accent-violet-light',
  glass: 'glass-sm text-offwhite-muted',
  xp: 'bg-xp-start/20 border border-xp-start/40 text-accent-violet-light',
}

export default function Badge({ variant = 'glass', children, className = '' }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  )
}
