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
                .orElseThrow(() -> new IllegalArgumentException("Empresa no existe: " + req.empresaId()));

        Tecnologia tecnologia = tecnologiaRepository.findById(req.tecnologiaId())
                .orElseThrow(() -> new IllegalArgumentException("Tecnologia no existe: " + req.tecnologiaId()));

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
                saved.getEstado()
        );
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
                        e.getEstado()
                ))
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
                e.getEstado()
        );
    }
}