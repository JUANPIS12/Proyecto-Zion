package com.zion.zionbackend.dto;

import java.util.Set;

public record TecnicoDTO(
        Long id,
        String nombre,
        Set<String> tecnologias
) {}