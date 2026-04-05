import React from 'react';

export const Button = ({ children, variant = 'primary', size = 'md', className = '', ...props }) => {
  const base = 'inline-flex items-center justify-center font-medium transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none';
  
  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-[0_0_20px_rgba(79,70,229,0.3)]',
    secondary: 'bg-slate-700 text-white hover:bg-slate-600 border border-slate-600',
    outline: 'bg-transparent border border-indigo-500/50 text-indigo-400 hover:bg-indigo-500/10',
    ghost: 'bg-transparent hover:bg-slate-800 text-slate-300',
    danger: 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
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
  <div className={`flex flex-col gap-1.5 ${className}`}>
    {label && <label className="text-sm font-medium text-slate-400 px-1">{label}</label>}
    <input 
      className={`w-full bg-slate-800/50 border ${error ? 'border-red-500/50' : 'border-slate-700'} rounded-lg px-4 py-2.5 text-white outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all`}
      {...props}
    />
    {error && <span className="text-xs text-red-400 px-1">{error}</span>}
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
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};
