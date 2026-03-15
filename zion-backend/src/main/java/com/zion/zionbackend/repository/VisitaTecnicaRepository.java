package com.zion.zionbackend.repository;

import com.zion.zionbackend.entity.VisitaTecnica;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VisitaTecnicaRepository extends JpaRepository<VisitaTecnica, Long> {
    List<VisitaTecnica> findByOrdenServicioId(Long ordenServicioId);
}