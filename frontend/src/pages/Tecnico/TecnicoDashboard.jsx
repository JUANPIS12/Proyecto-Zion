import React, { useEffect, useState } from 'react';
import apiService from '../../services/apiService';
import { useAuth } from '../../contexts/AuthContext';
import {
  User, Phone, Mail, Cpu, MapPin, CheckCircle2,
  Clock, PlayCircle, ClipboardList, Wrench, Star,
  ArrowRight, Calendar
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';

export default function TecnicoDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [perfil, setPerfil] = useState(null);
  const [misOrdenes, setMisOrdenes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) cargarDatos();
  }, [user]);

  const cargarDatos = async () => {
    try {
      const [perfilData, ordenesData] = await Promise.all([
        apiService.get('/tecnicos/mi-perfil').catch(() => null),
        apiService.get('/ordenes/mis-ordenes').catch(() => []),
      ]);
      setPerfil(perfilData);
      setMisOrdenes(Array.isArray(ordenesData) ? ordenesData : []);
    } catch (err) {
      console.error('Error cargando dashboard técnico:', err);
    } finally {
      setLoading(false);
    }
  };

  const pendientes = misOrdenes.filter(o => o.estado !== 'FINALIZADA');
  const finalizadas = misOrdenes.filter(o => o.estado === 'FINALIZADA');
  const enProceso = misOrdenes.filter(o => o.estado === 'EN_PROCESO');

  const stats = [
    { label: 'Pendientes', value: pendientes.length, icon: <Clock size={20} className="text-indigo-400" />, color: 'border-indigo-500/30 bg-indigo-500/5' },
    { label: 'En proceso', value: enProceso.length, icon: <PlayCircle size={20} className="text-amber-400" />, color: 'border-amber-500/30 bg-amber-500/5' },
    { label: 'Finalizadas', value: finalizadas.length, icon: <CheckCircle2 size={20} className="text-emerald-400" />, color: 'border-emerald-500/30 bg-emerald-500/5' },
    { label: 'Total asignadas', value: misOrdenes.length, icon: <ClipboardList size={20} className="text-copper-400" />, color: 'border-copper-500/30 bg-copper-500/5' },
  ];

  const statusConfig = {
    'PROGRAMADA': { label: 'Programada', icon: <Clock size={13} />, cls: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20' },
    'EN_PROCESO': { label: 'En proceso', icon: <PlayCircle size={13} />, cls: 'bg-amber-500/10 text-amber-300 border-amber-500/20' },
    'FINALIZADA': { label: 'Finalizada', icon: <CheckCircle2 size={13} />, cls: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' },
  };

  if (loading) {
    return (
      <div className="p-8 text-center animate-pulse text-copper-400 font-bold">
        Cargando tu panel...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-4 lg:p-10 animate-fade-in">
      {/* Header */}
      <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <div className="w-2 h-10 bg-copper-600 rounded-full shadow-glow-copper" />
            <h1 className="text-4xl font-black tracking-tighter text-slate-950">
              ¡Hola, <span className="text-copper-600">{perfil?.nombre?.split(' ')[0] || user?.username}</span>!
            </h1>
          </div>
          <p className="text-slate-500 font-medium ml-5 text-lg">Tu panel de control de servicios — {new Date().toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
        </div>
        
        <div className="flex bg-white p-2 rounded-2xl shadow-premium border border-slate-100">
           <div className="px-4 py-2 border-r border-slate-100">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Sede</p>
              <p className="text-sm font-black text-slate-900">{perfil?.sedeNombre || '---'}</p>
           </div>
           <div className="px-4 py-2">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Estado</p>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-sm font-black text-slate-900">Activo</p>
              </div>
           </div>
        </div>
      </header>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Profile + Stats Column */}
        <div className="lg:col-span-1 space-y-6">
          {/* Perfil Tarjeta Elegante */}
          <div className="glass-card !p-8 bg-slate-900 text-white relative overflow-hidden group shadow-2xl">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-copper-500/20 rounded-full blur-2xl group-hover:bg-copper-500/40 transition-all duration-700" />
            
            <div className="flex flex-col items-center text-center mb-8 relative z-10">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-copper-400 to-copper-700 flex items-center justify-center shadow-xl mb-4 group-hover:scale-110 transition-transform">
                <User size={36} className="text-white" />
              </div>
              <h2 className="text-xl font-black text-white">{perfil?.nombre || user?.username}</h2>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-copper-400 mt-1">Técnico Certificado</span>
            </div>

            <div className="space-y-4 relative z-10 border-t border-white/10 pt-6">
              {perfil?.tecnologias && (
                <div className="flex flex-wrap justify-center gap-2">
                  {[...(perfil.tecnologias || [])].map(tec => (
                    <span key={tec} className="text-[9px] font-black px-2.5 py-1 rounded-full bg-white/10 border border-white/10 text-slate-200">
                      {tec}
                    </span>
                  ))}
                </div>
              )}
              <div className="flex items-center justify-center gap-2 text-slate-400 text-xs font-medium">
                <Mail size={12} /> {user?.email || `${user?.username}@zion.com`}
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="glass-card !p-6 flex items-center gap-5 border-slate-100 bg-white hover:border-copper-200">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${s.color.split(' ')[0]} ${s.color.split(' ')[1].replace('5', '10')}`}>
                  {s.icon}
                </div>
                <div>
                  <p className="text-sm font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
                  <p className="text-3xl font-black text-slate-900 tracking-tighter">{s.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Orders Table Column */}
        <div className="lg:col-span-3">
          <div className="glass-card !p-0 overflow-hidden border-slate-200 bg-white">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-copper-500 rounded-xl text-white shadow-glow-copper">
                  <ClipboardList size={20} />
                </div>
                <h3 className="font-black text-xl text-slate-900 tracking-tight">Servicios Asignados Recientes</h3>
              </div>
              <button
                onClick={() => navigate('/tecnico/servicios')}
                className="flex items-center gap-2 text-xs font-black text-copper-600 hover:text-copper-700 uppercase tracking-widest transition-all"
              >
                Ver historial completo <ArrowRight size={14} />
              </button>
            </div>

            {misOrdenes.length === 0 ? (
              <div className="p-20 text-center">
                <Wrench size={50} className="mx-auto mb-4 text-slate-200" />
                <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">No hay servicios programados para hoy.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400">
                      <th className="px-6 py-4">Orden</th>
                      <th className="px-6 py-4">Cliente / Sede</th>
                      <th className="px-6 py-4">Programación</th>
                      <th className="px-6 py-4">Estado</th>
                      <th className="px-6 py-4"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {misOrdenes.slice(0, 8).map((orden) => {
                      const sc = statusConfig[orden.estado] || statusConfig['PROGRAMADA'];
                      return (
                        <tr key={orden.id} className="group hover:bg-slate-50/80 transition-colors">
                          <td className="px-6 py-5">
                            <span className="font-black text-copper-600 bg-copper-50 px-2 py-1 rounded-lg text-xs">
                              #{String(orden.numeroOrden || orden.id).slice(-5)}
                            </span>
                          </td>
                          <td className="px-6 py-5">
                            <div className="font-black text-slate-900">{orden.empresaNombre || 'Cliente Zion'}</div>
                            <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-bold mt-0.5">
                              <MapPin size={10} /> {orden.empresaDireccion || 'Dirección no disponible'}
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                              <Calendar size={14} className="text-indigo-500" />
                              {new Date(orden.fechaProgramada).toLocaleDateString('es-CO')}
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <span className={`badge-premium ${orden.estado === 'FINALIZADA' ? 'badge-success' : orden.estado === 'EN_PROCESO' ? 'badge-warning' : 'badge-pending'}`}>
                              {sc.icon} {sc.label}
                            </span>
                          </td>
                          <td className="px-6 py-5 text-right">
                            <button
                              onClick={() => navigate(`/tecnico/servicio/${orden.id}`)}
                              className="p-2 rounded-xl bg-slate-100 text-slate-500 hover:bg-copper-600 hover:text-white transition-all shadow-sm hover:shadow-glow-copper"
                            >
                              <ArrowRight size={18} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

}
