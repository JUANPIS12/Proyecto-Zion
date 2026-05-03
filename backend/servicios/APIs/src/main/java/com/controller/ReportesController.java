package com.zion.zionbackend.controller;

import com.zion.zionbackend.dto.HorasSemanalesDTO;
import com.zion.zionbackend.service.ReportesService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/reportes")
public class ReportesController {

    private final ReportesService reportesService;

    public ReportesController(ReportesService reportesService) {
        this.reportesService = reportesService;
    }

    @GetMapping("/horas-tecnicos")
    public ResponseEntity<List<HorasSemanalesDTO>> getHorasTecnicos() {
        return ResponseEntity.ok(reportesService.getHorasSemanalesPorTecnico());
    }

    @GetMapping("/mis-horas")
    public ResponseEntity<List<HorasSemanalesDTO>> getMisHoras(Principal principal) {
        return ResponseEntity.ok(reportesService.getMisHorasSemanales(principal.getName()));
    }
}
