interface CardProps { variant?: 'green' | 'beige'; className?: string; children: React.ReactNode }
export default function Card({ variant = 'green', className = '', children }: CardProps) {
  return <div className={`${variant === 'beige' ? 'card-beige' : 'card-green'} ${className}`}>{children}</div>
}
