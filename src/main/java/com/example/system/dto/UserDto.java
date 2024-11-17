package com.example.system.dto;

import com.example.system.entities.Product;

public class UserDto {
    private String username;
    private String password; // добавляем поле для пароля
    private String role;
    private boolean approved;
    private Product[] products;
    private Integer id;
    private String jwt;

    // Пустой конструктор
    public UserDto() {}

    // Конструктор с параметрами, включая пароль
    public UserDto(String username, String password, String role, boolean approved, Product[] products, Integer id, String jwt) {
        this.username = username;
        this.password = password;
        this.role = role;
        this.approved = approved;
        this.products = products;
        this.id = id;
        this.jwt = jwt;
    }

    // Упрощённый конструктор без products и jwt для удобства
    public UserDto(String username, String password, String role, boolean approved) {
        this.username = username;
        this.password = password;
        this.role = role;
        this.approved = approved;
    }

    // Геттеры
    public String getUsername() {
        return username;
    }

    public String getPassword() {
        return password;
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

    public String getJwt() {
        return jwt;
    }

    // Сеттеры
    public void setUsername(String username) {
        this.username = username;
    }

    public void setPassword(String password) {
        this.password = password;
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

    public void setJwt(String jwt) {
        this.jwt = jwt;
    }
}
