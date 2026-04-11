import api from './axios'

export const getPlayer = () =>
  api.get('/api/stats/player/')

export const getStats = () =>
  api.get('/api/stats/player/')
