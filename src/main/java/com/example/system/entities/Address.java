package com.example.system.entities;

import jakarta.persistence.*;


@Entity
@Table(name = "addresses")
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "zip_code")
    private String zipCode;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "town_id")
    private Location town;

    @Transient // Поля для обработки на уровне сервиса
    private Location createTown;

    @Transient
    private Integer linkTownId;

    @Column(name = "created_by", nullable = false)
    private Integer createdBy; // ID пользователя, создавшего адрес

    // Геттеры и сеттеры
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

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

    public Location getCreateTown() {
        return createTown;
    }

    public void setCreateTown(Location createTown) {
        this.createTown = createTown;
    }

    public Integer getLinkTownId() {
        return linkTownId;
    }

    public void setLinkTownId(Integer linkTownId) {
        this.linkTownId = linkTownId;
    }

    public Integer getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(Integer createdBy) {
        this.createdBy = createdBy;
    }
}
