package com.zion.zionbackend.repository;

import com.zion.zionbackend.entity.Sede;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SedeRepository extends JpaRepository<Sede, Long> {
}