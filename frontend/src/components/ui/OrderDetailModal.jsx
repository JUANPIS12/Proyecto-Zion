import React from 'react';
import { X, ClipboardList, Clock, MapPin, Wrench, ShieldCheck, Cpu } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { formatearFecha, renderTipoBadge } from '../../utils/helpers';

const TarjetaDetalle = ({ titulo, valor, icon: Icon }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:bg-slate-50">
    <div className="flex items-center gap-3 mb-2">
      <div className="p-2 rounded-lg bg-copper-50">
        <Icon className="w-4 h-4 text-copper-600" />
      </div>
      <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{titulo}</p>
    </div>
    <p className="text-lg font-black text-slate-900 font-display tabular-nums tracking-tight">{valor}</p>
  </div>
);

export default function OrderDetailModal() {
  const { 
    detalleOrden, cargandoDetalleOrden, mostrarModalDetalleOrden, closeDetalleOrden 
  } = useData();

  if (!mostrarModalDetalleOrden) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-gunmetal-950/40 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-[2.5rem] border border-white/10 bg-white shadow-2xl flex flex-col scale-in-center">
        
        {/* Header con gradiente metálico */}
        <div className="relative h-32 w-full bg-gunmetal-950 flex items-center justify-between px-8 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-copper-600/20 to-transparent pointer-events-none"></div>
          <div className="relative z-10 flex items-center gap-4">
             <div className="h-14 w-14 rounded-2xl bg-copper-500 flex items-center justify-center shadow-glow">
                <ClipboardList className="w-8 h-8 text-white" />
             </div>
             <div>
                <h3 className="text-3xl font-black text-white font-display tracking-tighter">Detalle de Orden</h3>
                <p className="text-copper-400 font-bold uppercase tracking-widest text-[10px]">Expediente consolidado de servicio</p>
             </div>
          </div>
          <button 
            onClick={closeDetalleOrden}
            className="relative z-10 p-3 rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-soft"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide">
          {cargandoDetalleOrden ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <div className="w-12 h-12 border-4 border-copper-200 border-t-copper-600 rounded-full animate-spin"></div>
                <p className="text-slate-500 font-bold animate-pulse uppercase tracking-widest text-xs">Cargando base de datos...</p>
            </div>
          ) : detalleOrden ? (
            <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
              
              {/* Resumen Principal */}
              <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <TarjetaDetalle titulo="Número" valor={detalleOrden.numeroOrden || `ORD-${detalleOrden.id}`} icon={ClipboardList} />
                <TarjetaDetalle titulo="Estado" valor={detalleOrden.estado} icon={Clock} />
                <TarjetaDetalle titulo="Cliente" valor={detalleOrden.empresaNombre || 'Consumidor Final'} icon={ShieldCheck} />
                <TarjetaDetalle titulo="Responsable" valor={detalleOrden.tecnicoNombre || 'No asignado'} icon={ShieldCheck} />
              </section>

              {/* Tecnologías Asociadas */}
              <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                <div className="flex items-center gap-2 mb-4">
                   <Cpu className="w-5 h-5 text-copper-600" />
                   <h4 className="text-lg font-bold text-slate-900 font-display">Capacidades del Técnico</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(detalleOrden.tecnicoTecnologias || []).map((tec, idx) => (
                    <span key={idx} className="rounded-xl bg-gunmetal-900 px-4 py-2 text-xs font-bold text-white shadow-sm ring-1 ring-white/10">
                      {tec}
                    </span>
                  ))}
                  {(detalleOrden.tecnicoTecnologias || []).length === 0 && (
                    <p className="text-slate-400 text-sm font-medium italic px-2">Sin tecnologías registradas.</p>
                  )}
                </div>
              </section>

              {/* Mantenimientos */}
              <section className="space-y-4">
                <div className="flex items-center gap-2">
                   <Wrench className="w-5 h-5 text-copper-600" />
                   <h4 className="text-xl font-bold text-slate-900 font-display">Mantenimientos Ejecutados</h4>
                </div>
                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50 border-b border-slate-200">
                        <tr className="text-xs font-black uppercase tracking-widest text-slate-400">
                          <th className="px-6 py-4">ID</th>
                          <th className="px-6 py-4">Tipo</th>
                          <th className="px-6 py-4">Descripción</th>
                          <th className="px-6 py-4 text-center">Tiempos (I/F)</th>
                          <th className="px-6 py-4">Estado Final</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {detalleOrden.mantenimientos?.map((m) => (
                          <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 text-slate-900 font-bold">{m.id}</td>
                            <td className="px-6 py-4">{renderTipoBadge(m.tipo)}</td>
                            <td className="px-6 py-4">
                               <p className="text-sm font-medium text-slate-700 max-w-xs">{m.descripcion}</p>
                               <p className="text-[10px] text-slate-400 uppercase font-black mt-1">Ref: {m.equipoId}</p>
                            </td>
                            <td className="px-6 py-4 text-center">
                               <div className="inline-flex flex-col gap-1">
                                  <span className="text-[10px] font-bold text-slate-500 bg-slate-100 rounded px-1.5">{formatearFecha(m.fechaInicio)}</span>
                                  <span className="text-[10px] font-bold text-copper-600 bg-copper-50 rounded px-1.5">{formatearFecha(m.fechaFin)}</span>
                               </div>
                            </td>
                            <td className="px-6 py-4">
                               <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black border border-emerald-100 uppercase">
                                  {m.estadoFinal || 'Completado'}
                               </span>
                            </td>
                          </tr>
                        ))}
                        {(!detalleOrden.mantenimientos || detalleOrden.mantenimientos.length === 0) && (
                          <tr><td colSpan="5" className="px-6 py-8 text-center text-slate-400 font-medium italic">No se registran actividades de taller.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>

              {/* Visitas */}
              <section className="space-y-4">
                <div className="flex items-center gap-2">
                   <MapPin className="w-5 h-5 text-copper-600" />
                   <h4 className="text-xl font-bold text-slate-900 font-display">Bitácora de Visitas</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {detalleOrden.visitas?.map((v) => (
                     <div key={v.id} className="p-5 rounded-3xl border border-slate-200 bg-white hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                           <span className="font-black text-slate-300 text-2xl font-display">#{v.id}</span>
                           <span className="text-[10px] font-bold text-slate-500 px-2 py-1 bg-slate-100 rounded-lg">{formatearFecha(v.fechaInicio)}</span>
                        </div>
                        <p className="text-sm text-slate-700 font-medium mb-4 leading-relaxed">{v.observaciones || 'Sin observaciones de campo.'}</p>
                        <div className="flex gap-2 border-t border-slate-100 pt-4">
                           <div className="flex-1">
                              <p className="text-[9px] font-black uppercase text-slate-400 mb-1">Coordenadas Inicio</p>
                              <code className="text-[10px] font-bold bg-slate-900 text-white px-2 py-1 rounded-lg block truncate">{v.ubicacionInicio}</code>
                           </div>
                           <div className="flex-1 text-right">
                              <p className="text-[9px] font-black uppercase text-slate-400 mb-1">Coordenadas Fin</p>
                              <code className="text-[10px] font-bold bg-copper-600 text-white px-2 py-1 rounded-lg block truncate">{v.ubicacionFin}</code>
                           </div>
                        </div>
                     </div>
                   ))}
                   {(!detalleOrden.visitas || detalleOrden.visitas.length === 0) && (
                     <div className="col-span-full py-10 text-center border-2 border-dashed border-slate-200 rounded-[2rem] text-slate-400 font-medium italic">No hay historial de geoposicionamiento.</div>
                   )}
                </div>
              </section>

            </div>
          ) : (
            <div className="text-center py-20 text-slate-400 font-medium italic">No se pudo recuperar el expediente de detalle.</div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-end">
           <button 
             onClick={closeDetalleOrden}
             className="px-8 py-3 rounded-2xl bg-gunmetal-950 text-white font-bold text-sm shadow-premium hover:bg-gunmetal-800 transition-all hover:-translate-y-0.5 active:scale-95"
           >
             Finalizar Revisión
           </button>
        </div>
      </div>
    </div>
  );
}
