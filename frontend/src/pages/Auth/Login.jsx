import React, { useState } from 'react';
import { Users, Settings, RefreshCw, AlertCircle, CheckCircle2, Clock, MapPin } from 'lucide-react';
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
        throw new Error('Usuario o contraseña incorrectos');
      }

      const data = await res.json();
      
      // Using context login
      login({
        token: data.token,
        rol: data.rol,
        username: username,
        puedeCrearAdmin: data.puedeCrearAdmin
      });

      navigate('/'); // Redirect to dashboard
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-blue-500/30">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
        {/* Lado Izquierdo: Formulario */}
        <div className="relative flex items-center justify-center p-8 lg:p-20 z-10">
          <div className="w-full max-w-md">
            <div className="mb-12">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 shadow-premium">
                <span className="text-2xl font-bold italic">Z</span>
              </div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-500/10 border border-blue-500/20 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-blue-400">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                Sistema empresarial v2.0
              </div>
              <h1 className="text-5xl md:text-6xl font-black tracking-tighter font-display bg-gradient-to-br from-white via-slate-200 to-slate-500 bg-clip-text text-transparent leading-[1.1]">
                Bienvenido a ZION
              </h1>
              <p className="mt-6 text-lg text-slate-400 font-medium leading-relaxed max-w-sm">
                Plataforma avanzada de gestión técnica industrial. Accede para controlar sus operaciones en tiempo real.
              </p>
            </div>

            <form
              onSubmit={handleLogin}
              className="group relative rounded-[2.5rem] border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl transition-soft hover:border-white/20"
            >
              <div className="absolute -top-px left-10 right-10 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>

              <h2 className="text-3xl font-bold font-display tracking-tight text-white">Iniciar sesión</h2>
              <p className="mt-2 text-sm text-slate-400 font-medium mb-8">
                Ingresa tus credenciales para acceder al panel administrativo.
              </p>

              {error && (
                <div className="mb-6 flex items-center gap-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 p-4 text-sm font-semibold text-rose-400 animate-shake">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Usuario</label>
                  <div className="relative">
                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="admin"
                      className="w-full rounded-2xl border border-white/5 bg-slate-900/50 py-4 pl-12 pr-4 text-white outline-none transition-soft focus:border-blue-500 focus:bg-slate-900 focus:ring-4 focus:ring-blue-500/10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Contraseña</label>
                  <div className="relative">
                    <Settings className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-2xl border border-white/5 bg-slate-900/50 py-4 pl-12 pr-4 text-white outline-none transition-soft focus:border-blue-500 focus:bg-slate-900 focus:ring-4 focus:ring-blue-500/10"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-6 py-4 font-bold text-slate-950 transition-soft hover:bg-blue-50 hover:shadow-[0_0_30px_-5px_rgba(255,255,255,0.3)] active:scale-95 disabled:opacity-50"
              >
                {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : 'Entrar al sistema'}
              </button>

              <div className="mt-6 flex items-center gap-3 rounded-2xl bg-blue-500/5 p-4 text-xs font-medium text-slate-400 border border-blue-500/10">
                <AlertCircle className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span>Demo: utiliza cualquier credencial para explorar la interfaz.</span>
              </div>
            </form>
          </div>
        </div>

        {/* Lado Derecho: Preview Visual */}
        <div className="relative hidden lg:flex items-center justify-center bg-slate-900 p-20 overflow-hidden">
          {/* Background elements */}
          <div className="absolute top-0 right-0 w-[80%] h-[80%] bg-blue-600/20 blur-[120px] rounded-full -mr-40 -mt-40"></div>
          <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-indigo-600/10 blur-[100px] rounded-full -ml-20 -mb-20"></div>

          <div className="relative w-full max-w-xl">
            <div className="rounded-[2.5rem] border border-white/10 bg-slate-950/40 p-10 shadow-2xl backdrop-blur-2xl ring-1 ring-white/10">
              <div className="mb-10 flex items-center justify-between">
                <div>
                  <h3 className="text-3xl font-bold font-display">ZION Dashboard</h3>
                  <p className="mt-1 text-slate-400 font-medium">Real-time technician monitoring</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 shadow-premium">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5 mb-8">
                <div className="rounded-3xl border border-white/5 bg-white/5 p-6 hover:bg-white/10 transition-soft">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Orders</p>
                  <p className="mt-2 text-4xl font-bold font-display tracking-tight">2,482</p>
                </div>
                <div className="rounded-3xl border border-white/5 bg-white/5 p-6 hover:bg-white/10 transition-soft">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Active</p>
                  <p className="mt-2 text-4xl font-bold font-display tracking-tight text-blue-400">184</p>
                </div>
              </div>

              <div className="rounded-3xl border border-white/5 bg-slate-900/50 p-6">
                <div className="mb-5 flex items-center justify-between">
                  <h4 className="font-bold font-display flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-400" />
                    Recent Activity
                  </h4>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-2 py-1 bg-white/5 rounded-lg">Syncing...</span>
                </div>

                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-4 rounded-2xl bg-white/5 p-4 border border-white/5">
                      <div className="h-10 w-10 rounded-xl bg-slate-800 flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-slate-400" />
                      </div>
                      <div className="flex-1">
                        <div className="h-2 w-32 bg-slate-700 rounded-full mb-2"></div>
                        <div className="h-1.5 w-20 bg-slate-800 rounded-full"></div>
                      </div>
                      <div className="h-2 w-10 bg-blue-500/20 rounded-full"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
