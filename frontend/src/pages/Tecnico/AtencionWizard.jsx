import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiService from '../../services/apiService';
import { Button, Input, Badge } from '../../components/UI';
import { useAuth } from '../../contexts/AuthContext';
import {
  ChevronLeft, Play, Camera, FileText, CheckCircle,
  Settings, Info, Trash2, Plus, MonitorCheck, MapPin, Clock
} from 'lucide-react';

const getLocalIsoString = () => {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 19);
};

export default function AtencionWizard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [service, setService] = useState(null);
  const [availableEquipments, setAvailableEquipments] = useState([]);
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isReadOnly, setIsReadOnly] = useState(false);

  // Visita State
  const [ubicacionInicio, setUbicacionInicio] = useState(null);
  const [fechaInicio, setFechaInicio] = useState(null);
  const [fechaFin, setFechaFin] = useState(null);

  // Equipos Intervenidos State
  const [equipments, setEquipments] = useState([]);
  const [isAddingEquipment, setIsAddingEquipment] = useState(false);

  const [currentEqId, setCurrentEqId] = useState('');
  const [currentEqDescription, setCurrentEqDescription] = useState('');
  const [currentEqPhotos, setCurrentEqPhotos] = useState([]);

  // Resumen Final
  const [observaciones, setObservaciones] = useState('');

  useEffect(() => {
    loadServiceAndData();
  }, [id]);

  useEffect(() => {
    if (service && service.estado === 'EN_PROCESO' && !isReadOnly && step > 0) {
      const draft = {
        step,
        equipments,
        observaciones,
        fechaInicio,
        ubicacionInicio
      };
      localStorage.setItem(`wizard_draft_${id}`, JSON.stringify(draft));
    }
  }, [step, equipments, observaciones, fechaInicio, ubicacionInicio, service, id, isReadOnly]);

  const loadServiceAndData = async () => {
    try {
      const serviceData = await apiService.get(`/ordenes/${id}`);
      setService(serviceData);

      // Load all equipments and filter by empresaId
      const allEqs = await apiService.get('/equipos');
      const filteredEqs = allEqs.filter(e => e.empresaId === serviceData.empresaId);
      setAvailableEquipments(filteredEqs);

      if (serviceData.estado === 'EN_PROCESO') {
        const savedDraft = localStorage.getItem(`wizard_draft_${id}`);
        if (savedDraft) {
          try {
            const draft = JSON.parse(savedDraft);
            setUbicacionInicio(draft.ubicacionInicio || 'Ubicación previa');
            setFechaInicio(draft.fechaInicio || getLocalIsoString());
            setStep(draft.step && draft.step > 0 ? draft.step : 1);
            setEquipments(draft.equipments || []);
            setObservaciones(draft.observaciones || '');
          } catch (e) {
            setUbicacionInicio('Ubicación previa');
            setFechaInicio(getLocalIsoString());
            setStep(1);
          }
        } else {
          // Fallback for location/time if already in process but state was lost
          setUbicacionInicio('Ubicación previa');
          setFechaInicio(getLocalIsoString());
          setStep(1);
        }
      }

      if (serviceData.estado === 'FINALIZADA') {
        setIsReadOnly(true);
        // Cargar datos del historial si existen
        const detail = await apiService.get(`/ordenes/${id}/detalle`);
        setEquipments(detail.mantenimientos.map(m => {
          const realEq = filteredEqs.find(e => e.id === m.equipoId);
          return {
            equipoId: m.equipoId,
            serial: realEq ? realEq.serial : `ID: ${m.equipoId}`,
            descripcion: m.descripcion,
            fotos: m.evidencias || []
          };
        }));
        setObservaciones(detail.visitas?.[0]?.observaciones || '');
        setFechaInicio(detail.visitas?.[0]?.fechaInicio);
        setFechaFin(detail.visitas?.[0]?.fechaFin);
        setStep(2); // Ir directamente al resumen o permitir navegar
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Error cargando los datos del servicio.');
    } finally {
      setLoading(false);
    }
  };

  const getPosition = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocalización no soportada'));
      }
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true, timeout: 10000, maximumAge: 0
      });
    });
  };

  const captureLocationAndStart = async () => {
    setSubmitting(true);
    setErrorMsg('');
    try {
      let coords = 'Sin ubicación';
      try {
        const position = await getPosition();
        coords = `${position.coords.latitude},${position.coords.longitude}`;
      } catch (e) {
        console.warn("No se pudo obtener la ubicación", e);
      }

      const nowStr = getLocalIsoString();

      setUbicacionInicio(coords);
      setFechaInicio(nowStr);

      await apiService.patch(`/ordenes/${id}`, { estado: 'EN_PROCESO' });
      setService({ ...service, estado: 'EN_PROCESO' });
      setStep(1);
    } catch (err) {
      console.error(err);
      setErrorMsg(`Error al iniciar: ${err.message || err}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    if (currentEqPhotos.length + files.length > 5) {
      alert('Máximo 5 fotos permitidas por equipo');
      return;
    }
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentEqPhotos(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const saveCurrentEquipment = () => {
    if (!currentEqId || !currentEqDescription) {
      alert('Debes seleccionar un equipo y agregar una descripción.');
      return;
    }
    const eqObj = availableEquipments.find(e => e.id === Number(currentEqId)) || { serial: `ID: ${currentEqId}` };

    setEquipments(prev => [...prev, {
      equipoId: Number(currentEqId),
      serial: eqObj.serial,
      descripcion: currentEqDescription,
      fotos: currentEqPhotos
    }]);

    // Reset form
    setCurrentEqId('');
    setCurrentEqDescription('');
    setCurrentEqPhotos([]);
    setIsAddingEquipment(false);
  };

  const removeEquipment = (index) => {
    setEquipments(prev => prev.filter((_, i) => i !== index));
  };

  const captureLocationAndFinish = async () => {
    if (!observaciones) {
      setErrorMsg('Debes ingresar un resumen final.');
      return;
    }
    setSubmitting(true);
    setErrorMsg('');
    try {
      let coordsFin = 'Sin ubicación';
      try {
        const position = await getPosition();
        coordsFin = `${position.coords.latitude},${position.coords.longitude}`;
      } catch (e) {
        console.warn("No se pudo obtener la ubicación final", e);
      }

      const fechaFinStr = getLocalIsoString();

      const tecnicosData = await apiService.get('/tecnicos');
      const loggedInTech = tecnicosData.find(t => t.username === user?.username);
      const techId = loggedInTech ? loggedInTech.id : Number(service.tecnicoId);

      // 1. Create Visita Técnica
      await apiService.post('/visitas', {
        fechaInicio: fechaInicio || fechaFinStr,
        fechaFin: fechaFinStr,
        observaciones: observaciones,
        ubicacionInicio: ubicacionInicio,
        ubicacionFin: coordsFin,
        ordenServicioId: Number(id),
        tecnicoId: techId
      });

      // 2. Create Mantenimientos for each equipment
      for (const eq of equipments) {
        await apiService.post('/mantenimientos', {
          tipo: 'PREVENTIVO', // Por defecto
          descripcion: eq.descripcion,
          fechaInicio: fechaInicio || fechaFinStr,
          fechaFin: fechaFinStr,
          ordenServicioId: Number(id),
          equipoId: eq.equipoId,
          condicionInicial: 'N/A',
          tecnologiaAsociada: 'N/A',
          tipoContrato: 'N/A',
          novedades: eq.descripcion,
          estadoFinal: 'OK',
          evidencias: eq.fotos
        });
      }

      // 3. Finalize Order
      await apiService.patch(`/ordenes/${id}`, { estado: 'FINALIZADA' });
      localStorage.removeItem(`wizard_draft_${id}`);
      navigate('/tecnico/servicios');
    } catch (err) {
      console.error(err);
      setErrorMsg(`Error al finalizar: ${err.message || err}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-8 text-white">Cargando...</div>;
  if (!service) return <div className="p-8 text-white">Servicio no encontrado</div>;

  const steps = [
    { title: 'Aceptar Servicio', render: renderInfo },
    { title: 'Intervención de Equipos', render: renderEquipments },
    { title: 'Resumen y Cierre', render: renderFinalReport },
  ];

  function renderInfo() {
    return (
      <div className="space-y-6">
        <div className="glass-card p-6 border-indigo-500/30 relative overflow-hidden bg-white shadow-xl">
          <div className="absolute top-0 right-0 p-4 opacity-5"><MapPin size={100} /></div>
          {isReadOnly ? (
            <Badge variant="success" className="mb-4">SERVICIO FINALIZADO (LECTURA)</Badge>
          ) : (
            <Badge variant="pending" className="mb-4">PENDIENTE DE INICIO</Badge>
          )}
          <h2 className="text-2xl font-black mb-4 text-slate-900">{service.empresaNombre || 'Cliente Zion'}</h2>
          <div className="space-y-4 text-slate-600 relative z-10 font-medium">
            <div className="flex gap-3"><MapPin size={18} className="text-rose-500" /> {service.sedeNombre}</div>
            <div className="flex gap-3"><Clock size={18} className="text-indigo-500" /> {new Date(service.fechaProgramada).toLocaleString()}</div>
            <div className="flex gap-3"><Info size={18} className="text-emerald-500" /> {service.descripcion || 'Sin observaciones previas.'}</div>
          </div>
        </div>
        
        {errorMsg && <div className="p-4 bg-rose-50 text-rose-700 rounded-xl border border-rose-200 text-sm font-bold">{errorMsg}</div>}

        {!isReadOnly && (
          <Button onClick={captureLocationAndStart} loading={submitting} className="w-full py-6 text-lg font-black shadow-glow-copper">
            ACEPTAR Y CAPTURAR UBICACIÓN <MapPin size={20} className="ml-2" />
          </Button>
        )}
      </div>
    );
  }

  function renderEquipments() {
    if (isAddingEquipment) {
      return (
        <div className="space-y-6 animate-fade-in">
          <h3 className="text-xl font-bold flex items-center gap-2"><Settings size={20} className="text-copper-500" /> Registrar Equipo</h3>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-400 mb-2 block">Seleccionar Equipo (Serial)</label>
              <select
                value={currentEqId}
                onChange={(e) => setCurrentEqId(e.target.value)}
                className="w-full rounded-2xl border-2 border-slate-700 bg-slate-800 py-3.5 px-4 text-white outline-none transition-soft focus:border-copper-500 focus:bg-slate-900 font-medium"
              >
                <option value="">Seleccione un equipo...</option>
                {availableEquipments.map(eq => (
                  <option key={eq.id} value={eq.id}>{eq.serial} - {eq.referencia || 'Sin ref'}</option>
                ))}
              </select>
            </div>

            <Input
              label="Descripción del trabajo realizado"
              placeholder="Ej. Cambio de filtros, limpieza general..."
              value={currentEqDescription}
              onChange={(e) => setCurrentEqDescription(e.target.value)}
              className="h-32 bg-slate-800 border-slate-700 focus:border-copper-500"
            />

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-slate-400">Fotos de evidencia ({currentEqPhotos.length}/5)</label>
                <label className="p-2 bg-copper-600 rounded-lg cursor-pointer hover:bg-copper-700 transition-all text-white">
                  <Plus size={16} />
                  <input type="file" multiple accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                </label>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {currentEqPhotos.map((photo, i) => (
                  <div key={i} className="relative group rounded-xl overflow-hidden glass border-white/10 aspect-square">
                    <img src={photo} alt="evidencia" className="w-full h-full object-cover" />
                    <button
                      onClick={() => setCurrentEqPhotos(prev => prev.filter((_, idx) => idx !== i))}
                      className="absolute top-1 right-1 p-1 bg-red-500/80 rounded-md text-white"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4 border-t border-white/10">
            <Button variant="secondary" onClick={() => setIsAddingEquipment(false)}>Cancelar</Button>
            <Button onClick={saveCurrentEquipment} disabled={!currentEqId || !currentEqDescription} className="flex-1 bg-copper-600 hover:bg-copper-700">
              Guardar Equipo <CheckCircle size={18} className="ml-2" />
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold">Equipos Intervenidos</h3>
          <Badge variant="success">{equipments.length} Registrados</Badge>
        </div>

        {equipments.length === 0 ? (
          <div className="glass-card text-center p-8 border-dashed border-2 border-slate-200 bg-slate-50">
            <MonitorCheck size={40} className="mx-auto mb-4 text-slate-300" />
            <p className="text-slate-500 font-medium mb-4">No hay equipos registrados en esta intervención.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {equipments.map((eq, idx) => (
              <div key={idx} className="glass-card p-5 border border-slate-100 relative bg-white shadow-md hover:border-copper-200 transition-all">
                {!isReadOnly && (
                  <button onClick={() => removeEquipment(idx)} className="absolute top-4 right-4 text-slate-300 hover:text-rose-500 transition-colors">
                    <Trash2 size={18} />
                  </button>
                )}
                <div className="font-black text-lg text-copper-600 mb-1 tracking-tight">Serial: {eq.serial}</div>
                <p className="text-sm text-slate-600 mb-4 font-medium leading-relaxed">{eq.descripcion}</p>
                {eq.fotos.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {eq.fotos.map((f, i) => (
                      <div key={i} className="w-12 h-12 rounded-lg overflow-hidden border border-slate-200 shadow-sm">
                        <img src={f} className="w-full h-full object-cover" alt="Evidencia" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {!isReadOnly && (
          <Button onClick={() => setIsAddingEquipment(true)} variant="secondary" className="w-full border-dashed border-2 border-slate-300 hover:border-copper-400 hover:text-copper-600 py-4 font-bold">
            <Plus size={20} className="mr-2" /> ADICIONAR EQUIPO
          </Button>
        )}
        
        <div className="pt-8 mt-4 border-t border-slate-100 flex gap-4">
           {isReadOnly && <Button variant="secondary" onClick={() => setStep(step - 1)} className="flex-1">Atrás</Button>}
           <Button 
            onClick={() => setStep(step + 1)} 
            className="flex-1 py-5 text-lg font-black shadow-premium bg-slate-900 hover:bg-slate-800" 
            disabled={!isReadOnly && equipments.length === 0}
          >
            {isReadOnly ? 'VER RESUMEN FINAL' : 'CONTINUAR AL RESUMEN FINAL'} <ChevronLeft className="rotate-180 ml-2" size={24} />
          </Button>
        </div>
      </div>
    );
  }

  function renderFinalReport() {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="glass-card p-6 space-y-4 bg-slate-50 border-slate-200">
          <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-[10px]">Resumen del Servicio</p>
          <div className="flex justify-between items-center border-b border-slate-200 pb-3">
            <span className="text-slate-500 font-bold text-sm">Hora de inicio:</span> 
            <span className="font-black text-slate-900">{fechaInicio ? new Date(fechaInicio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}</span>
          </div>
          <div className="flex justify-between items-center border-b border-slate-200 pb-3">
            <span className="text-slate-500 font-bold text-sm">Hora de finalización:</span> 
            <span className="font-black text-slate-900">{fechaFin ? new Date(fechaFin).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : (isReadOnly ? '--:--' : 'Pendiente...')}</span>
          </div>
          <div className="flex justify-between items-center border-b border-slate-200 pb-3">
            <span className="text-slate-500 font-bold text-sm">Equipos atendidos:</span> 
            <span className="font-black text-copper-600 text-lg">{equipments.length}</span>
          </div>
        </div>

        <div>
          <label className="text-sm font-black text-slate-500 uppercase tracking-widest mb-2 block">Resumen Final del Turno</label>
          <textarea 
            placeholder="Resumen del trabajo realizado..." 
            value={observaciones}
            onChange={(e) => !isReadOnly && setObservaciones(e.target.value)}
            readOnly={isReadOnly}
            className={`w-full rounded-2xl border-2 border-slate-200 bg-white p-4 text-slate-900 font-medium outline-none transition-soft min-h-[160px] focus:border-emerald-500 ${isReadOnly ? 'bg-slate-50 cursor-default' : ''}`}
          />
        </div>

        {errorMsg && <div className="p-4 bg-rose-50 text-rose-700 rounded-xl border border-rose-200 text-sm font-bold">{errorMsg}</div>}

        <div className="flex gap-4 pt-4 border-t border-slate-100">
          <Button variant="secondary" onClick={() => setStep(step - 1)} className="font-bold">Atrás</Button>
          {!isReadOnly ? (
            <Button 
              className="flex-1 bg-emerald-600 hover:bg-emerald-500 shadow-glow font-black text-lg py-4" 
              onClick={captureLocationAndFinish} 
              loading={submitting}
            >
              FINALIZAR SERVICIO <CheckCircle size={20} className="ml-2" />
            </Button>
          ) : (
            <Button variant="primary" onClick={() => navigate('/tecnico/servicios')} className="flex-1 font-black py-4 bg-slate-900">
              CERRAR HISTORIAL
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <nav className="p-4 flex items-center gap-4 bg-white/80 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-20 shadow-sm">
        <button onClick={() => navigate('/tecnico/servicios')} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-900 transition-colors">
          <ChevronLeft size={24} />
        </button>
        <div>
          <h1 className="font-black text-sm uppercase tracking-tighter text-copper-600">{isReadOnly ? 'Historial de Servicio' : `Paso ${step + 1} de ${steps.length}`}</h1>
          <p className="text-xs text-slate-500 font-bold">{steps[step].title}</p>
        </div>
      </nav>


      <div className="flex-1 p-4 pb-12 overflow-y-auto">
        <div className="max-w-xl mx-auto pt-4">
          {steps[step].render()}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 h-1.5 bg-slate-800">
        <div
          className="h-full bg-gradient-to-r from-copper-500 to-emerald-500 transition-all duration-500"
          style={{ width: `${((step + 1) / steps.length) * 100}%` }}
        />
      </div>
    </div>
  );
}
