package com.zion.zionbackend.dto;

import java.util.Set;

public record TecnicoDTO(
        Long id,
        String nombre,
        Long sedeId,
        String sedeNombre,
        Set<String> tecnologias
) {}