import { useState, useEffect } from 'react'
import { getPlayer } from '../api/stats'

export default function useStats() {
  const [player, setPlayer] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    getPlayer()
      .then((res) => setPlayer(res.data))
      .catch((err) => setError(err))
      .finally(() => setLoading(false))
  }, [])

  return { player, loading, error }
}
