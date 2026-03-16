package com.zion.zionbackend.controller;

import com.zion.zionbackend.dto.HistorialAsignacionTecnicoCreateDTO;
import com.zion.zionbackend.dto.HistorialAsignacionTecnicoDTO;
import com.zion.zionbackend.service.HistorialAsignacionTecnicoService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/historial-asignaciones")
public class HistorialAsignacionTecnicoController {

    private final HistorialAsignacionTecnicoService historialService;

    public HistorialAsignacionTecnicoController(HistorialAsignacionTecnicoService historialService) {
        this.historialService = historialService;
    }

    @PostMapping
    public HistorialAsignacionTecnicoDTO registrar(@RequestBody @Valid HistorialAsignacionTecnicoCreateDTO req) {
        return historialService.registrar(req);
    }

    @GetMapping("/equipo/{equipoId}")
    public List<HistorialAsignacionTecnicoDTO> listarPorEquipo(@PathVariable Long equipoId) {
        return historialService.listarPorEquipo(equipoId);
    }

    @GetMapping("/tecnico/{tecnicoId}")
    public List<HistorialAsignacionTecnicoDTO> listarPorTecnico(@PathVariable Long tecnicoId) {
        return historialService.listarPorTecnico(tecnicoId);
    }
}