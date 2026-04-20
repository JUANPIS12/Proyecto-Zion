import React, { useState, useMemo } from 'react';
import { useData } from '../../contexts/DataContext';
import apiService from '../../services/apiService';
import GenericTableView from '../../components/ui/GenericTableView';

export default function ClientesList() {
  const { empresas, sedes, tecnologias, loadData, setErrorData, setSuccessData } = useData();
  
  const [searchValue, setSearchValue] = useState('');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  
  const [nuevo, setNuevo] = useState({
    nombre: '', ciudad: '', direccion: '', contacto: '', estado: 'ACTIVO', sedeId: '', tecnologiaIds: []
  });

  const sedesMap = useMemo(() => {
    const map = {};
    sedes.forEach((s) => { map[s.id] = s.nombre; });
    return map;
  }, [sedes]);

  const viewData = useMemo(() => 
    empresas.map((emp) => ({
      id: emp.id,
      nombre: emp.nombre,
      sede: sedesMap[emp.sedeId] || emp.sedeId || 'Sin sede',
      tecnologias: emp.tecnologias?.join(', ') || 'Sin tecnologías',
    })),
    [empresas, sedesMap]
  );

  const applySearch = (rows) => {
    const search = searchValue.toLowerCase().trim();
    if (!search) return rows;
    return rows.filter((row) => Object.values(row).some((val) => String(val).toLowerCase().includes(search)));
  };

  const filtered = applySearch(viewData);
  const rows = filtered.map((emp) => [emp.id, emp.nombre, emp.sede, emp.tecnologias]);

  const toggleTecnologia = (id) => {
    const existe = nuevo.tecnologiaIds.includes(id);
    setNuevo({
      ...nuevo,
      tecnologiaIds: existe ? nuevo.tecnologiaIds.filter((item) => item !== id) : [...nuevo.tecnologiaIds, id]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...nuevo, sedeId: Number(nuevo.sedeId) };
      await apiService.post('/empresas', payload);
      setSuccessData('Cliente creado correctamente.');
      setMostrarFormulario(false);
      loadData();
    } catch (err) {
      setErrorData(err.message || 'No se pudo crear el cliente');
    }
  };

  const renderForm = () => {
    if (!mostrarFormulario) return null;
    const inputClass = "w-full rounded-2xl border-2 border-slate-200 bg-slate-50 py-3.5 px-4 text-slate-900 outline-none transition-soft focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 font-medium placeholder:text-slate-400";
    return (
      <form onSubmit={handleSubmit} className="mb-6 grid grid-cols-1 gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-2">
        <input type="text" placeholder="Nombre de la empresa" value={nuevo.nombre} onChange={(e) => setNuevo({ ...nuevo, nombre: e.target.value })} className={inputClass} required />
        <input type="text" placeholder="Ciudad" value={nuevo.ciudad} onChange={(e) => setNuevo({ ...nuevo, ciudad: e.target.value })} className={inputClass} />
        <input type="text" placeholder="Dirección" value={nuevo.direccion} onChange={(e) => setNuevo({ ...nuevo, direccion: e.target.value })} className={inputClass} />
        <input type="text" placeholder="Contacto" value={nuevo.contacto} onChange={(e) => setNuevo({ ...nuevo, contacto: e.target.value })} className={inputClass} />
        <select value={nuevo.estado} onChange={(e) => setNuevo({ ...nuevo, estado: e.target.value })} className={inputClass}>
          <option value="ACTIVO">ACTIVO</option><option value="INACTIVO">INACTIVO</option>
        </select>
        <select value={nuevo.sedeId} onChange={(e) => setNuevo({ ...nuevo, sedeId: e.target.value })} className={inputClass} required>
          <option value="">Seleccione sede</option>{sedes.map(s => <option key={s.id} value={s.id}>{s.nombre}</option>)}
        </select>
        <div className="md:col-span-2">
          <p className="mb-3 font-semibold text-slate-800">Tecnologías (Contexto Empresa)</p>
          <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
            {tecnologias.map((tec) => (
              <label key={tec.id} className="flex items-center gap-2 rounded-2xl border border-slate-200 p-3 cursor-pointer">
                <input type="checkbox" checked={nuevo.tecnologiaIds.includes(tec.id)} onChange={() => toggleTecnologia(tec.id)} />
                <span>{tec.nombre}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="md:col-span-2 flex gap-3 mt-4">
          <button type="submit" className="rounded-2xl bg-blue-600 px-6 py-4 font-bold text-white transition hover:bg-blue-700">Guardar cliente</button>
          <button type="button" onClick={() => setMostrarFormulario(false)} className="rounded-2xl bg-slate-100 px-6 py-4 font-bold text-slate-600 transition hover:bg-slate-200">Cancelar</button>
        </div>
      </form>
    );
  };

  return (
    <GenericTableView
      title="Clientes"
      description="Empresas registradas y perfiles de operaciones asociadas."
      buttonText="Nuevo cliente"
      onAddClick={() => setMostrarFormulario(!mostrarFormulario)}
      searchPlaceholder="Buscar por nombre, sede o tecnología..."
      columns={['ID', 'Nombre', 'Sede', 'Tecnologías']}
      rows={rows}
      onSearchChange={setSearchValue}
      searchValue={searchValue}
      renderForm={renderForm}
    />
  );
}
