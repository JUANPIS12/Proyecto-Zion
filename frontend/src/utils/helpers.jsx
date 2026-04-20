import React from 'react';

export function formatearFecha(fecha) {
  if (!fecha) return 'Sin fecha';
  if (Array.isArray(fecha)) {
    const d = new Date(fecha[0], fecha[1] - 1, fecha[2], fecha[3] || 0, fecha[4] || 0);
    return d.toLocaleString('es-CO');
  }
  try {
    const d = new Date(fecha);
    if (Number.isNaN(d.getTime())) return fecha;
    return d.toLocaleString('es-CO', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit',
    });
  } catch {
    return fecha;
  }
}

export function parseCoordinates(value) {
  if (!value || typeof value !== 'string') return null;
  const parts = value.split(',').map((item) => item.trim());
  if (parts.length !== 2) return null;
  const lat = Number(parts[0]);
  const lng = Number(parts[1]);
  if (Number.isNaN(lat) || Number.isNaN(lng)) return null;
  return { lat, lng };
}

export function MiniMapa({ coordenadas, titulo }) {
  const coords = parseCoordinates(coordenadas);
  if (!coords) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <p className="mb-2 font-medium text-slate-700">{titulo}</p>
        <p className="text-sm text-slate-500">Aún no hay coordenadas válidas.</p>
      </div>
    );
  }
  const { lat, lng } = coords;
  const delta = 0.01;
  const bbox = `${lng - delta}%2C${lat - delta}%2C${lng + delta}%2C${lat + delta}`;
  const marker = `${lat}%2C${lng}`;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="mb-2 font-medium text-slate-700">{titulo}</p>
      <p className="mb-3 text-xs text-slate-500">
        Lat: {lat} | Lng: {lng}
      </p>
      <iframe
        title={titulo}
        width="100%"
        height="220"
        className="rounded-xl border border-slate-200"
        src={`https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${marker}`}
      />
    </div>
  );
}

export function getEstadoClasses(estado) {
  switch (estado) {
    case 'PROGRAMADA': return 'bg-blue-50 text-blue-600 border border-blue-100 ring-4 ring-blue-500/5';
    case 'EN_PROCESO': return 'bg-amber-50 text-amber-600 border border-amber-100 ring-4 ring-amber-500/5';
    case 'FINALIZADA': return 'bg-emerald-50 text-emerald-600 border border-emerald-100 ring-4 ring-emerald-500/5';
    case 'ACTIVO': return 'bg-emerald-50 text-emerald-600 border border-emerald-100 ring-4 ring-emerald-500/5';
    case 'INACTIVO': return 'bg-rose-50 text-rose-600 border border-rose-100 ring-4 ring-rose-500/5';
    case 'MANTENIMIENTO': return 'bg-violet-50 text-violet-600 border border-violet-100 ring-4 ring-violet-500/5';
    default: return 'bg-slate-50 text-slate-600 border border-slate-100';
  }
}

export function renderEstadoBadge(estado) {
  const clases = getEstadoClasses(estado);
  return (
    <span className={`rounded-full px-3 py-1 text-sm font-medium ${clases}`}>
      {estado || 'Sin estado'}
    </span>
  );
}

export function renderTipoBadge(tipo) {
  const esPreventivo = tipo === 'PREVENTIVO';
  const clases = esPreventivo
    ? 'bg-blue-50 text-blue-600 border-blue-100 ring-blue-500/5'
    : 'bg-amber-50 text-amber-600 border-amber-100 ring-amber-500/5';

  return (
    <span className={`rounded-full border px-3 py-1 text-xs font-bold ring-4 ${clases}`}>
      {tipo || 'Sin tipo'}
    </span>
  );
}
