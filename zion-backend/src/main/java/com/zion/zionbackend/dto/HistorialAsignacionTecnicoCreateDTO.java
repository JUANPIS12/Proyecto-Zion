package com.zion.zionbackend.dto;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record HistorialAsignacionTecnicoCreateDTO(
        @NotNull Long tecnicoId,
        @NotNull Long equipoId,
        @NotNull LocalDateTime fechaInicio,
        LocalDateTime fechaFin
) {
}