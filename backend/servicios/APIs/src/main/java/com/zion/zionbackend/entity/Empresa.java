package com.zion.zionbackend.entity;

import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "empresa")
public class Empresa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    private String ciudad;
    private String direccion;
    private String contacto;
    private String estado;

    @ManyToOne(optional = false)
    @JoinColumn(name = "sede_id", nullable = false)
    private Sede sede;

    //Many-to-Many: Empresa <-> Tecnología
    @ManyToMany
    @JoinTable(
            name = "empresa_tecnologia",
            joinColumns = @JoinColumn(name = "empresa_id"),
            inverseJoinColumns = @JoinColumn(name = "tecnologia_id")
    )
    private Set<Tecnologia> tecnologias = new HashSet<>();

    public Empresa() {}

    public Long getId() { return id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getCiudad() { return ciudad; }
    public void setCiudad(String ciudad) { this.ciudad = ciudad; }

    public String getDireccion() { return direccion; }
    public void setDireccion(String direccion) { this.direccion = direccion; }

    public String getContacto() { return contacto; }
    public void setContacto(String contacto) { this.contacto = contacto; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public Sede getSede() { return sede; }
    public void setSede(Sede sede) { this.sede = sede; }

    public Set<Tecnologia> getTecnologias() { return tecnologias; }
    public void setTecnologias(Set<Tecnologia> tecnologias) { this.tecnologias = tecnologias; }
}