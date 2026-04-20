import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import apiService from '../../services/apiService';
import GenericTableView from '../../components/ui/GenericTableView';

export default function TecnologiasList() {
  const { tecnologias, loadData, setErrorData, setSuccessData } = useData();
  
  const [searchValue, setSearchValue] = useState('');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [nuevaTecnologia, setNuevaTecnologia] = useState({ nombre: '' });

  const applySearch = (rows) => {
    const search = searchValue.toLowerCase().trim();
    if (!search) return rows;
    return rows.filter((row) => row.nombre.toLowerCase().includes(search));
  };

  const filtered = applySearch(tecnologias);

  const eliminarTecnologia = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta tecnología?')) return;
    try {
      await apiService.delete(`/tecnologias/${id}`);
      setSuccessData('Tecnología eliminada correctamente.');
      loadData();
    } catch (err) {
      setErrorData(err.message || 'No se pudo eliminar la tecnología');
    }
  };

  const rows = filtered.map((tec) => [
    tec.id, 
    tec.nombre,
    <button
      key={`del-${tec.id}`}
      onClick={() => eliminarTecnologia(tec.id)}
      className="rounded-lg bg-rose-500/10 px-3 py-1.5 text-xs font-bold text-rose-500 hover:bg-rose-500 hover:text-white transition-all"
    >
      Borrar
    </button>
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiService.post('/tecnologias', nuevaTecnologia);
      setSuccessData('Tecnología creada correctamente.');
      setMostrarFormulario(false);
      setNuevaTecnologia({ nombre: '' });
      loadData();
    } catch (err) {
      setErrorData(err.message || 'No se pudo crear la tecnología');
    }
  };

  const renderForm = () => {
    if (!mostrarFormulario) return null;
    const inputClass = "w-full rounded-2xl border-2 border-slate-200 bg-slate-50 py-3.5 px-4 text-slate-900 outline-none transition-soft focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 font-medium placeholder:text-slate-400";
    return (
      <form onSubmit={handleSubmit} className="mb-6 grid grid-cols-1 gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">
            Nombre de la Tecnología
          </label>
          <input
            type="text"
            placeholder="Ej: Mecánica, Electrónica, PLC..."
            value={nuevaTecnologia.nombre}
            onChange={(e) => setNuevaTecnologia({ nombre: e.target.value })}
            className={inputClass}
            required
          />
        </div>
        <div className="md:col-span-2 flex gap-3 mt-4">
          <button type="submit" className="rounded-2xl bg-blue-600 px-6 py-4 font-bold text-white transition hover:bg-blue-700">Guardar tecnología</button>
          <button type="button" onClick={() => setMostrarFormulario(false)} className="rounded-2xl bg-slate-100 px-6 py-4 font-bold text-slate-600 transition hover:bg-slate-200">Cancelar</button>
        </div>
      </form>
    );
  };

  return (
    <GenericTableView
      title="Tecnologías"
      description="Gestión del catálogo de tecnologías y habilidades."
      buttonText="Nueva tecnología"
      onAddClick={() => setMostrarFormulario(!mostrarFormulario)}
      searchPlaceholder="Buscar tecnología..."
      columns={['ID', 'Nombre', 'Acciones']}
      rows={rows}
      onSearchChange={setSearchValue}
      searchValue={searchValue}
      renderForm={renderForm}
    />
  );
}
