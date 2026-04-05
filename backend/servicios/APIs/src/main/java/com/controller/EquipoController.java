package com.zion.zionbackend.controller;

import com.zion.zionbackend.dto.EquipoCreateDTO;
import com.zion.zionbackend.dto.EquipoDTO;
import com.zion.zionbackend.service.EquipoService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import com.zion.zionbackend.dto.EquipoUpdateDTO;

import java.util.List;

@RestController
@RequestMapping("/api/equipos")
public class EquipoController {

    private final EquipoService equipoService;

    public EquipoController(EquipoService equipoService) {
        this.equipoService = equipoService;
    }

    @PostMapping
    public EquipoDTO crear(@RequestBody @Valid EquipoCreateDTO req) {
        return equipoService.crear(req);
    }

    @GetMapping
    public List<EquipoDTO> listar() {
        return equipoService.listar();
    }

    @GetMapping("/{id}")
    public EquipoDTO obtener(@PathVariable Long id) {
        return equipoService.obtener(id);
    }

    @PatchMapping("/{id}")
    public EquipoDTO actualizar(@PathVariable Long id, @RequestBody EquipoUpdateDTO req) {
        return equipoService.actualizar(id, req);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        equipoService.eliminar(id);
    }
}