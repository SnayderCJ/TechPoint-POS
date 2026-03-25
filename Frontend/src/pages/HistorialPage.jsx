import { useState, useEffect } from 'react';
import { History, Search, Calendar, FileText, Filter, RefreshCcw, ArrowRight, User, Package, DollarSign, CreditCard, X } from 'lucide-react';

function HistorialPage({ isDarkMode, config, showToast, authFetch }) {
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [ventaDetalle, setVentaDetalle] = useState(null);

  const ivaPorcentaje = parseFloat(config?.iva_porcentaje || 15);

  const fetchVentas = async () => {
    try {
      const response = await authFetch('http://localhost:8000/api/ventas/');
      const data = await response.json();
      setVentas(Array.isArray(data) ? data : []);
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

  useEffect(() => { fetchVentas(); }, []);

  const ventasFiltradas = ventas.filter(v => 
    v.id.toString().includes(busqueda) || 
    (v.cliente_nombre && v.cliente_nombre.toLowerCase().includes(busqueda.toLowerCase()))
  );

  return (
    <div className="flex flex-col space-y-6 md:space-y-10 animate-in fade-in slide-in-from-top-4 duration-700 pb-20 px-2 md:px-0">
      
      {/* HEADER */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6">
        <div>
          <h1 className={`text-3xl md:text-4xl font-black tracking-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}>
            Historial de <span className="text-violet-600">Transacciones</span>
          </h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[9px] md:text-[10px] mt-1 md:mt-2">
            Registro Central de PostgreSQL • Milagro
          </p>
        </div>
        <div className="flex items-center gap-3 md:gap-4 w-full md:w-auto">
          <div className={`flex-1 md:flex-none p-3 md:p-4 rounded-xl md:rounded-2xl border flex items-center justify-center gap-2 md:gap-3 ${isDarkMode ? "bg-slate-900/50 border-white/5" : "bg-white border-slate-200 shadow-sm"}`}>
            <Calendar className="text-violet-500" size={16} />
            <span className="text-[10px] md:text-xs font-black uppercase tracking-widest">{new Date().toLocaleDateString()}</span>
          </div>
          <button onClick={fetchVentas} className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-violet-600/10 text-violet-500 hover:bg-violet-600 hover:text-white transition-all active:scale-90">
            <RefreshCcw size={20} />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-10">
        
        {/* LISTADO DE VENTAS ADAPTABLE */}
        <div className="lg:col-span-1 xl:col-span-2 space-y-4 md:space-y-6">
          <div className={`p-4 md:p-6 rounded-2xl md:rounded-3xl border flex items-center gap-4 transition-all ${isDarkMode ? "bg-slate-900/40 border-white/5" : "bg-white border-slate-200 shadow-sm"}`}>
            <Search className="text-slate-400" size={20} />
            <input 
              type="text" placeholder="ID venta o cliente..." 
              className={`w-full bg-transparent outline-none font-bold text-sm ${isDarkMode ? "text-white" : "text-slate-900"}`}
              value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          <div className="space-y-3 md:space-y-4">
            {loading ? (
              <div className="p-20 text-center animate-pulse font-black text-xs uppercase">Sincronizando Registros...</div>
            ) : ventasFiltradas.length === 0 ? (
              <div className="p-20 text-center opacity-20 font-black text-xs uppercase italic">No se encontraron ventas</div>
            ) : ventasFiltradas.map(venta => (
              <div 
                key={venta.id} 
                onClick={() => setVentaDetalle(venta)}
                className={`group p-4 md:p-6 rounded-[1.8rem] md:rounded-[2.5rem] border cursor-pointer transition-all duration-300 flex flex-col md:flex-row justify-between items-center gap-4 ${
                  ventaDetalle?.id === venta.id 
                  ? (isDarkMode ? "bg-violet-600 border-violet-500 text-white" : "bg-violet-600 border-violet-600 text-white shadow-xl shadow-violet-200")
                  : (isDarkMode ? "bg-slate-900/60 border-white/5 hover:border-violet-500/40" : "bg-white border-slate-100 hover:border-violet-400 shadow-sm")
                }`}
              >
                <div className="flex items-center gap-4 md:gap-6 w-full">
                  <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0 transition-colors ${
                    ventaDetalle?.id === venta.id ? "bg-white/20" : (isDarkMode ? "bg-slate-950 text-violet-400" : "bg-violet-50 text-violet-600")
                  }`}>
                    <FileText size={22} md:size={24} />
                  </div>
                  <div className="overflow-hidden">
                    <div className="flex items-center gap-2 md:gap-3">
                      <span className={`text-[8px] md:text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded ${ventaDetalle?.id === venta.id ? "bg-white/20 text-white" : "bg-slate-500/10 text-slate-500"}`}>Venta #{venta.id}</span>
                      <span className={`text-[8px] md:text-[9px] font-black uppercase tracking-widest ${ventaDetalle?.id === venta.id ? "text-white/60" : "text-slate-400"}`}>
                        {new Date(venta.fecha).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="font-black text-md md:text-lg truncate mt-1">
                      {venta.cliente_nombre || "Consumidor Final"}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-4 md:gap-8 w-full md:w-auto justify-between">
                  <div className="text-right">
                    <p className={`text-[8px] font-black uppercase tracking-tighter ${ventaDetalle?.id === venta.id ? "text-white/60" : "text-slate-500"}`}>Total</p>
                    <p className="text-xl md:text-2xl font-black tracking-tighter">${parseFloat(venta.total).toFixed(2)}</p>
                  </div>
                  <ArrowRight size={18} className={`transition-transform duration-300 ${ventaDetalle?.id === venta.id ? "translate-x-2" : "text-slate-300 group-hover:text-violet-500"}`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* DETALLE LATERAL - ADAPTABLE */}
        <aside className="relative">
          <div className={`sticky top-8 p-6 md:p-8 rounded-[2.5rem] md:rounded-[3.5rem] border min-h-[400px] md:min-h-[600px] transition-all flex flex-col ${
            isDarkMode 
            ? "bg-slate-900/80 backdrop-blur-xl border-white/10 shadow-2xl" 
            : "bg-white border-slate-200 shadow-xl shadow-slate-300/50"
          }`}>
            {!ventaDetalle ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center opacity-20 grayscale">
                <Filter size={60} md:size={80} className="mb-6" />
                <p className="font-black uppercase tracking-[0.2em] text-[10px] md:text-xs text-balance">Selecciona un registro<br/>para ver el detalle</p>
              </div>
            ) : (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500 flex flex-col h-full">
                <div className="flex justify-between items-start mb-6 md:mb-8">
                  <h2 className={`text-xl md:text-2xl font-black ${isDarkMode ? "text-white" : "text-slate-800"}`}>Recibo Digital</h2>
                  <button onClick={() => setVentaDetalle(null)} className="p-2 hover:bg-slate-500/10 rounded-xl transition-colors"><X size={20}/></button>
                </div>

                <div className={`p-4 md:p-6 rounded-2xl md:rounded-3xl mb-6 md:mb-8 flex items-center gap-4 ${isDarkMode ? "bg-slate-950/50" : "bg-slate-50"}`}>
                  <div className="p-2.5 md:p-3 rounded-xl md:rounded-2xl bg-violet-600 text-white shadow-lg"><User size={18} md:size={20}/></div>
                  <div className="overflow-hidden">
                    <p className="text-[9px] md:text-[10px] font-black uppercase text-slate-500">Cliente</p>
                    <p className={`font-bold text-sm md:text-md truncate ${isDarkMode ? "text-white" : "text-slate-900"}`}>{ventaDetalle.cliente_nombre || "Consumidor Final"}</p>
                  </div>
                </div>

                <div className="flex-1 space-y-3 md:space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                  {ventaDetalle.items?.map((item, idx) => (
                    <div key={idx} className={`p-3 md:p-4 rounded-xl md:rounded-2xl border flex justify-between items-center ${isDarkMode ? "bg-white/5 border-white/5" : "bg-white border-slate-100 shadow-sm"}`}>
                      <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
                        <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl flex items-center justify-center ${isDarkMode ? "bg-slate-950" : "bg-slate-50"}`}>
                          <Package size={16} md:size={18} className="text-violet-500" />
                        </div>
                        <div className="overflow-hidden">
                          <p className={`text-[10px] md:text-xs font-bold truncate ${isDarkMode ? "text-white" : "text-slate-900"}`}>{item.nombre}</p>
                          <p className="text-[8px] md:text-[9px] text-slate-500 font-black uppercase">{item.cantidad} u.</p>
                        </div>
                      </div>
                      <p className="text-[10px] md:text-xs font-black text-violet-500 shrink-0 ml-2">${parseFloat(item.precio).toFixed(2)}</p>
                    </div>
                  ))}
                </div>

                <div className={`mt-6 md:mt-10 pt-6 md:pt-8 border-t space-y-3 md:space-y-4 ${isDarkMode ? "border-white/10" : "border-slate-200"}`}>
                  <div className="flex justify-between items-center px-2 text-slate-500 font-bold uppercase text-[8px] md:text-[10px] tracking-widest">
                    <span>Sin IVA</span>
                    <span>${(parseFloat(ventaDetalle.total) / (1 + (ivaPorcentaje / 100))).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center px-2 text-slate-500 font-bold uppercase text-[8px] md:text-[10px] tracking-widest border-b pb-3 md:pb-4 dark:border-white/5">
                    <span>IVA Recaudado</span>
                    <span>${(parseFloat(ventaDetalle.total) - (parseFloat(ventaDetalle.total) / (1 + (ivaPorcentaje / 100)))).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-end p-2">
                    <p className={`text-3xl md:text-4xl font-black tracking-tighter ${isDarkMode ? "text-white" : "text-slate-950"}`}>
                      ${parseFloat(ventaDetalle.total).toFixed(2)}
                    </p>
                    <div className="text-right">
                      <p className="text-[9px] md:text-[10px] font-black text-violet-500 uppercase tracking-widest mb-1 flex items-center gap-1.5 justify-end">
                        <DollarSign size={12}/> {ventaDetalle.metodo_pago || 'EFECTIVO'}
                      </p>
                      <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Exitosa</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { 
          background-color: ${isDarkMode ? "#1e1b4b" : "#cbd5e1"}; 
          border-radius: 10px; 
        }
      `}</style>
    </div>
  );
}

export default HistorialPage;