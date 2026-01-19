import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronsLeft } from 'lucide-react'
import { registerEmployee } from '../../services/register.service'

function EmployeeRegister() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)

  const [form, setForm] = useState({
    name: '',
    email: '',
    contact: '',
    company: '',
    designation: '',
    password: '',
    confirmPassword: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleNext = () => {
    if (!form.name || !form.email || !form.contact || !form.company || !form.designation) {
      alert('Please fill all fields')
      return
    }
    setStep(2)
  }

  const handleRegister = async () => {
    if (form.password !== form.confirmPassword) {
      alert('Passwords do not match')
      return
    }

    try {
      const payload = {
        name: form.name,
        email: form.email,
        contact: form.contact,
        company: form.company,
        designation: form.designation,
        password: form.password,
      }

      await registerEmployee(payload)
      alert('Employee registered successfully')
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
          Employee Registration
        </h2>
        <p className="text-center text-sm text-gray-500 mt-1 mb-6">
          Create your employee account
        </p>

        {/* Form */}
        <div className="space-y-4">
         

          {/* STEP 1 → CONTACT */}
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

      <input
        name="company"
        placeholder="Company Name"
        onChange={handleChange}
        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />

      <input
        name="designation"
        placeholder="Job Title (Software Engineer)"
        onChange={handleChange}
        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />
    </>
  )}

          {/* STEP 2 → PASSWORD */}
          {step === 2 && (
            
            <>
             <div
      onClick={() => setStep(1)}
      className="text-sm text-indigo-600 cursor-pointer mb-2 flex items-center gap-1 hover:underline"
    >
      <ChevronsLeft />
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
            Register as Employee
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

export default EmployeeRegister
