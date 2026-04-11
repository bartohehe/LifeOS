import { useState, useEffect } from 'react'
import { getActivities } from '../api/activities'

export default function useActivities() {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    getActivities()
      .then((res) => setActivities(res.data.results ?? res.data))
      .catch((err) => setError(err))
      .finally(() => setLoading(false))
  }, [])

  return { activities, loading, error }
}
