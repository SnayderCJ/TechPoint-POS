import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Componentes
import Sidebar from "./components/Sidebar";
import PosPage from "./pages/POSPage";
import InventarioPage from "./pages/InventarioPage";
import HistorialPage from "./pages/HistorialPage";
import AjustesPage from "./pages/AjustesPage";
import LoginPage from "./pages/LoginPage";

function App() {
  // --- ESTADOS GLOBALES ---
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('techpoint_theme');
    return savedTheme ? savedTheme === 'dark' : true;
  });

  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem('techpoint_user'));
  });

  // 👇 Nuevo estado para la configuración (Nombre del negocio, IVA, etc.)
  const [config, setConfig] = useState(null);

  // --- SINCRONIZACIÓN CON BACKEND ---
  useEffect(() => {
    localStorage.setItem('techpoint_theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  useEffect(() => {
    // Solo buscamos la configuración si hay un usuario logueado
    if (user) {
      fetch('http://localhost:8000/api/config/')
        .then(res => res.json())
        .then(data => setConfig(data))
        .catch(err => console.error("Error cargando configuración en Milagro:", err));
    }
  }, [user]);

  const logout = () => {
    localStorage.removeItem('techpoint_user');
    setUser(null);
    setConfig(null);
  };

  return (
    <Router>
      {!user ? (
        <LoginPage setUser={setUser} isDarkMode={isDarkMode} />
      ) : (
        <div className={`flex min-h-screen transition-colors duration-500 font-sans ${
          isDarkMode ? "bg-slate-950 text-slate-200" : "bg-slate-50 text-slate-900"
        }`}>
          <div className="z-50 shrink-0">
            {/* 👇 PASAMOS LA CONFIG AL SIDEBAR */}
            <Sidebar 
              isDarkMode={isDarkMode} 
              toggleTheme={() => setIsDarkMode(!isDarkMode)} 
              user={user} 
              logout={logout}
              config={config} 
            />
          </div>

          <main className="flex-1 min-h-screen overflow-y-auto p-4 md:p-8 custom-scrollbar">
            <div className="max-w-[1400px] mx-auto">
              <Routes>
                {/* --- RUTA COMPARTIDA --- */}
                <Route path="/" element={<PosPage isDarkMode={isDarkMode} config={config} />} />

                {/* --- RUTAS PROTEGIDAS (Solo Admin) --- */}
                {user.role === 'admin' ? (
                  <>
                    <Route path="/inventario" element={<InventarioPage isDarkMode={isDarkMode} />} />
                    <Route path="/historial" element={<HistorialPage isDarkMode={isDarkMode} config={config} />} />
                    <Route path="/ajustes" element={<AjustesPage isDarkMode={isDarkMode} />} />
                  </>
                ) : (
                  <Route path="*" element={<Navigate to="/" replace />} />
                )}
                
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </main>
        </div>
      )}
    </Router>
  );
}

export default App;