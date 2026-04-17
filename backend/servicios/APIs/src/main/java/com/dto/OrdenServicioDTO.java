package com.zion.zionbackend.dto;

import java.time.LocalDateTime;

public record OrdenServicioDTO(
        Long id,
        String numeroOrden,
        LocalDateTime fechaCreacion,
        LocalDateTime fechaProgramada,
        String estado,
        Long sedeId,
        String sedeNombre,
        Long empresaId,
        String empresaNombre,
        String empresaDireccion,
        Long tecnicoId
) {}