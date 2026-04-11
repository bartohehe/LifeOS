import api from './axios'

export const analyzeDay = (data) =>
  api.post('/api/ai/analyze/', data)

export const planDay = (data) =>
  api.post('/api/ai/plan/', data)
