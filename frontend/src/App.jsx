import { useEffect, useMemo, useState } from 'react';
import { 
  LayoutDashboard, 
  ClipboardList, 
  MapPin, 
  Wrench, 
  Settings, 
  Users, 
  Building2, 
  FileText, 
  LogOut, 
  Plus, 
  Search, 
  Filter,
  RefreshCw,
  Eye,
  CheckCircle2,
  Clock,
  AlertCircle,
  ChevronRight
} from 'lucide-react';


const API_URL = 'http://localhost:8080/api';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [rolUsuario, setRolUsuario] = useState(localStorage.getItem('rol') || '');
  const [puedeCrearAdmin, setPuedeCrearAdmin] = useState(localStorage.getItem('puedeCrearAdmin') === 'true');
  const [activeSection, setActiveSection] = useState('Dashboard');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [mostrarFormularioTecnico, setMostrarFormularioTecnico] = useState(false);
  const [mostrarFormularioCliente, setMostrarFormularioCliente] = useState(false);
  const [mostrarFormularioEquipo, setMostrarFormularioEquipo] = useState(false);
  const [mostrarFormularioOrden, setMostrarFormularioOrden] = useState(false);
  const [mostrarFormularioVisita, setMostrarFormularioVisita] = useState(false);
  const [mostrarFormularioMantenimiento, setMostrarFormularioMantenimiento] = useState(false);

  const [ordenes, setOrdenes] = useState([]);
  const [tecnicos, setTecnicos] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [equipos, setEquipos] = useState([]);
  const [sedes, setSedes] = useState([]);
  const [tecnologias, setTecnologias] = useState([]);
  const [visitas, setVisitas] = useState([]);
  const [mantenimientos, setMantenimientos] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [detalleOrden, setDetalleOrden] = useState(null);
  const [cargandoDetalleOrden, setCargandoDetalleOrden] = useState(false);
  const [mostrarModalDetalleOrden, setMostrarModalDetalleOrden] = useState(false);

  const [searchBySection, setSearchBySection] = useState({
    'Órdenes de servicio': '',
    'Visitas técnicas': '',
    Mantenimientos: '',
    Equipos: '',
    Clientes: '',
    Técnicos: '',
    Reportes: '',
  });

  const [filterBySection, setFilterBySection] = useState({
    'Órdenes de servicio': 'TODOS',
    'Visitas técnicas': 'TODOS',
    Mantenimientos: 'TODOS',
    Equipos: 'TODOS',
    Clientes: 'TODOS',
    Técnicos: 'TODOS',
    Reportes: 'TODOS',
  });

  const [nuevoTecnico, setNuevoTecnico] = useState({
    nombre: '',
    documento: '',
    telefono: '',
    email: '',
    sedeId: '',
    tecnologiaIds: [],
  });

  const [nuevoCliente, setNuevoCliente] = useState({
    nombre: '',
    ciudad: '',
    direccion: '',
    contacto: '',
    estado: 'ACTIVO',
    sedeId: '',
    tecnologiaIds: [],
  });

  const [nuevoEquipo, setNuevoEquipo] = useState({
    serial: '',
    referencia: '',
    ciudadActual: '',
    plantaActual: '',
    areaActual: '',
    lineaActual: '',
    estado: 'ACTIVO',
    empresaId: '',
    sedeId: '',
    tecnologiaId: '',
  });

  const [nuevaOrden, setNuevaOrden] = useState({
    numeroOrden: '',
    fechaProgramada: '',
    estado: 'PROGRAMADA',
    empresaId: '',
    tecnicoId: '',
    sedeId: '',
  });

  const [nuevaVisita, setNuevaVisita] = useState({
    fechaInicio: '',
    fechaFin: '',
    observaciones: '',
    ubicacionInicio: '',
    ubicacionFin: '',
    ordenServicioId: '',
    tecnicoId: '',
  });

  const [nuevoMantenimiento, setNuevoMantenimiento] = useState({
    tipo: 'PREVENTIVO',
    descripcion: '',
    fechaInicio: '',
    fechaFin: '',
    ordenServicioId: '',
    equipoId: '',
  });

  const menu = [
    'Dashboard',
    'Órdenes de servicio',
    'Visitas técnicas',
    'Mantenimientos',
    'Equipos',
    'Clientes',
    'Técnicos',
    'Reportes',
  ];

  useEffect(() => {
    if (!isLoggedIn) return;
    cargarDatos();
  }, [isLoggedIn]);

  function limpiarMensajes() {
    setError('');
    setSuccess('');
  }

  async function fetchJson(url) {
    const res = await fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.status === 401 || res.status === 403) {
      handleLogout();
      throw new Error("Sesión expirada o sin permisos");
    }
    if (!res.ok) throw new Error(`Error al consultar ${url}`);
    return res.json();
  }

  async function postJson(url, body) {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || `Error al guardar en ${url}`);
    }

    return res.json();
  }

  async function patchJson(url, body) {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(url, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || `Error al actualizar en ${url}`);
    }

    return res.json();
  }

  async function cargarDatos() {
    try {
      setLoading(true);
      limpiarMensajes();

      const [
        ordenesData,
        tecnicosData,
        empresasData,
        equiposData,
        sedesData,
        tecnologiasData,
        visitasData,
        mantenimientosData,
      ] = await Promise.all([
        fetchJson(`${API_URL}/ordenes`),
        fetchJson(`${API_URL}/tecnicos`),
        fetchJson(`${API_URL}/empresas`),
        fetchJson(`${API_URL}/equipos`),
        fetchJson(`${API_URL}/sedes`),
        fetchJson(`${API_URL}/tecnologias`),
        fetchJson(`${API_URL}/visitas`),
        fetchJson(`${API_URL}/mantenimientos`),
      ]);

      setOrdenes(ordenesData);
      setTecnicos(tecnicosData);
      setEmpresas(empresasData);
      setEquipos(equiposData);
      setSedes(sedesData);
      setTecnologias(tecnologiasData);
      setVisitas(visitasData);
      setMantenimientos(mantenimientosData);
    } catch (err) {
      setError(err.message || 'Error cargando datos');
    } finally {
      setLoading(false);
    }
  }

  async function verDetalleOrden(id) {
    try {
      limpiarMensajes();
      setCargandoDetalleOrden(true);
      setMostrarModalDetalleOrden(true);

      const data = await fetchJson(`${API_URL}/ordenes/${id}/detalle`);
      setDetalleOrden(data);
    } catch (err) {
      setError(err.message || 'No se pudo cargar el detalle de la orden');
      setDetalleOrden(null);
    } finally {
      setCargandoDetalleOrden(false);
    }
  }

  function cerrarDetalleOrden() {
    setMostrarModalDetalleOrden(false);
    setDetalleOrden(null);
  }

  async function cambiarEstadoOrden(ordenId, nuevoEstado) {
    try {
      limpiarMensajes();

      await patchJson(`${API_URL}/ordenes/${ordenId}`, {
        estado: nuevoEstado,
      });

      setSuccess(`Orden actualizada a estado ${nuevoEstado}.`);
      await cargarDatos();

      if (mostrarModalDetalleOrden && detalleOrden?.id === ordenId) {
        await verDetalleOrden(ordenId);
      }
    } catch (err) {
      setError(err.message || 'No se pudo actualizar el estado de la orden');
    }
  }

  function toggleTecnologia(id) {
    setNuevoTecnico((prev) => {
      const existe = prev.tecnologiaIds.includes(id);
      return {
        ...prev,
        tecnologiaIds: existe
          ? prev.tecnologiaIds.filter((item) => item !== id)
          : [...prev.tecnologiaIds, id],
      };
    });
  }

  function toggleTecnologiaCliente(id) {
    setNuevoCliente((prev) => {
      const existe = prev.tecnologiaIds.includes(id);
      return {
        ...prev,
        tecnologiaIds: existe
          ? prev.tecnologiaIds.filter((item) => item !== id)
          : [...prev.tecnologiaIds, id],
      };
    });
  }

  async function crearTecnico(e) {
    e.preventDefault();

    try {
      limpiarMensajes();

      const payload = {
        nombre: nuevoTecnico.nombre,
        documento: nuevoTecnico.documento || null,
        telefono: nuevoTecnico.telefono || null,
        email: nuevoTecnico.email || null,
        sedeId: Number(nuevoTecnico.sedeId),
        tecnologiaIds: nuevoTecnico.tecnologiaIds,
      };

      await postJson(`${API_URL}/tecnicos`, payload);

      setSuccess('Técnico creado correctamente.');
      setNuevoTecnico({
        nombre: '',
        documento: '',
        telefono: '',
        email: '',
        sedeId: '',
        tecnologiaIds: [],
      });
      setMostrarFormularioTecnico(false);
      await cargarDatos();
    } catch (err) {
      setError(err.message || 'No se pudo crear el técnico');
    }
  }

  async function crearCliente(e) {
    e.preventDefault();

    try {
      limpiarMensajes();

      const payload = {
        nombre: nuevoCliente.nombre,
        ciudad: nuevoCliente.ciudad || null,
        direccion: nuevoCliente.direccion || null,
        contacto: nuevoCliente.contacto || null,
        estado: nuevoCliente.estado || null,
        sedeId: Number(nuevoCliente.sedeId),
        tecnologiaIds: nuevoCliente.tecnologiaIds,
      };

      await postJson(`${API_URL}/empresas`, payload);

      setSuccess('Cliente creado correctamente.');
      setNuevoCliente({
        nombre: '',
        ciudad: '',
        direccion: '',
        contacto: '',
        estado: 'ACTIVO',
        sedeId: '',
        tecnologiaIds: [],
      });
      setMostrarFormularioCliente(false);
      await cargarDatos();
    } catch (err) {
      setError(err.message || 'No se pudo crear el cliente');
    }
  }

  async function crearEquipo(e) {
    e.preventDefault();

    try {
      limpiarMensajes();

      const payload = {
        serial: nuevoEquipo.serial,
        referencia: nuevoEquipo.referencia || null,
        ciudadActual: nuevoEquipo.ciudadActual || null,
        plantaActual: nuevoEquipo.plantaActual || null,
        areaActual: nuevoEquipo.areaActual || null,
        lineaActual: nuevoEquipo.lineaActual || null,
        estado: nuevoEquipo.estado || null,
        sedeId: Number(nuevoEquipo.sedeId),
        empresaId: Number(nuevoEquipo.empresaId),
        tecnologiaId: Number(nuevoEquipo.tecnologiaId),
      };

      await postJson(`${API_URL}/equipos`, payload);

      setSuccess('Equipo creado correctamente.');
      setNuevoEquipo({
        serial: '',
        referencia: '',
        ciudadActual: '',
        plantaActual: '',
        areaActual: '',
        lineaActual: '',
        estado: 'ACTIVO',
        empresaId: '',
        sedeId: '',
        tecnologiaId: '',
      });
      setMostrarFormularioEquipo(false);
      await cargarDatos();
    } catch (err) {
      setError(err.message || 'No se pudo crear el equipo');
    }
  }

  async function crearOrden(e) {
    e.preventDefault();

    try {
      limpiarMensajes();

      const payload = {
        numeroOrden: nuevaOrden.numeroOrden,
        fechaProgramada: `${nuevaOrden.fechaProgramada}:00`,
        estado: nuevaOrden.estado,
        sedeId: Number(nuevaOrden.sedeId),
        empresaId: Number(nuevaOrden.empresaId),
        tecnicoId: Number(nuevaOrden.tecnicoId),
      };

      await postJson(`${API_URL}/ordenes`, payload);

      setSuccess('Orden creada correctamente.');
      setNuevaOrden({
        numeroOrden: '',
        fechaProgramada: '',
        estado: 'PROGRAMADA',
        empresaId: '',
        tecnicoId: '',
        sedeId: '',
      });
      setMostrarFormularioOrden(false);
      await cargarDatos();
    } catch (err) {
      setError(err.message || 'No se pudo crear la orden');
    }
  }

  async function crearVisita(e) {
    e.preventDefault();

    try {
      limpiarMensajes();

      const payload = {
        fechaInicio: `${nuevaVisita.fechaInicio}:00`,
        fechaFin: `${nuevaVisita.fechaFin}:00`,
        observaciones: nuevaVisita.observaciones || null,
        ubicacionInicio: nuevaVisita.ubicacionInicio || null,
        ubicacionFin: nuevaVisita.ubicacionFin || null,
        ordenServicioId: Number(nuevaVisita.ordenServicioId),
        tecnicoId: Number(nuevaVisita.tecnicoId),
      };

      await postJson(`${API_URL}/visitas`, payload);

      setSuccess('Visita técnica creada correctamente.');
      setNuevaVisita({
        fechaInicio: '',
        fechaFin: '',
        observaciones: '',
        ubicacionInicio: '',
        ubicacionFin: '',
        ordenServicioId: '',
        tecnicoId: '',
      });
      setMostrarFormularioVisita(false);
      await cargarDatos();
    } catch (err) {
      setError(err.message || 'No se pudo crear la visita');
    }
  }

  async function crearMantenimiento(e) {
    e.preventDefault();

    try {
      limpiarMensajes();

      const payload = {
        tipo: nuevoMantenimiento.tipo,
        descripcion: nuevoMantenimiento.descripcion || null,
        fechaInicio: `${nuevoMantenimiento.fechaInicio}:00`,
        fechaFin: `${nuevoMantenimiento.fechaFin}:00`,
        ordenServicioId: Number(nuevoMantenimiento.ordenServicioId),
        equipoId: Number(nuevoMantenimiento.equipoId),
      };

      await postJson(`${API_URL}/mantenimientos`, payload);

      setSuccess('Mantenimiento creado correctamente.');
      setNuevoMantenimiento({
        tipo: 'PREVENTIVO',
        descripcion: '',
        fechaInicio: '',
        fechaFin: '',
        ordenServicioId: '',
        equipoId: '',
      });
      setMostrarFormularioMantenimiento(false);
      await cargarDatos();
    } catch (err) {
      setError(err.message || 'No se pudo crear el mantenimiento');
    }
  }

  function capturarUbicacionInicio() {
    limpiarMensajes();

    if (!navigator.geolocation) {
      setError('Tu navegador no soporta geolocalización.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = `${position.coords.latitude},${position.coords.longitude}`;
        setNuevaVisita((prev) => ({ ...prev, ubicacionInicio: coords }));
        setSuccess(`Ubicación de inicio capturada: ${coords}`);
      },
      (err) => {
        if (err.code === 1) {
          setError('Permiso de ubicación denegado. Debes permitir acceso en el navegador.');
        } else if (err.code === 2) {
          setError('No se pudo obtener la ubicación. Revisa que el equipo tenga ubicación activa.');
        } else if (err.code === 3) {
          setError('Se agotó el tiempo para obtener la ubicación.');
        } else {
          setError('Error desconocido al obtener la ubicación de inicio.');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }

  function capturarUbicacionFin() {
    limpiarMensajes();

    if (!navigator.geolocation) {
      setError('Tu navegador no soporta geolocalización.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = `${position.coords.latitude},${position.coords.longitude}`;
        setNuevaVisita((prev) => ({ ...prev, ubicacionFin: coords }));
        setSuccess(`Ubicación final capturada: ${coords}`);
      },
      (err) => {
        if (err.code === 1) {
          setError('Permiso de ubicación denegado. Debes permitir acceso en el navegador.');
        } else if (err.code === 2) {
          setError('No se pudo obtener la ubicación. Revisa que el equipo tenga ubicación activa.');
        } else if (err.code === 3) {
          setError('Se agotó el tiempo para obtener la ubicación.');
        } else {
          setError('Error desconocido al obtener la ubicación final.');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }

  const empresasMap = useMemo(() => {
    const map = {};
    empresas.forEach((empresa) => {
      map[empresa.id] = empresa.nombre;
    });
    return map;
  }, [empresas]);

  const tecnicosMap = useMemo(() => {
    const map = {};
    tecnicos.forEach((tecnico) => {
      map[tecnico.id] = tecnico.nombre;
    });
    return map;
  }, [tecnicos]);

  const sedesMap = useMemo(() => {
    const map = {};
    sedes.forEach((sede) => {
      map[sede.id] = sede.nombre;
    });
    return map;
  }, [sedes]);

  const tecnologiasMap = useMemo(() => {
    const map = {};
    tecnologias.forEach((tec) => {
      map[tec.id] = tec.nombre;
    });
    return map;
  }, [tecnologias]);

  const ordenesMap = useMemo(() => {
    const map = {};
    ordenes.forEach((orden) => {
      map[orden.id] = orden.numeroOrden || `Orden #${orden.id}`;
    });
    return map;
  }, [ordenes]);

  const equiposMap = useMemo(() => {
    const map = {};
    equipos.forEach((equipo) => {
      map[equipo.id] = equipo.serial || `Equipo #${equipo.id}`;
    });
    return map;
  }, [equipos]);

  const stats = useMemo(() => {
    const ordenesAbiertas = ordenes.filter(
      (o) => o.estado === 'PROGRAMADA' || o.estado === 'EN_PROCESO'
    ).length;

    const ordenesFinalizadas = ordenes.filter((o) => o.estado === 'FINALIZADA').length;

    return [
      { title: 'Órdenes abiertas', value: String(ordenesAbiertas) },
      { title: 'Órdenes finalizadas', value: String(ordenesFinalizadas) },
      { title: 'Técnicos activos', value: String(tecnicos.length) },
      { title: 'Visitas registradas', value: String(visitas.length) },
      { title: 'Mantenimientos', value: String(mantenimientos.length) },
      { title: 'Equipos registrados', value: String(equipos.length) },
    ];
  }, [ordenes, tecnicos, visitas, mantenimientos, equipos]);

  const recentOrders = useMemo(() => {
    return ordenes.slice(0, 5).map((orden) => ({
      id: orden.id,
      codigo: orden.numeroOrden || `Orden #${orden.id}`,
      cliente: empresasMap[orden.empresaId] || `Empresa #${orden.empresaId ?? ''}`,
      estado: orden.estado,
      tecnico: tecnicosMap[orden.tecnicoId] || `Técnico #${orden.tecnicoId ?? ''}`,
    }));
  }, [ordenes, empresasMap, tecnicosMap]);

  const ordenesView = useMemo(
    () =>
      ordenes.map((orden) => ({
        id: orden.id,
        numero: orden.numeroOrden,
        fecha: formatearFecha(orden.fechaProgramada),
        estado: orden.estado,
        empresa: empresasMap[orden.empresaId] || orden.empresaId || 'Sin empresa',
        tecnico: tecnicosMap[orden.tecnicoId] || orden.tecnicoId || 'Sin técnico',
      })),
    [ordenes, empresasMap, tecnicosMap]
  );

  const visitasView = useMemo(
    () =>
      visitas.map((visita) => ({
        id: visita.id,
        inicio: formatearFecha(visita.fechaInicio),
        fin: formatearFecha(visita.fechaFin),
        orden: ordenesMap[visita.ordenServicioId] || visita.ordenServicioId,
        tecnico: tecnicosMap[visita.tecnicoId] || visita.tecnicoId,
        ubicacionInicio: visita.ubicacionInicio || 'Sin dato',
        ubicacionFin: visita.ubicacionFin || 'Sin dato',
      })),
    [visitas, ordenesMap, tecnicosMap]
  );

  const mantenimientosView = useMemo(
    () =>
      mantenimientos.map((m) => ({
        id: m.id,
        tipo: m.tipo,
        descripcion: m.descripcion || 'Sin descripción',
        fechaInicio: formatearFecha(m.fechaInicio),
        fechaFin: formatearFecha(m.fechaFin),
        orden: ordenesMap[m.ordenServicioId] || m.ordenServicioId,
        equipo: equiposMap[m.equipoId] || m.equipoId,
      })),
    [mantenimientos, ordenesMap, equiposMap]
  );

  const equiposView = useMemo(
    () =>
      equipos.map((equipo) => ({
        id: equipo.id,
        serial: equipo.serial,
        referencia: equipo.referencia || 'Sin referencia',
        empresa: empresasMap[equipo.empresaId] || equipo.empresaId || 'Sin empresa',
        tecnologia: tecnologiasMap[equipo.tecnologiaId] || equipo.tecnologiaId || 'Sin tecnología',
        estado: equipo.estado || 'Sin estado',
      })),
    [equipos, empresasMap, tecnologiasMap]
  );

  const clientesView = useMemo(
    () =>
      empresas.map((empresa) => ({
        id: empresa.id,
        nombre: empresa.nombre,
        sede: sedesMap[empresa.sedeId] || empresa.sedeId || 'Sin sede',
        tecnologias: empresa.tecnologias?.join(', ') || 'Sin tecnologías',
      })),
    [empresas, sedesMap]
  );

  const tecnicosView = useMemo(
    () =>
      tecnicos.map((tecnico) => ({
        id: tecnico.id,
        nombre: tecnico.nombre,
        sede: sedesMap[tecnico.sedeId] || tecnico.sedeId || 'Sin sede',
        tecnologias: tecnico.tecnologias?.join(', ') || 'Sin tecnologías',
      })),
    [tecnicos, sedesMap]
  );

  const reportesView = useMemo(
    () => [
      { modulo: 'Órdenes', cantidad: ordenes.length },
      { modulo: 'Visitas', cantidad: visitas.length },
      { modulo: 'Mantenimientos', cantidad: mantenimientos.length },
      { modulo: 'Técnicos', cantidad: tecnicos.length },
      { modulo: 'Empresas', cantidad: empresas.length },
      { modulo: 'Equipos', cantidad: equipos.length },
    ],
    [ordenes, visitas, mantenimientos, tecnicos, empresas, equipos]
  );

  function applySearch(rows, section) {
    const search = (searchBySection[section] || '').toLowerCase().trim();
    if (!search) return rows;

    return rows.filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(search)
      )
    );
  }

  function applyFilter(rows, section) {
    const filter = filterBySection[section];
    if (!filter || filter === 'TODOS') return rows;

    if (section === 'Órdenes de servicio') {
      return rows.filter((row) => row.estado === filter);
    }

    if (section === 'Equipos') {
      return rows.filter((row) => row.estado === filter);
    }

    if (section === 'Mantenimientos') {
      return rows.filter((row) => row.tipo === filter);
    }

    return rows;
  }

  function getFilteredRows(section, rows) {
    return applyFilter(applySearch(rows, section), section);
  }

  const filteredOrdenes = getFilteredRows('Órdenes de servicio', ordenesView);
  const filteredVisitas = getFilteredRows('Visitas técnicas', visitasView);
  const filteredMantenimientos = getFilteredRows('Mantenimientos', mantenimientosView);
  const filteredEquipos = getFilteredRows('Equipos', equiposView);
  const filteredClientes = getFilteredRows('Clientes', clientesView);
  const filteredTecnicos = getFilteredRows('Técnicos', tecnicosView);
  const filteredReportes = getFilteredRows('Reportes', reportesView);

  const sectionData = {
    'Órdenes de servicio': {
      title: 'Órdenes de servicio',
      description: 'Gestión de órdenes creadas, en proceso y finalizadas.',
      buttonText: 'Nueva orden',
      searchPlaceholder: 'Buscar por número, empresa o técnico...',
      filterOptions: ['TODOS', 'PROGRAMADA', 'EN_PROCESO', 'FINALIZADA'],
      filterLabel: 'Estado',
      columns: ['ID', 'Número', 'Fecha programada', 'Estado', 'Empresa', 'Técnico', 'Acción'],
      rows: filteredOrdenes.map((orden) => [
        orden.id,
        orden.numero,
        orden.fecha,
        renderEstadoBadge(orden.estado),
        orden.empresa,
        orden.tecnico,
        renderAccionOrden(orden, cambiarEstadoOrden, verDetalleOrden),
      ]),
    },
    'Visitas técnicas': {
      title: 'Visitas técnicas',
      description: 'Planeación y seguimiento de visitas programadas a planta.',
      buttonText: 'Nueva visita',
      searchPlaceholder: 'Buscar por orden, técnico o ubicación...',
      filterOptions: ['TODOS'],
      filterLabel: '',
      columns: ['ID', 'Inicio', 'Fin', 'Orden', 'Técnico', 'Ubicación inicio', 'Ubicación fin'],
      rows: filteredVisitas.map((visita) => [
        visita.id,
        visita.inicio,
        visita.fin,
        visita.orden,
        visita.tecnico,
        visita.ubicacionInicio,
        visita.ubicacionFin,
      ]),
    },
    Mantenimientos: {
      title: 'Mantenimientos',
      description: 'Control de mantenimientos preventivos y correctivos.',
      buttonText: 'Nuevo mantenimiento',
      searchPlaceholder: 'Buscar por tipo, descripción, orden o equipo...',
      filterOptions: ['TODOS', 'PREVENTIVO', 'CORRECTIVO'],
      filterLabel: 'Tipo',
      columns: ['ID', 'Tipo', 'Descripción', 'Inicio', 'Fin', 'Orden', 'Equipo'],
      rows: filteredMantenimientos.map((m) => [
        m.id,
        renderTipoBadge(m.tipo),
        m.descripcion,
        m.fechaInicio,
        m.fechaFin,
        m.orden,
        m.equipo,
      ]),
    },
    Equipos: {
      title: 'Equipos',
      description: 'Inventario y estado operativo de los equipos registrados.',
      buttonText: 'Nuevo equipo',
      searchPlaceholder: 'Buscar por serial, referencia, empresa o tecnología...',
      filterOptions: ['TODOS', 'ACTIVO', 'INACTIVO', 'MANTENIMIENTO'],
      filterLabel: 'Estado',
      columns: ['ID', 'Serial', 'Referencia', 'Empresa', 'Tecnología', 'Estado'],
      rows: filteredEquipos.map((equipo) => [
        equipo.id,
        equipo.serial,
        equipo.referencia,
        equipo.empresa,
        equipo.tecnologia,
        renderEstadoBadge(equipo.estado),
      ]),
    },
    Clientes: {
      title: 'Clientes',
      description: 'Empresas registradas y sus datos disponibles desde el DTO actual.',
      buttonText: 'Nuevo cliente',
      searchPlaceholder: 'Buscar por nombre, sede o tecnología...',
      filterOptions: ['TODOS'],
      filterLabel: '',
      columns: ['ID', 'Nombre', 'Sede', 'Tecnologías'],
      rows: filteredClientes.map((empresa) => [
        empresa.id,
        empresa.nombre,
        empresa.sede,
        empresa.tecnologias,
      ]),
    },
    Técnicos: {
      title: 'Técnicos',
      description: 'Personal técnico disponible para atención y visitas.',
      buttonText: 'Nuevo técnico',
      searchPlaceholder: 'Buscar por nombre o tecnología...',
      filterOptions: ['TODOS'],
      filterLabel: '',
      columns: ['ID', 'Nombre', 'Sede', 'Tecnologías'],
      rows: filteredTecnicos.map((tecnico) => [
        tecnico.id,
        tecnico.nombre,
        tecnico.sede,
        tecnico.tecnologias,
      ]),
    },
    Reportes: {
      title: 'Reportes',
      description: 'Indicadores operativos y reportes de servicio.',
      buttonText: 'Generar reporte',
      searchPlaceholder: 'Buscar módulo...',
      filterOptions: ['TODOS'],
      filterLabel: '',
      columns: ['Módulo', 'Cantidad'],
      rows: filteredReportes.map((r) => [r.modulo, r.cantidad]),
    },
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;
    
    try {
      setLoading(true);
      setError('');
      
      console.log(">>> [FRONTEND] Iniciando petición de login a: http://localhost:8080/auth/login");
      const res = await fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      console.log(">>> [FRONTEND] Respuesta del servidor: ", res.status);
      
      if (!res.ok) {
         throw new Error('Usuario o contraseña incorrectos');
      }
      
      const data = await res.json();
      console.log(">>> [FRONTEND] Token y Rol recibidos: ", data.rol);
      setToken(data.token);
      setRolUsuario(data.rol);
      setPuedeCrearAdmin(data.puedeCrearAdmin);
      setIsLoggedIn(true);
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('rol', data.rol);
      localStorage.setItem('puedeCrearAdmin', data.puedeCrearAdmin);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setToken('');
    setRolUsuario('');
    setPuedeCrearAdmin(false);
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    localStorage.removeItem('puedeCrearAdmin');
    setUsername('');
    setPassword('');
    setActiveSection('Dashboard');
    limpiarMensajes();
  };

  function renderLogin() {
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
                <p className="mt-2 text-sm text-slate-400 font-medium mb-10">
                  Ingresa tus credenciales para acceder al panel administrativo.
                </p>

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

  function renderDashboard() {
    return (
      <>
        <header className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-4xl font-extrabold text-slate-900 font-display tracking-tighter">Dashboard</h2>
            <p className="mt-1 text-slate-500 font-medium text-lg">
              Control general del estado operativo de ZION
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={cargarDatos}
              className={`${primaryButtonClass} flex items-center gap-2`}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Actualizar
            </button>
          </div>
        </header>

        {renderMensajes()}

        <section className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat, idx) => {
            const icons = [
              <ClipboardList className="w-6 h-6 text-blue-500" />,
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />,
              <Users className="w-6 h-6 text-indigo-500" />,
              <MapPin className="w-6 h-6 text-rose-500" />,
              <Wrench className="w-6 h-6 text-amber-500" />,
              <Settings className="w-6 h-6 text-slate-500" />
            ];
            return (
              <div
                key={stat.title}
                className="group relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-7 shadow-premium transition-soft hover:-translate-y-1 hover:shadow-premium-xl active:scale-95"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-100 group-hover:bg-blue-50 group-hover:ring-blue-100 transition-soft">
                    {icons[idx] || <LayoutDashboard className="w-6 h-6" />}
                  </div>
                  <div className="h-1.5 w-1.5 rounded-full bg-slate-300 group-hover:bg-blue-400 group-hover:animate-pulse transition-soft"></div>
                </div>
                <p className="text-xs font-black text-slate-500 uppercase tracking-[0.1em] font-display">{stat.title}</p>
                <p className="mt-1 text-5xl font-black text-slate-900 font-display tabular-nums tracking-tighter">
                  {stat.value}
                </p>
              </div>
            );
          })}
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-slate-900">Órdenes recientes</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-xs font-black uppercase tracking-widest text-slate-400">
                    <th className="pb-3">Código</th>
                    <th className="pb-3">Cliente</th>
                    <th className="pb-3">Estado</th>
                    <th className="pb-3">Técnico</th>
                    <th className="pb-3">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="border-b border-slate-100 last:border-0">
                      <td className="py-4 font-semibold text-slate-900">{order.codigo}</td>
                      <td className="py-4">{order.cliente}</td>
                      <td className="py-4">{renderEstadoBadge(order.estado)}</td>
                      <td className="py-4">{order.tecnico}</td>
                      <td className="py-4">
                        <button
                          onClick={() => verDetalleOrden(order.id)}
                          className={smallDarkButtonClass}
                        >
                          Ver detalle
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-6 text-2xl font-bold text-slate-950 font-display tracking-tight">Resumen rápido</h3>

            <div className="space-y-4">
              <ResumenItem titulo="Órdenes registradas" valor={ordenes.length} />
              <ResumenItem titulo="Técnicos registrados" valor={tecnicos.length} />
              <ResumenItem titulo="Equipos registrados" valor={equipos.length} />
              <ResumenItem titulo="Visitas registradas" valor={visitas.length} />
              <ResumenItem titulo="Mantenimientos" valor={mantenimientos.length} />
            </div>
          </div>
        </section>
      </>
    );
  }

  function renderMensajes() {
    return (
      <>
        {loading && (
          <div className="mb-4 rounded-2xl bg-blue-50 px-4 py-3 text-blue-700">
            Cargando datos...
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-2xl bg-red-50 px-4 py-3 text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 rounded-2xl bg-emerald-50 px-4 py-3 text-emerald-700">
            {success}
          </div>
        )}
      </>
    );
  }

  function renderFormularios(sectionName) {
    if (sectionName === 'Técnicos' && mostrarFormularioTecnico) {
      return (
        <form
          onSubmit={crearTecnico}
          className="mb-6 grid grid-cols-1 gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-2"
        >
          <input
            type="text"
            placeholder="Nombre completo"
            value={nuevoTecnico.nombre}
            onChange={(e) => setNuevoTecnico({ ...nuevoTecnico, nombre: e.target.value })}
            className={inputClass}
            required
          />

          <input
            type="text"
            placeholder="Documento"
            value={nuevoTecnico.documento}
            onChange={(e) => setNuevoTecnico({ ...nuevoTecnico, documento: e.target.value })}
            className={inputClass}
          />

          <input
            type="text"
            placeholder="Teléfono"
            value={nuevoTecnico.telefono}
            onChange={(e) => setNuevoTecnico({ ...nuevoTecnico, telefono: e.target.value })}
            className={inputClass}
          />

          <input
            type="email"
            placeholder="Email"
            value={nuevoTecnico.email}
            onChange={(e) => setNuevoTecnico({ ...nuevoTecnico, email: e.target.value })}
            className={inputClass}
          />

          <select
            value={nuevoTecnico.sedeId}
            onChange={(e) => setNuevoTecnico({ ...nuevoTecnico, sedeId: e.target.value })}
            className={inputClass}
            required
          >
            <option value="">Seleccione sede</option>
            {sedes.map((sede) => (
              <option key={sede.id} value={sede.id}>
                {sede.nombre}
              </option>
            ))}
          </select>

          <div className="md:col-span-2">
            <p className="mb-3 font-semibold text-slate-800">Tecnologías</p>
            <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
              {tecnologias.map((tec) => (
                <label
                  key={tec.id}
                  className="flex items-center gap-2 rounded-2xl border border-slate-200 p-3"
                >
                  <input
                    type="checkbox"
                    checked={nuevoTecnico.tecnologiaIds.includes(tec.id)}
                    onChange={() => toggleTecnologia(tec.id)}
                  />
                  <span>{tec.nombre}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="md:col-span-2 flex gap-3">
            <button type="submit" className={primaryButtonClass}>
              Guardar técnico
            </button>
            <button
              type="button"
              onClick={() => setMostrarFormularioTecnico(false)}
              className={secondaryButtonClass}
            >
              Cancelar
            </button>
          </div>
        </form>
      );
    }

    if (sectionName === 'Clientes' && mostrarFormularioCliente) {
      return (
        <form
          onSubmit={crearCliente}
          className="mb-6 grid grid-cols-1 gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-2"
        >
          <input
            type="text"
            placeholder="Nombre de la empresa"
            value={nuevoCliente.nombre}
            onChange={(e) => setNuevoCliente({ ...nuevoCliente, nombre: e.target.value })}
            className={inputClass}
            required
          />

          <input
            type="text"
            placeholder="Ciudad"
            value={nuevoCliente.ciudad}
            onChange={(e) => setNuevoCliente({ ...nuevoCliente, ciudad: e.target.value })}
            className={inputClass}
          />

          <input
            type="text"
            placeholder="Dirección"
            value={nuevoCliente.direccion}
            onChange={(e) => setNuevoCliente({ ...nuevoCliente, direccion: e.target.value })}
            className={inputClass}
          />

          <input
            type="text"
            placeholder="Contacto"
            value={nuevoCliente.contacto}
            onChange={(e) => setNuevoCliente({ ...nuevoCliente, contacto: e.target.value })}
            className={inputClass}
          />

          <select
            value={nuevoCliente.estado}
            onChange={(e) => setNuevoCliente({ ...nuevoCliente, estado: e.target.value })}
            className={inputClass}
          >
            <option value="ACTIVO">ACTIVO</option>
            <option value="INACTIVO">INACTIVO</option>
          </select>

          <select
            value={nuevoCliente.sedeId}
            onChange={(e) => setNuevoCliente({ ...nuevoCliente, sedeId: e.target.value })}
            className={inputClass}
            required
          >
            <option value="">Seleccione sede</option>
            {sedes.map((sede) => (
              <option key={sede.id} value={sede.id}>
                {sede.nombre}
              </option>
            ))}
          </select>

          <div className="md:col-span-2">
            <p className="mb-3 font-semibold text-slate-800">Tecnologías</p>
            <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
              {tecnologias.map((tec) => (
                <label
                  key={tec.id}
                  className="flex items-center gap-2 rounded-2xl border border-slate-200 p-3"
                >
                  <input
                    type="checkbox"
                    checked={nuevoCliente.tecnologiaIds.includes(tec.id)}
                    onChange={() => toggleTecnologiaCliente(tec.id)}
                  />
                  <span>{tec.nombre}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="md:col-span-2 flex gap-3">
            <button type="submit" className={primaryButtonClass}>
              Guardar cliente
            </button>
            <button
              type="button"
              onClick={() => setMostrarFormularioCliente(false)}
              className={secondaryButtonClass}
            >
              Cancelar
            </button>
          </div>
        </form>
      );
    }

    if (sectionName === 'Equipos' && mostrarFormularioEquipo) {
      return (
        <form
          onSubmit={crearEquipo}
          className="mb-6 grid grid-cols-1 gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-2"
        >
          <input
            type="text"
            placeholder="Serial"
            value={nuevoEquipo.serial}
            onChange={(e) => setNuevoEquipo({ ...nuevoEquipo, serial: e.target.value })}
            className={inputClass}
            required
          />

          <input
            type="text"
            placeholder="Referencia"
            value={nuevoEquipo.referencia}
            onChange={(e) => setNuevoEquipo({ ...nuevoEquipo, referencia: e.target.value })}
            className={inputClass}
          />

          <input
            type="text"
            placeholder="Ciudad actual"
            value={nuevoEquipo.ciudadActual}
            onChange={(e) => setNuevoEquipo({ ...nuevoEquipo, ciudadActual: e.target.value })}
            className={inputClass}
          />

          <input
            type="text"
            placeholder="Planta actual"
            value={nuevoEquipo.plantaActual}
            onChange={(e) => setNuevoEquipo({ ...nuevoEquipo, plantaActual: e.target.value })}
            className={inputClass}
          />

          <input
            type="text"
            placeholder="├ürea actual"
            value={nuevoEquipo.areaActual}
            onChange={(e) => setNuevoEquipo({ ...nuevoEquipo, areaActual: e.target.value })}
            className={inputClass}
          />

          <input
            type="text"
            placeholder="Línea actual"
            value={nuevoEquipo.lineaActual}
            onChange={(e) => setNuevoEquipo({ ...nuevoEquipo, lineaActual: e.target.value })}
            className={inputClass}
          />

          <select
            value={nuevoEquipo.estado}
            onChange={(e) => setNuevoEquipo({ ...nuevoEquipo, estado: e.target.value })}
            className={inputClass}
          >
            <option value="ACTIVO">ACTIVO</option>
            <option value="INACTIVO">INACTIVO</option>
            <option value="MANTENIMIENTO">MANTENIMIENTO</option>
          </select>

          <select
            value={nuevoEquipo.empresaId}
            onChange={(e) => setNuevoEquipo({ ...nuevoEquipo, empresaId: e.target.value })}
            className={inputClass}
            required
          >
            <option value="">Seleccione empresa</option>
            {empresas.map((empresa) => (
              <option key={empresa.id} value={empresa.id}>
                {empresa.nombre}
              </option>
            ))}
          </select>

          <select
            value={nuevoEquipo.sedeId}
            onChange={(e) => setNuevoEquipo({ ...nuevoEquipo, sedeId: e.target.value })}
            className={inputClass}
            required
          >
            <option value="">Seleccione sede</option>
            {sedes.map((sede) => (
              <option key={sede.id} value={sede.id}>
                {sede.nombre}
              </option>
            ))}
          </select>

          <select
            value={nuevoEquipo.tecnologiaId}
            onChange={(e) => setNuevoEquipo({ ...nuevoEquipo, tecnologiaId: e.target.value })}
            className={inputClass}
            required
          >
            <option value="">Seleccione tecnología</option>
            {tecnologias.map((tec) => (
              <option key={tec.id} value={tec.id}>
                {tec.nombre}
              </option>
            ))}
          </select>

          <div className="md:col-span-2 flex gap-3">
            <button type="submit" className={primaryButtonClass}>
              Guardar equipo
            </button>
            <button
              type="button"
              onClick={() => setMostrarFormularioEquipo(false)}
              className={secondaryButtonClass}
            >
              Cancelar
            </button>
          </div>
        </form>
      );
    }

    if (sectionName === 'Órdenes de servicio' && mostrarFormularioOrden) {
      return (
        <form
          onSubmit={crearOrden}
          className="mb-6 grid grid-cols-1 gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-2"
        >
          <input
            type="text"
            placeholder="Número de orden"
            value={nuevaOrden.numeroOrden}
            onChange={(e) => setNuevaOrden({ ...nuevaOrden, numeroOrden: e.target.value })}
            className={inputClass}
            required
          />

          <input
            type="datetime-local"
            value={nuevaOrden.fechaProgramada}
            onChange={(e) => setNuevaOrden({ ...nuevaOrden, fechaProgramada: e.target.value })}
            className={inputClass}
            required
          />

          <select
            value={nuevaOrden.estado}
            onChange={(e) => setNuevaOrden({ ...nuevaOrden, estado: e.target.value })}
            className={inputClass}
          >
            <option value="PROGRAMADA">PROGRAMADA</option>
            <option value="EN_PROCESO">EN_PROCESO</option>
            <option value="FINALIZADA">FINALIZADA</option>
          </select>

          <select
            value={nuevaOrden.empresaId}
            onChange={(e) => setNuevaOrden({ ...nuevaOrden, empresaId: e.target.value })}
            className={inputClass}
            required
          >
            <option value="">Seleccione empresa</option>
            {empresas.map((empresa) => (
              <option key={empresa.id} value={empresa.id}>
                {empresa.nombre}
              </option>
            ))}
          </select>

          <select
            value={nuevaOrden.tecnicoId}
            onChange={(e) => setNuevaOrden({ ...nuevaOrden, tecnicoId: e.target.value })}
            className={inputClass}
            required
          >
            <option value="">Seleccione técnico</option>
            {tecnicos.map((tecnico) => (
              <option key={tecnico.id} value={tecnico.id}>
                {tecnico.nombre}
              </option>
            ))}
          </select>

          <select
            value={nuevaOrden.sedeId}
            onChange={(e) => setNuevaOrden({ ...nuevaOrden, sedeId: e.target.value })}
            className={inputClass}
            required
          >
            <option value="">Seleccione sede</option>
            {sedes.map((sede) => (
              <option key={sede.id} value={sede.id}>
                {sede.nombre}
              </option>
            ))}
          </select>

          <div className="md:col-span-2 flex gap-3">
            <button type="submit" className={primaryButtonClass}>
              Guardar orden
            </button>
            <button
              type="button"
              onClick={() => setMostrarFormularioOrden(false)}
              className={secondaryButtonClass}
            >
              Cancelar
            </button>
          </div>
        </form>
      );
    }

    if (sectionName === 'Visitas técnicas' && mostrarFormularioVisita) {
      return (
        <form
          onSubmit={crearVisita}
          className="mb-6 grid grid-cols-1 gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-2"
        >
          <input
            type="datetime-local"
            value={nuevaVisita.fechaInicio}
            onChange={(e) => setNuevaVisita({ ...nuevaVisita, fechaInicio: e.target.value })}
            className={inputClass}
            required
          />

          <input
            type="datetime-local"
            value={nuevaVisita.fechaFin}
            onChange={(e) => setNuevaVisita({ ...nuevaVisita, fechaFin: e.target.value })}
            className={inputClass}
            required
          />

          <select
            value={nuevaVisita.ordenServicioId}
            onChange={(e) => setNuevaVisita({ ...nuevaVisita, ordenServicioId: e.target.value })}
            className={inputClass}
            required
          >
            <option value="">Seleccione orden</option>
            {ordenes.map((orden) => (
              <option key={orden.id} value={orden.id}>
                {orden.numeroOrden || `Orden #${orden.id}`}
              </option>
            ))}
          </select>

          <select
            value={nuevaVisita.tecnicoId}
            onChange={(e) => setNuevaVisita({ ...nuevaVisita, tecnicoId: e.target.value })}
            className={inputClass}
            required
          >
            <option value="">Seleccione técnico</option>
            {tecnicos.map((tecnico) => (
              <option key={tecnico.id} value={tecnico.id}>
                {tecnico.nombre}
              </option>
            ))}
          </select>

          <textarea
            placeholder="Observaciones"
            value={nuevaVisita.observaciones}
            onChange={(e) => setNuevaVisita({ ...nuevaVisita, observaciones: e.target.value })}
            className={`${inputClass} md:col-span-2`}
            rows={3}
          />

          <input
            type="text"
            placeholder="Ubicación inicio"
            value={nuevaVisita.ubicacionInicio}
            onChange={(e) => setNuevaVisita({ ...nuevaVisita, ubicacionInicio: e.target.value })}
            className={inputClass}
          />

          <input
            type="text"
            placeholder="Ubicación fin"
            value={nuevaVisita.ubicacionFin}
            onChange={(e) => setNuevaVisita({ ...nuevaVisita, ubicacionFin: e.target.value })}
            className={inputClass}
          />

          <div className="flex gap-3 md:col-span-2">
            <button
              type="button"
              onClick={capturarUbicacionInicio}
              className={secondaryButtonClass}
            >
              Capturar ubicación inicio
            </button>

            <button
              type="button"
              onClick={capturarUbicacionFin}
              className={secondaryButtonClass}
            >
              Capturar ubicación fin
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 md:col-span-2 md:grid-cols-2">
            <MiniMapa coordenadas={nuevaVisita.ubicacionInicio} titulo="Mapa ubicación inicio" />
            <MiniMapa coordenadas={nuevaVisita.ubicacionFin} titulo="Mapa ubicación fin" />
          </div>

          <div className="md:col-span-2 flex gap-3">
            <button type="submit" className={primaryButtonClass}>
              Guardar visita
            </button>
            <button
              type="button"
              onClick={() => setMostrarFormularioVisita(false)}
              className={secondaryButtonClass}
            >
              Cancelar
            </button>
          </div>
        </form>
      );
    }

    if (sectionName === 'Mantenimientos' && mostrarFormularioMantenimiento) {
      return (
        <form
          onSubmit={crearMantenimiento}
          className="mb-6 grid grid-cols-1 gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-2"
        >
          <select
            value={nuevoMantenimiento.tipo}
            onChange={(e) => setNuevoMantenimiento({ ...nuevoMantenimiento, tipo: e.target.value })}
            className={inputClass}
          >
            <option value="PREVENTIVO">PREVENTIVO</option>
            <option value="CORRECTIVO">CORRECTIVO</option>
          </select>

          <select
            value={nuevoMantenimiento.ordenServicioId}
            onChange={(e) =>
              setNuevoMantenimiento({ ...nuevoMantenimiento, ordenServicioId: e.target.value })
            }
            className={inputClass}
            required
          >
            <option value="">Seleccione orden</option>
            {ordenes.map((orden) => (
              <option key={orden.id} value={orden.id}>
                {orden.numeroOrden || `Orden #${orden.id}`}
              </option>
            ))}
          </select>

          <select
            value={nuevoMantenimiento.equipoId}
            onChange={(e) =>
              setNuevoMantenimiento({ ...nuevoMantenimiento, equipoId: e.target.value })
            }
            className={inputClass}
            required
          >
            <option value="">Seleccione equipo</option>
            {equipos.map((equipo) => (
              <option key={equipo.id} value={equipo.id}>
                {equipo.serial || `Equipo #${equipo.id}`}
              </option>
            ))}
          </select>

          <input
            type="datetime-local"
            value={nuevoMantenimiento.fechaInicio}
            onChange={(e) =>
              setNuevoMantenimiento({ ...nuevoMantenimiento, fechaInicio: e.target.value })
            }
            className={inputClass}
            required
          />

          <input
            type="datetime-local"
            value={nuevoMantenimiento.fechaFin}
            onChange={(e) =>
              setNuevoMantenimiento({ ...nuevoMantenimiento, fechaFin: e.target.value })
            }
            className={inputClass}
            required
          />

          <textarea
            placeholder="Descripción"
            value={nuevoMantenimiento.descripcion}
            onChange={(e) =>
              setNuevoMantenimiento({ ...nuevoMantenimiento, descripcion: e.target.value })
            }
            className={`${inputClass} md:col-span-2`}
            rows={3}
          />

          <div className="md:col-span-2 flex gap-3">
            <button type="submit" className={primaryButtonClass}>
              Guardar mantenimiento
            </button>
            <button
              type="button"
              onClick={() => setMostrarFormularioMantenimiento(false)}
              className={secondaryButtonClass}
            >
              Cancelar
            </button>
          </div>
        </form>
      );
    }

    return null;
  }

  function toggleFormulario(sectionName) {
    limpiarMensajes();

    if (sectionName === 'Técnicos') {
      setMostrarFormularioTecnico(!mostrarFormularioTecnico);
      return;
    }

    if (sectionName === 'Clientes') {
      setMostrarFormularioCliente(!mostrarFormularioCliente);
      return;
    }

    if (sectionName === 'Equipos') {
      setMostrarFormularioEquipo(!mostrarFormularioEquipo);
      return;
    }

    if (sectionName === 'Órdenes de servicio') {
      setMostrarFormularioOrden(!mostrarFormularioOrden);
      return;
    }

    if (sectionName === 'Visitas técnicas') {
      setMostrarFormularioVisita(!mostrarFormularioVisita);
      return;
    }

    if (sectionName === 'Mantenimientos') {
      setMostrarFormularioMantenimiento(!mostrarFormularioMantenimiento);
    }
  }

  function renderSection(sectionName) {
    const section = sectionData[sectionName];

    return (
      <>
        <header className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-4xl font-bold text-slate-900 font-display">{section.title}</h2>
            <p className="mt-1 text-slate-500 font-medium">{section.description}</p>
          </div>

          <button
            onClick={() => toggleFormulario(sectionName)}
            className={`${primaryButtonClass} flex items-center gap-2`}
          >
            <Plus className="w-5 h-5" />
            {section.buttonText}
          </button>
        </header>

        {renderMensajes()}

        <div className="mb-8 grid grid-cols-1 gap-6 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-premium md:grid-cols-3">
          <div className="md:col-span-2">
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">
              Búsqueda rápida
            </label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchBySection[sectionName] || ''}
                onChange={(e) =>
                  setSearchBySection((prev) => ({
                    ...prev,
                    [sectionName]: e.target.value,
                  }))
                }
                placeholder={section.searchPlaceholder}
                className={`${inputClass} pl-11`}
              />
            </div>
          </div>

          {section.filterOptions.length > 1 ? (
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">
                {section.filterLabel}
              </label>
              <div className="relative">
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <select
                  value={filterBySection[sectionName] || 'TODOS'}
                  onChange={(e) =>
                    setFilterBySection((prev) => ({
                      ...prev,
                      [sectionName]: e.target.value,
                    }))
                  }
                  className={`${inputClass} pl-11`}
                >
                  {section.filterOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ) : (
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchBySection((prev) => ({ ...prev, [sectionName]: '' }));
                  setFilterBySection((prev) => ({ ...prev, [sectionName]: 'TODOS' }));
                }}
                className={`${secondaryButtonClass} w-full flex items-center justify-center gap-2`}
              >
                <RefreshCw className="w-4 h-4" />
                Limpiar filtros
              </button>
            </div>
          )}
        </div>

        {renderFormularios(sectionName)}

        <section className="rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-premium overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 text-xs font-bold uppercase tracking-widest text-slate-400">
                  {section.columns.map((column) => (
                    <th key={column} className="pb-5 px-4">
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {section.rows.length > 0 ? (
                  section.rows.map((row, index) => (
                    <tr key={index} className="group transition-soft hover:bg-slate-50/50">
                      {row.map((cell, cellIndex) => (
                        <td key={cellIndex} className="py-5 px-4 text-sm font-medium text-slate-700">
                          {cell ?? ''}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={section.columns.length} className="py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-slate-400">
                        <Search className="w-12 h-12 mb-4 opacity-20" />
                        <p className="font-medium">No se encontraron resultados.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </>
    );
  }

  function renderApp() {
    const iconMap = {
      'Dashboard': <LayoutDashboard className="w-5 h-5" />,
      'Órdenes de servicio': <ClipboardList className="w-5 h-5" />,
      'Visitas técnicas': <MapPin className="w-5 h-5" />,
      'Mantenimientos': <Wrench className="w-5 h-5" />,
      'Equipos': <Settings className="w-5 h-5" />,
      'Clientes': <Building2 className="w-5 h-5" />,
      'Técnicos': <Users className="w-5 h-5" />,
      'Reportes': <FileText className="w-5 h-5" />,
    };

    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
        <div className="flex min-h-screen">
          <aside className="fixed inset-y-0 flex w-72 flex-col justify-between bg-slate-900 p-6 text-white shadow-premium-xl z-30">
            <div>
              <div className="mb-10 flex items-center gap-3 px-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500 shadow-premium">
                  <span className="text-xl font-bold italic text-white">Z</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-white font-display">ZION</h1>
                  <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">
                    Industrial Management
                  </p>
                </div>
              </div>

              <nav className="space-y-1">
                {menu.map((item) => (
                  <button
                    key={item}
                    onClick={() => {
                      setActiveSection(item);
                      limpiarMensajes();
                    }}
                    className={`group flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition-soft ${
                      item === activeSection
                        ? 'bg-blue-500 text-white shadow-premium'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <span className={`transition-soft ${item === activeSection ? 'text-white' : 'group-hover:text-blue-400'}`}>
                      {iconMap[item] || <ChevronRight className="w-5 h-5" />}
                    </span>
                    <span className="font-semibold text-sm">{item}</span>
                  </button>
                ))}
              </nav>
            </div>

            <div className="rounded-3xl bg-slate-800/50 p-5 ring-1 ring-white/10 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-slate-700 border-2 border-slate-600 flex items-center justify-center">
                  <Users className="w-5 h-5 text-slate-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white font-display">Admin Zion</p>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">ACTIVO</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-700/50 py-2.5 text-sm font-bold text-slate-300 transition-soft hover:bg-rose-500/10 hover:text-rose-400 border border-slate-600/50"
              >
                <LogOut className="w-4 h-4" />
                Cerrar sesión
              </button>
            </div>
          </aside>

          <main className="flex-1 ml-72 p-10 bg-slate-50">
            <div className="max-w-7xl mx-auto">
              {activeSection === 'Dashboard'
                ? renderDashboard()
                : renderSection(activeSection)}
            </div>
          </main>
        </div>

        {mostrarModalDetalleOrden && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
            <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">Detalle de orden</h3>
                  <p className="text-slate-500">Vista consolidada de la orden de servicio</p>
                </div>

                <button
                  onClick={cerrarDetalleOrden}
                  className={secondaryButtonClass}
                >
                  Cerrar
                </button>
              </div>

              {cargandoDetalleOrden && (
                <div className="rounded-2xl bg-blue-50 px-4 py-3 text-blue-700">
                  Cargando detalle de orden...
                </div>
              )}

              {!cargandoDetalleOrden && detalleOrden && (
                <div className="space-y-6">
                  <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <TarjetaDato titulo="Número" valor={detalleOrden?.numeroOrden || 'Sin dato'} />
                    <TarjetaDato titulo="Estado" valor={detalleOrden?.estado || 'Sin dato'} />
                    <TarjetaDato titulo="Empresa" valor={detalleOrden?.empresaNombre || 'Sin dato'} />
                    <TarjetaDato titulo="Técnico" valor={detalleOrden?.tecnicoNombre || 'Sin dato'} />
                  </section>

                  <section className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                    <h4 className="mb-4 text-lg font-semibold text-slate-900">
                      Tecnologías del técnico
                    </h4>

                    <div className="flex flex-wrap gap-2">
                      {(detalleOrden?.tecnicoTecnologias || []).map((tec, index) => (
                        <span
                          key={index}
                          className="rounded-full bg-slate-900 px-3 py-1 text-sm text-white"
                        >
                          {tec}
                        </span>
                      ))}

                      {(detalleOrden?.tecnicoTecnologias || []).length === 0 && (
                        <span className="text-slate-500">No hay tecnologías asociadas.</span>
                      )}
                    </div>
                  </section>

                  <section className="rounded-3xl border border-slate-200 bg-white p-5">
                    <h4 className="mb-4 text-lg font-semibold text-slate-900">
                      Mantenimientos asociados
                    </h4>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="border-b border-slate-200 text-sm text-slate-500">
                            <th className="pb-3">ID</th>
                            <th className="pb-3">Tipo</th>
                            <th className="pb-3">Descripción</th>
                            <th className="pb-3">Inicio</th>
                            <th className="pb-3">Fin</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(detalleOrden?.mantenimientos || []).map((mantenimiento, index) => (
                            <tr
                              key={mantenimiento?.id || index}
                              className="border-b border-slate-100 last:border-0"
                            >
                              <td className="py-4">{mantenimiento?.id || '-'}</td>
                              <td className="py-4">{renderTipoBadge(mantenimiento?.tipo)}</td>
                              <td className="py-4">{mantenimiento?.descripcion || '-'}</td>
                              <td className="py-4">{formatearFecha(mantenimiento?.fechaInicio)}</td>
                              <td className="py-4">{formatearFecha(mantenimiento?.fechaFin)}</td>
                            </tr>
                          ))}

                          {(detalleOrden?.mantenimientos || []).length === 0 && (
                            <tr>
                              <td colSpan="5" className="py-4 text-slate-500">
                                No hay mantenimientos asociados.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </section>

                  <section className="rounded-3xl border border-slate-200 bg-white p-5">
                    <h4 className="mb-4 text-lg font-semibold text-slate-900">
                      Visitas asociadas
                    </h4>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="border-b border-slate-200 text-sm text-slate-500">
                            <th className="pb-3">ID</th>
                            <th className="pb-3">Inicio</th>
                            <th className="pb-3">Fin</th>
                            <th className="pb-3">Ubicación inicio</th>
                            <th className="pb-3">Ubicación fin</th>
                            <th className="pb-3">Observaciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(detalleOrden?.visitas || []).map((visita, index) => (
                            <tr
                              key={visita?.id || index}
                              className="border-b border-slate-100 last:border-0"
                            >
                              <td className="py-4">{visita?.id || '-'}</td>
                              <td className="py-4">{formatearFecha(visita?.fechaInicio)}</td>
                              <td className="py-4">{formatearFecha(visita?.fechaFin)}</td>
                              <td className="py-4">{visita?.ubicacionInicio || '-'}</td>
                              <td className="py-4">{visita?.ubicacionFin || '-'}</td>
                              <td className="py-4">{visita?.observaciones || '-'}</td>
                            </tr>
                          ))}

                          {(detalleOrden?.visitas || []).length === 0 && (
                            <tr>
                              <td colSpan="6" className="py-4 text-slate-500">
                                No hay visitas asociadas.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </section>
                </div>
              )}

              {!cargandoDetalleOrden && !detalleOrden && (
                <div className="rounded-2xl bg-slate-50 px-4 py-3 text-slate-600">
                  No se pudo cargar el detalle.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  return isLoggedIn ? renderApp() : renderLogin();
}

function TarjetaDato({ titulo, valor }) {
  return (
    <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-premium transition-soft hover:shadow-premium-xl">
      <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 font-display">{titulo}</p>
      <p className="text-xl font-bold text-slate-900 font-display">{valor}</p>
    </div>
  );
}

function ResumenItem({ titulo, valor }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4 border border-slate-100 group transition-soft hover:bg-blue-50 hover:border-blue-100">
      <p className="text-sm font-semibold text-slate-500 group-hover:text-blue-600 transition-soft">{titulo}</p>
      <p className="text-lg font-bold text-slate-900 group-hover:text-blue-700 transition-soft tabular-nums">{valor}</p>
    </div>
  );
}

function MiniMapa({ coordenadas, titulo }) {
  const coords = parseCoordinates(coordenadas);

  if (!coords) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <p className="mb-2 font-medium text-slate-700">{titulo}</p>
        <p className="text-sm text-slate-500">Aún no hay coordenadas v├ílidas.</p>
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

function parseCoordinates(value) {
  if (!value || typeof value !== 'string') return null;

  const parts = value.split(',').map((item) => item.trim());
  if (parts.length !== 2) return null;

  const lat = Number(parts[0]);
  const lng = Number(parts[1]);

  if (Number.isNaN(lat) || Number.isNaN(lng)) return null;

  return { lat, lng };
}

function formatearFecha(fecha) {
  if (!fecha) return 'Sin fecha';

  try {
    const d = new Date(fecha);
    if (Number.isNaN(d.getTime())) return fecha;

    return d.toLocaleString('es-CO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return fecha;
  }
}

function renderEstadoBadge(estado) {
  const clases = getEstadoClasses(estado);
  return (
    <span className={`rounded-full px-3 py-1 text-sm font-medium ${clases}`}>
      {estado || 'Sin estado'}
    </span>
  );
}

function renderTipoBadge(tipo) {
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

function renderAccionOrden(orden, onCambiarEstado, onVerDetalle) {
  if (orden.estado === 'PROGRAMADA') {
    return (
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onCambiarEstado(orden.id, 'EN_PROCESO')}
          className="rounded-xl bg-amber-500 px-3 py-2 text-sm font-medium text-white shadow transition hover:-translate-y-0.5 hover:bg-amber-600"
        >
          Iniciar
        </button>
        <button
          onClick={() => onVerDetalle(orden.id)}
          className={smallDarkButtonClass}
        >
          Ver detalle
        </button>
      </div>
    );
  }

  if (orden.estado === 'EN_PROCESO') {
    return (
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onCambiarEstado(orden.id, 'FINALIZADA')}
          className="rounded-xl bg-emerald-600 px-3 py-2 text-sm font-medium text-white shadow transition hover:-translate-y-0.5 hover:bg-emerald-700"
        >
          Finalizar
        </button>
        <button
          onClick={() => onVerDetalle(orden.id)}
          className={smallDarkButtonClass}
        >
          Ver detalle
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="rounded-xl bg-emerald-100 px-3 py-2 text-sm font-medium text-emerald-700">
        Completada
      </span>
      <button
        onClick={() => onVerDetalle(orden.id)}
        className={smallDarkButtonClass}
      >
        Ver detalle
      </button>
    </div>
  );
}

function getEstadoClasses(estado) {
  switch (estado) {
    case 'PROGRAMADA':
      return 'bg-blue-50 text-blue-600 border border-blue-100 ring-4 ring-blue-500/5';
    case 'EN_PROCESO':
      return 'bg-amber-50 text-amber-600 border border-amber-100 ring-4 ring-amber-500/5';
    case 'FINALIZADA':
      return 'bg-emerald-50 text-emerald-600 border border-emerald-100 ring-4 ring-emerald-500/5';
    case 'ACTIVO':
      return 'bg-emerald-50 text-emerald-600 border border-emerald-100 ring-4 ring-emerald-500/5';
    case 'INACTIVO':
      return 'bg-rose-50 text-rose-600 border border-rose-100 ring-4 ring-rose-500/5';
    case 'MANTENIMIENTO':
      return 'bg-violet-50 text-violet-600 border border-violet-100 ring-4 ring-violet-500/5';
    default:
      return 'bg-slate-50 text-slate-600 border border-slate-100';
  }
}

const inputClass =
  'w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 outline-none transition-soft focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-500/5 font-sans';

const primaryButtonClass =
  'rounded-2xl bg-slate-900 px-6 py-3 text-white shadow-premium transition-soft hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-premium-xl active:translate-y-0 font-display font-semibold';

const secondaryButtonClass =
  'rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-soft hover:bg-slate-50 hover:border-slate-300 active:scale-95 font-display';

const smallDarkButtonClass =
  'inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-premium transition-soft hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-premium-xl active:translate-y-0 font-display';
