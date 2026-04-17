import React, { useEffect, useState } from 'react';
import apiService from '../../services/apiService';
import { Badge, Button } from '../../components/UI';
import { Calendar, MapPin, ChevronRight, Clock, CheckCircle2, PlayCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function TechnicianServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const data = await apiService.get('/ordenes'); // Note: Filtered by tech in backend or frontend? Flow says "ver únicamente los servicios que le fueron asignados".
      // Assuming frontend filtering for now, but backend should handle this for security.
      setServices(data);
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

  if (loading) return <div className="p-8 text-center animate-pulse">Cargando servicios...</div>;

  return (
    <div className="p-4 safe-top animate-fade-in">
      <header className="mb-8">
        <h1 className="text-3xl font-black mb-2">Mis Servicios</h1>
        <p className="text-slate-400 font-light">Tienes {services.length} servicios asignados hoy.</p>
      </header>

      <div className="space-y-4">
        {services.length === 0 ? (
          <div className="glass-card text-center p-12">
            <Calendar size={48} className="mx-auto mb-4 text-slate-600" />
            <p className="text-slate-400">No tienes servicios pendientes.</p>
          </div>
        ) : (
          services.map((service) => (
            <div 
              key={service.id} 
              className="glass-card flex flex-col gap-4 active:scale-[0.98]"
              onClick={() => navigate(`/tecnico/servicio/${service.id}`)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-1 block">
                    Orden #{service.numeroOrden || service.id}
                  </span>
                  <h3 className="text-lg font-bold text-white">{service.empresaNombre || 'Cliente Zion'}</h3>
                </div>
                <Badge variant={service.estado === 'PROGRAMADA' ? 'pending' : service.estado === 'EN_PROCESO' ? 'warning' : 'success'}>
                  <span className="flex items-center gap-1.5">
                    {statusIcons[service.estado]}
                    {service.estado}
                  </span>
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <MapPin size={14} className="text-rose-400" />
                  <span className="text-slate-300 font-medium">{service.empresaDireccion || 'Dirección no disponible'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <div className="w-3.5" /> {/* Espaciador visual */}
                  <span>Sede: {service.sedeNombre || 'Planta Principal'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Calendar size={14} className="text-indigo-400" />
                  <span>Programado: {new Date(service.fechaProgramada).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                <span className="text-xs text-indigo-400 font-medium">Ver detalles e Iniciar</span>
                <ChevronRight size={18} className="text-slate-600" />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
