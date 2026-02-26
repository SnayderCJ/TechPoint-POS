import React, { useState, useEffect } from 'react';
import { History, FileText, Calendar, DollarSign, ArrowUpRight, Activity, Search } from 'lucide-react';

const HistorialPage = () => {
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8000/api/ventas/')
      .then(res => res.json())
      .then(data => {
        setVentas(data);
        setLoading(false);
      })
      .catch(err => console.error("Error al cargar historial:", err));
  }, []);

  const totalHistorico = ventas.reduce((acc, v) => acc + parseFloat(v.total), 0);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
      
      {/* ---- Header de Auditoría ---- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-5xl font-black text-white tracking-tighter flex items-center gap-4">
            <div className="bg-violet-500/20 p-3 rounded-2xl border border-violet-500/30 shadow-[0_0_20px_rgba(139,92,246,0.2)]">
              <History className="text-violet-400" size={38} />
            </div>
            Historial de <span className="text-violet-500">Ventas</span>
          </h2>
          <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-xs mt-3 ml-1">
            Registro de Auditoría • Terminal TechPoint • Milagro
          </p>
        </div>

        {/* Card de Resumen Financiero */}
        <div className="bg-slate-900/40 backdrop-blur-xl px-8 py-5 rounded-[2.5rem] border border-white/5 flex items-center gap-6 shadow-2xl">
          <div className="bg-violet-500/10 p-3 rounded-2xl text-violet-400 border border-violet-500/20">
            <Activity size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Volumen Total</p>
            <p className="text-3xl font-black text-white tracking-tighter">
              ${totalHistorico.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </div>

      {/* ---- Listado de Facturas ---- */}
      <div className="grid gap-5 max-w-5xl">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-violet-500"></div>
          </div>
        ) : ventas.length === 0 ? (
          <div className="bg-slate-950/30 backdrop-blur-2xl p-24 rounded-[4rem] text-center border border-dashed border-white/10">
             <div className="bg-slate-900 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 opacity-20">
                <FileText className="text-white" size={40} />
             </div>
             <p className="text-slate-500 font-black uppercase tracking-widest text-sm">No se detectan transacciones en PostgreSQL</p>
          </div>
        ) : (
          ventas.map((venta) => (
            <div 
              key={venta.id} 
              className="group relative bg-slate-900/40 backdrop-blur-md p-6 rounded-[3rem] border border-white/5 hover:border-violet-500/40 transition-all duration-500 hover:shadow-[0_0_40px_rgba(139,92,246,0.1)] flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden"
            >
              {/* Brillo dinámico lateral */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-violet-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="flex items-center gap-6 relative z-10 w-full md:w-auto">
                <div className="bg-slate-950 p-5 rounded-3xl text-slate-500 group-hover:bg-violet-500/10 group-hover:text-violet-400 border border-white/5 transition-all">
                  <FileText size={28} />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <p className="text-xl font-black text-white tracking-tight leading-none">Factura #TX-{venta.id.toString().padStart(4, '0')}</p>
                    <span className="text-[10px] font-black bg-white/5 text-slate-500 px-3 py-1 rounded-full border border-white/5">LIQUIDADO</span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    <span className="flex items-center gap-2"><Calendar size={14} className="text-violet-500/50"/> {new Date(venta.fecha).toLocaleDateString()}</span>
                    <span className="text-white/10">•</span>
                    <span className="flex items-center gap-2 font-bold">15% IVA Aplicado</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-white/5 pt-4 md:pt-0">
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-tighter mb-1">Monto de Operación</p>
                  <div className="flex items-center justify-end gap-1 text-white">
                     <DollarSign className="text-violet-400" size={24}/>
                     <span className="text-4xl font-black tracking-tighter">{parseFloat(venta.total).toFixed(2)}</span>
                  </div>
                </div>
                
                <button className="bg-white/5 p-4 rounded-2xl text-slate-400 hover:text-white hover:bg-violet-600 transition-all group/btn shadow-inner">
                   <ArrowUpRight size={20} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* --- Footer Técnico --- */}
      <div className="max-w-5xl bg-violet-500/5 p-8 rounded-[3rem] border border-violet-500/10 flex items-center justify-between">
         <div className="flex items-center gap-4 text-slate-500">
            <Search size={20} className="text-violet-500" />
            <p className="text-xs font-bold uppercase tracking-widest">Todos los datos están encriptados y sincronizados con PostgreSQL</p>
         </div>
         <div className="hidden md:block">
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">Auditoría Snayder Cedeño • 2026</span>
         </div>
      </div>
    </div>
  );
};

export default HistorialPage;