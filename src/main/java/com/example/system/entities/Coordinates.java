package com.example.system.entities;
import jakarta.persistence.*;
import javax.validation.constraints.*;

@Embeddable
@Table(name = "coordinates")
public class Coordinates {
    @NotNull
    @Min(value = -946) // Значение поля должно быть больше -947
    private Long x;

    @NotNull
    @Max(value = 903) // Максимальное значение поля: 903
    private int y;

    // Конструкторы, геттеры и сеттеры

    public Coordinates() {}

    public Long getX() {
        return x;
    }

    public void setX(Long x) {
        this.x = x;
    }

    public int getY() {
        return y;
    }

    public void setY(int y) {
        this.y = y;
    }
}
