import React, { useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { RefreshCw, ClipboardList, CheckCircle2, Users, MapPin, Wrench, Settings, Globe, ShieldCheck, LayoutDashboard, Clock } from 'lucide-react';

export default function DashboardOverview() {
  const { user } = useAuth();
  const { 
    ordenes, tecnicos, visitas, mantenimientos, equipos, sedes, usuarios,
    loadingData, loadData, errorData, successData
  } = useData();

  const primaryButtonClass = "rounded-2xl bg-slate-900 px-5 py-4 text-sm font-bold text-white shadow-premium transition-soft hover:bg-slate-800 hover:-translate-y-0.5 active:scale-95";
  const smallDarkButtonClass = "rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-bold text-white shadow-premium transition-all hover:bg-slate-800 active:scale-95";

  const renderEstadoBadge = (estado) => {
    switch (estado) {
      case 'PROGRAMADA': return <span className="inline-flex rounded-full bg-blue-500/10 border border-blue-500/20 px-2 py-1 text-xs font-bold text-blue-600">Programada</span>;
      case 'EN_PROCESO': return <span className="inline-flex rounded-full bg-amber-500/10 border border-amber-500/20 px-2 py-1 text-xs font-bold text-amber-600">En proceso</span>;
      case 'FINALIZADA': return <span className="inline-flex rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 text-xs font-bold text-emerald-600">Finalizada</span>;
      case 'ACTIVO': return <span className="inline-flex rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 text-xs font-bold text-emerald-600">Activo</span>;
      case 'INACTIVO': return <span className="inline-flex rounded-full bg-rose-500/10 border border-rose-500/20 px-2 py-1 text-xs font-bold text-rose-600">Inactivo</span>;
      default: return <span className="inline-flex rounded-full bg-slate-100 px-2 py-1 text-xs font-bold text-slate-600">{estado}</span>;
    }
  };

  const stats = useMemo(() => {
    const ordenesAbiertas = ordenes.filter(
      (o) => o.estado === 'PROGRAMADA' || o.estado === 'EN_PROCESO'
    ).length;

    const ordenesFinalizadas = ordenes.filter((o) => o.estado === 'FINALIZADA').length;

    const baseStats = [
      { title: 'Órdenes abiertas', value: String(ordenesAbiertas) },
      { title: 'Órdenes finalizadas', value: String(ordenesFinalizadas) },
      { title: 'Técnicos activos', value: String(tecnicos.length) },
      { title: 'Visitas técnicas', value: String(visitas.length) },
      { title: 'Mantenimientos', value: String(mantenimientos.length) },
      { title: 'Equipos registrados', value: String(equipos.length) },
    ];

    if (user?.rol === 'ROLE_ADMIN' || user?.rol === 'admin') {
      return [
        ...baseStats,
        { title: 'Sedes registradas', value: String(sedes.length) },
        { title: 'Coordinadores', value: String(usuarios.filter(u => u.rol === 'ROLE_COORDINADOR').length) },
      ];
    }

    return baseStats;
  }, [ordenes, tecnicos, visitas, mantenimientos, equipos, sedes, usuarios, user]);

  const resentOrdersMap = useMemo(() => {
    const empresasMap = {};
    const tecnicosMap = {}; // Need actual mapping logic if we have `empresas` from context
    // Placeholder map
    return ordenes.slice(0, 5).map((orden) => ({
      id: orden.id,
      codigo: orden.numeroOrden || `Orden #${orden.id}`,
      cliente: `Empresa #${orden.empresaId ?? ''}`,
      estado: orden.estado,
      tecnico: `Técnico #${orden.tecnicoId ?? ''}`,
    }));
  }, [ordenes]);

  return (
    <>
      <header className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-4xl font-extrabold text-slate-900 font-display tracking-tighter">Dashboard</h2>
          <p className="mt-1 text-slate-500 font-medium text-lg">
            Control general del estado operativo de ZION
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={loadData}
            className={`${primaryButtonClass} flex items-center gap-2`}
          >
            <RefreshCw className={`w-4 h-4 ${loadingData ? 'animate-spin' : ''}`} />
            Actualizar
          </button>
        </div>
      </header>

      <section className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => {
          const iconMapStats = {
            'Órdenes abiertas': <ClipboardList className="w-6 h-6 text-blue-500" />,
            'Órdenes finalizadas': <CheckCircle2 className="w-6 h-6 text-emerald-500" />,
            'Técnicos activos': <Users className="w-6 h-6 text-indigo-500" />,
            'Visitas técnicas': <MapPin className="w-6 h-6 text-rose-500" />,
            'Mantenimientos': <Wrench className="w-6 h-6 text-amber-500" />,
            'Equipos registrados': <Settings className="w-6 h-6 text-slate-500" />,
            'Sedes registradas': <Globe className="w-6 h-6 text-blue-400" />,
            'Coordinadores': <ShieldCheck className="w-6 h-6 text-indigo-400" />,
          };

          return (
            <div
              key={stat.title}
              className="group relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-7 shadow-premium transition-soft hover:-translate-y-1 hover:shadow-premium-xl active:scale-95"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-100 group-hover:bg-blue-50 group-hover:ring-blue-100 transition-soft">
                  {iconMapStats[stat.title] || <LayoutDashboard className="w-6 h-6" />}
                </div>
                <div className="h-1.5 w-1.5 rounded-full bg-slate-300 group-hover:bg-blue-400 group-hover:animate-pulse transition-soft"></div>
              </div>
              <p className="text-xs font-black text-slate-500 uppercase tracking-[0.1em] font-display">{stat.title}</p>
              <p className="mt-1 text-5xl font-black text-slate-900 font-display tabular-nums tracking-tighter">
                {stat.value}
              </p>
            </div>
          );
        })}
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-xl font-semibold text-slate-900">Órdenes recientes</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-black uppercase tracking-widest text-slate-400">
                  <th className="pb-3">Código</th>
                  <th className="pb-3">Cliente</th>
                  <th className="pb-3">Estado</th>
                  <th className="pb-3">Técnico</th>
                  <th className="pb-3">Acción</th>
                </tr>
              </thead>
              <tbody>
                {resentOrdersMap.map((order) => (
                  <tr key={order.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-soft">
                    <td className="py-4 font-semibold text-slate-900 whitespace-nowrap">{order.codigo}</td>
                    <td className="py-4 whitespace-nowrap max-w-[200px] truncate">{order.cliente}</td>
                    <td className="py-4 whitespace-nowrap">{renderEstadoBadge(order.estado)}</td>
                    <td className="py-4 whitespace-nowrap max-w-[200px] truncate">{order.tecnico}</td>
                    <td className="py-4 whitespace-nowrap">
                      <button className={smallDarkButtonClass}>Ver detalle</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-6 text-2xl font-bold text-slate-950 font-display tracking-tight">Resumen rápido</h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <span className="text-sm font-semibold text-slate-600">Órdenes registradas</span>
                <span className="text-sm font-bold text-slate-900">{ordenes.length}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <span className="text-sm font-semibold text-slate-600">Técnicos registrados</span>
                <span className="text-sm font-bold text-slate-900">{tecnicos.length}</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
