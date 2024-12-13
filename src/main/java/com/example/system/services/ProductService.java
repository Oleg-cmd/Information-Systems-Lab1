package com.example.system.services;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.system.entities.Address;
import com.example.system.entities.Organization;
import com.example.system.entities.Person;
import com.example.system.entities.Product;
import com.example.system.entities.UnitOfMeasure;
import com.example.system.entities.User;
import com.example.system.exceptions.ForbiddenOperationException;
import com.example.system.exceptions.ResourceNotFoundException;
import com.example.system.repositories.AddressRepository;
import com.example.system.repositories.LocationRepository;
import com.example.system.repositories.OrganizationRepository;
import com.example.system.repositories.PersonRepository;
import com.example.system.repositories.ProductRepository;
import com.example.system.repositories.UserRepository;

@Service
@Transactional
public class ProductService {

    private static final Logger logger = LoggerFactory.getLogger(OrganizationService.class);
    private final ProductRepository productRepository;
    private final OrganizationRepository organizationRepository;
    private final PersonRepository personRepository;
    private final UserRepository userRepository;
    private final LocationRepository locationRepository;
    private final AddressRepository addressRepository;

    @Autowired
    public ProductService(ProductRepository productRepository,
            OrganizationRepository organizationRepository,
            PersonRepository personRepository,
            UserRepository userRepository,
            LocationRepository locationRepository,
            AddressRepository addressRepository
    ) {
        this.productRepository = productRepository;
        this.organizationRepository = organizationRepository;
        this.personRepository = personRepository;
        this.userRepository = userRepository;
        this.locationRepository = locationRepository;
        this.addressRepository = addressRepository;
    }

    public Product createProduct(Product product, Integer currentUserId) {
        logger.info("creating product");
        product.setCreatedBy(currentUserId); // Set creator ID
        logger.info("setupped product created by");
        // validateProduct(product);
        logger.info("product saving");
        Product current = productRepository.save(product);
        logger.info("product saved");

        return current;
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product getProductById(Integer id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Продукт с ID " + id + " не найден"));
    }

    public Product updateProduct(Integer id, Product updatedProduct, Integer currentUserId) {
        validateProduct(updatedProduct);
        return productRepository.findById(id)
                .map(product -> {
                    if (!product.getCreatedBy().equals(currentUserId) && !isAdmin(currentUserId)) {
                        throw new ForbiddenOperationException("У вас нет прав для изменения этого продукта.");
                    }
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

    public void deleteProduct(Integer id, Integer currentUserId) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Продукт с ID " + id + " не найден"));

        if (!product.getCreatedBy().equals(currentUserId) && !isAdmin(currentUserId)) {
            throw new ForbiddenOperationException("У вас нет прав для удаления этого продукта.");
        }

        productRepository.deleteById(id); // JPA автоматически обработает каскадное удаление
    }

    // Special operations:
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

    // Остальные методы остаются без изменений
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
    }

    private boolean isAdmin(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Пользователь с ID " + userId + " не найден"));

        return user.getRole() == User.Role.ADMIN && user.isApproved();
    }
}
