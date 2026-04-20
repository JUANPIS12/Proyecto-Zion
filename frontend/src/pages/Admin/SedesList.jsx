import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import apiService from '../../services/apiService';
import GenericTableView from '../../components/ui/GenericTableView';

export default function SedesList() {
  const { sedes, loadData, setErrorData, setSuccessData } = useData();
  
  const [searchValue, setSearchValue] = useState('');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [nuevaSede, setNuevaSede] = useState({ nombre: '', ciudad: '', direccion: '' });

  const applySearch = (rows) => {
    const search = searchValue.toLowerCase().trim();
    if (!search) return rows;
    return rows.filter((row) => Object.values(row).some((val) => String(val).toLowerCase().includes(search)));
  };

  const filtered = applySearch(sedes);
  const rows = filtered.map((s) => [s.id, s.nombre, s.ciudad || 'Sin dato', s.direccion || 'Sin dato']);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiService.post('/sedes', nuevaSede);
      setSuccessData('Sede creada correctamente.');
      setMostrarFormulario(false);
      setNuevaSede({ nombre: '', ciudad: '', direccion: '' });
      loadData();
    } catch (err) {
      setErrorData(err.message || 'No se pudo crear la sede');
    }
  };

  const renderForm = () => {
    if (!mostrarFormulario) return null;
    const inputClass = "w-full rounded-2xl border-2 border-slate-200 bg-slate-50 py-3.5 px-4 text-slate-900 outline-none transition-soft focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 font-medium placeholder:text-slate-400";
    return (
      <form onSubmit={handleSubmit} className="group relative mb-8 grid grid-cols-1 gap-6 rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-premium md:grid-cols-2">
        <div className="md:col-span-2">
          <h3 className="text-xl font-bold font-display text-slate-900 border-l-4 border-blue-500 pl-4">Registro de Nueva Sede</h3>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Nombre</label>
          <input type="text" placeholder="Ej. Sede Norte Principal" value={nuevaSede.nombre} onChange={(e) => setNuevaSede({ ...nuevaSede, nombre: e.target.value })} className={inputClass} required />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Ciudad</label>
          <input type="text" placeholder="Ej. Bogotá" value={nuevaSede.ciudad} onChange={(e) => setNuevaSede({ ...nuevaSede, ciudad: e.target.value })} className={inputClass} />
        </div>
        <div className="space-y-2 md:col-span-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Dirección Exacta</label>
          <input type="text" placeholder="Calle 123 # 45 - 67" value={nuevaSede.direccion} onChange={(e) => setNuevaSede({ ...nuevaSede, direccion: e.target.value })} className={inputClass} />
        </div>
        <div className="md:col-span-2 flex gap-3 pt-4">
          <button type="submit" className="rounded-2xl bg-blue-600 px-6 py-4 font-bold text-white transition hover:bg-blue-700">Guardar sede</button>
          <button type="button" onClick={() => setMostrarFormulario(false)} className="rounded-2xl bg-slate-100 px-6 py-4 font-bold text-slate-600 transition hover:bg-slate-200">Cancelar</button>
        </div>
      </form>
    );
  };

  return (
    <GenericTableView
      title="Gestión de Sedes"
      description="Control centralizado de ubicaciones físicas y bases operativas."
      buttonText="Registrar sede"
      onAddClick={() => setMostrarFormulario(!mostrarFormulario)}
      searchPlaceholder="Buscar por nombre o ciudad..."
      columns={['ID', 'Nombre', 'Ciudad', 'Dirección']}
      rows={rows}
      onSearchChange={setSearchValue}
      searchValue={searchValue}
      renderForm={renderForm}
    />
  );
}
