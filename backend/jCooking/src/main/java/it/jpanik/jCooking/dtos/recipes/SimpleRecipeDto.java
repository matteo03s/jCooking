package it.jpanik.jCooking.dtos.recipes;

import it.jpanik.jCooking.dtos.CategoryDto;

import java.util.List;
import java.util.Objects;

public class SimpleRecipeDto {
    private Long id;
    private String title;
    private List<String> tags;
    private Double averageRating;
    private Integer favouritesCount;
    private CategoryDto category;
    private String username;
    private String firstImageUrl;

    public SimpleRecipeDto() {}

    public SimpleRecipeDto(Long id, String title, List<String> tags, Double averageRating, Integer favouritesCount, CategoryDto category, String username, String firstImageUrl) {
        this.id = id;
        this.title = title;
        this.tags = tags;
        this.averageRating = averageRating;
        this.favouritesCount = favouritesCount;
        this.category = category;
        this.username = username;
        this.firstImageUrl = firstImageUrl;
    }

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

    public List<String> getTags() {
        return tags;
    }

    public void setTags(List<String> tags) {
        this.tags = tags;
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

    public CategoryDto getCategory() {
        return category;
    }

    public void setCategory(CategoryDto category) {
        this.category = category;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getFirstImageUrl() {
        return firstImageUrl;
    }

    public void setFirstImageUrl(String firstImageUrl) {
        this.firstImageUrl = firstImageUrl;
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        SimpleRecipeDto that = (SimpleRecipeDto) o;
        return Objects.equals(id, that.id) && Objects.equals(title, that.title) && Objects.equals(tags, that.tags) && Objects.equals(averageRating, that.averageRating) && Objects.equals(favouritesCount, that.favouritesCount) && Objects.equals(category, that.category) && Objects.equals(username, that.username) && Objects.equals(firstImageUrl, that.firstImageUrl);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, title, tags, averageRating, favouritesCount, category, username, firstImageUrl);
    }

    @Override
    public String toString() {
        return "RecipeSemplifiedDto{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", tags=" + tags +
                ", averageRating=" + averageRating +
                ", favouritesCount=" + favouritesCount +
                ", category=" + category +
                ", username='" + username + '\'' +
                ", firstImageUrl='" + firstImageUrl + '\'' +
                '}';
    }
}
