
import { useNavigate } from 'react-router-dom'
import Companies from './companies'



const StudentDashboard = () => {

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
      <div className="rounded-b-[40px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-400 px-10 py-12 text-white">
        <h1 className="text-3xl font-semibold">Hello Student 👋</h1>
        <p className="opacity-90 mt-1">
          Send referral requests to employees
        </p>
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
                 <button
                onClick={() => navigate("/student/requests")}
                className="px-4 py-2 rounded-full bg-red-500/80 hover:bg-red-600 text-sm"
              >
                see my requests
              </button>
            </div>

        {/* Search */}
        <div className="flex justify-center mt-8">
          <input
            placeholder="Search employee name, role..."
            className="w-full max-w-xl px-6 py-3 rounded-full
              text-gray-700 shadow-lg focus:outline-none"
          />
        </div>
            
      </div>

     
    
    <Companies/>
    </div>
  )
}



export default StudentDashboard
