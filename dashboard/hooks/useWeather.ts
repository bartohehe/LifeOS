// Sprint: implement weather polling
export default function useWeather(_location: string) {
  return { weather: null as null, error: null as string | null, reload: () => {} }
}
