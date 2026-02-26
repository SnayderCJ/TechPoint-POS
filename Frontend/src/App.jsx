import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Importación de componentes y páginas
import Sidebar from "./components/Sidebar";
import PosPage from "./pages/POSPage";
import InventarioPage from "./pages/InventarioPage";
import HistorialPage from "./pages/HistorialPage";
import AjustesPage from "./pages/AjustesPage";

function App() {
  // 1. Inicialización inteligente del tema desde LocalStorage
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('techpoint_theme');
    // Si no hay nada guardado, iniciamos en modo oscuro por defecto
    return savedTheme ? savedTheme === 'dark' : true;
  });

  // 2. Efecto para guardar la preferencia cada vez que cambie
  useEffect(() => {
    localStorage.setItem('techpoint_theme', isDarkMode ? 'dark' : 'light');
    
    // Opcional: Aplicar clase al body para selectores globales si fuera necesario
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Función para alternar el tema
  const toggleTheme = () => setIsDarkMode(prev => !prev);

  return (
    <Router>
      {/* Contenedor Principal: Maneja el fondo y la transición global */}
      <div className={`flex min-h-screen transition-colors duration-500 font-sans selection:bg-violet-500/30 selection:text-violet-500 ${
        isDarkMode 
          ? "bg-slate-950 text-slate-200" 
          : "bg-slate-50 text-slate-900"
      }`}>
        
        {/* Capas decorativas sutiles (Solo visibles en modo oscuro para profundidad) */}
        {isDarkMode && (
          <div className="fixed inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-600/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/5 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/4"></div>
          </div>
        )}

        {/* --- SIDEBAR RESPONSIVO --- 
            Recibe el estado del tema y la función para cambiarlo */}
        <div className="z-50">
           <Sidebar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
        </div>

        {/* --- CONTENIDO PRINCIPAL --- 
            Ajusta el padding para móviles (p-4) y desktop (md:p-8) */}
        <main className="flex-1 h-screen overflow-y-auto custom-scrollbar p-4 md:p-8 relative">
          <div className="max-w-[1400px] mx-auto">
            <Routes>
              {/* Todas las páginas reciben 'isDarkMode' para adaptar su UI interna */}
              <Route path="/" element={<PosPage isDarkMode={isDarkMode} />} />
              <Route path="/inventario" element={<InventarioPage isDarkMode={isDarkMode} />} />
              <Route path="/historial" element={<HistorialPage isDarkMode={isDarkMode} />} />
              <Route path="/ajustes" element={<AjustesPage isDarkMode={isDarkMode} />} />
            </Routes>
          </div>

          {/* Footer de créditos (Opcional, visible al final del scroll) */}
          <footer className="mt-12 pb-6 text-center">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">
              TechPoint POS • Ingeniería de Software UNEMI • {new Date().getFullYear()}
            </p>
          </footer>
        </main>

        {/* Estilos globales para el scrollbar adaptativo */}
        <style>{`
          .custom-scrollbar::-webkit-scrollbar { 
            width: 6px; 
          }
          .custom-scrollbar::-webkit-scrollbar-track { 
            background: transparent; 
          }
          .custom-scrollbar::-webkit-scrollbar-thumb { 
            background: ${isDarkMode ? "#1e1b4b" : "#cbd5e1"}; 
            border-radius: 10px; 
            transition: background 0.3s;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover { 
            background: #7c3aed; 
          }
          
          /* Animaciones de entrada suaves */
          .animate-in {
            animation: fadeIn 0.6s ease-out;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    </Router>
  );
}

export default App;