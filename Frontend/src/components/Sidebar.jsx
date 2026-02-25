import { LayoutDashboard, Package, History, Settings, LogOut, Laptop } from 'lucide-react'; // 👈 Agregamos Settings aquí
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    { name: 'Punto de Venta', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Inventario', path: '/inventario', icon: <Package size={20} /> },
    { name: 'Historial', path: '/historial', icon: <History size={20} /> },
    { name: 'Ajustes', path: '/ajustes', icon: <Settings size={20} /> }, 
  ];

  return (
    <aside className="w-64 bg-[#0f172a] text-slate-300 flex flex-col min-h-screen p-6 border-r border-slate-800">
      <div className="flex items-center gap-3 mb-12 px-2">
        <div className="bg-emerald-500 p-2 rounded-xl text-white shadow-lg shadow-emerald-500/20">
          <Laptop size={24} />
        </div>
        <span className="text-xl font-black text-white tracking-tight">TechPoint</span>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold transition-all duration-200 ${
              location.pathname === item.path 
              ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' 
              : 'hover:bg-slate-800 hover:text-white'
            }`}
          >
            {item.icon}
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="pt-6 border-t border-slate-800">
        <button className="flex items-center gap-3 px-4 py-3 w-full rounded-2xl text-slate-400 hover:bg-red-500/10 hover:text-red-500 transition-all font-bold">
          <LogOut size={20} />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;