package it.jpanik.jCooking.dtos.user;

import it.jpanik.jCooking.entities.Enums.GenderEnum;

import java.util.Objects;

public class UserDto {
    private Long id;
    private String email;
    private String username;
    private String name;
    private String surname;
    private GenderEnum gender;
    private Integer age;
    private String avatar;
    private Integer recipesCount;

    public UserDto() {
    }

    public UserDto(Long id, String email, String username, String name, String surname,
                   GenderEnum gender, Integer age, String avatar, Integer recipesCount) {
        this.id = id;
        this.email = email;
        this.username = username;
        this.name = name;
        this.surname = surname;
        this.gender = gender;
        this.age = age;
        this.avatar = avatar;
        this.recipesCount = recipesCount;
    }

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

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSurname() {
        return surname;
    }

    public void setSurname(String surname) {
        this.surname = surname;
    }

    public GenderEnum getGender() {
        return gender;
    }

    public void setGender(GenderEnum gender) {
        this.gender = gender;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public String getAvatar() {
        return avatar;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }

    public Integer getRecipesCount() {
        return recipesCount;
    }

    public void setRecipesCount(Integer recipesCount) {
        this.recipesCount = recipesCount;
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        UserDto userDto = (UserDto) o;
        return age == userDto.age && recipesCount == userDto.recipesCount && Objects.equals(id, userDto.id) && Objects.equals(email, userDto.email) && Objects.equals(username, userDto.username) && Objects.equals(name, userDto.name) && Objects.equals(surname, userDto.surname) && gender == userDto.gender && Objects.equals(avatar, userDto.avatar);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, email, username, name, surname, gender, age, avatar, recipesCount);
    }

    @Override
    public String toString() {
        return "UserDto{" +
                "id=" + id +
                ", email='" + email + '\'' +
                ", username='" + username + '\'' +
                ", name='" + name + '\'' +
                ", surname='" + surname + '\'' +
                ", gender=" + gender +
                ", age=" + age +
                ", avatar='" + avatar + '\'' +
                ", recipesCount=" + recipesCount +
                '}';
    }
}
