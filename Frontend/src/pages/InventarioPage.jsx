import React, { useState, useEffect } from 'react';
import { Package, Plus, Edit, Trash2, TrendingUp, ImageOff, Cpu, Layers } from 'lucide-react';

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

  const getImagenUrl = (ruta) => {
    if (!ruta) return null;
    if (ruta.startsWith('http')) return ruta;
    return `http://localhost:8000${ruta}`;
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
      
      {/* ---- Header de Gestión ---- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-5xl font-black text-white tracking-tighter flex items-center gap-4">
            <div className="bg-violet-500/20 p-3 rounded-2xl border border-violet-500/30">
              <Package className="text-violet-400" size={38} />
            </div>
            Gestión de <span className="text-violet-500">Stock</span>
          </h2>
          <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-xs mt-3 ml-1">
            Control de Activos de Hardware • Milagro, Ecuador
          </p>
        </div>

        <div className="flex gap-4 w-full md:w-auto">
          {/* Card de Stats Rápido */}
          <div className="bg-slate-900/40 backdrop-blur-xl px-6 py-4 rounded-[2rem] border border-white/5 flex items-center gap-4 shadow-2xl">
            <div className="bg-violet-500/10 p-2.5 rounded-xl text-violet-400 border border-violet-500/20">
              <Layers size={22} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Total Unidades</p>
              <p className="text-2xl font-black text-white tracking-tighter">
                {productos.reduce((acc, p) => acc + p.stock, 0)}
              </p>
            </div>
          </div>

          <button className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white px-8 py-4 rounded-[2rem] font-black flex items-center gap-3 transition-all shadow-[0_15px_30px_rgba(124,58,237,0.3)] active:scale-95 text-sm uppercase tracking-widest">
            <Plus size={20} /> Nuevo Item
          </button>
        </div>
      </div>

      {/* ---- Tabla Estilo Command Center ---- */}
      <div className="bg-slate-950/30 backdrop-blur-2xl rounded-[3rem] border border-white/5 shadow-2xl overflow-hidden relative">
        {/* Efecto de brillo superior en la tabla */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-violet-500/50 to-transparent"></div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/5">
                <th className="px-10 py-6 text-[11px] font-black text-slate-500 uppercase tracking-[0.3em]">Componente</th>
                <th className="px-8 py-6 text-[11px] font-black text-slate-500 uppercase tracking-[0.3em]">Categoría</th>
                <th className="px-8 py-6 text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] text-center">Existencias</th>
                <th className="px-8 py-6 text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] text-right">Valor Unitario</th>
                <th className="px-10 py-6 text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {productos.map((prod) => (
                <tr key={prod.id} className="hover:bg-violet-500/[0.03] transition-colors group">
                  <td className="px-10 py-6 font-bold text-white">
                    <div className="flex items-center gap-5">
                      {/* Contenedor de miniatura con Neón */}
                      <div className="w-16 h-16 bg-slate-900 rounded-3xl p-1.5 border border-white/5 flex items-center justify-center overflow-hidden group-hover:border-violet-500/50 transition-all group-hover:shadow-[0_0_20px_rgba(139,92,246,0.1)]">
                        {prod.imagen ? (
                          <img 
                            src={getImagenUrl(prod.imagen)} 
                            className="w-full h-full object-contain p-1" 
                            alt={prod.nombre} 
                          />
                        ) : (
                          <ImageOff className="text-slate-800" size={24} />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-base tracking-tight">{prod.nombre}</span>
                        <span className="text-[10px] text-slate-500 font-black uppercase mt-1 tracking-widest">ID: #{prod.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="bg-violet-500/10 text-violet-400 border border-violet-500/20 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                      {prod.categoria}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <div className={`inline-block px-5 py-2 rounded-2xl font-black text-sm tracking-tighter ${
                      prod.stock < 3 
                      ? 'bg-red-500/10 text-red-400 border border-red-500/20 animate-pulse' 
                      : 'bg-slate-800/50 text-white border border-white/10'
                    }`}>
                      {prod.stock} PCS
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex flex-col items-end">
                      <span className="text-xl font-black text-white tracking-tighter">${parseFloat(prod.precio).toFixed(2)}</span>
                      <span className="text-[9px] text-slate-600 font-bold uppercase tracking-tighter">Liquidación Bruta</span>
                    </div>
                  </td>
                  <td className="px-10 py-6 text-center">
                    <div className="flex justify-center gap-3">
                      <button className="p-3 bg-white/5 text-slate-400 hover:text-violet-400 hover:bg-violet-400/10 rounded-2xl border border-transparent hover:border-violet-500/30 transition-all">
                        <Edit size={18} />
                      </button>
                      <button className="p-3 bg-white/5 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-2xl border border-transparent hover:border-red-500/30 transition-all">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- Footer de Auditoría --- */}
      <div className="bg-violet-600/5 p-6 rounded-[2rem] border border-violet-500/10 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <Cpu className="text-violet-500" size={20} />
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Sincronizado con PostgreSQL • Servidor Milagro
          </p>
        </div>
        <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest">
          Ultima actualización: {new Date().toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
};

export default InventarioPage;