'use client'
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts'
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

const POLISH_DAYS = ['niedz', 'pon', 'wt', 'śr', 'czw', 'pt', 'sob']

function formatExpenseDate(isoString: string): string {
  const d = new Date(isoString)
  const day = POLISH_DAYS[d.getDay()]
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  return `${day} ${dd}.${mm}`
}

const POLISH_MONTHS: Record<string, string> = {
  '01': 'sty', '02': 'lut', '03': 'mar', '04': 'kwi',
  '05': 'maj', '06': 'cze', '07': 'lip', '08': 'sie',
  '09': 'wrz', '10': 'paź', '11': 'lis', '12': 'gru',
}

function formatMonth(dateStr: string): string {
  return POLISH_MONTHS[dateStr.slice(5, 7)] ?? dateStr
}

export default function FinancePage() {
  const { monthlyBudget, spent, expenses, netWorthHistory, currentNetWorth } = useFinance()

  const pct = monthlyBudget > 0 ? Math.round((spent / monthlyBudget) * 100) : 0
  const barColor = pct > 90 ? '#8B3A3A' : pct > 70 ? '#C8A87A' : '#5C7A4E'

  return (
    <div
      className="w-full h-full overflow-auto"
      style={{
        background: '#EFF5EC',
        padding: 24,
        display: 'grid',
        gridTemplateRows: 'auto 1fr',
        gap: 16,
      }}
    >
      {/* Row 1 — Budget bar */}
      <div className="card-beige px-5 py-4 flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <span className="text-[#3D5C35] text-xs uppercase tracking-widest">Budżet miesiąca</span>
          <span className="text-[#1E2D1A] text-sm font-medium">{pct}%</span>
        </div>
        <ProgressBar value={pct} color={barColor} height={12} />
        <span className="text-[#5C7A4E] text-xs">
          {spent.toLocaleString('pl-PL')} zł / {monthlyBudget.toLocaleString('pl-PL')} zł
        </span>
      </div>

      {/* Row 2 — Two columns */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 16,
        }}
      >
        {/* Left: Net worth chart */}
        <div className="card-green px-5 py-4 flex flex-col gap-3 h-full">
          <div className="flex justify-between items-center">
            <span className="text-[#3D5C35] text-xs uppercase tracking-widest">Majątek netto</span>
            <span
              style={{
                fontFamily: 'Georgia, serif',
                fontSize: 22,
                fontWeight: 700,
                color: '#1E2D1A',
                lineHeight: 1,
              }}
            >
              {currentNetWorth.toLocaleString('pl-PL')} zł
            </span>
          </div>
          <div style={{ flex: 1, minHeight: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={netWorthHistory} margin={{ top: 4, right: 4, left: -12, bottom: 0 }}>
                <XAxis
                  dataKey="date"
                  tickFormatter={formatMonth}
                  tick={{ fontSize: 10, fill: '#5C7A4E' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tickFormatter={(v: number) => (v >= 1000 ? `${v / 1000}k` : String(v))}
                  tick={{ fontSize: 10, fill: '#5C7A4E' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  formatter={(value: unknown, name: unknown) => [
                    `${Number(value).toLocaleString('pl-PL')} zł`,
                    String(name),
                  ]}
                  contentStyle={{
                    background: '#EFF5EC',
                    border: '1px solid #B8CDB2',
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="cash_pln"
                  stackId="nw"
                  fill="#B8CDB2"
                  stroke="#B8CDB2"
                  fillOpacity={1}
                />
                <Area
                  type="monotone"
                  dataKey="investments"
                  stackId="nw"
                  fill="#5C7A4E"
                  stroke="#5C7A4E"
                  fillOpacity={1}
                />
                <Area
                  type="monotone"
                  dataKey="crypto_pln"
                  stackId="nw"
                  fill="#3D5C35"
                  stroke="#3D5C35"
                  fillOpacity={1}
                />
                <Line
                  type="monotone"
                  dataKey="liabilities"
                  stroke="#8B3A3A"
                  strokeDasharray="4 2"
                  dot={false}
                  strokeWidth={2}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Expense history */}
        <div className="flex flex-col gap-2 overflow-y-auto h-full">
          <span className="text-[#3D5C35] text-xs uppercase tracking-widest">Historia wydatków</span>
          {expenses.map((expense) => (
            <div
              key={expense.id}
              className="card-beige px-4 py-3 flex justify-between items-center"
            >
              <div className="flex flex-col gap-0.5">
                <span className="text-[#1E2D1A] text-sm font-medium">
                  {formatExpenseDate(expense.created_at)}
                </span>
                {expense.note && (
                  <span className="text-[#5C7A4E] text-xs">{expense.note}</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#1E2D1A] text-sm font-medium">
                  {expense.amount.toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} zł
                </span>
                <Badge>{CATEGORY_LABELS[expense.category] ?? expense.category}</Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
