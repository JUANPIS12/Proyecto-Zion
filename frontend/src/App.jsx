import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import ProtectedRoute from './components/ProtectedRoute';

// Layout and Global Component
import DashboardLayout from './components/layout/DashboardLayout';

// Pages
import Login from './pages/Auth/Login';
import DashboardOverview from './pages/Dashboard/DashboardOverview';
import OrdenesList from './pages/OrdenesServicio/OrdenesList';
import TecnicosList from './pages/Tecnicos/TecnicosList';
import VisitasList from './pages/Visitas/VisitasList';
import MantenimientosList from './pages/Mantenimiento/MantenimientosList';
import EquiposList from './pages/Equipos/EquiposList';
import ClientesList from './pages/Clientes/ClientesList';
import TecnologiasList from './pages/Tecnologias/TecnologiasList';
import ReportesView from './pages/Reportes/ReportesView';
import SedesList from './pages/Admin/SedesList';
import CoordinadoresList from './pages/Admin/CoordinadoresList';

// Placeholder Pages (Will be split progressively as part of the new architecture)
const PlaceholderPage = ({ title }) => (
  <div className="flex flex-col items-center justify-center p-20 text-center">
    <h2 className="text-3xl font-bold text-slate-400 mb-4">{title}</h2>
    <p className="text-slate-500">
      Este módulo está siendo migrado a la nueva arquitectura. Revisa los archivos en la carpeta `src/pages`.
    </p>
  </div>
);

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route index element={<DashboardOverview />} />
          <Route path="ordenes" element={<OrdenesList />} />
          <Route path="visitas" element={<VisitasList />} />
          <Route path="mantenimientos" element={<MantenimientosList />} />
          <Route path="equipos" element={<EquiposList />} />
          <Route path="clientes" element={<ClientesList />} />
          <Route path="tecnicos" element={<TecnicosList />} />
          <Route path="tecnologias" element={<TecnologiasList />} />
          <Route path="reportes" element={<ReportesView />} />
          
          {/* Rutas Admin */}
          <Route path="sedes" element={<ProtectedRoute allowedRoles={['ROLE_ADMIN', 'admin']}><SedesList /></ProtectedRoute>} />
          <Route path="coordinadores" element={<ProtectedRoute allowedRoles={['ROLE_ADMIN', 'admin']}><CoordinadoresList /></ProtectedRoute>} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AppRoutes />
      </DataProvider>
    </AuthProvider>
  );
}
