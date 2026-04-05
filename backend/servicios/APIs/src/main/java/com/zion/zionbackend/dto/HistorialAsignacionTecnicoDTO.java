package com.zion.zionbackend.dto;

import java.time.LocalDateTime;

public record HistorialAsignacionTecnicoDTO(
        Long id,
        LocalDateTime fechaInicio,
        LocalDateTime fechaFin,
        Long tecnicoId,
        Long equipoId
) {
}