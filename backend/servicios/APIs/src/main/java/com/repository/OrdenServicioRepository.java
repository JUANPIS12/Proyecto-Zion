package com.zion.zionbackend.repository;

import com.zion.zionbackend.entity.OrdenServicio;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrdenServicioRepository extends JpaRepository<OrdenServicio, Long> {
    boolean existsByNumeroOrden(String numeroOrden);
}