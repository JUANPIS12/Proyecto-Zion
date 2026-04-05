package com.zion.zionbackend.dto;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record VisitaTecnicaCreateDTO(
        @NotNull LocalDateTime fechaInicio,
        @NotNull LocalDateTime fechaFin,
        String observaciones,
        String ubicacionInicio,
        String ubicacionFin,
        @NotNull Long ordenServicioId,
        @NotNull Long tecnicoId
) {}