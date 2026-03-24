import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Componentes
import Sidebar from "./components/Sidebar";
import PosPage from "./pages/PosPage"; 
import InventarioPage from "./pages/InventarioPage";
import HistorialPage from "./pages/HistorialPage";
import AjustesPage from "./pages/AjustesPage";
import LoginPage from "./pages/LoginPage";
import ClientesPage from "./pages/ClientesPage";
import { useToast, ToastContainer } from "./components/Notifications"; // 👈 Nuevo

function App() {
  const { toasts, showToast } = useToast(); // 👈 Nuevo
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('techpoint_theme');
    return savedTheme ? savedTheme === 'dark' : true;
  });

  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem('techpoint_user'));
  });

  const [config, setConfig] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    localStorage.setItem('techpoint_theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  useEffect(() => {
    if (user) {
      fetch('http://localhost:8000/api/config/')
        .then(res => res.json())
        .then(data => {
          setConfig(data);
          setIsLoading(false);
        })
        .catch(err => {
          console.error("Error cargando configuración:", err);
          setIsLoading(false); 
        });
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const logout = () => {
    localStorage.removeItem('techpoint_user');
    setUser(null);
  };

  if (isLoading && user) {
    return (
      <div className={`h-screen w-full flex items-center justify-center ${isDarkMode ? "bg-slate-950 text-white" : "bg-white text-slate-900"}`}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="font-black text-xs uppercase tracking-[0.3em] animate-pulse">Sincronizando Core...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <ToastContainer toasts={toasts} /> {/* 👈 Contenedor Global */}
      {!user ? (
        <LoginPage setUser={setUser} isDarkMode={isDarkMode} showToast={showToast} />
      ) : (
        <div className={`flex min-h-screen transition-colors duration-500 font-sans ${
          isDarkMode ? "bg-slate-950 text-slate-200" : "bg-slate-50 text-slate-900"
        }`}>
          <div className="z-50 shrink-0">
            <Sidebar 
              isDarkMode={isDarkMode} 
              toggleTheme={() => setIsDarkMode(!isDarkMode)} 
              user={user} 
              logout={logout}
              config={config || {}} 
            />
          </div>

          <main className="flex-1 min-h-screen overflow-y-auto p-4 md:p-8 custom-scrollbar">
            <div className="max-w-[1400px] mx-auto">
              <Routes>
                <Route path="/" element={<PosPage isDarkMode={isDarkMode} config={config} showToast={showToast} />} />
                <Route path="/clientes" element={<ClientesPage isDarkMode={isDarkMode} showToast={showToast} />} />

                {user.role === 'admin' ? (
                  <>
                    <Route path="/inventario" element={<InventarioPage isDarkMode={isDarkMode} showToast={showToast} />} />
                    <Route path="/historial" element={<HistorialPage isDarkMode={isDarkMode} config={config} showToast={showToast} />} />
                    <Route path="/ajustes" element={<AjustesPage isDarkMode={isDarkMode} showToast={showToast} />} />
                  </>
                ) : (
                  <>
                    <Route path="/inventario" element={<Navigate to="/" replace />} />
                    <Route path="/historial" element={<Navigate to="/" replace />} />
                    <Route path="/ajustes" element={<Navigate to="/" replace />} />
                  </>
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
