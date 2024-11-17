package com.example.system.controllers;

import com.example.system.entities.Product;
import com.example.system.entities.UnitOfMeasure;
import com.example.system.services.ProductService;
import com.example.system.implementations.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    @Autowired
    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @PostMapping
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
        Integer currentUserId = getCurrentUserId();
        Product createdProduct = productService.createProduct(product, currentUserId);
        return new ResponseEntity<>(createdProduct, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        List<Product> products = productService.getAllProducts();
        return new ResponseEntity<>(products, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Integer id) {
        Product product = productService.getProductById(id);
        return new ResponseEntity<>(product, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Integer id, @RequestBody Product updatedProduct) {
        Integer currentUserId = getCurrentUserId();
        Product product = productService.updateProduct(id, updatedProduct, currentUserId);
        return new ResponseEntity<>(product, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Integer id) {
        Integer currentUserId = getCurrentUserId();
        productService.deleteProduct(id, currentUserId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    // Special operations:

    @GetMapping("/countByPartNumber")
    public ResponseEntity<Long> countByPartNumber(@RequestParam String partNumber) {
        long count = productService.countByPartNumber(partNumber);
        return new ResponseEntity<>(count, HttpStatus.OK);
    }

    @GetMapping("/findByPartNumberStartingWith")
    public ResponseEntity<List<Product>> findByPartNumberStartingWith(@RequestParam String partNumberPrefix) {
        List<Product> products = productService.findByPartNumberStartingWith(partNumberPrefix);
        return new ResponseEntity<>(products, HttpStatus.OK);
    }

    @GetMapping("/findByPriceBetween")
    public ResponseEntity<List<Product>> findByPriceBetween(
            @RequestParam long minPrice, @RequestParam long maxPrice) {
        List<Product> products = productService.findByPriceBetween(minPrice, maxPrice);
        return new ResponseEntity<>(products, HttpStatus.OK);
    }

    @GetMapping("/findByUnitOfMeasure")
    public ResponseEntity<List<Product>> findByUnitOfMeasure(@RequestParam UnitOfMeasure unitOfMeasure) {
        List<Product> products = productService.findByUnitOfMeasure(unitOfMeasure);
        return new ResponseEntity<>(products, HttpStatus.OK);
    }

    private Integer getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getPrincipal() == null || !(auth.getPrincipal() instanceof UserDetailsImpl)) {
            throw new IllegalStateException("Пользователь не аутентифицирован или данные некорректны");
        }
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        return userDetails.getId(); // Возвращаем ID пользователя
    }
}
