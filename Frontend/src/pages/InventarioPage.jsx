import React, { useState, useEffect } from 'react';
import { Package, Plus, Edit, Trash2, ImageOff, X, Save, Upload, CheckCircle, Barcode, Layers } from 'lucide-react';

const InventarioPage = ({ isDarkMode }) => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estados para el CRUD
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  
  // Estado del Formulario actualizado con tu modelo de Django
  const [formData, setFormData] = useState({
    nombre: '',
    categoria: '',
    precio: '',
    stock: '',
    codigo_barras: '',
    imagen: null
  });

  const fetchProductos = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/productos/');
      const data = await res.json();
      setProductos(data);
      setLoading(false);
    } catch (err) { console.error("Error al sincronizar con PostgreSQL:", err); }
  };

  useEffect(() => { fetchProductos(); }, []);

  const openModal = (prod = null) => {
    if (prod) {
      setEditMode(true);
      setCurrentId(prod.id);
      setFormData({
        nombre: prod.nombre,
        categoria: prod.categoria,
        precio: prod.precio,
        stock: prod.stock,
        codigo_barras: prod.codigo_barras,
        imagen: null // La imagen se mantiene en el servidor a menos que subas una nueva
      });
    } else {
      setEditMode(false);
      setFormData({ nombre: '', categoria: '', precio: '', stock: '0', codigo_barras: '', imagen: null });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('nombre', formData.nombre);
    data.append('categoria', formData.categoria);
    data.append('precio', formData.precio);
    data.append('stock', formData.stock);
    data.append('codigo_barras', formData.codigo_barras);
    if (formData.imagen) data.append('imagen', formData.imagen);

    const url = editMode 
      ? `http://localhost:8000/api/productos/${currentId}/` 
      : 'http://localhost:8000/api/productos/';
    
    const method = editMode ? 'PATCH' : 'POST';

    try {
      const res = await fetch(url, { method, body: data });
      if (res.ok) {
        fetchProductos();
        setShowModal(false);
      } else {
        const errorData = await res.json();
        alert(`Error: ${JSON.stringify(errorData)}`);
      }
    } catch (err) { alert("Error de red con el servidor de Django"); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Confirmas la eliminación permanente de este registro?")) return;
    try {
      await fetch(`http://localhost:8000/api/productos/${id}/`, { method: 'DELETE' });
      fetchProductos();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* ---- Header SaaS ---- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className={`text-4xl font-black tracking-tighter flex items-center gap-4 ${isDarkMode ? "text-white" : "text-slate-900"}`}>
            <div className={`p-3 rounded-2xl border ${isDarkMode ? "bg-violet-500/10 border-violet-500/20" : "bg-violet-50 border-violet-100"}`}>
              <Package className="text-violet-500" size={32} />
            </div>
            Gestión de <span className="text-violet-600">Stock</span>
          </h2>
          <p className="text-slate-500 font-semibold uppercase tracking-widest text-[10px] mt-3 ml-1">Terminal Administrativa • UNEMI</p>
        </div>

        <button onClick={() => openModal()} className="bg-violet-600 hover:bg-violet-500 text-white px-8 py-4 rounded-3xl font-bold flex items-center gap-3 transition-all shadow-lg shadow-violet-600/20 active:scale-95 text-xs uppercase tracking-widest">
          <Plus size={18} /> Registrar Producto
        </button>
      </div>

      {/* ---- Tabla de Inventario ---- */}
      <div className={`rounded-[2.5rem] border transition-all overflow-hidden ${isDarkMode ? "bg-slate-900/60 backdrop-blur-xl border-white/10 shadow-2xl" : "bg-white border-slate-200 shadow-md"}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className={`border-b ${isDarkMode ? "bg-white/5 border-white/5" : "bg-slate-50 border-slate-100"}`}>
                <th className="px-10 py-6 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Hardware / SKU</th>
                <th className="px-8 py-6 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-center">Stock</th>
                <th className="px-8 py-6 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-right">Precio</th>
                <th className="px-10 py-6 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDarkMode ? "divide-white/5" : "divide-slate-100"}`}>
              {productos.map((prod) => (
                <tr key={prod.id} className={`transition-colors ${isDarkMode ? "hover:bg-white/[0.02]" : "hover:bg-slate-50/50"}`}>
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-5">
                      <div className={`w-14 h-14 rounded-2xl p-1 border flex items-center justify-center overflow-hidden ${isDarkMode ? "bg-slate-950 border-white/5" : "bg-white border-slate-200"}`}>
                        {prod.imagen ? <img src={prod.imagen} className="w-full h-full object-contain" alt="" /> : <ImageOff className="text-slate-300" size={20} />}
                      </div>
                      <div>
                        <p className={`text-sm font-bold ${isDarkMode ? "text-white" : "text-slate-800"}`}>{prod.nombre}</p>
                        <p className="text-[9px] text-violet-500 font-black uppercase tracking-tighter mt-0.5 flex items-center gap-1">
                          <Barcode size={10} /> {prod.codigo_barras}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className={`px-4 py-1.5 rounded-xl font-black text-xs ${prod.stock < 3 ? "bg-red-500/10 text-red-500" : (isDarkMode ? "bg-slate-800 text-slate-200" : "bg-slate-100 text-slate-700")}`}>{prod.stock} PCS</span>
                  </td>
                  <td className={`px-8 py-6 text-right font-black text-lg ${isDarkMode ? "text-white" : "text-slate-900"}`}>${parseFloat(prod.precio).toFixed(2)}</td>
                  <td className="px-10 py-6 text-center">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => openModal(prod)} className={`p-2.5 rounded-xl border transition-all ${isDarkMode ? "bg-white/5 text-slate-400 border-transparent hover:text-violet-400" : "bg-slate-50 text-slate-400 border-slate-100 hover:text-violet-600"}`}><Edit size={16} /></button>
                      <button onClick={() => handleDelete(prod.id)} className={`p-2.5 rounded-xl border transition-all ${isDarkMode ? "bg-white/5 text-slate-400 border-transparent hover:text-red-400" : "bg-slate-50 text-slate-400 border-slate-100 hover:text-red-600"}`}><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ---- MODAL CRUD PROFESIONAL ---- */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className={`rounded-[3rem] p-10 max-w-2xl w-full shadow-2xl border animate-in zoom-in-95 duration-300 ${isDarkMode ? "bg-slate-900 border-white/10" : "bg-white border-slate-200"}`}>
            <div className="flex justify-between items-center mb-8">
              <h3 className={`text-2xl font-black ${isDarkMode ? "text-white" : "text-slate-900"}`}>{editMode ? "Actualizar Hardware" : "Nuevo Componente"}</h3>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-full hover:bg-red-500/10 text-slate-400 hover:text-red-500 transition-all"><X /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2 space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase ml-2">Nombre del Producto</label>
                  <input required type="text" className={`w-full p-4 rounded-2xl outline-none border transition-all ${isDarkMode ? "bg-slate-950 border-white/5 text-white focus:border-violet-500" : "bg-slate-50 border-slate-200 text-slate-900 focus:border-violet-500"}`}
                    value={formData.nombre} onChange={(e) => setFormData({...formData, nombre: e.target.value})} placeholder="Ej: AMD Ryzen 5 5600G" />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase ml-2">Código de Barras (Único)</label>
                  <input required type="text" className={`w-full p-4 rounded-2xl outline-none border transition-all ${isDarkMode ? "bg-slate-950 border-white/5 text-white" : "bg-slate-50 border-slate-200 text-slate-900"}`}
                    value={formData.codigo_barras} onChange={(e) => setFormData({...formData, codigo_barras: e.target.value})} placeholder="7890..." />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase ml-2">Categoría</label>
                  <input required type="text" className={`w-full p-4 rounded-2xl outline-none border transition-all ${isDarkMode ? "bg-slate-950 border-white/5 text-white" : "bg-slate-50 border-slate-200 text-slate-900"}`}
                    value={formData.categoria} onChange={(e) => setFormData({...formData, categoria: e.target.value})} placeholder="Procesadores" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase ml-2">Precio de Venta ($)</label>
                  <input required type="number" step="0.01" className={`w-full p-4 rounded-2xl outline-none border transition-all ${isDarkMode ? "bg-slate-950 border-white/5 text-white" : "bg-slate-50 border-slate-200 text-slate-900"}`}
                    value={formData.precio} onChange={(e) => setFormData({...formData, precio: e.target.value})} />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase ml-2">Stock Disponible</label>
                  <input required type="number" className={`w-full p-4 rounded-2xl outline-none border transition-all ${isDarkMode ? "bg-slate-950 border-white/5 text-white" : "bg-slate-50 border-slate-200 text-slate-900"}`}
                    value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} />
                </div>

                <div className="col-span-2 space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase ml-2">Fotografía del Componente</label>
                  <input type="file" className="hidden" id="upload-photo" accept="image/*" onChange={(e) => setFormData({...formData, imagen: e.target.files[0]})} />
                  <label htmlFor="upload-photo" className={`w-full p-6 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${formData.imagen ? "border-violet-500 bg-violet-500/5 text-violet-500" : "border-slate-300 text-slate-400 hover:border-violet-400"}`}>
                    {formData.imagen ? <CheckCircle /> : <Upload size={24} />}
                    <span className="text-[10px] font-black uppercase tracking-widest">{formData.imagen ? formData.imagen.name : "Seleccionar Archivo"}</span>
                  </label>
                </div>
              </div>

              <button type="submit" className="w-full bg-violet-600 hover:bg-violet-500 text-white py-5 rounded-3xl font-black shadow-xl shadow-violet-600/20 active:scale-95 transition-all flex items-center justify-center gap-3 text-sm uppercase tracking-widest">
                <Save size={20} /> {editMode ? "Confirmar Cambios" : "Guardar en Base de Datos"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventarioPage;