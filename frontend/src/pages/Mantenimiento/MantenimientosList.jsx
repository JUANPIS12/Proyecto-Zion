import React, { useState, useMemo } from 'react';
import { useData } from '../../contexts/DataContext';
import apiService from '../../services/apiService';
import GenericTableView from '../../components/ui/GenericTableView';
import { formatearFecha, renderTipoBadge } from '../../utils/helpers';

export default function MantenimientosList() {
  const { mantenimientos, ordenes, equipos, loadData, setErrorData, setSuccessData } = useData();
  
  const [searchValue, setSearchValue] = useState('');
  const [filterValue, setFilterValue] = useState('TODOS');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  
  const [nuevo, setNuevo] = useState({
    tipo: 'PREVENTIVO', descripcion: '', fechaInicio: '', fechaFin: '', ordenServicioId: '', 
    equipoId: '', condicionInicial: '', tecnologiaAsociada: '', tipoContrato: '', novedades: '', estadoFinal: ''
  });

  const ordenesMap = useMemo(() => {
    const map = {};
    ordenes.forEach((o) => { map[o.id] = o.numeroOrden || `Orden #${o.id}`; });
    return map;
  }, [ordenes]);

  const equiposMap = useMemo(() => {
    const map = {};
    equipos.forEach((e) => { map[e.id] = e.serial || `Equipo #${e.id}`; });
    return map;
  }, [equipos]);

  const viewData = useMemo(() => 
    mantenimientos.map((m) => ({
      id: m.id,
      tipo: m.tipo,
      descripcion: m.descripcion || 'Sin descripción',
      condicionInicial: m.condicionInicial || 'Sin dato',
      novedades: m.novedades || 'Sin dato',
      estadoFinal: m.estadoFinal || 'Sin dato',
      fechaInicio: formatearFecha(m.fechaInicio),
      fechaFin: formatearFecha(m.fechaFin),
      orden: ordenesMap[m.ordenServicioId] || m.ordenServicioId,
      equipo: equiposMap[m.equipoId] || m.equipoId,
    })),
    [mantenimientos, ordenesMap, equiposMap]
  );

  const applyFilter = (rows) => {
    if (!filterValue || filterValue === 'TODOS') return rows;
    return rows.filter((row) => row.tipo === filterValue);
  };

  const applySearch = (rows) => {
    const search = searchValue.toLowerCase().trim();
    if (!search) return rows;
    return rows.filter((row) => Object.values(row).some((val) => String(val).toLowerCase().includes(search)));
  };

  const filtered = applySearch(applyFilter(viewData));
  
  const rows = filtered.map((m) => [
    m.id, renderTipoBadge(m.tipo), m.descripcion, m.condicionInicial, 
    m.novedades, m.estadoFinal, m.fechaInicio, m.fechaFin, m.orden, m.equipo
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        tipo: nuevo.tipo,
        descripcion: nuevo.descripcion || null,
        fechaInicio: `${nuevo.fechaInicio}:00`,
        fechaFin: `${nuevo.fechaFin}:00`,
        ordenServicioId: Number(nuevo.ordenServicioId),
        equipoId: Number(nuevo.equipoId),
        condicionInicial: nuevo.condicionInicial || null,
        tecnologiaAsociada: nuevo.tecnologiaAsociada || null,
        tipoContrato: nuevo.tipoContrato || null,
        novedades: nuevo.novedades || null,
        estadoFinal: nuevo.estadoFinal || null,
      };
      await apiService.post('/mantenimientos', payload);
      setSuccessData('Mantenimiento creado correctamente.');
      setMostrarFormulario(false);
      loadData();
    } catch (err) {
      setErrorData(err.message || 'No se pudo crear el mantenimiento');
    }
  };

  const renderForm = () => {
    if (!mostrarFormulario) return null;
    const inputClass = "w-full rounded-2xl border-2 border-slate-200 bg-slate-50 py-3.5 px-4 text-slate-900 outline-none transition-soft focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 font-medium placeholder:text-slate-400";
    return (
      <form onSubmit={handleSubmit} className="mb-6 grid grid-cols-1 gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-2">
        <select value={nuevo.tipo} onChange={(e) => setNuevo({ ...nuevo, tipo: e.target.value })} className={inputClass}><option value="PREVENTIVO">PREVENTIVO</option><option value="CORRECTIVO">CORRECTIVO</option></select>
        <select value={nuevo.ordenServicioId} onChange={(e) => setNuevo({ ...nuevo, ordenServicioId: e.target.value })} className={inputClass} required><option value="">Seleccione orden</option>{ordenes.map(o => <option key={o.id} value={o.id}>{o.numeroOrden || `Orden #${o.id}`}</option>)}</select>
        <select value={nuevo.equipoId} onChange={(e) => setNuevo({ ...nuevo, equipoId: e.target.value })} className={inputClass} required><option value="">Seleccione equipo</option>{equipos.map(eq => <option key={eq.id} value={eq.id}>{eq.serial || `Equipo #${eq.id}`}</option>)}</select>
        <input type="datetime-local" value={nuevo.fechaInicio} onChange={(e) => setNuevo({ ...nuevo, fechaInicio: e.target.value })} className={inputClass} required />
        <input type="datetime-local" value={nuevo.fechaFin} onChange={(e) => setNuevo({ ...nuevo, fechaFin: e.target.value })} className={inputClass} required />
        <textarea placeholder="Descripción" value={nuevo.descripcion} onChange={(e) => setNuevo({ ...nuevo, descripcion: e.target.value })} className={`${inputClass} md:col-span-2`} rows={3} />
        <input type="text" placeholder="Condición Inicial" value={nuevo.condicionInicial} onChange={(e) => setNuevo({ ...nuevo, condicionInicial: e.target.value })} className={inputClass} />
        <input type="text" placeholder="Tecnología Asociada" value={nuevo.tecnologiaAsociada} onChange={(e) => setNuevo({ ...nuevo, tecnologiaAsociada: e.target.value })} className={inputClass} />
        <input type="text" placeholder="Tipo de Contrato" value={nuevo.tipoContrato} onChange={(e) => setNuevo({ ...nuevo, tipoContrato: e.target.value })} className={inputClass} />
        <input type="text" placeholder="Estado Final" value={nuevo.estadoFinal} onChange={(e) => setNuevo({ ...nuevo, estadoFinal: e.target.value })} className={inputClass} />
        <textarea placeholder="Novedades (Trazabilidad)" value={nuevo.novedades} onChange={(e) => setNuevo({ ...nuevo, novedades: e.target.value })} className={`${inputClass} md:col-span-2`} rows={2} />
        <div className="md:col-span-2 flex gap-3 mt-4">
          <button type="submit" className="rounded-2xl bg-blue-600 px-6 py-4 font-bold text-white transition hover:bg-blue-700">Guardar mantenimiento</button>
          <button type="button" onClick={() => setMostrarFormulario(false)} className="rounded-2xl bg-slate-100 px-6 py-4 font-bold text-slate-600 transition hover:bg-slate-200">Cancelar</button>
        </div>
      </form>
    );
  };

  return (
    <GenericTableView
      title="Mantenimientos"
      description="Control de mantenimientos preventivos y correctivos."
      buttonText="Nuevo mantenimiento"
      onAddClick={() => setMostrarFormulario(!mostrarFormulario)}
      searchPlaceholder="Buscar por tipo, descripción, orden o equipo..."
      filterOptions={['TODOS', 'PREVENTIVO', 'CORRECTIVO']}
      filterLabel="Tipo"
      columns={['ID', 'Tipo', 'Descripción', 'Condición Inicial', 'Novedades', 'Estado Final', 'Inicio', 'Fin', 'Orden', 'Equipo']}
      rows={rows}
      onSearchChange={setSearchValue}
      onFilterChange={setFilterValue}
      searchValue={searchValue}
      filterValue={filterValue}
      renderForm={renderForm}
    />
  );
}
