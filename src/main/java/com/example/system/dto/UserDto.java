package com.example.system.dto;

import com.example.system.entities.Product;

public class UserDto {
    private String username;
    private String role;
    private boolean approved;
    private Product[] products; // Предполагаем, что у вас есть сущность Product
    private Integer id;
    private String jwt;

    // Конструкторы (пустой и с параметрами)
    public UserDto() {}

    public UserDto(String username, String role, boolean approved, Product[] products, Integer id) {
        this.username = username;
        this.role = role;
        this.approved = approved;
        this.products = products;
        this.id = id;
    }

    // Геттеры

    public String getJwt() {
        return jwt;
    }

    public String getUsername() {
        return username;
    }

    public String getRole() {
        return role;
    }

    public boolean isApproved() {
        return approved;
    }

    public Product[] getProducts() {
        return products;
    }

    public Integer getId() {
        return id;
    }

    // Сеттеры 
    public void setJwt(String jwt) {
        this.jwt = jwt;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public void setApproved(boolean approved) {
        this.approved = approved;
    }

    public void setProducts(Product[] products) {
        this.products = products;
    }

    public void setId(Integer id) {
        this.id = id;
    }
}