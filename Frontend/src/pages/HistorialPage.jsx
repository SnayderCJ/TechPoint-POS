import { useState, useEffect } from 'react';
import { History, Search, Calendar, FileText, Filter, RefreshCcw, ArrowRight, User, Package, DollarSign, CreditCard } from 'lucide-react';

function HistorialPage({ isDarkMode, config, showToast, authFetch }) { // 👈 Recibe authFetch
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [ventaDetalle, setVentaDetalle] = useState(null);

  const ivaPorcentaje = parseFloat(config?.iva_porcentaje || 15);

  const fetchVentas = async () => {
    try {
      const response = await authFetch('http://localhost:8000/api/ventas/');
      const data = await response.json();
      setVentas(data);
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

  useEffect(() => { fetchVentas(); }, []);

  const ventasFiltradas = ventas.filter(v => 
    v.id.toString().includes(busqueda) || 
    (v.cliente_nombre && v.cliente_nombre.toLowerCase().includes(busqueda.toLowerCase()))
  );

  return (
    <div className="flex flex-col space-y-10 animate-in fade-in slide-in-from-top-4 duration-700 pb-20">
      
      {/* HEADER */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className={`text-4xl font-black tracking-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}>
            Historial de <span className="text-violet-600">Transacciones</span>
          </h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-2">
            Registro Central de PostgreSQL • Milagro
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className={`p-4 rounded-2xl border flex items-center gap-3 ${isDarkMode ? "bg-slate-900/50 border-white/5" : "bg-white border-slate-200 shadow-sm"}`}>
            <Calendar className="text-violet-500" size={18} />
            <span className="text-xs font-black uppercase tracking-widest">{new Date().toLocaleDateString()}</span>
          </div>
          <button onClick={fetchVentas} className="p-4 rounded-2xl bg-violet-600/10 text-violet-500 hover:bg-violet-600 hover:text-white transition-all active:scale-90">
            <RefreshCcw size={20} />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* LISTADO DE VENTAS */}
        <div className="lg:col-span-2 space-y-6">
          <div className={`p-6 rounded-3xl border flex items-center gap-4 transition-all ${isDarkMode ? "bg-slate-900/40 border-white/5" : "bg-white border-slate-200 shadow-sm"}`}>
            <Search className="text-slate-400" size={20} />
            <input 
              type="text" placeholder="Buscar por ID de venta o cliente..." 
              className={`w-full bg-transparent outline-none font-bold text-sm ${isDarkMode ? "text-white" : "text-slate-900"}`}
              value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="p-20 text-center animate-pulse font-black text-xs uppercase tracking-[0.2em]">Sincronizando Registros...</div>
            ) : ventasFiltradas.map(venta => (
              <div 
                key={venta.id} 
                onClick={() => setVentaDetalle(venta)}
                className={`group p-6 rounded-[2.5rem] border cursor-pointer transition-all duration-300 flex flex-col md:flex-row justify-between items-center gap-6 ${
                  ventaDetalle?.id === venta.id 
                  ? (isDarkMode ? "bg-violet-600 border-violet-500 text-white" : "bg-violet-600 border-violet-600 text-white shadow-xl shadow-violet-200")
                  : (isDarkMode ? "bg-slate-900/60 border-white/5 hover:border-violet-500/40" : "bg-white border-slate-100 hover:border-violet-400 shadow-md")
                }`}
              >
                <div className="flex items-center gap-6 w-full">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${
                    ventaDetalle?.id === venta.id ? "bg-white/20" : (isDarkMode ? "bg-slate-950 text-violet-400" : "bg-violet-50 text-violet-600")
                  }`}>
                    <FileText size={24} />
                  </div>
                  <div className="overflow-hidden">
                    <div className="flex items-center gap-3">
                      <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${ventaDetalle?.id === venta.id ? "bg-white/20 text-white" : "bg-slate-500/10 text-slate-500"}`}>Venta #{venta.id}</span>
                      <span className={`text-[10px] font-black uppercase tracking-widest ${ventaDetalle?.id === venta.id ? "text-white/60" : "text-slate-400"}`}>
                        {new Date(venta.fecha).toLocaleString()}
                      </span>
                    </div>
                    <h3 className="font-black text-lg truncate mt-1">
                      {venta.cliente_nombre || "Consumidor Final"}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-8 w-full md:w-auto justify-between">
                  <div className="text-right">
                    <p className={`text-[9px] font-black uppercase tracking-tighter ${ventaDetalle?.id === venta.id ? "text-white/60" : "text-slate-500"}`}>Total Liquidado</p>
                    <p className="text-2xl font-black tracking-tighter">${parseFloat(venta.total).toFixed(2)}</p>
                  </div>
                  <ArrowRight size={20} className={`transition-transform duration-300 ${ventaDetalle?.id === venta.id ? "translate-x-2" : "text-slate-300 group-hover:text-violet-500"}`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* DETALLE LATERAL */}
        <aside className="relative">
          <div className={`sticky top-8 p-8 rounded-[3.5rem] border min-h-[600px] transition-all flex flex-col ${
            isDarkMode 
            ? "bg-slate-900/80 backdrop-blur-xl border-white/10 shadow-2xl" 
            : "bg-white border-slate-200 shadow-xl shadow-slate-300/50"
          }`}>
            {!ventaDetalle ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center opacity-20 grayscale">
                <Filter size={80} className="mb-6" />
                <p className="font-black uppercase tracking-[0.2em] text-xs">Selecciona un registro<br/>para ver el detalle</p>
              </div>
            ) : (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500 flex flex-col h-full">
                <div className="flex justify-between items-start mb-8">
                  <h2 className={`text-2xl font-black ${isDarkMode ? "text-white" : "text-slate-800"}`}>Recibo Digital</h2>
                  <button onClick={() => setVentaDetalle(null)} className="p-2 hover:bg-slate-500/10 rounded-xl transition-colors"><X size={20}/></button>
                </div>

                <div className={`p-6 rounded-3xl mb-8 flex items-center gap-4 ${isDarkMode ? "bg-slate-950/50" : "bg-slate-50"}`}>
                  <div className="p-3 rounded-2xl bg-violet-600 text-white shadow-lg"><User size={20}/></div>
                  <div className="overflow-hidden">
                    <p className="text-[10px] font-black uppercase text-slate-500">Cliente</p>
                    <p className={`font-bold truncate ${isDarkMode ? "text-white" : "text-slate-900"}`}>{ventaDetalle.cliente_nombre || "Consumidor Final"}</p>
                  </div>
                </div>

                <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                  {ventaDetalle.items?.map((item, idx) => (
                    <div key={idx} className={`p-4 rounded-2xl border flex justify-between items-center ${isDarkMode ? "bg-white/5 border-white/5" : "bg-white border-slate-100 shadow-sm"}`}>
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDarkMode ? "bg-slate-950" : "bg-slate-50"}`}>
                          <Package size={18} className="text-violet-500" />
                        </div>
                        <div>
                          <p className={`text-xs font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>{item.nombre}</p>
                          <p className="text-[10px] text-slate-500 font-bold uppercase">{item.cantidad} unidades</p>
                        </div>
                      </div>
                      <p className="text-xs font-black text-violet-500">${parseFloat(item.precio).toFixed(2)}</p>
                    </div>
                  ))}
                </div>

                <div className={`mt-10 pt-8 border-t space-y-4 ${isDarkMode ? "border-white/10" : "border-slate-200"}`}>
                  <div className="flex justify-between items-center px-2 text-slate-500 font-bold uppercase text-[10px] tracking-widest">
                    <span>Subtotal (Sin IVA)</span>
                    <span>${(parseFloat(ventaDetalle.total) / (1 + (ivaPorcentaje / 100))).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center px-2 text-slate-500 font-bold uppercase text-[10px] tracking-widest border-b pb-4 dark:border-white/5">
                    <span>IVA Recaudado ({ivaPorcentaje}%)</span>
                    <span>${(parseFloat(ventaDetalle.total) - (parseFloat(ventaDetalle.total) / (1 + (ivaPorcentaje / 100)))).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-end p-2">
                    <p className={`text-4xl font-black tracking-tighter ${isDarkMode ? "text-white" : "text-slate-950"}`}>
                      ${parseFloat(ventaDetalle.total).toFixed(2)}
                    </p>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-violet-500 uppercase tracking-widest mb-1 flex items-center gap-2 justify-end">
                        <DollarSign size={12}/> {ventaDetalle.metodo_pago || 'EFECTIVO'}
                      </p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Transacción Exitosa</p>
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

const X = ({ size }) => <RefreshCcw size={size} className="rotate-45" />; // Fallback icon

export default HistorialPage;