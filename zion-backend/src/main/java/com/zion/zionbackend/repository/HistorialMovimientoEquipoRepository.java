package com.zion.zionbackend.repository;

import com.zion.zionbackend.entity.HistorialMovimientoEquipo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HistorialMovimientoEquipoRepository extends JpaRepository<HistorialMovimientoEquipo, Long> {
    List<HistorialMovimientoEquipo> findByEquipoId(Long equipoId);
}