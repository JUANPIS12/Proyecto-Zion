package com.zion.zionbackend.controller;

import com.zion.zionbackend.dto.MantenimientoCreateDTO;
import com.zion.zionbackend.dto.MantenimientoDTO;
import com.zion.zionbackend.service.MantenimientoService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mantenimientos")
public class MantenimientoController {

    private final MantenimientoService mantenimientoService;

    public MantenimientoController(MantenimientoService mantenimientoService) {
        this.mantenimientoService = mantenimientoService;
    }

    @PostMapping
    public MantenimientoDTO crear(@RequestBody @Valid MantenimientoCreateDTO req) {
        return mantenimientoService.crear(req);
    }

    @GetMapping
    public List<MantenimientoDTO> listar() {
        return mantenimientoService.listar();
    }
}