import { useState, useEffect } from 'react';
import { UserPlus, Users, Search, Trash2, Edit3, CheckCircle, AlertCircle, CreditCard, X, Receipt, ArrowRight, DollarSign, Printer, Download } from 'lucide-react';

function ClientesPage({ isDarkMode, showToast, authFetch }) {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [editandoId, setEditandoId] = useState(null);
  
  const [clienteSeleccionadoCuentas, setClienteSeleccionadoCuentas] = useState(null);
  const [ventasPendientes, setVentasPendientes] = useState([]);
  const [movimientos, setMovimientos] = useState([]);
  const [infoFinanciera, setInfoFinanciera] = useState(null);
  const [montoAbono, setMontoAbono] = useState("");

  const [confirmDelete, setConfirmDelete] = useState(null); 

  const [formData, setFormData] = useState({
    identificacion: '',
    nombre: '',
    correo: '',
    telefono: '',
    direccion: '',
    cupo_credito: '0.00'
  });

  const [error, setError] = useState("");

  const fetchClientes = async () => {
    try {
      const response = await authFetch('http://localhost:8000/api/clientes/');
      const data = await response.json();
      setClientes(Array.isArray(data) ? data : []);
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

  const fetchEstadoCuenta = async (cliente) => {
    try {
      const resVentas = await authFetch('http://localhost:8000/api/ventas/');
      const dataVentas = await resVentas.json();
      const pendientes = dataVentas.filter(v => v.cliente === cliente.id && parseFloat(v.saldo_pendiente) > 0);
      setVentasPendientes(pendientes);

      const resMovimientos = await authFetch(`http://localhost:8000/api/clientes/${cliente.id}/estado_cuenta/`);
      const dataMovimientos = await resMovimientos.json();
      setMovimientos(dataMovimientos.movimientos);
      setInfoFinanciera(dataMovimientos);
      
      setClienteSeleccionadoCuentas(cliente);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchClientes(); }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const seleccionarCliente = (cliente) => {
    setEditandoId(cliente.id);
    setFormData({
      identificacion: cliente.identificacion,
      nombre: cliente.nombre,
      correo: cliente.correo || '',
      telefono: cliente.telefono || '',
      direccion: cliente.direccion || '',
      cupo_credito: cliente.cupo_credito
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelarEdicion = () => {
    setEditandoId(null);
    setFormData({ identificacion: '', nombre: '', correo: '', telefono: '', direccion: '', cupo_credito: '0.00' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const url = editandoId ? `http://localhost:8000/api/clientes/${editandoId}/` : 'http://localhost:8000/api/clientes/';
    const method = editandoId ? 'PUT' : 'POST';

    try {
      const response = await authFetch(url, {
        method: method,
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        showToast(editandoId ? "Cliente actualizado" : "Cliente registrado");
        cancelarEdicion();
        fetchClientes();
      } else {
        const data = await response.json();
        showToast(data.identificacion ? `Error: ${data.identificacion[0]}` : "Error al procesar", "error");
      }
    } catch (err) { showToast("Error de conexión", "error"); }
  };

  const registrarAbono = async (ventaId) => {
    if (!montoAbono || parseFloat(montoAbono) <= 0) return showToast("Ingrese un monto válido", "error");
    try {
      const response = await authFetch('http://localhost:8000/api/abonos/', {
        method: 'POST',
        body: JSON.stringify({ venta: ventaId, monto: montoAbono, metodo_pago: 'EFECTIVO' })
      });
      if (response.ok) {
        setMontoAbono("");
        showToast("✅ Abono registrado correctamente");
        fetchEstadoCuenta(clienteSeleccionadoCuentas);
        fetchClientes();
      }
    } catch (err) { showToast("Error al registrar abono", "error"); }
  };

  const eliminarCliente = async (id) => {
    try {
      const response = await authFetch(`http://localhost:8000/api/clientes/${id}/`, { method: 'DELETE' });
      if (response.ok) {
        showToast("Cliente eliminado");
        if (editandoId === id) cancelarEdicion();
        fetchClientes();
      } else {
        showToast("No se pudo eliminar el cliente", "error");
      }
    } catch (err) { showToast("Error de conexión", "error"); }
    setConfirmDelete(null);
  };

  const clientesFiltrados = clientes.filter(c => 
    c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    c.identificacion.includes(busqueda)
  );

  return (
    <div className="flex flex-col space-y-6 md:space-y-10 animate-in fade-in duration-700 pb-20 px-2 md:px-0">
      
      {/* HEADER ADAPTABLE */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className={`text-3xl md:text-4xl font-black tracking-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}>
            Gestión de <span className="text-violet-600">Clientes</span>
          </h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[9px] md:text-[10px] mt-1 md:mt-2">
            Base de Datos CRM • Milagro • UNEMI
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-10">
        
        {/* FORMULARIO RESPONSIVO */}
        <div className={`xl:col-span-1 p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border h-fit sticky top-8 print:hidden ${
          isDarkMode ? "bg-slate-900/50 border-white/10 shadow-2xl" : "bg-white border-slate-200 shadow-xl"
        }`}>
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <h2 className={`text-lg md:text-xl font-black flex items-center gap-3 ${isDarkMode ? "text-white" : "text-slate-800"}`}>
              {editandoId ? <Edit3 className="text-amber-500" /> : <UserPlus className="text-violet-500" />}
              {editandoId ? "Editar Cliente" : "Nuevo Registro"}
            </h2>
            {editandoId && <button onClick={cancelarEdicion} className="text-slate-400 hover:text-red-500"><X size={20}/></button>}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
            <div>
              <label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Cédula o RUC</label>
              <input name="identificacion" value={formData.identificacion} onChange={handleInputChange} required className={`w-full px-4 md:px-5 py-3 md:py-4 rounded-xl md:rounded-2xl border outline-none font-bold text-sm transition-all ${isDarkMode ? "bg-slate-950 border-white/10 text-white focus:border-violet-500" : "bg-slate-50 border-slate-200 focus:border-violet-500"}`}/>
            </div>
            <div>
              <label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Nombre Completo</label>
              <input name="nombre" value={formData.nombre} onChange={handleInputChange} required className={`w-full px-4 md:px-5 py-3 md:py-4 rounded-xl md:rounded-2xl border outline-none font-bold text-sm ${isDarkMode ? "bg-slate-950 border-white/10 text-white focus:border-violet-500" : "bg-slate-50 border-slate-200"}`}/>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-violet-500 mb-2 block text-violet-500">Cupo Crédito ($)</label>
                <input name="cupo_credito" type="number" step="0.01" value={formData.cupo_credito} onChange={handleInputChange} className={`w-full px-4 md:px-5 py-3 md:py-4 rounded-xl md:rounded-2xl border outline-none font-black text-sm ${isDarkMode ? "bg-slate-950 border-violet-500/30 text-white" : "bg-violet-50 border-violet-200 text-violet-700"}`}/>
              </div>
              <div>
                <label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Teléfono</label>
                <input name="telefono" value={formData.telefono} onChange={handleInputChange} className={`w-full px-4 md:px-5 py-3 md:py-4 rounded-xl md:rounded-2xl border outline-none font-bold text-sm ${isDarkMode ? "bg-slate-950 border-white/10 text-white" : "bg-slate-50 border-slate-200"}`}/>
              </div>
            </div>
            <div>
              <label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Dirección</label>
              <input name="direccion" value={formData.direccion} onChange={handleInputChange} className={`w-full px-4 md:px-5 py-3 md:py-4 rounded-xl md:rounded-2xl border outline-none font-bold text-sm ${isDarkMode ? "bg-slate-950 border-white/10 text-white" : "bg-slate-50 border-slate-200"}`}/>
            </div>
            <button type="submit" className={`w-full py-4 md:py-5 rounded-2xl md:rounded-[1.8rem] font-black text-xs md:text-sm uppercase tracking-widest transition-all active:scale-95 shadow-lg ${editandoId ? "bg-amber-500 text-white shadow-amber-500/30" : "bg-violet-600 text-white shadow-violet-600/30"}`}>{editandoId ? "Guardar Cambios" : "Registrar Cliente"}</button>
          </form>
        </div>

        {/* LISTADO Y ESTADO DE CUENTA ADAPTABLE */}
        <div className="xl:col-span-2 space-y-6 md:space-y-8">
          
          <div className={`p-4 md:p-6 rounded-2xl md:rounded-3xl border flex items-center gap-4 transition-all print:hidden ${isDarkMode ? "bg-slate-900/40 border-white/5" : "bg-white border-slate-200 shadow-sm"}`}>
            <Search className="text-slate-400" size={20} />
            <input type="text" placeholder="Buscar cliente..." className={`w-full bg-transparent outline-none font-bold text-sm ${isDarkMode ? "text-white" : "text-slate-900"}`} value={busqueda} onChange={(e) => setBusqueda(e.target.value)}/>
          </div>

          {clienteSeleccionadoCuentas && (
            <div className={`p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] border space-y-6 md:space-y-8 animate-in zoom-in duration-300 ${isDarkMode ? "bg-slate-900 border-white/10 shadow-2xl" : "bg-white border-slate-200 shadow-xl"}`}>
              <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b pb-6 md:pb-8 border-slate-200 dark:border-white/5">
                <div className="space-y-1 md:space-y-2">
                  <h3 className="text-2xl md:text-3xl font-black flex items-center gap-3 md:gap-4">
                    <Receipt className="text-violet-600" size={28} md:size={32} /> ESTADO DE CUENTA
                  </h3>
                  <p className="text-slate-500 font-bold uppercase tracking-widest text-[9px] md:text-xs">Milagro, Ecuador • TechPoint POS</p>
                </div>
                <div className="flex gap-3 print:hidden w-full sm:w-auto">
                  <button onClick={() => window.print()} className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-slate-900 text-white px-4 md:px-6 py-2.5 md:py-3 rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest hover:bg-slate-800 shadow-lg"><Printer size={16}/> Imprimir</button>
                  <button onClick={() => setClienteSeleccionadoCuentas(null)} className="p-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-slate-400 hover:text-red-500"><X size={20}/></button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
                <div className={`p-4 md:p-6 rounded-2xl md:rounded-3xl border ${isDarkMode ? "bg-slate-950/50 border-white/5" : "bg-slate-50 border-slate-100"}`}>
                  <p className="text-[9px] md:text-[10px] font-black uppercase text-slate-500 mb-1 md:mb-2">Cliente</p>
                  <p className={`text-md md:text-lg font-black truncate ${isDarkMode ? "text-white" : "text-slate-900"}`}>{infoFinanciera?.cliente}</p>
                  <p className="text-[10px] font-bold text-slate-400">ID: {infoFinanciera?.identificacion}</p>
                </div>
                <div className={`p-4 md:p-6 rounded-2xl md:rounded-3xl border ${isDarkMode ? "bg-violet-950/20 border-violet-500/20" : "bg-violet-50 border-violet-200 text-violet-700"}`}>
                  <p className="text-[9px] md:text-[10px] font-black uppercase text-violet-500 mb-1 md:mb-2">Deuda Actual</p>
                  <p className="text-2xl md:text-3xl font-black">${parseFloat(infoFinanciera?.deuda_total || 0).toFixed(2)}</p>
                </div>
                <div className={`p-4 md:p-6 rounded-2xl md:rounded-3xl border ${isDarkMode ? "bg-slate-950/50 border-white/5" : "bg-slate-50 border-slate-100"}`}>
                  <p className="text-[9px] md:text-[10px] font-black uppercase text-slate-500 mb-1 md:mb-2">Cupo Disponible</p>
                  <p className={`text-md md:text-lg font-black ${isDarkMode ? "text-white" : "text-slate-900"}`}>${parseFloat(infoFinanciera?.cupo_disponible || 0).toFixed(2)}</p>
                </div>
              </div>

              <div className="print:hidden space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
                  <DollarSign size={14} className="text-green-500"/> Registrar Abono
                </h4>
                {ventasPendientes.length === 0 ? (
                  <p className="text-center py-6 text-slate-400 font-bold italic text-sm">No hay facturas para abonar.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {ventasPendientes.map(v => (
                      <div key={v.id} className="flex flex-col justify-between p-4 md:p-5 rounded-2xl md:rounded-3xl border border-slate-100 bg-slate-50/50 dark:bg-slate-950/30 dark:border-white/5 gap-4">
                        <div>
                          <p className="text-[9px] md:text-[10px] font-black uppercase text-slate-400 tracking-widest">Factura #{v.id}</p>
                          <p className={`text-lg font-black ${isDarkMode ? "text-white" : "text-slate-800"}`}>Saldo: ${parseFloat(v.saldo_pendiente).toFixed(2)}</p>
                        </div>
                        <div className="flex gap-2">
                          <input 
                            type="number" placeholder="Monto" className={`flex-1 min-w-0 px-4 py-2 rounded-xl border outline-none font-bold text-sm ${isDarkMode ? "bg-slate-900 border-white/10 text-white" : "bg-white border-slate-200"}`}
                            onChange={(e) => setMontoAbono(e.target.value)}
                          />
                          <button onClick={() => registrarAbono(v.id)} className="bg-green-600 text-white px-4 md:px-5 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-green-500">Abonar</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-4 md:space-y-6">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Historial de Movimientos</h4>
                <div className="space-y-2 md:space-y-3">
                  {movimientos.map((m, idx) => (
                    <div key={idx} className={`p-3 md:p-4 rounded-xl md:rounded-2xl flex justify-between items-center border ${
                      m.tipo === 'CONSUMO' 
                      ? (isDarkMode ? "bg-red-500/5 border-red-500/10" : "bg-red-50/30 border-red-100") 
                      : (isDarkMode ? "bg-green-500/5 border-green-500/10" : "bg-green-50/30 border-green-100")
                    }`}>
                      <div className="overflow-hidden">
                        <p className={`font-black text-xs md:text-sm uppercase tracking-tight truncate ${isDarkMode ? "text-white" : "text-slate-800"}`}>{m.descripcion}</p>
                        <p className="text-[8px] md:text-[9px] font-bold text-slate-500 uppercase">{new Date(m.fecha).toLocaleString()}</p>
                      </div>
                      <p className={`text-md md:text-lg font-black shrink-0 ml-4 ${m.tipo === 'CONSUMO' ? "text-red-500" : "text-green-600"}`}>
                        {m.tipo === 'CONSUMO' ? '-' : '+'} ${parseFloat(m.monto).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 print:hidden ${clienteSeleccionadoCuentas ? "opacity-30 pointer-events-none" : ""}`}>
            {loading ? (
              <div className="col-span-full p-20 text-center animate-pulse font-black text-xs uppercase">Consultando Servidor...</div>
            ) : clientesFiltrados.length === 0 ? (
              <div className="col-span-full p-20 text-center opacity-20 font-black text-xs uppercase italic">No hay clientes registrados</div>
            ) : (
              clientesFiltrados.map(cliente => (
                <div key={cliente.id} className={`p-5 md:p-6 rounded-[1.8rem] md:rounded-[2rem] border transition-all duration-300 flex flex-col justify-between gap-6 ${isDarkMode ? "bg-slate-900/60 border-white/5 hover:border-violet-500/40" : "bg-white border-slate-100 hover:border-violet-400 shadow-sm"}`}>
                  <div className="flex items-center gap-4 md:gap-6">
                    <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0 ${isDarkMode ? "bg-slate-950 text-violet-400" : "bg-violet-50 text-violet-600"}`}><Users size={24} /></div>
                    <div className="overflow-hidden">
                      <h3 className={`font-black text-md md:text-lg truncate ${isDarkMode ? "text-white" : "text-slate-800"}`}>{cliente.nombre}</h3>
                      <div className="flex flex-wrap gap-2 mt-1">
                        <span className="text-[8px] md:text-[9px] font-black uppercase text-slate-500 bg-slate-500/10 px-2 py-0.5 rounded-md">ID: {cliente.identificacion}</span>
                        <span className="text-[8px] md:text-[9px] font-black uppercase text-violet-500 bg-violet-500/10 px-2 py-0.5 rounded-md">Cupo: ${parseFloat(cliente.cupo_credito).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 md:gap-3">
                    <button onClick={() => fetchEstadoCuenta(cliente)} title="Ver Estado" className={`flex-1 p-3 md:p-4 rounded-xl md:rounded-2xl transition-all flex items-center justify-center ${isDarkMode ? "bg-violet-500/10 text-violet-400 hover:bg-violet-500/20" : "bg-violet-50 text-violet-600 hover:bg-violet-100"}`}><Receipt size={18}/></button>
                    <button onClick={() => seleccionarCliente(cliente)} title="Editar" className={`flex-1 p-3 md:p-4 rounded-xl md:rounded-2xl transition-all flex items-center justify-center ${isDarkMode ? "bg-white/5 text-amber-500 hover:bg-amber-500/20" : "bg-amber-50 text-amber-600 hover:bg-amber-100"}`}><Edit3 size={18}/></button>
                    <button onClick={() => setConfirmDelete(cliente)} title="Eliminar" className={`flex-1 p-3 md:p-4 rounded-xl md:rounded-2xl transition-all flex items-center justify-center ${isDarkMode ? "bg-white/5 text-red-500 hover:bg-red-500/20" : "bg-red-50 text-red-600 hover:bg-red-100"}`}><Trash2 size={18}/></button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* MODAL RESPONSIVO */}
      {confirmDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 backdrop-blur-xl p-4 md:p-6">
          <div className={`w-full max-w-sm rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-10 border text-center animate-in zoom-in duration-300 ${isDarkMode ? "bg-slate-900 border-white/10 shadow-2xl shadow-black" : "bg-white border-slate-200 shadow-2xl"}`}>
            <div className="w-16 h-16 md:w-20 md:h-20 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trash2 size={32} md:size={40} />
            </div>
            <h3 className={`text-xl md:text-2xl font-black mb-2 ${isDarkMode ? "text-white" : "text-slate-900"}`}>¿Estás seguro?</h3>
            <p className="text-slate-500 text-xs md:text-sm font-bold uppercase tracking-widest mb-8 text-balance leading-relaxed">
              Eliminarás a <b>{confirmDelete.nombre}</b>. Esta acción es irreversible.
            </p>
            <div className="flex gap-3 md:gap-4">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 bg-slate-800 text-white py-3 md:py-4 rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest">Cancelar</button>
              <button onClick={() => eliminarCliente(confirmDelete.id)} className="flex-1 bg-red-600 text-white py-3 md:py-4 rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest hover:bg-red-500 shadow-lg shadow-red-600/20 transition-all">Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ClientesPage;