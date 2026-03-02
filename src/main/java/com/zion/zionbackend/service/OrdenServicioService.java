package com.zion.zionbackend.service;

import com.zion.zionbackend.dto.OrdenServicioCreateDTO;
import com.zion.zionbackend.dto.OrdenServicioDTO;
import com.zion.zionbackend.entity.Empresa;
import com.zion.zionbackend.entity.OrdenServicio;
import com.zion.zionbackend.entity.Sede;
import com.zion.zionbackend.entity.Tecnico;
import com.zion.zionbackend.repository.EmpresaRepository;
import com.zion.zionbackend.repository.OrdenServicioRepository;
import com.zion.zionbackend.repository.SedeRepository;
import com.zion.zionbackend.repository.TecnicoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrdenServicioService {

    private final OrdenServicioRepository ordenServicioRepository;
    private final SedeRepository sedeRepository;
    private final EmpresaRepository empresaRepository;
    private final TecnicoRepository tecnicoRepository;

    public OrdenServicioService(OrdenServicioRepository ordenServicioRepository,
                                SedeRepository sedeRepository,
                                EmpresaRepository empresaRepository,
                                TecnicoRepository tecnicoRepository) {
        this.ordenServicioRepository = ordenServicioRepository;
        this.sedeRepository = sedeRepository;
        this.empresaRepository = empresaRepository;
        this.tecnicoRepository = tecnicoRepository;
    }

    @Transactional
    public OrdenServicioDTO crear(OrdenServicioCreateDTO req) {
        String numero = req.numeroOrden().trim();

        if (ordenServicioRepository.existsByNumeroOrden(numero)) {
            throw new IllegalArgumentException("Ya existe una orden con numeroOrden: " + numero);
        }

        Sede sede = sedeRepository.findById(req.sedeId())
                .orElseThrow(() -> new IllegalArgumentException("Sede no existe: " + req.sedeId()));

        Empresa empresa = empresaRepository.findById(req.empresaId())
                .orElseThrow(() -> new IllegalArgumentException("Empresa no existe: " + req.empresaId()));

        Tecnico tecnico = tecnicoRepository.findById(req.tecnicoId())
                .orElseThrow(() -> new IllegalArgumentException("Tecnico no existe: " + req.tecnicoId()));

        OrdenServicio os = new OrdenServicio();
        os.setNumeroOrden(numero);
        os.setFechaCreacion(LocalDateTime.now());
        os.setFechaProgramada(req.fechaProgramada());
        os.setEstado(req.estado());

        os.setSede(sede);
        os.setEmpresa(empresa);
        os.setTecnicoAsignado(tecnico);

        OrdenServicio saved = ordenServicioRepository.save(os);

        return new OrdenServicioDTO(
                saved.getId(),
                saved.getNumeroOrden(),
                saved.getFechaCreacion(),
                saved.getFechaProgramada(),
                saved.getEstado(),
                saved.getSede().getId(),
                saved.getEmpresa().getId(),
                saved.getTecnicoAsignado().getId()
        );
    }

    @Transactional(readOnly = true)
    public List<OrdenServicioDTO> listar() {
        return ordenServicioRepository.findAll().stream()
                .map(o -> new OrdenServicioDTO(
                        o.getId(),
                        o.getNumeroOrden(),
                        o.getFechaCreacion(),
                        o.getFechaProgramada(),
                        o.getEstado(),
                        o.getSede().getId(),
                        o.getEmpresa().getId(),
                        o.getTecnicoAsignado().getId()
                ))
                .toList();
    }

    @Transactional(readOnly = true)
    public OrdenServicioDTO obtener(Long id) {
        OrdenServicio o = ordenServicioRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Orden no encontrada: " + id));

        return new OrdenServicioDTO(
                o.getId(),
                o.getNumeroOrden(),
                o.getFechaCreacion(),
                o.getFechaProgramada(),
                o.getEstado(),
                o.getSede().getId(),
                o.getEmpresa().getId(),
                o.getTecnicoAsignado().getId()
        );
    }
}