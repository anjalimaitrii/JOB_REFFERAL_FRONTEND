import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronsLeft } from 'lucide-react'
import { registerStudent } from '../../services/register.service'

function StudentRegister() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)

  const [form, setForm] = useState({
    name: '',
    email: '',
    contact: '',
    password: '',
    confirmPassword: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleNext = () => {
    if (!form.name || !form.email || !form.contact) {
      alert('Please fill all fields')
      return
    }
    setStep(2)
  }

  const handleRegister = async () => {
    if (!form.password || !form.confirmPassword) {
      alert('Please enter password')
      return
    }

    if (form.password !== form.confirmPassword) {
      alert('Passwords do not match')
      return
    }

    try {
      const payload = {
        name: form.name,
        email: form.email,
        contact: form.contact,
        password: form.password,
      }

      await registerStudent(payload)
      alert('Student registered successfully')
      navigate('/')
    } catch {
      alert('Registration failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-200 via-sky-100 to-white">
      <div className="w-full max-w-md rounded-2xl bg-white/70 backdrop-blur-xl shadow-xl border border-white/40 px-8 py-10">

        {/* Header */}
        <h2 className="text-center text-2xl font-semibold text-gray-800">
          Student Registration
        </h2>
        <p className="text-center text-sm text-gray-500 mt-1 mb-6">
          Create your student account
        </p>

        {/* FORM */}
        <div className="space-y-4">

          {/* STEP 1 */}
          {step === 1 && (
            <>
              <input
                name="name"
                placeholder="Full Name"
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />

              <input
                name="email"
                type="email"
                placeholder="Email"
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />

              <input
                name="contact"
                placeholder="Contact Number"
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <>
              <div
                onClick={() => setStep(1)}
                className="text-sm text-indigo-600 cursor-pointer mb-2 flex items-center gap-1 hover:underline"
              >
                <ChevronsLeft />
                Back
              </div>

              <input
                name="password"
                type="password"
                placeholder="Set Password"
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />

              <input
                name="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </>
          )}
        </div>

        {/* CTA */}
        {step === 1 ? (
          <button
            onClick={handleNext}
            className="w-full mt-6 py-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleRegister}
            className="w-full mt-6 py-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
          >
            Register as Student
          </button>
        )}

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 mt-5">
          Already have an account?{' '}
          <span
            onClick={() => navigate('/')}
            className="text-indigo-600 cursor-pointer font-medium hover:underline"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  )
}

export default StudentRegister
