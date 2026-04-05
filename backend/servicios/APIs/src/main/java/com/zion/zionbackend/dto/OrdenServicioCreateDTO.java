package com.zion.zionbackend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record OrdenServicioCreateDTO(
        @NotBlank String numeroOrden,
        @NotNull LocalDateTime fechaProgramada,
        @NotBlank String estado,

        @NotNull Long sedeId,
        @NotNull Long empresaId,
        @NotNull Long tecnicoId
) {}