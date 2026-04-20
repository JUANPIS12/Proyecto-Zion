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
    <div className="min-h-[100dvh] w-full flex bg-white font-sans selection:bg-blue-500/30">
      
      {/* Lado Izquierdo: Gráfico Premium Abstracto (Oculto en móviles) */}
      <div className="hidden lg:flex w-[55%] relative overflow-hidden bg-slate-950 p-12 flex-col justify-between items-start">
        {/* Background Gradients */}
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-blue-600/30 blur-[120px] rounded-full mix-blend-screen pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-600/30 blur-[130px] rounded-full mix-blend-screen pointer-events-none"></div>
        
        {/* Decoración de grilla / Malla SVG */}
        <div className="absolute inset-0 z-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>

        {/* Header Superior */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-[0_0_40px_-10px_rgba(59,130,246,0.6)]">
            <span className="text-2xl font-bold italic text-white leading-none mt-1">Z</span>
          </div>
          <span className="text-2xl font-black tracking-tighter text-white font-display">ZION</span>
        </div>

        {/* Contenido Central Flotante */}
        <div className="relative z-10 w-full max-w-xl self-center">
            <h1 className="text-5xl lg:text-6xl font-black tracking-tighter text-white leading-[1.1] mb-6 font-display">
                Industrial<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Intelligence.</span>
            </h1>
            <p className="text-lg text-slate-400 font-medium max-w-md leading-relaxed mb-12">
                Sistema de control operativo y mantenimiento corporativo. Centraliza equipos, recursos y técnicos en un solo entorno de alto rendimiento.
            </p>

            {/* Tarjetas Glassmorphism */}
            <div className="grid grid-cols-2 gap-4">
               <div className="rounded-3xl bg-white/5 border border-white/10 p-6 backdrop-blur-md">
                  <LayoutDashboard className="w-8 h-8 text-blue-400 mb-4" />
                  <h3 className="text-white font-bold text-lg mb-1 font-display">Dashboard en vivo</h3>
                  <p className="text-sm text-slate-400">Trazabilidad de órdenes minuto a minuto.</p>
               </div>
               <div className="rounded-3xl bg-white/5 border border-white/10 p-6 backdrop-blur-md">
                  <Wrench className="w-8 h-8 text-indigo-400 mb-4" />
                  <h3 className="text-white font-bold text-lg mb-1 font-display">Mantenimiento</h3>
                  <p className="text-sm text-slate-400">Control preventivo y correctivo.</p>
               </div>
            </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-sm font-semibold text-slate-500 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" /> ZION Framework V2.0 
        </div>
      </div>

      {/* Lado Derecho: Formulario de Login (Full screen en móviles) */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 md:px-20 lg:px-24 bg-white relative z-10 w-full">
        
        {/* Logo Móvil (Oculto en Desktop) */}
        <div className="lg:hidden flex items-center gap-3 mb-12">
          <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-blue-600 shadow-premium">
            <span className="text-xl font-bold italic text-white leading-none mt-1">Z</span>
          </div>
          <span className="text-2xl font-black tracking-tighter text-slate-900 font-display">ZION</span>
        </div>

        <div className="w-full max-w-[420px] mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600 mb-8 border border-blue-100">
                <Sparkles className="w-3.5 h-3.5" /> Portal Administrativo
            </div>

            <h2 className="text-3xl sm:text-4xl font-black tracking-tighter text-slate-900 font-display mb-2">Bienvenido de nuevo</h2>
            <p className="text-slate-500 font-medium text-[15px] mb-10">
                Por favor, ingresa tus credenciales corporativas para continuar al panel de control.
            </p>

            {error && (
                <div className="mb-8 rounded-2xl bg-rose-50 p-4 border border-rose-100 animate-in fade-in slide-in-from-top-2">
                    <p className="text-sm font-semibold text-rose-600 text-center">{error}</p>
                </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-900 block ml-1">Usuario ID</label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Ej: admin_master"
                            className="w-full rounded-2xl border-2 border-slate-200/80 bg-white py-3.5 pl-12 pr-4 text-slate-900 outline-none transition duration-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 hover:border-slate-300 font-medium placeholder:text-slate-400"
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <div className="flex justify-between items-center ml-1">
                        <label className="text-sm font-bold text-slate-900">Contraseña secreta</label>
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full rounded-2xl border-2 border-slate-200/80 bg-white py-3.5 pl-12 pr-4 text-slate-900 outline-none transition duration-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 hover:border-slate-300 font-medium placeholder:text-slate-400"
                        />
                    </div>
                </div>

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-slate-900 px-4 py-4 text-[15px] font-bold text-white transition duration-300 hover:bg-slate-800 hover:shadow-[0_10px_40px_-10px_rgba(15,23,42,0.4)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-none font-display tracking-wide"
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
                    <p className="mt-6 text-center text-sm font-medium text-slate-400">
                        ¿Olvidaste tu contraseña? <span className="text-black font-bold cursor-pointer hover:underline">Contacta a soporte técnico</span>
                    </p>
                </div>
            </form>
        </div>
      </div>
    </div>
  );
}
