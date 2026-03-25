import React, { useEffect, useState } from "react";
import { type AdminStats, getAdminStats } from "../../services/admin.service";
import { useNavigate } from "react-router-dom";
import { Users, Building2, ChevronRight, LayoutDashboard, LogOut, Activity, Wallet } from "lucide-react";
import { motion } from "framer-motion";

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
        <div className="w-10 h-10 border-2 border-slate-100 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-indigo-100">
      {/* Navbar - Refined White Navbar */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
            <LayoutDashboard className="w-5 h-5" />
          </div>
          <h1 className="text-sm font-bold tracking-tight text-slate-800 uppercase">Admin Panel</h1>
        </div>
        <button
          onClick={() => navigate("/admin")}
          className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </nav>

      <main className="max-w-7xl mx-auto p-4 lg:p-8 space-y-8">
        {/* Refined Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div className="space-y-0.5">
            <h2 className="text-xl font-bold text-slate-900">Dashboard Overview</h2>
            <p className="text-xs text-slate-500 font-medium">System state and core management.</p>
          </div>
          <div className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-1.5 rounded-full shadow-sm">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600">Status: Operational</span>
          </div>
        </header>

        {/* Unified Management Modules */}
        <section className="space-y-6">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
            <div className="w-1 h-1 bg-indigo-600 rounded-full"></div> Core Management
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ModuleCard
              title="Students"
              count={stats?.counts.students || 0}
              desc="Manage individual student profiles and referral applications."
              icon={<Users className="w-5 h-5" />}
              onClick={() => navigate("/admin/students")}
              accent="indigo"
            />
            <ModuleCard
              title="Employees"
              count={stats?.counts.employees || 0}
              desc="Access employee directory and professional credentials."
              icon={<Users className="w-5 h-5" />}
              onClick={() => navigate("/admin/employees")}
              accent="slate"
            />
            <ModuleCard
              title="Companies"
              count={stats?.counts.totalCompanies || 0}
              desc="Review industry partnerships and verification requests."
              icon={<Building2 className="w-5 h-5" />}
              onClick={() => navigate("/admin/companies")}
              badge={stats?.counts.pendingCompanies}
              accent="amber"
            />
            <ModuleCard
              title="Feed Posts"
              count={stats?.counts.totalStories || 0}
              desc="Global monitoring of all community feed interactions."
              icon={<Activity className="w-5 h-5" />}
              onClick={() => navigate("/admin/posts")}
              accent="rose"
            />
            <ModuleCard
              title="System Wallet"
              count={stats?.counts.employees || 0}
              desc="Monitor system revenue and track employee performance."
              icon={<Wallet className="w-5 h-5" />}
              onClick={() => navigate("/admin/wallet")}
              accent="emerald"
            />
          </div>
        </section>

        {/* Recent Activity Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
              <div className="w-1 h-1 bg-indigo-600 rounded-full"></div> Recent Registrations
            </h3>
          </div>

          <div className="bg-white border border-slate-200 rounded-[2rem] shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-50 italic">
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-400">User Identity</th>
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-400">Classification</th>
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-right">Registered</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {stats?.recentUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-slate-50/50 transition-colors group cursor-default">
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-slate-800 ">{user.name}</span>
                          <span className="text-[11px] text-slate-400 font-medium lowercase italic">{user.email}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`inline-flex px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${user.role === 'employee' ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-100 text-slate-600'
                          }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <span className="text-[11px] text-slate-400 font-medium uppercase tracking-tighter">
                          {new Date(user.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function ModuleCard({ title, count, desc, icon, onClick, badge, accent = "indigo" }: {
  title: string,
  count: number,
  desc: string,
  icon: React.ReactNode,
  onClick: () => void,
  badge?: number,
  accent?: "indigo" | "slate" | "amber" | "emerald" | "rose"
}) {
  const accents = {
    indigo: "text-indigo-600 bg-indigo-50 border-indigo-100",
    slate: "text-slate-600 bg-slate-50 border-slate-100",
    amber: "text-amber-600 bg-amber-50 border-amber-100",
    emerald: "text-emerald-600 bg-emerald-50 border-emerald-100",
    rose: "text-rose-600 bg-rose-50 border-rose-100"
  };

  return (
    <motion.button
      whileHover={{ y: -2 }}
      onClick={onClick}
      className="group relative text-left p-6 bg-gradient-to-br from-white to-slate-100 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden"
    >
      <div className="flex items-start justify-between mb-6 relative z-10">
        <div className={`p-3 rounded-2xl ${accents[accent]}`}>
          {icon}
        </div>
        <div className="flex flex-col items-end">
          <span className="text-3xl font-black tracking-tighter text-slate-900">{count}</span>
          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">Total</span>
        </div>
      </div>

      <div className="space-y-2 relative z-10">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-bold uppercase tracking-tight text-slate-800">{title}</h4>
          {badge !== undefined && badge > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-widest bg-rose-500 text-white animate-pulse">
              {badge} Pending
            </span>
          )}
        </div>
        <p className="text-[11px] font-medium leading-relaxed text-slate-500 pr-4">
          {desc}
        </p>
      </div>

      <div className="absolute bottom-6 right-6 text-slate-200 group-hover:text-indigo-600 transition-colors">
        <ChevronRight className="w-5 h-5" />
      </div>

      {/* Subtle overlay icons for depth */}
      <div className="absolute -right-4 -bottom-4 opacity-[0.03] text-black group-hover:scale-110 transition-transform duration-700">
        {React.cloneElement(icon as React.ReactElement)}
      </div>
    </motion.button>
  );
}

export default AdminDashboard;
