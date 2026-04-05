package com.zion.zionbackend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.List;

public record MantenimientoCreateDTO(
        @NotBlank String tipo,
        String condicionInicial,
        String tecnologiaAsociada,
        String tipoContrato,
        String novedades,
        String estadoFinal,
        List<String> evidencias,
        String descripcion,
        @NotNull LocalDateTime fechaInicio,
        @NotNull LocalDateTime fechaFin,
        @NotNull Long ordenServicioId,
        @NotNull Long equipoId
) {}