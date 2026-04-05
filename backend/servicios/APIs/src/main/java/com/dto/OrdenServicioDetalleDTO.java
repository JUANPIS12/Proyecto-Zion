package com.zion.zionbackend.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

public record OrdenServicioDetalleDTO(
        Long id,
        String numeroOrden,
        LocalDateTime fechaCreacion,
        LocalDateTime fechaProgramada,
        String estado,

        Long sedeId,

        Long empresaId,
        String empresaNombre,

        Long tecnicoId,
        String tecnicoNombre,
        Set<String> tecnicoTecnologias,

        List<MantenimientoDTO> mantenimientos,
        List<VisitaTecnicaDTO> visitas
) {
}