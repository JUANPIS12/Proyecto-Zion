package com.zion.zionbackend.dto;

import java.time.LocalDateTime;

public record VisitaTecnicaDTO(
        Long id,
        LocalDateTime fechaInicio,
        LocalDateTime fechaFin,
        String observaciones,
        String ubicacionInicio,
        String ubicacionFin,
        Long ordenServicioId,
        Long tecnicoId
) {}