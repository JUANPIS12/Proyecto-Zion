import React, { useMemo, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  LayoutDashboard, ClipboardList, MapPin, Wrench, 
  Settings, Users, Building2, FileText, LogOut, ShieldCheck, Globe, Cpu, Menu, X
} from 'lucide-react';

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const iconMap = {
    'Dashboard': <LayoutDashboard className="w-4 h-4" />,
    'Órdenes de servicio': <ClipboardList className="w-4 h-4" />,
    'Visitas técnicas': <MapPin className="w-4 h-4" />,
    'Mantenimientos': <Wrench className="w-4 h-4" />,
    'Equipos': <Cpu className="w-4 h-4" />,
    'Clientes': <Building2 className="w-4 h-4" />,
    'Técnicos': <Users className="w-4 h-4" />,
    'Tecnologías': <Settings className="w-4 h-4" />,
    'Reportes': <FileText className="w-4 h-4" />,
    'Sedes': <Globe className="w-4 h-4" />,
    'Coordinadores': <ShieldCheck className="w-4 h-4" />
  };

  const menu = useMemo(() => {
    let items = [
      { name: 'Dashboard', path: '/' },
      { name: 'Órdenes de servicio', path: '/ordenes' },
      { name: 'Visitas técnicas', path: '/visitas' },
      { name: 'Mantenimientos', path: '/mantenimientos' },
      { name: 'Equipos', path: '/equipos' },
      { name: 'Clientes', path: '/clientes' },
      { name: 'Técnicos', path: '/tecnicos' },
      { name: 'Tecnologías', path: '/tecnologias' },
      { name: 'Reportes', path: '/reportes' }
    ];

    if (user?.rol === 'ROLE_TECNICO') {
      items = items.filter(item => !['Visitas técnicas', 'Clientes', 'Técnicos', 'Tecnologías'].includes(item.name));
    } else if (user?.rol === 'ROLE_ADMIN') {
      items = [...items, { name: 'Sedes', path: '/sedes' }, { name: 'Coordinadores', path: '/coordinadores' }];
    }

    return items;
  }, [user]);

  const SidebarContent = () => (
    <>
      <div className="flex items-center justify-between h-24 px-6 mb-2 border-b border-white/5 bg-gunmetal-950/50">
        <div className="flex items-center gap-3 w-full pt-2">
          <img src="/logo-completo.png" alt="ZION Logo" className="h-[3.5rem] w-auto drop-shadow-lg mx-auto" />
        </div>
        <button className="lg:hidden text-white absolute right-4 top-8" onClick={() => setMobileMenuOpen(false)}>
           <X className="w-6 h-6" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 mt-6 space-y-1.5 scrollbar-hide pb-4">
        {menu.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === '/'}
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) => `
              group relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 text-sm font-semibold
              ${isActive 
                ? 'bg-copper-500 shadow-glow text-white scale-[1.02]' 
                : 'text-gunmetal-100/60 hover:bg-white/5 hover:text-white hover:scale-[1.01]'}
            `}
          >
            {({ isActive }) => (
              <>
                <span className={`relative z-10 transition-transform duration-300 ${isActive ? 'scale-110 drop-shadow-md' : 'group-hover:scale-110 group-hover:text-copper-400'}`}>
                  {iconMap[item.name]}
                </span>
                <span className={`relative z-10 transition-all ${isActive ? 'text-white' : ''}`}>
                  {item.name}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 mt-auto relative z-10 border-t border-white/5 bg-gunmetal-950/80 backdrop-blur-xl">
        <div className="mb-4 flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/5 border border-white/5 shadow-inner hidden md:flex">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-copper-400 to-copper-600 shadow-[0_0_15px_-3px_rgba(197,126,80,0.5)]">
            <ShieldCheck className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-xs font-bold text-white">{user?.username}</p>
            <p className="truncate text-[9px] uppercase tracking-wider font-bold text-copper-400">
              {user?.rol?.replace('ROLE_', '')}
            </p>
          </div>
        </div>
        
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-bold text-gunmetal-100/60 transition-soft hover:bg-rose-500/10 hover:text-rose-400 hover:shadow-[inset_0_0_20px_rgba(244,63,94,0.1)] group"
        >
          <LogOut className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Cerrar sesión
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-[100dvh] bg-slate-50 text-slate-900 font-sans selection:bg-copper-500/30 overflow-hidden relative">
      
      {/* Mobile Top Bar */}
      <div className="lg:hidden absolute top-0 left-0 right-0 h-16 bg-gunmetal-950 border-b border-copper-500/20 z-40 flex items-center justify-between px-5 shadow-[0_4px_20px_-5px_rgba(0,0,0,0.5)]">
        <button className="text-white hover:text-copper-400 transition-colors" onClick={() => setMobileMenuOpen(true)}>
           <Menu className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-3 h-full py-2">
          <img src="/logo-completo.png" alt="ZION" className="h-full w-auto object-contain drop-shadow-md" />
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-50 bg-gunmetal-950/80 backdrop-blur-sm transition-opacity lg:hidden ${mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setMobileMenuOpen(false)} />
      
      {/* Mobile Sidebar */}
      <aside className={`fixed top-0 left-0 bottom-0 w-64 bg-gunmetal-900 border-r border-white/5 z-50 shadow-2xl transition-transform duration-300 lg:hidden flex flex-col ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
         {SidebarContent()}
      </aside>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-gunmetal-900 border-r border-white/5 relative z-20 shadow-[8px_0_40px_rgba(0,0,0,0.15)]">
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-copper-500/5 to-transparent pointer-events-none"></div>
        {SidebarContent()}
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50 relative z-10 pt-16 lg:pt-0">
        {/* Sombra de división sutil izquierda */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-r from-gunmetal-950/5 to-transparent pointer-events-none"></div>
        
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 lg:p-10">
          <div className="mx-auto max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-500">
             <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
