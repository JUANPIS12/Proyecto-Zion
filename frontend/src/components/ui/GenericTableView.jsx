import React, { useState } from 'react';
import { Search, Filter, Plus } from 'lucide-react';

export default function GenericTableView({ 
  title, 
  description, 
  buttonText, 
  onAddClick, 
  searchPlaceholder, 
  filterOptions = [], 
  filterLabel = 'Filtro',
  columns, 
  rows,
  onFilterChange,
  onSearchChange,
  searchValue,
  filterValue,
  renderForm
}) {
  const primaryButtonClass = "rounded-2xl bg-blue-600 px-5 py-4 text-sm font-bold text-white shadow-premium transition-soft hover:bg-blue-500 hover:-translate-y-0.5 active:scale-95 flex items-center gap-2";

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 font-display tracking-tight">{title}</h2>
          {description && <p className="mt-1 text-slate-500 font-medium">{description}</p>}
        </div>

        {buttonText && onAddClick && (
          <button onClick={onAddClick} className={primaryButtonClass}>
            <Plus size={20} />
            {buttonText}
          </button>
        )}
      </header>

      {renderForm && (
         <div className="mb-8">
            {renderForm()}
         </div>
      )}

      <div className="mb-6 flex flex-col md:flex-row items-center gap-4">
        <div className="relative w-full flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder={searchPlaceholder || "Buscar..."}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-2xl border-2 border-slate-200 bg-white py-3.5 pl-12 pr-4 text-slate-900 outline-none transition-soft focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 placeholder:text-slate-400 font-medium"
          />
        </div>

        {filterOptions.length > 0 && (
          <div className="relative w-full md:w-auto min-w-[250px]">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
            <select
              value={filterValue}
              onChange={(e) => onFilterChange(e.target.value)}
              className="w-full appearance-none rounded-2xl border-2 border-slate-200 bg-white py-3.5 pl-12 pr-10 text-slate-900 font-bold outline-none transition-soft focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 cursor-pointer"
            >
              <option value="" disabled className="text-slate-400">{filterLabel}</option>
              {filterOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="rounded-[2rem] border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/50">
                {columns.map((col, idx) => (
                  <th key={idx} className="px-6 py-5 text-xs font-black uppercase tracking-widest text-slate-400 whitespace-nowrap">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-12 text-center text-slate-500 font-medium">
                    No hay registros en esta sección.
                  </td>
                </tr>
              ) : (
                rows.map((row, idx) => (
                  <tr key={idx} className="transition-soft hover:bg-slate-50/50 group">
                    {row.map((cell, cidx) => (
                      <td key={cidx} className="px-6 py-4 font-medium text-slate-700 whitespace-nowrap max-w-[300px] truncate">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
