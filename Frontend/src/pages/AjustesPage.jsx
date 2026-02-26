import React from 'react';
import { Settings, User, Monitor, ShieldCheck, Save, Building2, Cpu, HardDrive, Layout, CheckCircle } from 'lucide-react';

const AjustesPage = ({ isDarkMode }) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      
      {/* ---- Header SaaS de Configuración ---- */}
      <div className={`relative overflow-hidden border p-10 rounded-[2.5rem] transition-all duration-500 shadow-xl ${
        isDarkMode 
          ? "bg-slate-900/60 backdrop-blur-xl border-white/10 shadow-black/20" 
          : "bg-white border-slate-200 shadow-slate-200/50"
      }`}>
        {/* Sutil acento violeta de fondo (Solo en Dark) */}
        {isDarkMode && (
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-violet-500/50 to-transparent"></div>
        )}
        
        <div className="relative z-10">
          <h2 className={`text-4xl font-black tracking-tighter flex items-center gap-4 ${
            isDarkMode ? "text-white" : "text-slate-900"
          }`}>
            <div className={`p-3 rounded-2xl border ${
              isDarkMode ? "bg-violet-500/10 border-violet-500/20" : "bg-violet-50 border-violet-100"
            }`}>
              <Settings className="text-violet-500" size={32} />
            </div>
            Configuración <span className="text-violet-600">Global</span>
          </h2>
          <p className="text-slate-500 font-semibold uppercase tracking-widest text-[10px] mt-3 ml-1">
            Panel de Control del Sistema • TechPoint Milagro, Ecuador
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* --- Sección: Perfil del Desarrollador --- */}
        <div className={`p-8 rounded-[2rem] border transition-all duration-300 ${
          isDarkMode 
            ? "bg-slate-900 border-white/5 shadow-xl shadow-black/20" 
            : "bg-white border-slate-200 shadow-sm"
        }`}>
          <div className={`flex items-center gap-4 border-b pb-6 mb-6 ${
            isDarkMode ? "border-white/5" : "border-slate-100"
          }`}>
            <div className={`p-3 rounded-2xl ${
              isDarkMode ? "bg-blue-500/10 text-blue-400" : "bg-blue-50 text-blue-600"
            }`}>
              <User size={24} />
            </div>
            <h3 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-slate-800"}`}>
              Identidad del Desarrollador
            </h3>
          </div>
          <div className="space-y-4">
            <div className={`p-4 rounded-xl border ${
              isDarkMode ? "bg-slate-950 border-white/5" : "bg-slate-50 border-slate-100"
            }`}>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Lead Software Engineer</p>
              <p className={`font-bold ${isDarkMode ? "text-slate-200" : "text-slate-900"}`}>Snayder Cedeño</p>
            </div>
            <div className={`p-4 rounded-xl border ${
              isDarkMode ? "bg-slate-950 border-white/5" : "bg-slate-50 border-slate-100"
            }`}>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Alma Mater</p>
              <p className={`font-bold ${isDarkMode ? "text-slate-200" : "text-slate-900"}`}>Universidad Estatal De Milagro (UNEMI)</p>
            </div>
          </div>
        </div>

        {/* --- Sección: Monitor de Hardware --- */}
        <div className={`p-8 rounded-[2rem] border transition-all duration-300 ${
          isDarkMode 
            ? "bg-slate-900 border-white/5 shadow-xl shadow-black/20" 
            : "bg-white border-slate-200 shadow-sm"
        }`}>
          <div className={`flex items-center gap-4 border-b pb-6 mb-6 ${
            isDarkMode ? "border-white/5" : "border-slate-100"
          }`}>
            <div className={`p-3 rounded-2xl ${
              isDarkMode ? "bg-purple-500/10 text-purple-400" : "bg-purple-50 text-purple-600"
            }`}>
              <Monitor size={24} />
            </div>
            <h3 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-slate-800"}`}>
              Hardware Engine
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className={`p-3.5 rounded-xl border flex items-center gap-3 ${
              isDarkMode ? "bg-slate-950 border-white/5" : "bg-slate-50 border-slate-100"
            }`}>
              <Cpu className="text-violet-500/50" size={16} />
              <div>
                <p className="text-[9px] font-bold text-slate-500 uppercase">CPU</p>
                <p className={`text-xs font-bold ${isDarkMode ? "text-slate-200" : "text-slate-900"}`}>Ryzen 5 5600G</p>
              </div>
            </div>
            <div className={`p-3.5 rounded-xl border flex items-center gap-3 ${
              isDarkMode ? "bg-slate-950 border-white/5" : "bg-slate-50 border-slate-100"
            }`}>
              <HardDrive className="text-violet-500/50" size={16} />
              <div>
                <p className="text-[9px] font-bold text-slate-500 uppercase">RAM</p>
                <p className={`text-xs font-bold ${isDarkMode ? "text-slate-200" : "text-slate-900"}`}>24 GB DDR4</p>
              </div>
            </div>
            <div className={`p-3.5 rounded-xl border flex items-center gap-3 ${
              isDarkMode ? "bg-slate-950 border-white/5" : "bg-slate-50 border-slate-100"
            }`}>
              <Layout className="text-violet-500/50" size={16} />
              <div>
                <p className="text-[9px] font-bold text-slate-500 uppercase">Display</p>
                <p className={`text-xs font-bold ${isDarkMode ? "text-slate-200" : "text-slate-900"}`}>1600x900 @ 60Hz</p>
              </div>
            </div>
            <div className={`p-3.5 rounded-xl border flex items-center gap-3 ${
              isDarkMode ? "bg-slate-950 border-white/5" : "bg-slate-50 border-slate-100"
            }`}>
              <Building2 className="text-violet-500/50" size={16} />
              <div>
                <p className="text-[9px] font-bold text-slate-500 uppercase">DB</p>
                <p className={`text-xs font-bold ${isDarkMode ? "text-slate-200" : "text-slate-900"}`}>PostgreSQL 15</p>
              </div>
            </div>
          </div>
        </div>

        {/* --- Sección: Seguridad Crítica SaaS --- */}
        <div className={`lg:col-span-2 p-10 rounded-[2.5rem] border flex flex-col md:flex-row justify-between items-center gap-8 transition-all ${
          isDarkMode 
            ? "bg-slate-900 border-white/5 shadow-2xl shadow-black/30" 
            : "bg-white border-slate-200 shadow-xl shadow-slate-200/50"
        }`}>
          <div className="flex items-center gap-6">
             <div className={`p-5 rounded-[1.5rem] border ${
               isDarkMode ? "bg-red-500/10 text-red-500 border-red-500/20" : "bg-red-50 text-red-600 border-red-100"
             }`}>
                <ShieldCheck size={32} />
             </div>
             <div>
               <h3 className={`text-2xl font-bold tracking-tight ${isDarkMode ? "text-white" : "text-slate-800"}`}>
                 Seguridad y Respaldo
               </h3>
               <p className="text-sm text-slate-500 font-medium">
                 Protección de activos digitales en Guayas, Ecuador.
               </p>
             </div>
          </div>

          <button className="bg-violet-600 hover:bg-violet-500 text-white px-10 py-5 rounded-2xl font-bold shadow-lg shadow-violet-600/20 transition-all active:scale-95 flex items-center gap-3 text-sm uppercase tracking-widest">
            <Save size={20} /> Ejecutar Backup Manual
          </button>
        </div>

      </div>

      {/* --- Información de Auditoría --- */}
      <div className="text-center pt-8 border-t border-slate-100/10">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.4em]">
          TechPoint Management System • Build 2026.02 • UNEMI Engineer
        </p>
      </div>
    </div>
  );
};

export default AjustesPage;