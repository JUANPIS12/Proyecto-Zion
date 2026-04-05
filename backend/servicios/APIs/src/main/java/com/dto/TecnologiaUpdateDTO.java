package com.zion.zionbackend.dto;

import jakarta.validation.constraints.Size;

public record TecnologiaUpdateDTO(
        @Size(max = 80, message = "El nombre no puede superar 80 caracteres")
        String nombre,
        String descripcion
) {
}