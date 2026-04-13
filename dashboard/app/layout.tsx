import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'LifeOS Dashboard',
  description: 'Your life, visualized.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl">
      <body className="w-screen h-screen overflow-hidden select-none">{children}</body>
    </html>
  )
}
