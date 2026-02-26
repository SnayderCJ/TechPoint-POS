import { useState, useEffect } from 'react';
import { ShoppingCart, Search, Package, CheckCircle, Zap, Trash2, Sparkles, Cpu } from 'lucide-react';

function PosPage({ isDarkMode }) {
  const [busqueda, setBusqueda] = useState(""); 
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [carrito, setCarrito] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const fetchProductos = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/productos/');
      const data = await response.json();
      setProductos(data);
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProductos(); }, []);

  const agregarAlCarrito = (producto) => {
    const enCarrito = carrito.filter(p => p.id === producto.id).length;
    if (enCarrito >= producto.stock) {
      alert("⚠️ Stock insuficiente en inventario.");
      return;
    }
    setCarrito([...carrito, producto]);
  };

  const quitarDelCarrito = (id) => {
    const index = carrito.findIndex(p => p.id === id);
    if (index > -1) {
      const nuevoCarrito = [...carrito];
      nuevoCarrito.splice(index, 1);
      setCarrito(nuevoCarrito);
    }
  };

  const total = carrito.reduce((acc, p) => acc + parseFloat(p.precio), 0);

  const procesarVentaFinal = async () => {
    const idsUnicos = [...new Set(carrito.map(p => p.id))];
    const items = idsUnicos.map(id => ({
      id: id,
      cantidad: carrito.filter(p => p.id === id).length
    }));

    try {
      const response = await fetch('http://localhost:8000/api/ventas/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ total: (total * 1.15).toFixed(2), items })
      });

      if (response.ok) {
        await fetchProductos();
        setCarrito([]);
        setShowModal(true);
      } else {
        alert("❌ Error en la transacción.");
      }
    } catch (err) { alert("❌ Error de enlace."); }
  };

  const productosFiltrados = productos.filter(p => 
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.categoria.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="flex flex-col space-y-8 animate-in fade-in slide-in-from-top-4 duration-700 pb-20">
      
      {/* ---- Header SaaS Profesional (Ajustado para no cortarse) ---- */}
      <header className={`relative transition-all duration-500 border p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl overflow-hidden shrink-0 ${
        isDarkMode 
          ? "bg-slate-900/80 backdrop-blur-xl border-white/10 shadow-black/40" 
          : "bg-white border-slate-200 shadow-slate-300/50"
      }`}>
        {/* Glow de fondo */}
        {isDarkMode && <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-violet-600/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>}
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <h1 className={`text-4xl md:text-5xl font-black tracking-tight flex items-center justify-center md:justify-start gap-4 ${
              isDarkMode ? "text-white" : "text-slate-900"
            }`}>
              <Zap className="text-violet-500" size={40} />
              TechPoint <span className="text-violet-600">POS</span>
            </h1>
            <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px] mt-3">
              Sistema Profesional • Snayder Cedeño • Milagro
            </p>
          </div>
          
          {/* Cuadro de Subtotal - Reforzado para visibilidad */}
          <div className={`px-12 py-6 rounded-[2rem] border text-center min-w-[260px] shrink-0 transition-all shadow-inner ${
            isDarkMode ? "bg-slate-950/80 border-violet-500/30" : "bg-slate-50 border-slate-200"
          }`}>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2 block">Total Operación</span>
            <p className={`text-5xl font-black tracking-tighter ${
              isDarkMode ? "text-white" : "text-violet-700"
            }`}>
              ${total.toFixed(2)}
            </p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ---- Matriz de Productos ---- */}
        <div className="lg:col-span-2 space-y-6">
          <div className={`flex flex-col md:flex-row items-center justify-between gap-6 p-6 rounded-3xl border transition-all ${
            isDarkMode ? "bg-slate-900/40 border-white/5" : "bg-white border-slate-200 shadow-sm"
          }`}>
            <h2 className={`text-lg font-bold flex items-center gap-3 uppercase tracking-widest ${isDarkMode ? "text-slate-200" : "text-slate-700"}`}>
              <Package className="text-violet-500" size={20} /> Inventario
            </h2>
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-3 text-slate-400" size={18} />
              <input 
                type="text" placeholder="Filtrar componentes..." 
                className={`w-full pl-12 pr-5 py-3 rounded-2xl border outline-none transition-all font-bold text-sm ${
                  isDarkMode 
                  ? "bg-slate-950 border-white/10 text-white focus:border-violet-500" 
                  : "bg-slate-50 border-slate-200 text-slate-900 focus:border-violet-500 focus:bg-white"
                }`}
                value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {productosFiltrados.map(prod => (
              <div key={prod.id} className={`group relative p-6 rounded-[2.5rem] border transition-all duration-300 ${
                isDarkMode 
                ? "bg-slate-900/60 border-white/5 hover:border-violet-500/40 shadow-xl shadow-black/20" 
                : "bg-white border-slate-200 hover:border-violet-400 shadow-md"
              }`}>
                <div className={`h-44 rounded-3xl mb-5 flex items-center justify-center overflow-hidden border transition-all ${
                  isDarkMode ? "bg-slate-950/50 border-white/5" : "bg-slate-50 border-slate-100"
                }`}>
                  <img 
                    src={prod.imagen?.startsWith('http') ? prod.imagen : `http://localhost:8000${prod.imagen}`} 
                    className="w-full h-full object-contain p-6 group-hover:scale-110 transition-transform duration-700" 
                    alt="" 
                  />
                </div>
                
                <div className="flex justify-between items-center mb-3">
                  <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                    isDarkMode ? "bg-violet-500/10 text-violet-400" : "bg-violet-50 text-violet-600"
                  }`}>
                    {prod.categoria}
                  </span>
                  <span className={`text-[10px] font-bold uppercase ${
                    prod.stock <= 3 ? "text-red-500 animate-pulse" : "text-slate-500"
                  }`}>
                    Stock: {prod.stock}
                  </span>
                </div>

                <h3 className={`font-black text-lg leading-tight mb-6 h-12 overflow-hidden transition-colors ${
                  isDarkMode ? "text-white group-hover:text-violet-400" : "text-slate-800 group-hover:text-violet-600"
                }`}>
                  {prod.nombre}
                </h3>

                <div className={`flex justify-between items-center pt-5 border-t ${isDarkMode ? "border-white/5" : "border-slate-100"}`}>
                  <span className={`text-3xl font-black tracking-tighter ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                    ${parseFloat(prod.precio).toFixed(2)}
                  </span>
                  <button 
                    onClick={() => agregarAlCarrito(prod)} 
                    disabled={prod.stock <= 0} 
                    className="bg-violet-600 text-white p-4 rounded-2xl hover:bg-violet-500 shadow-lg shadow-violet-600/30 active:scale-90 disabled:opacity-20 transition-all"
                  >
                    <ShoppingCart size={22} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ---- Sidebar de Liquidación ---- */}
        <aside className="relative">
          <div className={`sticky top-8 p-8 rounded-[3rem] border transition-all min-h-[600px] flex flex-col ${
            isDarkMode 
            ? "bg-slate-900/80 backdrop-blur-xl border-white/10 shadow-2xl" 
            : "bg-white border-slate-200 shadow-xl shadow-slate-300/50"
          }`}>
            <h2 className={`text-2xl font-black mb-10 flex items-center gap-3 ${isDarkMode ? "text-white" : "text-slate-800"}`}>
              <Sparkles className="text-violet-500" size={24} /> Carrito
            </h2>
            
            <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
              {carrito.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center opacity-10 text-center py-20 grayscale">
                  <ShoppingCart size={80} className="mb-6" />
                  <p className="font-black uppercase tracking-[0.2em] text-xs">Esperando Orden</p>
                </div>
              ) : (
                carrito.map((item, idx) => (
                  <div key={idx} className={`flex justify-between items-center p-4 rounded-[1.8rem] border transition-all animate-in slide-in-from-right-4 ${
                    isDarkMode ? "bg-white/5 border-white/5" : "bg-slate-50 border-slate-100"
                  }`}>
                    <div className="flex items-center gap-4 overflow-hidden">
                      <div className={`w-12 h-12 rounded-2xl p-2 shrink-0 ${isDarkMode ? "bg-slate-950" : "bg-white border"}`}>
                        <img src={item.imagen} className="w-full h-full object-contain" alt="" />
                      </div>
                      <div className="truncate">
                        <p className={`font-bold text-xs truncate ${isDarkMode ? "text-white" : "text-slate-900"}`}>{item.nombre}</p>
                        <p className="text-[11px] text-violet-500 font-black uppercase tracking-widest">${parseFloat(item.precio).toFixed(2)}</p>
                      </div>
                    </div>
                    <button onClick={() => quitarDelCarrito(item.id)} className="text-slate-400 hover:text-red-500 transition-colors ml-3 shrink-0">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {carrito.length > 0 && (
              <div className={`mt-10 pt-8 border-t space-y-8 ${isDarkMode ? "border-white/10" : "border-slate-200"}`}>
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Final (IVA 15%)</p>
                  <p className={`text-5xl font-black tracking-tighter ${isDarkMode ? "text-white" : "text-slate-950"}`}>
                    ${(total * 1.15).toFixed(2)}
                  </p>
                </div>
                <button 
                  onClick={procesarVentaFinal} 
                  className="w-full bg-gradient-to-br from-violet-600 to-indigo-700 text-white py-6 rounded-[2.2rem] font-black text-lg shadow-2xl shadow-violet-600/40 hover:bg-violet-500 transition-all active:scale-95 uppercase tracking-widest"
                >
                  Confirmar Venta
                </button>
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* Estilos locales para corregir scroll y colisión visual */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { 
          background-color: ${isDarkMode ? "#1e1b4b" : "#cbd5e1"}; 
          border-radius: 10px; 
        }
      `}</style>
    </div>
  );
}

export default PosPage;