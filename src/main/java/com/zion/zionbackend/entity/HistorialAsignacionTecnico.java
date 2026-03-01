package com.zion.zionbackend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "historial_asignacion_tecnico")
public class HistorialAsignacionTecnico {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "fecha_inicio", nullable = false)
    private LocalDateTime fechaInicio;

    @Column(name = "fecha_fin")
    private LocalDateTime fechaFin;

    @ManyToOne(optional = false)
    @JoinColumn(name = "tecnico_id", nullable = false)
    private Tecnico tecnico;

    @ManyToOne(optional = false)
    @JoinColumn(name = "equipo_id", nullable = false)
    private Equipo equipo;

    public HistorialAsignacionTecnico() {}

    public Long getId() { return id; }

    public LocalDateTime getFechaInicio() { return fechaInicio; }
    public void setFechaInicio(LocalDateTime fechaInicio) { this.fechaInicio = fechaInicio; }

    public LocalDateTime getFechaFin() { return fechaFin; }
    public void setFechaFin(LocalDateTime fechaFin) { this.fechaFin = fechaFin; }

    public Tecnico getTecnico() { return tecnico; }
    public void setTecnico(Tecnico tecnico) { this.tecnico = tecnico; }

    public Equipo getEquipo() { return equipo; }
    public void setEquipo(Equipo equipo) { this.equipo = equipo; }
}