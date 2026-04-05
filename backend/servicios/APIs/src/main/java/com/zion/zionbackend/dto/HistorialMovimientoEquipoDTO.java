package com.zion.zionbackend.dto;

import java.time.LocalDateTime;

public record HistorialMovimientoEquipoDTO(
        Long id,
        LocalDateTime fechaCambio,
        String autorizadoPor,
        Long equipoId,
        Long sedeAnteriorId,
        Long sedeNuevaId,
        Long empresaAnteriorId,
        Long empresaNuevaId
) {
}