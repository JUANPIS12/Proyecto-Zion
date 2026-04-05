package com.zion.zionbackend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "mantenimiento")
public class Mantenimiento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String tipo; // PREVENTIVO o CORRECTIVO

    @Column(name = "condicion_inicial", columnDefinition = "TEXT")
    private String condicionInicial;

    @Column(name = "tecnologia_asociada")
    private String tecnologiaAsociada;

    @Column(name = "tipo_contrato")
    private String tipoContrato;

    @Column(columnDefinition = "TEXT")
    private String novedades;

    @Column(name = "estado_final")
    private String estadoFinal;

    @ElementCollection
    @CollectionTable(name = "mantenimiento_evidencias", joinColumns = @JoinColumn(name = "mantenimiento_id"))
    @Column(name = "evidencia", columnDefinition = "TEXT")
    private java.util.List<String> evidencias;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Column(name = "fecha_inicio", nullable = false)
    private LocalDateTime fechaInicio;

    @Column(name = "fecha_fin", nullable = false)
    private LocalDateTime fechaFin;

    // pertenece a una orden
    @ManyToOne(optional = false)
    @JoinColumn(name = "orden_servicio_id", nullable = false)
    private OrdenServicio ordenServicio;

    //pertenece a un equipo
    @ManyToOne(optional = false)
    @JoinColumn(name = "equipo_id", nullable = false)
    private Equipo equipo;

    public Mantenimiento() {}

    public Long getId() { return id; }

    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }

    public String getCondicionInicial() { return condicionInicial; }
    public void setCondicionInicial(String condicionInicial) { this.condicionInicial = condicionInicial; }

    public String getTecnologiaAsociada() { return tecnologiaAsociada; }
    public void setTecnologiaAsociada(String tecnologiaAsociada) { this.tecnologiaAsociada = tecnologiaAsociada; }

    public String getTipoContrato() { return tipoContrato; }
    public void setTipoContrato(String tipoContrato) { this.tipoContrato = tipoContrato; }

    public String getNovedades() { return novedades; }
    public void setNovedades(String novedades) { this.novedades = novedades; }

    public String getEstadoFinal() { return estadoFinal; }
    public void setEstadoFinal(String estadoFinal) { this.estadoFinal = estadoFinal; }

    public java.util.List<String> getEvidencias() { return evidencias; }
    public void setEvidencias(java.util.List<String> evidencias) { this.evidencias = evidencias; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public LocalDateTime getFechaInicio() { return fechaInicio; }
    public void setFechaInicio(LocalDateTime fechaInicio) { this.fechaInicio = fechaInicio; }

    public LocalDateTime getFechaFin() { return fechaFin; }
    public void setFechaFin(LocalDateTime fechaFin) { this.fechaFin = fechaFin; }

    public OrdenServicio getOrdenServicio() { return ordenServicio; }
    public void setOrdenServicio(OrdenServicio ordenServicio) { this.ordenServicio = ordenServicio; }

    public Equipo getEquipo() { return equipo; }
    public void setEquipo(Equipo equipo) { this.equipo = equipo; }
}