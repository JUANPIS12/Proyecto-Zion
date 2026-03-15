package com.zion.zionbackend.controller;

import com.zion.zionbackend.dto.TecnicoCreateDTO;
import com.zion.zionbackend.dto.TecnicoDTO;
import com.zion.zionbackend.service.TecnicoService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import com.zion.zionbackend.dto.TecnicoUpdateDTO;

@RestController
@RequestMapping("/api/tecnicos")
public class TecnicoController {

    private final TecnicoService tecnicoService;

    public TecnicoController(TecnicoService tecnicoService) {
        this.tecnicoService = tecnicoService;
    }

    @PostMapping
    public TecnicoDTO crear(@RequestBody @Valid TecnicoCreateDTO req) {
        return tecnicoService.crear(req);
    }

    @GetMapping
    public java.util.List<TecnicoDTO> listar() {
        return tecnicoService.listar();
    }

    @GetMapping("/{id}")
    public TecnicoDTO obtener(@PathVariable Long id) {
        return tecnicoService.obtener(id);
    }

    @PatchMapping("/{id}")
    public TecnicoDTO actualizar(@PathVariable Long id, @RequestBody TecnicoUpdateDTO req) {
        return tecnicoService.actualizar(id, req);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        tecnicoService.eliminar(id);
    }
}