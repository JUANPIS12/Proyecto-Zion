package com.zion.zionbackend.dto;

import java.time.LocalDateTime;
import java.util.List;

public record MantenimientoDTO(
        Long id,
        String tipo,
        String condicionInicial,
        String tecnologiaAsociada,
        String tipoContrato,
        String novedades,
        String estadoFinal,
        List<String> evidencias,
        String descripcion,
        LocalDateTime fechaInicio,
        LocalDateTime fechaFin,
        Long ordenServicioId,
        Long equipoId
) {}