package com.zion.zionbackend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record HistorialMovimientoEquipoCreateDTO(
        @NotNull Long equipoId,
        Long sedeNuevaId,
        Long empresaNuevaId,
        @NotBlank String autorizadoPor
) {
}