package com.zion.zionbackend.service;

import com.zion.zionbackend.dto.VisitaTecnicaCreateDTO;
import com.zion.zionbackend.dto.VisitaTecnicaDTO;
import com.zion.zionbackend.entity.OrdenServicio;
import com.zion.zionbackend.entity.Tecnico;
import com.zion.zionbackend.entity.VisitaTecnica;
import com.zion.zionbackend.repository.OrdenServicioRepository;
import com.zion.zionbackend.repository.TecnicoRepository;
import com.zion.zionbackend.repository.VisitaTecnicaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class VisitaTecnicaService {

        private final VisitaTecnicaRepository visitaRepository;
        private final OrdenServicioRepository ordenServicioRepository;
        private final TecnicoRepository tecnicoRepository;

        public VisitaTecnicaService(VisitaTecnicaRepository visitaRepository,
                        OrdenServicioRepository ordenServicioRepository,
                        TecnicoRepository tecnicoRepository) {
                this.visitaRepository = visitaRepository;
                this.ordenServicioRepository = ordenServicioRepository;
                this.tecnicoRepository = tecnicoRepository;
        }

        @Transactional
        public VisitaTecnicaDTO crear(VisitaTecnicaCreateDTO req) {

                OrdenServicio orden = ordenServicioRepository.findById(req.ordenServicioId())
                                .orElseThrow(() -> new IllegalArgumentException(
                                                "Orden no existe: " + req.ordenServicioId()));

                Tecnico tecnico = tecnicoRepository.findById(req.tecnicoId())
                                .orElseThrow(() -> new IllegalArgumentException(
                                                "Tecnico no existe: " + req.tecnicoId()));

                if (req.fechaFin().isBefore(req.fechaInicio())) {
                        throw new IllegalArgumentException("fechaFin no puede ser menor que fechaInicio");
                }

                VisitaTecnica v = new VisitaTecnica();
                v.setFechaInicio(req.fechaInicio());
                v.setFechaFin(req.fechaFin());
                v.setObservaciones(req.observaciones());
                v.setUbicacionInicio(req.ubicacionInicio());
                v.setUbicacionFin(req.ubicacionFin());
                v.setOrdenServicio(orden);
                v.setTecnico(tecnico);

                VisitaTecnica saved = visitaRepository.save(v);

                return new VisitaTecnicaDTO(
                                saved.getId(),
                                saved.getFechaInicio(),
                                saved.getFechaFin(),
                                saved.getObservaciones(),
                                saved.getUbicacionInicio(),
                                saved.getUbicacionFin(),
                                saved.getOrdenServicio().getId(),
                                saved.getTecnico().getId());
        }

        @Transactional(readOnly = true)
        public List<VisitaTecnicaDTO> listar() {
                return visitaRepository.findAll().stream()
                                .map(v -> new VisitaTecnicaDTO(
                                                v.getId(),
                                                v.getFechaInicio(),
                                                v.getFechaFin(),
                                                v.getObservaciones(),
                                                v.getUbicacionInicio(),
                                                v.getUbicacionFin(),
                                                v.getOrdenServicio().getId(),
                                                v.getTecnico().getId()))
                                .toList();
        }
}