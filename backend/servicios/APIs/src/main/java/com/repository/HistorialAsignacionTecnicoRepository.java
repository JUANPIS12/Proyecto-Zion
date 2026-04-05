package com.zion.zionbackend.repository;

import com.zion.zionbackend.entity.HistorialAsignacionTecnico;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HistorialAsignacionTecnicoRepository extends JpaRepository<HistorialAsignacionTecnico, Long> {
    List<HistorialAsignacionTecnico> findByEquipoId(Long equipoId);
    List<HistorialAsignacionTecnico> findByTecnicoId(Long tecnicoId);
}