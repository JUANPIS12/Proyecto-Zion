package com.zion.zionbackend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "visita_tecnica")
public class VisitaTecnica {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "fecha_inicio", nullable = false)
    private LocalDateTime fechaInicio;

    @Column(name = "fecha_fin", nullable = false)
    private LocalDateTime fechaFin;

    private String observaciones;

    @Column(name = "ubicacion_inicio")
    private String ubicacionInicio;

    @Column(name = "ubicacion_fin")
    private String ubicacionFin;

    // 🔹 muchas visitas pertenecen a una orden
    @ManyToOne(optional = false)
    @JoinColumn(name = "orden_servicio_id", nullable = false)
    private OrdenServicio ordenServicio;

    // 🔹 muchas visitas las hace un técnico
    @ManyToOne(optional = false)
    @JoinColumn(name = "tecnico_id", nullable = false)
    private Tecnico tecnico;

    public VisitaTecnica() {}

    public Long getId() { return id; }

    public LocalDateTime getFechaInicio() { return fechaInicio; }
    public void setFechaInicio(LocalDateTime fechaInicio) { this.fechaInicio = fechaInicio; }

    public LocalDateTime getFechaFin() { return fechaFin; }
    public void setFechaFin(LocalDateTime fechaFin) { this.fechaFin = fechaFin; }

    public String getObservaciones() { return observaciones; }
    public void setObservaciones(String observaciones) { this.observaciones = observaciones; }

    public String getUbicacionInicio() { return ubicacionInicio; }
    public void setUbicacionInicio(String ubicacionInicio) { this.ubicacionInicio = ubicacionInicio; }

    public String getUbicacionFin() { return ubicacionFin; }
    public void setUbicacionFin(String ubicacionFin) { this.ubicacionFin = ubicacionFin; }

    public OrdenServicio getOrdenServicio() { return ordenServicio; }
    public void setOrdenServicio(OrdenServicio ordenServicio) { this.ordenServicio = ordenServicio; }

    public Tecnico getTecnico() { return tecnico; }
    public void setTecnico(Tecnico tecnico) { this.tecnico = tecnico; }
}