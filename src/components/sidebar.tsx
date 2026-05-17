import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Sidebar = () => {
  const { signOut } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    // Logout logic here
    await signOut()
    navigate('/login')
  }

  return (
    <aside>
        <div>
            <h1>InvenStoree</h1>
        </div>

        <nav>
            <NavLink to="/dashboard">Dashboard</NavLink>
            <NavLink to="/products">Products</NavLink>
            <NavLink to="/settings">Settings</NavLink>
        </nav>

        <button onClick={handleLogout}>Sign out</button>
    </aside>
  )
}

export default Sidebar