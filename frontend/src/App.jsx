import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import Timeline from './pages/Timeline'
import Profile from './pages/Profile'
import Analytics from './pages/Analytics'
import AIAssistant from './pages/AIAssistant'
import Login from './pages/Login'
import Register from './pages/Register'
import useAuthStore from './store/authStore'

function PrivateRoute({ children }) {
  const token = useAuthStore((s) => s.token)
  return token ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="timeline" element={<Timeline />} />
        <Route path="profile" element={<Profile />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="ai" element={<AIAssistant />} />
      </Route>
    </Routes>
  )
}
