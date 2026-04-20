import React, { useState, useMemo } from 'react';
import { useData } from '../../contexts/DataContext';
import apiService from '../../services/apiService';
import GenericTableView from '../../components/ui/GenericTableView';
import { renderEstadoBadge } from '../../utils/helpers';

export default function CoordinadoresList() {
  const { usuarios, loadData, setErrorData, setSuccessData } = useData();
  
  const [searchValue, setSearchValue] = useState('');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [nuevo, setNuevo] = useState({ username: '', password: '' });

  const coordinadoresView = useMemo(() => 
    usuarios.filter((u) => u.rol === 'ROLE_COORDINADOR').map((u) => ({
      id: u.id, username: u.username, rol: u.rol, activo: u.activo ? 'ACTIVO' : 'INACTIVO'
    })),
    [usuarios]
  );

  const applySearch = (rows) => {
    const search = searchValue.toLowerCase().trim();
    if (!search) return rows;
    return rows.filter((row) => Object.values(row).some((val) => String(val).toLowerCase().includes(search)));
  };

  const filtered = applySearch(coordinadoresView);
  const rows = filtered.map((c) => [
    c.id, c.username, <span key={c.id} className="font-bold text-slate-400">{c.rol}</span>, renderEstadoBadge(c.activo)
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { username: nuevo.username, password: nuevo.password, rol: 'ROLE_COORDINADOR' };
      // User creation endpoint lacks `/api` according to original App.jsx
      const createApiUrl = (apiService.baseUrl || 'http://localhost:8080') + '/admin/usuarios';
      
      const res = await fetch(createApiUrl, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
         },
         body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('No se pudo crear el coordinador');
      setSuccessData('Coordinador creado correctamente.');
      setMostrarFormulario(false);
      setNuevo({ username: '', password: '' });
      loadData();
    } catch (err) {
      setErrorData(err.message || 'No se pudo crear el coordinador');
    }
  };

  const renderForm = () => {
    if (!mostrarFormulario) return null;
    const inputClass = "w-full rounded-2xl border-2 border-slate-200 bg-slate-50 py-3.5 px-4 text-slate-900 outline-none transition-soft focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 font-medium placeholder:text-slate-400";
    return (
      <form onSubmit={handleSubmit} className="group relative mb-8 grid grid-cols-1 gap-6 rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-premium md:grid-cols-2">
        <div className="md:col-span-2">
          <h3 className="text-xl font-bold font-display text-slate-900 border-l-4 border-indigo-500 pl-4">Alta de Coordinador</h3>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Usuario</label>
          <input type="text" placeholder="ej_coordinador" value={nuevo.username} onChange={(e) => setNuevo({ ...nuevo, username: e.target.value })} className={inputClass} required />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Contraseña segura</label>
          <input type="password" placeholder="••••••••" value={nuevo.password} onChange={(e) => setNuevo({ ...nuevo, password: e.target.value })} className={inputClass} required />
        </div>
        <div className="md:col-span-2 flex gap-3 pt-4">
          <button type="submit" className="rounded-2xl bg-indigo-600 px-6 py-4 font-bold text-white transition hover:bg-indigo-700">Guardar coordinador</button>
          <button type="button" onClick={() => setMostrarFormulario(false)} className="rounded-2xl bg-slate-100 px-6 py-4 font-bold text-slate-600 transition hover:bg-slate-200">Cancelar</button>
        </div>
      </form>
    );
  };

  return (
    <GenericTableView
      title="Coordinadores del Sistema"
      description="Administración de accesos y perfiles de coordinación regional."
      buttonText="Crear coordinador"
      onAddClick={() => setMostrarFormulario(!mostrarFormulario)}
      searchPlaceholder="Buscar por usuario..."
      columns={['ID', 'Usuario', 'Rol', 'Estado']}
      rows={rows}
      onSearchChange={setSearchValue}
      searchValue={searchValue}
      renderForm={renderForm}
    />
  );
}
