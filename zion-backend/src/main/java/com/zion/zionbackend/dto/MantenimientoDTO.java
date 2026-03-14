package com.zion.zionbackend.dto;

import java.time.LocalDateTime;

public record MantenimientoDTO(
        Long id,
        String tipo,
        String descripcion,
        LocalDateTime fechaInicio,
        LocalDateTime fechaFin,
        Long ordenServicioId,
        Long equipoId
) {}