package com.attendease.service;

import com.attendease.dto.CartItemDto;
import com.attendease.dto.ProductDto;
import com.attendease.entity.CartItem;
import com.attendease.entity.Product;
import com.attendease.entity.User;
import com.attendease.repository.CartItemRepository;
import com.attendease.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartService {
    
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    
    public List<CartItemDto> getCartItems(User user) {
        return cartItemRepository.findByUser(user).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public CartItemDto addToCart(User user, Long productId, Integer quantity) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        
        if (product.getStockQuantity() < quantity) {
            throw new RuntimeException("Not enough stock");
        }
        
        CartItem cartItem = cartItemRepository.findByUserAndProductId(user, productId)
                .map(item -> {
                    item.setQuantity(item.getQuantity() + quantity);
                    return item;
                })
                .orElseGet(() -> {
                    CartItem newItem = new CartItem();
                    newItem.setUser(user);
                    newItem.setProduct(product);
                    newItem.setQuantity(quantity);
                    return newItem;
                });
        
        return mapToDto(cartItemRepository.save(cartItem));
    }
    
    @Transactional
    public void removeFromCart(User user, Long cartItemId) {
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));
        
        if (!cartItem.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }
        
        cartItemRepository.delete(cartItem);
    }
    
    @Transactional
    public void clearCart(User user) {
        cartItemRepository.deleteByUser(user);
    }
    
    private CartItemDto mapToDto(CartItem cartItem) {
        Product product = cartItem.getProduct();
        ProductDto productDto = new ProductDto(
                product.getId(),
                product.getName(),
                product.getDescription(),
                product.getPrice(),
                product.getStockQuantity(),
                product.getImageUrl()
        );
        return new CartItemDto(cartItem.getId(), productDto, cartItem.getQuantity());
    }
}
