package com.zion.zionbackend.controller;

import com.zion.zionbackend.dto.EmpresaCreateDTO;
import com.zion.zionbackend.dto.EmpresaDTO;
import com.zion.zionbackend.service.EmpresaService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/empresas")
public class EmpresaController {

    private final EmpresaService empresaService;

    public EmpresaController(EmpresaService empresaService) {
        this.empresaService = empresaService;
    }

    @PostMapping
    public EmpresaDTO crear(@RequestBody @Valid EmpresaCreateDTO req) {
        return empresaService.crear(req);
    }

    @GetMapping
    public List<EmpresaDTO> listar() {
        return empresaService.listar();
    }

    @GetMapping("/{id}")
    public EmpresaDTO obtener(@PathVariable Long id) {
        return empresaService.obtener(id);
    }
}