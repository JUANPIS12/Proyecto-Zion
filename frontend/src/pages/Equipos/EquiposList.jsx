import React, { useState, useMemo } from 'react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import apiService from '../../services/apiService';
import GenericTableView from '../../components/ui/GenericTableView';
import { renderEstadoBadge } from '../../utils/helpers';

export default function EquiposList() {
  const { equipos, empresas, tecnologias, sedes, loadData, setErrorData, setSuccessData } = useData();
  const { user } = useAuth();
  
  const [searchValue, setSearchValue] = useState('');
  const [filterValue, setFilterValue] = useState('TODOS');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  
  const [nuevo, setNuevo] = useState({
    serial: '', referencia: '', ciudadActual: '', plantaActual: '', areaActual: '', 
    lineaActual: '', estado: 'ACTIVO', empresaId: '', sedeId: '', tecnologiaId: ''
  });

  const empresasMap = useMemo(() => {
    const map = {};
    empresas.forEach((e) => { map[e.id] = e.nombre; });
    return map;
  }, [empresas]);

  const tecnologiasMap = useMemo(() => {
    const map = {};
    tecnologias.forEach((t) => { map[t.id] = t.nombre; });
    return map;
  }, [tecnologias]);

  const viewData = useMemo(() => 
    equipos.map((eq) => ({
      id: eq.id,
      serial: eq.serial,
      referencia: eq.referencia || 'Sin referencia',
      empresa: empresasMap[eq.empresaId] || eq.empresaId || 'Sin empresa',
      tecnologia: tecnologiasMap[eq.tecnologiaId] || eq.tecnologiaId || 'Sin tecnología',
      estado: eq.estado || 'Sin estado'
    })),
    [equipos, empresasMap, tecnologiasMap]
  );

  const applyFilter = (rows) => {
    if (!filterValue || filterValue === 'TODOS') return rows;
    return rows.filter((row) => row.estado === filterValue);
  };

  const applySearch = (rows) => {
    const search = searchValue.toLowerCase().trim();
    if (!search) return rows;
    return rows.filter((row) => Object.values(row).some((val) => String(val).toLowerCase().includes(search)));
  };

  const filtered = applySearch(applyFilter(viewData));
  
  const rows = filtered.map((eq) => [
    eq.id, eq.serial, eq.referencia, eq.empresa, eq.tecnologia, renderEstadoBadge(eq.estado)
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...nuevo, 
        sedeId: Number(nuevo.sedeId), 
        empresaId: Number(nuevo.empresaId), 
        tecnologiaId: Number(nuevo.tecnologiaId) 
      };
      await apiService.post('/equipos', payload);
      setSuccessData('Equipo creado correctamente.');
      setMostrarFormulario(false);
      loadData();
    } catch (err) {
      setErrorData(err.message || 'No se pudo crear el equipo');
    }
  };

  const renderForm = () => {
    if (!mostrarFormulario) return null;
    const inputClass = "w-full rounded-2xl border-2 border-slate-200 bg-slate-50 py-3.5 px-4 text-slate-900 outline-none transition-soft focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 font-medium placeholder:text-slate-400";
    return (
      <form onSubmit={handleSubmit} className="mb-6 grid grid-cols-1 gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-2">
        <input type="text" placeholder="Serial" value={nuevo.serial} onChange={(e) => setNuevo({ ...nuevo, serial: e.target.value })} className={inputClass} required />
        <input type="text" placeholder="Referencia" value={nuevo.referencia} onChange={(e) => setNuevo({ ...nuevo, referencia: e.target.value })} className={inputClass} />
        <input type="text" placeholder="Ciudad actual" value={nuevo.ciudadActual} onChange={(e) => setNuevo({ ...nuevo, ciudadActual: e.target.value })} className={inputClass} />
        <input type="text" placeholder="Planta actual" value={nuevo.plantaActual} onChange={(e) => setNuevo({ ...nuevo, plantaActual: e.target.value })} className={inputClass} />
        <input type="text" placeholder="Área actual" value={nuevo.areaActual} onChange={(e) => setNuevo({ ...nuevo, areaActual: e.target.value })} className={inputClass} />
        <input type="text" placeholder="Línea actual" value={nuevo.lineaActual} onChange={(e) => setNuevo({ ...nuevo, lineaActual: e.target.value })} className={inputClass} />
        <select value={nuevo.estado} onChange={(e) => setNuevo({ ...nuevo, estado: e.target.value })} className={inputClass}>
          <option value="ACTIVO">ACTIVO</option><option value="INACTIVO">INACTIVO</option><option value="MANTENIMIENTO">MANTENIMIENTO</option>
        </select>
        <select value={nuevo.empresaId} onChange={(e) => setNuevo({ ...nuevo, empresaId: e.target.value })} className={inputClass} required>
          <option value="">Seleccione empresa</option>{empresas.map(e => <option key={e.id} value={e.id}>{e.nombre}</option>)}
        </select>
        <select value={nuevo.sedeId} onChange={(e) => setNuevo({ ...nuevo, sedeId: e.target.value })} className={inputClass} required>
          <option value="">Seleccione sede</option>{sedes.map(s => <option key={s.id} value={s.id}>{s.nombre}</option>)}
        </select>
        <select value={nuevo.tecnologiaId} onChange={(e) => setNuevo({ ...nuevo, tecnologiaId: e.target.value })} className={inputClass} required>
          <option value="">Seleccione tecnología</option>{tecnologias.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}
        </select>
        <div className="md:col-span-2 flex gap-3 mt-4">
          <button type="submit" className="rounded-2xl bg-blue-600 px-6 py-4 font-bold text-white transition hover:bg-blue-700">Guardar equipo</button>
          <button type="button" onClick={() => setMostrarFormulario(false)} className="rounded-2xl bg-slate-100 px-6 py-4 font-bold text-slate-600 transition hover:bg-slate-200">Cancelar</button>
        </div>
      </form>
    );
  };

  return (
    <GenericTableView
      title="Equipos"
      description="Inventario de equipos disponibles e instalados."
      buttonText={user?.rol === 'ROLE_TECNICO' ? null : 'Nuevo equipo'}
      onAddClick={() => setMostrarFormulario(!mostrarFormulario)}
      searchPlaceholder="Buscar por serial, referencia, empresa o tecnología..."
      filterOptions={['TODOS', 'ACTIVO', 'INACTIVO', 'MANTENIMIENTO']}
      filterLabel="Estado"
      columns={['ID', 'Serial', 'Referencia', 'Empresa', 'Tecnología', 'Estado']}
      rows={rows}
      onSearchChange={setSearchValue}
      onFilterChange={setFilterValue}
      searchValue={searchValue}
      filterValue={filterValue}
      renderForm={renderForm}
    />
  );
}
