import React, { useState, useEffect } from 'react';
import { Package, Plus, Edit, Trash2, TrendingUp, ImageOff } from 'lucide-react';

const InventarioPage = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8000/api/productos/')
      .then(res => res.json())
      .then(data => {
        setProductos(data);
        setLoading(false);
      })
      .catch(err => console.error("Error al cargar inventario:", err));
  }, []);

  // Función para procesar la URL de la imagen (Igual que en el POS)
  const getImagenUrl = (ruta) => {
    if (!ruta) return null;
    if (ruta.startsWith('http')) return ruta;
    return `http://localhost:8000${ruta}`;
  };

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-4xl font-black text-slate-800 flex items-center gap-3">
            <Package className="text-emerald-500" size={36} /> Gestión de Stock
          </h2>
          <p className="text-slate-400 font-medium mt-1">Control de hardware - Milagro, Ecuador</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-white px-6 py-3 rounded-3xl border border-slate-100 flex items-center gap-3 shadow-sm">
            <div className="bg-emerald-100 p-2 rounded-xl text-emerald-600"><TrendingUp size={20} /></div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter leading-none">Total Productos</p>
              <p className="text-xl font-black text-slate-700">{productos.length}</p>
            </div>
          </div>
          <button className="bg-slate-900 hover:bg-emerald-600 text-white px-8 py-3 rounded-3xl font-black flex items-center gap-2 transition-all shadow-xl shadow-slate-900/10">
            <Plus size={20} /> NUEVO ITEM
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Hardware</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Categoría</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Stock</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Precio</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {productos.map((prod) => (
              <tr key={prod.id} className="hover:bg-slate-50/40 transition-colors group">
                <td className="px-8 py-6 font-bold text-slate-700">
                  <div className="flex items-center gap-4">
                    {/* --- CORRECCIÓN DE IMAGEN AQUÍ --- */}
                    <div className="w-14 h-14 bg-white rounded-2xl p-1 border border-slate-100 flex items-center justify-center overflow-hidden group-hover:shadow-md transition-all">
                      {prod.imagen ? (
                        <img 
                          src={getImagenUrl(prod.imagen)} 
                          className="w-full h-full object-contain" 
                          alt={prod.nombre} 
                        />
                      ) : (
                        <ImageOff className="text-slate-200" size={24} />
                      )}
                    </div>
                    <span>{prod.nombre}</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className="bg-slate-100 text-slate-500 px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-wider">{prod.categoria}</span>
                </td>
                <td className="px-8 py-6 text-center">
                  <div className={`inline-block px-4 py-1 rounded-2xl font-black text-sm ${prod.stock < 3 ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-600'}`}>
                    {prod.stock}
                  </div>
                </td>
                <td className="px-8 py-6 text-right font-black text-slate-800 text-lg">${parseFloat(prod.precio).toFixed(2)}</td>
                <td className="px-8 py-6">
                  <div className="flex justify-center gap-3">
                    <button className="p-2.5 text-slate-300 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl transition-all"><Edit size={18} /></button>
                    <button className="p-2.5 text-slate-300 hover:bg-red-50 hover:text-red-500 rounded-xl transition-all"><Trash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventarioPage;