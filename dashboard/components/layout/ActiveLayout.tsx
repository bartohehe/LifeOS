import BottomNav from './BottomNav'
export default function ActiveLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-full">
      <main className="flex-1 overflow-hidden">{children}</main>
      <BottomNav />
    </div>
  )
}
