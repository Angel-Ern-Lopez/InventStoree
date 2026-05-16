
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './pages/login'

const AppContent = () => {
  const { user, loading } = useAuth()

  if (loading) return <p>Loading...</p>
  if (!user) return <Login />

  return (
    <div>
      <h1>Inventory App</h1>
      {/* Dashboard will go here */}
    </div>
  )

}

const App = () => {
	return (
		<AuthProvider>
			<AppContent />
		</AuthProvider>
	)
}

export default App

