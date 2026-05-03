package com.zion.zionbackend.service;

import com.zion.zionbackend.dto.HorasSemanalesDTO;
import com.zion.zionbackend.entity.Tecnico;
import com.zion.zionbackend.entity.VisitaTecnica;
import com.zion.zionbackend.repository.TecnicoRepository;
import com.zion.zionbackend.repository.VisitaTecnicaRepository;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReportesService {

    private final VisitaTecnicaRepository visitaRepository;
    private final TecnicoRepository tecnicoRepository;

    public ReportesService(VisitaTecnicaRepository visitaRepository, TecnicoRepository tecnicoRepository) {
        this.visitaRepository = visitaRepository;
        this.tecnicoRepository = tecnicoRepository;
    }

    public List<HorasSemanalesDTO> getHorasSemanalesPorTecnico() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startOfWeek = now.with(TemporalAdjusters.previousOrSame(java.time.DayOfWeek.MONDAY)).withHour(0).withMinute(0);
        LocalDateTime endOfWeek = startOfWeek.plusDays(7);

        List<Tecnico> tecnicos = tecnicoRepository.findAll();
        List<HorasSemanalesDTO> reportes = new ArrayList<>();

        for (Tecnico t : tecnicos) {
            List<VisitaTecnica> visitas = visitaRepository.findByTecnicoIdAndFechaInicioBetween(t.getId(), startOfWeek, endOfWeek);
            double totalHoras = calcularTotalHoras(visitas);
            reportes.add(new HorasSemanalesDTO(t.getNombre(), totalHoras, "Semana Actual"));
        }

        return reportes;
    }

    public List<HorasSemanalesDTO> getMisHorasSemanales(String username) {
        Tecnico t = tecnicoRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Técnico no encontrado para el usuario: " + username));

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startOfWeek = now.with(TemporalAdjusters.previousOrSame(java.time.DayOfWeek.MONDAY)).withHour(0).withMinute(0);
        LocalDateTime endOfWeek = startOfWeek.plusDays(7);

        List<VisitaTecnica> visitas = visitaRepository.findByTecnicoIdAndFechaInicioBetween(t.getId(), startOfWeek, endOfWeek);
        double totalHoras = calcularTotalHoras(visitas);

        List<HorasSemanalesDTO> res = new ArrayList<>();
        res.add(new HorasSemanalesDTO(t.getNombre(), totalHoras, "Semana Actual"));
        return res;
    }

    private double calcularTotalHoras(List<VisitaTecnica> visitas) {
        return visitas.stream()
                .filter(v -> v.getFechaInicio() != null && v.getFechaFin() != null)
                .mapToDouble(v -> {
                    Duration duration = Duration.between(v.getFechaInicio(), v.getFechaFin());
                    return duration.toMinutes() / 60.0;
                })
                .sum();
    }
}
