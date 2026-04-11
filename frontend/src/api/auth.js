import api from './axios'

export const login = (username, password) =>
  api.post('/api/auth/token/', { username, password })

export const register = (username, email, password, passwordConfirm) =>
  api.post('/api/auth/register/', { username, email, password, password_confirm: passwordConfirm })

export const refreshToken = (refresh) =>
  api.post('/api/auth/token/refresh/', { refresh })

export const getMe = () =>
  api.get('/api/auth/me/')
