import type { Weather, AvatarLayers } from './types'
export function getAvatarLayers(weather: Weather): AvatarLayers {
  const clothing: AvatarLayers['clothing'] =
    weather.condition === 'rain' ? 'rain' :
    weather.temp < 5  ? 'winter' :
    weather.temp < 15 ? 'warm'   :
    weather.temp < 22 ? 'mild'   : 'hot'
  const accessory: AvatarLayers['accessory'] =
    weather.condition === 'rain' ? 'umbrella' :
    weather.temp > 22 ? 'sunglasses' :
    weather.temp < 5  ? 'scarf' : null
  return { clothing, accessory, windEffect: weather.windSpeed > 40, expression: 'normal', effect: null }
}
export async function fetchWeather(location: string): Promise<Weather> {
  const res = await fetch(`/api/weather?location=${encodeURIComponent(location)}`, { cache: 'no-store' })
  if (!res.ok) throw new Error(`Weather fetch failed: ${res.status}`)
  return res.json() as Promise<Weather>
}
