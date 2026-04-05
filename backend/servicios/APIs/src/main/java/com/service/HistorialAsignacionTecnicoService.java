package com.zion.zionbackend.service;

import com.zion.zionbackend.dto.HistorialAsignacionTecnicoCreateDTO;
import com.zion.zionbackend.dto.HistorialAsignacionTecnicoDTO;
import com.zion.zionbackend.entity.Equipo;
import com.zion.zionbackend.entity.HistorialAsignacionTecnico;
import com.zion.zionbackend.entity.Tecnico;
import com.zion.zionbackend.repository.EquipoRepository;
import com.zion.zionbackend.repository.HistorialAsignacionTecnicoRepository;
import com.zion.zionbackend.repository.TecnicoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class HistorialAsignacionTecnicoService {

    private final HistorialAsignacionTecnicoRepository historialRepository;
    private final TecnicoRepository tecnicoRepository;
    private final EquipoRepository equipoRepository;

    public HistorialAsignacionTecnicoService(HistorialAsignacionTecnicoRepository historialRepository,
                                             TecnicoRepository tecnicoRepository,
                                             EquipoRepository equipoRepository) {
        this.historialRepository = historialRepository;
        this.tecnicoRepository = tecnicoRepository;
        this.equipoRepository = equipoRepository;
    }

    @Transactional
    public HistorialAsignacionTecnicoDTO registrar(HistorialAsignacionTecnicoCreateDTO req) {
        Tecnico tecnico = tecnicoRepository.findById(req.tecnicoId())
                .orElseThrow(() -> new IllegalArgumentException("Tecnico no existe: " + req.tecnicoId()));

        Equipo equipo = equipoRepository.findById(req.equipoId())
                .orElseThrow(() -> new IllegalArgumentException("Equipo no existe: " + req.equipoId()));

        if (req.fechaFin() != null && req.fechaFin().isBefore(req.fechaInicio())) {
            throw new IllegalArgumentException("fechaFin no puede ser menor que fechaInicio");
        }

        HistorialAsignacionTecnico historial = new HistorialAsignacionTecnico();
        historial.setTecnico(tecnico);
        historial.setEquipo(equipo);
        historial.setFechaInicio(req.fechaInicio());
        historial.setFechaFin(req.fechaFin());

        HistorialAsignacionTecnico saved = historialRepository.save(historial);

        return new HistorialAsignacionTecnicoDTO(
                saved.getId(),
                saved.getFechaInicio(),
                saved.getFechaFin(),
                saved.getTecnico().getId(),
                saved.getEquipo().getId()
        );
    }

    @Transactional(readOnly = true)
    public List<HistorialAsignacionTecnicoDTO> listarPorEquipo(Long equipoId) {
        return historialRepository.findByEquipoId(equipoId).stream()
                .map(h -> new HistorialAsignacionTecnicoDTO(
                        h.getId(),
                        h.getFechaInicio(),
                        h.getFechaFin(),
                        h.getTecnico().getId(),
                        h.getEquipo().getId()
                ))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<HistorialAsignacionTecnicoDTO> listarPorTecnico(Long tecnicoId) {
        return historialRepository.findByTecnicoId(tecnicoId).stream()
                .map(h -> new HistorialAsignacionTecnicoDTO(
                        h.getId(),
                        h.getFechaInicio(),
                        h.getFechaFin(),
                        h.getTecnico().getId(),
                        h.getEquipo().getId()
                ))
                .toList();
    }
}