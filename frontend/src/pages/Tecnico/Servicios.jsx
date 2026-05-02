import React, { useEffect, useState } from 'react';
import apiService from '../../services/apiService';
import { Badge, Button } from '../../components/UI';
import { Calendar, MapPin, ChevronRight, Clock, CheckCircle2, PlayCircle, History } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function TechnicianServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pendientes'); // 'pendientes' | 'historial'
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) loadServices();
  }, [user]);

  const loadServices = async () => {
    try {
      const data = await apiService.get('/ordenes'); 
      const tecnicosData = await apiService.get('/tecnicos');
      
      const loggedInTech = tecnicosData.find(t => t.username === user.username);
      
      if (loggedInTech) {
        // Ordenar por fecha programada descendente
        const myServices = data.filter(o => o.tecnicoId === loggedInTech.id).sort((a, b) => new Date(b.fechaProgramada) - new Date(a.fechaProgramada));
        setServices(myServices);
      } else {
        setServices(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const statusIcons = {
    'PROGRAMADA': <Clock size={16} className="text-indigo-400" />,
    'EN_PROCESO': <PlayCircle size={16} className="text-amber-400" />,
    'FINALIZADA': <CheckCircle2 size={16} className="text-emerald-400" />,
  };

  const pendientes = services.filter(s => s.estado !== 'FINALIZADA');
  const finalizados = services.filter(s => s.estado === 'FINALIZADA');
  const displayedServices = activeTab === 'pendientes' ? pendientes : finalizados;

  if (loading) return <div className="p-8 text-center animate-pulse text-copper-400 font-bold">Cargando servicios...</div>;

  return (
    <div className="p-4 safe-top animate-fade-in max-w-xl mx-auto">
      <header className="mb-6">
        <h1 className="text-3xl font-black mb-2 text-white">Mis Servicios</h1>
        <p className="text-slate-400 font-medium">Gestión de rutas y atenciones</p>
      </header>

      {/* Tabs UI */}
      <div className="flex bg-slate-800/80 p-1.5 rounded-xl mb-6 shadow-inner border border-white/5">
        <button 
          className={`flex-1 py-2.5 text-sm font-black tracking-wide rounded-lg transition-all duration-300 ${activeTab === 'pendientes' ? 'bg-copper-600 text-white shadow-md scale-[1.02]' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
          onClick={() => setActiveTab('pendientes')}
        >
          Pendientes ({pendientes.length})
        </button>
        <button 
          className={`flex-1 py-2.5 text-sm font-black tracking-wide rounded-lg transition-all duration-300 flex items-center justify-center gap-2 ${activeTab === 'historial' ? 'bg-slate-700 text-white shadow-md scale-[1.02]' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
          onClick={() => setActiveTab('historial')}
        >
          <History size={16} /> Historial ({finalizados.length})
        </button>
      </div>

      <div className="space-y-4 pb-20">
        {displayedServices.length === 0 ? (
          <div className="glass-card text-center p-12 border-dashed border-2 border-white/10">
            {activeTab === 'pendientes' ? (
               <Calendar size={48} className="mx-auto mb-4 text-slate-600" />
            ) : (
               <CheckCircle2 size={48} className="mx-auto mb-4 text-emerald-900" />
            )}
            <p className="text-slate-400 font-medium">No hay servicios en esta sección.</p>
          </div>
        ) : (
          displayedServices.map((service) => (
            <div 
              key={service.id} 
              className={`glass-card flex flex-col gap-4 border border-white/5 transition-all ${service.estado !== 'FINALIZADA' ? 'active:scale-[0.98] cursor-pointer hover:border-copper-500/50 hover:bg-slate-800/80' : 'opacity-90'}`}
              onClick={() => {
                if (service.estado !== 'FINALIZADA') {
                  navigate(`/tecnico/servicio/${service.id}`);
                }
              }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-copper-400 font-black mb-1.5 block">
                    ORDEN #{service.numeroOrden || service.id}
                  </span>
                  <h3 className="text-xl font-bold text-white leading-tight">{service.empresaNombre || 'Cliente Zion'}</h3>
                </div>
                <Badge variant={service.estado === 'PROGRAMADA' ? 'pending' : service.estado === 'EN_PROCESO' ? 'warning' : 'success'}>
                  <span className="flex items-center gap-1.5 font-bold">
                    {statusIcons[service.estado]}
                    {service.estado}
                  </span>
                </Badge>
              </div>

              <div className="space-y-2.5 bg-slate-900/50 p-3 rounded-xl border border-white/5">
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <MapPin size={16} className="text-rose-400 shrink-0" />
                  <span className="font-medium leading-snug">{service.empresaDireccion || 'Dirección no disponible'}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-400">
                  <div className="w-4 shrink-0" /> {/* Espaciador visual alineado */}
                  <span className="font-medium">Sede: {service.sedeNombre || 'Planta Principal'}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-400">
                  <Calendar size={16} className="text-indigo-400 shrink-0" />
                  <span className="font-medium">Programado: {new Date(service.fechaProgramada).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-white/5 flex justify-between items-center">
                {service.estado === 'FINALIZADA' ? (
                  <div className="flex items-center gap-2 text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-lg w-full justify-center">
                    <CheckCircle2 size={16} />
                    <span className="text-xs font-black uppercase tracking-widest">Servicio Completado</span>
                  </div>
                ) : (
                  <>
                    <span className="text-xs text-copper-400 font-black tracking-widest uppercase bg-copper-500/10 px-3 py-1.5 rounded-lg">Ver detalles e Iniciar</span>
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                       <ChevronRight size={18} className="text-copper-400" />
                    </div>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
