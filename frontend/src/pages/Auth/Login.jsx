import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button, Input } from '../../components/UI';
import { LogIn, ShieldCheck, Mail, Lock } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) throw new Error('Credenciales incorrectas');

      const data = await res.json();
      login({
        token: data.token,
        rol: data.rol,
        username: data.username
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-[#0f172a]">
      {/* Left Decoration */}
      <div className="hidden lg:flex flex-col justify-center p-12 relative overflow-hidden bg-gradient-to-br from-indigo-900 to-slate-950">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full -translate-x-1/2 translate-y-1/2"></div>
        
        <div className="relative z-10 animate-fade-in">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mb-8 shadow-2xl shadow-indigo-500/40">
            <ShieldCheck size={32} className="text-white" />
          </div>
          <h1 className="text-5xl font-black text-white mb-6 leading-tight">
            Gestión Inteligente <br />
            <span className="text-indigo-400">Zion Control</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-lg mb-8 leading-relaxed font-light">
            Estandares de clase mundial para la gestión del servicio técnico. Eficiencia, trazabilidad y control en la palma de tu mano.
          </p>
          <div className="grid grid-cols-2 gap-4">
            {[ 
              { label: 'Heurística aplicada', val: '100%' },
              { label: 'Soporte 24/7', val: 'Directo' }
            ].map((item, i) => (
              <div key={i} className="glass border-white/5 p-4 rounded-xl">
                <div className="text-2xl font-bold text-white">{item.val}</div>
                <div className="text-xs text-slate-500 uppercase tracking-widest">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Login Form */}
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="lg:hidden flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
              <ShieldCheck size={20} className="text-white" />
            </div>
            <span className="text-2xl font-black text-white tracking-tighter">ZION</span>
          </div>

          <h2 className="text-3xl font-bold text-white mb-2">Bienvenido de nuevo</h2>
          <p className="text-slate-400 mb-8 font-light">Ingresa tus credenciales para acceder a la plataforma.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input 
              label="Usuario o Email" 
              placeholder="ej: juanperez" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="group"
            />
            
            <Input 
              label="Contraseña" 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg animate-fade-in">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full lg:h-12 h-10 shadow-lg" loading={loading}>
              {loading ? 'Accediendo...' : 'Iniciar Sesión'}
              {!loading && <LogIn size={18} className="ml-2" />}
            </Button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-800 text-center">
            <p className="text-slate-500 text-sm">
              ¿Problemas para acceder? <br />
              <a href="#" className="text-indigo-400 hover:text-indigo-300 font-medium mt-2 inline-block">Contactar al Administrador</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
