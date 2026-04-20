package com.zion.zionbackend.service;

import com.zion.zionbackend.dto.TecnicoCreateDTO;
import com.zion.zionbackend.dto.TecnicoDTO;
import com.zion.zionbackend.entity.Sede;
import com.zion.zionbackend.entity.Tecnico;
import com.zion.zionbackend.entity.Tecnologia;
import com.zion.zionbackend.repository.SedeRepository;
import com.zion.zionbackend.repository.TecnicoRepository;
import com.zion.zionbackend.repository.TecnologiaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.zion.zionbackend.dto.TecnicoUpdateDTO;

import java.util.Set;
import java.util.stream.Collectors;

@Service
public class TecnicoService {

        private final TecnicoRepository tecnicoRepository;
        private final TecnologiaRepository tecnologiaRepository;
        private final SedeRepository sedeRepository;

        public TecnicoService(
                        TecnicoRepository tecnicoRepository,
                        TecnologiaRepository tecnologiaRepository,
                        SedeRepository sedeRepository) {

                this.tecnicoRepository = tecnicoRepository;
                this.tecnologiaRepository = tecnologiaRepository;
                this.sedeRepository = sedeRepository;
        }

        @Transactional
        public TecnicoDTO crear(TecnicoCreateDTO req) {

                // buscar sede
                Sede sede = sedeRepository.findById(req.sedeId())
                                .orElseThrow(() -> new RuntimeException("Sede no existe"));

                Tecnico tecnico = new Tecnico();
                tecnico.setNombre(req.nombre());
                tecnico.setDocumento(req.documento());
                tecnico.setTelefono(req.telefono());
                tecnico.setEmail(req.email());
                tecnico.setSede(sede);

                // buscar tecnologias
                if (req.tecnologiaIds() != null) {
                        Set<Tecnologia> tecnologias = req.tecnologiaIds().stream()
                                        .map(id -> tecnologiaRepository.findById(id)
                                                        .orElseThrow(() -> new RuntimeException(
                                                                        "Tecnologia no encontrada: " + id)))
                                        .collect(Collectors.toSet());

                        tecnico.setTecnologias(tecnologias);
                }

                Tecnico saved = tecnicoRepository.save(tecnico);

                return new TecnicoDTO(
                                saved.getId(),
                                saved.getNombre(),
                                saved.getSede() != null ? saved.getSede().getId() : null,
                                saved.getSede() != null ? saved.getSede().getNombre() : null,
                                saved.getTecnologias()
                                                .stream()
                                                .map(Tecnologia::getNombre)
                                                .collect(Collectors.toSet()));
        }

        @Transactional
        public TecnicoDTO actualizar(Long id, TecnicoUpdateDTO req) {
                Tecnico tecnico = tecnicoRepository.findById(id)
                        .orElseThrow(() -> new IllegalArgumentException("Técnico no encontrado: " + id));

                if (req.nombre() != null && !req.nombre().trim().isEmpty()) {
                        tecnico.setNombre(req.nombre().trim());
                }

                if (req.documento() != null) {
                        tecnico.setDocumento(req.documento());
                }

                if (req.telefono() != null) {
                        tecnico.setTelefono(req.telefono());
                }

                if (req.email() != null) {
                        tecnico.setEmail(req.email());
                }

                if (req.especialidad() != null) {
                        tecnico.setEspecialidad(req.especialidad());
                }

                if (req.rol() != null) {
                        tecnico.setRol(req.rol());
                }

                if (req.estado() != null) {
                        tecnico.setEstado(req.estado());
                }

                if (req.sedeId() != null) {
                        Sede sede = sedeRepository.findById(req.sedeId())
                                .orElseThrow(() -> new IllegalArgumentException("Sede no existe: " + req.sedeId()));
                        tecnico.setSede(sede);
                }

                if (req.tecnologiaIds() != null) {
                        Set<Tecnologia> tecnologias = req.tecnologiaIds().stream()
                                .map(tecnologiaId -> tecnologiaRepository.findById(tecnologiaId)
                                        .orElseThrow(() -> new IllegalArgumentException("Tecnología no existe: " + tecnologiaId)))
                                .collect(Collectors.toSet());

                        tecnico.setTecnologias(tecnologias);
                }

                Tecnico saved = tecnicoRepository.save(tecnico);

                return new TecnicoDTO(
                        saved.getId(),
                        saved.getNombre(),
                        saved.getSede() != null ? saved.getSede().getId() : null,
                        saved.getSede() != null ? saved.getSede().getNombre() : null,
                        saved.getTecnologias().stream()
                                .map(Tecnologia::getNombre)
                                .collect(Collectors.toSet())
                );
        }

        @Transactional
        public void eliminar(Long id) {
                Tecnico tecnico = tecnicoRepository.findById(id)
                        .orElseThrow(() -> new IllegalArgumentException("Técnico no encontrado: " + id));

                tecnicoRepository.delete(tecnico);
        }





        @Transactional(readOnly = true)
        public java.util.List<TecnicoDTO> listar() {
                return tecnicoRepository.findAll().stream()
                                .map(t -> new TecnicoDTO(
                                                t.getId(),
                                                t.getNombre(),
                                                t.getSede() != null ? t.getSede().getId() : null,
                                                t.getSede() != null ? t.getSede().getNombre() : null,
                                                t.getTecnologias().stream()
                                                                .map(Tecnologia::getNombre)
                                                                .collect(Collectors.toSet())))
                                .toList();
        }

        @Transactional(readOnly = true)
        public TecnicoDTO obtener(Long id) {
                Tecnico t = tecnicoRepository.findById(id)
                                .orElseThrow(() -> new IllegalArgumentException("Técnico no encontrado: " + id));

                return new TecnicoDTO(
                                t.getId(),
                                t.getNombre(),
                                t.getSede() != null ? t.getSede().getId() : null,
                                t.getSede() != null ? t.getSede().getNombre() : null,
                                t.getTecnologias().stream()
                                                .map(Tecnologia::getNombre)
                                                .collect(Collectors.toSet()));
        }


}