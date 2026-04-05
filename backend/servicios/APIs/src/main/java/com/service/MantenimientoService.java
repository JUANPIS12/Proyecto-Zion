package com.zion.zionbackend.service;

import com.zion.zionbackend.dto.MantenimientoCreateDTO;
import com.zion.zionbackend.dto.MantenimientoDTO;
import com.zion.zionbackend.entity.Equipo;
import com.zion.zionbackend.entity.Mantenimiento;
import com.zion.zionbackend.entity.OrdenServicio;
import com.zion.zionbackend.repository.EquipoRepository;
import com.zion.zionbackend.repository.MantenimientoRepository;
import com.zion.zionbackend.repository.OrdenServicioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class MantenimientoService {

    private final MantenimientoRepository mantenimientoRepository;
    private final OrdenServicioRepository ordenServicioRepository;
    private final EquipoRepository equipoRepository;

    public MantenimientoService(MantenimientoRepository mantenimientoRepository,
                                OrdenServicioRepository ordenServicioRepository,
                                EquipoRepository equipoRepository) {
        this.mantenimientoRepository = mantenimientoRepository;
        this.ordenServicioRepository = ordenServicioRepository;
        this.equipoRepository = equipoRepository;
    }

    @Transactional
    public MantenimientoDTO crear(MantenimientoCreateDTO req) {

        OrdenServicio orden = ordenServicioRepository.findById(req.ordenServicioId())
                .orElseThrow(() -> new IllegalArgumentException(
                        "Orden no existe: " + req.ordenServicioId()));

        Equipo equipo = equipoRepository.findById(req.equipoId())
                .orElseThrow(() -> new IllegalArgumentException("Equipo no existe: " + req.equipoId()));

        if (req.fechaFin().isBefore(req.fechaInicio())) {
            throw new IllegalArgumentException("fechaFin no puede ser menor que fechaInicio");
        }

        Mantenimiento m = new Mantenimiento();
        m.setTipo(req.tipo());
        m.setCondicionInicial(req.condicionInicial());
        m.setTecnologiaAsociada(req.tecnologiaAsociada());
        m.setTipoContrato(req.tipoContrato());
        m.setNovedades(req.novedades());
        m.setEstadoFinal(req.estadoFinal());
        m.setEvidencias(req.evidencias());
        m.setDescripcion(req.descripcion());
        m.setFechaInicio(req.fechaInicio());
        m.setFechaFin(req.fechaFin());
        m.setOrdenServicio(orden);
        m.setEquipo(equipo);

        Mantenimiento saved = mantenimientoRepository.save(m);

        return mapToDTO(saved);
    }

    @Transactional(readOnly = true)
    public List<MantenimientoDTO> listar() {
        return mantenimientoRepository.findAll().stream()
                .map(this::mapToDTO)
                .toList();
    }

    private MantenimientoDTO mapToDTO(Mantenimiento m) {
        return new MantenimientoDTO(
                m.getId(),
                m.getTipo(),
                m.getCondicionInicial(),
                m.getTecnologiaAsociada(),
                m.getTipoContrato(),
                m.getNovedades(),
                m.getEstadoFinal(),
                m.getEvidencias(),
                m.getDescripcion(),
                m.getFechaInicio(),
                m.getFechaFin(),
                m.getOrdenServicio().getId(),
                m.getEquipo().getId());
    }
}