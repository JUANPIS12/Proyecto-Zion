import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { Settings, Wrench, Save, CheckCircle, AlertTriangle, X, Play } from 'lucide-react';

export default function ActiveWorkPanel() {
  const { 
    activeOrderForTechnician, hasInterventionSaved, registrarIntervencion, 
    equipos, loadingData 
  } = useData();
  
  const [serial, setSerial] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [minified, setMinified] = useState(false);

  if (!activeOrderForTechnician) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    if (!serial.trim() || !descripcion.trim()) return;

    try {
      setSubmitting(true);
      // Buscar el equipo por serial o usar el ID si ya lo tenemos
      const equipoEncontrado = equipos.find(eq => eq.serial === serial || eq.id === Number(serial));
      
      const payload = {
        tipo: 'PREVENTIVO', // Por defecto
        descripcion: descripcion,
        fechaInicio: new Date().toISOString().slice(0, 19),
        fechaFin: new Date().toISOString().slice(0, 19),
        ordenServicioId: activeOrderForTechnician.id,
        equipoId: equipoEncontrado ? equipoEncontrado.id : null,
        novedades: 'Registro rápido desde panel activo',
        estadoFinal: 'OK'
      };

      if (!payload.equipoId) {
        alert("El serial ingresado no coincide con ningún equipo en el sistema. Por favor verifica.");
        setSubmitting(false);
        return;
      }

      await registrarIntervencion(payload);
      setSerial('');
      setDescripcion('');
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-full max-w-4xl px-4 transition-all duration-500 ${minified ? 'translate-y-[80%]' : 'translate-y-0'}`}>
      <div className="bg-gunmetal-950 border border-copper-500/30 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_30px_rgba(197,126,80,0.1)] overflow-hidden backdrop-blur-xl">
        
        {/* Header de la Pestaña */}
        <div className="flex items-center justify-between px-8 py-4 bg-gradient-to-r from-copper-600/20 to-transparent border-b border-white/5">
          <div className="flex items-center gap-3">
             <div className="h-8 w-8 rounded-full bg-copper-500 flex items-center justify-center animate-pulse">
                <Play className="w-4 h-4 text-white fill-current" />
             </div>
             <div className="text-left">
                <h4 className="text-xs font-black text-white uppercase tracking-widest">Servicio en Curso</h4>
                <p className="text-[10px] font-bold text-copper-400 uppercase">Orden #{activeOrderForTechnician.numeroOrden || activeOrderForTechnician.id}</p>
             </div>
          </div>
          
          <div className="flex items-center gap-4">
             {hasInterventionSaved ? (
               <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-[9px] font-black text-emerald-500 uppercase">Intervención Guardada</span>
               </div>
             ) : (
               <div className="flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                  <span className="text-[9px] font-black text-amber-500 uppercase">Registro Pendiente</span>
               </div>
             )}
             <button 
               onClick={() => setMinified(!minified)}
               className="p-2 hover:bg-white/10 rounded-xl transition-colors text-white/50 hover:text-white"
             >
                {minified ? <X className="w-5 h-5 rotate-45" /> : <X className="w-5 h-5" />}
             </button>
          </div>
        </div>

        {/* Cuerpo del Formulario */}
        <div className="p-6 md:p-8">
           <form onSubmit={handleSave} className="flex flex-col md:flex-row gap-6 items-end">
              <div className="flex-1 space-y-2 w-full text-left">
                 <label className="text-[10px] font-black text-copper-400 uppercase tracking-widest ml-1">Serial del Equipo</label>
                 <div className="relative">
                    <Settings className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input 
                      list="equipos-list"
                      value={serial}
                      onChange={(e) => setSerial(e.target.value)}
                      placeholder="Busca o escribe el serial..."
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm text-white placeholder:text-white/20 outline-none focus:border-copper-500 focus:ring-4 focus:ring-copper-500/10 transition-all font-medium"
                      required
                    />
                    <datalist id="equipos-list">
                       {equipos.map(eq => (
                         <option key={eq.id} value={eq.serial}>{eq.referencia}</option>
                       ))}
                    </datalist>
                 </div>
              </div>

              <div className="flex-[1.5] space-y-2 w-full text-left">
                 <label className="text-[10px] font-black text-copper-400 uppercase tracking-widest ml-1">Trabajo Realizado</label>
                 <div className="relative">
                    <Wrench className="absolute left-4 top-4 w-4 h-4 text-white/30" />
                    <textarea 
                      placeholder="Describe qué hiciste en este equipo..."
                      value={descripcion}
                      onChange={(e) => setDescripcion(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm text-white placeholder:text-white/20 outline-none focus:border-copper-500 focus:ring-4 focus:ring-copper-500/10 transition-all font-medium min-h-[46px] resize-none"
                      required
                    ></textarea>
                 </div>
              </div>

              <button 
                type="submit"
                disabled={submitting || !serial || !descripcion}
                className="w-full md:w-auto flex items-center justify-center gap-3 px-8 py-3.5 rounded-2xl bg-copper-500 text-white font-black text-xs uppercase tracking-widest shadow-glow hover:bg-copper-600 transition-all disabled:opacity-30 disabled:hover:translate-y-0 hover:-translate-y-1 active:scale-95"
              >
                 {submitting ? 'Guardando...' : (
                   <>
                     <Save className="w-4 h-4" />
                     Guardar Registro
                   </>
                 )}
              </button>
           </form>
        </div>

        {/* Indicador de Ayuda */}
        {!hasInterventionSaved && (
          <div className="bg-copper-500/10 px-8 py-2 text-[9px] font-bold text-copper-300 text-center uppercase tracking-[0.2em]">
             Debes guardar al menos un registro de equipo para poder finalizar este servicio
          </div>
        )}
      </div>
    </div>
  );
}
