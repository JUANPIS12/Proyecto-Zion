package com.zion.zionbackend.service;

import com.zion.zionbackend.dto.EmpresaCreateDTO;
import com.zion.zionbackend.dto.EmpresaDTO;
import com.zion.zionbackend.entity.Empresa;
import com.zion.zionbackend.entity.Sede;
import com.zion.zionbackend.entity.Tecnologia;
import com.zion.zionbackend.repository.EmpresaRepository;
import com.zion.zionbackend.repository.SedeRepository;
import com.zion.zionbackend.repository.TecnologiaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class EmpresaService {

        private final EmpresaRepository empresaRepository;
        private final SedeRepository sedeRepository;
        private final TecnologiaRepository tecnologiaRepository;

        public EmpresaService(EmpresaRepository empresaRepository,
                        SedeRepository sedeRepository,
                        TecnologiaRepository tecnologiaRepository) {
                this.empresaRepository = empresaRepository;
                this.sedeRepository = sedeRepository;
                this.tecnologiaRepository = tecnologiaRepository;
        }

        @Transactional
        public EmpresaDTO crear(EmpresaCreateDTO req) {
                Sede sede = sedeRepository.findById(req.sedeId())
                                .orElseThrow(() -> new IllegalArgumentException("Sede no existe: " + req.sedeId()));

                Empresa e = new Empresa();
                e.setNombre(req.nombre());
                e.setCiudad(req.ciudad());
                e.setDireccion(req.direccion());
                e.setContacto(req.contacto());
                e.setEstado(req.estado());
                e.setSede(sede);

                Set<Long> ids = req.tecnologiaIds() == null ? Collections.emptySet() : req.tecnologiaIds();
                Set<Tecnologia> tecnologias = ids.stream()
                                .map(id -> tecnologiaRepository.findById(id)
                                                .orElseThrow(() -> new IllegalArgumentException(
                                                                "Tecnologia no existe: " + id)))
                                .collect(Collectors.toSet());

                e.setTecnologias(tecnologias);

                Empresa saved = empresaRepository.save(e);

                return new EmpresaDTO(
                                saved.getId(),
                                saved.getNombre(),
                                saved.getSede().getId(),
                                saved.getTecnologias().stream().map(Tecnologia::getNombre).collect(Collectors.toSet()));
        }

        @Transactional(readOnly = true)
        public List<EmpresaDTO> listar() {
                return empresaRepository.findAll().stream()
                                .map(e -> new EmpresaDTO(
                                                e.getId(),
                                                e.getNombre(),
                                                e.getSede().getId(),
                                                e.getTecnologias().stream().map(Tecnologia::getNombre)
                                                                .collect(Collectors.toSet())))
                                .toList();
        }

        @Transactional(readOnly = true)
        public EmpresaDTO obtener(Long id) {
                Empresa e = empresaRepository.findById(id)
                                .orElseThrow(() -> new IllegalArgumentException("Empresa no encontrada: " + id));

                return new EmpresaDTO(
                                e.getId(),
                                e.getNombre(),
                                e.getSede().getId(),
                                e.getTecnologias().stream().map(Tecnologia::getNombre).collect(Collectors.toSet()));
        }

        @Transactional
        public EmpresaDTO actualizar(Long id, EmpresaCreateDTO req) {
                Empresa e = empresaRepository.findById(id)
                                .orElseThrow(() -> new IllegalArgumentException("Empresa no encontrada: " + id));

                Sede sede = sedeRepository.findById(req.sedeId())
                                .orElseThrow(() -> new IllegalArgumentException("Sede no existe: " + req.sedeId()));

                e.setNombre(req.nombre());
                e.setCiudad(req.ciudad());
                e.setDireccion(req.direccion());
                e.setContacto(req.contacto());
                e.setEstado(req.estado());
                e.setSede(sede);

                Set<Long> ids = req.tecnologiaIds() == null ? Collections.emptySet() : req.tecnologiaIds();
                Set<Tecnologia> tecnologias = ids.stream()
                                .map(tid -> tecnologiaRepository.findById(tid)
                                                .orElseThrow(() -> new IllegalArgumentException(
                                                                "Tecnologia no existe: " + tid)))
                                .collect(Collectors.toSet());

                e.setTecnologias(tecnologias);

                Empresa saved = empresaRepository.save(e);

                return new EmpresaDTO(
                                saved.getId(),
                                saved.getNombre(),
                                saved.getSede().getId(),
                                saved.getTecnologias().stream().map(Tecnologia::getNombre).collect(Collectors.toSet()));
        }

        @Transactional
        public void eliminar(Long id) {
                if (!empresaRepository.existsById(id)) {
                        throw new IllegalArgumentException("Empresa no encontrada: " + id);
                }
                empresaRepository.deleteById(id);
        }
}