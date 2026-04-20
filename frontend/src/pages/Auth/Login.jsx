import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, Loader2, Sparkles, LayoutDashboard, Wrench, ShieldCheck } from 'lucide-react';
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
    <div className="min-h-[100dvh] w-full flex bg-white font-sans selection:bg-copper-500/30">
      
      {/* Lado Izquierdo: Gráfico Premium Cobre/Metal (Oculto en móviles) */}
      <div className="hidden lg:flex w-[55%] relative overflow-hidden bg-gunmetal-950 p-12 flex-col justify-between items-start">
        {/* Background Gradients: Cobre y Metal profundo */}
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-copper-600/20 blur-[120px] rounded-full mix-blend-screen pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-copper-400/10 blur-[130px] rounded-full mix-blend-screen pointer-events-none"></div>
        
        {/* Decoración de grilla */}
        <div className="absolute inset-0 z-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>

        {/* Header Superior - Logo Completo */}
        <div className="relative z-10 w-full animate-in fade-in slide-in-from-top-4 duration-700">
           <img src="/logo-completo.png" alt="ZION" className="h-16 w-auto drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]" />
        </div>

        {/* Contenido Central Flotante */}
        <div className="relative z-10 w-full max-w-xl self-center animate-in fade-in slide-in-from-left-8 duration-1000 delay-150">
            <h1 className="text-5xl lg:text-6xl font-black tracking-tighter text-white leading-[1.1] mb-6 font-display drop-shadow-md">
                Ingeniería &<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-copper-400 to-copper-600 drop-shadow-sm">Precisión.</span>
            </h1>
            <p className="text-lg text-gunmetal-100 font-medium max-w-md leading-relaxed mb-12 opacity-90">
                Sistema de control operativo y mantenimiento corporativo. Centraliza equipos, recursos y técnicos en un solo entorno de alto rendimiento.
            </p>

            {/* Tarjetas Glassmorphism */}
            <div className="grid grid-cols-2 gap-4">
               <div className="rounded-3xl bg-white/5 border border-white/10 p-6 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
                  <LayoutDashboard className="w-8 h-8 text-copper-400 mb-4" />
                  <h3 className="text-white font-bold text-lg mb-1 font-display">Dashboard en vivo</h3>
                  <p className="text-sm text-gunmetal-100/70">Trazabilidad minuto a minuto.</p>
               </div>
               <div className="rounded-3xl bg-white/5 border border-white/10 p-6 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
                  <Wrench className="w-8 h-8 text-copper-500 mb-4" />
                  <h3 className="text-white font-bold text-lg mb-1 font-display">Mantenimiento</h3>
                  <p className="text-sm text-gunmetal-100/70">Asistencia técnica central.</p>
               </div>
            </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-sm font-semibold text-gunmetal-100/50 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" /> ZION Industrial V2.0 
        </div>
      </div>

      {/* Lado Derecho: Formulario de Login (Full screen en móviles) */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 md:px-20 lg:px-24 bg-white relative z-10 w-full shadow-[-20px_0_40px_rgba(0,0,0,0.05)]">
        
        {/* Logo Móvil (Oculto en Desktop) */}
        <div className="lg:hidden flex justify-center mb-10 w-full animate-in fade-in slide-in-from-top-4 duration-500">
           <img src="/logo-completo.png" alt="ZION" className="h-20 w-auto" style={{ filter: 'drop-shadow(0px 4px 6px rgba(0,0,0,0.3))' }} />
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
                            className="w-full rounded-2xl border-2 border-slate-200 bg-slate-50/50 py-3.5 pl-12 pr-4 text-gunmetal-950 outline-none transition-soft focus:border-copper-500 focus:bg-white focus:ring-4 focus:ring-copper-500/10 hover:border-slate-300 font-medium placeholder:text-slate-400"
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
                            className="w-full rounded-2xl border-2 border-slate-200 bg-slate-50/50 py-3.5 pl-12 pr-4 text-gunmetal-950 outline-none transition-soft focus:border-copper-500 focus:bg-white focus:ring-4 focus:ring-copper-500/10 hover:border-slate-300 font-medium placeholder:text-slate-400"
                        />
                    </div>
                </div>

                <div className="pt-2 flex flex-col gap-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-gunmetal-950 px-4 py-4 text-[15px] font-bold text-white transition-soft shadow-premium hover:bg-gunmetal-900 hover:shadow-[0_10px_40px_-5px_rgba(28,33,40,0.5)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] disabled:opacity-70 font-display tracking-wide"
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

                    {/* Botón Alternativo simulando Hardware estético */}
                    <button type="button" className="group flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-slate-200 px-4 py-3.5 text-[14px] font-bold text-gunmetal-800 transition-soft hover:border-copper-500 hover:bg-copper-50">
                        <ShieldCheck className="w-4 h-4 text-copper-500" />
                        Acceso con Tarjeta RFID
                    </button>

                    <p className="mt-4 text-center text-xs font-semibold text-slate-400">
                        ¿Olvidaste tu contraseña? <span className="text-copper-600 cursor-pointer hover:underline">Contacta a soporte técnico</span>
                    </p>
                </div>
            </form>
        </div>
      </div>
    </div>
  );
}
