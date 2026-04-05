package com.zion.zionbackend.dto;

public class LoginResponse {

    private String token;
    private String rol;
    private String username;
    private Boolean puedeCrearAdmin;

    public LoginResponse(String token, String rol, String username, Boolean puedeCrearAdmin) {
        this.token = token;
        this.rol = rol;
        this.username = username;
        this.puedeCrearAdmin = puedeCrearAdmin;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getRol() { return rol; }
    public void setRol(String rol) { this.rol = rol; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public Boolean getPuedeCrearAdmin() { return puedeCrearAdmin; }
    public void setPuedeCrearAdmin(Boolean puedeCrearAdmin) { this.puedeCrearAdmin = puedeCrearAdmin; }
}
