import { useState, useEffect } from 'react';
import { ShoppingCart, Search, Package, CheckCircle, Zap, Trash2, Sparkles, Cpu } from 'lucide-react';

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
    <div className="flex flex-col h-full space-y-8 animate-in fade-in duration-700">
      
      {/* ---- NUEVO HEADER VIOLETA (Sin rastro de verde) ---- */}
      <header className="relative bg-slate-900/60 backdrop-blur-2xl border border-white/10 p-10 rounded-[3.5rem] shadow-2xl overflow-hidden">
        {/* Glow violeta de fondo */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h1 className="text-5xl font-black tracking-tighter text-white flex items-center gap-4">
              <Zap className="text-violet-400 fill-violet-400/20" size={42} />
              TechPoint <span className="text-violet-500">POS</span>
            </h1>
            <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px] mt-3">
              Sistema Profesional • Snayder Cedeño • Milagro
            </p>
          </div>
          
          <div className="bg-slate-950 px-12 py-7 rounded-[2.5rem] border border-violet-500/30 text-center min-w-[240px] shadow-[0_0_30px_rgba(139,92,246,0.15)]">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-violet-400 mb-2 block">Total Venta</span>
            <p className="text-5xl font-black text-white tracking-tighter">${total.toFixed(2)}</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-slate-900/40 backdrop-blur-md p-6 rounded-[2.5rem] border border-white/5">
            <h2 className="text-xl font-black flex items-center gap-3 text-white uppercase tracking-wider">
              <Cpu className="text-violet-500" /> Catálogo de Hardware
            </h2>
            <div className="relative w-full md:w-96">
              <Search className="absolute left-5 top-4 text-slate-500" size={20} />
              <input 
                type="text" placeholder="Buscar componente..." 
                className="w-full pl-14 pr-6 py-4 rounded-2xl bg-slate-950/80 border border-white/5 text-white placeholder:text-slate-700 focus:ring-2 focus:ring-violet-500/50 transition-all outline-none font-bold text-sm"
                value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {productosFiltrados.map(prod => (
              <div key={prod.id} className="group relative bg-slate-900/60 backdrop-blur-lg p-7 rounded-[3.5rem] border border-white/5 hover:border-violet-500/40 transition-all duration-500 hover:shadow-[0_0_50px_rgba(139,92,246,0.15)] overflow-hidden">
                <div className="h-48 bg-slate-950/80 rounded-[2.5rem] mb-6 flex items-center justify-center overflow-hidden border border-white/5">
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
                  <span className={`text-[10px] font-black tracking-widest uppercase ${prod.stock <= 3 ? 'text-red-400 animate-pulse' : 'text-slate-500'}`}>
                    Stock: {prod.stock}
                  </span>
                </div>
                <h3 className="font-black text-white text-xl leading-tight mb-6 h-14 overflow-hidden">{prod.nombre}</h3>
                <div className="flex justify-between items-center pt-5 border-t border-white/5">
                  <span className="text-3xl font-black text-white tracking-tighter">${parseFloat(prod.precio).toFixed(2)}</span>
                  <button 
                    onClick={() => agregarAlCarrito(prod)} 
                    disabled={prod.stock <= 0} 
                    className="bg-violet-600 text-white p-5 rounded-2xl hover:bg-violet-500 shadow-xl active:scale-90 disabled:opacity-20 transition-all"
                  >
                    <ShoppingCart size={24} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Resumen */}
        <aside className="relative">
          <div className="sticky top-8 bg-slate-900/80 backdrop-blur-3xl p-8 rounded-[4rem] border border-white/10 shadow-2xl min-h-[600px] flex flex-col overflow-hidden">
            <h2 className="text-2xl font-black text-white mb-10 flex items-center gap-3">
              <Sparkles className="text-violet-400" size={26} /> Carrito
            </h2>
            <div className="flex-1 space-y-5 overflow-y-auto pr-2 custom-scrollbar">
              {carrito.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center opacity-10 text-center grayscale">
                  <ShoppingCart size={80} className="mb-6" />
                  <p className="font-black uppercase tracking-[0.3em] text-sm">Carrito Vacío</p>
                </div>
              ) : (
                carrito.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-white/5 p-5 rounded-[2rem] border border-white/5">
                    <p className="font-bold text-white text-xs truncate w-32">{item.nombre}</p>
                    <span className="text-violet-400 font-black text-[11px]">${parseFloat(item.precio).toFixed(2)}</span>
                    <button onClick={() => quitarDelCarrito(item.id)} className="text-slate-600 hover:text-red-400"><Trash2 size={16} /></button>
                  </div>
                ))
              )}
            </div>
            {carrito.length > 0 && (
              <div className="mt-10 pt-10 border-t border-white/10 space-y-8">
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2">Total Operación</p>
                  <p className="text-5xl font-black text-white tracking-tighter">${(total * 1.15).toFixed(2)}</p>
                </div>
                <button 
                  onClick={procesarVentaFinal} 
                  className="w-full bg-gradient-to-br from-violet-600 to-indigo-700 text-white py-6 rounded-[2.5rem] font-black text-xl shadow-2xl hover:-translate-y-1 transition-all"
                >
                  EJECUTAR VENTA
                </button>
              </div>
            )}
          </div>
        </aside>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #1e1b4b; border-radius: 20px; }
      `}</style>
    </div>
  );
}

export default PosPage;