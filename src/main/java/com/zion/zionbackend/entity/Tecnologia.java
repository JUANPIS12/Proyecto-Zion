package com.zion.zionbackend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "tecnologia")
public class Tecnologia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 80)
    private String nombre;

    private String descripcion;

    //Relación inversa con Empresa (se ignora en JSON para evitar ciclos)
    @JsonIgnore
    @ManyToMany(mappedBy = "tecnologias")
    private Set<Empresa> empresas = new HashSet<>();

    //Relación inversa con Tecnico (se ignora en JSON para evitar ciclos)
    @JsonIgnore
    @ManyToMany(mappedBy = "tecnologias")
    private Set<Tecnico> tecnicos = new HashSet<>();

    public Tecnologia() {}

    public Tecnologia(String nombre, String descripcion) {
        this.nombre = nombre;
        this.descripcion = descripcion;
    }

    public Long getId() { return id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public Set<Empresa> getEmpresas() { return empresas; }
    public void setEmpresas(Set<Empresa> empresas) { this.empresas = empresas; }

    public Set<Tecnico> getTecnicos() { return tecnicos; }
    public void setTecnicos(Set<Tecnico> tecnicos) { this.tecnicos = tecnicos; }
}