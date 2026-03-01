package com.zion.zionbackend.service;

//valida reglas (no duplicados)
//controla transacciones
// transforma Entity → DTO

import com.zion.zionbackend.dto.TecnologiaCreateDTO;
import com.zion.zionbackend.dto.TecnologiaDTO;
import com.zion.zionbackend.entity.Tecnologia;
import com.zion.zionbackend.repository.TecnologiaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TecnologiaService {

    private final TecnologiaRepository tecnologiaRepository;

    public TecnologiaService(TecnologiaRepository tecnologiaRepository) {
        this.tecnologiaRepository = tecnologiaRepository;
    }

    @Transactional
    public TecnologiaDTO crear(TecnologiaCreateDTO req) {
        String nombre = req.nombre().trim();

        if (tecnologiaRepository.existsByNombreIgnoreCase(nombre)) {
            throw new IllegalArgumentException("Ya existe una tecnología con el nombre: " + nombre);
        }

        Tecnologia t = new Tecnologia();
        t.setNombre(nombre);
        t.setDescripcion(req.descripcion());

        Tecnologia saved = tecnologiaRepository.save(t);
        return new TecnologiaDTO(saved.getId(), saved.getNombre(), saved.getDescripcion());
    }

    @Transactional(readOnly = true)
    public List<TecnologiaDTO> listar() {
        return tecnologiaRepository.findAll()
                .stream()
                .map(t -> new TecnologiaDTO(t.getId(), t.getNombre(), t.getDescripcion()))
                .toList();
    }

    @Transactional(readOnly = true)
    public TecnologiaDTO obtenerPorId(Long id) {
        Tecnologia t = tecnologiaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Tecnología no encontrada con id: " + id));

        return new TecnologiaDTO(t.getId(), t.getNombre(), t.getDescripcion());
    }
}