import ClockWidget from '@/components/widgets/ClockWidget'
import LofiRadio from '@/components/widgets/LofiRadio'
import AvatarSystem from '@/components/avatar/AvatarSystem'
export default function PassiveLayout() {
  return (
    <div className="w-full h-full grid" style={{ gridTemplateRows: 'auto 1fr auto', padding: 40, gap: 24 }}>
      <div className="flex justify-between items-start"><ClockWidget /><div /></div>
      <div className="flex items-center justify-center"><AvatarSystem /></div>
      <div className="flex justify-between items-end"><div /><LofiRadio /></div>
    </div>
  )
}
