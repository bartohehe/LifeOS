// Sprint: implement life score polling
export default function useLifeScore() {
  return { data: null, score: null as number | null, error: null as string | null, reload: () => {} }
}
