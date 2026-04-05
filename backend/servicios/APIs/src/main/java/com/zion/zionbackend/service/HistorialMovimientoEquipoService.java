package com.zion.zionbackend.service;

import com.zion.zionbackend.dto.HistorialMovimientoEquipoCreateDTO;
import com.zion.zionbackend.dto.HistorialMovimientoEquipoDTO;
import com.zion.zionbackend.entity.Empresa;
import com.zion.zionbackend.entity.Equipo;
import com.zion.zionbackend.entity.HistorialMovimientoEquipo;
import com.zion.zionbackend.entity.Sede;
import com.zion.zionbackend.repository.EmpresaRepository;
import com.zion.zionbackend.repository.EquipoRepository;
import com.zion.zionbackend.repository.HistorialMovimientoEquipoRepository;
import com.zion.zionbackend.repository.SedeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class HistorialMovimientoEquipoService {

    private final HistorialMovimientoEquipoRepository historialRepository;
    private final EquipoRepository equipoRepository;
    private final SedeRepository sedeRepository;
    private final EmpresaRepository empresaRepository;

    public HistorialMovimientoEquipoService(HistorialMovimientoEquipoRepository historialRepository,
                                            EquipoRepository equipoRepository,
                                            SedeRepository sedeRepository,
                                            EmpresaRepository empresaRepository) {
        this.historialRepository = historialRepository;
        this.equipoRepository = equipoRepository;
        this.sedeRepository = sedeRepository;
        this.empresaRepository = empresaRepository;
    }

    @Transactional
    public HistorialMovimientoEquipoDTO registrar(HistorialMovimientoEquipoCreateDTO req) {
        Equipo equipo = equipoRepository.findById(req.equipoId())
                .orElseThrow(() -> new IllegalArgumentException("Equipo no existe: " + req.equipoId()));

        Sede sedeAnterior = equipo.getSede();
        Empresa empresaAnterior = equipo.getEmpresa();

        Sede sedeNueva = null;
        Empresa empresaNueva = null;

        if (req.sedeNuevaId() != null) {
            sedeNueva = sedeRepository.findById(req.sedeNuevaId())
                    .orElseThrow(() -> new IllegalArgumentException("Sede nueva no existe: " + req.sedeNuevaId()));
        }

        if (req.empresaNuevaId() != null) {
            empresaNueva = empresaRepository.findById(req.empresaNuevaId())
                    .orElseThrow(() -> new IllegalArgumentException("Empresa nueva no existe: " + req.empresaNuevaId()));
        }

        if (sedeNueva == null && empresaNueva == null) {
            throw new IllegalArgumentException("Debes indicar al menos una sedeNuevaId o empresaNuevaId");
        }

        HistorialMovimientoEquipo historial = new HistorialMovimientoEquipo();
        historial.setFechaCambio(LocalDateTime.now());
        historial.setAutorizadoPor(req.autorizadoPor());
        historial.setEquipo(equipo);
        historial.setSedeAnterior(sedeAnterior);
        historial.setSedeNueva(sedeNueva);
        historial.setEmpresaAnterior(empresaAnterior);
        historial.setEmpresaNueva(empresaNueva);

        HistorialMovimientoEquipo saved = historialRepository.save(historial);

        if (sedeNueva != null) {
            equipo.setSede(sedeNueva);
        }
        if (empresaNueva != null) {
            equipo.setEmpresa(empresaNueva);
        }

        equipoRepository.save(equipo);

        return new HistorialMovimientoEquipoDTO(
                saved.getId(),
                saved.getFechaCambio(),
                saved.getAutorizadoPor(),
                saved.getEquipo().getId(),
                saved.getSedeAnterior() != null ? saved.getSedeAnterior().getId() : null,
                saved.getSedeNueva() != null ? saved.getSedeNueva().getId() : null,
                saved.getEmpresaAnterior() != null ? saved.getEmpresaAnterior().getId() : null,
                saved.getEmpresaNueva() != null ? saved.getEmpresaNueva().getId() : null
        );
    }

    @Transactional(readOnly = true)
    public List<HistorialMovimientoEquipoDTO> listarPorEquipo(Long equipoId) {
        return historialRepository.findByEquipoId(equipoId).stream()
                .map(h -> new HistorialMovimientoEquipoDTO(
                        h.getId(),
                        h.getFechaCambio(),
                        h.getAutorizadoPor(),
                        h.getEquipo().getId(),
                        h.getSedeAnterior() != null ? h.getSedeAnterior().getId() : null,
                        h.getSedeNueva() != null ? h.getSedeNueva().getId() : null,
                        h.getEmpresaAnterior() != null ? h.getEmpresaAnterior().getId() : null,
                        h.getEmpresaNueva() != null ? h.getEmpresaNueva().getId() : null
                ))
                .toList();
    }
}