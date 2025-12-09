package it.jpanik.jCooking.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import it.jpanik.jCooking.entities.Enums.GenderEnum;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name="USER")
public class User {
    @Column (name = "ID")
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column (unique = true, name = "EMAIL")
    private String email;

    @Column (unique = true, nullable = false, name = "USERNAME")
    private String username;

    @Column (nullable = false, name = "NAME")
    private String name;
    @Column (name = "SURNAME")
    private String surname;
    @Min(1)
    @Column (nullable = false, name = "AGE")
    private int age;
    @Column (nullable = false, name = "GENDER")
    @Enumerated(EnumType.STRING)
    private GenderEnum gender;
    @Column (name = "CREATION_DATE")
    private LocalDate creationDate;   //data creazione utente

    @Column (name = "AVATAR")
    private String avatar;      //nome immagine

    @OneToMany (mappedBy = "user")
    @JsonIgnore
    private Set<Recipe> recipes = new HashSet<>();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getUsername() { return username; }

    public void setUsername(String username) { this.username = username; }

    public String getSurname() {
        return surname;
    }

    public void setSurname(String surname) {
        this.surname = surname;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public GenderEnum getGender() {
        return gender;
    }

    public void setGender(GenderEnum gender) {
        this.gender = gender;
    }

    public LocalDate getCreationDate() {
        return creationDate;
    }

    public void setCreationDate(LocalDate creationDate) {
        this.creationDate = creationDate;
    }

    public  String getAvatar() {
        return avatar;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }

    public Set<Recipe> getRecipes() {
        return recipes;
    }

    public void setRecipes(Set<Recipe> recipes) {
        this.recipes = recipes;
    }
}
