package com.zion.zionbackend.controller;

import com.zion.zionbackend.dto.HistorialMovimientoEquipoCreateDTO;
import com.zion.zionbackend.dto.HistorialMovimientoEquipoDTO;
import com.zion.zionbackend.service.HistorialMovimientoEquipoService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/historial-movimientos")
public class HistorialMovimientoEquipoController {

    private final HistorialMovimientoEquipoService historialService;

    public HistorialMovimientoEquipoController(HistorialMovimientoEquipoService historialService) {
        this.historialService = historialService;
    }

    @PostMapping
    public HistorialMovimientoEquipoDTO registrar(@RequestBody @Valid HistorialMovimientoEquipoCreateDTO req) {
        return historialService.registrar(req);
    }

    @GetMapping("/equipo/{equipoId}")
    public List<HistorialMovimientoEquipoDTO> listarPorEquipo(@PathVariable Long equipoId) {
        return historialService.listarPorEquipo(equipoId);
    }
}