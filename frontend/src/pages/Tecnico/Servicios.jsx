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
      // El backend usa el JWT del usuario autenticado para filtrar automáticamente
      // solo las órdenes asignadas a ESTE técnico. No se necesita filtrar en el cliente.
      const data = await apiService.get('/ordenes/mis-ordenes');
      const estadoPriority = {
        'EN_PROCESO': 1,
        'PROGRAMADA': 2,
        'FINALIZADA': 3
      };
      const sorted = (data || []).sort((a, b) => {
        const pA = estadoPriority[a.estado] || 99;
        const pB = estadoPriority[b.estado] || 99;
        if (pA !== pB) return pA - pB;
        return b.id - a.id;
      });
      setServices(sorted);
    } catch (err) {
      console.error('Error cargando mis servicios:', err);
      setServices([]);
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
    <div className="min-h-screen bg-slate-50 p-4 safe-top animate-fade-in max-w-xl mx-auto">
      <header className="mb-6">
        <h1 className="text-4xl font-black mb-2 text-slate-950 tracking-tighter">Mis Servicios</h1>
        <p className="text-slate-500 font-medium ml-1">Gestión de rutas y atenciones</p>
      </header>

      {/* Tabs UI */}
      <div className="flex bg-white p-1.5 rounded-2xl mb-8 shadow-premium border border-slate-100">
        <button
          className={`flex-1 py-3 text-xs font-black tracking-widest uppercase rounded-xl transition-all duration-300 ${activeTab === 'pendientes' ? 'bg-slate-900 text-white shadow-xl scale-[1.02]' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
          onClick={() => setActiveTab('pendientes')}
        >
          Pendientes ({pendientes.length})
        </button>
        <button
          className={`flex-1 py-3 text-xs font-black tracking-widest uppercase rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${activeTab === 'historial' ? 'bg-copper-600 text-white shadow-xl scale-[1.02]' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
          onClick={() => setActiveTab('historial')}
        >
          <History size={16} /> Historial ({finalizados.length})
        </button>
      </div>

      <div className="space-y-6 pb-20">
        {displayedServices.length === 0 ? (
          <div className="glass-card text-center p-16 border-dashed border-2 border-slate-200 bg-white">
            {activeTab === 'pendientes' ? (
              <Calendar size={48} className="mx-auto mb-4 text-slate-200" />
            ) : (
              <CheckCircle2 size={48} className="mx-auto mb-4 text-emerald-100" />
            )}
            <p className="text-slate-400 font-black uppercase tracking-widest text-xs">No hay servicios en esta sección.</p>
          </div>
        ) : (
          displayedServices.map((service) => (
            <div 
              key={service.id} 
              className={`glass-card flex flex-col gap-5 border border-slate-100 transition-all active:scale-[0.98] cursor-pointer hover:border-copper-200 hover:shadow-premium-xl bg-white ${service.estado === 'FINALIZADA' ? 'opacity-95' : ''}`}
              onClick={() => {
                navigate(`/tecnico/servicio/${service.id}`);
              }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-copper-600 font-black mb-1.5 block">
                    ORDEN #{String(service.numeroOrden || service.id).slice(-5)}
                  </span>
                  <h3 className="text-xl font-black text-slate-900 leading-tight tracking-tight">{service.empresaNombre || 'Cliente Zion'}</h3>
                </div>
                <span className={`badge-premium ${service.estado === 'FINALIZADA' ? 'badge-success' : service.estado === 'EN_PROCESO' ? 'badge-warning' : 'badge-pending'}`}>
                  {statusIcons[service.estado]}
                  {service.estado}
                </span>
              </div>

              <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="flex items-start gap-3 text-sm text-slate-600">
                  <MapPin size={16} className="text-rose-500 shrink-0 mt-0.5" />
                  <span className="font-bold leading-tight">{service.empresaDireccion || 'Dirección no disponible'}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                  <div className="w-4 shrink-0" />
                  <span>Sede: <span className="text-slate-900 font-bold">{service.sedeNombre || 'Planta Principal'}</span></span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                  <Calendar size={16} className="text-indigo-500 shrink-0" />
                  <span>Programado: <span className="text-slate-900 font-bold">{new Date(service.fechaProgramada).toLocaleDateString('es-CO', { day: 'numeric', month: 'long' })}</span></span>
                </div>
              </div>

              <div className="pt-2 flex justify-between items-center">
                {service.estado === 'FINALIZADA' ? (
                  <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl w-full justify-center border border-emerald-100">
                    <CheckCircle2 size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Ver Historial de Atención</span>
                  </div>
                ) : (
                  <>
                    <span className="text-[10px] text-copper-600 font-black tracking-widest uppercase bg-copper-50 px-3 py-2 rounded-xl border border-copper-100">Iniciar atención ahora</span>
                    <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-copper-600 group-hover:text-white transition-all">
                      <ChevronRight size={20} />
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
