package com.zion.zionbackend.dto;

import java.util.Set;

public record TecnicoUpdateDTO(
        String nombre,
        String documento,
        String telefono,
        String email,
        String especialidad,
        String rol,
        String estado,
        Long sedeId,
        Set<Long> tecnologiaIds
) {
}