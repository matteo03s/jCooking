package it.jpanik.jCooking.dtos.recipes;

import it.jpanik.jCooking.entities.Enums.CategoryEnum;
import it.jpanik.jCooking.entities.Enums.LevelEnum;

import java.util.List;

public class RecipeDto {

    private Long id;
    private String title;
    private String description;
    private Integer prepTime;
    private Integer Servings;
    private List<String> tags;
    private LevelEnum level;
    private CategoryEnum category;

    private Long userId;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getPrepTime() {
        return prepTime;
    }

    public void setPrepTime(Integer prepTime) {
        this.prepTime = prepTime;
    }

    public Integer getServings() {
        return Servings;
    }

    public void setServings(Integer servings) {
        Servings = servings;
    }

    public List<String> getTags() {
        return tags;
    }

    public void setTags(List<String> tags) {
        this.tags = tags;
    }

    public LevelEnum getLevel() {
        return level;
    }

    public void setLevel(LevelEnum level) {
        this.level = level;
    }

    public CategoryEnum getCategory() {
        return category;
    }

    public void setCategory(CategoryEnum category) {
        this.category = category;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    @Override
    public String toString() {
        return "RecipeDto{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", description='" + description + '\'' +
                ", prepTime='" + prepTime + '\'' +
                ", Servings=" + Servings +
                ", tags=" + tags +
                ", level=" + level +
                '}';
    }
}
