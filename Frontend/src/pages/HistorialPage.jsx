import { useState, useEffect } from 'react';
import { History, Search, Calendar, FileText, Filter, RefreshCcw, ArrowRight, User, Package, DollarSign, CreditCard, X, Printer, Mail, MapPin } from 'lucide-react';

function HistorialPage({ isDarkMode, config, showToast, authFetch }) {
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [ventaDetalle, setVentaDetalle] = useState(null);

  const ivaPorcentaje = parseFloat(config?.iva_porcentaje || 15);
  const nombreEmpresa = config?.nombre_negocio || "TechPoint POS";
  const direccionEmpresa = config?.direccion || "Milagro, Guayas, Ecuador";
  const emailEmpresa = config?.email_notificaciones || "admin@techpoint.com";

  const fetchVentas = async () => {
    try {
      const response = await authFetch('http://localhost:8000/api/ventas/');
      const data = await response.json();
      setVentas(Array.isArray(data) ? data : []);
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

  useEffect(() => { fetchVentas(); }, []);

  const imprimirFactura = () => {
    window.print();
  };

  const ventasFiltradas = ventas.filter(v => 
    v.id.toString().includes(busqueda) || 
    (v.cliente_nombre && v.cliente_nombre.toLowerCase().includes(busqueda.toLowerCase()))
  );

  return (
    <div className="flex flex-col space-y-6 md:space-y-10 animate-in fade-in duration-700 pb-20 px-2 md:px-0">
      
      {/* HEADER (Oculto en impresión) */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6 print:hidden">
        <div>
          <h1 className={`text-3xl md:text-4xl font-black tracking-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}>
            Registro de <span className="text-violet-600">Ventas</span>
          </h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[9px] md:text-[10px] mt-1 md:mt-2">
            Base de Datos PostgreSQL • TechPoint Milagro
          </p>
        </div>
        <button onClick={fetchVentas} className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-violet-600/10 text-violet-500 hover:bg-violet-600 hover:text-white transition-all">
          <RefreshCcw size={20} />
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-10">
        
        {/* LISTADO DE VENTAS (Oculto en impresión) */}
        <div className="lg:col-span-1 xl:col-span-2 space-y-4 md:space-y-6 print:hidden">
          <div className={`p-4 md:p-6 rounded-2xl md:rounded-3xl border flex items-center gap-4 transition-all ${isDarkMode ? "bg-slate-900/40 border-white/5" : "bg-white border-slate-200 shadow-sm"}`}>
            <Search className="text-slate-400" size={20} />
            <input 
              type="text" placeholder="Buscar venta o cliente..." 
              className={`w-full bg-transparent outline-none font-bold text-sm ${isDarkMode ? "text-white" : "text-slate-900"}`}
              value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          <div className="space-y-3">
            {loading ? (
              <div className="p-20 text-center animate-pulse font-black text-xs uppercase">Sincronizando...</div>
            ) : ventasFiltradas.map(venta => (
              <div 
                key={venta.id} 
                onClick={() => setVentaDetalle(venta)}
                className={`group p-5 md:p-6 rounded-[1.8rem] md:rounded-[2.5rem] border cursor-pointer transition-all duration-300 flex justify-between items-center ${
                  ventaDetalle?.id === venta.id 
                  ? "bg-violet-600 border-violet-500 text-white shadow-xl"
                  : (isDarkMode ? "bg-slate-900/60 border-white/5 hover:border-violet-500/40" : "bg-white border-slate-100 hover:border-violet-400 shadow-sm")
                }`}
              >
                <div className="flex items-center gap-4 md:gap-6 overflow-hidden">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${ventaDetalle?.id === venta.id ? "bg-white/20" : "bg-slate-500/10 text-slate-400"}`}>
                    <FileText size={22} />
                  </div>
                  <div className="overflow-hidden">
                    <p className={`text-[10px] font-black uppercase tracking-tighter ${ventaDetalle?.id === venta.id ? "text-white/60" : "text-slate-500"}`}>
                      {new Date(venta.fecha).toLocaleDateString()} • #{venta.id}
                    </p>
                    <h3 className="font-black text-md md:text-lg truncate">{venta.cliente_nombre || "Consumidor Final"}</h3>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xl md:text-2xl font-black tracking-tighter">${parseFloat(venta.total).toFixed(2)}</p>
                  <span className={`text-[8px] font-black uppercase tracking-widest ${ventaDetalle?.id === venta.id ? "text-white/60" : "text-violet-500"}`}>{venta.metodo_pago}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* DETALLE LATERAL / FACTURA PRINT VIEW */}
        <aside className={`relative ${ventaDetalle ? "block" : "hidden lg:block"}`}>
          <div className={`sticky top-8 p-6 md:p-10 rounded-[2.5rem] md:rounded-[3.5rem] border min-h-[600px] transition-all flex flex-col ${
            isDarkMode 
            ? "bg-slate-900 border-white/10 shadow-2xl" 
            : "bg-white border-slate-200 shadow-xl shadow-slate-200/50"
          } print:border-0 print:shadow-none print:bg-white print:p-0 print:text-black`}>
            
            {!ventaDetalle ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center opacity-20 print:hidden">
                <Filter size={80} className="mb-6" />
                <p className="font-black uppercase tracking-[0.2em] text-xs">Selecciona una venta<br/>para generar el recibo</p>
              </div>
            ) : (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500 flex flex-col h-full">
                
                {/* CABECERA FACTURA PROFESIONAL */}
                <div className="flex justify-between items-start mb-8 print:mb-10">
                  <div className="space-y-1">
                    <h2 className={`text-2xl md:text-3xl font-black tracking-tighter ${isDarkMode ? "text-white" : "text-slate-900"} print:text-black`}>
                      {nombreEmpresa}
                    </h2>
                    <div className="flex items-center gap-2 text-slate-500 print:text-slate-700 text-[10px] font-bold uppercase tracking-widest">
                      <MapPin size={12}/> {direccionEmpresa}
                    </div>
                    <div className="flex items-center gap-2 text-slate-500 print:text-slate-700 text-[10px] font-bold uppercase tracking-widest">
                      <Mail size={12}/> {emailEmpresa}
                    </div>
                  </div>
                  <button onClick={() => setVentaDetalle(null)} className="p-2 hover:bg-slate-500/10 rounded-xl transition-colors print:hidden"><X size={24}/></button>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8 border-y border-slate-100 dark:border-white/5 py-6 print:border-slate-200">
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Cliente</p>
                    <p className={`font-black text-sm ${isDarkMode ? "text-white" : "text-slate-900"} print:text-black`}>{ventaDetalle.cliente_nombre || "Consumidor Final"}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Fecha Emisión</p>
                    <p className={`font-black text-sm ${isDarkMode ? "text-white" : "text-slate-900"} print:text-black`}>{new Date(ventaDetalle.fecha).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Venta ID</p>
                    <p className={`font-black text-sm ${isDarkMode ? "text-white" : "text-slate-900"} print:text-black`}>#{ventaDetalle.id.toString().padStart(6, '0')}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Forma de Pago</p>
                    <p className={`font-black text-sm ${isDarkMode ? "text-white" : "text-slate-900"} print:text-black`}>{ventaDetalle.metodo_pago}</p>
                  </div>
                </div>

                {/* TABLA DE ITEMS */}
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-4 text-[9px] font-black uppercase text-slate-400 pb-2 px-2 border-b border-slate-50 dark:border-white/5 print:border-slate-200">
                    <span className="col-span-2">Producto</span>
                    <span className="text-center">Cant.</span>
                    <span className="text-right">Total</span>
                  </div>
                  <div className="space-y-2 overflow-y-auto pr-2 custom-scrollbar print:overflow-visible">
                    {ventaDetalle.items?.map((item, idx) => (
                      <div key={idx} className={`grid grid-cols-4 items-center p-3 rounded-xl border transition-all ${isDarkMode ? "bg-white/5 border-white/5" : "bg-slate-50 border-slate-100"} print:border-0 print:bg-transparent print:px-2`}>
                        <span className={`col-span-2 text-xs font-bold truncate ${isDarkMode ? "text-slate-200" : "text-slate-800"} print:text-black`}>{item.nombre}</span>
                        <span className="text-center text-xs font-black text-slate-500 print:text-black">x{item.cantidad}</span>
                        <span className="text-right text-xs font-black text-violet-500 print:text-black">${(parseFloat(item.precio) * item.cantidad).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* TOTALES */}
                <div className={`mt-8 pt-8 border-t space-y-3 ${isDarkMode ? "border-white/10" : "border-slate-200"} print:border-slate-300`}>
                  <div className="flex justify-between text-slate-500 print:text-slate-700 font-bold uppercase text-[10px] tracking-widest px-2">
                    <span>Subtotal (Neto)</span>
                    <span>${(parseFloat(ventaDetalle.total) / (1 + (ivaPorcentaje / 100))).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-500 print:text-slate-700 font-bold uppercase text-[10px] tracking-widest px-2 pb-4 border-b border-slate-50 dark:border-white/5 print:border-slate-200">
                    <span>IVA Aplicado ({ivaPorcentaje}%)</span>
                    <span>${(parseFloat(ventaDetalle.total) - (parseFloat(ventaDetalle.total) / (1 + (ivaPorcentaje / 100)))).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-end p-2">
                    <div className="flex-1">
                      <p className={`text-5xl font-black tracking-tighter ${isDarkMode ? "text-white" : "text-slate-950"} print:text-black`}>
                        ${parseFloat(ventaDetalle.total).toFixed(2)}
                      </p>
                      <p className="text-[9px] font-black text-violet-500 uppercase tracking-[0.2em] mt-1 print:text-black">Transacción Exitosa</p>
                    </div>
                    <button onClick={imprimirFactura} className="bg-slate-900 text-white p-4 rounded-2xl hover:bg-slate-800 transition-all shadow-lg active:scale-95 print:hidden">
                      <Printer size={20} />
                    </button>
                  </div>
                </div>

                <div className="mt-10 pt-10 text-center border-t border-dashed border-slate-200 print:block hidden">
                  <p className="text-[10px] font-black uppercase text-slate-400">Gracias por su compra</p>
                  <p className="text-[8px] font-bold text-slate-400 mt-1">TechPoint POS • Milagro, Ecuador</p>
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
        @media print {
          body * { visibility: hidden; }
          .print-area, .print-area * { visibility: visible; }
          aside, aside * { visibility: visible; }
          aside { position: absolute; left: 0; top: 0; width: 100%; height: auto; }
          header, nav, .print\:hidden { display: none !important; }
        }
      `}</style>
    </div>
  );
}

export default HistorialPage;