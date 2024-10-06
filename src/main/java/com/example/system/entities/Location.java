package com.example.system.entities;
import jakarta.persistence.*;
import javax.validation.constraints.*;

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

    // Конструкторы, геттеры и сеттеры

    public Location() {}

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
}
