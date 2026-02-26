import React, { useState } from 'react';
import { LayoutDashboard, Package, History, Settings, LogOut, Laptop, Sun, Moon, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ isDarkMode, toggleTheme, user, logout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);
  
  // Definición de rutas con acceso por roles
  const menuItems = [
    { name: 'Panel de Ventas', path: '/', icon: <LayoutDashboard size={20} />, roles: ['admin', 'cashier'] },
    { name: 'Inventario', path: '/inventario', icon: <Package size={20} />, roles: ['admin'] },
    { name: 'Historial', path: '/historial', icon: <History size={20} />, roles: ['admin'] },
    { name: 'Configuración', path: '/ajustes', icon: <Settings size={20} />, roles: ['admin'] }, 
  ];

  return (
    <>
      {/* --- BOTÓN HAMBURGUESA (Móvil) --- */}
      <button 
        onClick={toggleMenu}
        className={`fixed top-6 left-6 p-3 rounded-xl z-[70] md:hidden shadow-lg transition-all active:scale-95 ${
          isDarkMode 
            ? "bg-slate-900 text-white border border-white/10" 
            : "bg-white text-slate-900 border border-slate-200"
        }`}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* --- OVERLAY (Móvil) --- */}
      {isOpen && (
        <div 
          onClick={toggleMenu} 
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[60] md:hidden animate-in fade-in duration-300" 
        />
      )}

      {/* --- SIDEBAR ASIDE --- */}
      <aside className={`fixed md:sticky top-4 left-4 z-[65] transition-all duration-300 h-[calc(100vh-2rem)] rounded-[2.5rem] border shadow-2xl flex flex-col overflow-hidden ${
        isOpen ? "translate-x-0 w-64" : "-translate-x-[120%] md:translate-x-0 w-64"
      } ${
        isDarkMode 
          ? "bg-slate-900 border-slate-800 text-slate-300" 
          : "bg-white border-slate-200 text-slate-600 shadow-slate-200/50"
      }`}>
        
        {/* Brand / Logo */}
        <div className="p-8">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-2xl text-white shadow-sm transition-all ${
              isDarkMode ? "bg-violet-600 shadow-violet-900/20" : "bg-violet-600 shadow-violet-200"
            }`}>
              <Laptop size={26} />
            </div>
            <div className="flex flex-col">
              <span className={`text-xl font-black tracking-tighter leading-none ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                TechPoint
              </span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                {user?.role === 'admin' ? 'Admin Mode' : 'Cashier Terminal'}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation - FILTRADA POR ROL */}
        <nav className="flex-1 px-4 space-y-1.5 mt-2">
          {menuItems
            .filter(item => item.roles.includes(user?.role)) // 👈 Filtra según el rol del usuario
            .map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-4 px-5 py-4 rounded-2xl font-bold transition-all duration-200 group ${
                    isActive 
                    ? (isDarkMode ? "text-white bg-white/5 border border-white/10" : "text-violet-600 bg-violet-50 border border-violet-100") 
                    : (isDarkMode ? "text-slate-500 hover:text-white hover:bg-white/5" : "text-slate-400 hover:text-slate-900 hover:bg-slate-50")
                  }`}
                >
                  <span className={`${isActive ? "text-violet-500" : "text-slate-400 group-hover:text-violet-500 transition-colors"}`}>
                    {item.icon}
                  </span>
                  <span className="text-sm tracking-tight">{item.name}</span>
                </Link>
              );
          })}
        </nav>

        {/* Theme Switcher */}
        <div className="px-4 mb-4">
          <div className={`flex p-1 rounded-2xl border transition-all ${
            isDarkMode ? "bg-slate-950 border-slate-800" : "bg-slate-100 border-slate-200"
          }`}>
            <button 
              onClick={() => isDarkMode && toggleTheme()}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all text-[10px] uppercase font-black ${
                !isDarkMode ? "bg-white shadow-sm text-violet-600" : "text-slate-500 hover:text-slate-300"
              }`}
            >
              <Sun size={14} /> Día
            </button>
            <button 
              onClick={() => !isDarkMode && toggleTheme()}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all text-[10px] uppercase font-black ${
                isDarkMode ? "bg-slate-800 text-violet-400 shadow-sm" : "text-slate-500 hover:text-slate-100"
              }`}
            >
              <Moon size={14} /> Noche
            </button>
          </div>
        </div>

        {/* Profile / Footer */}
        <div className={`p-4 border-t ${isDarkMode ? "border-slate-800 bg-slate-950/50" : "border-slate-100 bg-slate-50/50"}`}>
          <div className="flex items-center gap-3 mb-4 px-2">
             <div className={`w-10 h-10 rounded-2xl border flex items-center justify-center text-xs font-black transition-colors shadow-inner ${
               isDarkMode ? "bg-slate-800 border-slate-700 text-violet-400" : "bg-white border-slate-200 text-violet-600"
             }`}>
               {user?.name?.substring(0, 2).toUpperCase() || 'SC'}
             </div>
             <div className="overflow-hidden">
               <p className={`text-xs font-black truncate ${isDarkMode ? "text-slate-200" : "text-slate-900"}`}>
                 {user?.name || 'Snayder Cedeño'}
               </p>
               <p className="text-[10px] font-bold text-slate-500 truncate uppercase tracking-tighter">
                 {user?.institution || 'UNEMI • Milagro'}
               </p>
             </div>
          </div>
          <button 
            onClick={logout} // 👈 Conectado a la función logout de App.jsx
            className="flex items-center gap-3 px-5 py-3.5 w-full rounded-2xl text-slate-500 hover:bg-red-500/10 hover:text-red-500 transition-all font-bold text-[11px] uppercase tracking-widest"
          >
            <LogOut size={16} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;