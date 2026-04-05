package com.zion.zionbackend.entity;

import jakarta.persistence.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "usuario")
public class Usuario implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String password;

    /**
     * Rol del usuario: "ROLE_ADMIN" o "ROLE_TECNICO"
     */
    @Column(nullable = false)
    private String rol;

    /**
     * Si el usuario puede operar en el sistema (activado/desactivado por el Admin)
     */
    @Column(nullable = false)
    private Boolean activo = true;

    /**
     * Permiso exclusivo para desarrolladores/super-admins.
     * Si es true, el usuario puede ver la ventana de crear nuevos Admin.
     * Este campo solo se cambia directamente en la base de datos por el equipo dev.
     */
    @Column(nullable = false)
    private Boolean puedeCrearAdmin = false;

    public Usuario() {}

    // ────────────── UserDetails Methods ──────────────

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(this.rol));
    }

    @Override
    public String getUsername() { return username; }

    @Override
    public String getPassword() { return password; }

    @Override
    public boolean isAccountNonExpired() { return true; }

    @Override
    public boolean isAccountNonLocked() { return true; }

    @Override
    public boolean isCredentialsNonExpired() { return true; }

    @Override
    public boolean isEnabled() { return activo != null && activo; }

    // ────────────── Getters & Setters ──────────────

    public Long getId() { return id; }

    public void setUsername(String username) { this.username = username; }

    public void setPassword(String password) { this.password = password; }

    public String getRol() { return rol; }
    public void setRol(String rol) { this.rol = rol; }

    public Boolean getActivo() { return activo; }
    public void setActivo(Boolean activo) { this.activo = activo; }

    public Boolean getPuedeCrearAdmin() { return puedeCrearAdmin; }
    public void setPuedeCrearAdmin(Boolean puedeCrearAdmin) { this.puedeCrearAdmin = puedeCrearAdmin; }
}
