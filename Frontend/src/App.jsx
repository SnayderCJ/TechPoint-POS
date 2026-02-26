import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import PosPage from "./pages/POSPage";
import InventarioPage from "./pages/InventarioPage";
import HistorialPage from "./pages/HistorialPage";
import AjustesPage from "./pages/AjustesPage";
import LoginPage from "./pages/LoginPage"; 

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('techpoint_theme') === 'dark');
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('techpoint_user'))); // 👈 Estado del usuario

  useEffect(() => {
    localStorage.setItem('techpoint_theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // Función para cerrar sesión
  const logout = () => {
    localStorage.removeItem('techpoint_user');
    setUser(null);
  };

  return (
    <Router>
      {!user ? (
        // Si no hay usuario, solo mostramos el Login
        <LoginPage setUser={setUser} isDarkMode={isDarkMode} />
      ) : (
        // Si hay usuario, cargamos el sistema completo
        <div className={`flex min-h-screen transition-colors duration-500 font-sans ${isDarkMode ? "bg-slate-950 text-slate-200" : "bg-slate-50 text-slate-900"}`}>
          <div className="z-50">
            <Sidebar isDarkMode={isDarkMode} toggleTheme={() => setIsDarkMode(!isDarkMode)} user={user} logout={logout} />
          </div>

          <main className="flex-1 h-screen overflow-y-auto custom-scrollbar p-4 md:p-8">
            <Routes>
              <Route path="/" element={<PosPage isDarkMode={isDarkMode} />} />
              
              {/* PROTECCIÓN POR ROL: Solo administradores ven Inventario y Ajustes */}
              <Route path="/inventario" element={user.role === 'admin' ? <InventarioPage isDarkMode={isDarkMode} /> : <Navigate to="/" />} />
              <Route path="/historial" element={user.role === 'admin' ? <HistorialPage isDarkMode={isDarkMode} /> : <Navigate to="/" />} />
              <Route path="/ajustes" element={user.role === 'admin' ? <AjustesPage isDarkMode={isDarkMode} /> : <Navigate to="/" />} />
              
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      )}
    </Router>
  );
}

export default App;