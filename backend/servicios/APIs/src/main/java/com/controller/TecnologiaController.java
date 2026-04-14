package com.controller;

import com.zion.zionbackend.dto.TecnologiaCreateDTO;
import com.zion.zionbackend.dto.TecnologiaDTO;
import com.zion.zionbackend.dto.TecnologiaUpdateDTO;
import com.zion.zionbackend.service.TecnologiaService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tecnologias")
public class TecnologiaController {

    private final TecnologiaService tecnologiaService;

    public TecnologiaController(TecnologiaService tecnologiaService) {
        this.tecnologiaService = tecnologiaService;
    }

    @PostMapping
    public TecnologiaDTO crear(@RequestBody @Valid TecnologiaCreateDTO req) {
        return tecnologiaService.crear(req);
    }

    @GetMapping
    public List<TecnologiaDTO> listar() {
        return tecnologiaService.listar();
    }

    @GetMapping("/{id}")
    public TecnologiaDTO obtener(@PathVariable Long id) {
        return tecnologiaService.obtenerPorId(id);
    }

    @PatchMapping("/{id}")
    public TecnologiaDTO actualizar(@PathVariable Long id, @RequestBody @Valid TecnologiaUpdateDTO req) {
        return tecnologiaService.actualizar(id, req);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        tecnologiaService.eliminar(id);
    }
}