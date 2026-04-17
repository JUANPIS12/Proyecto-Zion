package com.zion.zionbackend.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

public record OrdenServicioCreateDTO(
        @NotNull LocalDateTime fechaProgramada,
        @NotBlank String estado,
        @NotNull Long sedeId,
        @NotNull Long empresaId,
        @NotNull Long tecnicoId
) {}