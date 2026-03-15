import { useState } from 'react';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeSection, setActiveSection] = useState('Dashboard');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const stats = [
    { title: 'Órdenes abiertas', value: '18' },
    { title: 'Técnicos activos', value: '7' },
    { title: 'Visitas hoy', value: '12' },
    { title: 'Equipos en alerta', value: '4' },
  ];

  const recentOrders = [
    {
      id: 'OS-1024',
      cliente: 'Tecnomarket',
      equipo: 'Videojet 6530',
      estado: 'En proceso',
      tecnico: 'Carlos Ruiz',
    },
    {
      id: 'OS-1025',
      cliente: 'Schmucker 2',
      equipo: 'Videojet 3340',
      estado: 'Pendiente',
      tecnico: 'Laura Gómez',
    },
    {
      id: 'OS-1026',
      cliente: 'Culinarios SB1',
      equipo: 'Videojet 3140',
      estado: 'Completada',
      tecnico: 'Andrés López',
    },
  ];

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

  const sectionData = {
    'Órdenes de servicio': {
      title: 'Órdenes de servicio',
      description: 'Gestión de órdenes creadas, en proceso y finalizadas.',
      buttonText: 'Nueva orden',
      columns: ['Código', 'Cliente', 'Equipo', 'Estado'],
      rows: [
        ['OS-1024', 'Tecnomarket', 'Videojet 6530', 'En proceso'],
        ['OS-1025', 'Schmucker 2', 'Videojet 3340', 'Pendiente'],
        ['OS-1026', 'Culinarios SB1', 'Videojet 3140', 'Completada'],
      ],
    },
    'Visitas técnicas': {
      title: 'Visitas técnicas',
      description: 'Planeación y seguimiento de visitas programadas a planta.',
      buttonText: 'Nueva visita',
      columns: ['Fecha', 'Técnico', 'Ubicación', 'Estado'],
      rows: [
        ['11/03/2026', 'Carlos Ruiz', 'Planta Cali', 'Programada'],
        ['11/03/2026', 'Laura Gómez', 'Tecnomarket', 'En curso'],
        ['12/03/2026', 'Andrés López', 'Bodega Norte', 'Pendiente'],
      ],
    },
    Mantenimientos: {
      title: 'Mantenimientos',
      description: 'Control de mantenimientos preventivos y correctivos.',
      buttonText: 'Nuevo mantenimiento',
      columns: ['Tipo', 'Equipo', 'Responsable', 'Estado'],
      rows: [
        ['Preventivo', 'Videojet 6530', 'Carlos Ruiz', 'En proceso'],
        ['Correctivo', 'Videojet 3340', 'Laura Gómez', 'Pendiente'],
        ['Preventivo', 'Videojet 3140', 'Andrés López', 'Completado'],
      ],
    },
    Equipos: {
      title: 'Equipos',
      description: 'Inventario y estado operativo de los equipos registrados.',
      buttonText: 'Nuevo equipo',
      columns: ['Serial', 'Modelo', 'Ubicación', 'Estado'],
      rows: [
        ['2136510008TZH', 'VJ6530', 'Planta Cali', 'Operativo'],
        ['20176002LWD', 'VJ3340', 'Schmucker 2', 'Alerta'],
        ['20175002LWD', 'VJ3140', 'SB1 Culinarios', 'Operativo'],
      ],
    },
    Clientes: {
      title: 'Clientes',
      description: 'Empresas registradas y sus datos de seguimiento.',
      buttonText: 'Nuevo cliente',
      columns: ['Cliente', 'Ciudad', 'Contacto', 'Estado'],
      rows: [
        ['Tecnomarket', 'Cali', 'Ana Torres', 'Activo'],
        ['Schmucker 2', 'Palmira', 'Luis Rojas', 'Activo'],
        ['Culinarios SB1', 'Yumbo', 'Marta Díaz', 'Activo'],
      ],
    },
    Técnicos: {
      title: 'Técnicos',
      description: 'Personal técnico disponible para atención y visitas.',
      buttonText: 'Nuevo técnico',
      columns: ['Nombre', 'Especialidad', 'Zona', 'Disponibilidad'],
      rows: [
        ['Carlos Ruiz', 'Videojet', 'Cali', 'Disponible'],
        ['Laura Gómez', 'Mantenimiento', 'Palmira', 'Ocupada'],
        ['Andrés López', 'Instalación', 'Yumbo', 'Disponible'],
      ],
    },
    Reportes: {
      title: 'Reportes',
      description: 'Indicadores operativos y reportes de servicio.',
      buttonText: 'Generar reporte',
      columns: ['Reporte', 'Periodo', 'Responsable', 'Estado'],
      rows: [
        ['Órdenes mensuales', 'Marzo 2026', 'Admin', 'Generado'],
        ['Visitas por técnico', 'Marzo 2026', 'Admin', 'Pendiente'],
        ['Equipos críticos', 'Semana actual', 'Admin', 'Generado'],
      ],
    },
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setEmail('');
    setPassword('');
    setActiveSection('Dashboard');
  };

  function renderLogin() {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
          <div className="flex items-center justify-center p-8 lg:p-14">
            <div className="w-full max-w-md">
              <div className="mb-10">
                <div className="mb-4 inline-flex rounded-2xl bg-white/10 px-4 py-2 text-sm text-slate-200">
                  Sistema empresarial
                </div>
                <h1 className="text-4xl font-bold tracking-tight">Bienvenido a ZION</h1>
                <p className="mt-3 text-slate-300">
                  Plataforma de gestión de servicio técnico industrial para órdenes,
                  visitas, mantenimientos y reportes.
                </p>
              </div>

              <form
                onSubmit={handleLogin}
                className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur"
              >
                <h2 className="text-2xl font-semibold">Iniciar sesión</h2>
                <p className="mt-1 text-sm text-slate-300">
                  Ingresa tus credenciales para acceder al panel.
                </p>

                <div className="mt-6 space-y-4">
                  <div>
                    <label className="mb-2 block text-sm text-slate-200">Correo</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@zion.com"
                      className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-slate-400"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm text-slate-200">Contraseña</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-slate-400"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="mt-6 w-full rounded-2xl bg-white px-5 py-3 font-semibold text-slate-900 transition hover:bg-slate-200"
                >
                  Iniciar sesión
                </button>

                <div className="mt-4 rounded-2xl bg-slate-900/70 p-4 text-sm text-slate-300">
                  Demo visual: puedes ingresar cualquier correo y contraseña para entrar.
                </div>
              </form>
            </div>
          </div>

          <div className="hidden lg:flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 p-14">
            <div className="w-full max-w-xl">
              <div className="rounded-[2rem] border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur">
                <div className="mb-8 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-300">Vista previa del sistema</p>
                    <h3 className="text-2xl font-bold">Panel operativo ZION</h3>
                  </div>
                  <div className="rounded-2xl bg-emerald-400/20 px-3 py-2 text-sm text-emerald-300">
                    En línea
                  </div>
                </div>

                <div className="mb-6 grid grid-cols-2 gap-4">
                  {stats.map((stat) => (
                    <div
                      key={stat.title}
                      className="rounded-2xl border border-white/10 bg-slate-900/60 p-4"
                    >
                      <p className="text-sm text-slate-300">{stat.title}</p>
                      <p className="mt-2 text-3xl font-bold">{stat.value}</p>
                    </div>
                  ))}
                </div>

                <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <h4 className="font-semibold">Actividad reciente</h4>
                    <span className="text-sm text-slate-300">Hoy</span>
                  </div>

                  <div className="space-y-3">
                    <div className="rounded-xl bg-white/5 p-3">
                      Orden OS-1024 asignada a Carlos Ruiz
                    </div>
                    <div className="rounded-xl bg-white/5 p-3">
                      Visita técnica programada en Planta Cali
                    </div>
                    <div className="rounded-xl bg-white/5 p-3">
                      Equipo VJ3340 marcado en alerta
                    </div>
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
        <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Panel principal</h2>
            <p className="mt-1 text-slate-500">
              Control general del estado operativo de ZION
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <input
              className="w-72 rounded-2xl border border-slate-300 bg-white px-4 py-3 shadow-sm outline-none focus:border-slate-500"
              placeholder="Buscar orden, cliente o equipo..."
            />
            <button className="rounded-2xl bg-slate-900 px-5 py-3 text-white shadow-lg transition hover:opacity-90">
              Nueva orden
            </button>
          </div>
        </header>

        <section className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.title}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <p className="text-sm text-slate-500">{stat.title}</p>
              <p className="mt-3 text-3xl font-bold text-slate-900">{stat.value}</p>
            </div>
          ))}
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-slate-900">Órdenes recientes</h3>
              <button className="text-sm font-medium text-slate-600 hover:text-slate-900">
                Ver todas
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-sm text-slate-500">
                    <th className="pb-3">Código</th>
                    <th className="pb-3">Cliente</th>
                    <th className="pb-3">Equipo</th>
                    <th className="pb-3">Estado</th>
                    <th className="pb-3">Técnico</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="border-b border-slate-100 last:border-0">
                      <td className="py-4 font-semibold text-slate-900">{order.id}</td>
                      <td className="py-4">{order.cliente}</td>
                      <td className="py-4">{order.equipo}</td>
                      <td className="py-4">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
                          {order.estado}
                        </span>
                      </td>
                      <td className="py-4">{order.tecnico}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-5 text-xl font-semibold text-slate-900">Resumen rápido</h3>

            <div className="space-y-4">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Módulo prioritario</p>
                <p className="mt-1 font-semibold text-slate-900">Órdenes de servicio</p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Siguiente visita</p>
                <p className="mt-1 font-semibold text-slate-900">10:30 AM - Planta Cali</p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Equipos críticos</p>
                <p className="mt-1 font-semibold text-slate-900">4 pendientes por revisión</p>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  function renderSection(sectionName) {
    const section = sectionData[sectionName];

    return (
      <>
        <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">{section.title}</h2>
            <p className="mt-1 text-slate-500">{section.description}</p>
          </div>

          <button className="rounded-2xl bg-slate-900 px-5 py-3 text-white shadow-lg transition hover:opacity-90">
            {section.buttonText}
          </button>
        </header>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-200 text-sm text-slate-500">
                  {section.columns.map((column) => (
                    <th key={column} className="pb-3">
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {section.rows.map((row, index) => (
                  <tr key={index} className="border-b border-slate-100 last:border-0">
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex} className="py-4 text-slate-700">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </>
    );
  }

  function renderApp() {
    return (
      <div className="min-h-screen bg-slate-100 text-slate-800">
        <div className="flex min-h-screen">
          <aside className="flex w-72 flex-col justify-between bg-slate-900 p-6 text-white shadow-2xl">
            <div>
              <div className="mb-10">
                <h1 className="text-3xl font-bold tracking-wide">ZION</h1>
                <p className="mt-2 text-sm text-slate-300">
                  Gestión de servicio técnico industrial
                </p>
              </div>

              <nav className="space-y-2">
                {menu.map((item) => (
                  <button
                    key={item}
                    onClick={() => setActiveSection(item)}
                    className={`w-full rounded-2xl px-4 py-3 text-left transition ${
                      item === activeSection
                        ? 'bg-white font-semibold text-slate-900'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </nav>
            </div>

            <div className="rounded-2xl bg-slate-800 p-4 text-sm text-slate-300">
              <p className="font-semibold text-white">Usuario conectado</p>
              <p className="mt-1">Administrador técnico</p>
              <button
                onClick={handleLogout}
                className="mt-4 w-full rounded-xl border border-slate-600 px-3 py-2 text-left transition hover:bg-slate-700"
              >
                Cerrar sesión
              </button>
            </div>
          </aside>

          <main className="flex-1 p-8">
            {activeSection === 'Dashboard'
              ? renderDashboard()
              : renderSection(activeSection)}
          </main>
        </div>
      </div>
    );
  }

  return isLoggedIn ? renderApp() : renderLogin();
}