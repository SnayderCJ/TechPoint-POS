import React, { useState } from "react";
import { Zap, User, Lock, ArrowRight, ShieldCheck, Loader2 } from "lucide-react";

function LoginPage({ setUser, isDarkMode, showToast }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8000/api/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("techpoint_user", JSON.stringify(data));
        showToast(`Bienvenido de nuevo, ${data.name}`);
        setUser(data);
      } else {
        showToast(data.error || "Credenciales inválidas", "error");
      }
    } catch (err) {
      showToast("Error de conexión con el Core", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen w-full flex items-center justify-center p-6 transition-colors duration-700 ${
      isDarkMode ? "bg-slate-950" : "bg-slate-50"
    }`}>
      {/* DECORACIÓN DE FONDO */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full blur-[120px] opacity-20 ${
          isDarkMode ? "bg-violet-600" : "bg-violet-400"
        }`}></div>
        <div className={`absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full blur-[120px] opacity-20 ${
          isDarkMode ? "bg-indigo-600" : "bg-indigo-400"
        }`}></div>
      </div>

      <div className={`relative w-full max-w-md p-10 md:p-12 rounded-[3.5rem] border transition-all duration-500 shadow-2xl ${
        isDarkMode 
          ? "bg-slate-900/40 border-white/10 backdrop-blur-2xl shadow-black/50" 
          : "bg-white border-slate-200 shadow-slate-200"
      }`}>
        
        {/* LOGO AREA */}
        <div className="flex flex-col items-center mb-12">
          <div className="w-20 h-20 bg-violet-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-violet-600/40 mb-6 rotate-3 hover:rotate-0 transition-transform duration-500">
            <Zap size={40} className="text-white fill-white" />
          </div>
          <h1 className={`text-3xl font-black tracking-tighter ${isDarkMode ? "text-white" : "text-slate-900"}`}>
            TechPoint <span className="text-violet-600">POS</span>
          </h1>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mt-2">Core System • Milagro</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-500 ml-4 tracking-widest">Usuario</label>
            <div className="relative group">
              <User className="absolute left-5 top-4.5 text-slate-400 group-focus-within:text-violet-500 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="admin" 
                required
                className={`w-full pl-14 pr-6 py-4 rounded-2xl border outline-none font-bold text-sm transition-all ${
                  isDarkMode 
                    ? "bg-slate-950/50 border-white/5 text-white focus:border-violet-500 focus:bg-slate-950" 
                    : "bg-slate-50 border-slate-200 text-slate-900 focus:border-violet-500 focus:bg-white"
                }`}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-500 ml-4 tracking-widest">Contraseña</label>
            <div className="relative group">
              <Lock className="absolute left-5 top-4.5 text-slate-400 group-focus-within:text-violet-500 transition-colors" size={18} />
              <input 
                type="password" 
                placeholder="••••••••" 
                required
                className={`w-full pl-14 pr-6 py-4 rounded-2xl border outline-none font-bold text-sm transition-all ${
                  isDarkMode 
                    ? "bg-slate-950/50 border-white/5 text-white focus:border-violet-500 focus:bg-slate-950" 
                    : "bg-slate-50 border-slate-200 text-slate-900 focus:border-violet-500 focus:bg-white"
                }`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-violet-600 hover:bg-violet-500 text-white py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-2xl shadow-violet-600/40 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>Acceder al Sistema <ArrowRight size={18} /></>
            )}
          </button>
        </form>

        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-white/5 flex items-center justify-center gap-2">
          <ShieldCheck size={14} className="text-violet-500" />
          <span className="text-[9px] font-black uppercase text-slate-500 tracking-widest">Acceso Seguro • PostgreSQL Protected</span>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
