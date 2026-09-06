
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Layout from './components/layout'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import Settings from './pages/Settings'


const AppRoutes = () => {
  const { User, loading } = useAuth()

  if (loading) return <p>Loading...</p>

  return (
    <Routes>
      <Route
        path="/login"
        element={User ? <Navigate to="/dashboard" replace /> : <Login />}
      />
      <Route element={User ? <Layout /> : <Navigate to="/login" replace />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/products" element={<Products />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to={User ? "/dashboard" : "/login"} replace />} />
    </Routes>
  )
}

const App = () => {
	return (
		<BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>

    </BrowserRouter>
	)
}

export default App

