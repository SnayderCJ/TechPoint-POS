import React from 'react';
import { Settings, User, Monitor, ShieldCheck, Save, Building2, Cpu, HardDrive, Layout } from 'lucide-react';

const AjustesPage = () => {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
      
      {/* ---- Header de Configuración ---- */}
      <div className="relative overflow-hidden bg-slate-900/40 backdrop-blur-xl border border-white/5 p-10 rounded-[3.5rem] shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-violet-500 to-transparent"></div>
        <div className="relative z-10">
          <h2 className="text-5xl font-black text-white tracking-tighter flex items-center gap-4">
            <div className="bg-violet-600/20 p-3 rounded-2xl border border-violet-500/30">
              <Settings className="text-violet-400" size={38} />
            </div>
            Configuración <span className="text-violet-500">Global</span>
          </h2>
          <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-xs mt-3 ml-1">
            Panel de Control del Sistema • TechPoint Milagro
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* --- Sección: Perfil del Ingeniero --- */}
        <div className="group bg-slate-900/40 backdrop-blur-md p-8 rounded-[3rem] border border-white/5 hover:border-violet-500/40 transition-all duration-500 shadow-xl">
          <div className="flex items-center gap-4 border-b border-white/5 pb-6 mb-6">
            <div className="bg-blue-500/10 p-3 rounded-2xl text-blue-400 border border-blue-500/20">
              <User size={26} />
            </div>
            <h3 className="text-xl font-black text-white tracking-tight">Identidad del Desarrollador</h3>
          </div>
          <div className="space-y-5">
            <div className="bg-slate-950/50 p-4 rounded-2xl border border-white/5">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Lead Software Engineer</p>
              <p className="text-lg font-bold text-white tracking-tight">Snayder Cedeño</p>
            </div>
            <div className="bg-slate-950/50 p-4 rounded-2xl border border-white/5">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Alma Mater</p>
              <p className="text-lg font-bold text-white tracking-tight">Universidad Estatal De Milagro (UNEMI)</p>
            </div>
          </div>
        </div>

        {/* --- Sección: Monitor de Hardware --- */}
        <div className="bg-slate-900/40 backdrop-blur-md p-8 rounded-[3rem] border border-white/5 shadow-xl">
          <div className="flex items-center gap-4 border-b border-white/5 pb-6 mb-6">
            <div className="bg-purple-500/10 p-3 rounded-2xl text-purple-400 border border-purple-500/20">
              <Monitor size={26} />
            </div>
            <h3 className="text-xl font-black text-white tracking-tight">Hardware Engine</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-950/50 p-4 rounded-2xl border border-white/5 flex items-center gap-3">
              <Cpu className="text-violet-500/50" size={18} />
              <div>
                <p className="text-[9px] font-black text-slate-500 uppercase">Procesador</p>
                <p className="text-xs font-bold text-white">Ryzen 5 5600G</p>
              </div>
            </div>
            <div className="bg-slate-950/50 p-4 rounded-2xl border border-white/5 flex items-center gap-3">
              <HardDrive className="text-violet-500/50" size={18} />
              <div>
                <p className="text-[9px] font-black text-slate-500 uppercase">Memoria RAM</p>
                <p className="text-xs font-bold text-white">24 GB DDR4</p>
              </div>
            </div>
            <div className="bg-slate-950/50 p-4 rounded-2xl border border-white/5 flex items-center gap-3">
              <Layout className="text-violet-500/50" size={18} />
              <div>
                <p className="text-[9px] font-black text-slate-500 uppercase">Resolución</p>
                <p className="text-xs font-bold text-white">1600x900 @ 60Hz</p>
              </div>
            </div>
            <div className="bg-slate-950/50 p-4 rounded-2xl border border-white/5 flex items-center gap-3">
              <Building2 className="text-violet-500/50" size={18} />
              <div>
                <p className="text-[9px] font-black text-slate-500 uppercase">Base de Datos</p>
                <p className="text-xs font-bold text-white">PostgreSQL 15</p>
              </div>
            </div>
          </div>
        </div>

        {/* --- Sección: Seguridad Crítica --- */}
        <div className="lg:col-span-2 bg-slate-900/60 backdrop-blur-2xl p-10 rounded-[4rem] border border-white/10 shadow-2xl flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden">
          {/* Glow de seguridad */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-[80px]"></div>
          
          <div className="flex items-center gap-6 relative z-10">
             <div className="bg-red-500/10 p-5 rounded-[2rem] text-red-500 border border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.1)]">
                <ShieldCheck size={36} />
             </div>
             <div>
               <h3 className="text-2xl font-black text-white tracking-tight">Seguridad y Respaldo</h3>
               <p className="text-sm text-slate-400 font-medium">Protección de activos en Guayas, Ecuador.</p>
             </div>
          </div>

          <button className="relative group bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-10 py-5 rounded-[2rem] font-black shadow-[0_15px_30px_rgba(124,58,237,0.3)] hover:shadow-[0_20px_40px_rgba(124,58,237,0.5)] transition-all active:scale-95 flex items-center gap-3 overflow-hidden">
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <Save size={22} className="relative z-10" /> 
            <span className="relative z-10 tracking-widest text-sm">EJECUTAR BACKUP MANUAL</span>
          </button>
        </div>

      </div>

      {/* --- Información de Versión --- */}
      <div className="text-center pt-6">
        <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.5em]">
          TechPoint POS v2.0 • Build 2026.02 • Engineered by SnayderCJ
        </p>
      </div>
    </div>
  );
};

export default AjustesPage;