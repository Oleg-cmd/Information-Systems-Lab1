package com.example.system.entities;

import jakarta.persistence.*;
import javax.validation.constraints.*;

@Entity
@Table(name = "organizations")
public class Organization {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false, unique = true)
    private Integer id;

    @NotNull
    @NotBlank
    @Column(name = "name", nullable = false)
    private String name;

    @ManyToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REMOVE})
    @JoinColumn(name = "official_address_id")
    private Address officialAddress;

    @ManyToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REMOVE})  // Добавлено CascadeType.REMOVE  и orphanRemoval
    @JoinColumn(name = "postal_address_id")
    private Address postalAddress;

    @Positive
    @Column(name = "annual_turnover")
    private Integer annualTurnover; // Поле может быть null, Значение поля должно быть больше 0

    @Positive
    @Column(name = "employees_count", nullable = false)
    private long employeesCount; // Значение поля должно быть больше 0

    @Column(name = "full_name")
    private String fullName; // Поле может быть null

    @Positive
    @Column(name = "rating")
    private Integer rating; // Поле может быть null, Значение поля должно быть больше 0

    @Column(name = "created_by", nullable = false)
    private Integer createdBy; // ID пользователя, создавшего адрес

    // Транзитные поля для обработки на уровне сервиса
    @Transient
    private Address createOfficialAddress;

    @Transient
    private Integer linkOfficialAddressId;

    @Transient
    private Address createPostalAddress;

    @Transient
    private Integer linkPostalAddressId;

    // Конструкторы, геттеры и сеттеры
    public Organization() {
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Address getOfficialAddress() {
        return officialAddress;
    }

    public void setOfficialAddress(Address officialAddress) {
        this.officialAddress = officialAddress;
    }

    public Address getPostalAddress() {
        return postalAddress;
    }

    public void setPostalAddress(Address postalAddress) {
        this.postalAddress = postalAddress;
    }

    public Integer getAnnualTurnover() {
        return annualTurnover;
    }

    public void setAnnualTurnover(Integer annualTurnover) {
        this.annualTurnover = annualTurnover;
    }

    public long getEmployeesCount() {
        return employeesCount;
    }

    public void setEmployeesCount(long employeesCount) {
        this.employeesCount = employeesCount;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public Address getCreateOfficialAddress() {
        return createOfficialAddress;
    }

    public void setCreateOfficialAddress(Address createOfficialAddress) {
        this.createOfficialAddress = createOfficialAddress;
    }

    public Integer getLinkOfficialAddressId() {
        return linkOfficialAddressId;
    }

    public void setLinkOfficialAddressId(Integer linkOfficialAddressId) {
        this.linkOfficialAddressId = linkOfficialAddressId;
    }

    public Address getCreatePostalAddress() {
        return createPostalAddress;
    }

    public void setCreatePostalAddress(Address createPostalAddress) {
        this.createPostalAddress = createPostalAddress;
    }

    public Integer getLinkPostalAddressId() {
        return linkPostalAddressId;
    }

    public void setLinkPostalAddressId(Integer linkPostalAddressId) {
        this.linkPostalAddressId = linkPostalAddressId;
    }

    public Integer getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(Integer createdBy) {
        this.createdBy = createdBy;
    }
}
