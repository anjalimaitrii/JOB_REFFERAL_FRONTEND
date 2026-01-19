import { useState } from 'react'
import { loginUser } from '../services/login.service'
import { useNavigate } from 'react-router-dom'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginAs, setLoginAs] = useState<'student' | 'employee' | null>(null)
  const [loading, setLoading] = useState(false)
  const [showRegisterOptions, setShowRegisterOptions] = useState(false)


  const navigate = useNavigate()

  const handleLogin = async () => {
    if (!loginAs) {
      alert('Please select Student or Employee')
      return
    }

    try {
      setLoading(true)

      const res = await loginUser({
        email,
        password,
        loginAs,
      })

      console.log('LOGIN SUCCESS 👉', res)

      localStorage.setItem('token', res.token)
      localStorage.setItem('role', res.role)


      // role based redirect
      if (res.role === 'student') navigate('/student/dashboard')
      else navigate('/employee/dashboard')

    } catch (err) {
      alert('Invalid credentials or role mismatch')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-200 via-sky-100 to-white">
      <div className="w-full max-w-md rounded-2xl bg-white/70 backdrop-blur-xl shadow-xl border border-white/40 px-8 py-10">

        <h2 className="text-center text-2xl font-semibold text-gray-800">
          Sign in with email
        </h2>

        <p className="text-center text-sm text-gray-500 mt-1 mb-6">
          Login as Student or Employee
        </p>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 px-4 py-3 rounded-lg border"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 px-4 py-3 rounded-lg border"
        />

        <div className="flex gap-3 mb-5">
          <button
            type="button"
            onClick={() => setLoginAs('student')}
            className={`flex-1 py-2 rounded-lg border
              ${loginAs === 'student'
                ? 'bg-indigo-600 text-white'
                : 'bg-white'}`}
          >
            Student
          </button>

          <button
            type="button"
            onClick={() => setLoginAs('employee')}
            className={`flex-1 py-2 rounded-lg border
              ${loginAs === 'employee'
                ? 'bg-indigo-600 text-white'
                : 'bg-white'}`}
          >
            Employee
          </button>
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full py-3 bg-gray-900 text-white rounded-lg hover:bg-black"
        >
          {loading ? 'Logging in...' : 'Get Started'}
        </button>

        {/* REGISTER LINK */}
       <p className="text-center text-sm text-gray-600 mt-5">
  Don’t have an account?{' '}
  <span
    onClick={() => setShowRegisterOptions(!showRegisterOptions)}
    className="text-indigo-600 cursor-pointer font-medium hover:underline"
  >
    Register here
  </span>
</p>

{showRegisterOptions && (
  <div className="mt-4 flex gap-3">
    <button
      onClick={() => navigate('/register/student')}
      className="flex-1 py-2 rounded-lg border text-sm font-medium
                 bg-white hover:bg-gray-100"
    >
      Register as Student
    </button>

    <button
      onClick={() => navigate('/register/employee')}
      className="flex-1 py-2 rounded-lg border text-sm font-medium
                 bg-white hover:bg-gray-100"
    >
      Register as Employee
    </button>
  </div>
)}


      </div>
    </div>
  )
}

export default Login
