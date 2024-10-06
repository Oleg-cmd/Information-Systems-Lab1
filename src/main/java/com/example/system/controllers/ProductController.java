package com.example.system.controllers;

import com.example.system.entities.Product;
import com.example.system.entities.UnitOfMeasure;
import com.example.system.services.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
        Product createdProduct = productService.createProduct(product);
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
        Product product = productService.updateProduct(id, updatedProduct);
        return new ResponseEntity<>(product, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Integer id) {
        productService.deleteProduct(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    // Специальные операции:

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
}