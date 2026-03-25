import { useState, useEffect } from 'react';
import { 
  BarChart3, TrendingUp, TrendingDown, DollarSign, Package, AlertTriangle, 
  RefreshCcw, PieChart, CreditCard, Banknote, ShieldCheck, User, Clock, Info, Activity
} from 'lucide-react';

function BiPage({ isDarkMode, showToast, authFetch }) { // 👈 Recibe authFetch
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('kpis'); // 'kpis' o 'audit'
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

      const hoy = new Date().toISOString().split('T')[0];
      const ventasHoy = ventas.filter(v => v.fecha.startsWith(hoy));
      const cierre = {
        total: ventasHoy.reduce((acc, v) => acc + parseFloat(v.total), 0),
        efectivo: ventasHoy.filter(v => v.metodo_pago === 'EFECTIVO').reduce((acc, v) => acc + parseFloat(v.total), 0),
        transferencia: ventasHoy.filter(v => v.metodo_pago === 'TRANSFERENCIA').reduce((acc, v) => acc + parseFloat(v.total), 0),
        credito: ventasHoy.filter(v => v.metodo_pago === 'CREDITO').reduce((acc, v) => acc + parseFloat(v.total), 0),
      };

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
      <p className="font-black text-xs uppercase tracking-[0.3em] animate-pulse">Procesando Inteligencia de Negocio...</p>
    </div>
  );

  return (
    <div className="flex flex-col space-y-10 animate-in fade-in duration-700 pb-20">
      
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className={`text-4xl font-black tracking-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}>
            Business <span className="text-violet-600">Intelligence</span>
          </h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-2">Métricas, Rentabilidad y Auditoría</p>
        </div>
        
        <div className={`p-1.5 rounded-2xl border flex gap-2 ${isDarkMode ? "bg-slate-900 border-white/5" : "bg-white border-slate-200 shadow-sm"}`}>
          <button 
            onClick={() => setActiveTab('kpis')}
            className={`px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'kpis' ? "bg-violet-600 text-white shadow-lg shadow-violet-600/20" : "text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5"}`}
          >
            Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('audit')}
            className={`px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'audit' ? "bg-violet-600 text-white shadow-lg shadow-violet-600/20" : "text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5"}`}
          >
            Auditoría
          </button>
        </div>
      </header>

      {activeTab === 'kpis' ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className={`p-6 rounded-[2rem] border ${isDarkMode ? "bg-slate-900/50 border-white/5" : "bg-white border-slate-200"}`}>
              <p className="text-[9px] font-black uppercase text-slate-500 mb-4 tracking-widest text-center">Utilidad Neta</p>
              <p className={`text-3xl font-black text-center ${isDarkMode ? "text-white" : "text-slate-900"}`}>${data.rentabilidad.utilidad.toFixed(2)}</p>
            </div>
            <div className={`p-6 rounded-[2rem] border ${isDarkMode ? "bg-slate-900/50 border-white/5" : "bg-white border-slate-200"}`}>
              <p className="text-[9px] font-black uppercase text-slate-500 mb-4 tracking-widest text-center">Margen de Ganancia</p>
              <div className="flex flex-col items-center">
                <p className={`text-3xl font-black ${data.rentabilidad.margen > 30 ? "text-green-500" : "text-amber-500"}`}>
                  {data.rentabilidad.margen.toFixed(1)}%
                </p>
                <div className="w-24 h-1 bg-slate-100 dark:bg-slate-800 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-violet-500" style={{ width: `${Math.min(100, data.rentabilidad.margen)}%` }}></div>
                </div>
              </div>
            </div>
            <div className={`p-6 rounded-[2rem] border ${isDarkMode ? "bg-slate-900/50 border-white/5" : "bg-white border-slate-200"}`}>
              <p className="text-[9px] font-black uppercase text-slate-500 mb-4 tracking-widest text-center">Costos Operativos</p>
              <p className="text-3xl font-black text-center text-red-500/80">${data.rentabilidad.costos.toFixed(2)}</p>
            </div>
            <div className={`p-6 rounded-[2rem] border ${isDarkMode ? "bg-violet-600 border-violet-500" : "bg-violet-600 border-violet-700 shadow-xl"}`}>
              <p className="text-[9px] font-black uppercase text-white/60 mb-4 tracking-widest text-center">Ingresos Totales</p>
              <p className="text-3xl font-black text-center text-white">${data.rentabilidad.ingresos.toFixed(2)}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <section className={`lg:col-span-2 p-10 rounded-[3rem] border ${isDarkMode ? "bg-slate-900/50 border-white/5 shadow-2xl" : "bg-white border-slate-200 shadow-xl shadow-slate-200/50"}`}>
              <h2 className="text-xl font-black mb-8 flex items-center gap-4">
                <PieChart className="text-violet-500" /> Consolidación de Hoy
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: 'Efectivo', val: data.cierre_caja.efectivo, icon: Banknote, color: 'text-green-500', bg: 'bg-green-500/10' },
                  { label: 'Transferencia', val: data.cierre_caja.transferencia, icon: RefreshCcw, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                  { label: 'Crédito', val: data.cierre_caja.credito, icon: CreditCard, color: 'text-amber-500', bg: 'bg-amber-500/10' },
                ].map((item, idx) => (
                  <div key={idx} className={`p-6 rounded-[2rem] border border-transparent transition-all ${isDarkMode ? "bg-slate-950/50 hover:border-white/5" : "bg-slate-50 hover:border-slate-200"}`}>
                    <div className={`w-10 h-10 rounded-xl ${item.bg} ${item.color} flex items-center justify-center mb-4 shadow-inner`}><item.icon size={20}/></div>
                    <p className="text-[10px] font-black uppercase text-slate-500 tracking-tighter mb-1">{item.label}</p>
                    <p className={`text-2xl font-black ${isDarkMode ? "text-white" : "text-slate-900"}`}>${item.val.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className={`p-10 rounded-[3rem] border ${isDarkMode ? "bg-slate-900/50 border-white/5 shadow-2xl" : "bg-white border-slate-200 shadow-xl shadow-slate-200/50"}`}>
              <h2 className="text-xl font-black mb-8 flex items-center gap-4">
                <TrendingUp className="text-green-500" /> Top 5 Productos
              </h2>
              <div className="space-y-5">
                {data.top_vendidos.map((p, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs ${idx === 0 ? "bg-violet-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500"}`}>
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-bold truncate ${isDarkMode ? "text-white" : "text-slate-800"}`}>{p.nombre}</p>
                      <div className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-full mt-1 overflow-hidden">
                        <div className="h-full bg-violet-500" style={{ width: `${(p.cantidad / (data.top_vendidos[0]?.cantidad || 1)) * 100}%` }}></div>
                      </div>
                    </div>
                    <span className="text-xs font-black text-violet-500">{p.cantidad} u.</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <section className={`p-10 rounded-[3rem] border ${isDarkMode ? "bg-red-500/5 border-red-500/10" : "bg-red-50/50 border-red-100"}`}>
            <h2 className="text-xl font-black mb-8 flex items-center gap-4 text-red-500">
              <AlertTriangle /> Reposición Urgente
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {data.inventario_critico.length === 0 ? (
                <p className="col-span-3 text-center py-10 font-bold opacity-30 text-xs uppercase tracking-widest italic">Todo el stock está dentro de los límites saludables.</p>
              ) : data.inventario_critico.map(p => (
                <div key={p.id} className={`p-5 rounded-3xl border flex justify-between items-center ${isDarkMode ? "bg-slate-900/80 border-white/5" : "bg-white border-slate-200 shadow-sm"}`}>
                  <div className="flex items-center gap-4 overflow-hidden">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-950 p-1 flex items-center justify-center shrink-0">
                      <img src={p.imagen} className="w-full h-full object-contain" alt=""/>
                    </div>
                    <div className="overflow-hidden">
                      <p className={`text-xs font-black truncate ${isDarkMode ? "text-white" : "text-slate-800"}`}>{p.nombre}</p>
                      <p className="text-[9px] font-bold text-red-500 uppercase">Stock: {p.stock} (Mín: {p.stock_minimo})</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      ) : (
        <section className={`p-10 rounded-[3rem] border transition-all animate-in slide-in-from-bottom-4 ${isDarkMode ? "bg-slate-900/50 border-white/5 shadow-2xl" : "bg-white border-slate-200 shadow-xl"}`}>
          <div className="flex items-center gap-4 mb-10">
            <div className="p-3 rounded-2xl bg-violet-600/10 text-violet-500"><Activity size={24}/></div>
            <h2 className="text-2xl font-black">Historial de Auditoría</h2>
          </div>
          
          <div className="space-y-4">
            {data.logs.map((log, idx) => (
              <div key={idx} className={`p-6 rounded-3xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${isDarkMode ? "bg-slate-950/50 border-white/5 hover:bg-slate-900" : "bg-slate-50 border-slate-100 hover:bg-slate-100/50"} transition-all`}>
                <div className="flex items-center gap-5">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                    log.accion === 'ELIMINACION' ? "bg-red-500/10 text-red-500" : 
                    log.accion === 'LOGIN' ? "bg-blue-500/10 text-blue-500" : 
                    "bg-green-500/10 text-green-500"
                  }`}>
                    {log.accion === 'ELIMINACION' ? <Activity size={20}/> : log.accion === 'LOGIN' ? <User size={20}/> : <ShieldCheck size={20}/>}
                  </div>
                  <div>
                    <p className={`font-black text-sm uppercase tracking-tight ${isDarkMode ? "text-white" : "text-slate-800"}`}>{log.descripcion}</p>
                    <div className="flex gap-3 items-center mt-1">
                      <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1"><User size={10}/> {log.usuario}</span>
                      <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1"><Clock size={10}/> {new Date(log.fecha).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                  log.accion === 'ELIMINACION' ? "bg-red-500/10 text-red-500" : "bg-slate-500/10 text-slate-500"
                }`}>
                  {log.accion}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default BiPage;