export default function App() {
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

  return (
    <div style={{ minHeight: '100vh', background: '#f1f5f9', color: '#1e293b' }}>
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <aside
          style={{
            width: '280px',
            background: '#0f172a',
            color: 'white',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ marginBottom: '40px' }}>
              <h1 style={{ fontSize: '30px', fontWeight: 'bold', margin: 0 }}>ZION</h1>
              <p style={{ color: '#cbd5e1', marginTop: '8px' }}>
                Gestión de servicio técnico industrial
              </p>
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {menu.map((item) => (
                <div
                  key={item}
                  style={{
                    borderRadius: '16px',
                    padding: '12px 16px',
                    background: item === 'Dashboard' ? 'white' : 'transparent',
                    color: item === 'Dashboard' ? '#0f172a' : '#cbd5e1',
                    fontWeight: item === 'Dashboard' ? '600' : '400',
                    cursor: 'pointer',
                  }}
                >
                  {item}
                </div>
              ))}
            </nav>
          </div>

          <div
            style={{
              borderRadius: '16px',
              background: '#1e293b',
              padding: '16px',
              fontSize: '14px',
              color: '#cbd5e1',
            }}
          >
            <p style={{ fontWeight: 'bold', color: 'white', margin: 0 }}>Usuario conectado</p>
            <p style={{ marginTop: '8px' }}>Administrador técnico</p>
          </div>
        </aside>

        <main style={{ flex: 1, padding: '32px' }}>
          <header
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '32px',
              gap: '20px',
              flexWrap: 'wrap',
            }}
          >
            <div>
              <h2 style={{ fontSize: '32px', fontWeight: 'bold', margin: 0 }}>Panel principal</h2>
              <p style={{ color: '#64748b', marginTop: '8px' }}>
                Control general del estado operativo de ZION
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <input
                placeholder="Buscar orden, cliente o equipo..."
                style={{
                  borderRadius: '16px',
                  border: '1px solid #cbd5e1',
                  padding: '12px 16px',
                  width: '280px',
                  background: 'white',
                }}
              />
              <button
                style={{
                  borderRadius: '16px',
                  background: '#0f172a',
                  color: 'white',
                  padding: '12px 20px',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Nueva orden
              </button>
            </div>
          </header>

          <section
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '20px',
              marginBottom: '32px',
            }}
          >
            {stats.map((stat) => (
              <div
                key={stat.title}
                style={{
                  background: 'white',
                  borderRadius: '24px',
                  padding: '24px',
                  border: '1px solid #e2e8f0',
                }}
              >
                <p style={{ color: '#64748b', fontSize: '14px' }}>{stat.title}</p>
                <p style={{ fontSize: '32px', fontWeight: 'bold', marginTop: '12px' }}>
                  {stat.value}
                </p>
              </div>
            ))}
          </section>

          <section
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr',
              gap: '20px',
            }}
          >
            <div
              style={{
                background: 'white',
                borderRadius: '24px',
                padding: '24px',
                border: '1px solid #e2e8f0',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '20px',
                }}
              >
                <h3 style={{ fontSize: '22px', fontWeight: '600', margin: 0 }}>
                  Órdenes recientes
                </h3>
                <button
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#475569',
                    cursor: 'pointer',
                  }}
                >
                  Ver todas
                </button>
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ textAlign: 'left', color: '#64748b', fontSize: '14px' }}>
                    <th style={{ paddingBottom: '12px' }}>Código</th>
                    <th style={{ paddingBottom: '12px' }}>Cliente</th>
                    <th style={{ paddingBottom: '12px' }}>Equipo</th>
                    <th style={{ paddingBottom: '12px' }}>Estado</th>
                    <th style={{ paddingBottom: '12px' }}>Técnico</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} style={{ borderTop: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '16px 0', fontWeight: '600' }}>{order.id}</td>
                      <td>{order.cliente}</td>
                      <td>{order.equipo}</td>
                      <td>{order.estado}</td>
                      <td>{order.tecnico}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div
              style={{
                background: 'white',
                borderRadius: '24px',
                padding: '24px',
                border: '1px solid #e2e8f0',
              }}
            >
              <h3 style={{ fontSize: '22px', fontWeight: '600', marginBottom: '20px' }}>
                Resumen rápido
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div
                  style={{
                    borderRadius: '16px',
                    background: '#f8fafc',
                    padding: '16px',
                  }}
                >
                  <p style={{ fontSize: '14px', color: '#64748b' }}>Módulo prioritario</p>
                  <p style={{ fontWeight: '600', marginTop: '8px' }}>Órdenes de servicio</p>
                </div>

                <div
                  style={{
                    borderRadius: '16px',
                    background: '#f8fafc',
                    padding: '16px',
                  }}
                >
                  <p style={{ fontSize: '14px', color: '#64748b' }}>Siguiente visita</p>
                  <p style={{ fontWeight: '600', marginTop: '8px' }}>10:30 AM - Planta Cali</p>
                </div>

                <div
                  style={{
                    borderRadius: '16px',
                    background: '#f8fafc',
                    padding: '16px',
                  }}
                >
                  <p style={{ fontSize: '14px', color: '#64748b' }}>Equipos críticos</p>
                  <p style={{ fontWeight: '600', marginTop: '8px' }}>
                    4 pendientes por revisión
                  </p>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}