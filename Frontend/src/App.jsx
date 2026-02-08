import { useState } from 'react'

function App() {
  // Estado para el inventario de productos (hardware)
  const [productos] = useState([
    { id: 1, nombre: "Ryzen 5 5600G", precio: 145.00, stock: 5, categoria: "Procesadores" },
    { id: 2, nombre: "Kit Memoria RAM 16GB (2x8GB) DDR4", precio: 45.50, stock: 12, categoria: "RAM" },
    { id: 3, nombre: "SSD NVMe M.2 1TB Gen4", precio: 65.00, stock: 8, categoria: "Almacenamiento" },
    { id: 4, nombre: "Teclado Mecánico RGB Switch Red", precio: 35.00, stock: 15, categoria: "Periféricos" },
    { id: 5, nombre: "Monitor 24'' IPS 144Hz", precio: 180.00, stock: 3, categoria: "Monitores" },
    { id: 6, nombre: "Fuente de Poder 650W 80+ Bronze", precio: 55.00, stock: 10, categoria: "Componentes" },
  ]);

  // Estado para el carrito de compras
  const [carrito, setCarrito] = useState([]);
  // Estado para controlar la visibilidad del modal de pago
  const [showModal, setShowModal] = useState(false);

  // Función para añadir productos al carrito
  const agregarAlCarrito = (producto) => {
    setCarrito([...carrito, producto]);
  };

  // Función para quitar un producto específico del carrito
  const quitarDelCarrito = (indexAEliminar) => {
    setCarrito(carrito.filter((_, index) => index !== indexAEliminar));
  };

  // Calcular el total de la venta
  const total = carrito.reduce((acc, p) => acc + p.precio, 0);

  return (
    // Fondo principal con un tono pizarra muy suave
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800 relative">
      
      {/* ---- Header con Gradiente Esmeralda ---- */}
      <header className="bg-gradient-to-r from-teal-700 to-emerald-500 text-white p-6 shadow-xl relative overflow-hidden">
        {/* Elemento decorativo de fondo */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-20 blur-3xl pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center relative z-10">
          <div className="mb-4 md:mb-0 text-center md:text-left">
            <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
              <span className="bg-white/20 p-2 rounded-xl">💻</span>
              TechPoint POS
            </h1>
            <p className="text-emerald-100 font-medium mt-1">Sistema de Ventas Profesional - Snayder Cedeño</p>
          </div>
          {/* Resumen de total en el header */}
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
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {productos.map((prod) => (
              // Tarjeta de Producto con diseño pulido
              <div key={prod.id} className="group bg-white p-5 rounded-3xl shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)] border border-slate-200/60 hover:border-teal-500/30 hover:shadow-[0_20px_40px_-15px_rgba(0,128,128,0.2)] transition-all duration-300 relative overflow-hidden">
                {/* Fondo decorativo al pasar el mouse */}
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
                      <span className="text-3xl font-black text-slate-800 tracking-tight">${prod.precio.toFixed(2)}</span>
                    </div>
                    <button 
                      onClick={() => agregarAlCarrito(prod)}
                      className="bg-slate-800 text-white px-5 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-slate-200/50 hover:bg-teal-600 hover:shadow-teal-200/50 hover:-translate-y-1 active:translate-y-0 active:shadow-sm transition-all duration-200"
                    >
                      <span>Añadir</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
              {/* Lista de productos en el carrito con scroll */}
              <ul className="space-y-3 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                {carrito.map((item, index) => (
                  <li key={index} className="flex justify-between items-center bg-white p-3 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                    <div className="absolute inset-y-0 left-0 w-1 bg-indigo-500/50 rounded-r-full"></div>
                    <div className="pl-3">
                      <p className="font-bold text-sm text-slate-800 line-clamp-1">{item.nombre}</p>
                      <p className="text-xs text-slate-500 font-medium">${item.precio.toFixed(2)}</p>
                    </div>
                    <button 
                      onClick={() => quitarDelCarrito(index)}
                      className="text-slate-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-xl transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                      aria-label="Quitar producto"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </li>
                ))}
              </ul>
              
              {/* Resumen de totales en el footer del carrito */}
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
                  onClick={() => setShowModal(true)} // Abre el modal al hacer click
                  className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 text-white py-4 rounded-2xl font-black text-lg shadow-lg shadow-teal-200/50 hover:shadow-xl hover:from-teal-700 hover:to-emerald-700 hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-3"
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
          {/* Contenedor del Modal */}
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden animate-slide-up relative">
            {/* Decoración superior */}
            <div className="h-24 bg-gradient-to-r from-teal-600 to-emerald-500 relative overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmF(255,255,255,0.2)iIvPjwvc3ZnPg==')] opacity-30"></div>
              <div className="bg-white/20 p-4 rounded-full backdrop-blur-md shadow-inner">
                <span className="text-4xl">🎉</span>
              </div>
            </div>
            
            <div className="p-8 pt-6 text-center">
              <h3 className="text-2xl font-black text-slate-800 mb-2">¡Confirmar Pago!</h3>
              <p className="text-slate-500 font-medium mb-6">Estás a punto de procesar una venta por:</p>
              
              <div className="bg-slate-50 border-2 border-slate-100 py-4 px-6 rounded-2xl mb-8 inline-block shadow-sm">
                <span className="text-4xl font-black text-teal-700 block">${(total * 1.15).toFixed(2)}</span>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Incluye IVA</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setShowModal(false)}
                  className="bg-white text-slate-700 border-2 border-slate-200 py-3 rounded-xl font-bold hover:bg-slate-50 hover:border-slate-300 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={() => {
                    alert("¡Venta procesada con éxito! (Simulación)");
                    setCarrito([]); // Limpia el carrito
                    setShowModal(false); // Cierra el modal
                  }}
                  className="bg-teal-600 text-white py-3 rounded-xl font-bold shadow-md shadow-teal-200/50 hover:bg-teal-700 transition-all active:scale-95"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Estilos personalizados rápidos para animaciones y scrollbar */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #94a3b8; }
        
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.2s ease-out; }
        
        @keyframes slide-up { from { opacity: 0; transform: translateY(20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
        .animate-slide-up { animation: slide-up 0.3s ease-out cubic-bezier(0.16, 1, 0.3, 1); }
      `}</style>
    </div>
  )
}

export default App