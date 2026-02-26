import { LayoutDashboard, Package, History, Settings, LogOut, Laptop, Sparkles } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  const menuItems = [
    { name: 'Punto de Venta', path: '/', icon: <LayoutDashboard size={22} /> },
    { name: 'Inventario', path: '/inventario', icon: <Package size={22} /> },
    { name: 'Historial', path: '/historial', icon: <History size={22} /> },
    { name: 'Ajustes', path: '/ajustes', icon: <Settings size={22} /> }, 
  ];

  return (
    <aside className="w-64 bg-slate-950/40 backdrop-blur-2xl flex flex-col h-[calc(100vh-2rem)] rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden">
      <div className="p-8">
        <div className="flex items-center gap-3 group">
          <div className="bg-gradient-to-br from-violet-400 to-indigo-600 p-2.5 rounded-2xl text-white shadow-[0_0_20px_rgba(139,92,246,0.4)]">
            <Laptop size={26} />
          </div>
          <div>
            <span className="text-xl font-black text-white tracking-tighter block leading-none">TechPoint</span>
            <span className="text-[10px] font-bold text-violet-400 uppercase tracking-[0.2em] mt-1 flex items-center gap-1">
              <Sparkles size={10} /> POS System
            </span>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1.5">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path} className={`relative flex items-center gap-4 px-5 py-4 rounded-2xl font-bold transition-all duration-300 ${isActive ? 'text-white bg-white/5 border border-white/10' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>
              {isActive && <div className="absolute left-0 w-1.5 h-6 bg-violet-500 rounded-full shadow-[0_0_15px_#8b5cf6]"></div>}
              <span className={isActive ? 'text-violet-400' : ''}>{item.icon}</span>
              <span className="text-sm tracking-tight">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 bg-white/5 mt-auto border-t border-white/5">
        <div className="flex items-center gap-3 mb-4 p-2">
           <div className="w-10 h-10 rounded-full bg-slate-800 border border-violet-500/30 flex items-center justify-center text-xs font-black text-violet-400">SC</div>
           <div className="overflow-hidden"><p className="text-xs font-black text-white truncate">Snayder Cedeño</p></div>
        </div>
        <button className="flex items-center gap-3 px-5 py-3.5 w-full rounded-xl text-slate-500 hover:text-red-400 transition-all font-bold text-xs uppercase tracking-widest">
          <LogOut size={16} /><span>Salir</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;