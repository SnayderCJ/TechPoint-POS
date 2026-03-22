import React, { useState, useEffect } from 'react';
// 👇 Corregido: 'IdCard' en lugar de 'IdentificationCard'
import { UserPlus, Search, Mail, Phone, IdCard, Edit, Trash2, Users, MapPin } from 'lucide-react';

const ClientesPage = ({ isDarkMode }) => {
  const [clientes, setClientes] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorId, setErrorId] = useState(""); // 👈 Nuevo: Error de validación
  
  const [nuevoCliente, setNuevoCliente] = useState({
    identificacion: "",
    nombre: "",
    correo: "",
    telefono: "",
    direccion: ""
  });

  // --- FUNCIÓN DE VALIDACIÓN (MÓDULO 10) ---
  const validarIdentificacion = (id) => {
    if (!/^\d+$/.test(id)) return "Solo números permitidos";
    if (id.length !== 10 && id.length !== 13) return "Debe tener 10 o 13 dígitos";
    
    const cedula = id.substring(0, 10);
    const provincia = parseInt(cedula.substring(0, 2), 10);
    if (provincia < 1 || provincia > 24) return "Provincia inválida";

    const digitos = cedula.split('').map(Number);
    const verificador = digitos.pop();
    
    let suma = 0;
    digitos.forEach((d, i) => {
      if (i % 2 === 0) {
        d *= 2;
        if (d > 9) d -= 9;
      }
      suma += d;
    });

    const resultado = 10 - (suma % 10);
    if ((resultado === 10 ? 0 : resultado) !== verificador) {
      return "Identificación inválida";
    }
    return ""; // Válido
  };

  useEffect(() => {
    fetch('http://localhost:8000/api/clientes/')
      .then(res => res.json())
      .then(data => {
        setClientes(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error en CRM Milagro:", err);
        setLoading(false);
      });
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    const error = validarIdentificacion(nuevoCliente.identificacion);
    if (error) {
      setErrorId(error);
      return;
    }

    try {
      const res = await fetch('http://localhost:8000/api/clientes/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoCliente)
      });
      if (res.ok) {
        const data = await res.json();
        setClientes([...clientes, data]);
        setNuevoCliente({ identificacion: "", nombre: "", correo: "", telefono: "", direccion: "" });
        setErrorId(""); // Limpiar error
        alert("Cliente registrado exitosamente.");
      } else {
        const errorData = await res.json();
        alert(errorData.identificacion?.[0] || "Error en el servidor");
      }
    } catch (err) { alert("Error al conectar con PostgreSQL."); }
  };

  const handleIdChange = (e) => {
    const val = e.target.value;
    setNuevoCliente({...nuevoCliente, identificacion: val});
    if (val.length >= 10) {
      setErrorId(validarIdentificacion(val));
    } else {
      setErrorId("");
    }
  };

  const clientesFiltrados = clientes.filter(c => 
    (c.nombre?.toLowerCase() || "").includes(busqueda.toLowerCase()) ||
    (c.identificacion || "").includes(busqueda)
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20">
      
      {/* ---- Header SaaS ---- */}
      <div className={`p-10 rounded-[2.5rem] border ${isDarkMode ? "bg-slate-900/60 border-white/10 shadow-2xl" : "bg-white border-slate-200 shadow-xl"}`}>
        <div className="flex items-center gap-6">
          <div className="p-4 rounded-3xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/20">
            <Users size={32} />
          </div>
          <div>
            <h2 className={`text-4xl font-black tracking-tighter ${isDarkMode ? "text-white" : "text-slate-900"}`}>
              Gestión de <span className="text-indigo-600">Clientes</span>
            </h2>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-2">
              CRM • Base de Datos de Clientes • Snayder Cedeño
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* ---- Formulario de Registro ---- */}
        <div className={`p-8 rounded-[2.5rem] border h-fit ${isDarkMode ? "bg-slate-900/40 border-white/5" : "bg-white border-slate-200"}`}>
          <h3 className="flex items-center gap-3 text-lg font-black mb-8 text-indigo-500">
            <UserPlus size={20} /> Nuevo Registro
          </h3>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase ml-2">Cédula o RUC</label>
              <input 
                required
                value={nuevoCliente.identificacion}
                onChange={handleIdChange}
                className={`w-full p-4 rounded-2xl border outline-none font-bold text-sm transition-all ${
                  errorId ? "border-red-500 bg-red-500/5" : isDarkMode ? "bg-slate-950 border-white/5 text-white focus:border-indigo-500" : "bg-slate-50 border-slate-100"
                }`}
              />
              {errorId && <p className="text-[10px] text-red-500 font-black uppercase ml-2 animate-pulse">{errorId}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase ml-2">Nombre Completo</label>
              <input 
                required
                value={nuevoCliente.nombre}
                onChange={(e) => setNuevoCliente({...nuevoCliente, nombre: e.target.value})}
                className={`w-full p-4 rounded-2xl border outline-none font-bold text-sm ${isDarkMode ? "bg-slate-950 border-white/5 text-white focus:border-indigo-500" : "bg-slate-50 border-slate-100"}`}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                 <label className="text-[10px] font-bold text-slate-500 uppercase ml-2">Teléfono</label>
                 <input 
                   value={nuevoCliente.telefono}
                   onChange={(e) => setNuevoCliente({...nuevoCliente, telefono: e.target.value})}
                   className={`w-full p-4 rounded-2xl border outline-none font-bold text-sm ${isDarkMode ? "bg-slate-950 border-white/5 text-white" : "bg-slate-50 border-slate-100"}`}
                 />
               </div>
               <div className="space-y-2">
                 <label className="text-[10px] font-bold text-slate-500 uppercase ml-2">Correo</label>
                 <input 
                   type="email"
                   value={nuevoCliente.correo}
                   onChange={(e) => setNuevoCliente({...nuevoCliente, correo: e.target.value})}
                   className={`w-full p-4 rounded-2xl border outline-none font-bold text-sm ${isDarkMode ? "bg-slate-950 border-white/5 text-white" : "bg-slate-50 border-slate-100"}`}
                 />
               </div>
            </div>
            <button 
              type="submit" 
              disabled={!!errorId}
              className={`w-full p-5 rounded-2xl text-white font-black text-xs uppercase transition-all shadow-xl active:scale-95 mt-4 ${
                errorId ? "bg-slate-600 cursor-not-allowed opacity-50" : "bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/20"
              }`}
            >
              Registrar Cliente
            </button>
          </form>
        </div>

        {/* ---- Listado de Clientes ---- */}
        <div className="xl:col-span-2 space-y-6">
          <div className={`p-4 rounded-3xl border flex items-center gap-4 ${isDarkMode ? "bg-slate-900/40 border-white/5" : "bg-white border-slate-200"}`}>
            <Search className="ml-4 text-slate-500" size={20} />
            <input 
              placeholder="Buscar por nombre o identificación..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full bg-transparent border-none outline-none py-2 font-bold text-sm"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {loading ? <p className="p-10 text-center animate-pulse uppercase font-black text-[10px]">Cargando CRM...</p> : 
              clientesFiltrados.map(cliente => (
                <div key={cliente.id} className={`p-6 rounded-[2.5rem] border transition-all hover:border-indigo-500/40 ${isDarkMode ? "bg-slate-900 border-white/5" : "bg-white border-slate-200 shadow-sm"}`}>
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-black">
                      {(cliente.nombre || "CL").substring(0,2).toUpperCase()}
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 rounded-xl bg-slate-500/10 text-slate-500 hover:text-indigo-500 transition-colors"><Edit size={16}/></button>
                      <button className="p-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"><Trash2 size={16}/></button>
                    </div>
                  </div>
                  <h4 className={`text-lg font-black leading-tight mb-4 ${isDarkMode ? "text-white" : "text-slate-900"}`}>{cliente.nombre || "Cliente sin nombre"}</h4>
                  <div className="space-y-2">
                    {/* 👇 Aquí ya usamos IdCard */}
                    <p className="flex items-center gap-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest"><IdCard size={14}/> {cliente.identificacion}</p>
                    <p className="flex items-center gap-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest"><Phone size={14}/> {cliente.telefono || "Sin teléfono"}</p>
                    <p className="flex items-center gap-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest"><Mail size={14}/> {cliente.correo || "Sin correo"}</p>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientesPage;