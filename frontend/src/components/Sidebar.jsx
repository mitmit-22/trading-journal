import { Link, useNavigate, useLocation } from "react-router-dom"

function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    navigate("/login")
  }

  const navItem = (path, label) => (
    <Link
      to={path}
      className={`block px-4 py-2 rounded hover:bg-gray-700 ${
        location.pathname === path ? "bg-gray-700 font-semibold" : ""
      }`}
    >
      {label}
    </Link>
  )

  return (
    <div className="w-64 min-h-screen bg-gray-900 text-white flex flex-col p-4">
      <h1 className="text-xl font-bold mb-8">Alpha Journal</h1>
      <nav className="flex flex-col gap-2 flex-1">
        {navItem("/dashboard", "Dashboard")}
        {navItem("/trades", "Trades")}
        {navItem("/journal", "Journal")}
        {navItem("/todos", "Todos")}
        {navItem("/calendar", "Calendar")}
      </nav>
      <button
        onClick={handleLogout}
        className="mt-auto px-4 py-2 bg-red-600 rounded hover:bg-red-700"
      >
        Logout
      </button>
    </div>
  )
}

export default Sidebar