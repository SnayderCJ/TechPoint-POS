import React, { useState, useEffect } from 'react';
import { Package, Plus, Edit, Trash2, TrendingUp, ImageOff, Cpu, Layers, Box } from 'lucide-react';

const InventarioPage = ({ isDarkMode }) => {
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

  const getImagenUrl = (ruta) => {
    if (!ruta) return null;
    if (ruta.startsWith('http')) return ruta;
    return `http://localhost:8000${ruta}`;
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      
      {/* ---- Header de Gestión SaaS ---- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className={`text-4xl font-black tracking-tighter flex items-center gap-4 ${
            isDarkMode ? "text-white" : "text-slate-900"
          }`}>
            <div className={`p-3 rounded-2xl border ${
              isDarkMode ? "bg-violet-500/10 border-violet-500/20" : "bg-violet-50 border-violet-100"
            }`}>
              <Package className="text-violet-500" size={32} />
            </div>
            Gestión de <span className="text-violet-600">Stock</span>
          </h2>
          <p className="text-slate-500 font-semibold uppercase tracking-widest text-[10px] mt-3 ml-1">
            Control de Activos de Hardware • Milagro, Ecuador
          </p>
        </div>

        <div className="flex gap-4 w-full md:w-auto">
          {/* Card de Stats Minimalista */}
          <div className={`px-6 py-4 rounded-3xl border flex items-center gap-4 transition-all ${
            isDarkMode 
              ? "bg-slate-900 border-white/5 shadow-xl shadow-black/20" 
              : "bg-white border-slate-200 shadow-sm"
          }`}>
            <div className={`p-2 rounded-xl ${
              isDarkMode ? "bg-violet-500/10 text-violet-400" : "bg-violet-50 text-violet-600"
            }`}>
              <Layers size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter leading-none mb-1">Items Totales</p>
              <p className={`text-2xl font-black tracking-tighter ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                {productos.reduce((acc, p) => acc + p.stock, 0)}
              </p>
            </div>
          </div>

          <button className="bg-violet-600 hover:bg-violet-500 text-white px-8 py-4 rounded-3xl font-bold flex items-center gap-3 transition-all shadow-lg shadow-violet-600/20 active:scale-95 text-xs uppercase tracking-widest">
            <Plus size={18} /> Nuevo Item
          </button>
        </div>
      </div>

      {/* ---- Tabla Estilo Corporativo ---- */}
      <div className={`rounded-[2.5rem] border transition-all overflow-hidden relative ${
        isDarkMode 
          ? "bg-slate-900/60 backdrop-blur-xl border-white/10 shadow-2xl" 
          : "bg-white border-slate-200 shadow-md shadow-slate-200/50"
      }`}>
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`border-b ${isDarkMode ? "bg-white/5 border-white/5" : "bg-slate-50 border-slate-100"}`}>
                <th className="px-10 py-6 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Componente</th>
                <th className="px-8 py-6 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Categoría</th>
                <th className="px-8 py-6 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-center">Stock</th>
                <th className="px-8 py-6 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-right">Precio</th>
                <th className="px-10 py-6 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDarkMode ? "divide-white/5" : "divide-slate-100"}`}>
              {productos.map((prod) => (
                <tr key={prod.id} className={`transition-colors ${
                  isDarkMode ? "hover:bg-white/[0.02]" : "hover:bg-slate-50/50"
                }`}>
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-5">
                      <div className={`w-14 h-14 rounded-2xl p-1.5 border flex items-center justify-center overflow-hidden transition-all ${
                        isDarkMode ? "bg-slate-950 border-white/5" : "bg-white border-slate-200"
                      }`}>
                        {prod.imagen ? (
                          <img 
                            src={getImagenUrl(prod.imagen)} 
                            className="w-full h-full object-contain" 
                            alt={prod.nombre} 
                          />
                        ) : (
                          <ImageOff className="text-slate-300" size={20} />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className={`text-sm font-bold tracking-tight ${isDarkMode ? "text-white" : "text-slate-800"}`}>
                          {prod.nombre}
                        </span>
                        <span className="text-[10px] text-slate-500 font-bold uppercase mt-0.5">ID: #{prod.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                      isDarkMode 
                        ? "bg-violet-500/10 text-violet-400 border-violet-500/20" 
                        : "bg-violet-50 text-violet-600 border-violet-100"
                    }`}>
                      {prod.categoria}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <div className={`inline-block px-4 py-1.5 rounded-xl font-black text-xs ${
                      prod.stock < 3 
                        ? "bg-red-500/10 text-red-500 border border-red-500/20" 
                        : (isDarkMode ? "bg-slate-800 text-slate-200" : "bg-slate-100 text-slate-700")
                    }`}>
                      {prod.stock} UNID
                    </div>
                  </td>
                  <td className={`px-8 py-6 text-right font-black text-lg tracking-tighter ${
                    isDarkMode ? "text-white" : "text-slate-900"
                  }`}>
                    ${parseFloat(prod.precio).toFixed(2)}
                  </td>
                  <td className="px-10 py-6 text-center">
                    <div className="flex justify-center gap-2">
                      <button className={`p-2.5 rounded-xl border transition-all ${
                        isDarkMode 
                          ? "bg-white/5 text-slate-400 border-transparent hover:text-violet-400 hover:border-violet-500/30" 
                          : "bg-slate-50 text-slate-400 border-slate-100 hover:text-violet-600 hover:border-violet-200"
                      }`}>
                        <Edit size={16} />
                      </button>
                      <button className={`p-2.5 rounded-xl border transition-all ${
                        isDarkMode 
                          ? "bg-white/5 text-slate-400 border-transparent hover:text-red-400 hover:border-red-500/30" 
                          : "bg-slate-50 text-slate-400 border-slate-100 hover:text-red-600 hover:border-red-200"
                      }`}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- Footer de Sistema Profesional --- */}
      <div className={`p-6 rounded-[2rem] border flex flex-col md:flex-row justify-between items-center gap-4 transition-all ${
        isDarkMode ? "bg-violet-600/5 border-violet-500/10" : "bg-slate-100/50 border-slate-200"
      }`}>
        <div className="flex items-center gap-3">
          <Box className="text-violet-500" size={18} />
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
            Sincronización de Inventario • PostgreSQL 15 • TechPoint Milagro
          </p>
        </div>
        <p className="text-[10px] text-slate-400 font-bold uppercase">
          Estado: Operativo
        </p>
      </div>
    </div>
  );
};

export default InventarioPage;