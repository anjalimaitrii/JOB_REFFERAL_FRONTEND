import { adminLogin } from '@/services/login.service'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShieldAlert, Lock, User, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'

const AdminLogin = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const data = await adminLogin({
                email: username,
                password
            })

            if (data.role !== "admin") {
                alert("Restricted: Admin access only.")
                return
            }

            localStorage.setItem("token", data.token)
            localStorage.setItem("role", data.role)
            localStorage.setItem("user", JSON.stringify(data.user))

            navigate("/admin/dashboard")

        } catch (err: any) {
            alert(err.message || "Authentication failed")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] font-sans selection:bg-indigo-100 px-4">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-[2rem] border border-slate-200 shadow-sm mb-6">
                        <ShieldAlert className="w-7 h-7 text-indigo-600" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Admin Management</h2>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-2">Secure Gateway Authorization</p>
                </div>

                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 lg:p-10 shadow-2xl shadow-slate-200/50 relative overflow-hidden">
                    <form onSubmit={handleLogin} className="space-y-6 relative z-10">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                                Administrator ID
                            </label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors">
                                    <User className="w-4 h-4" />
                                </div>
                                <input
                                    type="text"
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:bg-white focus:border-indigo-200 transition-all font-medium text-sm"
                                    placeholder="admin@system.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                                Access Key
                            </label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors">
                                    <Lock className="w-4 h-4" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:bg-white focus:border-indigo-200 transition-all font-medium text-sm"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 rounded-2xl bg-slate-900 text-white text-[11px] font-black uppercase tracking-[0.2em] shadow-xl shadow-slate-200 hover:bg-slate-800 active:scale-[0.98] disabled:opacity-70 disabled:grayscale transition-all flex items-center justify-center gap-3"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                                    Validating...
                                </>
                            ) : (
                                "Authenticate"
                            )}
                        </button>
                    </form>

                    {/* Subtle decoration */}
                    <div className="absolute -right-12 -bottom-12 opacity-[0.02] text-black pointer-events-none">
                        <ShieldAlert size={200} />
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">
                        Node-v24.3 // Secure System Kernel
                    </p>
                </div>
            </motion.div>
        </div>
    )
}

export default AdminLogin
