import { useNavigate } from 'react-router-dom'

const EmployeeDashboard = () => {
  const navigate = useNavigate()

  const logout = () => {
    localStorage.clear()
    navigate('/')
  }
   const goToProfile = () => {
    navigate('/profile')
  }
  return (
    <div className="min-h-screen bg-slate-100">
      {/* ================= HEADER ================= */}
      <div className="relative">
        <div className="rounded-b-[40px] bg-gradient-to-r from-teal-400 h-[300px] via-cyan-400 to-emerald-300 px-10 py-12 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-semibold">Hello Anjali,</h1>
              <p className="opacity-90">Welcome to the Employee Referral Portal</p>
            </div>

             <div className="flex gap-3">
              <button
                onClick={goToProfile}
                className="px-4 py-2 rounded-full bg-white/20 hover:bg-white/30 text-sm"
              >
                Profile
              </button>

              <button
                onClick={logout}
                className="px-4 py-2 rounded-full bg-red-500/80 hover:bg-red-600 text-sm"
              >
                Logout
              </button>
            </div>
          </div>

          {/* 🔍 CENTER SEARCH BAR */}
          <div className="flex justify-center mt-10">
            <div className="relative w-full max-w-xl">
              <input
                placeholder="Search students, job roles..."
                className="w-full px-6 py-3 rounded-full
                text-gray-700 shadow-lg focus:outline-none"
              />
              <span className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400">
                🔍
              </span>
            </div>
          </div>
        </div>

        {/* ================= BASE CARDS STRIP ================= */}
        <div className=" z-10 -mt-10 px-10">
  <div className="bg-white rounded-3xl shadow-xl grid grid-cols-2 md:grid-cols-5 overflow-hidden">
    <BaseCard title="New Referrals" count="12" />
    <BaseCard title="Pending" count="8" />
    <BaseCard title="Approved" count="25" />
    <BaseCard title="Rejected" count="5" />
    <BaseCard title="Total" count="42" />
  </div>
</div>

      </div>

      {/* ================= STUDENT CARDS ================= */}
      <div className="px-10 mt-14">
        <h2 className="text-xl font-semibold mb-6">My Referrals</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StudentCard
            name="Rahul Sharma"
            role="Frontend Developer"
            email="rahul@gmail.com"
            status="Pending"
          />

          <StudentCard
            name="Neha Verma"
            role="Backend Developer"
            email="neha@gmail.com"
            status="Rejected"
          />

          <StudentCard
            name="Amit Singh"
            role="Full Stack Developer"
            email="amit@gmail.com"
            status="Approved"
          />
        </div>
      </div>
    </div>
  )
}

/* ================= COMPONENTS ================= */

const BaseCard = ({
  title,
  count,
}: {
  title: string
  count: string
}) => (
  <div
    className="
      bg-white
      flex flex-col items-center justify-center
      p-6 border
      transition-all duration-300 ease-out
      hover:-translate-y-4
      hover:shadow-2xl
      cursor-pointer
    "
  >
    <p className="text-2xl font-bold text-indigo-600">{count}</p>
    <p className="text-sm text-gray-600 mt-1">{title}</p>
  </div>
)


const StudentCard = ({
  name,
  role,
  email,
  status,
}: {
  name: string
  role: string
  email: string
  status: 'Pending' | 'Approved' | 'Rejected'
}) => {
  const statusStyle =
    status === 'Approved'
      ? 'bg-green-100 text-green-600'
      : status === 'Rejected'
      ? 'bg-red-100 text-red-600'
      : 'bg-yellow-100 text-yellow-600'

  return (
    <div className="bg-white rounded-2xl shadow hover:shadow-xl transition p-6">
      <h3 className="text-lg font-semibold">{name}</h3>
      <p className="text-sm text-gray-500">{email}</p>

      <div className="mt-4">
        <p className="text-sm text-gray-500">Job Role</p>
        <p className="font-medium">{role}</p>
      </div>

      <span
        className={`inline-block mt-4 px-4 py-1 rounded-full text-sm font-medium ${statusStyle}`}
      >
        {status}
      </span>
    </div>
  )
}

export default EmployeeDashboard
