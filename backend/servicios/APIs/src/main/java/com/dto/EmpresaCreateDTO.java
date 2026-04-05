package com.zion.zionbackend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.Set;

public record EmpresaCreateDTO(
        @NotBlank String nombre,
        String ciudad,
        String direccion,
        String contacto,
        String estado,

        @NotNull Long sedeId,
        Set<Long> tecnologiaIds
) {}