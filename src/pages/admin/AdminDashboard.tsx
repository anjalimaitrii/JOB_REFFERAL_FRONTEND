import React, { useEffect, useState } from "react";
import { type AdminStats, getAdminStats } from "../../services/admin.service";
import { useNavigate } from "react-router-dom";
import { Users, Building2, ChevronRight, LayoutDashboard, LogOut, Activity } from "lucide-react";
import { FloatingDockDemo } from "../../components/ui/dock";


function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await getAdminStats();
      setStats(res.data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-gray-100 border-t-black rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] text-gray-900 font-sans selection:bg-gray-200">


      {/* Navbar - Restored Black Dashboard Navbar */}
      <nav className="bg-black border-b border-gray-800 px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-white/10 rounded-lg">
            <LayoutDashboard className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-sm font-bold tracking-widest text-white uppercase">Admin Panel</h1>
        </div>
        <button
          onClick={() => navigate("/")}
          className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </nav>

      <main className="max-w-7xl mx-auto p-4 lg:p-8 space-y-8">
        {/* Refined Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-6">
          <div className="space-y-0.5">
            <h2 className="text-xl font-bold text-gray-900">Dashboard Overview</h2>
            <p className="text-xs text-gray-500 font-medium">System state and core management modules.</p>
          </div>
          <div className="flex items-center gap-2 bg-white border border-gray-200 px-3 py-1.5 rounded-full shadow-sm">
            <Activity className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-600">Status: Operational</span>
          </div>
        </header>

        {/* Unified Management Modules */}
        <section className="space-y-6">
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
            <div className="w-1 h-1 bg-black rounded-full"></div> Core Management
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2  gap-4">
            <ModuleCard
              title="Students"
              count={stats?.counts.students || 0}
              desc="View and manage individual student profiles and applications."
              icon={<Users className="w-5 h-5" />}
              onClick={() => navigate("/admin/students")}
            />
            <ModuleCard
              title="Employees"
              count={stats?.counts.employees || 0}
              desc="Access employee directory and professional credentials."
              icon={<Users className="w-5 h-5" />}
              onClick={() => navigate("/admin/employees")}
              dark
            />
            <ModuleCard
              title="Companies"
              count={stats?.counts.totalCompanies || 0}
              desc="Review industry partnerships and verification requests."
              icon={<Building2 className="w-5 h-5" />}
              onClick={() => navigate("/admin/companies")}
              badge={stats?.counts.pendingCompanies}
            />
            <ModuleCard
              title="Feed Posts"
              count={stats?.counts.totalStories || 0}
              desc="Global monitoring of all community feed interactions."
              icon={<Activity className="w-5 h-5" />}
              onClick={() => navigate("/admin/posts")}
              dark
            />
          </div>
        </section>
        <FloatingDockDemo />
        {/* Recent Activity Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
              <div className="w-1 h-1 bg-black rounded-full"></div> Recent Registrations
            </h3>
          </div>

          <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-50">
                  <th className="px-6 py-3 text-[9px] font-bold uppercase tracking-widest text-gray-400">User Identity</th>
                  <th className="px-6 py-3 text-[9px] font-bold uppercase tracking-widest text-gray-400">Classification</th>
                  <th className="px-6 py-3 text-[9px] font-bold uppercase tracking-widest text-gray-400 text-right">Registered</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {stats?.recentUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50/50 transition-colors group cursor-default">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-900 group-hover:text-black">{user.name}</span>
                        <span className="text-[11px] text-gray-400 font-medium">{user.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-tighter ${user.role === 'employee' ? 'bg-black text-white' : 'bg-gray-200 text-gray-600'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                        {new Date(user.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

    </div>
  );
}

function ModuleCard({ title, count, desc, icon, onClick, dark = false, badge }: {
  title: string,
  count: number,
  desc: string,
  icon: React.ReactNode,
  onClick: () => void,
  dark?: boolean,
  badge?: number
}) {
  return (
    <button
      onClick={onClick}
      className={`group relative text-left p-5 rounded-[1.5rem] border transition-all duration-500 hover:scale-[1.01] ${dark
        ? 'bg-gradient-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#3a3a3a] text-white border-gray-800 shadow-lg'
        : 'bg-gradient-to-br from-white via-[#fcfcfc] to-[#f5f5f5] text-gray-900 border-gray-100 shadow-sm hover:shadow-md'
        }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2.5 rounded-xl ${dark ? 'bg-white/10' : 'bg-gray-50 group-hover:bg-black group-hover:text-white'} transition-colors duration-300`}>
          {icon}
        </div>
        <div className="flex flex-col items-end">
          <span className={`text-2xl font-bold tracking-tight ${dark ? 'text-white' : 'text-gray-900'}`}>{count}</span>
          <span className={`text-[9px] font-bold uppercase tracking-widest ${dark ? 'text-gray-500' : 'text-gray-400'}`}>Total</span>
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-bold uppercase tracking-tight">{title}</h4>
          {badge !== undefined && badge > 0 && (
            <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest ${dark ? 'bg-white text-black' : 'bg-black text-white'}`}>
              {badge}
            </span>
          )}
        </div>
        <p className={`text-[11px] font-medium leading-relaxed ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
          {desc}
        </p>
      </div>

      <div className={`absolute bottom-4 right-4 ${dark ? 'text-white/10' : 'text-gray-100'} group-hover:text-current transition-colors`}>
        <ChevronRight className="w-5 h-5" />
      </div>
    </button>
  );
}

export default AdminDashboard;
