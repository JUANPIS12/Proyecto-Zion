package com.zion.zionbackend.dto;

import java.util.Set;

public record EmpresaUpdateDTO(
        String nombre,
        String ciudad,
        String direccion,
        String contacto,
        String estado,
        Long sedeId,
        Set<Long> tecnologiaIds
) {
}