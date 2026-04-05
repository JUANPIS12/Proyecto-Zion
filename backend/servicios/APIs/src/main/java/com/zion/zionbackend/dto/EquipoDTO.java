package com.zion.zionbackend.dto;

public record EquipoDTO(
        Long id,
        String serial,
        String referencia,
        Long sedeId,
        Long empresaId,
        Long tecnologiaId,
        String estado
) {}