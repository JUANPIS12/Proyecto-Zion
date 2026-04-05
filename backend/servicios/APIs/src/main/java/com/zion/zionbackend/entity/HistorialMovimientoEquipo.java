package com.zion.zionbackend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "historial_movimiento_equipo")
public class HistorialMovimientoEquipo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "fecha_cambio", nullable = false)
    private LocalDateTime fechaCambio;

    @Column(name = "autorizado_por", nullable = false)
    private String autorizadoPor;

    // Equipo al que pertenece el movimiento
    @ManyToOne(optional = false)
    @JoinColumn(name = "equipo_id", nullable = false)
    private Equipo equipo;

    // Sedes (pueden ser null si el cambio fue solo de empresa)
    @ManyToOne
    @JoinColumn(name = "sede_anterior_id")
    private Sede sedeAnterior;

    @ManyToOne
    @JoinColumn(name = "sede_nueva_id")
    private Sede sedeNueva;

    // Empresas (pueden ser null si el cambio fue solo de sede)
    @ManyToOne
    @JoinColumn(name = "empresa_anterior_id")
    private Empresa empresaAnterior;

    @ManyToOne
    @JoinColumn(name = "empresa_nueva_id")
    private Empresa empresaNueva;

    public HistorialMovimientoEquipo() {}

    public Long getId() { return id; }

    public LocalDateTime getFechaCambio() { return fechaCambio; }
    public void setFechaCambio(LocalDateTime fechaCambio) { this.fechaCambio = fechaCambio; }

    public String getAutorizadoPor() { return autorizadoPor; }
    public void setAutorizadoPor(String autorizadoPor) { this.autorizadoPor = autorizadoPor; }

    public Equipo getEquipo() { return equipo; }
    public void setEquipo(Equipo equipo) { this.equipo = equipo; }

    public Sede getSedeAnterior() { return sedeAnterior; }
    public void setSedeAnterior(Sede sedeAnterior) { this.sedeAnterior = sedeAnterior; }

    public Sede getSedeNueva() { return sedeNueva; }
    public void setSedeNueva(Sede sedeNueva) { this.sedeNueva = sedeNueva; }

    public Empresa getEmpresaAnterior() { return empresaAnterior; }
    public void setEmpresaAnterior(Empresa empresaAnterior) { this.empresaAnterior = empresaAnterior; }

    public Empresa getEmpresaNueva() { return empresaNueva; }
    public void setEmpresaNueva(Empresa empresaNueva) { this.empresaNueva = empresaNueva; }
}