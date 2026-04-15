'use client'
import useFinance from '@/hooks/useFinance'
import ProgressBar from '@/components/ui/ProgressBar'
import Badge from '@/components/ui/Badge'

const CATEGORY_LABELS: Record<string, string> = {
  food: 'jedzenie',
  transport: 'transport',
  entertainment: 'rozrywka',
  health: 'zdrowie',
  housing: 'mieszkanie',
  other: 'inne',
}

export default function FinanceWidget() {
  const { monthlyBudget, spent, currentNetWorth, expenses } = useFinance()
  const pct = Math.round((spent / monthlyBudget) * 100)
  const lastExpense = expenses[0] ?? null

  return (
    <div className="card-beige px-5 py-4 flex flex-col gap-4 h-full">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <span className="text-[#3D5C35] text-xs uppercase tracking-widest">Budżet miesiąca</span>
          <span className="text-[#1E2D1A] text-sm font-medium">{pct}%</span>
        </div>
        <ProgressBar value={pct} color={pct > 90 ? '#8B3A3A' : pct > 70 ? '#C8A87A' : '#5C7A4E'} height={10} />
        <span className="text-[#5C7A4E] text-xs">{spent.toLocaleString('pl-PL')} / {monthlyBudget.toLocaleString('pl-PL')} zł</span>
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-[#3D5C35] text-xs uppercase tracking-widest">Majątek netto</span>
        <span style={{ fontFamily: 'Georgia, serif', fontSize: 28, fontWeight: 700, color: '#1E2D1A', lineHeight: 1 }}>
          {currentNetWorth.toLocaleString('pl-PL')} zł
        </span>
      </div>

      {lastExpense && (
        <div className="flex flex-col gap-1">
          <span className="text-[#3D5C35] text-xs uppercase tracking-widest">Ostatni wydatek</span>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[#1E2D1A] text-sm font-medium">{lastExpense.amount.toFixed(2)} zł</span>
            <Badge>{CATEGORY_LABELS[lastExpense.category] ?? lastExpense.category}</Badge>
            <span className="text-[#5C7A4E] text-sm">{lastExpense.note}</span>
          </div>
        </div>
      )}
    </div>
  )
}
