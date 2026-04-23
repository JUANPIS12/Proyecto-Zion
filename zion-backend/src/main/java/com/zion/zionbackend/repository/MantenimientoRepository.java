package com.zion.zionbackend.repository;

import com.zion.zionbackend.entity.Mantenimiento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MantenimientoRepository extends JpaRepository<Mantenimiento, Long> {
    List<Mantenimiento> findByOrdenServicioId(Long ordenServicioId);
}