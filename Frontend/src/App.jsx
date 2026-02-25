import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// IMPORTANTE: Verifica que los archivos en tu carpeta 'pages' se llamen exactamente así
import Sidebar from "./components/Sidebar";
import PosPage from "./pages/POSPage";
import InventarioPage from "./pages/InventarioPage";
import HistorialPage from "./pages/HistorialPage";
import AjustesPage from "./pages/AjustesPage"; // 👈 Asegúrate de que este archivo exista

function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans">
        {/* Sidebar fija */}
        <Sidebar />

        {/* Contenido principal */}
        <main className="flex-1 h-screen overflow-y-auto bg-[#f8fafc]">
          <Routes>
            <Route path="/" element={<PosPage />} />
            <Route path="/inventario" element={<InventarioPage />} />
            <Route path="/historial" element={<HistorialPage />} />
            <Route path="/ajustes" element={<AjustesPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;