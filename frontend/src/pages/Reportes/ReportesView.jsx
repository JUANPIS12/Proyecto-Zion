import React, { useState, useMemo } from 'react';
import { useData } from '../../contexts/DataContext';
import GenericTableView from '../../components/ui/GenericTableView';

export default function ReportesView() {
  const { ordenes, visitas, mantenimientos, tecnicos, empresas, equipos } = useData();
  const [searchValue, setSearchValue] = useState('');

  const reportesData = useMemo(() => [
    { modulo: 'Órdenes', cantidad: ordenes.length },
    { modulo: 'Visitas', cantidad: visitas.length },
    { modulo: 'Mantenimientos', cantidad: mantenimientos.length },
    { modulo: 'Técnicos', cantidad: tecnicos.length },
    { modulo: 'Empresas', cantidad: empresas.length },
    { modulo: 'Equipos', cantidad: equipos.length },
  ], [ordenes, visitas, mantenimientos, tecnicos, empresas, equipos]);

  const applySearch = (rows) => {
    const search = searchValue.toLowerCase().trim();
    if (!search) return rows;
    return rows.filter((row) => row.modulo.toLowerCase().includes(search));
  };

  const filtered = applySearch(reportesData);
  const rows = filtered.map((r) => [r.modulo, r.cantidad]);

  return (
    <GenericTableView
      title="Reportes"
      description="Indicadores operativos y reportes de servicio."
      searchPlaceholder="Buscar módulo..."
      columns={['Módulo', 'Cantidad']}
      rows={rows}
      onSearchChange={setSearchValue}
      searchValue={searchValue}
    />
  );
}
