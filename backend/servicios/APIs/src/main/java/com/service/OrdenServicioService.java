package com.zion.zionbackend.service;

import com.zion.zionbackend.dto.OrdenServicioCreateDTO;
import com.zion.zionbackend.dto.OrdenServicioDTO;
import com.zion.zionbackend.entity.Empresa;
import com.zion.zionbackend.entity.OrdenServicio;
import com.zion.zionbackend.entity.Sede;
import com.zion.zionbackend.entity.Tecnico;
import com.zion.zionbackend.repository.EmpresaRepository;
import com.zion.zionbackend.repository.OrdenServicioRepository;
import com.zion.zionbackend.repository.SedeRepository;
import com.zion.zionbackend.repository.TecnicoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.zion.zionbackend.dto.OrdenServicioUpdateDTO;
import com.zion.zionbackend.dto.MantenimientoDTO;
import com.zion.zionbackend.dto.OrdenServicioDetalleDTO;
import com.zion.zionbackend.dto.VisitaTecnicaDTO;
import com.zion.zionbackend.entity.Mantenimiento;
import com.zion.zionbackend.entity.VisitaTecnica;
import com.zion.zionbackend.repository.MantenimientoRepository;
import com.zion.zionbackend.repository.VisitaTecnicaRepository;
import com.zion.zionbackend.entity.Tecnologia;




