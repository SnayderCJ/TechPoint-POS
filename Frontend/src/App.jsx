import { useState, useEffect } from 'react';
import { ShoppingCart, Search, Package, CheckCircle, Sparkles, Zap, Trash2, Cpu } from 'lucide-react';

function PosPage() {
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
      alert("⚠️ Error de Protocolo: Stock insuficiente en Milagro.");
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
        alert("❌ Error Crítico: Fallo en la persistencia de datos.");
      }
    } catch (err) { alert("❌ Error de Enlace: Servidor no responde."); }
  };

  const productosFiltrados = productos.filter(p => 
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.categoria.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full space-y-8 animate-in fade-in slide-in-from-top-4 duration-700">
      
      {/* ---- Header de Comando Futurista - DEFINITIVAMENTE VIOLETA ---- */}
      <header className="relative bg-slate-900/60 backdrop-blur-2xl border border-white/10 p-10 rounded-[3.5rem] shadow-2xl overflow-hidden">
        {/* Glow animado de fondo que sustituye al verde */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/4"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h1 className="text-5xl font-black tracking-tighter text-white flex items-center gap-4">
              <Zap className="text-violet-400 fill-violet-400/20" size={42} />
              TechPoint <span className="text-violet-500">POS</span>
            </h1>
            <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px] mt-3 ml-1">
              Terminal Operativa • Snayder Cedeño • Milagro, Ecuador
            </p>
          </div>
          
          <div className="relative group">
            {/* Brillo exterior para el total de venta */}
            <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-slate-950 px-12 py-7 rounded-[2.5rem] border border-white/10 text-center min-w-[240px] shadow-2xl">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-violet-400 mb-2 block">Monto en Curso</span>
              <p className="text-5xl font-black text-white tracking-tighter">${total.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* ---- Catálogo de Componentes ---- */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-slate-900/40 backdrop-blur-md p-6 rounded-[2.5rem] border border-white/5">
            <h2 className="text-xl font-black flex items-center gap-3 text-white uppercase tracking-wider">
              <Cpu className="text-violet-500" /> Matriz de Hardware
            </h2>
            <div className="relative w-full md:w-96">
              <Search className="absolute left-5 top-4 text-slate-500" size={20} />
              <input 
                type="text" placeholder="Escanear base de datos..." 
                className="w-full pl-14 pr-6 py-4 rounded-2xl bg-slate-950/80 border border-white/5 text-white placeholder:text-slate-700 focus:ring-2 focus:ring-violet-500/50 transition-all outline-none font-bold text-sm"
                value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {productosFiltrados.map(prod => (
              <div key={prod.id} className="group relative bg-slate-900/60 backdrop-blur-lg p-7 rounded-[3.5rem] border border-white/5 hover:border-violet-500/40 transition-all duration-500 hover:shadow-[0_0_50px_rgba(139,92,246,0.15)] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-[3.5rem]"></div>
                
                <div className="relative z-10">
                  <div className="h-48 bg-slate-950/80 rounded-[2.5rem] mb-6 flex items-center justify-center overflow-hidden border border-white/5 group-hover:border-violet-500/30 transition-all">
                    <img 
                      src={prod.imagen.startsWith('http') ? prod.imagen : `http://localhost:8000${prod.imagen}`} 
                      className="w-full h-full object-contain p-6 group-hover:scale-110 transition-transform duration-700" 
                      alt="" 
                    />
                  </div>
                  
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-black bg-violet-500/10 text-violet-400 border border-violet-500/20 px-4 py-1.5 rounded-full uppercase tracking-widest">
                      {prod.categoria}
                    </span>
                    <div className={`px-3 py-1 rounded-lg border flex items-center gap-1.5 ${prod.stock <= 3 ? 'bg-red-500/10 border-red-500/20 text-red-400 animate-pulse' : 'bg-white/5 border-white/5 text-slate-500'}`}>
                      <span className="text-[10px] font-black uppercase tracking-tighter">Stock: {prod.stock}</span>
                    </div>
                  </div>

                  <h3 className="font-black text-white text-xl leading-tight mb-6 h-14 overflow-hidden group-hover:text-violet-400 transition-colors">
                    {prod.nombre}
                  </h3>

                  <div className="flex justify-between items-center pt-5 border-t border-white/5">
                    <div>
                      <p className="text-[9px] font-bold text-slate-600 uppercase mb-1 tracking-widest">Valor Unitario</p>
                      <span className="text-3xl font-black text-white tracking-tighter">${parseFloat(prod.precio).toFixed(2)}</span>
                    </div>
                    <button 
                      onClick={() => agregarAlCarrito(prod)} 
                      disabled={prod.stock <= 0} 
                      className="bg-violet-600 text-white p-5 rounded-2xl hover:bg-violet-500 shadow-[0_15px_30px_rgba(124,58,237,0.3)] active:scale-90 disabled:opacity-20 disabled:grayscale transition-all group-hover:shadow-[0_0_20px_rgba(139,92,246,0.5)]"
                    >
                      <ShoppingCart size={24} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ---- Panel de Liquidación (Sidebar) ---- */}
        <aside className="relative">
          <div className="sticky top-8 bg-slate-900/80 backdrop-blur-3xl p-8 rounded-[4rem] border border-white/10 shadow-2xl min-h-[700px] flex flex-col overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-violet-500 to-transparent"></div>
            
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-2xl font-black text-white tracking-tighter flex items-center gap-3">
                <Sparkles className="text-violet-400" size={26} /> Carrito
              </h2>
              <div className="bg-violet-500/20 text-violet-400 px-5 py-1.5 rounded-full text-xs font-black border border-violet-500/30 shadow-[0_0_15px_rgba(139,92,246,0.2)]">
                {carrito.length} ITEMS
              </div>
            </div>

            <div className="flex-1 space-y-5 overflow-y-auto pr-2 custom-scrollbar">
              {carrito.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center opacity-10 text-center grayscale">
                  <ShoppingCart size={80} className="mb-6" />
                  <p className="font-black uppercase tracking-[0.3em] text-sm">Sin Datos de Venta</p>
                </div>
              ) : (
                carrito.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-white/5 p-5 rounded-[2rem] border border-white/5 hover:border-violet-500/30 transition-all group animate-in slide-in-from-right-4 duration-300">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-slate-950 p-2 border border-white/5 shadow-inner">
                        <img src={item.imagen} className="w-full h-full object-contain" alt="" />
                      </div>
                      <div className="max-w-[130px]">
                        <p className="font-bold text-white text-xs truncate mb-1">{item.nombre}</p>
                        <p className="text-[11px] text-violet-400 font-black uppercase tracking-widest">${parseFloat(item.precio).toFixed(2)}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => quitarDelCarrito(item.id)} 
                      className="text-slate-700 hover:text-red-500 p-2.5 hover:bg-red-500/10 rounded-xl transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {carrito.length > 0 && (
              <div className="mt-10 pt-10 border-t border-white/10 space-y-8">
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Impuestos Aplicados</p>
                    <p className="text-xs font-bold text-violet-400 uppercase tracking-widest">IVA 15%</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2">Total de Operación</p>
                    <p className="text-5xl font-black text-white tracking-tighter leading-none">${(total * 1.15).toFixed(2)}</p>
                  </div>
                </div>
                <button 
                  onClick={procesarVentaFinal} 
                  className="w-full bg-gradient-to-br from-violet-600 to-indigo-700 text-white py-6 rounded-[2.5rem] font-black text-xl shadow-[0_20px_40px_rgba(124,58,237,0.4)] hover:shadow-[0_25px_50px_rgba(124,58,237,0.6)] hover:-translate-y-1.5 transition-all active:scale-95 uppercase tracking-widest"
                >
                  Confirmar Venta
                </button>
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* ---- Modal de Validación de Sistema ---- */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4">
          <div className="bg-slate-900 rounded-[4rem] p-16 text-center max-w-md w-full shadow-[0_0_100px_rgba(139,92,246,0.4)] border border-white/10 relative overflow-hidden animate-in zoom-in-95 duration-500">
            <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-violet-500 via-indigo-500 to-violet-500"></div>
            <div className="bg-violet-500/10 w-28 h-28 rounded-full flex items-center justify-center mx-auto mb-10 border border-violet-500/30 shadow-[0_0_50px_rgba(139,92,246,0.3)]">
              <CheckCircle className="text-violet-400" size={56} />
            </div>
            <h3 className="text-4xl font-black text-white mb-4 tracking-tighter uppercase">Protocolo Exitoso</h3>
            <p className="text-slate-500 font-bold mb-12 text-sm uppercase tracking-[0.2em] leading-relaxed">Sincronización completa con PostgreSQL. Inventario actualizado.</p>
            <button 
              onClick={() => setShowModal(false)} 
              className="w-full bg-white text-slate-950 py-5 rounded-[2rem] font-black uppercase tracking-[0.3em] text-xs hover:bg-violet-500 hover:text-white transition-all shadow-2xl"
            >
              Cerrar Terminal
            </button>
          </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #1e1b4b; border-radius: 20px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #8b5cf6; }
      `}</style>
    </div>
  );
}

export default PosPage;