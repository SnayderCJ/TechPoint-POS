import React, { useState, useEffect, useMemo } from 'react';
import { 
  FileText, ArrowUpRight, Activity, BarChart3, X, 
  TrendingUp, Cpu, Download, Loader2, Search, Calendar 
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const HistorialPage = ({ isDarkMode }) => {
  const [ventas, setVentas] = useState([]);
  const [config, setConfig] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedVenta, setSelectedVenta] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    // Carga de datos en paralelo desde el servidor de Milagro
    const fetchData = async () => {
      try {
        const [ventasRes, configRes] = await Promise.all([
          fetch('http://localhost:8000/api/ventas/'),
          fetch('http://localhost:8000/api/config/')
        ]);
        
        const ventasData = await ventasRes.json();
        const configData = await configRes.json();
        
        setVentas(ventasData);
        setConfig(configData);
      } catch (err) {
        console.error("Error de sincronización:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // --- BUSCADOR DINÁMICO (Filtra por ID de Factura o Nombre de Producto) ---
  const ventasFiltradas = useMemo(() => {
    return ventas.filter(venta => {
      const term = searchTerm.toLowerCase();
      const idStr = `TX-${venta.id.toString().padStart(4, '0')}`.toLowerCase();
      const productMatch = venta.items?.some(item => 
        item.nombre?.toLowerCase().includes(term)
      );
      return idStr.includes(term) || productMatch;
    });
  }, [ventas, searchTerm]);

  // --- MÉTRICAS DE RENDIMIENTO ---
  const metrics = useMemo(() => {
    const total = ventas.reduce((acc, v) => acc + parseFloat(v.total), 0);
    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayTotal = ventas
        .filter(v => v.fecha && v.fecha.startsWith(dateStr))
        .reduce((acc, v) => acc + parseFloat(v.total), 0);
      return { label: d.toLocaleDateString('es-EC', { weekday: 'short' }), total: dayTotal };
    }).reverse();
    const maxVal = Math.max(...last7Days.map(d => d.total), 100);
    return { total, last7Days, maxVal };
  }, [ventas]);

  // --- GENERADOR DE PDF DINÁMICO (Usa Viamatica e IVA configurado) ---
  const generatePDF = (venta) => {
    setIsGenerating(true);
    try {
      const doc = new jsPDF();
      const invoiceNo = `TX-${venta.id.toString().padStart(4, '0')}`;
      
      // Variables dinámicas desde Ajustes
      const nombreEmpresa = config?.nombre_negocio || "TechPoint POS";
      const ivaPorcentaje = parseFloat(config?.iva_porcentaje || 15);
      const subtotalVal = (parseFloat(venta.total) / (1 + (ivaPorcentaje / 100))).toFixed(2);
      const ivaVal = (parseFloat(venta.total) - subtotalVal).toFixed(2);

      // Identidad Corporativa
      doc.setFontSize(22);
      doc.setTextColor(124, 58, 237);
      doc.setFont(undefined, 'bold');
      doc.text(nombreEmpresa, 14, 25);
      
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.setFont(undefined, 'normal');
      doc.text("Soluciones Tecnológicas & Hardware", 14, 32);
      doc.text(`${config?.direccion || "Milagro, Ecuador"} | Auditoría: Snayder Cedeño - UNEMI`, 14, 37);

      doc.setDrawColor(200);
      doc.roundedRect(120, 15, 75, 25, 3, 3);
      doc.setTextColor(0);
      doc.text(`FACTURA NO: ${invoiceNo}`, 125, 25);
      doc.text(`Fecha: ${new Date(venta.fecha).toLocaleDateString()}`, 125, 33);

      // Tabla de ítems
      const colWidths = [20, 92, 35, 35];
      const tableRows = (venta.items || []).map(item => [
        item.cantidad,
        item.nombre || `Producto SKU-${item.id}`,
        `$${parseFloat(item.precio || 0).toFixed(2)}`,
        `$${(item.cantidad * (item.precio || 0)).toFixed(2)}`
      ]);

      autoTable(doc, {
        startY: 50,
        head: [["Cant.", "Descripción", "P. Unitario", "Subtotal"]],
        body: tableRows,
        theme: 'grid',
        headStyles: { fillColor: [124, 58, 237], halign: 'center' },
        columnStyles: {
          0: { halign: 'center', cellWidth: colWidths[0] },
          1: { cellWidth: colWidths[1] },
          2: { halign: 'right', cellWidth: colWidths[2] },
          3: { halign: 'right', cellWidth: colWidths[3] }
        }
      });

      // Tabla de Totales Alineada
      autoTable(doc, {
        startY: doc.lastAutoTable.finalY,
        body: [
          ['', '', 'SUBTOTAL:', `$${subtotalVal}`],
          ['', '', `IVA (${ivaPorcentaje}%):`, `$${ivaVal}`],
          ['', '', 'TOTAL PAGADO:', `$${parseFloat(venta.total).toFixed(2)}`]
        ],
        theme: 'plain',
        styles: { fontSize: 10, cellPadding: 2 },
        columnStyles: {
          0: { cellWidth: colWidths[0] },
          1: { cellWidth: colWidths[1] },
          2: { halign: 'right', cellWidth: colWidths[2], fontStyle: 'bold' },
          3: { halign: 'right', cellWidth: colWidths[3], fontStyle: 'bold' }
        },
        didParseCell: (data) => {
          if (data.row.index === 2) { 
            data.cell.styles.fontSize = 14;
            data.cell.styles.textColor = [0, 0, 0];
          }
        }
      });

      doc.save(`Factura_${invoiceNo}.pdf`);
    } catch (err) { console.error(err); } 
    finally { setIsGenerating(false); }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20">
      
      {/* --- KPIs --- */}
      <div className="flex flex-col xl:flex-row justify-between items-start gap-6">
        <div>
          <h2 className={`text-4xl font-black tracking-tighter flex items-center gap-4 ${isDarkMode ? "text-white" : "text-slate-900"}`}>
            <BarChart3 className="text-violet-500" size={40} />
            Auditoría de <span className="text-violet-600">Ventas</span>
          </h2>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-2 ml-1">
             {config?.nombre_negocio || "Cargando..."} • Milagro • UNEMI
          </p>
        </div>

        <div className={`px-8 py-5 rounded-[2.5rem] border flex items-center gap-6 shadow-xl ${isDarkMode ? "bg-slate-900 border-white/5" : "bg-white border-slate-200"}`}>
          <div className="p-3 rounded-2xl bg-violet-500/10 text-violet-500"><Activity size={24} /></div>
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Monto Acumulado</p>
            <p className={`text-3xl font-black ${isDarkMode ? "text-white" : "text-slate-900"}`}>
              ${metrics.total.toLocaleString('es-EC', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </div>

      {/* --- Gráfica Dinámica --- */}
      <div className={`p-8 md:p-10 rounded-[3rem] border ${isDarkMode ? "bg-slate-900/60 border-white/10" : "bg-white border-slate-200 shadow-lg"}`}>
        <div className="h-40 flex items-end justify-between gap-4">
          {metrics.last7Days.map((day, i) => (
            <div key={i} className="flex-1 flex flex-col items-center group h-full justify-end">
              <div 
                style={{ height: `${(day.total / metrics.maxVal) * 100}%`, minHeight: day.total > 0 ? '6px' : '2px' }} 
                className={`w-full max-w-[50px] rounded-t-2xl transition-all duration-700 relative shadow-lg ${day.total > 0 ? "bg-gradient-to-t from-violet-600 to-indigo-500" : "bg-slate-200/10"}`}
              />
              <span className="text-[10px] font-black text-slate-500 mt-4 uppercase">{day.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* --- Buscador SaaS --- */}
      <div className={`p-4 rounded-[2rem] border flex items-center gap-4 transition-all ${isDarkMode ? "bg-slate-900/60 border-white/5" : "bg-white border-slate-200 shadow-sm"}`}>
        <Search className="ml-4 text-slate-500" size={20} />
        <input 
          type="text"
          placeholder="Buscar por ID o componentes (Ej: Ryzen, B550)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`w-full bg-transparent border-none outline-none py-2 font-bold text-sm ${isDarkMode ? "text-white" : "text-slate-900"}`}
        />
      </div>

      {/* --- Lista de Invoices --- */}
      <div className="space-y-4 max-w-5xl">
        {loading ? <div className="p-20 text-center animate-pulse font-black uppercase text-xs tracking-widest">Sincronizando PostgreSQL...</div> : 
          ventasFiltradas.map((venta) => (
            <div key={venta.id} onClick={() => { setSelectedVenta(venta); setShowDetail(true); }} className={`group p-6 rounded-[2.5rem] border transition-all flex justify-between items-center cursor-pointer ${isDarkMode ? "bg-slate-900/60 border-white/5 hover:border-violet-500/40" : "bg-white border-slate-200 hover:border-violet-300 shadow-sm"}`}>
              <div className="flex items-center gap-6">
                <div className={`p-4 rounded-2xl ${isDarkMode ? "bg-slate-950" : "bg-slate-50"}`}>
                  <FileText size={24} className="text-slate-400 group-hover:text-violet-500" />
                </div>
                <div>
                  <p className={`text-xl font-black ${isDarkMode ? "text-white" : "text-slate-800"}`}>Factura #TX-{venta.id.toString().padStart(4, '0')}</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase">{new Date(venta.fecha).toLocaleDateString()} • {venta.items?.length || 0} Ítems</p>
                </div>
              </div>
              <div className="text-right flex items-center gap-8">
                <div><p className={`text-3xl font-black ${isDarkMode ? "text-white" : "text-slate-900"}`}>${parseFloat(venta.total).toFixed(2)}</p></div>
                <ArrowUpRight size={22} className="text-slate-300" />
              </div>
            </div>
          ))
        }
      </div>

      {/* --- Modal Estilo Factura Real --- */}
      {showDetail && selectedVenta && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-6">
          <div className={`w-full max-w-2xl rounded-[3rem] p-10 border shadow-2xl animate-in zoom-in-95 duration-300 ${isDarkMode ? "bg-slate-900 border-white/10" : "bg-white border-slate-200"}`}>
            <div className="flex justify-between items-start mb-8 border-b border-dashed border-slate-700 pb-6">
              <div>
                <h3 className="text-3xl font-black uppercase tracking-tighter">{config?.nombre_negocio || "Comprobante"}</h3>
                <p className="text-violet-500 font-bold uppercase text-xs">TX-{selectedVenta.id.toString().padStart(4, '0')}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => generatePDF(selectedVenta)} disabled={isGenerating} className="bg-violet-600 text-white px-5 py-3 rounded-2xl font-black text-[10px] uppercase flex items-center gap-2 active:scale-95 transition-all">
                  {isGenerating ? <Loader2 className="animate-spin" size={14} /> : <Download size={14} />} PDF
                </button>
                <button onClick={() => setShowDetail(false)} className="text-slate-400 hover:text-red-500"><X size={28} /></button>
              </div>
            </div>

            <div className="mb-8">
              <div className={`grid grid-cols-4 gap-4 p-3 mb-2 rounded-xl text-[9px] font-black uppercase ${isDarkMode ? "bg-white/5 text-slate-400" : "bg-slate-50 text-slate-500"}`}>
                <div className="col-span-2">Descripción</div>
                <div className="text-center">Cant.</div>
                <div className="text-right">Total</div>
              </div>
              <div className="space-y-2 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                {selectedVenta.items?.map((item, idx) => (
                  <div key={idx} className={`grid grid-cols-4 gap-4 p-4 rounded-2xl border ${isDarkMode ? "border-white/5 bg-slate-950/30" : "border-slate-100 bg-white"}`}>
                    <div className="col-span-2 font-bold text-xs">{item.nombre || `Producto ${item.id}`}</div>
                    <div className="text-center font-black text-violet-500">x{item.cantidad}</div>
                    <div className="text-right font-black">${(item.cantidad * (item.precio || 0)).toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-dashed border-slate-700 flex flex-col items-end">
              <div className="w-full max-w-[200px] flex justify-between text-[10px] font-bold text-slate-500 uppercase mb-1">
                <span>Subtotal:</span>
                <span>${(parseFloat(selectedVenta.total) / (1 + (parseFloat(config?.iva_porcentaje || 15) / 100))).toFixed(2)}</span>
              </div>
              <div className="w-full max-w-[200px] flex justify-between text-[10px] font-bold text-violet-500 uppercase mb-4">
                <span>IVA ({config?.iva_porcentaje || 15}%):</span>
                <span>${(parseFloat(selectedVenta.total) - (parseFloat(selectedVenta.total) / (1 + (parseFloat(config?.iva_porcentaje || 15) / 100)))).toFixed(2)}</span>
              </div>
              <p className="text-6xl font-black tracking-tighter">${parseFloat(selectedVenta.total).toFixed(2)}</p>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { 
          background-color: ${isDarkMode ? "#1e1b4b" : "#cbd5e1"}; 
          border-radius: 10px; 
        }
      `}</style>
    </div>
  );
};

export default HistorialPage;