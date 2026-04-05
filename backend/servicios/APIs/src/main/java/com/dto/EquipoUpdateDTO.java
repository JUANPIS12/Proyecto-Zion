package com.zion.zionbackend.dto;

public record EquipoUpdateDTO(
        String serial,
        String referencia,
        String ciudadActual,
        String plantaActual,
        String areaActual,
        String lineaActual,
        String estado,
        Long sedeId,
        Long empresaId,
        Long tecnologiaId
) {
}