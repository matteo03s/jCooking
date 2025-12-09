package it.jpanik.jCooking.dtos.recipes;

import it.jpanik.jCooking.dtos.CategoryDto;
import it.jpanik.jCooking.dtos.ImageDto;
import it.jpanik.jCooking.dtos.IngredientDto;
import it.jpanik.jCooking.entities.Enums.LevelEnum;

import java.time.LocalDate;
import java.util.List;

public class RecipeWithAuthorDto {
    private Long id;
    private String title;
    private String description;
    private Integer prepTime;
    private Integer cookTime;
    private Integer Servings;
    private LocalDate uploadDate;
    private List<String> tags;
    private List<String> steps;
    private LevelEnum level;
    private Double averageRating;
    private Integer favouritesCount;
    private CategoryDto category;
    private Long userId;
    private AuthorDto author;
    private List <IngredientDto> ingredients;
    private List <ImageDto> images;

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

    public Integer getCookTime() {
        return cookTime;
    }

    public void setCookTime(Integer cookTime) {
        this.cookTime = cookTime;
    }

    public Integer getServings() {
        return Servings;
    }

    public void setServings(Integer servings) {
        Servings = servings;
    }

    public Double getAverageRating() {
        return averageRating;
    }

    public void setAverageRating(Double averageRating) {
        this.averageRating = averageRating;
    }

    public Integer getFavouritesCount() {
        return favouritesCount;
    }

    public void setFavouritesCount(Integer favouritesCount) {
        this.favouritesCount = favouritesCount;
    }

    public LocalDate getUploadDate() {
        return uploadDate;
    }

    public void setUploadDate(LocalDate uploadDate) {
        this.uploadDate = uploadDate;
    }

    public List<String> getTags() {
        return tags;
    }

    public void setTags(List<String> tags) {
        this.tags = tags;
    }

    public List<String> getSteps() {
        return steps;
    }

    public void setSteps(List<String> steps) {
        this.steps = steps;
    }

    public LevelEnum getLevel() {
        return level;
    }

    public void setLevel(LevelEnum level) {
        this.level = level;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public AuthorDto getAuthor() {
        return author;
    }

    public void setAuthor(AuthorDto author) {
        this.author = author;
    }

    public CategoryDto getCategory() {
        return category;
    }

    public void setCategory(CategoryDto category) {
        this.category = category;
    }

    public List<IngredientDto> getIngredients() {
        return ingredients;
    }

    public void setIngredients(List<IngredientDto> ingredients) {
        this.ingredients = ingredients;
    }

    public List<ImageDto> getImages() {
        return images;
    }

    public void setImages(List<ImageDto> images) {
        this.images = images;
    }

    public static class AuthorDto {
        private String username;
        private String avatarUrl;

        public AuthorDto(String username, String avatarUrl) {
            this.username = username;
            this.avatarUrl = avatarUrl;
        }

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getAvatarUrl() {
            return avatarUrl;
        }

        public void setAvatarUrl(String avatarUrl) {
            this.avatarUrl = avatarUrl;
        }

    }


    @Override
    public String toString() {
        return "RecipeDto{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", description='" + description + '\'' +
                ", prepTime='" + prepTime + '\'' +
                ", cookTime='" + cookTime + '\'' +
                ", Servings=" + Servings +
                ", averageRating=" + averageRating +
                ", tags=" + tags +
                ", steps=" + steps +
                ", level=" + level +
                '}';
    }
}
