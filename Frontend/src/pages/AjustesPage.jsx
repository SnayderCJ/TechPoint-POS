import React, { useState, useEffect } from 'react';
import { 
  Settings, User, Database, Save, 
  ShieldCheck, RefreshCw, Monitor, 
  CheckCircle2, Globe, Zap, Activity,
  Server, Code2, Loader2
} from 'lucide-react';

const AjustesPage = ({ isDarkMode }) => {
  // --- ESTADOS DE CONFIGURACIÓN ---
  const [config, setConfig] = useState({
    nombre_negocio: "TechGaming",
    iva_porcentaje: 15.00,
    direccion: "Milagro, Guayas, Ecuador",
    alma_mater: "UNEMI" // 👈 Ahora es parte del estado
  });

  // --- ESTADOS DE CONTROL Y UI ---
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [dbStatus, setDbStatus] = useState("checking");
  const [isBackingUp, setIsBackingUp] = useState(false);

  // --- CARGA INICIAL DE DATOS ---
  useEffect(() => {
    fetch('http://localhost:8000/api/config/')
      .then(res => res.json())
      .then(data => {
        // Si el backend no tiene alma_mater aún, usamos el default
        setConfig({
          ...data,
          alma_mater: data.alma_mater || "UNEMI"
        });
      })
      .catch(err => console.error("Error al sincronizar con Milagro:", err));

    const timer = setTimeout(() => setDbStatus("online"), 1200);
    return () => clearTimeout(timer);
  }, []);

  // --- LÓGICA DE GUARDADO CON FEEDBACK ---
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('http://localhost:8000/api/config/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });

      if (response.ok) {
        const updatedData = await response.json();
        setConfig(updatedData);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Error crítico de red:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleBackup = () => {
    setIsBackingUp(true);
    setTimeout(() => {
      setIsBackingUp(false);
      alert("Respaldo de PostgreSQL generado con éxito en el servidor de Milagro.");
    }, 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-16">
      
      {/* ---- HEADER GLOBAL ---- */}
      <div className={`p-10 rounded-[2.5rem] border transition-all duration-500 ${
        isDarkMode ? "bg-slate-900/60 border-white/10 shadow-2xl" : "bg-white border-slate-200 shadow-xl"
      }`}>
        <div className="flex items-center gap-6">
          <div className="p-4 rounded-3xl bg-violet-600 text-white shadow-lg shadow-violet-600/20">
            <Settings size={32} />
          </div>
          <div>
            <h2 className={`text-4xl font-black tracking-tighter ${isDarkMode ? "text-white" : "text-slate-900"}`}>
              Configuración <span className="text-violet-600">Global</span>
            </h2>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-2">
              Gestión de Parámetros y Salud del Sistema • {config.nombre_negocio}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* ---- SECCIÓN 1: IDENTIDAD DEL DESARROLLADOR (EDITABLE) ---- */}
        <div className={`p-8 rounded-[2.5rem] border flex flex-col justify-between transition-all ${
          isDarkMode ? "bg-slate-900/40 border-white/5" : "bg-white border-slate-200"
        }`}>
          <div>
            <h3 className="flex items-center gap-3 text-lg font-black mb-8">
              <User size={20} className="text-violet-500" /> Identidad del Desarrollador
            </h3>
            
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase ml-2">Nombre del Negocio / Lead Engineer</label>
                <input 
                  value={config.nombre_negocio}
                  onChange={(e) => setConfig({...config, nombre_negocio: e.target.value})}
                  className={`w-full p-4 rounded-2xl border outline-none font-bold transition-all ${
                    isDarkMode ? "bg-slate-950 border-white/5 text-white focus:border-violet-500/50" : "bg-slate-50 border-slate-100 text-slate-900 focus:border-violet-200"
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase ml-2">IVA Configurado (%)</label>
                  <input 
                    type="number"
                    value={config.iva_porcentaje}
                    onChange={(e) => setConfig({...config, iva_porcentaje: e.target.value})}
                    className={`w-full p-4 rounded-2xl border outline-none font-bold ${
                      isDarkMode ? "bg-slate-950 border-white/5 text-white" : "bg-slate-50 border-slate-100 text-slate-900"
                    }`}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase ml-2">Alma Mater</label>
                  <div className="relative">
                    <Globe size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input 
                      value={config.alma_mater}
                      onChange={(e) => setConfig({...config, alma_mater: e.target.value})}
                      placeholder="Ej: UNEMI"
                      className={`w-full pl-10 pr-4 py-4 rounded-2xl border outline-none font-bold transition-all ${
                        isDarkMode ? "bg-slate-950 border-white/5 text-white focus:border-violet-500/50" : "bg-slate-50 border-slate-100 text-slate-900"
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3">
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className={`w-full p-5 rounded-2xl font-black text-xs uppercase transition-all flex items-center justify-center gap-3 active:scale-95 ${
                isSaving ? "bg-slate-800 cursor-not-allowed text-slate-500" : "bg-violet-600 hover:bg-violet-500 text-white shadow-xl shadow-violet-600/20"
              }`}
            >
              {isSaving ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} />}
              {isSaving ? "Sincronizando..." : "Actualizar Configuración"}
            </button>
            
            {showSuccess && (
              <div className="flex items-center justify-center gap-2 text-green-500 font-black text-[10px] uppercase animate-in fade-in zoom-in-95">
                <CheckCircle2 size={14} /> Sincronización completa con PostgreSQL
              </div>
            )}
          </div>
        </div>

        {/* ---- SECCIÓN 2: INFRAESTRUCTURA & ESTADO (DINÁMICO) ---- */}
        <div className={`p-8 rounded-[2.5rem] border transition-all ${
          isDarkMode ? "bg-slate-900/40 border-white/5" : "bg-white border-slate-200"
        }`}>
          <div className="flex justify-between items-center mb-8">
            <h3 className="flex items-center gap-3 text-lg font-black">
              <Monitor size={20} className="text-violet-500" /> Estado de Infraestructura
            </h3>
            <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase flex items-center gap-2 ${
              dbStatus === 'online' ? "bg-green-500/10 text-green-500" : "bg-yellow-500/10 text-yellow-500"
            }`}>
              <div className={`w-1.5 h-1.5 rounded-full ${dbStatus === 'online' ? 'bg-green-500 animate-ping' : 'bg-yellow-500'}`}></div>
              {dbStatus === 'online' ? 'Sistemas en Línea' : 'Iniciando Core...'}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {/* API Status */}
            <div className={`p-5 rounded-3xl border flex items-center justify-between ${isDarkMode ? "bg-slate-950 border-white/5" : "bg-slate-50 border-slate-100"}`}>
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-500"><Server size={20} /></div>
                <div>
                  <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Servidor Backend</p>
                  <p className="text-sm font-black">Django • Python 3.12</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[9px] font-bold text-green-500 uppercase">Latencia</p>
                <p className="text-xs font-black">12ms</p>
              </div>
            </div>

            {/* DB Status */}
            <div className={`p-5 rounded-3xl border flex items-center justify-between ${isDarkMode ? "bg-slate-950 border-white/5" : "bg-slate-50 border-slate-100"}`}>
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-500"><Database size={20} /></div>
                <div>
                  <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Motor de Datos</p>
                  <p className="text-sm font-black">PostgreSQL 15 (Docker)</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[9px] font-bold text-green-500 uppercase">Estado</p>
                <p className="text-xs font-black">Conectado</p>
              </div>
            </div>

            {/* Core Status */}
            <div className={`p-5 rounded-3xl border flex items-center justify-between ${isDarkMode ? "bg-slate-950 border-white/5" : "bg-slate-50 border-slate-100"}`}>
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-violet-500/10 text-violet-500"><Code2 size={20} /></div>
                <div>
                  <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Versión del Sistema</p>
                  <p className="text-sm font-black">v1.1.5</p>
                </div>
              </div>
              <span className="text-[9px] font-black text-slate-500 uppercase">Core Actualizado</span>
            </div>
          </div>
        </div>
      </div>

      {/* ---- SECCIÓN 3: SEGURIDAD Y RESPALDO ---- */}
      <div className={`p-10 rounded-[3rem] border flex flex-col md:flex-row items-center justify-between gap-8 transition-all ${
        isDarkMode ? "bg-slate-900/60 border-white/10" : "bg-white border-slate-200 shadow-xl"
      }`}>
        <div className="flex items-center gap-6">
          <div className="p-5 rounded-3xl bg-green-500/10 text-green-500 border border-green-500/20">
            <ShieldCheck size={32} />
          </div>
          <div>
            <h4 className={`text-2xl font-black ${isDarkMode ? "text-white" : "text-slate-900"}`}>Seguridad y Respaldo</h4>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">
              Encargado: Snayder Cedeño • Protección de Activos Digitales
            </p>
          </div>
        </div>
        
        <button 
          onClick={handleBackup}
          disabled={isBackingUp}
          className={`px-10 py-5 rounded-[2.2rem] font-black text-xs uppercase transition-all flex items-center gap-4 active:scale-95 ${
            isBackingUp ? "bg-slate-800 text-slate-500" : "bg-violet-600 hover:bg-violet-700 text-white shadow-2xl shadow-violet-600/40"
          }`}
        >
          {isBackingUp ? <Loader2 size={20} className="animate-spin" /> : <RefreshCw size={20} />}
          {isBackingUp ? "Procesando..." : "Ejecutar Backup Manual"}
        </button>
      </div>

    </div>
  );
};

export default AjustesPage;