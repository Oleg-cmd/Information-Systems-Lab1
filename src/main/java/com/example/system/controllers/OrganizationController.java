package com.example.system.controllers;

import com.example.system.entities.Organization;
import com.example.system.services.OrganizationService;
import com.example.system.implementations.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;

@RestController
@RequestMapping("/api/organizations")
public class OrganizationController {

    private final OrganizationService organizationService;

    @Autowired
    public OrganizationController(OrganizationService organizationService) {
        this.organizationService = organizationService;
    }

    @PostMapping
    public ResponseEntity<Organization> createOrganization(@RequestBody Organization organization) {
        Integer currentUserId = getCurrentUserId();
        Organization createdOrganization = organizationService.createOrganization(organization, currentUserId);
        return new ResponseEntity<>(createdOrganization, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Organization>> getAllOrganizations() {
        List<Organization> organizations = organizationService.getAllOrganizations();
        return new ResponseEntity<>(organizations, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Organization> getOrganizationById(@PathVariable Integer id) {
        Organization organization = organizationService.getOrganizationById(id);
        return new ResponseEntity<>(organization, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Organization> updateOrganization(
            @PathVariable Integer id,
            @RequestBody Organization updatedOrganization
    ) {
        Integer currentUserId = getCurrentUserId();
        Organization organization = organizationService.updateOrganization(id, updatedOrganization, currentUserId);
        return new ResponseEntity<>(organization, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrganization(@PathVariable Integer id) {
        Integer currentUserId = getCurrentUserId();
        organizationService.deleteOrganization(id, currentUserId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    // Специальные операции:

    @GetMapping("/averageRating")
    public ResponseEntity<Double> getAverageRating() {
        Double averageRating = organizationService.getAverageRating();
        return new ResponseEntity<>(averageRating, HttpStatus.OK);
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
