import { NextResponse } from 'next/server'

export async function GET(request: Request) {
 //--- Real API (uncomment when NEXT_PUBLIC_OWM_API_KEY is set in .env.local) ---
 const { searchParams } = new URL(request.url)
 const city = searchParams.get('city') || process.env.OPENWEATHER_LOCATION || 'Wroclaw,PL'
 const apiKey = process.env.OPENWEATHER_API_KEY
 if (!apiKey) return NextResponse.json({ error: 'OWM_API_KEY not set' }, { status: 500 })
 const res = await fetch(
   `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`,
   { next: { revalidate: 3600 } }
 )
 if (!res.ok) return NextResponse.json({ error: 'OWM fetch failed' }, { status: 502 })
 const d = await res.json()
 return NextResponse.json({
   temp: Math.round(d.main.temp),
   condition: d.weather[0].main.toLowerCase(),
   location: d.name,
   humidity: d.main.humidity,
   windSpeed: Math.round(d.wind.speed * 3.6), // m/s → km/h
   icon: d.weather[0].icon,
 })
}
