package com.example.system.entities;

import jakarta.persistence.*;

import javax.validation.constraints.*;

import lombok.ToString;

@ToString
@Entity
@Table(name = "locations")
public class Location {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "x")
    private long x;

    @NotNull
    @Column(name = "y")
    private Integer y; // Поле не может быть null

    @NotNull
    @Column(name = "z")
    private Double z; // Поле не может быть null

    @Column(name = "created_by", nullable = false)
    private Integer createdBy; // ID пользователя, создавшего адрес

    // Конструкторы, геттеры и сеттеры
    public Location() {
    }

    // Конструктор с аргументами
    public Location(Long x, Integer y, Double z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    public int getId() {
        return id;
    }

    public long getX() {
        return x;
    }

    public void setX(long x) {
        this.x = x;
    }

    public Integer getY() {
        return y;
    }

    public void setY(Integer y) {
        this.y = y;
    }

    public Double getZ() {
        return z;
    }

    public void setZ(Double z) {
        this.z = z;
    }

    public Integer getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(Integer createdBy) {
        this.createdBy = createdBy;
    }
}
