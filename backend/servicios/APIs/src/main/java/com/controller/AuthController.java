package com.zion.zionbackend.controller;

import com.zion.zionbackend.dto.CreateUserRequest;
import com.zion.zionbackend.dto.LoginRequest;
import com.zion.zionbackend.dto.LoginResponse;
import com.zion.zionbackend.entity.Usuario;
import com.zion.zionbackend.repository.UsuarioRepository;
import com.zion.zionbackend.security.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Map;

@RestController
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(AuthenticationManager authenticationManager,
                          JwtUtil jwtUtil,
                          UsuarioRepository usuarioRepository,
                          PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * POST /auth/login
     * Ruta pública. Recibe username + password y retorna JWT si son válidos.
     */
    @PostMapping("/auth/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getUsername(), request.getPassword()
                    )
            );
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Usuario o contraseña incorrectos"));
        }

        // Cargar el usuario autenticado
        Usuario usuario = usuarioRepository.findByUsername(request.getUsername())
                .orElseThrow();

        // Generar token JWT con el rol incluido
        String token = jwtUtil.generateToken(usuario, usuario.getRol());

        return ResponseEntity.ok(new LoginResponse(
                token,
                usuario.getRol(),
                usuario.getUsername(),
                usuario.getPuedeCrearAdmin()
        ));
    }

    /**
     * POST /admin/usuarios
     * Solo ROLE_ADMIN. Crea un nuevo usuario (técnico o admin según el rol enviado).
     * Si se intenta crear un ROLE_ADMIN, se verifica que el admin logueado tenga puedeCrearAdmin = true.
     */
    @PostMapping("/admin/usuarios")
    public ResponseEntity<?> crearUsuario(@Valid @RequestBody CreateUserRequest request,
                                          Principal principal) {

        // Verificar si ya existe el username
        if (usuarioRepository.existsByUsername(request.getUsername())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "El nombre de usuario ya está en uso"));
        }

        // Validar rol permitido
        if (!request.getRol().equals("ROLE_ADMIN") && 
            !request.getRol().equals("ROLE_TECNICO") && 
            !request.getRol().equals("ROLE_COORDINADOR")) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Rol inválido. Use ROLE_ADMIN, ROLE_COORDINADOR o ROLE_TECNICO"));
        }

        // Si se quiere crear un ROLE_ADMIN, verificar que el admin actual tenga el permiso especial
        if (request.getRol().equals("ROLE_ADMIN")) {
            Usuario adminActual = usuarioRepository.findByUsername(principal.getName())
                    .orElseThrow();
            if (!Boolean.TRUE.equals(adminActual.getPuedeCrearAdmin())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "No tienes permiso para crear usuarios Administrador"));
            }
        }

        // Crear el nuevo usuario
        Usuario nuevoUsuario = new Usuario();
        nuevoUsuario.setUsername(request.getUsername());
        nuevoUsuario.setPassword(passwordEncoder.encode(request.getPassword()));
        nuevoUsuario.setRol(request.getRol());
        nuevoUsuario.setActivo(true);
        nuevoUsuario.setPuedeCrearAdmin(false); // Siempre false — solo devs cambian esto en BD

        usuarioRepository.save(nuevoUsuario);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of(
                        "mensaje", "Usuario creado exitosamente",
                        "username", nuevoUsuario.getUsername(),
                        "rol", nuevoUsuario.getRol()
                ));
    }

    /**
     * GET /admin/usuarios
     * Solo ROLE_ADMIN. Lista todos los usuarios del sistema.
     */
    @GetMapping("/admin/usuarios")
    public ResponseEntity<?> listarUsuarios() {
        var usuarios = usuarioRepository.findAll().stream()
                .map(u -> Map.of(
                        "id", u.getId(),
                        "username", u.getUsername(),
                        "rol", u.getRol(),
                        "activo", u.getActivo()
                ))
                .toList();
        return ResponseEntity.ok(usuarios);
    }

    /**
     * PUT /admin/usuarios/{id}/estado
     * Solo ROLE_ADMIN. Activa o desactiva un usuario.
     */
    @PutMapping("/admin/usuarios/{id}/estado")
    public ResponseEntity<?> cambiarEstado(@PathVariable Long id,
                                           @RequestBody Map<String, Boolean> body) {
        return usuarioRepository.findById(id)
                .map(usuario -> {
                    usuario.setActivo(body.get("activo"));
                    usuarioRepository.save(usuario);
                    return ResponseEntity.ok(Map.of(
                            "mensaje", "Estado actualizado",
                            "activo", usuario.getActivo()
                    ));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