import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrdenServicioService {

        private final OrdenServicioRepository ordenServicioRepository;
        private final SedeRepository sedeRepository;
        private final EmpresaRepository empresaRepository;
        private final TecnicoRepository tecnicoRepository;
        private final MantenimientoRepository mantenimientoRepository;
        private final VisitaTecnicaRepository visitaTecnicaRepository;



        public OrdenServicioService(OrdenServicioRepository ordenServicioRepository,
                                    SedeRepository sedeRepository,
                                    EmpresaRepository empresaRepository,
                                    TecnicoRepository tecnicoRepository,
                                    MantenimientoRepository mantenimientoRepository,
                                    VisitaTecnicaRepository visitaTecnicaRepository) {
                this.ordenServicioRepository = ordenServicioRepository;
                this.sedeRepository = sedeRepository;
                this.empresaRepository = empresaRepository;
                this.tecnicoRepository = tecnicoRepository;
                this.mantenimientoRepository = mantenimientoRepository;
                this.visitaTecnicaRepository = visitaTecnicaRepository;
        }

        @Transactional
        public OrdenServicioDTO crear(OrdenServicioCreateDTO req) {
                String numero = req.numeroOrden().trim();

                if (ordenServicioRepository.existsByNumeroOrden(numero)) {
                        throw new IllegalArgumentException("Ya existe una orden con numeroOrden: " + numero);
                }

                Sede sede = sedeRepository.findById(req.sedeId())
                                .orElseThrow(() -> new IllegalArgumentException("Sede no existe: " + req.sedeId()));

                Empresa empresa = empresaRepository.findById(req.empresaId())
                                .orElseThrow(() -> new IllegalArgumentException(
                                                "Empresa no existe: " + req.empresaId()));

                Tecnico tecnico = tecnicoRepository.findById(req.tecnicoId())
                                .orElseThrow(() -> new IllegalArgumentException(
                                                "Tecnico no existe: " + req.tecnicoId()));

                OrdenServicio os = new OrdenServicio();
                os.setNumeroOrden(numero);
                os.setFechaCreacion(LocalDateTime.now());
                os.setFechaProgramada(req.fechaProgramada());
                os.setEstado(req.estado());

                os.setSede(sede);
                os.setEmpresa(empresa);
                os.setTecnicoAsignado(tecnico);

                OrdenServicio saved = ordenServicioRepository.save(os);

                return new OrdenServicioDTO(
                                saved.getId(),
                                saved.getNumeroOrden(),
                                saved.getFechaCreacion(),
                                saved.getFechaProgramada(),
                                saved.getEstado(),
                                saved.getSede().getId(),
                                saved.getEmpresa().getId(),
                                saved.getTecnicoAsignado().getId());
        }

        @Transactional(readOnly = true)
        public List<OrdenServicioDTO> listar() {
                return ordenServicioRepository.findAll().stream()
                                .map(o -> new OrdenServicioDTO(
                                                o.getId(),
                                                o.getNumeroOrden(),
                                                o.getFechaCreacion(),
                                                o.getFechaProgramada(),
                                                o.getEstado(),
                                                o.getSede().getId(),
                                                o.getEmpresa().getId(),
                                                o.getTecnicoAsignado().getId()))
                                .toList();
        }

        @Transactional(readOnly = true)
        public OrdenServicioDTO obtener(Long id) {
                OrdenServicio o = ordenServicioRepository.findById(id)
                                .orElseThrow(() -> new IllegalArgumentException("Orden no encontrada: " + id));

                return new OrdenServicioDTO(
                                o.getId(),
                                o.getNumeroOrden(),
                                o.getFechaCreacion(),
                                o.getFechaProgramada(),
                                o.getEstado(),
                                o.getSede().getId(),
                                o.getEmpresa().getId(),
                                o.getTecnicoAsignado().getId());
        }


        @Transactional
        public OrdenServicioDTO actualizar(Long id, OrdenServicioUpdateDTO req) {
                OrdenServicio orden = ordenServicioRepository.findById(id)
                        .orElseThrow(() -> new IllegalArgumentException("Orden no encontrada: " + id));

                if (req.numeroOrden() != null && !req.numeroOrden().trim().isEmpty()) {
                        String nuevoNumero = req.numeroOrden().trim();

                        if (!nuevoNumero.equals(orden.getNumeroOrden())
                                && ordenServicioRepository.existsByNumeroOrden(nuevoNumero)) {
                                throw new IllegalArgumentException("Ya existe una orden con numeroOrden: " + nuevoNumero);
                        }

                        orden.setNumeroOrden(nuevoNumero);
                }

                if (req.fechaProgramada() != null) {
                        orden.setFechaProgramada(req.fechaProgramada());
                }

                if (req.estado() != null) {
                        orden.setEstado(req.estado());
                }

                if (req.sedeId() != null) {
                        Sede sede = sedeRepository.findById(req.sedeId())
                                .orElseThrow(() -> new IllegalArgumentException("Sede no existe: " + req.sedeId()));
                        orden.setSede(sede);
                }

                if (req.empresaId() != null) {
                        Empresa empresa = empresaRepository.findById(req.empresaId())
                                .orElseThrow(() -> new IllegalArgumentException("Empresa no existe: " + req.empresaId()));
                        orden.setEmpresa(empresa);
                }

                if (req.tecnicoId() != null) {
                        Tecnico tecnico = tecnicoRepository.findById(req.tecnicoId())
                                .orElseThrow(() -> new IllegalArgumentException("Tecnico no existe: " + req.tecnicoId()));
                        orden.setTecnicoAsignado(tecnico);
                }

                OrdenServicio saved = ordenServicioRepository.save(orden);

                return new OrdenServicioDTO(
                        saved.getId(),
                        saved.getNumeroOrden(),
                        saved.getFechaCreacion(),
                        saved.getFechaProgramada(),
                        saved.getEstado(),
                        saved.getSede().getId(),
                        saved.getEmpresa().getId(),
                        saved.getTecnicoAsignado().getId()
                );
        }

        @Transactional
        public void eliminar(Long id) {
                OrdenServicio orden = ordenServicioRepository.findById(id)
                        .orElseThrow(() -> new IllegalArgumentException("Orden no encontrada: " + id));

                ordenServicioRepository.delete(orden);
        }

        @Transactional(readOnly = true)
        public OrdenServicioDetalleDTO obtenerDetalle(Long id) {
                OrdenServicio orden = ordenServicioRepository.findById(id)
                        .orElseThrow(() -> new IllegalArgumentException("Orden no encontrada: " + id));

                List<MantenimientoDTO> mantenimientos = mantenimientoRepository.findByOrdenServicioId(id)
                        .stream()
                        .map(m -> new MantenimientoDTO(
                                m.getId(),
                                m.getTipo(),
                                m.getDescripcion(),
                                m.getFechaInicio(),
                                m.getFechaFin(),
                                m.getOrdenServicio().getId(),
                                m.getEquipo().getId()
                        ))
                        .toList();

                List<VisitaTecnicaDTO> visitas = visitaTecnicaRepository.findByOrdenServicioId(id)
                        .stream()
                        .map(v -> new VisitaTecnicaDTO(
                                v.getId(),
                                v.getFechaInicio(),
                                v.getFechaFin(),
                                v.getObservaciones(),
                                v.getUbicacionInicio(),
                                v.getUbicacionFin(),
                                v.getOrdenServicio().getId(),
                                v.getTecnico().getId()
                        ))
                        .toList();

                return new OrdenServicioDetalleDTO(
                        orden.getId(),
                        orden.getNumeroOrden(),
                        orden.getFechaCreacion(),
                        orden.getFechaProgramada(),
                        orden.getEstado(),

                        orden.getSede().getId(),

                        orden.getEmpresa().getId(),
                        orden.getEmpresa().getNombre(),

                        orden.getTecnicoAsignado().getId(),
                        orden.getTecnicoAsignado().getNombre(),
                        orden.getTecnicoAsignado().getTecnologias().stream()
                                .map(Tecnologia::getNombre)
                                .collect(java.util.stream.Collectors.toSet()),

                        mantenimientos,
                        visitas
                );
        }
}