package com.example.system.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "addresses")
public class Address {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;


    @Column(name = "zip_code")
    private String zipCode; // Поле может быть null

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "town_id")
    private Location town; // Поле может быть null

    

    // Конструкторы, геттеры и сеттеры

    public Address() {}

    public String getZipCode() {
        return zipCode;
    }

    public void setZipCode(String zipCode) {
        this.zipCode = zipCode;
    }

    public Location getTown() {
        return town;
    }

    public void setTown(Location town) {
        this.town = town;
    }
}
