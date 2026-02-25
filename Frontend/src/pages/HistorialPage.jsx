import React, { useState, useEffect } from 'react';
import { History, FileText, Calendar, DollarSign } from 'lucide-react';

const HistorialPage = () => {
  const [ventas, setVentas] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/ventas/')
      .then(res => res.json())
      .then(data => setVentas(data));
  }, []);

  return (
    <div className="p-8 space-y-8">
      <div>
        <h2 className="text-4xl font-black text-slate-800 flex items-center gap-3">
          <History className="text-emerald-500" size={36} /> Historial de Operaciones
        </h2>
        <p className="text-slate-400 font-medium mt-1">Consulta y audita las ventas procesadas por el sistema</p>
      </div>

      <div className="grid gap-4 max-w-4xl">
        {ventas.length === 0 ? (
          <div className="bg-white p-20 rounded-[3rem] text-center border border-dashed border-slate-200">
             <span className="text-6xl opacity-10">📑</span>
             <p className="text-slate-300 font-bold mt-4">Aún no se han registrado ventas</p>
          </div>
        ) : (
          ventas.map((venta) => (
            <div key={venta.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 flex items-center justify-between hover:border-emerald-200 transition-all group">
              <div className="flex items-center gap-6">
                <div className="bg-slate-50 p-4 rounded-3xl text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-colors">
                  <FileText size={24} />
                </div>
                <div className="space-y-1">
                  <p className="text-lg font-black text-slate-800 tracking-tight leading-none">Factura #00{venta.id}</p>
                  <div className="flex gap-4 text-xs font-bold text-slate-400 uppercase tracking-tighter">
                    <span className="flex items-center gap-1"><Calendar size={12}/> {new Date(venta.fecha).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>15% IVA Incluido</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center justify-end gap-1 text-emerald-600">
                   <DollarSign size={20}/>
                   <span className="text-3xl font-black tracking-tighter">{parseFloat(venta.total).toFixed(2)}</span>
                </div>
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mr-1">Liquidado</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HistorialPage;