import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiService from '../../services/apiService';
import { Button, Input, Badge } from '../../components/UI';
import { useAuth } from '../../contexts/AuthContext';
import { 
  ChevronLeft, Play, Camera, FileText, CheckCircle, 
  Settings, Info, Trash2, Plus, MonitorCheck, MapPin, Clock 
} from 'lucide-react';

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

  // Visita State
  const [ubicacionInicio, setUbicacionInicio] = useState(null);
  const [fechaInicio, setFechaInicio] = useState(null);
  
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

  const loadServiceAndData = async () => {
    try {
      const serviceData = await apiService.get(`/ordenes/${id}`);
      setService(serviceData);
      
      // Load all equipments and filter by empresaId
      const allEqs = await apiService.get('/equipos');
      const filteredEqs = allEqs.filter(e => e.empresaId === serviceData.empresaId);
      setAvailableEquipments(filteredEqs);

      if (serviceData.estado === 'EN_PROCESO') {
        // Fallback for location/time if already in process but state was lost
        setUbicacionInicio('Ubicación previa');
        setFechaInicio(new Date().toISOString().slice(0, 19));
        setStep(1);
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

      const now = new Date();
      // Ajuste de zona horaria para enviar ISO local
      now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
      const nowStr = now.toISOString().slice(0, 19);

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

      const now = new Date();
      now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
      const fechaFinStr = now.toISOString().slice(0, 19);

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
        <div className="glass-card p-6 border-indigo-500/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10"><MapPin size={100} /></div>
          <Badge variant="pending" className="mb-4">PENDIENTE DE INICIO</Badge>
          <h2 className="text-2xl font-bold mb-4">{service.empresaNombre || 'Cliente Zion'}</h2>
          <div className="space-y-4 text-slate-400 relative z-10">
            <div className="flex gap-3"><MapPin size={18} className="text-rose-400" /> {service.sedeNombre}</div>
            <div className="flex gap-3"><Clock size={18} className="text-indigo-400" /> {new Date(service.fechaProgramada).toLocaleString()}</div>
            <div className="flex gap-3"><Info size={18} className="text-emerald-400" /> {service.descripcion || 'Sin observaciones previas.'}</div>
          </div>
        </div>
        
        {errorMsg && <div className="p-4 bg-red-500/20 text-red-200 rounded-xl border border-red-500/30 text-sm">{errorMsg}</div>}

        <Button onClick={captureLocationAndStart} loading={submitting} className="w-full py-6 text-lg">
          ACEPTAR Y CAPTURAR UBICACIÓN <MapPin size={20} className="ml-2" />
        </Button>
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
          <div className="glass-card text-center p-8 border-dashed border-2 border-white/10">
            <MonitorCheck size={40} className="mx-auto mb-4 text-slate-500" />
            <p className="text-slate-400 mb-4">No has registrado ningún equipo aún.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {equipments.map((eq, idx) => (
              <div key={idx} className="glass p-4 rounded-xl border border-white/5 relative">
                <button onClick={() => removeEquipment(idx)} className="absolute top-4 right-4 text-slate-500 hover:text-red-400">
                  <Trash2 size={18} />
                </button>
                <div className="font-bold text-lg text-copper-400 mb-1">Serial: {eq.serial}</div>
                <p className="text-sm text-slate-300 mb-3">{eq.descripcion}</p>
                {eq.fotos.length > 0 && (
                  <div className="flex gap-2">
                    {eq.fotos.map((f, i) => (
                      <img key={i} src={f} className="w-10 h-10 rounded-md object-cover border border-white/10" alt="Evidencia" />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <Button onClick={() => setIsAddingEquipment(true)} variant="secondary" className="w-full border-dashed border-2 border-slate-600 hover:border-copper-500 hover:text-copper-400">
          <Plus size={20} className="mr-2" /> ADICIONAR EQUIPO
        </Button>
        
        <div className="pt-8 mt-4 border-t border-white/10">
          <Button 
            onClick={() => setStep(step + 1)} 
            className="w-full py-5 text-lg font-bold shadow-[0_0_15px_rgba(79,70,229,0.3)] bg-indigo-600 hover:bg-indigo-500" 
            disabled={equipments.length === 0}
          >
            YA NO AGREGARÉ MÁS EQUIPOS, CONTINUAR AL RESUMEN FINAL <ChevronLeft className="rotate-180 ml-2" size={24} />
          </Button>
        </div>
      </div>
    );
  }

  function renderFinalReport() {
    return (
      <div className="space-y-6">
        <div className="glass p-4 rounded-xl space-y-3 bg-slate-800/50">
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Resumen del Turno</p>
          <div className="flex justify-between items-center border-b border-white/5 pb-2">
            <span className="text-slate-400">Hora de inicio:</span> 
            <span className="font-medium">{new Date(fechaInicio).toLocaleTimeString()}</span>
          </div>
          <div className="flex justify-between items-center border-b border-white/5 pb-2">
            <span className="text-slate-400">Equipos atendidos:</span> 
            <span className="font-medium text-copper-400">{equipments.length}</span>
          </div>
        </div>

        <Input 
          label="Resumen General del Turno" 
          placeholder="Escribe todo lo que realizaste durante el turno en la planta..." 
          value={observaciones}
          onChange={(e) => setObservaciones(e.target.value)}
          className="h-40 bg-slate-800 border-slate-700 focus:border-emerald-500"
        />

        {errorMsg && <div className="p-4 bg-red-500/20 text-red-200 rounded-xl border border-red-500/30 text-sm">{errorMsg}</div>}

        <div className="flex gap-4 pt-4">
          <Button variant="secondary" onClick={() => setStep(step - 1)}>Atrás</Button>
          <Button 
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 shadow-[0_0_20px_rgba(16,185,129,0.2)]" 
            onClick={captureLocationAndFinish} 
            loading={submitting}
          >
            FINALIZAR Y CAPTURAR UBICACIÓN <MapPin size={18} className="ml-2" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex flex-col">
      <nav className="p-4 flex items-center gap-4 bg-slate-900/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-20">
        <button onClick={() => navigate('/tecnico/servicios')} className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors">
          <ChevronLeft size={24} />
        </button>
        <div>
          <h1 className="font-black text-sm uppercase tracking-tighter text-copper-400">Paso {step + 1} de {steps.length}</h1>
          <p className="text-xs text-slate-300 font-medium">{steps[step].title}</p>
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
