export default function Input({ label, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-offwhite-subtle text-xs uppercase tracking-wider">
          {label}
        </label>
      )}
      <input
        className={`glass-sm rounded-lg px-4 py-2.5 text-offwhite placeholder-offwhite-subtle text-sm outline-none focus:border-accent-violet transition-colors ${className}`}
        {...props}
      />
    </div>
  )
}
