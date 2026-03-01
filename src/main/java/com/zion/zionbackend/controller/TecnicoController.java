package com.zion.zionbackend.controller;

import com.zion.zionbackend.dto.TecnicoCreateDTO;
import com.zion.zionbackend.dto.TecnicoDTO;
import com.zion.zionbackend.service.TecnicoService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

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
}