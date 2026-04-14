import React from 'react';

export const Button = ({ children, variant = 'primary', size = 'md', className = '', ...props }) => {
  const base = 'inline-flex items-center justify-center font-bold tracking-tight transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none';
  
  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-premium hover:shadow-premium-xl',
    secondary: 'bg-slate-700 text-white hover:bg-slate-600 border border-slate-600',
    outline: 'bg-transparent border border-indigo-500/50 text-indigo-400 hover:bg-indigo-500/10',
    ghost: 'bg-transparent hover:bg-slate-800 text-slate-300',
    danger: 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs tracking-wide uppercase font-black',
    md: 'px-5 py-2.5',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <button 
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export const Input = ({ label, error, className = '', ...props }) => (
  <div className={`flex flex-col gap-2 ${className}`}>
    {label && <label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-500 px-1">{label}</label>}
    <input 
      className={`w-full bg-slate-800/50 border ${error ? 'border-red-500/50' : 'border-slate-800'} rounded-2xl px-5 py-3 text-white outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-soft text-sm font-medium`}
      {...props}
    />
    {error && <span className="text-xs font-medium text-red-400 px-1">{error}</span>}
  </div>
);

export const Badge = ({ children, variant = 'info', className = '' }) => {
  const variants = {
    info: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    danger: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    pending: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  };

  return (
    <span className={`px-3 py-1 rounded-lg text-[10px] uppercase font-black tracking-widest border ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};
