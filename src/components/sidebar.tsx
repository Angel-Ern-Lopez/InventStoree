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
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="brand-mark" aria-hidden="true">IS</span>
        <span>InvenStoree</span>
      </div>

      <nav className="sidebar-nav" aria-label="Primary navigation">
        <NavLink className="sidebar-link" to="/dashboard">
          <span className="sidebar-icon" aria-hidden="true">⌂</span>
          <span>Dashboard</span>
        </NavLink>
        <NavLink className="sidebar-link" to="/products">
          <span className="sidebar-icon" aria-hidden="true">▦</span>
          <span>Products</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <NavLink className="sidebar-link" to="/settings" aria-label="Settings">
          <span className="sidebar-icon settings-icon" aria-hidden="true">⚙</span>
          <span>Settings</span>
        </NavLink>
        <button className="sidebar-signout" onClick={handleLogout}>Sign out</button>
      </div>
    </aside>
  )
}

export default Sidebar