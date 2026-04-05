package com.zion.zionbackend.controller;

import com.zion.zionbackend.dto.VisitaTecnicaCreateDTO;
import com.zion.zionbackend.dto.VisitaTecnicaDTO;
import com.zion.zionbackend.service.VisitaTecnicaService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/visitas")
public class VisitaTecnicaController {

    private final VisitaTecnicaService visitaService;

    public VisitaTecnicaController(VisitaTecnicaService visitaService) {
        this.visitaService = visitaService;
    }

    @PostMapping
    public VisitaTecnicaDTO crear(@RequestBody @Valid VisitaTecnicaCreateDTO req) {
        return visitaService.crear(req);
    }

    @GetMapping
    public List<VisitaTecnicaDTO> listar() {
        return visitaService.listar();
    }
}