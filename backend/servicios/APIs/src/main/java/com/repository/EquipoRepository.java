package com.zion.zionbackend.repository;

import com.zion.zionbackend.entity.Equipo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EquipoRepository extends JpaRepository<Equipo, Long> {
    Optional<Equipo> findBySerial(String serial);
    boolean existsBySerial(String serial);
}