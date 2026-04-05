import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Home, Briefcase, Users, Cpu, FileText, 
  Settings, LogOut, ShieldCheck 
} from 'lucide-react';

export default function Sidebar() {
  const { user, logout } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/coordinador', icon: <Home size={20} />, roles: ['coordinador', 'admin'] },
    { name: 'Órdenes', path: '/coordinador/ordenes', icon: <Briefcase size={20} />, roles: ['coordinador', 'admin'] },
    { name: 'Técnicos', path: '/coordinador/tecnicos', icon: <Users size={20} />, roles: ['coordinador', 'admin'] },
    { name: 'Equipos', path: '/coordinador/equipos', icon: <Cpu size={20} />, roles: ['coordinador', 'admin'] },
    { name: 'Reportes', path: '/coordinador/reportes', icon: <FileText size={20} />, roles: ['coordinador', 'admin'] },
  ];

  return (
    <aside className="w-64 min-h-screen bg-slate-900/50 border-r border-white/5 flex flex-col p-4">
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <ShieldCheck size={24} className="text-white" />
        </div>
        <span className="text-xl font-black tracking-tighter">ZION CONTROL</span>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group
              ${isActive 
                ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20' 
                : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'}
            `}
          >
            <span className="group-hover:scale-110 transition-transform">{item.icon}</span>
            <span className="font-medium text-sm">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto border-t border-white/5 pt-4">
        <div className="flex items-center gap-3 px-3 py-4 mb-2">
          <div className="w-8 h-8 rounded-full bg-slate-700 flex-center text-xs font-bold text-white uppercase">
            {user?.username?.charAt(0) || 'U'}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold truncate">{user?.username}</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest">{user?.rol}</p>
          </div>
        </div>
        <button 
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all font-medium text-sm"
        >
          <LogOut size={20} />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}
