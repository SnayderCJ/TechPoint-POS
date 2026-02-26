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
      alert("⚠️ Error: No hay stock suficiente.");
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
        alert("❌ Error al procesar la venta.");
      }
    } catch (err) { alert("❌ Error de conexión."); }
  };

  const productosFiltrados = productos.filter(p => 
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.categoria.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full space-y-8 animate-in fade-in slide-in-from-top-4 duration-700">
      
      {/* ---- Header SaaS Profesional ---- */}
      <header className={`relative transition-all duration-500 border p-8 rounded-[2.5rem] shadow-xl overflow-hidden ${
        isDarkMode 
          ? "bg-slate-900/60 backdrop-blur-xl border-white/10 shadow-black/20" 
          : "bg-white border-slate-200 shadow-slate-200/50"
      }`}>
        {/* Sutil toque morado de fondo (solo en Dark) */}
        {isDarkMode && <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-violet-600/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>}
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h1 className={`text-4xl font-black tracking-tight flex items-center gap-3 ${isDarkMode ? "text-white" : "text-slate-900"}`}>
              <Zap className="text-violet-500" size={32} />
              TechPoint <span className="text-violet-600">POS</span>
            </h1>
            <p className="text-slate-500 font-semibold uppercase tracking-[0.2em] text-[10px] mt-2">
              Software de Gestión • Snayder Cedeño • Milagro, Ecuador
            </p>
          </div>
          
          <div className={`px-10 py-5 rounded-3xl border text-center min-w-[200px] transition-all ${
            isDarkMode ? "bg-slate-950 border-violet-500/30" : "bg-slate-50 border-slate-200"
          }`}>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1 block">Subtotal</span>
            <p className={`text-4xl font-black tracking-tighter ${isDarkMode ? "text-white" : "text-violet-600"}`}>
              ${total.toFixed(2)}
            </p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ---- Catálogo de Inventario ---- */}
        <div className="lg:col-span-2 space-y-6">
          <div className={`flex flex-col md:flex-row items-center justify-between gap-4 p-5 rounded-3xl border transition-all ${
            isDarkMode ? "bg-slate-900/40 border-white/5" : "bg-white border-slate-200 shadow-sm"
          }`}>
            <h2 className={`text-lg font-bold flex items-center gap-2 uppercase tracking-wide ${isDarkMode ? "text-slate-200" : "text-slate-700"}`}>
              <Package className="text-violet-500" size={20} /> Inventario
            </h2>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-4 top-3 text-slate-400" size={18} />
              <input 
                type="text" placeholder="Filtrar por nombre o categoría..." 
                className={`w-full pl-11 pr-5 py-2.5 rounded-xl border outline-none transition-all font-medium text-sm ${
                  isDarkMode 
                  ? "bg-slate-950 border-white/10 text-white focus:border-violet-500/50" 
                  : "bg-slate-50 border-slate-200 text-slate-900 focus:border-violet-400 focus:bg-white"
                }`}
                value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {productosFiltrados.map(prod => (
              <div key={prod.id} className={`group relative p-6 rounded-[2rem] border transition-all duration-300 ${
                isDarkMode 
                ? "bg-slate-900/60 border-white/5 hover:border-violet-500/40 shadow-xl shadow-black/20" 
                : "bg-white border-slate-200 hover:border-violet-300 shadow-sm hover:shadow-md"
              }`}>
                <div className={`h-44 rounded-2xl mb-5 flex items-center justify-center overflow-hidden border transition-all ${
                  isDarkMode ? "bg-slate-950/50 border-white/5" : "bg-slate-50 border-slate-100"
                }`}>
                  <img 
                    src={prod.imagen.startsWith('http') ? prod.imagen : `http://localhost:8000${prod.imagen}`} 
                    className="w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-500" 
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
                    prod.stock <= 3 ? "text-red-500" : "text-slate-500"
                  }`}>
                    Stock: {prod.stock}
                  </span>
                </div>

                <h3 className={`font-bold text-lg leading-tight mb-5 h-12 overflow-hidden transition-colors ${
                  isDarkMode ? "text-white group-hover:text-violet-400" : "text-slate-800 group-hover:text-violet-600"
                }`}>
                  {prod.nombre}
                </h3>

                <div className={`flex justify-between items-center pt-4 border-t ${isDarkMode ? "border-white/5" : "border-slate-100"}`}>
                  <span className={`text-2xl font-black ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                    ${parseFloat(prod.precio).toFixed(2)}
                  </span>
                  <button 
                    onClick={() => agregarAlCarrito(prod)} 
                    disabled={prod.stock <= 0} 
                    className="bg-violet-600 text-white p-3.5 rounded-xl hover:bg-violet-500 shadow-lg shadow-violet-600/20 active:scale-95 disabled:opacity-30 transition-all"
                  >
                    <ShoppingCart size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ---- Carrito Estilo Lateral Clean ---- */}
        <aside>
          <div className={`sticky top-8 p-8 rounded-[2.5rem] border transition-all h-fit min-h-[600px] flex flex-col ${
            isDarkMode 
            ? "bg-slate-900/80 backdrop-blur-xl border-white/10 shadow-2xl" 
            : "bg-white border-slate-200 shadow-xl shadow-slate-200/50"
          }`}>
            <h2 className={`text-xl font-bold mb-8 flex items-center gap-2 ${isDarkMode ? "text-white" : "text-slate-800"}`}>
              <Sparkles className="text-violet-500" size={20} /> Resumen de Orden
            </h2>
            
            <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
              {carrito.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center opacity-20 text-center py-20">
                  <ShoppingCart size={64} className="mb-4" />
                  <p className="font-bold uppercase tracking-widest text-xs">Sin Productos</p>
                </div>
              ) : (
                carrito.map((item, idx) => (
                  <div key={idx} className={`flex justify-between items-center p-4 rounded-2xl border transition-all ${
                    isDarkMode ? "bg-white/5 border-white/5" : "bg-slate-50 border-slate-100"
                  }`}>
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className={`w-10 h-10 rounded-lg p-1 shrink-0 ${isDarkMode ? "bg-slate-950" : "bg-white border"}`}>
                        <img src={item.imagen} className="w-full h-full object-contain" alt="" />
                      </div>
                      <div className="truncate">
                        <p className={`font-bold text-xs truncate ${isDarkMode ? "text-white" : "text-slate-900"}`}>{item.nombre}</p>
                        <p className="text-[10px] text-violet-500 font-bold uppercase">${parseFloat(item.precio).toFixed(2)}</p>
                      </div>
                    </div>
                    <button onClick={() => quitarDelCarrito(item.id)} className="text-slate-400 hover:text-red-500 transition-colors ml-2">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {carrito.length > 0 && (
              <div className={`mt-8 pt-8 border-t space-y-6 ${isDarkMode ? "border-white/10" : "border-slate-100"}`}>
                <div className="flex justify-between items-end">
                  <span className="text-slate-500 font-bold text-[10px] uppercase tracking-widest">Total Final (IVA Incl.)</span>
                  <p className={`text-4xl font-black tracking-tighter ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                    ${(total * 1.15).toFixed(2)}
                  </p>
                </div>
                <button 
                  onClick={procesarVentaFinal} 
                  className="w-full bg-violet-600 text-white py-5 rounded-2xl font-bold text-sm shadow-xl shadow-violet-600/30 hover:bg-violet-500 transition-all active:scale-95 uppercase tracking-widest"
                >
                  Finalizar Operación
                </button>
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* ---- Modal Success Clean ---- */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className={`rounded-[3rem] p-12 text-center max-w-sm w-full shadow-2xl border transition-all ${
            isDarkMode ? "bg-slate-900 border-white/10" : "bg-white border-slate-200"
          }`}>
            <div className="bg-violet-500/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 border border-violet-500/20">
              <CheckCircle className="text-violet-500" size={48} />
            </div>
            <h3 className={`text-2xl font-bold mb-2 ${isDarkMode ? "text-white" : "text-slate-900"}`}>¡Venta Registrada!</h3>
            <p className="text-slate-500 font-medium mb-10 text-xs uppercase tracking-widest">Base de Datos Actualizada</p>
            <button 
              onClick={() => setShowModal(false)} 
              className="w-full bg-violet-600 text-white py-4 rounded-2xl font-bold uppercase text-xs tracking-[0.2em] shadow-lg shadow-violet-600/20 hover:bg-violet-500 transition-all"
            >
              Continuar
            </button>
          </div>
        </div>
      )}

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

export default PosPage;