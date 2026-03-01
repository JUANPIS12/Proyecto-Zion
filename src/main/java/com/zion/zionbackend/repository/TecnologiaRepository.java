package com.zion.zionbackend.repository;

import com.zion.zionbackend.entity.Tecnologia;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TecnologiaRepository
        extends JpaRepository<Tecnologia, Long> {

    Optional<Tecnologia> findByNombreIgnoreCase(String nombre);

    boolean existsByNombreIgnoreCase(String nombre);
}