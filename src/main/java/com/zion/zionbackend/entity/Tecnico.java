package com.zion.zionbackend.entity;

import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "tecnico")
public class Tecnico {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    private String documento;
    private String telefono;
    private String email;
    private String especialidad;
    private String rol;
    private String estado;

    @ManyToOne(optional = false)
    @JoinColumn(name = "sede_id", nullable = false)
    private Sede sede;

    // ✅ Many-to-Many: Técnico <-> Tecnología
    @ManyToMany
    @JoinTable(
            name = "tecnico_tecnologia",
            joinColumns = @JoinColumn(name = "tecnico_id"),
            inverseJoinColumns = @JoinColumn(name = "tecnologia_id")
    )
    private Set<Tecnologia> tecnologias = new HashSet<>();

    public Tecnico() {}

    public Long getId() { return id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getDocumento() { return documento; }
    public void setDocumento(String documento) { this.documento = documento; }

    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getEspecialidad() { return especialidad; }
    public void setEspecialidad(String especialidad) { this.especialidad = especialidad; }

    public String getRol() { return rol; }
    public void setRol(String rol) { this.rol = rol; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public Sede getSede() { return sede; }
    public void setSede(Sede sede) { this.sede = sede; }

    public Set<Tecnologia> getTecnologias() { return tecnologias; }
    public void setTecnologias(Set<Tecnologia> tecnologias) { this.tecnologias = tecnologias; }
}