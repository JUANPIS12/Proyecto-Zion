package com.zion.zionbackend.service;

import com.zion.zionbackend.dto.TecnicoCreateDTO;
import com.zion.zionbackend.dto.TecnicoDTO;
import com.zion.zionbackend.entity.Sede;
import com.zion.zionbackend.entity.Tecnico;
import com.zion.zionbackend.entity.Tecnologia;
import com.zion.zionbackend.entity.Usuario;
import com.zion.zionbackend.repository.SedeRepository;
import com.zion.zionbackend.repository.TecnicoRepository;
import com.zion.zionbackend.repository.TecnologiaRepository;
import com.zion.zionbackend.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
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
        private final UsuarioRepository usuarioRepository;
        private final PasswordEncoder passwordEncoder;

        public TecnicoService(
                        TecnicoRepository tecnicoRepository,
                        TecnologiaRepository tecnologiaRepository,
                        SedeRepository sedeRepository,
                        UsuarioRepository usuarioRepository,
                        PasswordEncoder passwordEncoder) {

                this.tecnicoRepository = tecnicoRepository;
                this.tecnologiaRepository = tecnologiaRepository;
                this.sedeRepository = sedeRepository;
                this.usuarioRepository = usuarioRepository;
                this.passwordEncoder = passwordEncoder;
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

                // Guarda el username del usuario del sistema vinculado
                if (req.username() != null) {
                        tecnico.setUsername(req.username());
                }

                Tecnico saved = tecnicoRepository.save(tecnico);

                // Crear automáticamente el Usuario en la tabla usuario
                // si se proporcionó username y contraseña
                if (req.username() != null && !req.username().isBlank()
                                && req.password() != null && !req.password().isBlank()) {

                        if (usuarioRepository.existsByUsername(req.username())) {
                                throw new IllegalArgumentException(
                                        "Ya existe un usuario con el nombre: " + req.username());
                        }

                        Usuario nuevoUsuario = new Usuario();
                        nuevoUsuario.setUsername(req.username());
                        nuevoUsuario.setPassword(passwordEncoder.encode(req.password()));
                        nuevoUsuario.setRol("ROLE_TECNICO");
                        nuevoUsuario.setActivo(true);
                        nuevoUsuario.setPuedeCrearAdmin(false);
                        usuarioRepository.save(nuevoUsuario);
                }

                return new TecnicoDTO(
                                saved.getId(),
                                saved.getNombre(),
                                saved.getSede() != null ? saved.getSede().getId() : null,
                                saved.getSede() != null ? saved.getSede().getNombre() : null,
                                saved.getTecnologias()
                                                .stream()
                                                .map(Tecnologia::getNombre)
                                                .collect(Collectors.toSet()),
                                saved.getUsername());
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
                                .collect(Collectors.toSet()),
                        saved.getUsername()
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
                                                                .collect(Collectors.toSet()),
                                                t.getUsername()))
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
                                                .collect(Collectors.toSet()),
                                t.getUsername());
        }

        /**
         * Retorna el TecnicoDTO del t\u00e9cnico vinculado al username dado.
         * Retorna null si no existe ninguno (el controller responde 404).
         */
        @Transactional(readOnly = true)
        public TecnicoDTO obtenerPorUsername(String username) {
                return tecnicoRepository.findByUsername(username)
                        .map(t -> new TecnicoDTO(
                                t.getId(),
                                t.getNombre(),
                                t.getSede() != null ? t.getSede().getId() : null,
                                t.getSede() != null ? t.getSede().getNombre() : null,
                                t.getTecnologias().stream()
                                        .map(Tecnologia::getNombre)
                                        .collect(Collectors.toSet()),
                                t.getUsername()))
                        .orElse(null);
        }

}