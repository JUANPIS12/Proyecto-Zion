package com.zion.zionbackend.controller;

import com.zion.zionbackend.dto.OrdenServicioCreateDTO;
import com.zion.zionbackend.dto.OrdenServicioDTO;
import com.zion.zionbackend.dto.OrdenServicioDetalleDTO;
import com.zion.zionbackend.dto.OrdenServicioUpdateDTO;
import com.zion.zionbackend.service.OrdenServicioService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ordenes")
public class OrdenServicioController {

    private final OrdenServicioService ordenServicioService;

    public OrdenServicioController(OrdenServicioService ordenServicioService) {
        this.ordenServicioService = ordenServicioService;
    }

    @PostMapping
    public OrdenServicioDTO crear(@RequestBody @Valid OrdenServicioCreateDTO req) {
        return ordenServicioService.crear(req);
    }

    @GetMapping
    public List<OrdenServicioDTO> listar() {
        return ordenServicioService.listar();
    }

    @GetMapping("/{id}")
    public OrdenServicioDTO obtener(@PathVariable Long id) {
        return ordenServicioService.obtener(id);
    }

    @GetMapping("/{id}/detalle")
    public OrdenServicioDetalleDTO obtenerDetalle(@PathVariable Long id) {
        return ordenServicioService.obtenerDetalle(id);
    }

    @PatchMapping("/{id}")
    public OrdenServicioDTO actualizar(@PathVariable Long id, @RequestBody OrdenServicioUpdateDTO req) {
        return ordenServicioService.actualizar(id, req);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        ordenServicioService.eliminar(id);
    }
}