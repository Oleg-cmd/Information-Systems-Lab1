package com.example.system.entities;
import jakarta.persistence.*;
import javax.validation.constraints.*;

@Entity
@Table(name = "persons")
public class Person {  
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;    

    @NotNull
    @NotBlank
    @Column(name = "name", nullable = false)
    private String name; // Поле не может быть null, Строка не может быть пустой

    @Enumerated(EnumType.STRING)
    @Column(name = "eye_color")
    private Color eyeColor; // Поле может быть null

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "hair_color", nullable = false)
    private Color hairColor; // Поле не может быть null

    @NotNull
    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "location_id", nullable = false)
    private Location location; // Поле не может быть null

    @Column(name = "birthday")
    private java.util.Date birthday; // Поле может быть null

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "nationality", nullable = false)
    private Country nationality; // Поле не может быть null

    // Конструкторы, геттеры и сеттеры

    public Person() {}

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Color getEyeColor() {
        return eyeColor;
    }

    public void setEyeColor(Color eyeColor) {
        this.eyeColor = eyeColor;
    }

    public Color getHairColor() {
        return hairColor;
    }

    public void setHairColor(Color hairColor) {
        this.hairColor = hairColor;
    }

    public Location getLocation() {
        return location;
    }

    public void setLocation(Location location) {
        this.location = location;
    }

    public java.util.Date getBirthday() {
        return birthday;
    }

    public void setBirthday(java.util.Date birthday) {
        this.birthday = birthday;
    }

    public Country getNationality() {
        return nationality;
    }

    public void setNationality(Country nationality) {
        this.nationality = nationality;
    }
}
