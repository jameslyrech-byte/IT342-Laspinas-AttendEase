package com.attendease.controller;

import com.attendease.dto.CartItemDto;
import com.attendease.entity.User;
import com.attendease.repository.UserRepository;
import com.attendease.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/cart")
@RequiredArgsConstructor
public class CartController {
    
    private final CartService cartService;
    private final UserRepository userRepository;
    
    @GetMapping
    public ResponseEntity<List<CartItemDto>> getCart(Principal principal) {
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(cartService.getCartItems(user));
    }
    
    @PostMapping("/items")
    public ResponseEntity<CartItemDto> addToCart(
            Principal principal,
            @RequestParam Long productId,
            @RequestParam Integer quantity) {
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(cartService.addToCart(user, productId, quantity));
    }
    
    @DeleteMapping("/items/{id}")
    public ResponseEntity<Void> removeFromCart(Principal principal, @PathVariable Long id) {
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        cartService.removeFromCart(user, id);
        return ResponseEntity.ok().build();
    }
    
    @DeleteMapping
    public ResponseEntity<Void> clearCart(Principal principal) {
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        cartService.clearCart(user);
        return ResponseEntity.ok().build();
    }
}
