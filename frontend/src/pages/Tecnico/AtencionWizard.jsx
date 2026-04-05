import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiService from '../../services/apiService';
import { Button, Input, Badge } from '../../components/UI';
import { 
  ChevronLeft, Play, Camera, FileText, CheckCircle, 
  Settings, Info, Trash2, Plus, MonitorCheck 
} from 'lucide-react';

export default function AtencionWizard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [selectedEquipments, setSelectedEquipments] = useState([]);
  const [initialCondition, setInitialCondition] = useState('');
  const [technology, setTechnology] = useState('');
  const [contractType, setContractType] = useState('CONTRATO_VIGENTE');
  const [photos, setPhotos] = useState([]);
  const [observations, setObservations] = useState('');

  useEffect(() => {
    loadService();
  }, [id]);

  const loadService = async () => {
    try {
      const data = await apiService.get(`/ordenes/${id}`);
      setService(data);
      if (data.estado === 'EN_PROCESO') setStep(1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const startService = async () => {
    try {
      await apiService.patch(`/ordenes/${id}`, { estado: 'EN_PROCESO' });
      setService({ ...service, estado: 'EN_PROCESO' });
      setStep(1);
    } catch (err) {
      alert('Error al iniciar servicio');
    }
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    if (photos.length + files.length > 5) {
      alert('Máximo 5 fotos permitidas');
      return;
    }

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotos(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const finishService = async () => {
    setSubmitting(true);
    try {
      // Step 5-10: Send Mantenimiento records for each equipment
      for (const eqId of selectedEquipments) {
        await apiService.post('/mantenimientos', {
          tipo: 'PREVENTIVO', // Default or from form
          condicionInicial: initialCondition,
          tecnologiaAsociada: technology,
          tipoContrato: contractType,
          novedades: observations,
          estadoFinal: 'OK',
          evidencias: photos,
          fechaInicio: new Date().toISOString().slice(0, 19),
          fechaFin: new Date().toISOString().slice(0, 19),
          ordenServicioId: parseInt(id),
          equipoId: eqId
        });
      }

      // Step 11: Close Service
      await apiService.patch(`/ordenes/${id}`, { estado: 'FINALIZADA' });
      navigate('/tecnico/servicios');
    } catch (err) {
      alert('Error al finalizar servicio');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-8 text-white">Cargando...</div>;
  if (!service) return <div className="p-8 text-white">Servicio no encontrado</div>;

  const steps = [
    { title: 'Información del Servicio', render: renderInfo },
    { title: 'Equipos & Tecnología', render: renderEquipments },
    { title: 'Condición & Contrato', render: renderConditions },
    { title: 'Evidencias (Fotos)', render: renderEvidences },
    { title: 'Reporte Final', render: renderFinalReport },
  ];

  function renderInfo() {
    return (
      <div className="space-y-6">
        <div className="glass-card p-6 border-indigo-500/30">
          <Badge variant="pending" className="mb-4">PENDIENTE DE INICIO</Badge>
          <h2 className="text-2xl font-bold mb-4">{service.empresaNombre || 'Cliente Zion'}</h2>
          <div className="space-y-4 text-slate-400">
            <div className="flex gap-3"><MapPin size={18} /> {service.sedeNombre}</div>
            <div className="flex gap-3"><Clock size={18} /> {new Date(service.fechaProgramada).toLocaleString()}</div>
            <div className="flex gap-3"><Info size={18} /> {service.descripcion || 'Sin observaciones del coordinador.'}</div>
          </div>
        </div>
        <Button onClick={startService} className="w-full py-6 text-xl">
          INICIAR SERVICIO <Play size={20} className="ml-2" />
        </Button>
      </div>
    );
  }

  function renderEquipments() {
    return (
      <div className="space-y-6">
        <h3 className="text-lg font-bold">Selecciona los equipos intervenidos:</h3>
        <div className="space-y-3">
          {/* Note: This should fetch equipment associated with the service */}
          {[1, 2, 3].map(i => (
            <div 
              key={i} 
              onClick={() => {
                if (selectedEquipments.includes(i)) setSelectedEquipments(prev => prev.filter(x => x !== i));
                else setSelectedEquipments(prev => [...prev, i]);
              }}
              className={`glass p-4 rounded-xl flex items-center gap-4 transition-all ${selectedEquipments.includes(i) ? 'border-primary bg-primary/20' : 'border-white/5'}`}
            >
              <div className={`w-6 h-6 rounded border-2 flex items-center justify-center ${selectedEquipments.includes(i) ? 'border-primary bg-primary' : 'border-slate-700'}`}>
                {selectedEquipments.includes(i) && <CheckCircle size={14} />}
              </div>
              <div>
                <div className="font-bold">Serial: ZN-000{i}</div>
                <div className="text-sm text-slate-500">Impresora Industrial</div>
              </div>
            </div>
          ))}
        </div>

        <h3 className="text-lg font-bold mt-8">Tecnología del equipo:</h3>
        <div className="grid grid-cols-2 gap-3">
          {['CIJ', 'Láser', 'TTO', 'TIJ'].map(tech => (
            <div 
              key={tech} 
              onClick={() => setTechnology(tech)}
              className={`p-4 glass rounded-xl text-center font-bold transition-all ${technology === tech ? 'border-primary bg-primary/20 scale-105' : 'border-white/5 opacity-50'}`}
            >
              {tech}
            </div>
          ))}
        </div>
        
        <Button onClick={() => setStep(step + 1)} disabled={selectedEquipments.length === 0 || !technology} className="w-full mt-8">Siguiente</Button>
      </div>
    );
  }

  function renderConditions() {
    return (
      <div className="space-y-6">
        <Input 
          label="Condición inicial del equipo (Paso 6)" 
          placeholder="¿Cómo encontró el equipo?" 
          value={initialCondition}
          onChange={(e) => setInitialCondition(e.target.value)}
          className="h-32"
        />
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-400">Tipo de Contrato (Paso 8)</label>
          <div className="grid grid-cols-1 gap-2">
            {[
              'Contrato vigente', 'Visita facturable', 'Garantía', 
              'Instalación', 'Correctivo', 'Preventivo'
            ].map(type => (
              <div 
                key={type} 
                onClick={() => setContractType(type)}
                className={`p-4 glass rounded-xl flex items-center justify-between ${contractType === type ? 'border-primary bg-primary/20' : 'border-white/5'}`}
              >
                {type}
                {contractType === type && <CheckCircle size={18} className="text-primary" />}
              </div>
            ))}
          </div>
        </div>
        <div className="flex gap-4">
          <Button variant="secondary" onClick={() => setStep(step - 1)}>Atrás</Button>
          <Button onClick={() => setStep(step + 1)} disabled={!initialCondition} className="flex-1">Siguiente</Button>
        </div>
      </div>
    );
  }

  function renderEvidences() {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="font-bold">Fotos de evidencia ({photos.length}/5)</h3>
          <label className="p-2 bg-indigo-600 rounded-lg cursor-pointer hover:bg-indigo-700 transition-all">
            <Plus size={20} />
            <input type="file" multiple accept="image/*" className="hidden" onChange={handlePhotoUpload} />
          </label>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {photos.map((photo, i) => (
            <div key={i} className="relative group rounded-xl overflow-hidden glass border-white/10 aspect-square">
              <img src={photo} alt="" className="w-full h-full object-cover" />
              <button 
                onClick={() => removePhoto(i)}
                className="absolute top-2 right-2 p-1.5 bg-red-500/80 rounded-lg text-white"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          {photos.length < 5 && (
            <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-white/10 rounded-xl aspect-square text-slate-600 cursor-pointer hover:border-indigo-500/30 hover:text-slate-400 transition-all">
              <Camera size={32} />
              <span className="text-xs">Agregar foto</span>
              <input type="file" multiple accept="image/*" className="hidden" onChange={handlePhotoUpload} />
            </label>
          )}
        </div>

        <div className="flex gap-4">
          <Button variant="secondary" onClick={() => setStep(step - 1)}>Atrás</Button>
          <Button onClick={() => setStep(step + 1)} disabled={photos.length === 0} className="flex-1">Siguiente</Button>
        </div>
      </div>
    );
  }

  function renderFinalReport() {
    return (
      <div className="space-y-6">
        <Input 
          label="Novedades y trabajo realizado (Paso 10)" 
          placeholder="Describe detalladamente el mantenimiento..." 
          value={observations}
          onChange={(e) => setObservations(e.target.value)}
          className="h-48"
        />
        <div className="glass p-4 rounded-xl space-y-2 text-sm">
          <p className="text-slate-500 uppercase tracking-widest text-[10px] font-bold">Resumen para cierre</p>
          <div className="flex justify-between"><span>Equipos:</span> <span className="text-white font-medium">{selectedEquipments.length}</span></div>
          <div className="flex justify-between"><span>Tecnología:</span> <span className="text-white font-medium">{technology}</span></div>
          <div className="flex justify-between"><span>Evidencias:</span> <span className="text-white font-medium">{photos.length} fotos</span></div>
        </div>
        <div className="flex gap-4">
          <Button variant="secondary" onClick={() => setStep(step - 1)}>Atrás</Button>
          <Button 
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 shadow-[0_0_20px_rgba(16,185,129,0.2)]" 
            onClick={finishService} 
            loading={submitting}
          >
            {submitting ? 'Cerrando...' : 'FINALIZAR SERVICIO'} <CheckCircle size={18} className="ml-2" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex flex-col">
      <nav className="p-4 flex items-center gap-4 bg-slate-900/50 backdrop-blur-xl border-b border-white/5 sticky top-0 z-20">
        <button onClick={() => navigate('/tecnico/servicios')} className="p-2 hover:bg-white/5 rounded-lg">
          <ChevronLeft size={24} />
        </button>
        <div>
          <h1 className="font-black text-sm uppercase tracking-tighter">Paso {step + 1} de {steps.length}</h1>
          <p className="text-xs text-slate-500 font-medium">{steps[step].title}</p>
        </div>
      </nav>

      <div className="flex-1 p-4 pb-12 overflow-y-auto">
        <div className="max-w-2xl mx-auto">
          {steps[step].render()}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 h-1 bg-white/5">
        <div 
          className="h-full bg-indigo-500 transition-all duration-500" 
          style={{ width: `${((step + 1) / steps.length) * 100}%` }}
        />
      </div>
    </div>
  );
}

// Subcomponents
const MapPin = ({ size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>;
