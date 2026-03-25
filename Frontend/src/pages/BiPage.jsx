import { useState, useEffect } from 'react';
import { 
  BarChart3, TrendingUp, TrendingDown, DollarSign, Package, AlertTriangle, 
  RefreshCcw, PieChart, CreditCard, Banknote, ShieldCheck, User, Clock, Info, Activity
} from 'lucide-react';

function BiPage({ isDarkMode, showToast, authFetch }) {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('kpis');
  const [data, setData] = useState({
    cierre_caja: { total: 0, efectivo: 0, transferencia: 0, credito: 0 },
    rentabilidad: { ingresos: 0, costos: 0, utilidad: 0, margen: 0 },
    inventario_critico: [],
    top_vendidos: [],
    logs: []
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resVentas, resProductos, resLogs] = await Promise.all([
        authFetch('http://localhost:8000/api/ventas/'),
        authFetch('http://localhost:8000/api/productos/'),
        authFetch('http://localhost:8000/api/audit/')
      ]);

      const ventas = await resVentas.json();
      const productos = await resProductos.json();
      const logs = await resLogs.json();

      // --- 🛡️ CORRECCIÓN DE FECHA LOCAL (MILAGRO, ECUADOR) ---
      // Obtenemos la fecha actual en formato YYYY-MM-DD considerando la zona horaria local
      const ahora = new Date();
      const offset = ahora.getTimezoneOffset() * 60000;
      const hoyLocal = new Date(ahora - offset).toISOString().split('T')[0];

      // Filtrar ventas de HOY
      const ventasHoy = ventas.filter(v => v.fecha.startsWith(hoyLocal));
      
      const cierre = {
        total: ventasHoy.reduce((acc, v) => acc + parseFloat(v.total), 0),
        efectivo: ventasHoy.filter(v => v.metodo_pago === 'EFECTIVO').reduce((acc, v) => acc + parseFloat(v.total), 0),
        transferencia: ventasHoy.filter(v => v.metodo_pago === 'TRANSFERENCIA').reduce((acc, v) => acc + parseFloat(v.total), 0),
        credito: ventasHoy.filter(v => v.metodo_pago === 'CREDITO').reduce((acc, v) => acc + parseFloat(v.total), 0),
      };

      // --- RENTABILIDAD GLOBAL ---
      let ingresos = 0;
      let costos = 0;
      const ventasConteo = {}; 

      ventas.forEach(v => {
        ingresos += parseFloat(v.total);
        v.items?.forEach(item => {
          costos += (parseFloat(item.costo_unitario || 0) * item.cantidad);
          ventasConteo[item.nombre] = (ventasConteo[item.nombre] || 0) + item.cantidad;
        });
      });

      const utilidad = ingresos - costos;
      const margen = ingresos > 0 ? (utilidad / ingresos) * 100 : 0;

      const top5 = Object.entries(ventasConteo)
        .map(([nombre, cantidad]) => ({ nombre, cantidad }))
        .sort((a, b) => b.cantidad - a.cantidad)
        .slice(0, 5);

      const criticos = productos.filter(p => p.stock <= p.stock_minimo);

      setData({
        cierre_caja: cierre,
        rentabilidad: { ingresos, costos, utilidad, margen },
        inventario_critico: criticos,
        top_vendidos: top5,
        logs: logs.slice(0, 20) 
      });

    } catch (err) {
      showToast("Error al procesar analítica", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) return (
    <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
      <RefreshCcw className="animate-spin text-violet-500" size={40} />
      <p className="font-black text-xs uppercase tracking-[0.3em] animate-pulse">Analizando Inteligencia...</p>
    </div>
  );

  return (
    <div className="flex flex-col space-y-10 animate-in fade-in duration-700 pb-20">
      
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className={`text-4xl font-black tracking-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}>
            Business <span className="text-violet-600">Intelligence</span>
          </h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-2">Centro de Control Estratégico</p>
        </div>
        
        <div className={`p-1.5 rounded-2xl border flex gap-2 ${isDarkMode ? "bg-slate-900 border-white/5" : "bg-white border-slate-200 shadow-sm"}`}>
          <button 
            onClick={() => setActiveTab('kpis')}
            className={`px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'kpis' ? "bg-violet-600 text-white shadow-lg" : "text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5"}`}
          >
            Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('audit')}
            className={`px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'audit' ? "bg-violet-600 text-white shadow-lg" : "text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5"}`}
          >
            Auditoría
          </button>
        </div>
      </header>

      {activeTab === 'kpis' ? (
        <>
          {/* KPI CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className={`p-6 rounded-[2rem] border ${isDarkMode ? "bg-slate-900/50 border-white/5" : "bg-white border-slate-200"}`}>
              <p className="text-[9px] font-black uppercase text-slate-500 mb-4 tracking-widest text-center">Utilidad Neta Total</p>
              <p className={`text-3xl font-black text-center ${isDarkMode ? "text-white" : "text-slate-900"}`}>${data.rentabilidad.utilidad.toFixed(2)}</p>
            </div>
            <div className={`p-6 rounded-[2rem] border ${isDarkMode ? "bg-slate-900/50 border-white/5" : "bg-white border-slate-200"}`}>
              <p className="text-[9px] font-black uppercase text-slate-500 mb-4 tracking-widest text-center">Margen de Ganancia</p>
              <div className="flex flex-col items-center">
                <p className={`text-3xl font-black ${data.rentabilidad.margen > 30 ? "text-green-500" : "text-amber-500"}`}>
                  {data.rentabilidad.margen.toFixed(1)}%
                </p>
                <div className="w-24 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mt-2 overflow-hidden shadow-inner">
                  <div className="h-full bg-violet-500" style={{ width: `${Math.min(100, data.rentabilidad.margen)}%` }}></div>
                </div>
              </div>
            </div>
            <div className={`p-6 rounded-[2rem] border ${isDarkMode ? "bg-slate-900/50 border-white/5" : "bg-white border-slate-200"}`}>
              <p className="text-[9px] font-black uppercase text-slate-500 mb-4 tracking-widest text-center">Inversión en Stock</p>
              <p className="text-3xl font-black text-center text-red-500/80">${data.rentabilidad.costos.toFixed(2)}</p>
            </div>
            <div className={`p-6 rounded-[2rem] border ${isDarkMode ? "bg-violet-600 border-violet-500 shadow-2xl shadow-violet-600/20" : "bg-violet-600 border-violet-700 shadow-xl"}`}>
              <p className="text-[9px] font-black uppercase text-white/60 mb-4 tracking-widest text-center">Ingresos Brutos</p>
              <p className="text-3xl font-black text-center text-white">${data.rentabilidad.ingresos.toFixed(2)}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* CIERRE DE CAJA DEL DÍA (DESGLOSE POR MÉTODO) */}
            <section className={`lg:col-span-2 p-10 rounded-[3rem] border ${isDarkMode ? "bg-slate-900/50 border-white/5 shadow-2xl shadow-black/40" : "bg-white border-slate-200 shadow-xl shadow-slate-200/50"}`}>
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-xl font-black flex items-center gap-4">
                  <PieChart className="text-violet-500" /> Cierre de Caja (Hoy)
                </h2>
                <div className="px-4 py-1.5 rounded-full bg-slate-500/10 text-slate-500 text-[9px] font-black uppercase tracking-widest">
                  Milagro Time (UTC-5)
                </div>
              </div>
              
              <div className="space-y-8">
                <div className="flex justify-between items-end pb-8 border-b border-slate-200 dark:border-white/5">
                  <span className="text-sm font-bold text-slate-500 uppercase tracking-widest ml-4">Ventas Consolidadas</span>
                  <span className={`text-6xl font-black tracking-tighter ${isDarkMode ? "text-white" : "text-slate-900"}`}>${data.cierre_caja.total.toFixed(2)}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { label: 'Efectivo', val: data.cierre_caja.efectivo, icon: Banknote, color: 'text-green-500', bg: 'bg-green-500/10' },
                    { label: 'Transferencia', val: data.cierre_caja.transferencia, icon: RefreshCcw, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                    { label: 'Crédito', val: data.cierre_caja.credito, icon: CreditCard, color: 'text-amber-500', bg: 'bg-amber-500/10' },
                  ].map((item, idx) => (
                    <div key={idx} className={`p-6 rounded-[2.2rem] border border-transparent transition-all duration-500 ${isDarkMode ? "bg-slate-950/50 hover:border-white/5 hover:bg-slate-900" : "bg-slate-50 hover:border-slate-200 hover:bg-white shadow-sm"}`}>
                      <div className={`w-12 h-12 rounded-2xl ${item.bg} ${item.color} flex items-center justify-center mb-5 shadow-inner`}><item.icon size={22}/></div>
                      <p className="text-[10px] font-black uppercase text-slate-500 tracking-tighter mb-1 ml-1">{item.label}</p>
                      <p className={`text-2xl font-black ${isDarkMode ? "text-white" : "text-slate-900"}`}>${item.val.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* TOP 5 PRODUCTOS */}
            <section className={`p-10 rounded-[3rem] border ${isDarkMode ? "bg-slate-900/50 border-white/5 shadow-2xl" : "bg-white border-slate-200 shadow-xl"}`}>
              <h2 className="text-xl font-black mb-10 flex items-center gap-4">
                <TrendingUp className="text-green-500" /> Productos Estrella
              </h2>
              <div className="space-y-6">
                {data.top_vendidos.length === 0 ? (
                  <p className="text-center py-10 opacity-20 font-black text-[10px] uppercase">Sin ventas registradas</p>
                ) : data.top_vendidos.map((p, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs shadow-sm ${idx === 0 ? "bg-violet-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500"}`}>
                      {idx + 1}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className={`text-xs font-black truncate uppercase tracking-tight ${isDarkMode ? "text-slate-200" : "text-slate-800"}`}>{p.nombre}</p>
                      <div className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-full mt-2 overflow-hidden shadow-inner">
                        <div className="h-full bg-violet-500 transition-all duration-1000" style={{ width: `${(p.cantidad / (data.top_vendidos[0]?.cantidad || 1)) * 100}%` }}></div>
                      </div>
                    </div>
                    <span className="text-[10px] font-black text-violet-500 bg-violet-500/10 px-2 py-1 rounded-lg">{p.cantidad} u.</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* REPOSICIÓN URGENTE */}
          <section className={`p-10 rounded-[3rem] border ${isDarkMode ? "bg-red-500/5 border-red-500/10" : "bg-red-50/50 border-red-100 shadow-sm"}`}>
            <h2 className="text-xl font-black mb-8 flex items-center gap-4 text-red-500">
              <AlertTriangle /> Alerta de Stock Crítico (RF 3.4)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {data.inventario_critico.length === 0 ? (
                <p className="col-span-full text-center py-10 font-bold opacity-30 text-xs uppercase tracking-widest italic">Stock Saludable en todos los componentes.</p>
              ) : data.inventario_critico.map(p => (
                <div key={p.id} className={`p-5 rounded-3xl border flex items-center gap-4 transition-all ${isDarkMode ? "bg-slate-900 border-white/5 hover:bg-slate-800" : "bg-white border-slate-200 hover:shadow-lg"}`}>
                  <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-950 p-1.5 flex items-center justify-center shrink-0 shadow-inner">
                    <img src={p.imagen} className="w-full h-full object-contain" alt=""/>
                  </div>
                  <div className="overflow-hidden">
                    <p className={`text-xs font-black truncate tracking-tight ${isDarkMode ? "text-white" : "text-slate-800"}`}>{p.nombre}</p>
                    <p className="text-[9px] font-black text-red-500 uppercase mt-0.5">Quedan {p.stock} unidades</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      ) : (
        /* AUDITORÍA OPERATIVA */
        <section className={`p-10 rounded-[3.5rem] border transition-all animate-in slide-in-from-bottom-4 duration-500 ${isDarkMode ? "bg-slate-900/50 border-white/5 shadow-2xl" : "bg-white border-slate-200 shadow-xl shadow-slate-200/50"}`}>
          <div className="flex items-center gap-5 mb-12">
            <div className="p-4 rounded-[1.5rem] bg-violet-600/10 text-violet-500 shadow-inner"><Activity size={28}/></div>
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tight">Trazabilidad de Auditoría</h2>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Registros inalterables de acciones críticas</p>
            </div>
          </div>
          
          <div className="space-y-4 max-h-[800px] overflow-y-auto pr-4 custom-scrollbar">
            {data.logs.length === 0 ? (
              <div className="py-20 text-center opacity-20 font-black text-xs uppercase italic">No se han registrado acciones críticas todavía</div>
            ) : data.logs.map((log, idx) => (
              <div key={idx} className={`p-6 rounded-[2rem] border flex flex-col md:flex-row justify-between items-start md:items-center gap-6 transition-all ${isDarkMode ? "bg-slate-950/50 border-white/5 hover:bg-slate-900" : "bg-slate-50 border-slate-100 hover:bg-white hover:shadow-md"}`}>
                <div className="flex items-center gap-6">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-inner ${
                    log.accion === 'ELIMINACION' ? "bg-red-500/10 text-red-500" : 
                    log.accion === 'LOGIN' ? "bg-blue-500/10 text-blue-500" : 
                    "bg-green-500/10 text-green-500"
                  }`}>
                    {log.accion === 'ELIMINACION' ? <AlertTriangle size={24}/> : log.accion === 'LOGIN' ? <User size={24}/> : <ShieldCheck size={24}/>}
                  </div>
                  <div>
                    <p className={`font-black text-sm uppercase tracking-tight ${isDarkMode ? "text-white" : "text-slate-800"}`}>{log.descripcion}</p>
                    <div className="flex flex-wrap gap-4 items-center mt-2">
                      <span className="text-[10px] font-black text-slate-500 uppercase flex items-center gap-1.5"><User size={12} className="text-violet-500"/> {log.usuario}</span>
                      <span className="text-[10px] font-black text-slate-500 uppercase flex items-center gap-1.5"><Clock size={12} className="text-violet-500"/> {new Date(log.fecha).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <div className={`px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-sm ${
                  log.accion === 'ELIMINACION' ? "bg-red-600 text-white" : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                }`}>
                  {log.accion}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { 
          background-color: ${isDarkMode ? "#334155" : "#cbd5e1"}; 
          border-radius: 10px; 
        }
      `}</style>
    </div>
  );
}

export default BiPage;