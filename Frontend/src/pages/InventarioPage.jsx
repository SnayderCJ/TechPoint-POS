import { useState, useEffect } from 'react';
import { PackagePlus, Package, Search, Trash2, Edit3, CheckCircle, AlertCircle, X, Loader2, Image as ImageIcon, BarChart3 } from 'lucide-react';

function InventarioPage({ isDarkMode, showToast, authFetch }) { // 👈 Recibe authFetch
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [editandoId, setEditandoId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const [formData, setFormData] = useState({
    nombre: '',
    categoria: '',
    precio: '',
    precio_compra: '',
    stock: '',
    stock_minimo: '3',
    codigo_barras: '',
    imagen: null
  });

  const fetchProductos = async () => {
    try {
      const response = await authFetch('http://localhost:8000/api/productos/');
      const data = await response.json();
      setProductos(Array.isArray(data) ? data : []);
    } catch (err) {
      showToast("Error al conectar con el servidor de inventario", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProductos(); }, []);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'imagen') {
      setFormData({ ...formData, imagen: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const seleccionarProducto = (prod) => {
    setEditandoId(prod.id);
    setFormData({
      nombre: prod.nombre,
      categoria: prod.categoria,
      precio: prod.precio,
      precio_compra: prod.precio_compra,
      stock: prod.stock,
      stock_minimo: prod.stock_minimo,
      codigo_barras: prod.codigo_barras,
      imagen: null 
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelarEdicion = () => {
    setEditandoId(null);
    setFormData({ nombre: '', categoria: '', precio: '', precio_compra: '', stock: '', stock_minimo: '3', codigo_barras: '', imagen: null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('nombre', formData.nombre);
    data.append('categoria', formData.categoria);
    data.append('precio', formData.precio);
    data.append('precio_compra', formData.precio_compra);
    data.append('stock', formData.stock);
    data.append('stock_minimo', formData.stock_minimo);
    data.append('codigo_barras', formData.codigo_barras);
    if (formData.imagen) data.append('imagen', formData.imagen);

    const url = editandoId ? `http://localhost:8000/api/productos/${editandoId}/` : 'http://localhost:8000/api/productos/';
    const method = editandoId ? 'PATCH' : 'POST';

    try {
      // Nota: authFetch maneja el Content-Type: application/json por defecto.
      // Para FormData, debemos dejar que el navegador ponga el boundary correcto.
      const techpointUser = JSON.parse(localStorage.getItem('techpoint_user'));
      const response = await fetch(url, { 
        method, 
        body: data,
        headers: {
          'Authorization': `Bearer ${techpointUser?.token}`
        }
      });

      if (response.ok) {
        showToast(editandoId ? "Producto actualizado" : "Producto registrado");
        cancelarEdicion();
        fetchProductos();
      } else {
        const errData = await response.json();
        showToast(errData.codigo_barras ? "El código de barras ya existe" : "Error al procesar producto", "error");
      }
    } catch (err) {
      showToast("Error de conexión con el backend", "error");
    }
  };

  const eliminarProducto = async (id) => {
    try {
      const response = await authFetch(`http://localhost:8000/api/productos/${id}/`, { method: 'DELETE' });
      if (response.ok) {
        showToast("Producto eliminado del stock");
        if (editandoId === id) cancelarEdicion();
        fetchProductos();
      } else {
        showToast("No se puede eliminar (tiene ventas asociadas)", "error");
      }
    } catch (err) {
      showToast("Error al intentar eliminar", "error");
    }
    setConfirmDelete(null);
  };

  const productosFiltrados = productos.filter(p => 
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.codigo_barras.includes(busqueda)
  );

  return (
    <div className="flex flex-col space-y-10 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className={`text-4xl font-black tracking-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}>
            Control de <span className="text-violet-600">Inventario</span>
          </h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-2">Hardware & Componentes • Milagro • UNEMI</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className={`lg:col-span-1 p-8 rounded-[2.5rem] border h-fit sticky top-8 ${isDarkMode ? "bg-slate-900/50 border-white/10 shadow-2xl" : "bg-white border-slate-200 shadow-xl"}`}>
          <div className="flex items-center justify-between mb-8">
            <h2 className={`text-xl font-black flex items-center gap-3 ${isDarkMode ? "text-white" : "text-slate-800"}`}>
              {editandoId ? <Edit3 className="text-amber-500" /> : <PackagePlus className="text-violet-500" />}
              {editandoId ? "Editar Hardware" : "Nuevo Componente"}
            </h2>
            {editandoId && <button onClick={cancelarEdicion} className="text-slate-400 hover:text-red-500"><X size={20} /></button>}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Nombre del Producto</label>
              <input name="nombre" value={formData.nombre} onChange={handleInputChange} required className={`w-full px-5 py-4 rounded-2xl border outline-none font-bold text-sm ${isDarkMode ? "bg-slate-950 border-white/10 text-white focus:border-violet-500" : "bg-slate-50 border-slate-200"}`}/>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Precio Venta ($)</label>
                <input name="precio" type="number" step="0.01" value={formData.precio} onChange={handleInputChange} required className={`w-full px-5 py-4 rounded-2xl border outline-none font-bold text-sm ${isDarkMode ? "bg-slate-950 border-white/10 text-white" : "bg-slate-50 border-slate-200"}`}/>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-violet-500 mb-2 block">Precio Compra ($)</label>
                <input name="precio_compra" type="number" step="0.01" value={formData.precio_compra} onChange={handleInputChange} required className={`w-full px-5 py-4 rounded-2xl border outline-none font-black text-sm ${isDarkMode ? "bg-slate-950 border-violet-500/20 text-white" : "bg-violet-50 border-violet-200"}`}/>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Stock Actual</label>
                <input name="stock" type="number" value={formData.stock} onChange={handleInputChange} required className={`w-full px-5 py-4 rounded-2xl border outline-none font-bold text-sm ${isDarkMode ? "bg-slate-950 border-white/10 text-white" : "bg-slate-50 border-slate-200"}`}/>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-red-500 mb-2 block">Stock Mínimo</label>
                <input name="stock_minimo" type="number" value={formData.stock_minimo} onChange={handleInputChange} required className={`w-full px-5 py-4 rounded-2xl border outline-none font-bold text-sm ${isDarkMode ? "bg-slate-950 border-red-500/10 text-white" : "bg-red-50 border-red-100"}`}/>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Código de Barras</label>
              <input name="codigo_barras" value={formData.codigo_barras} onChange={handleInputChange} required className={`w-full px-5 py-4 rounded-2xl border outline-none font-bold text-sm ${isDarkMode ? "bg-slate-950 border-white/10 text-white" : "bg-slate-50 border-slate-200"}`}/>
            </div>

            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Categoría</label>
              <select name="categoria" value={formData.categoria} onChange={handleInputChange} required className={`w-full px-5 py-4 rounded-2xl border outline-none font-bold text-sm ${isDarkMode ? "bg-slate-950 border-white/10 text-white" : "bg-slate-50 border-slate-200"}`}>
                <option value="">Seleccionar...</option>
                <option value="Procesadores">Procesadores</option>
                <option value="Tarjetas Gráficas">Tarjetas Gráficas</option>
                <option value="Almacenamiento">Almacenamiento</option>
                <option value="Memorias RAM">Memorias RAM</option>
                <option value="Periféricos">Periféricos</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Imagen del Producto</label>
              <input type="file" name="imagen" onChange={handleInputChange} className="text-xs font-bold text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-violet-500 file:text-white hover:file:bg-violet-600 cursor-pointer w-full"/>
            </div>

            <button type="submit" className={`w-full py-5 rounded-[1.8rem] font-black text-sm uppercase tracking-widest transition-all shadow-lg ${editandoId ? "bg-amber-500 text-white shadow-amber-500/30" : "bg-violet-600 text-white shadow-violet-600/30"}`}>
              {editandoId ? "Guardar Cambios" : "Añadir al Stock"}
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className={`p-6 rounded-3xl border flex items-center gap-4 transition-all ${isDarkMode ? "bg-slate-900/40 border-white/5" : "bg-white border-slate-200 shadow-sm"}`}>
            <Search className="text-slate-400" size={20} />
            <input type="text" placeholder="Buscar por nombre o código..." className={`w-full bg-transparent outline-none font-bold text-sm ${isDarkMode ? "text-white" : "text-slate-900"}`} value={busqueda} onChange={(e) => setBusqueda(e.target.value)}/>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {loading ? (
              <div className="p-20 text-center animate-pulse font-black text-xs uppercase tracking-widest">Sincronizando Almacén...</div>
            ) : productosFiltrados.map(prod => (
              <div key={prod.id} className={`p-5 rounded-[2rem] border transition-all duration-300 flex flex-col md:flex-row justify-between items-center gap-6 ${isDarkMode ? "bg-slate-900/60 border-white/5 hover:border-violet-500/40" : "bg-white border-slate-100 hover:border-violet-400 shadow-sm"}`}>
                <div className="flex items-center gap-6 w-full overflow-hidden">
                  <div className={`w-16 h-16 rounded-2xl overflow-hidden p-2 shrink-0 ${isDarkMode ? "bg-slate-950" : "bg-slate-50 border"}`}>
                    <img src={prod.imagen?.startsWith('http') ? prod.imagen : `http://localhost:8000${prod.imagen}`} className="w-full h-full object-contain" alt=""/>
                  </div>
                  <div className="overflow-hidden">
                    <h3 className={`font-black text-lg truncate ${isDarkMode ? "text-white" : "text-slate-800"}`}>{prod.nombre}</h3>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <span className="text-[9px] font-black uppercase text-slate-500 bg-slate-500/10 px-2 py-0.5 rounded-md">{prod.categoria}</span>
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${prod.stock <= prod.stock_minimo ? "bg-red-500/10 text-red-500 animate-pulse" : "bg-green-500/10 text-green-500"}`}>Stock: {prod.stock}</span>
                      <span className="text-[9px] font-black uppercase text-violet-500 bg-violet-500/10 px-2 py-0.5 rounded-md">${parseFloat(prod.precio).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <button onClick={() => seleccionarProducto(prod)} className={`p-4 rounded-2xl ${isDarkMode ? "bg-white/5 text-amber-500" : "bg-amber-50 text-amber-600"}`}><Edit3 size={18}/></button>
                  <button onClick={() => setConfirmDelete(prod)} className={`p-4 rounded-2xl ${isDarkMode ? "bg-white/5 text-red-500" : "bg-red-50 text-red-600"}`}><Trash2 size={18}/></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {confirmDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 backdrop-blur-xl p-6">
          <div className={`w-full max-w-sm rounded-[3rem] p-10 border text-center animate-in zoom-in duration-300 ${isDarkMode ? "bg-slate-900 border-white/10 shadow-2xl" : "bg-white border-slate-200 shadow-xl shadow-slate-200"}`}>
            <div className="w-20 h-20 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trash2 size={40} />
            </div>
            <h3 className={`text-2xl font-black mb-2 ${isDarkMode ? "text-white" : "text-slate-900"}`}>¿Retirar Stock?</h3>
            <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mb-8 text-balance">Eliminarás <b>{confirmDelete.nombre}</b> permanentemente del inventario.</p>
            <div className="flex gap-4">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 bg-slate-800 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest">Cancelar</button>
              <button onClick={() => eliminarProducto(confirmDelete.id)} className="flex-1 bg-red-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest">Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default InventarioPage;