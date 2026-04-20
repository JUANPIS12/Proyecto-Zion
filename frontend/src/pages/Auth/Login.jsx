import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, Loader2, Sparkles, LayoutDashboard, Wrench, ShieldCheck, Activity, Cpu, Zap } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;

    try {
      setLoading(true);
      setError('');

      const res = await fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (!res.ok) {
        throw new Error('Credenciales incorrectas. Verifica tu usuario y contraseña.');
      }

      const data = await res.json();
      
      login({
        token: data.token,
        rol: data.rol,
        username: username,
        puedeCrearAdmin: data.puedeCrearAdmin
      });

      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] w-full flex bg-white font-sans selection:bg-copper-500/30 overflow-hidden">
      
      {/* Lado Izquierdo: Experiencia Visual Inmersiva "Iron & Copper" (NUEVO) */}
      <div className="hidden lg:flex w-[55%] relative overflow-hidden bg-gunmetal-950 p-16 flex-col justify-between items-center text-center">
        
        {/* Capas de Fondo Tecnológicas */}
        <div className="absolute inset-0 z-0">
           {/* Gradiente de Iluminación Cenital */}
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[80%] bg-gradient-to-b from-copper-500/10 to-transparent"></div>
           {/* Spotlights laterales */}
           <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-indigo-900/10 blur-[140px] rounded-full"></div>
           <div className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] bg-copper-600/10 blur-[140px] rounded-full"></div>
           
           {/* Malla Técnica (Grid) */}
           <div className="absolute inset-0 opacity-[0.03]" 
                style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
           </div>
           {/* Ruido de metal sutil */}
           <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/brushed-alum.png')]"></div>
        </div>

        {/* Sección Superior: Badge de Estado */}
        <div className="relative z-10 animate-in fade-in slide-in-from-top-4 duration-700">
           <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-copper-400 opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-2 w-2 bg-copper-500"></span>
              </span>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-copper-100/60">SISTEMA EN LÍNEA / NÚCLEO ZION</span>
           </div>
        </div>

        {/* Sección Central: Composición Hero */}
        <div className="relative z-10 flex flex-col items-center max-w-lg">
           
           {/* Contenedor del Logo con Anillos de Poder */}
           <div className="relative mb-12 group">
              <div className="absolute inset-0 -m-8 border border-copper-500/20 rounded-full animate-pulse-slow"></div>
              <div className="absolute inset-0 -m-16 border border-white/5 rounded-full animate-pulse"></div>
              
              <div className="relative p-8 rounded-[3rem] bg-gradient-to-b from-white/5 to-transparent border border-white/10 backdrop-blur-xl shadow-2xl transition-transform duration-700 group-hover:scale-105">
                 <img src="/logo-solo.png" alt="ZION" className="h-28 w-auto drop-shadow-[0_0_30px_rgba(197,126,80,0.5)]" />
              </div>

              {/* Etiquetas Técnicas Flotantes */}
              <div className="absolute -right-12 top-0 bg-white/5 border border-white/10 px-3 py-1 rounded-lg backdrop-blur-md animate-bounce-slow">
                 <span className="text-[9px] font-black text-copper-400 font-mono">0101-SYNC</span>
              </div>
              <div className="absolute -left-16 bottom-12 bg-white/5 border border-white/10 px-3 py-1 rounded-lg backdrop-blur-md animate-pulse">
                 <span className="text-[9px] font-black text-white/40 font-mono tracking-tighter">ENCRIPTACIÓN: AES-256</span>
              </div>
           </div>

           <h1 className="text-5xl font-black text-white leading-none tracking-tighter mb-6 font-display drop-shadow-xl">
             ZION <span className="text-transparent bg-clip-text bg-gradient-to-r from-copper-400 to-copper-600 uppercase">Industrial</span>
           </h1>
           <p className="text-gunmetal-100/60 font-medium leading-relaxed max-w-sm mb-12 uppercase tracking-widest text-[11px]">
             Plataforma de alta disponibilidad para la gestión de servicios técnicos, mantenimiento industrial y control de activos en tiempo real.
           </p>

           {/* Bento Mini-Grid de Features */}
           <div className="grid grid-cols-3 gap-3 w-full">
              {[
                { icon: Activity, label: 'Tiempo Real' },
                { icon: Cpu, label: 'Procesos' },
                { icon: Zap, label: 'Eficiencia' }
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group">
                   <item.icon className="w-5 h-5 text-copper-500 mb-2 transition-transform group-hover:rotate-12" />
                   <span className="text-[9px] font-black uppercase tracking-widest text-white/40">{item.label}</span>
                </div>
              ))}
           </div>
        </div>

        {/* Sección Inferior: Credenciales / Copyright */}
        <div className="relative z-10 flex items-center gap-8 text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">
            <div className="flex items-center gap-2">
               <ShieldCheck className="w-3 h-3 text-copper-500" /> Protocolo Seguro
            </div>
            <span>© 2026 ZION Framework V2.0</span>
        </div>
      </div>

      {/* Lado Derecho: Formulario de Login (RESTAURADO EL LOOK ANTERIOR) */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 md:px-20 lg:px-24 bg-white relative z-10 w-full shadow-[-20px_0_40px_rgba(0,0,0,0.05)]">
        
        {/* Logo Móvil (Oculto en Desktop) */}
        <div className="lg:hidden flex justify-center mb-10 w-full animate-in fade-in slide-in-from-top-4 duration-500">
           <img src="/logo-solo.png" alt="ZION" className="h-20 w-auto" style={{ filter: 'drop-shadow(0px 4px 6px rgba(0,0,0,0.3))' }} />
        </div>

        <div className="w-full max-w-[420px] mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="inline-flex items-center gap-2 rounded-full bg-copper-50 px-3 py-1 text-xs font-bold text-copper-700 mb-8 border border-copper-100 shadow-sm">
                <Sparkles className="w-3.5 h-3.5" /> Portal Administrativo
            </div>

            <h2 className="text-3xl sm:text-4xl font-black tracking-tighter text-gunmetal-950 font-display mb-2">Bienvenido de nuevo</h2>
            <p className="text-gunmetal-800 font-medium text-[15px] mb-10 opacity-70">
                Por favor, ingresa tus credenciales corporativas para continuar al panel de control.
            </p>

            {error && (
                <div className="mb-8 rounded-2xl bg-rose-50 p-4 border border-rose-100 animate-in fade-in slide-in-from-top-2 shadow-sm">
                    <p className="text-sm font-semibold text-rose-600 text-center">{error}</p>
                </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-1.5">
                    <label className="text-sm font-bold text-gunmetal-900 block ml-1">Usuario ID</label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-copper-600 pointer-events-none opacity-60" />
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Ej: admin_master"
                            className="w-full rounded-2xl border-2 border-slate-200/80 bg-white py-3.5 pl-12 pr-4 text-gunmetal-950 outline-none transition duration-300 focus:border-copper-500 focus:ring-4 focus:ring-copper-500/10 hover:border-slate-300 font-medium placeholder:text-slate-400"
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <div className="flex justify-between items-center ml-1">
                        <label className="text-sm font-bold text-gunmetal-900">Contraseña secreta</label>
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-copper-600 pointer-events-none opacity-60" />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full rounded-2xl border-2 border-slate-200/80 bg-white py-3.5 pl-12 pr-4 text-gunmetal-950 outline-none transition duration-300 focus:border-copper-500 focus:ring-4 focus:ring-copper-500/10 hover:border-slate-300 font-medium placeholder:text-slate-400"
                        />
                    </div>
                </div>

                <div className="pt-2 flex flex-col gap-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-gunmetal-950 px-4 py-4 text-[15px] font-bold text-white transition duration-300 hover:bg-gunmetal-900 hover:shadow-[0_10px_40px_-10px_rgba(15,23,42,0.4)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-none font-display tracking-wide"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" /> Accediendo...
                            </>
                        ) : (
                            <>
                                Ingresar al sistema
                                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                            </>
                        )}
                    </button>

                    <p className="mt-4 text-center text-sm font-medium text-slate-400">
                        ¿Olvidaste tu contraseña? <span className="text-copper-600 font-bold cursor-pointer hover:underline">Contacta a soporte técnico</span>
                    </p>
                </div>
            </form>
        </div>
      </div>
    </div>
  );
}
