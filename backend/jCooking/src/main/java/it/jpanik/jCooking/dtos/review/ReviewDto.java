package it.jpanik.jCooking.dtos.review;

import java.time.LocalDate;
import java.util.Objects;

// DTO per POST/PUT
public class ReviewDto {
    private Long id;
    private String title;
    private String comment;
    private Integer rating;
    private LocalDate uploadDate;
    private Long userId;
    private Long recipeId;

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

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public LocalDate getUploadDate() {
        return uploadDate;
    }

    public void setUploadDate(LocalDate uploadDate) {
        this.uploadDate = uploadDate;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getRecipeId() {
        return recipeId;
    }

    public void setRecipeId(Long recipeId) {
        this.recipeId = recipeId;
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        ReviewDto reviewDto = (ReviewDto) o;
        return Objects.equals(id, reviewDto.id) && Objects.equals(comment, reviewDto.comment) && Objects.equals(rating, reviewDto.rating) && Objects.equals(userId, reviewDto.userId) && Objects.equals(recipeId, reviewDto.recipeId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, comment, rating, userId, recipeId);
    }

    @Override
    public String toString() {
        return "ReviewDto{" +
                "id=" + id +
                ", comment='" + comment + '\'' +
                ", rating=" + rating +
                ", userId=" + userId +
                ", recipeId=" + recipeId +
                '}';
    }
}

