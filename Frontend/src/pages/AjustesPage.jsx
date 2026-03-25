import { useState, useEffect } from 'react';
import { Settings, Save, Shield, Database, Store, MapPin, Percent, RefreshCw } from 'lucide-react';

function AjustesPage({ isDarkMode, showToast, authFetch }) { // 👈 Recibe authFetch
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [backingUp, setBackingUp] = useState(false);
  const [config, setConfig] = useState({
    nombre_negocio: '',
    iva_porcentaje: '',
    direccion: ''
  });

  useEffect(() => {
    authFetch('http://localhost:8000/api/config/')
      .then(res => res.json())
      .then(data => {
        setConfig(data);
        setLoading(false);
      })
      .catch(() => showToast("Error al cargar configuración", "error"));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const response = await authFetch('http://localhost:8000/api/config/', {
        method: 'POST',
        body: JSON.stringify(config)
      });
      if (response.ok) {
        showToast("Configuración global actualizada");
      } else {
        showToast("Error al guardar cambios", "error");
      }
    } catch (err) {
      showToast("Error de conexión", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleBackup = async () => {
    setBackingUp(true);
    showToast("Conectando con PostgreSQL para respaldo...", "success");
    
    try {
      const response = await authFetch('http://localhost:8000/api/backup/');
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `respaldo_pos_${new Date().toISOString().split('T')[0]}.sql`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        showToast("Respaldo descargado con éxito");
      } else {
        showToast("Error al generar el archivo de respaldo", "error");
      }
    } catch (err) {
      showToast("Error de red al intentar respaldar", "error");
    } finally {
      setBackingUp(false);
    }
  };

  if (loading) return <div className="p-20 text-center animate-pulse font-black text-xs uppercase tracking-widest">Cargando Core...</div>;

  return (
    <div className="flex flex-col space-y-10 animate-in fade-in duration-700 pb-20">
      <header>
        <h1 className={`text-4xl font-black tracking-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}>
          Panel de <span className="text-violet-600">Ajustes</span>
        </h1>
        <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-2">Configuración Central del Sistema</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <section className={`p-10 rounded-[3rem] border transition-all ${isDarkMode ? "bg-slate-900/50 border-white/10" : "bg-white border-slate-200 shadow-xl"}`}>
          <h2 className="text-xl font-black mb-8 flex items-center gap-3">
            <Store className="text-violet-500" /> Datos del Negocio
          </h2>
          <form onSubmit={handleSave} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500 ml-2">Nombre Comercial</label>
              <div className="relative">
                <Store className="absolute left-5 top-4.5 text-slate-400" size={18} />
                <input 
                  value={config.nombre_negocio} 
                  onChange={e => setConfig({...config, nombre_negocio: e.target.value})}
                  className={`w-full pl-14 pr-6 py-4 rounded-2xl border outline-none font-bold text-sm ${isDarkMode ? "bg-slate-950 border-white/10 text-white" : "bg-slate-50 border-slate-200"}`}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500 ml-2">IVA Local (%)</label>
                <div className="relative">
                  <Percent className="absolute left-5 top-4.5 text-slate-400" size={18} />
                  <input 
                    type="number" step="0.01"
                    value={config.iva_porcentaje} 
                    onChange={e => setConfig({...config, iva_porcentaje: e.target.value})}
                    className={`w-full pl-14 pr-6 py-4 rounded-2xl border outline-none font-bold text-sm ${isDarkMode ? "bg-slate-950 border-white/10 text-white" : "bg-slate-50 border-slate-200"}`}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500 ml-2">Sincronización</label>
                <div className={`flex items-center justify-center h-14 rounded-2xl border font-black text-[10px] uppercase tracking-widest ${isDarkMode ? "bg-green-500/5 border-green-500/20 text-green-500" : "bg-green-50 border-green-200 text-green-600"}`}>
                  <Shield size={14} className="mr-2" /> PostgreSQL Online
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500 ml-2">Dirección Matriz</label>
              <div className="relative">
                <MapPin className="absolute left-5 top-4.5 text-slate-400" size={18} />
                <input 
                  value={config.direccion} 
                  onChange={e => setConfig({...config, direccion: e.target.value})}
                  className={`w-full pl-14 pr-6 py-4 rounded-2xl border outline-none font-bold text-sm ${isDarkMode ? "bg-slate-950 border-white/10 text-white" : "bg-slate-50 border-slate-200"}`}
                />
              </div>
            </div>

            <button 
              type="submit" disabled={saving}
              className="w-full bg-violet-600 text-white py-5 rounded-3xl font-black uppercase tracking-widest text-xs shadow-xl shadow-violet-600/30 hover:bg-violet-500 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {saving ? <RefreshCw className="animate-spin" size={18} /> : <Save size={18} />}
              Guardar Configuración
            </button>
          </form>
        </section>

        <section className="space-y-10">
          <div className={`p-10 rounded-[3rem] border ${isDarkMode ? "bg-slate-900/50 border-white/10 shadow-2xl" : "bg-white border-slate-200 shadow-xl"}`}>
            <h2 className="text-xl font-black mb-6 flex items-center gap-3">
              <Database className="text-violet-500" /> Mantenimiento
            </h2>
            <p className="text-slate-500 text-xs font-bold leading-relaxed mb-8 uppercase tracking-wider">Genera un respaldo completo de la base de datos de PostgreSQL para migración o seguridad.</p>
            <button 
              onClick={handleBackup}
              disabled={backingUp}
              className="w-full border-2 border-dashed border-slate-300 dark:border-white/10 py-10 rounded-[2.5rem] flex flex-col items-center gap-4 hover:border-violet-500 hover:bg-violet-500/5 transition-all group disabled:opacity-50"
            >
              {backingUp ? (
                <RefreshCw className="animate-spin text-violet-500" size={40} />
              ) : (
                <Database className="text-slate-400 group-hover:text-violet-500 transition-colors" size={40} />
              )}
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-violet-500 transition-colors">
                {backingUp ? "Procesando PostgreSQL..." : "Exportar PostgreSQL (SQL)"}
              </span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default AjustesPage;