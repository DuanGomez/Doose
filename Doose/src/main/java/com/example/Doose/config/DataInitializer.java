package com.example.Doose.config;

import com.example.Doose.model.TattooService;
import com.example.Doose.model.User;
import com.example.Doose.repository.TattooServiceRepository;
import com.example.Doose.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class DataInitializer {

    private final UserRepository userRepository;
    private final TattooServiceRepository tattooServiceRepository;
    private final PasswordEncoder passwordEncoder;

    @PostConstruct
    public void init() {
        if (userRepository.count() == 0) {
            seedUsers();
        }
        if (tattooServiceRepository.count() == 0) {
            seedServices();
        }
    }

    private void seedUsers() {
        userRepository.save(User.builder()
                .name("AdminDuSe")
                .email("admin@gmail.com")
                .password(passwordEncoder.encode("admin123"))
                .role(User.Role.ADMIN)
                .createdAt(LocalDateTime.now())
                .build());

        userRepository.save(User.builder()
                .name("Duan Gomez")
                .email("duan@gmail.com")
                .password(passwordEncoder.encode("duan123"))
                .role(User.Role.USER)
                .createdAt(LocalDateTime.now())
                .build());

        userRepository.save(User.builder()
                .name("Sebastián Ríos")
                .email("sebastian@tattoo.com")
                .password(passwordEncoder.encode("sebastian123"))
                .role(User.Role.TATTOER)
                .specialty("Blackwork")
                .experience(8)
                .createdAt(LocalDateTime.now())
                .build());

        userRepository.save(User.builder()
                .name("Valentina Cruz")
                .email("valentina@tattoo.com")
                .password(passwordEncoder.encode("valentina123"))
                .role(User.Role.TATTOER)
                .specialty("Acuarela")
                .experience(5)
                .createdAt(LocalDateTime.now())
                .build());

        userRepository.save(User.builder()
                .name("Andrés Montoya")
                .email("andres@tattoo.com")
                .password(passwordEncoder.encode("andres123"))
                .role(User.Role.TATTOER)
                .specialty("Geométrico")
                .experience(10)
                .createdAt(LocalDateTime.now())
                .build());
    }

    private void seedServices() {
        tattooServiceRepository.save(TattooService.builder()
                .name("Tatuaje Minimalista")
                .description("Líneas finas y diseños simples pero elegantes. Perfecto para una primera vez.")
                .price(150000.0)
                .duration(60)
                .type("Minimalista pequeño")
                .createdAt(LocalDateTime.now())
                .build());

        tattooServiceRepository.save(TattooService.builder()
                .name("Frase Personalizada")
                .description("Tu frase favorita, cita o nombre en la fuente que elijas. Única y especial.")
                .price(100000.0)
                .duration(45)
                .type("Frase corta")
                .createdAt(LocalDateTime.now())
                .build());

        tattooServiceRepository.save(TattooService.builder()
                .name("Tribal de Brazo")
                .description("Diseños tribales que recorren el brazo con patrones culturales y fuerza visual.")
                .price(320000.0)
                .duration(180)
                .type("Tribal brazo")
                .createdAt(LocalDateTime.now())
                .build());

        tattooServiceRepository.save(TattooService.builder()
                .name("Realismo Pequeño")
                .description("Retratos hiperrealistas en formato pequeño. Cada detalle recreado con precisión.")
                .price(260000.0)
                .duration(120)
                .type("Realista pequeño")
                .createdAt(LocalDateTime.now())
                .build());

        tattooServiceRepository.save(TattooService.builder()
                .name("Tatuaje Anime")
                .description("Personajes y escenas de anime en tamaño mediano con colores vibrantes.")
                .price(290000.0)
                .duration(150)
                .type("Anime mediano")
                .createdAt(LocalDateTime.now())
                .build());

        tattooServiceRepository.save(TattooService.builder()
                .name("Diseño Geométrico")
                .description("Figuras y patrones geométricos con precisión milimétrica. Arte y matemática.")
                .price(210000.0)
                .duration(90)
                .type("Geométrico")
                .createdAt(LocalDateTime.now())
                .build());

        tattooServiceRepository.save(TattooService.builder()
                .name("Blackwork Artístico")
                .description("Diseños sólidos en tinta negra con alto contraste y gran impacto visual.")
                .price(360000.0)
                .duration(210)
                .type("Blackwork")
                .createdAt(LocalDateTime.now())
                .build());

        tattooServiceRepository.save(TattooService.builder()
                .name("Tatuaje Acuarela")
                .description("Efecto pintura acuarela con colores que se difuminan como en un lienzo.")
                .price(310000.0)
                .duration(180)
                .type("Acuarela")
                .createdAt(LocalDateTime.now())
                .build());

        tattooServiceRepository.save(TattooService.builder()
                .name("Retrato Realista")
                .description("Retratos de personas, mascotas o iconos con detalle fotográfico. La cúspide del realismo.")
                .price(520000.0)
                .duration(300)
                .type("Retrato realista")
                .createdAt(LocalDateTime.now())
                .build());

        tattooServiceRepository.save(TattooService.builder()
                .name("Tatuaje Grande de Espalda")
                .description("Obra maestra que cubre toda la espalda. El proyecto más ambicioso del estudio.")
                .price(850000.0)
                .duration(480)
                .type("Tatuaje grande espalda")
                .createdAt(LocalDateTime.now())
                .build());
    }
}
