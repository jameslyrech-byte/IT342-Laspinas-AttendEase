package com.attendease.config;

import com.attendease.entity.User;
import com.attendease.entity.UserRole;
import com.attendease.entity.Product;
import com.attendease.repository.ProductRepository;
import com.attendease.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;
import java.util.Arrays;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (!userRepository.existsByEmail("admin@attendease.com")) {
            User admin = new User();
            admin.setEmail("admin@attendease.com");
            admin.setPasswordHash(passwordEncoder.encode("admin123"));
            admin.setFirstname("Admin");
            admin.setLastname("User");
            admin.setRole(UserRole.ADMIN);
            userRepository.save(admin);
        }

        if (productRepository.count() == 0) {
            Product p1 = new Product();
            p1.setName("Wireless Headphones");
            p1.setDescription("High-quality wireless headphones with noise-canceling feature.");
            p1.setPrice(new BigDecimal("99.99"));
            p1.setStockQuantity(50);
            p1.setImageUrl("https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500");

            Product p2 = new Product();
            p2.setName("Smart Watch");
            p2.setDescription("Modern smart watch with fitness tracking and notifications.");
            p2.setPrice(new BigDecimal("149.50"));
            p2.setStockQuantity(30);
            p2.setImageUrl("https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500");

            Product p3 = new Product();
            p3.setName("Mechanical Keyboard");
            p3.setDescription("RGB backlit mechanical keyboard with blue switches.");
            p3.setPrice(new BigDecimal("79.99"));
            p3.setStockQuantity(20);
            p3.setImageUrl("https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=500");

            Product p4 = new Product();
            p4.setName("Gaming Mouse");
            p4.setDescription("Ergonomic gaming mouse with adjustable DPI.");
            p4.setPrice(new BigDecimal("45.00"));
            p4.setStockQuantity(100);
            p4.setImageUrl("https://images.unsplash.com/photo-1527698266440-12104e498b76?w=500");

            Product p5 = new Product();
            p5.setName("Laptop Stand");
            p5.setDescription("Aluminum laptop stand for improved posture.");
            p5.setPrice(new BigDecimal("29.99"));
            p5.setStockQuantity(15);
            p5.setImageUrl("https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500");

            productRepository.saveAll(Arrays.asList(p1, p2, p3, p4, p5));
        }
    }
}
