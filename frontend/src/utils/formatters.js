export const formatDate = (date) =>
  new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium' }).format(new Date(date))

export const formatDuration = (minutes) => {
  if (minutes < 60) return `${minutes}m`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}

export const formatXP = (xp) =>
  xp >= 1000 ? `${(xp / 1000).toFixed(1)}k` : String(xp)
