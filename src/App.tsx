
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Layout from './components/layout'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import Settings from './pages/settings'


const AppRoutes = () => {
  const { User, loading } = useAuth()

  if (loading) return <p>Loading...</p>
  if (!User) return <Login />

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/products" element={<Products />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Route>
    </Routes>
  )
}

const App = () => {
	return (
		<BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="*" element={<AppRoutes />} />
          <Route element={<AppRoutes />} />
        </Routes>
      </AuthProvider>

    </BrowserRouter>
	)
}

export default App

