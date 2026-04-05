package com.zion.zionbackend.repository;

import com.zion.zionbackend.entity.Empresa;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmpresaRepository extends JpaRepository<Empresa, Long> {
}