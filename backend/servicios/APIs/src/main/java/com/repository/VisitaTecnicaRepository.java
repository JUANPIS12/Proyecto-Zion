package com.zion.zionbackend.repository;

import com.zion.zionbackend.entity.VisitaTecnica;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface VisitaTecnicaRepository extends JpaRepository<VisitaTecnica, Long> {
    List<VisitaTecnica> findByOrdenServicioId(Long ordenServicioId);
    List<VisitaTecnica> findByTecnicoIdAndFechaInicioBetween(Long tecnicoId, LocalDateTime start, LocalDateTime end);
    List<VisitaTecnica> findByFechaInicioBetween(LocalDateTime start, LocalDateTime end);
}