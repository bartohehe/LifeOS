import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Clock, User, BarChart2, Bot, LogOut } from 'lucide-react'
import useAuth from '../../hooks/useAuth'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/timeline', icon: Clock, label: 'Timeline' },
  { to: '/profile', icon: User, label: 'Profile' },
  { to: '/analytics', icon: BarChart2, label: 'Analytics' },
  { to: '/ai', icon: Bot, label: 'AI Assistant' },
]

export default function Sidebar() {
  const { logout } = useAuth()

  return (
    <aside className="w-64 shrink-0 flex flex-col gap-2 p-4 border-r border-glass-border">
      {/* Logo */}
      <div className="px-3 py-4 mb-4">
        <span className="text-xl font-bold text-offwhite tracking-tight">
          ⚡ <span className="text-accent-violet-light">Life</span>OS
        </span>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors
              ${isActive
                ? 'glass text-offwhite'
                : 'text-offwhite-subtle hover:text-offwhite hover:bg-glass-surface'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <button
        onClick={logout}
        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-offwhite-subtle hover:text-red-400 transition-colors"
      >
        <LogOut size={18} />
        Sign out
      </button>
    </aside>
  )
}
