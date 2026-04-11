import api from './axios'

export const getActivities = (params) =>
  api.get('/api/activities/', { params })

export const createActivity = (data) =>
  api.post('/api/activities/', data)

export const updateActivity = (id, data) =>
  api.patch(`/api/activities/${id}/`, data)

export const deleteActivity = (id) =>
  api.delete(`/api/activities/${id}/`)
