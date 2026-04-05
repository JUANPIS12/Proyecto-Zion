package com.zion.zionbackend.dto;

import java.time.LocalDateTime;

public record OrdenServicioUpdateDTO(
        String numeroOrden,
        LocalDateTime fechaProgramada,
        String estado,
        Long sedeId,
        Long empresaId,
        Long tecnicoId
) {
}