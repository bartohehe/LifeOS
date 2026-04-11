import api from './axios'

export const getAchievements = () =>
  api.get('/api/achievements/')
