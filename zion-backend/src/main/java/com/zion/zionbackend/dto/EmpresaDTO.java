package com.zion.zionbackend.dto;

import java.util.Set;

public record EmpresaDTO(
        Long id,
        String nombre,
        Long sedeId,
        Set<String> tecnologias
) {}