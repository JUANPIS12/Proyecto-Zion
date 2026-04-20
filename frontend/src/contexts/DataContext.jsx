import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import apiService from '../services/apiService';

const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
  const { user, token } = useAuth();
  
  const [ordenes, setOrdenes] = useState([]);
  const [tecnicos, setTecnicos] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [equipos, setEquipos] = useState([]);
  const [sedes, setSedes] = useState([]);
  const [tecnologias, setTecnologias] = useState([]);
  const [visitas, setVisitas] = useState([]);
  const [mantenimientos, setMantenimientos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);

  const [loadingData, setLoadingData] = useState(false);
  const [errorData, setErrorData] = useState('');
  const [successData, setSuccessData] = useState('');

  const clearMessages = () => {
    setErrorData('');
    setSuccessData('');
  };

  const loadData = useCallback(async () => {
    if (!token) return;
    try {
      setLoadingData(true);
      clearMessages();

      const [
        ordenesData, tecnicosData, empresasData,
        equiposData, sedesData, tecnologiasData,
        visitasData, mantenimientosData,
      ] = await Promise.all([
        apiService.get('/ordenes'),
        apiService.get('/tecnicos'),
        apiService.get('/empresas'),
        apiService.get('/equipos'),
        apiService.get('/sedes'),
        apiService.get('/tecnologias'),
        apiService.get('/visitas'),
        apiService.get('/mantenimientos'),
      ]);

      setOrdenes(ordenesData);
      setTecnicos(tecnicosData);
      setEmpresas(empresasData);
      setEquipos(equiposData);
      setSedes(sedesData);
      setTecnologias(tecnologiasData);
      setVisitas(visitasData);
      setMantenimientos(mantenimientosData);

      if (user?.rol === 'ROLE_ADMIN' || user?.rol === 'admin') {
        // Usa fetch normal para evitar `/api` prefix si es necesario, 
        // O asumiendo que apiService maneja admin si lo modificamos.
        // Pero actualmente el fetch en App.jsx usa: fetchJson(`${API_URL.replace('/api', '')}/admin/usuarios`)
        const res = await fetch('http://localhost:8080/admin/usuarios', {
           headers: { 'Authorization': `Bearer ${token}` }
        });
        if(res.ok) {
           setUsuarios(await res.json());
        }
      }
    } catch (err) {
      setErrorData(err.message || 'Error cargando datos');
    } finally {
      setLoadingData(false);
    }
  }, [token, user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Use this object to pass all the shared state
  const val = {
    ordenes, setOrdenes,
    tecnicos, setTecnicos,
    empresas, setEmpresas,
    equipos, setEquipos,
    sedes, setSedes,
    tecnologias, setTecnologias,
    visitas, setVisitas,
    mantenimientos, setMantenimientos,
    usuarios, setUsuarios,
    loadingData, errorData, successData,
    setErrorData, setSuccessData,
    clearMessages, loadData
  };

  return (
      <DataContext.Provider value={val}>
        {children}
      </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
