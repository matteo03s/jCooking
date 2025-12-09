package it.jpanik.jCooking.dtos;

import java.time.LocalDateTime;
import java.util.Objects;

public class FavouriteDto {
    private Long id;
    private Long userId;
    private Long recipeId;
    private String username;
    private String recipeTitle;
    private String recipeImage;
    private LocalDateTime createdAt;

    public FavouriteDto() {}

    public FavouriteDto(Long id, Long userId, Long recipeId, String username, String recipeTitle, String recipeImage, LocalDateTime createdAt) {
        this.id = id;
        this.userId = userId;
        this.recipeId = recipeId;
        this.username = username;
        this.recipeTitle = recipeTitle;
        this.recipeImage = recipeImage;
        this.createdAt = createdAt;
    }

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Long getRecipeId() { return recipeId; }
    public void setRecipeId(Long recipeId) { this.recipeId = recipeId; }

    public String getRecipeTitle() { return recipeTitle; }
    public void setRecipeTitle(String recipeTitle) { this.recipeTitle = recipeTitle; }

    public String getRecipeImage() { return recipeImage; }
    public void setRecipeImage(String recipeImage) { this.recipeImage = recipeImage; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        FavouriteDto that = (FavouriteDto) o;
        return Objects.equals(id, that.id) && Objects.equals(userId, that.userId) && Objects.equals(recipeId, that.recipeId) && Objects.equals(username, that.username) && Objects.equals(recipeTitle, that.recipeTitle) && Objects.equals(createdAt, that.createdAt);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, userId, recipeId, username, recipeTitle, createdAt);
    }

    @Override
    public String toString() {
        return "FavouriteDto{" +
                "id=" + id +
                ", userId=" + userId +
                ", recipeId=" + recipeId +
                ", username='" + username + '\'' +
                ", recipeTitle='" + recipeTitle + '\'' +
                ", createdAt=" + createdAt +
                '}';
    }
}
