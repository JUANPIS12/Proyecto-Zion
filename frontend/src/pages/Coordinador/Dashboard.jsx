import React, { useState, useEffect } from 'react';
import apiService from '../../services/apiService';
import { Button, Badge, Input } from '../../components/UI';
import { 
  Users, Briefcase, Cpu, Activity, Plus, Search, 
  Filter, MoreVertical, TrendingUp, AlertCircle 
} from 'lucide-react';

export default function CoordinatorDashboard() {
  const [stats, setStats] = useState({
    activeOrders: 0,
    activeTechs: 0,
    totalEquipments: 0,
    recentAlerts: 0
  });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [ordersData, techsData, equipmentsData] = await Promise.all([
        apiService.get('/ordenes'),
        apiService.get('/tecnicos'),
        apiService.get('/equipos')
      ]);

      setOrders(ordersData.slice(0, 8)); // Recent orders
      setStats({
        activeOrders: ordersData.filter(o => o.estado !== 'FINALIZADA').length,
        activeTechs: techsData.length,
        totalEquipments: equipmentsData.length,
        recentAlerts: 3 // Mock alert count
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-4 lg:p-8 animate-fade-in">
      {/* Header */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-white">Panel de Control</h1>
          <p className="text-slate-400 font-light mt-1">Bienvenido al centro de operaciones de Zion.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" className="bg-slate-800/50">
            <Filter size={18} className="mr-2" /> Filtros
          </Button>
          <Button size="sm">
            <Plus size={18} className="mr-2" /> Nueva Orden
          </Button>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          { label: 'Órdenes Activas', value: stats.activeOrders, icon: <Activity className="text-indigo-400" />, trend: '+12%' },
          { label: 'Técnicos en Campo', value: stats.activeTechs, icon: <Users className="text-blue-400" />, trend: 'En línea' },
          { label: 'Equipos Registrados', value: stats.totalEquipments, icon: <Cpu className="text-emerald-400" />, trend: 'Actualizado' },
          { label: 'Alertas Pendientes', value: stats.recentAlerts, icon: <AlertCircle className="text-rose-400" />, trend: 'Atención' },
        ].map((stat, i) => (
          <div key={i} className="glass-card flex items-center justify-between p-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">{stat.label}</p>
              <h3 className="text-3xl font-black">{stat.value}</h3>
              <p className="text-[10px] text-indigo-400 mt-2 flex items-center gap-1 font-bold">
                <TrendingUp size={10} /> {stat.trend}
              </p>
            </div>
            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center">
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Orders Table */}
        <div className="lg:col-span-2 glass-card overflow-hidden !p-0">
          <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
            <h3 className="font-bold flex items-center gap-2">
              <Briefcase size={18} className="text-indigo-400" /> Seguimiento de Órdenes
            </h3>
            <Button variant="ghost" size="sm" className="text-xs">Ver todas</Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-900/50 text-slate-500 font-bold uppercase text-[10px] tracking-widest">
                <tr>
                  <th className="px-6 py-4">Orden</th>
                  <th className="px-6 py-4">Cliente / Sede</th>
                  <th className="px-6 py-4">Técnico</th>
                  <th className="px-6 py-4">Estado</th>
                  <th className="px-6 py-4 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 font-mono font-medium">#{order.numeroOrden || order.id}</td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-white">{order.empresaNombre || 'Cliente'}</div>
                      <div className="text-[10px] text-slate-500">{order.sedeNombre}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-300">{order.tecnicoNombre || 'Asignando...'}</td>
                    <td className="px-6 py-4">
                      <Badge variant={order.estado === 'PROGRAMADA' ? 'pending' : order.estado === 'EN_PROCESO' ? 'warning' : 'success'}>
                        {order.estado}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 hover:bg-white/5 rounded-lg text-slate-500 hover:text-white transition-all">
                        <MoreVertical size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-6">
          <div className="glass-card">
            <h3 className="font-bold mb-4">Acciones Rápidas</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Empresas', icon: <Briefcase size={16} /> },
                { label: 'Técnicos', icon: <Users size={16} /> },
                { label: 'Equipos', icon: <Cpu size={16} /> },
                { label: 'Sedes', icon: <MapPin size={16} /> },
              ].map(action => (
                <button key={action.label} className="p-4 glass hover:bg-indigo-600/10 hover:border-indigo-500/30 rounded-xl transition-all text-center group">
                  <div className="flex justify-center mb-2 text-slate-500 group-hover:text-indigo-400">{action.icon}</div>
                  <span className="text-xs font-bold text-slate-400 group-hover:text-white">{action.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="glass-card bg-gradient-to-br from-indigo-600/20 to-transparent border-indigo-500/20">
            <h3 className="font-bold mb-2 flex items-center gap-2">
              <TrendingUp size={18} className="text-indigo-400" /> Eficiencia Global
            </h3>
            <p className="text-xs text-slate-400 mb-4 font-light">Basado en el tiempo promedio de cierre de servicios.</p>
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 w-[78%] rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
            </div>
            <div className="mt-2 text-right text-indigo-400 font-black text-lg">78%</div>
          </div>
        </div>
      </div>
    </div>
  );
}

const MapPin = ({ size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>;
