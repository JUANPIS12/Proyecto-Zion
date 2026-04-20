import React, { useState, useMemo } from 'react';
import { useData } from '../../contexts/DataContext';
import apiService from '../../services/apiService';
import GenericTableView from '../../components/ui/GenericTableView';
import { formatearFecha, MiniMapa } from '../../utils/helpers';

export default function VisitasList() {
  const { visitas, ordenes, tecnicos, loadData, setErrorData, setSuccessData } = useData();
  
  const [searchValue, setSearchValue] = useState('');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  
  const [nuevaVisita, setNuevaVisita] = useState({
    fechaInicio: '', fechaFin: '', observaciones: '', ubicacionInicio: '', ubicacionFin: '', ordenServicioId: '', tecnicoId: ''
  });

  const ordenesMap = useMemo(() => {
    const map = {};
    ordenes.forEach((o) => { map[o.id] = o.numeroOrden || `Orden #${o.id}`; });
    return map;
  }, [ordenes]);

  const tecnicosMap = useMemo(() => {
    const map = {};
    tecnicos.forEach((t) => { map[t.id] = t.nombre; });
    return map;
  }, [tecnicos]);

  const visitasView = useMemo(() => 
    visitas.map((visita) => ({
      id: visita.id,
      inicio: formatearFecha(visita.fechaInicio),
      fin: formatearFecha(visita.fechaFin),
      orden: ordenesMap[visita.ordenServicioId] || visita.ordenServicioId,
      tecnico: tecnicosMap[visita.tecnicoId] || visita.tecnicoId,
      ubicacionInicio: visita.ubicacionInicio || 'Sin dato',
      ubicacionFin: visita.ubicacionFin || 'Sin dato',
    })),
    [visitas, ordenesMap, tecnicosMap]
  );

  const applySearch = (rows) => {
    const search = searchValue.toLowerCase().trim();
    if (!search) return rows;
    return rows.filter((row) => Object.values(row).some((val) => String(val).toLowerCase().includes(search)));
  };

  const filteredVisitas = applySearch(visitasView);
  const rows = filteredVisitas.map((visita) => Object.values(visita));

  const capturarUbicacion = (tipo) => {
    setErrorData('');
    if (!navigator.geolocation) {
      setErrorData('Tu navegador no soporta geolocalización.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = `${position.coords.latitude},${position.coords.longitude}`;
        if (tipo === 'inicio') setNuevaVisita({ ...nuevaVisita, ubicacionInicio: coords });
        else setNuevaVisita({ ...nuevaVisita, ubicacionFin: coords });
        setSuccessData(`Ubicación capturada: ${coords}`);
      },
      () => setErrorData('Error capturando ubicación'),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const crearVisita = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        fechaInicio: `${nuevaVisita.fechaInicio}:00`,
        fechaFin: `${nuevaVisita.fechaFin}:00`,
        observaciones: nuevaVisita.observaciones || null,
        ubicacionInicio: nuevaVisita.ubicacionInicio || null,
        ubicacionFin: nuevaVisita.ubicacionFin || null,
        ordenServicioId: Number(nuevaVisita.ordenServicioId),
        tecnicoId: Number(nuevaVisita.tecnicoId),
      };
      await apiService.post('/visitas', payload);
      setSuccessData('Visita técnica creada correctamente.');
      setMostrarFormulario(false);
      loadData();
    } catch (err) {
      setErrorData(err.message || 'No se pudo crear la visita');
    }
  };

  const renderForm = () => {
    if (!mostrarFormulario) return null;
    const inputClass = "w-full rounded-2xl border-2 border-slate-200 bg-slate-50 py-3.5 px-4 text-slate-900 outline-none transition-soft focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 font-medium placeholder:text-slate-400";
    const btnClassMap = "rounded-2xl border-2 border-slate-200 bg-white px-5 py-4 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50 active:scale-95 transition-all";
    return (
      <form onSubmit={crearVisita} className="mb-6 grid grid-cols-1 gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-2">
        <input type="datetime-local" value={nuevaVisita.fechaInicio} onChange={(e) => setNuevaVisita({ ...nuevaVisita, fechaInicio: e.target.value })} className={inputClass} required />
        <input type="datetime-local" value={nuevaVisita.fechaFin} onChange={(e) => setNuevaVisita({ ...nuevaVisita, fechaFin: e.target.value })} className={inputClass} required />
        <select value={nuevaVisita.ordenServicioId} onChange={(e) => setNuevaVisita({ ...nuevaVisita, ordenServicioId: e.target.value })} className={inputClass} required><option value="">Seleccione orden</option>{ordenes.map(o => <option key={o.id} value={o.id}>{o.numeroOrden || `Orden #${o.id}`}</option>)}</select>
        <select value={nuevaVisita.tecnicoId} onChange={(e) => setNuevaVisita({ ...nuevaVisita, tecnicoId: e.target.value })} className={inputClass} required><option value="">Seleccione técnico</option>{tecnicos.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}</select>
        <textarea placeholder="Observaciones" value={nuevaVisita.observaciones} onChange={(e) => setNuevaVisita({ ...nuevaVisita, observaciones: e.target.value })} className={`${inputClass} md:col-span-2`} rows={3} />
        <input type="text" placeholder="Ubicación inicio" value={nuevaVisita.ubicacionInicio} onChange={(e) => setNuevaVisita({ ...nuevaVisita, ubicacionInicio: e.target.value })} className={inputClass} />
        <input type="text" placeholder="Ubicación fin" value={nuevaVisita.ubicacionFin} onChange={(e) => setNuevaVisita({ ...nuevaVisita, ubicacionFin: e.target.value })} className={inputClass} />
        <div className="flex gap-3 md:col-span-2">
          <button type="button" onClick={() => capturarUbicacion('inicio')} className={btnClassMap}>Capturar ubicación inicio</button>
          <button type="button" onClick={() => capturarUbicacion('fin')} className={btnClassMap}>Capturar ubicación fin</button>
        </div>
        <div className="grid grid-cols-1 gap-4 md:col-span-2 md:grid-cols-2">
          <MiniMapa coordenadas={nuevaVisita.ubicacionInicio} titulo="Mapa ubicación inicio" />
          <MiniMapa coordenadas={nuevaVisita.ubicacionFin} titulo="Mapa ubicación fin" />
        </div>
        <div className="md:col-span-2 flex gap-3 mt-4">
          <button type="submit" className="rounded-2xl bg-blue-600 px-6 py-4 font-bold text-white transition hover:bg-blue-700">Guardar visita</button>
          <button type="button" onClick={() => setMostrarFormulario(false)} className="rounded-2xl bg-slate-100 px-6 py-4 font-bold text-slate-600 transition hover:bg-slate-200">Cancelar</button>
        </div>
      </form>
    );
  };

  return (
    <GenericTableView
      title="Visitas técnicas"
      description="Planeación y seguimiento de visitas programadas a planta."
      buttonText="Nueva visita"
      onAddClick={() => setMostrarFormulario(!mostrarFormulario)}
      searchPlaceholder="Buscar por orden, técnico o ubicación..."
      columns={['ID', 'Inicio', 'Fin', 'Orden', 'Técnico', 'Ubicación inicio', 'Ubicación fin']}
      rows={rows}
      onSearchChange={setSearchValue}
      searchValue={searchValue}
      renderForm={renderForm}
    />
  );
}
