import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FiEye, FiEyeOff } from 'react-icons/fi'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()

    try {
      const res = await fetch('http://localhost:3000/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (res.ok) {
        localStorage.setItem("user", JSON.stringify(data.payload))
        toast.success("Login berhasil!")
        navigate('/')
      } else {
        setError(data.message || 'Login gagal')
      }
    } catch (err) {
      setError('Terjadi kesalahan server')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

        {error && <p className="text-red-500 mb-2 text-center">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border mb-3 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* Password field with toggle */}
        <div className="relative mb-4">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            className="w-full p-2 border rounded pr-10"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 cursor-pointer"
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </div>
        </div>

        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          Login
        </button>

        <p className="text-sm mt-4 text-center">
          Belum punya akun? <a href="/register" className="text-blue-500 underline">Daftar di sini</a>
        </p>
      </form>
    </div>
  )
}

export default Login
