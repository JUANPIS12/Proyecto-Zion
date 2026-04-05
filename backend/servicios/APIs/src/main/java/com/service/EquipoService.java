package com.zion.zionbackend.service;

import com.zion.zionbackend.dto.EquipoCreateDTO;
import com.zion.zionbackend.dto.EquipoDTO;
import com.zion.zionbackend.entity.Empresa;
import com.zion.zionbackend.entity.Equipo;
import com.zion.zionbackend.entity.Sede;
import com.zion.zionbackend.entity.Tecnologia;
import com.zion.zionbackend.repository.EmpresaRepository;
import com.zion.zionbackend.repository.EquipoRepository;
import com.zion.zionbackend.repository.SedeRepository;
import com.zion.zionbackend.repository.TecnologiaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.zion.zionbackend.dto.EquipoUpdateDTO;

import java.util.List;

@Service
public class EquipoService {

        private final EquipoRepository equipoRepository;
        private final SedeRepository sedeRepository;
        private final EmpresaRepository empresaRepository;
        private final TecnologiaRepository tecnologiaRepository;

        public EquipoService(EquipoRepository equipoRepository,
                        SedeRepository sedeRepository,
                        EmpresaRepository empresaRepository,
                        TecnologiaRepository tecnologiaRepository) {
                this.equipoRepository = equipoRepository;
                this.sedeRepository = sedeRepository;
                this.empresaRepository = empresaRepository;
                this.tecnologiaRepository = tecnologiaRepository;
        }

        @Transactional
        public EquipoDTO crear(EquipoCreateDTO req) {
                String serial = req.serial().trim();

                if (equipoRepository.existsBySerial(serial)) {
                        throw new IllegalArgumentException("Ya existe un equipo con serial: " + serial);
                }

                Sede sede = sedeRepository.findById(req.sedeId())
                                .orElseThrow(() -> new IllegalArgumentException("Sede no existe: " + req.sedeId()));

                Empresa empresa = empresaRepository.findById(req.empresaId())
                                .orElseThrow(() -> new IllegalArgumentException(
                                                "Empresa no existe: " + req.empresaId()));

                Tecnologia tecnologia = tecnologiaRepository.findById(req.tecnologiaId())
                                .orElseThrow(() -> new IllegalArgumentException(
                                                "Tecnologia no existe: " + req.tecnologiaId()));

                Equipo e = new Equipo();
                e.setSerial(serial);
                e.setReferencia(req.referencia());
                e.setCiudadActual(req.ciudadActual());
                e.setPlantaActual(req.plantaActual());
                e.setAreaActual(req.areaActual());
                e.setLineaActual(req.lineaActual());
                e.setEstado(req.estado());

                e.setSede(sede);
                e.setEmpresa(empresa);
                e.setTecnologia(tecnologia);

                Equipo saved = equipoRepository.save(e);

                return new EquipoDTO(
                                saved.getId(),
                                saved.getSerial(),
                                saved.getReferencia(),
                                saved.getSede().getId(),
                                saved.getEmpresa().getId(),
                                saved.getTecnologia().getId(),
                                saved.getEstado());
        }

        @Transactional(readOnly = true)
        public List<EquipoDTO> listar() {
                return equipoRepository.findAll().stream()
                                .map(e -> new EquipoDTO(
                                                e.getId(),
                                                e.getSerial(),
                                                e.getReferencia(),
                                                e.getSede().getId(),
                                                e.getEmpresa().getId(),
                                                e.getTecnologia().getId(),
                                                e.getEstado()))
                                .toList();
        }

        @Transactional(readOnly = true)
        public EquipoDTO obtener(Long id) {
                Equipo e = equipoRepository.findById(id)
                                .orElseThrow(() -> new IllegalArgumentException("Equipo no encontrado: " + id));

                return new EquipoDTO(
                                e.getId(),
                                e.getSerial(),
                                e.getReferencia(),
                                e.getSede().getId(),
                                e.getEmpresa().getId(),
                                e.getTecnologia().getId(),
                                e.getEstado());
        }


        @Transactional
        public EquipoDTO actualizar(Long id, EquipoUpdateDTO req) {
                Equipo equipo = equipoRepository.findById(id)
                        .orElseThrow(() -> new IllegalArgumentException("Equipo no encontrado: " + id));

                if (req.serial() != null && !req.serial().trim().isEmpty()) {
                        String nuevoSerial = req.serial().trim();

                        if (!nuevoSerial.equals(equipo.getSerial()) && equipoRepository.existsBySerial(nuevoSerial)) {
                                throw new IllegalArgumentException("Ya existe un equipo con serial: " + nuevoSerial);
                        }

                        equipo.setSerial(nuevoSerial);
                }

                if (req.referencia() != null) {
                        equipo.setReferencia(req.referencia());
                }

                if (req.ciudadActual() != null) {
                        equipo.setCiudadActual(req.ciudadActual());
                }

                if (req.plantaActual() != null) {
                        equipo.setPlantaActual(req.plantaActual());
                }

                if (req.areaActual() != null) {
                        equipo.setAreaActual(req.areaActual());
                }

                if (req.lineaActual() != null) {
                        equipo.setLineaActual(req.lineaActual());
                }

                if (req.estado() != null) {
                        equipo.setEstado(req.estado());
                }

                if (req.sedeId() != null) {
                        Sede sede = sedeRepository.findById(req.sedeId())
                                .orElseThrow(() -> new IllegalArgumentException("Sede no existe: " + req.sedeId()));
                        equipo.setSede(sede);
                }

                if (req.empresaId() != null) {
                        Empresa empresa = empresaRepository.findById(req.empresaId())
                                .orElseThrow(() -> new IllegalArgumentException("Empresa no existe: " + req.empresaId()));
                        equipo.setEmpresa(empresa);
                }

                if (req.tecnologiaId() != null) {
                        Tecnologia tecnologia = tecnologiaRepository.findById(req.tecnologiaId())
                                .orElseThrow(() -> new IllegalArgumentException("Tecnologia no existe: " + req.tecnologiaId()));
                        equipo.setTecnologia(tecnologia);
                }

                Equipo saved = equipoRepository.save(equipo);

                return new EquipoDTO(
                        saved.getId(),
                        saved.getSerial(),
                        saved.getReferencia(),
                        saved.getSede().getId(),
                        saved.getEmpresa().getId(),
                        saved.getTecnologia().getId(),
                        saved.getEstado()
                );
        }

        @Transactional
        public void eliminar(Long id) {
                Equipo equipo = equipoRepository.findById(id)
                        .orElseThrow(() -> new IllegalArgumentException("Equipo no encontrado: " + id));

                equipoRepository.delete(equipo);
        }
}