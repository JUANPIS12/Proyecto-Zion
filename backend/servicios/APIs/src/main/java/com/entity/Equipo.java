package com.zion.zionbackend.entity;

import jakarta.persistence.*;

@Entity
@Table(
        name = "equipo",
        uniqueConstraints = @UniqueConstraint(name = "uq_equipo_serial", columnNames = "serial")
)
public class Equipo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String serial;

    private String referencia;

    private String ciudadActual;
    private String plantaActual;
    private String areaActual;
    private String lineaActual;
    private String estado;

    @ManyToOne(optional = false)
    @JoinColumn(name = "sede_id", nullable = false)
    private Sede sede;

    @ManyToOne(optional = false)
    @JoinColumn(name = "empresa_id", nullable = false)
    private Empresa empresa;

    @ManyToOne(optional = false)
    @JoinColumn(name = "tecnologia_id", nullable = false)
    private Tecnologia tecnologia;

    public Equipo() {}

    public Long getId() { return id; }

    public String getSerial() { return serial; }
    public void setSerial(String serial) { this.serial = serial; }

    public String getReferencia() { return referencia; }
    public void setReferencia(String referencia) { this.referencia = referencia; }

    public String getCiudadActual() { return ciudadActual; }
    public void setCiudadActual(String ciudadActual) { this.ciudadActual = ciudadActual; }

    public String getPlantaActual() { return plantaActual; }
    public void setPlantaActual(String plantaActual) { this.plantaActual = plantaActual; }

    public String getAreaActual() { return areaActual; }
    public void setAreaActual(String areaActual) { this.areaActual = areaActual; }

    public String getLineaActual() { return lineaActual; }
    public void setLineaActual(String lineaActual) { this.lineaActual = lineaActual; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public Sede getSede() { return sede; }
    public void setSede(Sede sede) { this.sede = sede; }

    public Empresa getEmpresa() { return empresa; }
    public void setEmpresa(Empresa empresa) { this.empresa = empresa; }

    public Tecnologia getTecnologia() { return tecnologia; }
    public void setTecnologia(Tecnologia tecnologia) { this.tecnologia = tecnologia; }
}