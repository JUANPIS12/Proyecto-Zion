package com;

import com.zion.zionbackend.entity.Usuario;
import com.zion.zionbackend.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

@SpringBootApplication
public class ZionBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(ZionBackendApplication.class, args);
    }

    @Bean
    public CommandLineRunner fixAdminCredentials(UsuarioRepository repository, PasswordEncoder passwordEncoder) {
        return args -> {
            Optional<Usuario> adminOpt = repository.findByUsername("admin");
            if (adminOpt.isPresent()) {
                Usuario admin = adminOpt.get();
                // Si la contraseña no está encriptada con BCrypt (empieza con $2a$), la arreglamos
                if (!admin.getPassword().startsWith("$2a$")) {
                    System.out.println(">>> [AUTO-FIX DB] Encriptando la contraseña del usuario 'admin' (estaba en texto plano)...");
                    admin.setPassword(passwordEncoder.encode(admin.getPassword()));
                    repository.save(admin);
                    System.out.println(">>> [AUTO-FIX DB] ¡Contraseña de 'admin' corregida exitosamente en la base de datos!");
                }
            } else {
                System.out.println(">>> [AUTO-FIX DB] El usuario 'admin' no existe, creándolo...");
                Usuario admin = new Usuario();
                admin.setUsername("admin");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setRol("ROLE_ADMIN");
                admin.setActivo(true);
                admin.setPuedeCrearAdmin(true);
                repository.save(admin);
                System.out.println(">>> [AUTO-FIX DB] ¡Usuario 'admin' creado exitosamente!");
            }
        };
    }
}
