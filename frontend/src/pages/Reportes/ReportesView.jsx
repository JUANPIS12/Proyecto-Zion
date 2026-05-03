import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import apiService from '../../services/apiService';
import { Badge } from '../../components/UI';
import { BarChart3, Clock, TrendingUp, Users, Calendar, ArrowRight } from 'lucide-react';

export default function ReportesView() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [horasData, setHorasData] = useState([]);

  useEffect(() => {
    loadReportes();
  }, [user]);

  const loadReportes = async () => {
    try {
      setLoading(true);
      const endpoint = user?.rol === 'ROLE_TECNICO' ? '/reportes/mis-horas' : '/reportes/horas-tecnicos';
      const data = await apiService.get(endpoint);
      setHorasData(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error cargando reportes:', err);
    } finally {
      setLoading(false);
    }
  };

  const maxHoras = useMemo(() => {
    if (horasData.length === 0) return 40;
    return Math.max(...horasData.map(d => d.horas), 8);
  }, [horasData]);

  if (loading) {
    return (
      <div className="p-8 text-center animate-pulse">
        <BarChart3 className="mx-auto mb-4 text-copper-400 animate-bounce" size={48} />
        <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">Generando reportes de desempeño...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto animate-fade-in space-y-8">
      <header className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-8 bg-copper-500 rounded-full" />
          <h1 className="text-4xl font-black tracking-tighter text-slate-900">Reportes de Actividad</h1>
        </div>
        <p className="text-slate-500 font-medium text-lg ml-5">
          {user?.rol === 'ROLE_TECNICO' 
            ? 'Seguimiento personal de tus horas laboradas esta semana.' 
            : 'Consolidado de rendimiento y horas técnicas por equipo.'}
        </p>
      </header>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Resumen Card */}
        <div className="glass-card flex flex-col justify-between border-copper-100 bg-gradient-to-br from-white to-copper-50/30">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-copper-500/10 flex items-center justify-center mb-4 border border-copper-200">
              <Clock className="text-copper-600" size={24} />
            </div>
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-500 mb-1">Total Horas (Semanal)</h3>
            <p className="text-5xl font-black text-slate-900 tracking-tighter">
              {horasData.reduce((acc, curr) => acc + curr.horas, 0).toFixed(1)}
            </p>
          </div>
          <div className="mt-6 flex items-center gap-2 text-emerald-600 font-bold text-xs bg-emerald-50 px-3 py-1.5 rounded-lg w-fit">
            <TrendingUp size={14} /> +12% vs semana anterior
          </div>
        </div>

        {/* Info Card */}
        <div className="glass-card border-slate-200">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-4 border border-indigo-200">
            <Calendar className="text-indigo-600" size={24} />
          </div>
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-500 mb-1">Periodo Actual</h3>
          <p className="text-xl font-bold text-slate-900">Semana {new Date().toLocaleDateString('es-CO', { week: 'numeric' })} de {new Date().getFullYear()}</p>
          <p className="text-xs text-slate-400 mt-1">Calculado automáticamente por visitas finalizadas.</p>
        </div>

        {/* Action Card */}
        <div className="glass-card border-slate-900 bg-slate-900 text-white group cursor-pointer hover:bg-slate-800 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-4">
            <Users className="text-copper-400" size={24} />
          </div>
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-1">Personal</h3>
          <p className="text-xl font-bold text-white">
            {user?.rol === 'ROLE_TECNICO' ? 'Tu Desempeño' : `${horasData.length} Técnicos Activos`}
          </p>
          <div className="mt-6 flex items-center gap-2 text-copper-400 font-bold text-xs group-hover:translate-x-1 transition-transform">
            Ver detalles <ArrowRight size={14} />
          </div>
        </div>
      </div>

      {/* Gráfico de Horas */}
      <section className="glass-card p-8 border-slate-200">
        <h2 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
          <BarChart3 className="text-copper-500" />
          Desglose de Horas Trabajadas
        </h2>

        <div className="space-y-8">
          {horasData.length === 0 ? (
             <div className="py-12 text-center text-slate-400 italic">No hay datos de horas para esta semana aún.</div>
          ) : (
            horasData.map((item, index) => (
              <div key={index} className="group">
                <div className="flex justify-between items-end mb-2">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block mb-1">Técnico</span>
                    <span className="text-sm font-black text-slate-900 group-hover:text-copper-600 transition-colors">{item.tecnicoNombre}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-slate-900">{item.horas.toFixed(1)}</span>
                    <span className="text-xs font-bold text-slate-400 ml-1">hrs</span>
                  </div>
                </div>
                <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200 shadow-inner">
                  <div 
                    className="h-full bg-gradient-to-r from-copper-500 to-copper-400 rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(197,126,80,0.3)]"
                    style={{ width: `${(item.horas / maxHoras) * 100}%` }}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Tabla Detallada (Solo Coordinador) */}
      {user?.rol !== 'ROLE_TECNICO' && (
        <section className="glass-card border-slate-200 overflow-hidden !p-0">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-xl font-black text-slate-900">Listado de Rendimiento</h2>
          </div>
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Técnico</th>
                <th className="px-6 py-4 text-center">Horas Totales</th>
                <th className="px-6 py-4 text-center">Estado Semanal</th>
                <th className="px-6 py-4 text-right">Eficiencia</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {horasData.map((item, index) => (
                <tr key={index} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900">{item.tecnicoNombre}</div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase">{item.semana}</div>
                  </td>
                  <td className="px-6 py-4 text-center font-black text-slate-700">{item.horas.toFixed(1)} h</td>
                  <td className="px-6 py-4 text-center">
                    <Badge variant={item.horas > 30 ? 'success' : item.horas > 15 ? 'warning' : 'pending'}>
                      {item.horas > 30 ? 'ÓPTIMO' : item.horas > 15 ? 'REGULAR' : 'BAJO'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="font-black text-emerald-600">
                      {Math.min(100, (item.horas / 40) * 100).toFixed(0)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
}

