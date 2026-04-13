'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
const NAV = [
  { href: '/dashboard',              emoji: '🏠', label: 'Home' },
  { href: '/dashboard/workouts',     emoji: '💪', label: 'Treningi' },
  { href: '/dashboard/finance',      emoji: '💰', label: 'Finanse' },
  { href: '/dashboard/correlations', emoji: '📊', label: 'Korelacje' },
  { href: '/dashboard/settings',     emoji: '⚙️', label: 'Ustawienia' },
]
export default function BottomNav() {
  const pathname = usePathname()
  return (
    <nav className="flex items-center justify-center gap-2 px-6 py-3 bg-[#DAE8D4] border-t border-[#B8CDB2]">
      {NAV.map(({ href, emoji, label }) => (
        <Link key={href} href={href} className={`flex flex-col items-center gap-0.5 px-6 py-2 rounded-xl min-w-[80px] transition-colors ${pathname === href ? 'bg-[#5C7A4E] text-white' : 'text-[#3D5C35] hover:bg-[#B8CDB2]'}`}>
          <span className="text-2xl">{emoji}</span>
          <span className="text-[11px] font-medium">{label}</span>
        </Link>
      ))}
    </nav>
  )
}
