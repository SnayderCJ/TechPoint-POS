import { useState, useEffect } from 'react' // Añadimos useEffect para la carga de datos

function App() {
  // Ahora el inventario empieza vacío y se llena desde la API de Django
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true); // Estado de carga para mejor UX
  const [error, setError] = useState(null);

  // Estado para el carrito de compras
  const [carrito, setCarrito] = useState([]);
  // Estado para controlar la visibilidad del modal de pago
  const [showModal, setShowModal] = useState(false);

  // --- Lógica de Conexión con el Backend ---
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        setLoading(true);
        // Usamos la variable de entorno configurada en Docker
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

  // Función para añadir productos al carrito
  const agregarAlCarrito = (producto) => {
    setCarrito([...carrito, producto]);
  };

  // Función para quitar un producto específico del carrito
  const quitarDelCarrito = (indexAEliminar) => {
    setCarrito(carrito.filter((_, index) => index !== indexAEliminar));
  };

  // Calcular el total de la venta
  const total = carrito.reduce((acc, p) => acc + parseFloat(p.precio), 0);

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800 relative">
      
      {/* ---- Header con Gradiente Esmeralda ---- */}
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
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 shadow-sm">
            <span className="text-xs uppercase font-bold text-emerald-200 tracking-wider">Total en Curso</span>
            <p className="text-3xl font-black leading-tight">${total.toFixed(2)}</p>
          </div>
        </div>
      </header>

      {/* ---- Contenido Principal ---- */}
      <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8 my-8">
        
        {/* Sección del Catálogo de Productos */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold flex items-center gap-3 text-slate-700">
            <span className="flex items-center justify-center w-10 h-10 bg-teal-100 text-teal-700 rounded-xl shadow-sm">📦</span>
            Catálogo de Hardware 
          </h2>
          
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl">
              ⚠️ Error: {error}. Asegúrate de que el backend esté corriendo.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {productos.map((prod) => (
                <div key={prod.id} className="group bg-white p-5 rounded-3xl shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)] border border-slate-200/60 hover:border-teal-500/30 hover:shadow-[0_20px_40px_-15px_rgba(0,128,128,0.2)] transition-all duration-300 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  
                  <div className="relative">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-[10px] font-extrabold text-teal-600 bg-teal-100/80 px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">{prod.categoria}</span>
                      <p className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                        <span className={`w-2 h-2 rounded-full ${prod.stock > 0 ? 'bg-emerald-400' : 'bg-red-400'}`}></span>
                        Stock: {prod.stock}
                      </p>
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 leading-tight group-hover:text-teal-700 transition-colors">{prod.nombre}</h3>
                    
                    <div className="mt-6 flex justify-between items-end">
                      <div>
                        <p className="text-sm text-slate-400 font-medium mb-1">Precio Unitario</p>
                        <span className="text-3xl font-black text-slate-800 tracking-tight">${parseFloat(prod.precio).toFixed(2)}</span>
                      </div>
                      <button 
                        onClick={() => agregarAlCarrito(prod)}
                        className="bg-slate-800 text-white px-5 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-slate-200/50 hover:bg-teal-600 hover:shadow-teal-200/50 hover:-translate-y-1 transition-all duration-200"
                      >
                        <span>Añadir</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sección Lateral del Carrito */}
        <aside className="bg-white p-6 rounded-[2rem] shadow-[0_10px_30px_-15px_rgba(0,0,0,0.1)] border border-slate-200/80 h-fit sticky top-8">
          <h2 className="text-xl font-bold mb-6 pb-4 border-b border-slate-100 flex items-center justify-between text-slate-700">
            <span className="flex items-center gap-3">
              <span className="flex items-center justify-center w-10 h-10 bg-indigo-100 text-indigo-700 rounded-xl shadow-sm">🛒</span>
              Resumen de Venta
            </span>
            <span className="text-sm bg-slate-100 text-slate-500 px-3 py-1 rounded-full font-bold">{carrito.length} Items</span>
          </h2>

          {carrito.length === 0 ? (
            <div className="text-center py-16 px-4 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
              <span className="text-5xl block mb-3 opacity-30">🛍️</span>
              <p className="text-slate-500 font-medium">Tu carrito está vacío.</p>
              <p className="text-sm text-slate-400 mt-1">Agrega productos para comenzar.</p>
            </div>
          ) : (
            <>
              <ul className="space-y-3 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                {carrito.map((item, index) => (
                  <li key={index} className="flex justify-between items-center bg-white p-3 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                    <div className="absolute inset-y-0 left-0 w-1 bg-indigo-500/50 rounded-r-full"></div>
                    <div className="pl-3">
                      <p className="font-bold text-sm text-slate-800 line-clamp-1">{item.nombre}</p>
                      <p className="text-xs text-slate-500 font-medium">${parseFloat(item.precio).toFixed(2)}</p>
                    </div>
                    <button 
                      onClick={() => quitarDelCarrito(index)}
                      className="text-slate-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-xl transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </li>
                ))}
              </ul>
              
              <div className="mt-8 pt-6 border-t border-slate-100 space-y-4">
                <div className="flex justify-between text-sm font-medium text-slate-500">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-medium text-slate-500">
                  <span>IVA (15%)</span>
                  <span>${(total * 0.15).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center pt-4">
                  <span className="text-lg font-bold text-slate-700">Total a Pagar</span>
                  <span className="text-3xl font-black text-teal-700">${(total * 1.15).toFixed(2)}</span>
                </div>
                <button 
                  onClick={() => setShowModal(true)}
                  className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 text-white py-4 rounded-2xl font-black text-lg shadow-lg hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-3"
                >
                  <span>⭐</span> FINALIZAR VENTA
                </button>
              </div>
            </>
          )}
        </aside>
      </main>

      {/* ---- Modal de Confirmación de Pago ---- */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-slate-900/40 animate-fade-in">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden animate-slide-up relative">
            <div className="h-24 bg-gradient-to-r from-teal-600 to-emerald-500 relative overflow-hidden flex items-center justify-center">
              <div className="bg-white/20 p-4 rounded-full backdrop-blur-md shadow-inner">
                <span className="text-4xl">🎉</span>
              </div>
            </div>
            
            <div className="p-8 pt-6 text-center">
              <h3 className="text-2xl font-black text-slate-800 mb-2">¡Venta Exitosa!</h3>
              <p className="text-slate-500 font-medium mb-6">Se ha procesado un total de:</p>
              
              <div className="bg-slate-50 border-2 border-slate-100 py-4 px-6 rounded-2xl mb-8 inline-block shadow-sm">
                <span className="text-4xl font-black text-teal-700 block">${(total * 1.15).toFixed(2)}</span>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Monto Total</span>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <button 
                  onClick={() => {
                    setCarrito([]);
                    setShowModal(false);
                  }}
                  className="bg-teal-600 text-white py-3 rounded-xl font-bold shadow-md hover:bg-teal-700 transition-all active:scale-95"
                >
                  Continuar Vendiendo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 10px; }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.2s ease-out; }
        @keyframes slide-up { from { opacity: 0; transform: translateY(20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
        .animate-slide-up { animation: slide-up 0.3s ease-out cubic-bezier(0.16, 1, 0.3, 1); }
      `}</style>
    </div>
  )
}

export default App