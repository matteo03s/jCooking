package it.jpanik.jCooking.dtos;

import java.util.Objects;

public class CategoryDto {

    Long id;
    String name;
    String slug;
    String description;
    String pathIcon;

    public CategoryDto() {
    }
    public CategoryDto(Long id, String name, String slug, String description, String pathIcon) {
        this.id = id;
        this.name = name;
        this.slug = slug;
        this.description = description;
        this.pathIcon = pathIcon;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSlug() {
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getPathIcon() {
        return pathIcon;
    }

    public void setPathIcon(String pathIcon) {
        this.pathIcon = pathIcon;
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        CategoryDto that = (CategoryDto) o;
        return Objects.equals(id, that.id) && Objects.equals(name, that.name) && Objects.equals(description, that.description) && Objects.equals(pathIcon, that.pathIcon);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name, description, pathIcon);
    }

    @Override
    public String toString() {
        return "CategoryDto{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", description='" + description + '\'' +
                ", pathIcon='" + pathIcon + '\'' +
                '}';
    }
}
