package com.zion.zionbackend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.Set;

public record TecnicoCreateDTO(

        @NotBlank
        String nombre,

        String documento,
        String telefono,
        String email,

        @NotNull
        Long sedeId,

        //aquí llegan las tecnologias
        Set<Long> tecnologiaIds
) {}