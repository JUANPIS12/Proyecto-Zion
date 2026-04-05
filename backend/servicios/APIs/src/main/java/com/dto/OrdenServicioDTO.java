package com.zion.zionbackend.dto;

import java.time.LocalDateTime;

public record OrdenServicioDTO(
        Long id,
        String numeroOrden,
        LocalDateTime fechaCreacion,
        LocalDateTime fechaProgramada,
        String estado,
        Long sedeId,
        Long empresaId,
        Long tecnicoId
) {}