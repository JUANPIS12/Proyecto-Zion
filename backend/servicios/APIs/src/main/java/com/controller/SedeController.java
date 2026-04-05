package com.zion.zionbackend.controller;

import com.zion.zionbackend.entity.Sede;
import com.zion.zionbackend.repository.SedeRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sedes")
@CrossOrigin(origins = "http://localhost:5173")
public class SedeController {

    private final SedeRepository sedeRepository;

    public SedeController(SedeRepository sedeRepository) {
        this.sedeRepository = sedeRepository;
    }

    @GetMapping
    public List<Sede> listar() {
        return sedeRepository.findAll();
    }
}