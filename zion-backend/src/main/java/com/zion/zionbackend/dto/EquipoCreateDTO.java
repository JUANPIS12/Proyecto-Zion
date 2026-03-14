package com.zion.zionbackend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record EquipoCreateDTO(
        @NotBlank String serial,
        String referencia,
        String ciudadActual,
        String plantaActual,
        String areaActual,
        String lineaActual,
        String estado,

        @NotNull Long sedeId,
        @NotNull Long empresaId,
        @NotNull Long tecnologiaId
) {}