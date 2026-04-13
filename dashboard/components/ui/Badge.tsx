import type { ReactNode } from 'react'

export default function Badge({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[13px] font-medium bg-[#E8D5B7] text-[#1E2D1A] border border-[#C8A87A] ${className}`}>{children}</span>
}
