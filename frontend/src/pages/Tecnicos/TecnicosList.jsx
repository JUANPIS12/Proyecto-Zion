import React, { useState, useMemo } from 'react';
import { useData } from '../../contexts/DataContext';
import apiService from '../../services/apiService';
import GenericTableView from '../../components/ui/GenericTableView';

export default function TecnicosList() {
  const { tecnicos, sedes, tecnologias, loadData, setErrorData, setSuccessData } = useData();
  
  const [searchValue, setSearchValue] = useState('');
  const [filterValue, setFilterValue] = useState('TODOS');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mostrarFormularioEdicion, setMostrarFormularioEdicion] = useState(false);
  const [tecnicoAEditar, setTecnicoAEditar] = useState(null);

  const [nuevoTecnico, setNuevoTecnico] = useState({
    nombre: '', documento: '', telefono: '', email: '', sedeId: '', tecnologiaIds: [], username: '', password: '',
  });

  const sedesMap = useMemo(() => {
    const map = {};
    sedes.forEach((s) => { map[s.id] = s.nombre; });
    return map;
  }, [sedes]);

  const tecnicosView = useMemo(
    () =>
      tecnicos.map((tecnico) => ({
        id: tecnico.id,
        nombre: tecnico.nombre,
        sede: tecnico.sedeNombre || sedesMap[tecnico.sedeId] || 'Sin sede',
        tecnologias: tecnico.tecnologias?.join(', ') || 'Sin tecnologías',
      })),
    [tecnicos, sedesMap]
  );

  const applySearch = (rows) => {
    const search = searchValue.toLowerCase().trim();
    if (!search) return rows;
    return rows.filter((row) => Object.values(row).some((val) => String(val).toLowerCase().includes(search)));
  };

  const filteredTecnicos = applySearch(tecnicosView);

  const eliminarTecnico = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este técnico?')) return;
    try {
      await apiService.delete(`/tecnicos/${id}`);
      setSuccessData('Técnico eliminado correctamente.');
      loadData();
    } catch (err) {
      setErrorData(err.message || 'No se pudo eliminar el técnico');
    }
  };

  const prepararEdicionTecnico = (tecnicoViewItem) => {
    const tReal = tecnicos.find(t => t.id === tecnicoViewItem.id);
    if (!tReal) return;
    setTecnicoAEditar({
      ...tReal,
      tecnologiaIds: tReal.tecnologias?.map(t => {
        const found = tecnologias.find(tec => tec.nombre === (typeof t === 'string' ? t : t.nombre));
        return found ? found.id : null;
      }).filter(id => id !== null) || []
    });
    setMostrarFormularioEdicion(true);
    setMostrarFormulario(false);
  };

  const rows = filteredTecnicos.map((tecnico) => [
    tecnico.id,
    tecnico.nombre,
    tecnico.sede,
    tecnico.tecnologias,
    <div key={tecnico.id} className="flex gap-2">
      <button onClick={() => prepararEdicionTecnico(tecnico)} className="rounded-lg bg-indigo-500/10 px-3 py-1.5 text-xs font-bold text-indigo-500 hover:bg-indigo-50 hover:text-indigo-600 transition-all">Editar</button>
      <button onClick={() => eliminarTecnico(tecnico.id)} className="rounded-lg bg-rose-500/10 px-3 py-1.5 text-xs font-bold text-rose-500 hover:bg-rose-500 hover:text-white transition-all">Borrar</button>
    </div>
  ]);

  const guardarNuevoTecnico = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        nombre: nuevoTecnico.nombre,
        documento: nuevoTecnico.documento || null,
        telefono: nuevoTecnico.telefono || null,
        email: nuevoTecnico.email || null,
        sedeId: Number(nuevoTecnico.sedeId),
        tecnologiaIds: nuevoTecnico.tecnologiaIds,
      };
      await apiService.post('/tecnicos', payload);
      
      const userPayload = { username: nuevoTecnico.username, password: nuevoTecnico.password, rol: 'ROLE_TECNICO' };
      try {
        await apiService.post((apiService.baseUrl || 'http://localhost:8080') + '/admin/usuarios', userPayload);
      } catch (err) {
         console.warn("User already created or not able to link", err);
      }
      setSuccessData('Técnico creado correctamente.');
      setMostrarFormulario(false);
      loadData();
    } catch (err) {
      setErrorData(err.message || 'No se pudo crear el técnico');
    }
  };

  const actualizarTecnico = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        nombre: tecnicoAEditar.nombre,
        documento: tecnicoAEditar.documento,
        telefono: tecnicoAEditar.telefono,
        email: tecnicoAEditar.email,
        sedeId: Number(tecnicoAEditar.sedeId),
        tecnologiaIds: tecnicoAEditar.tecnologiaIds,
      };
      await apiService.patch(`/tecnicos/${tecnicoAEditar.id}`, payload);
      setSuccessData('Técnico actualizado correctamente.');
      setMostrarFormularioEdicion(false);
      setTecnicoAEditar(null);
      loadData();
    } catch (err) {
      setErrorData(err.message || 'No se pudo actualizar el técnico');
    }
  };

  const renderFormTemplate = (obj, setObj, submitAction, title, isEdit = false) => {
    const inputClass = "w-full rounded-2xl border-2 border-slate-200 bg-slate-50 py-3.5 px-4 text-slate-900 outline-none transition-soft focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 font-medium placeholder:text-slate-400";
    return (
      <form onSubmit={submitAction} className="mb-8 grid grid-cols-1 gap-6 rounded-[2.5rem] border-2 border-indigo-500/20 bg-indigo-50/10 p-8 shadow-premium md:grid-cols-2">
         <div className="md:col-span-2"><h3 className="text-xl font-bold">{title}</h3></div>
         <input type="text" placeholder="Nombre completo" value={obj.nombre} onChange={(e) => setObj({...obj, nombre: e.target.value})} className={inputClass} required />
         <input type="text" placeholder="Documento" value={obj.documento || ''} onChange={(e) => setObj({...obj, documento: e.target.value})} className={inputClass} />
         <input type="text" placeholder="Teléfono" value={obj.telefono || ''} onChange={(e) => setObj({...obj, telefono: e.target.value})} className={inputClass} />
         <input type="email" placeholder="Email" value={obj.email || ''} onChange={(e) => setObj({...obj, email: e.target.value})} className={inputClass} />
         <select value={obj.sedeId || ''} onChange={(e) => setObj({...obj, sedeId: e.target.value})} className={inputClass} required>
           <option value="">Seleccione sede</option>
           {sedes.map((s) => <option key={s.id} value={s.id}>{s.nombre}</option>)}
         </select>
         
         {!isEdit && (
            <div className="md:col-span-2 grid md:grid-cols-2 gap-4">
               <input type="text" placeholder="Usuario" value={obj.username || ''} onChange={(e) => setObj({...obj, username: e.target.value})} className={inputClass} required />
               <input type="password" placeholder="Contraseña" value={obj.password || ''} onChange={(e) => setObj({...obj, password: e.target.value})} className={inputClass} required />
            </div>
         )}

         <div className="md:col-span-2">
            <p className="mb-3 font-semibold text-slate-800">Tecnologías (Habilidades)</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {tecnologias.map((tec) => (
                <label key={tec.id} className="flex items-center gap-2 rounded-2xl border bg-white p-3 cursor-pointer">
                  <input type="checkbox" checked={obj.tecnologiaIds.includes(tec.id)} onChange={() => {
                      const existe = obj.tecnologiaIds.includes(tec.id);
                      setObj({...obj, tecnologiaIds: existe ? obj.tecnologiaIds.filter(i => i !== tec.id) : [...obj.tecnologiaIds, tec.id]});
                  }} />
                  <span className="font-semibold text-sm">{tec.nombre}</span>
                </label>
              ))}
            </div>
         </div>
         <div className="md:col-span-2 flex gap-3 mt-4">
            <button type="submit" className="rounded-2xl bg-indigo-600 px-6 py-4 font-bold text-white transition hover:bg-indigo-700">Guardar</button>
            <button type="button" onClick={() => { setMostrarFormulario(false); setMostrarFormularioEdicion(false); }} className="rounded-2xl bg-slate-100 px-6 py-4 font-bold text-slate-600 transition hover:bg-slate-200">Cancelar</button>
         </div>
      </form>
    )
  };

  const renderForm = () => {
     if (mostrarFormularioEdicion && tecnicoAEditar) {
        return renderFormTemplate(tecnicoAEditar, setTecnicoAEditar, actualizarTecnico, `Editar Técnico: ${tecnicoAEditar.nombre}`, true);
     }
     if (mostrarFormulario) {
        return renderFormTemplate(nuevoTecnico, setNuevoTecnico, guardarNuevoTecnico, "Crear Nuevo Técnico", false);
     }
     return null;
  };

  return (
    <GenericTableView
      title="Técnicos"
      description="Personal técnico disponible para atención y visitas."
      buttonText="Nuevo técnico"
      onAddClick={() => { setMostrarFormulario(!mostrarFormulario); setMostrarFormularioEdicion(false); }}
      searchPlaceholder="Buscar por nombre o tecnología..."
      columns={['ID', 'Nombre', 'Sede', 'Tecnologías', 'Acciones']}
      rows={rows}
      onSearchChange={setSearchValue}
      onFilterChange={setFilterValue}
      searchValue={searchValue}
      filterValue={filterValue}
      renderForm={renderForm}
    />
  );
}
