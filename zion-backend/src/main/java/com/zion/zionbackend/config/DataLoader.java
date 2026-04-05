package com.zion.zionbackend.config;

import com.zion.zionbackend.entity.*;
import com.zion.zionbackend.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Configuration
public class DataLoader {

    @Bean
    CommandLineRunner initData(
            SedeRepository sedeRepository,
            TecnologiaRepository tecnologiaRepository,
            TecnicoRepository tecnicoRepository,
            EmpresaRepository empresaRepository,
            EquipoRepository equipoRepository,
            OrdenServicioRepository ordenServicioRepository,
            MantenimientoRepository mantenimientoRepository,
            VisitaTecnicaRepository visitaTecnicaRepository
    ) {
        return args -> {

            // Evita duplicar si ya hay datos
            if (sedeRepository.count() > 0) {
                return;
            }

            // =========================
            // 1. SEDES
            // =========================
            Sede sedeCali = new Sede("Sede Cali", "Cali", "ACTIVA");
            Sede sedeBogota = new Sede("Sede Bogotá", "Bogotá", "ACTIVA");
            Sede sedeMedellin = new Sede("Sede Medellín", "Medellín", "ACTIVA");
            Sede sedeBarranquilla = new Sede("Sede Barranquilla", "Barranquilla", "ACTIVA");

            sedeRepository.save(sedeCali);
            sedeRepository.save(sedeBogota);
            sedeRepository.save(sedeMedellin);
            sedeRepository.save(sedeBarranquilla);

            // =========================
            // 2. TECNOLOGIAS
            // =========================
            Tecnologia cij = new Tecnologia("CIJ", "Inyección de tinta continua");
            Tecnologia laser = new Tecnologia("LASER", "Marcación láser industrial");
            Tecnologia tto = new Tecnologia("TTO", "Transferencia térmica");
            Tecnologia lcm = new Tecnologia("LCM", "Marcación de cajas");
            Tecnologia lpa = new Tecnologia("LPA", "Aplicación y etiquetado");

            tecnologiaRepository.save(cij);
            tecnologiaRepository.save(laser);
            tecnologiaRepository.save(tto);
            tecnologiaRepository.save(lcm);
            tecnologiaRepository.save(lpa);

            // =========================
            // 3. TECNICOS
            // =========================
            Tecnico tecnico1 = new Tecnico();
            tecnico1.setNombre("Carlos Ruiz");
            tecnico1.setDocumento("123456");
            tecnico1.setTelefono("3001234567");
            tecnico1.setEmail("carlos@zion.com");
            tecnico1.setEspecialidad("Impresión industrial");
            tecnico1.setRol("TECNICO");
            tecnico1.setEstado("ACTIVO");
            tecnico1.setSede(sedeCali);

            Set<Tecnologia> tecnologiasTecnico1 = new HashSet<>();
            tecnologiasTecnico1.add(cij);
            tecnologiasTecnico1.add(laser);
            tecnico1.setTecnologias(tecnologiasTecnico1);

            Tecnico tecnico2 = new Tecnico();
            tecnico2.setNombre("Andrés Gómez");
            tecnico2.setDocumento("789456");
            tecnico2.setTelefono("3015557788");
            tecnico2.setEmail("andres@zion.com");
            tecnico2.setEspecialidad("Codificación y empaque");
            tecnico2.setRol("TECNICO");
            tecnico2.setEstado("ACTIVO");
            tecnico2.setSede(sedeCali);

            Set<Tecnologia> tecnologiasTecnico2 = new HashSet<>();
            tecnologiasTecnico2.add(cij);
            tecnologiasTecnico2.add(tto);
            tecnico2.setTecnologias(tecnologiasTecnico2);

            tecnicoRepository.save(tecnico1);
            tecnicoRepository.save(tecnico2);

            // =========================
            // 4. EMPRESAS
            // =========================
            Empresa empresa1 = new Empresa();
            empresa1.setNombre("Tecnomarket S.A.S");
            empresa1.setCiudad("Cali");
            empresa1.setDireccion("Calle 10 # 20-30");
            empresa1.setContacto("Andrés - 3100000000");
            empresa1.setEstado("ACTIVA");
            empresa1.setSede(sedeCali);

            Set<Tecnologia> tecnologiasEmpresa1 = new HashSet<>();
            tecnologiasEmpresa1.add(cij);
            tecnologiasEmpresa1.add(laser);
            empresa1.setTecnologias(tecnologiasEmpresa1);

            Empresa empresa2 = new Empresa();
            empresa2.setNombre("Industria Andina S.A.");
            empresa2.setCiudad("Cali");
            empresa2.setDireccion("Zona Industrial Km 3");
            empresa2.setContacto("Laura - 3122223344");
            empresa2.setEstado("ACTIVA");
            empresa2.setSede(sedeCali);

            Set<Tecnologia> tecnologiasEmpresa2 = new HashSet<>();
            tecnologiasEmpresa2.add(tto);
            tecnologiasEmpresa2.add(lcm);
            empresa2.setTecnologias(tecnologiasEmpresa2);

            empresaRepository.save(empresa1);
            empresaRepository.save(empresa2);

            // =========================
            // 5. EQUIPOS
            // =========================
            Equipo equipo1 = new Equipo();
            equipo1.setSerial("VJ3340-20176002LWD");
            equipo1.setReferencia("Videojet 3340");
            equipo1.setCiudadActual("Cali");
            equipo1.setPlantaActual("Planta Schmucker 2");
            equipo1.setAreaActual("Café");
            equipo1.setLineaActual("Linea 2");
            equipo1.setEstado("ACTIVO");
            equipo1.setSede(sedeCali);
            equipo1.setEmpresa(empresa1);
            equipo1.setTecnologia(laser);

            Equipo equipo2 = new Equipo();
            equipo2.setSerial("VJ1860-ABC123456");
            equipo2.setReferencia("Videojet 1860");
            equipo2.setCiudadActual("Cali");
            equipo2.setPlantaActual("Planta Central");
            equipo2.setAreaActual("Producción");
            equipo2.setLineaActual("Linea 1");
            equipo2.setEstado("ACTIVO");
            equipo2.setSede(sedeCali);
            equipo2.setEmpresa(empresa1);
            equipo2.setTecnologia(cij);

            equipoRepository.save(equipo1);
            equipoRepository.save(equipo2);

            // =========================
            // 6. ORDENES DE SERVICIO
            // =========================
            OrdenServicio orden1 = new OrdenServicio();
            orden1.setNumeroOrden("OS-0001");
            orden1.setFechaCreacion(LocalDateTime.now());
            orden1.setFechaProgramada(LocalDateTime.of(2026, 3, 16, 9, 0));
            orden1.setEstado("PROGRAMADA");
            orden1.setSede(sedeCali);
            orden1.setEmpresa(empresa1);
            orden1.setTecnicoAsignado(tecnico1);

            OrdenServicio orden2 = new OrdenServicio();
            orden2.setNumeroOrden("OS-0002");
            orden2.setFechaCreacion(LocalDateTime.now());
            orden2.setFechaProgramada(LocalDateTime.of(2026, 3, 16, 14, 0));
            orden2.setEstado("PROGRAMADA");
            orden2.setSede(sedeCali);
            orden2.setEmpresa(empresa1);
            orden2.setTecnicoAsignado(tecnico2);

            ordenServicioRepository.save(orden1);
            ordenServicioRepository.save(orden2);

            // =========================
            // 7. MANTENIMIENTOS
            // =========================
            Mantenimiento mantenimiento1 = new Mantenimiento();
            mantenimiento1.setTipo("PREVENTIVO");
            mantenimiento1.setDescripcion("Limpieza general y revisión de consumibles");
            mantenimiento1.setFechaInicio(LocalDateTime.of(2026, 3, 16, 9, 15));
            mantenimiento1.setFechaFin(LocalDateTime.of(2026, 3, 16, 10, 0));
            mantenimiento1.setOrdenServicio(orden1);
            mantenimiento1.setEquipo(equipo1);

            Mantenimiento mantenimiento2 = new Mantenimiento();
            mantenimiento2.setTipo("CORRECTIVO");
            mantenimiento2.setDescripcion("Ajuste de cabezal y prueba de impresión");
            mantenimiento2.setFechaInicio(LocalDateTime.of(2026, 3, 16, 14, 15));
            mantenimiento2.setFechaFin(LocalDateTime.of(2026, 3, 16, 15, 10));
            mantenimiento2.setOrdenServicio(orden2);
            mantenimiento2.setEquipo(equipo2);

            mantenimientoRepository.save(mantenimiento1);
            mantenimientoRepository.save(mantenimiento2);

            // =========================
            // 8. VISITAS TECNICAS
            // =========================
            VisitaTecnica visita1 = new VisitaTecnica();
            visita1.setFechaInicio(LocalDateTime.of(2026, 3, 16, 8, 40));
            visita1.setFechaFin(LocalDateTime.of(2026, 3, 16, 10, 10));
            visita1.setObservaciones("Se realizó desplazamiento, revisión inicial y mantenimiento preventivo.");
            visita1.setUbicacionInicio("Sede Cali - Bodega");
            visita1.setUbicacionFin("Tecnomarket - Planta Schmucker 2");
            visita1.setOrdenServicio(orden1);
            visita1.setTecnico(tecnico1);

            VisitaTecnica visita2 = new VisitaTecnica();
            visita2.setFechaInicio(LocalDateTime.of(2026, 3, 16, 13, 40));
            visita2.setFechaFin(LocalDateTime.of(2026, 3, 16, 15, 20));
            visita2.setObservaciones("Se realizó ajuste correctivo y validación operativa final.");
            visita2.setUbicacionInicio("Sede Cali - Taller");
            visita2.setUbicacionFin("Tecnomarket - Planta Central");
            visita2.setOrdenServicio(orden2);
            visita2.setTecnico(tecnico2);

            visitaTecnicaRepository.save(visita1);
            visitaTecnicaRepository.save(visita2);
        };
    }
}