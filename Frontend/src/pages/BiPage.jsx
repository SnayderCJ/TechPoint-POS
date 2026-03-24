import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, TrendingDown, DollarSign, Package, AlertTriangle, Calendar, RefreshCcw, PieChart, CreditCard, Banknote } from 'lucide-react';

function BiPage({ isDarkMode, showToast }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    cierre_caja: { total: 0, efectivo: 0, transferencia: 0, credito: 0 },
    rentabilidad: { ingresos: 0, costos: 0, utilidad: 0 },
    inventario_critico: []
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      // En un escenario real, esto vendría de endpoints especializados del backend.
      // Por ahora, consolidaremos la info desde los endpoints existentes para cumplir el RF 3.1 y 3.2 inmediatamente.
      
      const [resVentas, resProductos] = await Promise.all([
        fetch('http://localhost:8000/api/ventas/'),
        fetch('http://localhost:8000/api/productos/')
      ]);

      const ventas = await resVentas.json();
      const productos = await resProductos.json();

      // --- RF 3.1: Consolidación Diaria (Cierre de Caja) ---
      const hoy = new Date().toISOString().split('T')[0];
      const ventasHoy = ventas.filter(v => v.fecha.startsWith(hoy));
      
      const cierre = {
        total: ventasHoy.reduce((acc, v) => acc + parseFloat(v.total), 0),
        efectivo: ventasHoy.filter(v => v.metodo_pago === 'EFECTIVO').reduce((acc, v) => acc + parseFloat(v.total), 0),
        transferencia: ventasHoy.filter(v => v.metodo_pago === 'TRANSFERENCIA').reduce((acc, v) => acc + parseFloat(v.total), 0),
        credito: ventasHoy.filter(v => v.metodo_pago === 'CREDITO').reduce((acc, v) => acc + parseFloat(v.total), 0),
      };

      // --- RF 3.2: Rentabilidad ---
      // Para esto sumamos ingresos y costos de TODAS las ventas registradas
      let ingresosTotales = 0;
      let costosTotales = 0;

      ventas.forEach(v => {
        ingresosTotales += parseFloat(v.total);
        // El backend ya guarda el costo_unitario en cada detalle
        v.items?.forEach(item => {
          costosTotales += (parseFloat(item.costo_unitario || 0) * item.cantidad);
        });
      });

      // --- RF 3.4: Inventario Crítico ---
      const criticos = productos.filter(p => p.stock <= p.stock_minimo);

      setData({
        cierre_caja: cierre,
        rentabilidad: {
          ingresos: ingresosTotales,
          costos: costosTotales,
          utilidad: ingresosTotales - costosTotales
        },
        inventario_critico: criticos
      });

    } catch (err) {
      showToast("Error al sincronizar datos de BI", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) return (
    <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
      <RefreshCcw className="animate-spin text-violet-500" size={40} />
      <p className="font-black text-xs uppercase tracking-[0.3em] animate-pulse">Analizando Datos del Mercado...</p>
    </div>
  );

  return (
    <div className="flex flex-col space-y-10 animate-in fade-in duration-700 pb-20">
      <header className="flex justify-between items-center">
        <div>
          <h1 className={`text-4xl font-black tracking-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}>
            Business <span className="text-violet-600">Intelligence</span>
          </h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-2">Analítica en Tiempo Real • TechPoint</p>
        </div>
        <button onClick={fetchData} className="p-4 rounded-2xl bg-violet-600/10 text-violet-500 hover:bg-violet-600 hover:text-white transition-all">
          <RefreshCcw size={20} />
        </button>
      </header>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className={`p-8 rounded-[2.5rem] border transition-all ${isDarkMode ? "bg-slate-900/50 border-white/10 shadow-2xl" : "bg-white border-slate-200 shadow-xl"}`}>
          <div className="flex justify-between items-center mb-6">
            <div className="p-3 rounded-2xl bg-green-500/10 text-green-500"><TrendingUp size={24}/></div>
            <span className="text-[10px] font-black uppercase text-slate-500">Ingresos Totales</span>
          </div>
          <p className={`text-4xl font-black ${isDarkMode ? "text-white" : "text-slate-900"}`}>${data.rentabilidad.ingresos.toFixed(2)}</p>
        </div>

        <div className={`p-8 rounded-[2.5rem] border transition-all ${isDarkMode ? "bg-slate-900/50 border-white/10 shadow-2xl" : "bg-white border-slate-200 shadow-xl"}`}>
          <div className="flex justify-between items-center mb-6">
            <div className="p-3 rounded-2xl bg-red-500/10 text-red-500"><TrendingDown size={24}/></div>
            <span className="text-[10px] font-black uppercase text-slate-500">Costos de Adquisición</span>
          </div>
          <p className={`text-4xl font-black ${isDarkMode ? "text-white" : "text-slate-900"}`}>${data.rentabilidad.costos.toFixed(2)}</p>
        </div>

        <div className={`p-8 rounded-[2.5rem] border transition-all ${isDarkMode ? "bg-violet-600 border-violet-500 shadow-2xl shadow-violet-600/20" : "bg-violet-600 border-violet-700 shadow-xl shadow-violet-200"}`}>
          <div className="flex justify-between items-center mb-6">
            <div className="p-3 rounded-2xl bg-white/20 text-white"><DollarSign size={24}/></div>
            <span className="text-[10px] font-black uppercase text-white/60">Utilidad Neta (RF 3.2)</span>
          </div>
          <p className="text-4xl font-black text-white">${data.rentabilidad.utilidad.toFixed(2)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* RF 3.1: CIERRE DE CAJA */}
        <section className={`p-10 rounded-[3.5rem] border ${isDarkMode ? "bg-slate-900/50 border-white/10" : "bg-white border-slate-200 shadow-xl"}`}>
          <h2 className="text-2xl font-black mb-8 flex items-center gap-4">
            <PieChart className="text-violet-500" /> Cierre de Caja del Día
          </h2>
          
          <div className="space-y-6">
            <div className="flex justify-between items-end pb-6 border-b border-slate-200 dark:border-white/5">
              <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Ventas de Hoy</span>
              <span className={`text-5xl font-black ${isDarkMode ? "text-white" : "text-slate-900"}`}>${data.cierre_caja.total.toFixed(2)}</span>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {[
                { label: 'Efectivo', val: data.cierre_caja.efectivo, icon: Banknote, color: 'text-green-500' },
                { label: 'Transferencias', val: data.cierre_caja.transferencia, icon: RefreshCcw, color: 'text-blue-500' },
                { label: 'Créditos Otorgados', val: data.cierre_caja.credito, icon: CreditCard, color: 'text-amber-500' },
              ].map((item, idx) => (
                <div key={idx} className={`p-5 rounded-3xl border flex justify-between items-center ${isDarkMode ? "bg-slate-950/50 border-white/5" : "bg-slate-50 border-slate-100"}`}>
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-xl bg-white dark:bg-slate-900 shadow-sm ${item.color}`}><item.icon size={18}/></div>
                    <span className="text-xs font-black uppercase text-slate-500">{item.label}</span>
                  </div>
                  <span className={`font-black ${isDarkMode ? "text-white" : "text-slate-800"}`}>${item.val.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* RF 3.4: INVENTARIO CRÍTICO */}
        <section className={`p-10 rounded-[3.5rem] border ${isDarkMode ? "bg-slate-900/50 border-white/10" : "bg-white border-slate-200 shadow-xl"}`}>
          <h2 className="text-2xl font-black mb-8 flex items-center gap-4">
            <AlertTriangle className="text-red-500" /> Inventario Crítico
          </h2>
          
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {data.inventario_critico.length === 0 ? (
              <div className="py-20 text-center opacity-20 font-black uppercase text-xs tracking-widest">Stock Saludable</div>
            ) : (
              data.inventario_critico.map(p => (
                <div key={p.id} className={`p-5 rounded-3xl border flex justify-between items-center animate-pulse ${isDarkMode ? "bg-red-500/5 border-red-500/10" : "bg-red-50 border-red-100"}`}>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white p-2 overflow-hidden flex items-center justify-center shrink-0">
                      <img src={p.imagen} className="w-full h-full object-contain" alt="" />
                    </div>
                    <div>
                      <p className={`font-black text-sm ${isDarkMode ? "text-white" : "text-slate-800"}`}>{p.nombre}</p>
                      <p className="text-[10px] font-bold text-red-500 uppercase tracking-tighter">Quedan solo {p.stock} unidades</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase">Mínimo: {p.stock_minimo}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default BiPage;