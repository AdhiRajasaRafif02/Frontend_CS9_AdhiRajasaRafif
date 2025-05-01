import { Link, useNavigate } from 'react-router-dom'

function Navbar() {
  const user = JSON.parse(localStorage.getItem("user"))
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem("user")
    navigate("/login")
  }

  return (
    <nav className="bg-white shadow px-4 py-2 flex justify-between items-center mb-4">
      <div className="text-xl font-bold">
        <Link to="/">Online Shop</Link>
      </div>

      <div className="flex items-center gap-4">
        <Link to="/" className="hover:underline">Home</Link>
        {user && <Link to="/cart" className="hover:underline">Cart</Link>}

        {!user ? (
          <>
            <Link to="/login" className="hover:underline">Login</Link>
            <Link to="/register" className="hover:underline">Register</Link>
          </>
        ) : (
          <>
            <span className="text-gray-600 text-sm">Hi, {user.name.split(" ")[0]}</span>
            <button onClick={handleLogout} className="text-red-500 hover:underline text-sm">
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar
