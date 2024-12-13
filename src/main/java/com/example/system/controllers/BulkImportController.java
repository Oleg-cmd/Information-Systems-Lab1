package com.example.system.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.system.entities.Organization;
import com.example.system.entities.Person;
import com.example.system.entities.Product;
import com.example.system.implementations.UserDetailsImpl;
import com.example.system.repositories.PersonRepository;
import com.example.system.services.ImportHistoryService;
import com.example.system.services.OrganizationService;
import com.example.system.services.PersonService;
import com.example.system.services.ProductService;

@RestController
@RequestMapping("/api/import")
public class BulkImportController {

    private final ProductService productService;
    private final PersonService personService;
    private final OrganizationService organizationService;
    private final ImportHistoryService importHistoryService;

    public BulkImportController(ProductService productService,
            PersonService personService,
            OrganizationService organizationService,
            ImportHistoryService importHistoryService
    ) {
        this.productService = productService;
        this.personService = personService;
        this.organizationService = organizationService;
        this.importHistoryService = importHistoryService;
    }

    @PostMapping("/bulk-products")
    @Transactional(isolation = Isolation.REPEATABLE_READ)
    public ResponseEntity<String> importBulkProducts(@RequestBody List<Product> products) {
        try {
            int successCount = 0;  // Счетчик успешно добавленных продуктов

            for (Product product : products) {
                // Валидация данных перед импортом
                if (product.getOwner() == null || product.getManufacturer() == null) {
                    throw new IllegalArgumentException("Владелец или производитель не могут быть null.");
                }

                // Создание владельца, если он не существует
                Person owner = personService.createPerson(product.getOwner(), getCurrentUserId());
                product.setOwner(owner);

                // Создание производителя, если он не существует
                Organization manufacturer = organizationService.createOrganization(product.getManufacturer(), getCurrentUserId());
                product.setManufacturer(manufacturer);

                // Создание продукта
                productService.createProduct(product, getCurrentUserId());
                successCount++;  // Увеличиваем счетчик успешных добавлений
            }

            // Запись в историю импорта (например, в базу данных)
            importHistoryService.saveImportHistory(getCurrentUserId(), successCount);

            return ResponseEntity.ok("Продукты успешно импортированы");
        } catch (Exception e) {
            // Логирование ошибки и откат всех изменений
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Ошибка импорта");
        }
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
