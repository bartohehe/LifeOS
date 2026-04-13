import { Calendar } from 'lucide-react'

const MOCK = {
  title: 'Spotkanie z Marcinem',
  startTime: '15:00',
  hoursUntil: 3,
}

export default function CalendarWidget() {
  return (
    <div className="card-green px-5 py-4 flex items-center gap-4">
      <Calendar size={32} color="#3D5C35" />
      <div className="flex flex-col gap-0.5 flex-1">
        <span className="text-[#3D5C35] text-xs uppercase tracking-widest">Następne wydarzenie</span>
        <span className="text-[#1E2D1A] text-base font-medium" style={{ fontFamily: 'Georgia, serif' }}>
          {MOCK.title}
        </span>
      </div>
      <div className="flex flex-col items-end gap-0.5">
        <span className="text-[#1E2D1A] text-sm font-medium">{MOCK.startTime}</span>
        <span className="text-[#5C7A4E] text-xs">za {MOCK.hoursUntil} godz.</span>
      </div>
    </div>
  )
}
