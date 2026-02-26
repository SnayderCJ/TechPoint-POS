import React, { useState, useEffect } from 'react';
import { History, FileText, Calendar, DollarSign, ArrowUpRight, Activity, Search, ShieldCheck } from 'lucide-react';

const HistorialPage = ({ isDarkMode }) => {
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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      
      {/* ---- Header de Auditoría SaaS ---- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className={`text-4xl font-black tracking-tighter flex items-center gap-4 ${
            isDarkMode ? "text-white" : "text-slate-900"
          }`}>
            <div className={`p-3 rounded-2xl border ${
              isDarkMode ? "bg-violet-500/10 border-violet-500/20" : "bg-violet-50 border-violet-100"
            }`}>
              <History className="text-violet-500" size={32} />
            </div>
            Historial de <span className="text-violet-600">Ventas</span>
          </h2>
          <p className="text-slate-500 font-semibold uppercase tracking-widest text-[10px] mt-3 ml-1">
            Registro de Auditoría • Terminal TechPoint • Milagro
          </p>
        </div>

        {/* Card de Resumen Financiero Clean */}
        <div className={`px-8 py-5 rounded-[2rem] border flex items-center gap-6 transition-all ${
          isDarkMode 
            ? "bg-slate-900 border-white/5 shadow-xl shadow-black/20" 
            : "bg-white border-slate-200 shadow-sm"
        }`}>
          <div className={`p-3 rounded-xl ${
            isDarkMode ? "bg-violet-500/10 text-violet-400" : "bg-violet-50 text-violet-600"
          }`}>
            <Activity size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter mb-1">Volumen Total Acumulado</p>
            <p className={`text-3xl font-black tracking-tighter ${isDarkMode ? "text-white" : "text-slate-900"}`}>
              ${totalHistorico.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </div>

      {/* ---- Listado de Facturas Estilo SaaS ---- */}
      <div className="grid gap-4 max-w-5xl">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className={`animate-spin rounded-full h-10 w-10 border-t-2 ${isDarkMode ? "border-violet-500" : "border-violet-600"}`}></div>
          </div>
        ) : ventas.length === 0 ? (
          <div className={`p-20 rounded-[3rem] text-center border border-dashed transition-all ${
            isDarkMode ? "bg-slate-900/50 border-white/10" : "bg-slate-50 border-slate-200"
          }`}>
             <div className="opacity-20 flex justify-center mb-4 text-slate-500">
                <FileText size={48} />
             </div>
             <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No se detectan transacciones en el servidor</p>
          </div>
        ) : (
          ventas.map((venta) => (
            <div 
              key={venta.id} 
              className={`group p-6 rounded-[2rem] border transition-all duration-300 flex flex-col md:flex-row items-center justify-between gap-6 ${
                isDarkMode 
                ? "bg-slate-900/60 border-white/5 hover:border-violet-500/40 shadow-lg shadow-black/20" 
                : "bg-white border-slate-200 hover:border-violet-300 shadow-sm hover:shadow-md"
              }`}
            >
              <div className="flex items-center gap-6 w-full md:w-auto">
                <div className={`p-4 rounded-2xl transition-all border ${
                  isDarkMode 
                  ? "bg-slate-950 text-slate-500 border-white/5 group-hover:text-violet-400 group-hover:border-violet-500/20" 
                  : "bg-slate-50 text-slate-400 border-slate-100 group-hover:text-violet-600 group-hover:border-violet-200"
                }`}>
                  <FileText size={24} />
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-3">
                    <p className={`text-lg font-bold tracking-tight ${isDarkMode ? "text-white" : "text-slate-800"}`}>
                      Factura #TX-{venta.id.toString().padStart(4, '0')}
                    </p>
                    <span className={`text-[9px] font-black px-3 py-0.5 rounded-full border ${
                      isDarkMode ? "bg-white/5 text-slate-500 border-white/5" : "bg-slate-50 text-slate-500 border-slate-200"
                    }`}>
                      LIQUIDADO
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    <span className="flex items-center gap-1.5"><Calendar size={12} className="opacity-50"/> {new Date(venta.fecha).toLocaleDateString()}</span>
                    <span className="opacity-20">•</span>
                    <span>IVA 15% Incluido</span>
                  </div>
                </div>
              </div>

              <div className={`flex items-center gap-8 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-4 md:pt-0 ${
                isDarkMode ? "border-white/5" : "border-slate-100"
              }`}>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter mb-0.5">Monto de Operación</p>
                  <div className={`flex items-center justify-end gap-1 font-black ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                     <span className="text-3xl tracking-tighter">${parseFloat(venta.total).toFixed(2)}</span>
                  </div>
                </div>
                
                <button className={`p-3.5 rounded-xl border transition-all ${
                  isDarkMode 
                    ? "bg-white/5 text-slate-500 border-transparent hover:text-white hover:bg-violet-600" 
                    : "bg-slate-50 text-slate-400 border-slate-100 hover:text-violet-600 hover:bg-violet-50"
                }`}>
                   <ArrowUpRight size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* --- Footer Técnico SaaS --- */}
      <div className={`max-w-5xl p-8 rounded-[2.5rem] border flex flex-col md:flex-row items-center justify-between gap-4 transition-all ${
        isDarkMode ? "bg-violet-600/5 border-violet-500/10" : "bg-slate-100/50 border-slate-200"
      }`}>
         <div className="flex items-center gap-4">
            <div className={`p-2 rounded-lg ${isDarkMode ? "bg-slate-950" : "bg-white shadow-sm"}`}>
              <ShieldCheck className="text-violet-500" size={18} />
            </div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed">
              Integridad de Datos Garantizada • Sincronización PostgreSQL • Milagro, Ecuador
            </p>
         </div>
         <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] md:text-right">
            Auditoría Snayder Cedeño • UNEMI 2026
         </div>
      </div>
    </div>
  );
};

export default HistorialPage;