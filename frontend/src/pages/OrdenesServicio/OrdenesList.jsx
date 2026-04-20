import React, { useState, useMemo } from 'react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import apiService from '../../services/apiService';
import GenericTableView from '../../components/ui/GenericTableView';
import { Eye } from 'lucide-react';

export default function OrdenesList() {
  const { 
    ordenes, empresas, tecnicos, sedes, loadData, 
    setErrorData, setSuccessData, verDetalleOrden 
  } = useData();
  const { user } = useAuth();
  
  const [searchValue, setSearchValue] = useState('');
  const [filterValue, setFilterValue] = useState('TODOS');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  
  const [nuevaOrden, setNuevaOrden] = useState({
    fechaProgramada: '', estado: 'PROGRAMADA', empresaId: '', tecnicoId: '', sedeId: '',
  });

  const formatearFecha = (fechaArray) => {
    if (!fechaArray || !Array.isArray(fechaArray)) return 'Sin fecha';
    const date = new Date(fechaArray[0], fechaArray[1] - 1, fechaArray[2], fechaArray[3] || 0, fechaArray[4] || 0);
    return date.toLocaleString();
  };

  const empresasMap = useMemo(() => {
    const map = {};
    empresas.forEach((e) => { map[e.id] = e.nombre; });
    return map;
  }, [empresas]);

  const tecnicosMap = useMemo(() => {
    const map = {};
    tecnicos.forEach((t) => { map[t.id] = t.nombre; });
    return map;
  }, [tecnicos]);

  const ordenesView = useMemo(
    () =>
      ordenes.map((orden) => ({
        id: orden.id,
        numero: orden.numeroOrden,
        fecha: formatearFecha(orden.fechaProgramada),
        estado: orden.estado,
        empresa: empresasMap[orden.empresaId] || orden.empresaId || 'Sin empresa',
        tecnico: tecnicosMap[orden.tecnicoId] || orden.tecnicoId || 'Sin técnico',
      })),
    [ordenes, empresasMap, tecnicosMap]
  );

  const applySearch = (rows) => {
    const search = searchValue.toLowerCase().trim();
    if (!search) return rows;
    return rows.filter((row) => Object.values(row).some((val) => String(val).toLowerCase().includes(search)));
  };

  const applyFilter = (rows) => {
    if (!filterValue || filterValue === 'TODOS') return rows;
    return rows.filter((row) => row.estado === filterValue);
  };

  const filteredOrdenes = applyFilter(applySearch(ordenesView));

  const renderEstadoBadge = (estado) => {
    switch (estado) {
      case 'PROGRAMADA': return <span className="inline-flex rounded-full bg-blue-500/10 border border-blue-500/20 px-2 py-1 text-xs font-bold text-blue-600">Programada</span>;
      case 'EN_PROCESO': return <span className="inline-flex rounded-full bg-amber-500/10 border border-amber-500/20 px-2 py-1 text-xs font-bold text-amber-600">En proceso</span>;
      case 'FINALIZADA': return <span className="inline-flex rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 text-xs font-bold text-emerald-600">Finalizada</span>;
      default: return <span className="inline-flex rounded-full bg-slate-100 px-2 py-1 text-xs font-bold text-slate-600">{estado}</span>;
    }
  };

  const cambiarEstadoOrden = async (id, nuevoEstado) => {
    try {
      await apiService.patch(`/ordenes/${id}`, { estado: nuevoEstado });
      setSuccessData(`Orden actualizada a estado ${nuevoEstado}.`);
      loadData();
    } catch (err) {
      setErrorData(err.message || 'Error actualizando estado');
    }
  };

  const renderAccionOrden = (orden) => {
    const btnDetalle = (
      <button
        onClick={() => verDetalleOrden(orden.id)}
        className="flex items-center gap-2 rounded-lg bg-copper-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-copper-700 active:scale-95 whitespace-nowrap"
      >
        <Eye className="w-3.5 h-3.5" />
        Detalle
      </button>
    );

    if (orden.estado === 'FINALIZADA') {
      return btnDetalle;
    }

    const siguientesEstados = {
      PROGRAMADA: 'EN_PROCESO',
      EN_PROCESO: 'FINALIZADA',
    };
    const siguiente = siguientesEstados[orden.estado];
    
    return (
      <div className="flex items-center gap-2">
        {btnDetalle}
        {siguiente && (
          <button
            onClick={() => cambiarEstadoOrden(orden.id, siguiente)}
            className="rounded-lg bg-gunmetal-800/10 px-3 py-1.5 text-xs font-bold text-gunmetal-800 border border-gunmetal-800/20 transition-all hover:bg-gunmetal-900 hover:text-white active:scale-95 whitespace-nowrap"
          >
            Mover a {siguiente}
          </button>
        )}
      </div>
    );
  };

  const rows = filteredOrdenes.map((orden) => [
    orden.id,
    orden.numero,
    orden.fecha,
    renderEstadoBadge(orden.estado),
    orden.empresa,
    orden.tecnico,
    renderAccionOrden(orden),
  ]);

  const crearOrden = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        fechaProgramada: `${nuevaOrden.fechaProgramada}:00`,
        estado: nuevaOrden.estado,
        sedeId: Number(nuevaOrden.sedeId),
        empresaId: Number(nuevaOrden.empresaId),
        tecnicoId: Number(nuevaOrden.tecnicoId),
      };
      await apiService.post('/ordenes', payload);
      setSuccessData('Orden creada correctamente.');
      setMostrarFormulario(false);
      loadData();
    } catch (err) {
      setErrorData(err.message || 'No se pudo crear la orden');
    }
  };

  const renderForm = () => {
    if (!mostrarFormulario) return null;
    const inputClass = "w-full rounded-2xl border-2 border-slate-200 bg-slate-50 py-3.5 px-4 text-slate-900 outline-none transition-soft focus:border-copper-500 focus:bg-white focus:ring-4 focus:ring-copper-500/10 font-medium placeholder:text-slate-400";
    return (
      <form onSubmit={crearOrden} className="grid grid-cols-1 gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-2">
        <input type="datetime-local" value={nuevaOrden.fechaProgramada} onChange={(e) => setNuevaOrden({ ...nuevaOrden, fechaProgramada: e.target.value })} className={inputClass} required />
        <select value={nuevaOrden.estado} onChange={(e) => setNuevaOrden({ ...nuevaOrden, estado: e.target.value })} className={inputClass}><option value="PROGRAMADA">PROGRAMADA</option><option value="EN_PROCESO">EN_PROCESO</option><option value="FINALIZADA">FINALIZADA</option></select>
        <select value={nuevaOrden.empresaId} onChange={(e) => setNuevaOrden({ ...nuevaOrden, empresaId: e.target.value })} className={inputClass} required><option value="">Seleccione empresa</option>{empresas.map((e) => (<option key={e.id} value={e.id}>{e.nombre}</option>))}</select>
        <select value={nuevaOrden.tecnicoId} onChange={(e) => setNuevaOrden({ ...nuevaOrden, tecnicoId: e.target.value })} className={inputClass} required><option value="">Seleccione técnico</option>{tecnicos.map((t) => (<option key={t.id} value={t.id}>{t.nombre}</option>))}</select>
        <select value={nuevaOrden.sedeId} onChange={(e) => setNuevaOrden({ ...nuevaOrden, sedeId: e.target.value })} className={inputClass} required><option value="">Seleccione sede</option>{sedes.map((s) => (<option key={s.id} value={s.id}>{s.nombre}</option>))}</select>
        <div className="md:col-span-2 flex gap-3">
          <button type="submit" className="rounded-2xl bg-copper-600 px-5 py-4 text-sm font-bold text-white transition hover:bg-copper-700 shadow-sm">Guardar Orden</button>
          <button type="button" onClick={() => setMostrarFormulario(false)} className="rounded-2xl bg-slate-100 px-5 py-4 text-sm font-bold text-slate-600 hover:bg-slate-200">Cancelar</button>
        </div>
      </form>
    );
  };

  return (
    <GenericTableView
      title="Órdenes de servicio"
      description="Gestión de órdenes creadas, en proceso y finalizadas."
      buttonText={user?.rol === 'ROLE_TECNICO' ? null : 'Nueva orden'}
      onAddClick={() => setMostrarFormulario(!mostrarFormulario)}
      searchPlaceholder="Buscar por número, empresa o técnico..."
      filterOptions={['TODOS', 'PROGRAMADA', 'EN_PROCESO', 'FINALIZADA']}
      filterLabel="Estado"
      columns={['ID', 'Número', 'Fecha programada', 'Estado', 'Empresa', 'Técnico', 'Acción']}
      rows={rows}
      onSearchChange={setSearchValue}
      onFilterChange={setFilterValue}
      searchValue={searchValue}
      filterValue={filterValue}
      renderForm={renderForm}
    />
  );
}
