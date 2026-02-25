import React from 'react';
import { Settings, User, Monitor, ShieldCheck, Save, Building2 } from 'lucide-react';

const AjustesPage = () => {
  return (
    <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-4xl font-black text-slate-800 flex items-center gap-3">
            <Settings className="text-emerald-500" size={36} /> Panel de Ajustes
          </h2>
          <p className="text-slate-400 font-medium mt-1">Configuración global de TechPoint POS</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Perfil del Desarrollador */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
          <div className="flex items-center gap-4 border-b border-slate-50 pb-6 mb-6">
            <div className="bg-blue-50 p-3 rounded-2xl text-blue-600"><User size={24} /></div>
            <h3 className="text-xl font-bold text-slate-700">Información del Desarrollador</h3>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Nombre</p>
              <p className="bg-slate-50 p-3 rounded-xl font-bold text-slate-700">Snayder Cedeño</p>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Institución</p>
              <p className="bg-slate-50 p-3 rounded-xl font-bold text-slate-700">Universidad Estatal De Milagro (UNEMI)</p>
            </div>
          </div>
        </div>

        {/* Estado del Sistema (Hardware) */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
          <div className="flex items-center gap-4 border-b border-slate-50 pb-6 mb-6">
            <div className="bg-purple-50 p-3 rounded-2xl text-purple-600"><Monitor size={24} /></div>
            <h3 className="text-xl font-bold text-slate-700">Monitor de Hardware</h3>
          </div>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <p className="text-[9px] font-black text-slate-400 uppercase">Procesador</p>
              <p className="text-xs font-bold text-slate-700">AMD Ryzen 5 5600G</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <p className="text-[9px] font-black text-slate-400 uppercase">Memoria RAM</p>
              <p className="text-xs font-bold text-slate-700">24 GB DDR4</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <p className="text-[9px] font-black text-slate-400 uppercase">Resolución</p>
              <p className="text-xs font-bold text-slate-700">1600x900 @ 60Hz</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <p className="text-[9px] font-black text-slate-400 uppercase">Base de Datos</p>
              <p className="text-xs font-bold text-slate-700">PostgreSQL 15</p>
            </div>
          </div>
        </div>

        {/* Seguridad */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 lg:col-span-2 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
             <div className="bg-red-50 p-4 rounded-3xl text-red-500"><ShieldCheck size={32} /></div>
             <div>
               <h3 className="text-xl font-bold text-slate-700">Seguridad y Backups</h3>
               <p className="text-sm text-slate-400">Protege los datos de TechPoint Milagro, Guayas.</p>
             </div>
          </div>
          <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black shadow-lg shadow-emerald-500/20 transition-all active:scale-95 flex items-center gap-3">
            <Save size={20} /> REALIZAR COPIA DE SEGURIDAD
          </button>
        </div>
      </div>
    </div>
  );
};

export default AjustesPage;