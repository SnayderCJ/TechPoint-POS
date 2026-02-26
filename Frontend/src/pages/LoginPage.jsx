import React, { useState } from 'react';
import { Laptop, Lock, User, ShieldCheck, Loader2, AlertCircle } from 'lucide-react';

const LoginPage = ({ setUser, isDarkMode }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // Estado para el feedback de carga
  const [error, setError] = useState(''); // Estado para mensajes de error del backend

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 🚀 PETICIÓN REAL AL BACKEND DE DJANGO
      const response = await fetch('http://localhost:8000/api/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Si las credenciales coinciden en PostgreSQL:
        localStorage.setItem('techpoint_user', JSON.stringify(data));
        setUser(data);
      } else {
        // Si Django retorna 401 o 400
        setError(data.error || "Credenciales incorrectas. Verifica tu usuario de Django.");
      }
    } catch (err) {
      setError("No se pudo conectar con el servidor. ¿Django está activo?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-500 ${
      isDarkMode ? "bg-slate-950" : "bg-slate-50"
    }`}>
      
      {/* Glow decorativo de fondo */}
      {isDarkMode && (
        <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,_#1e1b4b,_transparent)] opacity-40 pointer-events-none"></div>
      )}

      <div className={`w-full max-w-md p-10 rounded-[3rem] border shadow-2xl relative z-10 transition-all ${
        isDarkMode ? "bg-slate-900 border-white/10" : "bg-white border-slate-200"
      }`}>
        
        {/* Logo y Encabezado */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-violet-600 p-4 rounded-3xl text-white shadow-lg shadow-violet-600/30 mb-4 animate-bounce-slow">
            <Laptop size={32} />
          </div>
          <h2 className={`text-3xl font-black tracking-tighter ${isDarkMode ? "text-white" : "text-slate-900"}`}>
            TechPoint <span className="text-violet-500">POS</span>
          </h2>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em] mt-2 text-center">
            Acceso al Sistema de Ingeniería
          </p>
        </div>

        {/* Mensaje de Error Dinámico */}
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-500 animate-in fade-in zoom-in-95">
            <AlertCircle size={18} className="shrink-0" />
            <p className="text-xs font-bold leading-tight">{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Campo Usuario */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase ml-2 tracking-widest">Usuario de Red</label>
            <div className="relative group">
              <User className={`absolute left-4 top-4 transition-colors ${loading ? "text-violet-500" : "text-slate-500"}`} size={18} />
              <input 
                required 
                type="text" 
                disabled={loading}
                className={`w-full pl-12 pr-4 py-4 rounded-2xl outline-none border transition-all font-medium ${
                  isDarkMode 
                  ? "bg-slate-950 border-white/5 text-white focus:border-violet-500" 
                  : "bg-slate-50 border-slate-200 text-slate-900 focus:border-violet-500"
                } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ingresa tu ID de admin"
              />
            </div>
          </div>

          {/* Campo Password */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase ml-2 tracking-widest">Contraseña</label>
            <div className="relative group">
              <Lock className={`absolute left-4 top-4 transition-colors ${loading ? "text-violet-500" : "text-slate-500"}`} size={18} />
              <input 
                required 
                type="password" 
                disabled={loading}
                className={`w-full pl-12 pr-4 py-4 rounded-2xl outline-none border transition-all ${
                  isDarkMode 
                  ? "bg-slate-950 border-white/5 text-white focus:border-violet-500" 
                  : "bg-slate-50 border-slate-200 text-slate-900 focus:border-violet-500"
                } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••"
              />
            </div>
          </div>

          {/* Botón de Acción con Loader */}
          <button 
            type="submit" 
            disabled={loading}
            className={`w-full bg-violet-600 hover:bg-violet-500 text-white py-5 rounded-[2rem] font-black shadow-xl shadow-violet-600/20 active:scale-95 transition-all flex items-center justify-center gap-3 text-sm uppercase tracking-widest ${
              loading ? "opacity-80 cursor-wait" : ""
            }`}
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" /> 
                <span>Validando...</span>
              </>
            ) : (
              <>
                <ShieldCheck size={20} /> 
                <span>Entrar al Sistema</span>
              </>
            )}
          </button>
        </form>

        {/* Footer Institucional */}
        <div className="mt-10 pt-6 border-t border-slate-100/10 text-center">
          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
            {new Date().getFullYear()} • Snayder Cedeño • UNEMI Milagro
          </p>
        </div>
      </div>

      <style>{`
        .animate-bounce-slow {
          animation: bounce 3s infinite;
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(-5%); animation-timing-function: cubic-bezier(0.8,0,1,1); }
          50% { transform: none; animation-timing-function: cubic-bezier(0,0,0.2,1); }
        }
      `}</style>
    </div>
  );
};

export default LoginPage;