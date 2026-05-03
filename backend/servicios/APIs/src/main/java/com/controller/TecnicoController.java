package com.zion.zionbackend.controller;

import com.zion.zionbackend.dto.TecnicoCreateDTO;
import com.zion.zionbackend.dto.TecnicoDTO;
import com.zion.zionbackend.service.TecnicoService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.zion.zionbackend.dto.TecnicoUpdateDTO;

import java.security.Principal;

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

    /**
     * GET /api/tecnicos/mi-perfil
     * Retorna los datos del técnico correspondiente al usuario autenticado.
     * Si el usuario no tiene un técnico vinculado, retorna 404.
     */
    @GetMapping("/mi-perfil")
    public ResponseEntity<TecnicoDTO> miPerfil(Principal principal) {
        TecnicoDTO perfil = tecnicoService.obtenerPorUsername(principal.getName());
        if (perfil == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(perfil);
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