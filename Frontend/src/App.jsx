import { useState, useEffect } from 'react' 

function App() {
  const [busqueda, setBusqueda] = useState(""); 
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);
  const [carrito, setCarrito] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // --- Lógica de Conexión con el Backend ---
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        setLoading(true);
        // Petición a tu API de Django en el contenedor de Docker
        const response = await fetch('http://localhost:8000/api/productos/');
        if (!response.ok) throw new Error('Error al conectar con el servidor');
        
        const data = await response.json();
        setProductos(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProductos();
  }, []);

  // --- Lógica de Filtrado en Tiempo Real ---
  const productosFiltrados = productos.filter(prod => 
    prod.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    prod.categoria.toLowerCase().includes(busqueda.toLowerCase())
  );

  const agregarAlCarrito = (producto) => {
    setCarrito([...carrito, producto]);
  };

  const quitarDelCarrito = (indexAEliminar) => {
    setCarrito(carrito.filter((_, index) => index !== indexAEliminar));
  };

  const total = carrito.reduce((acc, p) => acc + parseFloat(p.precio), 0);

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800 relative">
      
      {/* ---- Header ---- */}
      <header className="bg-gradient-to-r from-teal-700 to-emerald-500 text-white p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-20 blur-3xl pointer-events-none"></div>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center relative z-10">
          <div className="mb-4 md:mb-0 text-center md:text-left">
            <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
              <span className="bg-white/20 p-2 rounded-xl">💻</span>
              TechPoint POS
            </h1>
            <p className="text-emerald-100 font-medium mt-1">Sistema de Ventas Profesional - Snayder Cedeño</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 shadow-sm text-center min-w-[150px]">
            <span className="text-xs uppercase font-bold text-emerald-200 tracking-wider">Total</span>
            <p className="text-3xl font-black leading-tight">${total.toFixed(2)}</p>
          </div>
        </div>
      </header>

      {/* ---- Contenido Principal ---- */}
      <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8 my-8">
        
        <div className="lg:col-span-2 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-2xl font-bold flex items-center gap-3 text-slate-700">
              <span className="flex items-center justify-center w-10 h-10 bg-teal-100 text-teal-700 rounded-xl shadow-sm">📦</span>
              Catálogo de Hardware
            </h2>

            <div className="relative w-full md:w-72">
              <input 
                type="text"
                placeholder="Buscar componente..."
                className="w-full bg-white pl-10 pr-4 py-3 rounded-2xl border border-slate-200 shadow-sm focus:ring-2 focus:ring-teal-500 outline-none transition-all text-sm"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
              <span className="absolute left-4 top-3.5 opacity-30">🔍</span>
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl">⚠️ Error: {error}</div>
          ) : productosFiltrados.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
              <p className="text-slate-400 font-medium">No se encontraron productos para "{busqueda}"</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {productosFiltrados.map((prod) => (
                <div key={prod.id} className="group bg-white p-5 rounded-[2rem] shadow-sm border border-slate-200/60 hover:border-teal-500/30 transition-all duration-300 relative overflow-hidden flex flex-col">
                  
                  {/* ---- CONTENEDOR DE IMAGEN ---- */}
                  <div className="h-48 bg-slate-50 rounded-2xl mb-4 overflow-hidden flex items-center justify-center border border-slate-100 group-hover:bg-white transition-colors">
                    {prod.imagen ? (
                      <img 
                        // Verificamos si la URL es absoluta o relativa para que Docker la resuelva bien
                        src={prod.imagen.startsWith('http') ? prod.imagen : `http://localhost:8000${prod.imagen}`}
                        alt={prod.nombre}
                        className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <span className="text-5xl grayscale opacity-20">🖼️</span>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-extrabold text-teal-600 bg-teal-100 px-3 py-1 rounded-full uppercase tracking-wider">{prod.categoria}</span>
                      <p className="text-xs font-semibold text-slate-400">Stock: {prod.stock}</p>
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 leading-tight group-hover:text-teal-700 transition-colors mb-6">{prod.nombre}</h3>
                  </div>

                  <div className="flex justify-between items-end mt-auto">
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Precio</p>
                      <span className="text-3xl font-black text-slate-800">${parseFloat(prod.precio).toFixed(2)}</span>
                    </div>
                    <button 
                      onClick={() => agregarAlCarrito(prod)}
                      className="bg-slate-800 text-white p-4 rounded-2xl font-bold hover:bg-teal-600 hover:shadow-lg hover:shadow-teal-200 active:scale-95 transition-all"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ---- Sidebar Carrito ---- */}
        <aside className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-slate-200/80 h-fit sticky top-8">
          <h2 className="text-xl font-bold mb-6 pb-4 border-b border-slate-100 flex items-center justify-between text-slate-700">
            <span className="flex items-center gap-3">🛒 Resumen</span>
            <span className="text-sm bg-slate-100 text-slate-500 px-3 py-1 rounded-full font-bold">{carrito.length}</span>
          </h2>

          {carrito.length === 0 ? (
            <div className="text-center py-10 opacity-30">
              <p className="text-sm font-bold">CARRITO VACÍO</p>
            </div>
          ) : (
            <>
              <ul className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {carrito.map((item, index) => (
                  <li key={index} className="flex justify-between items-center bg-slate-50 p-3 rounded-2xl border border-slate-100 group">
                    <div className="flex items-center gap-3">
                      {/* Miniatura en el carrito */}
                      <div className="w-10 h-10 bg-white rounded-lg border flex-shrink-0 overflow-hidden">
                        <img 
                          src={item.imagen?.startsWith('http') ? item.imagen : `http://localhost:8000${item.imagen}`} 
                          className="w-full h-full object-contain" 
                          alt="" 
                        />
                      </div>
                      <div className="max-w-[120px]">
                        <p className="font-bold text-[11px] text-slate-800 truncate">{item.nombre}</p>
                        <p className="text-[10px] text-slate-500">${parseFloat(item.precio).toFixed(2)}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => quitarDelCarrito(index)}
                      className="text-slate-300 hover:text-red-500 p-2 transition-colors"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
              
              <div className="mt-8 pt-6 border-t border-slate-100 space-y-4">
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-slate-500">Total</span>
                  <span className="text-teal-700 text-2xl">${(total * 1.15).toFixed(2)}</span>
                </div>
                <button 
                  onClick={() => setShowModal(true)}
                  className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 text-white py-4 rounded-2xl font-black shadow-lg hover:shadow-teal-100 hover:-translate-y-1 transition-all active:scale-95"
                >
                  FINALIZAR VENTA
                </button>
              </div>
            </>
          )}
        </aside>
      </main>

      {/* ---- Modal Venta Exitosa ---- */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-slate-900/40 animate-fade-in">
          <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-md overflow-hidden animate-slide-up">
            <div className="h-3 bg-teal-500"></div>
            <div className="p-10 text-center">
              <span className="text-6xl block mb-6">✅</span>
              <h3 className="text-3xl font-black text-slate-800 mb-2">¡Venta Exitosa!</h3>
              <p className="text-slate-500 mb-8">El comprobante ha sido generado.</p>
              
              <div className="bg-slate-50 py-6 rounded-3xl mb-8">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Monto Cobrado</span>
                <span className="text-5xl font-black text-teal-700">${(total * 1.15).toFixed(2)}</span>
              </div>

              <button 
                onClick={() => { setCarrito([]); setShowModal(false); setBusqueda(""); }}
                className="w-full bg-slate-800 text-white py-4 rounded-2xl font-black hover:bg-teal-700 transition-all"
              >
                CERRAR Y CONTINUAR
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 10px; }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.2s ease-out; }
        @keyframes slide-up { from { opacity: 0; transform: translateY(30px) scale(0.9); } to { opacity: 1; transform: translateY(0) scale(1); } }
        .animate-slide-up { animation: slide-up 0.4s cubic-bezier(0.17, 0.67, 0.83, 0.67); }
      `}</style>
    </div>
  )
}

export default App