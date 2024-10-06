package com.example.system.services;

import com.example.system.entities.Product;
import com.example.system.entities.UnitOfMeasure;
import com.example.system.exceptions.ResourceNotFoundException;
import com.example.system.repositories.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ProductService {

    private final ProductRepository productRepository;

    @Autowired
    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public Product createProduct(Product product) {
        validateProduct(product);
        return productRepository.save(product);
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product getProductById(Integer id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Продукт с ID " + id + " не найден"));
    }

    public Product updateProduct(Integer id, Product updatedProduct) {
        validateProduct(updatedProduct);
        return productRepository.findById(id)
                .map(product -> {
                    product.setName(updatedProduct.getName());
                    product.setCoordinates(updatedProduct.getCoordinates());
                    product.setUnitOfMeasure(updatedProduct.getUnitOfMeasure());
                    product.setManufacturer(updatedProduct.getManufacturer());
                    product.setPrice(updatedProduct.getPrice());
                    product.setManufactureCost(updatedProduct.getManufactureCost());
                    product.setRating(updatedProduct.getRating());
                    product.setPartNumber(updatedProduct.getPartNumber());
                    product.setOwner(updatedProduct.getOwner());
                    return productRepository.save(product);
                })
                .orElseThrow(() -> new ResourceNotFoundException("Продукт с ID " + id + " не найден"));
    }

    public void deleteProduct(Integer id) {
        productRepository.deleteById(id);
    }

    // Специальные операции:

    public long countByPartNumber(String partNumber) {
        return productRepository.countByPartNumber(partNumber);
    }

    public List<Product> findByPartNumberStartingWith(String partNumberPrefix) {
        return productRepository.findByPartNumberStartingWith(partNumberPrefix);
    }

    public List<Product> findByPriceBetween(long minPrice, long maxPrice) {
        return productRepository.findByPriceBetween(minPrice, maxPrice);
    }

    public List<Product> findByUnitOfMeasure(UnitOfMeasure unitOfMeasure) {
        return productRepository.findByUnitOfMeasure(unitOfMeasure);
    }
    
    private void validateProduct(Product product) {
        if (product.getName() == null || product.getName().isEmpty()) {
            throw new IllegalArgumentException("Название продукта не может быть пустым");
        }
        if (product.getCoordinates() == null) {
            throw new IllegalArgumentException("Координаты продукта не могут быть null");
        }
        if (product.getCreationDate() == null) {
            throw new IllegalArgumentException("Дата создания продукта не может быть null");
        }
        if (product.getManufacturer() == null) {
            throw new IllegalArgumentException("Производитель продукта не может быть null");
        }
        if (product.getPrice() <= 0) {
            throw new IllegalArgumentException("Цена продукта должна быть больше 0");
        }
        if (product.getRating() == null || product.getRating() <= 0) {
            throw new IllegalArgumentException("Рейтинг продукта не может быть null и должен быть больше 0");
        }
        if (product.getOwner() == null) {
            throw new IllegalArgumentException("Владелец продукта не может быть null");
        }
        if (product.getPartNumber() != null && (product.getPartNumber().isEmpty() || product.getPartNumber().length() < 15)) {
            throw new IllegalArgumentException("Part Number продукта не может быть пустым и должен быть не менее 15 символов");
        }
        // Проверка уникальности Part Number (необязательно, если это контролируется на уровне базы данных)
        // if (product.getPartNumber() != null && productRepository.existsByPartNumber(product.getPartNumber())) {
        //     throw new IllegalArgumentException("Part Number продукта должен быть уникальным");
        // }
    }
}