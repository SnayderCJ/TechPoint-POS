import { useState, useEffect } from 'react';
import { ShoppingCart, Search, Package, CheckCircle } from 'lucide-react';

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
      alert("⚠️ No hay más stock disponible de este producto.");
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
        alert("Error al procesar la venta.");
      }
    } catch (err) { alert("Error de conexión con el servidor."); }
  };

  const productosFiltrados = productos.filter(p => 
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.categoria.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header Estilizado */}
      <header className="bg-gradient-to-r from-teal-600 to-emerald-500 p-8 text-white shadow-xl flex justify-between items-center rounded-b-[3rem]">
        <div>
          <h1 className="text-4xl font-black">TechPoint POS</h1>
          <p className="opacity-90 font-medium">Sistema Profesional - Snayder Cedeño</p>
        </div>
        <div className="bg-white/20 backdrop-blur-md p-4 rounded-3xl border border-white/20 text-center min-w-[160px]">
          <span className="text-xs font-bold uppercase tracking-widest opacity-80">Total Venta</span>
          <p className="text-3xl font-black">${total.toFixed(2)}</p>
        </div>
      </header>

      <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Catálogo */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between bg-white p-4 rounded-[2rem] shadow-sm border border-slate-100">
            <h2 className="text-xl font-bold flex items-center gap-2 text-slate-700">
              <Package className="text-emerald-500" /> Catálogo de Hardware
            </h2>
            <div className="relative w-64">
              <Search className="absolute left-3 top-2.5 text-slate-300" size={18} />
              <input 
                type="text" placeholder="Buscar..." 
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm"
                value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {productosFiltrados.map(prod => (
              <div key={prod.id} className="bg-white p-5 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-emerald-500/5 transition-all group relative overflow-hidden">
                <div className="h-40 bg-slate-50 rounded-3xl mb-4 flex items-center justify-center overflow-hidden border border-slate-50">
                  <img src={prod.imagen.startsWith('http') ? prod.imagen : `http://localhost:8000${prod.imagen}`} className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500" alt="" />
                </div>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-bold bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full uppercase">{prod.categoria}</span>
                  <span className={`text-[10px] font-bold ${prod.stock <= 0 ? 'text-red-500' : 'text-slate-400'}`}>Stock: {prod.stock}</span>
                </div>
                <h3 className="font-bold text-slate-800 leading-tight mb-4 h-10 overflow-hidden">{prod.nombre}</h3>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-black text-slate-800">${parseFloat(prod.precio).toFixed(2)}</span>
                  <button onClick={() => agregarAlCarrito(prod)} disabled={prod.stock <= 0} className="bg-slate-900 text-white p-3 rounded-2xl hover:bg-emerald-500 transition-all active:scale-90 disabled:opacity-30">
                    <ShoppingCart size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Carrito Lateral */}
        <aside className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-100 h-fit sticky top-8">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-50">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">Resumen</h2>
            <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-xs font-bold">{carrito.length} Items</span>
          </div>

          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {carrito.length === 0 ? (
              <p className="text-center text-slate-400 py-12 italic">Carrito vacío</p>
            ) : (
              carrito.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center bg-slate-50 p-3 rounded-2xl border border-slate-100 group">
                  <div className="flex items-center gap-3">
                    <img src={item.imagen} className="w-10 h-10 rounded-lg object-contain bg-white border" alt="" />
                    <div className="max-w-[110px]">
                      <p className="font-bold text-[11px] truncate">{item.nombre}</p>
                      <p className="text-[10px] text-slate-500 font-bold">${parseFloat(item.precio).toFixed(2)}</p>
                    </div>
                  </div>
                  <button onClick={() => quitarDelCarrito(item.id)} className="text-slate-300 hover:text-red-500 transition-colors">✕</button>
                </div>
              ))
            )}
          </div>

          {carrito.length > 0 && (
            <div className="mt-8 pt-6 border-t border-slate-100 space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-slate-400 font-bold text-sm">Total Final</span>
                <span className="text-3xl font-black text-emerald-600">${(total * 1.15).toFixed(2)}</span>
              </div>
              <button onClick={procesarVentaFinal} className="w-full bg-slate-900 text-white py-4 rounded-3xl font-black shadow-lg hover:shadow-emerald-500/20 hover:bg-emerald-600 transition-all active:scale-95">
                FINALIZAR VENTA
              </button>
            </div>
          )}
        </aside>
      </div>

      {/* Modal Éxito */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[3rem] p-10 text-center max-w-sm w-full shadow-2xl relative overflow-hidden">
            <div className="h-2 bg-emerald-500 absolute top-0 left-0 right-0"></div>
            <div className="bg-emerald-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="text-emerald-500" size={40} />
            </div>
            <h3 className="text-2xl font-black text-slate-800 mb-2">¡Venta Exitosa!</h3>
            <p className="text-slate-400 font-medium mb-8 text-sm">El inventario se ha actualizado correctamente en la base de datos.</p>
            <button onClick={() => setShowModal(false)} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold">Continuar</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PosPage;