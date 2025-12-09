package it.jpanik.jCooking.dtos.review;

import it.jpanik.jCooking.dtos.recipes.RecipeSummaryDto;

import java.time.LocalDate;
import java.util.Objects;

// DTO per GET
public class ReviewWithAuthorDto {
    private Long id;
    private String title;
    private String comment;
    private Integer rating;
    private LocalDate uploadDate;
    private UserSummaryDto author;
    private RecipeSummaryDto recipe;


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

    public UserSummaryDto getAuthor() {
        return author;
    }

    public void setAuthor(UserSummaryDto author) {
        this.author = author;
    }

    public RecipeSummaryDto getRecipe() {
        return recipe;
    }

    public void setRecipe(RecipeSummaryDto recipe) {
        this.recipe = recipe;
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        ReviewWithAuthorDto that = (ReviewWithAuthorDto) o;
        return Objects.equals(id, that.id) && Objects.equals(title, that.title) && Objects.equals(comment, that.comment) && Objects.equals(rating, that.rating) && Objects.equals(uploadDate, that.uploadDate) && Objects.equals(author, that.author) && Objects.equals(recipe, that.recipe);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, title, comment, rating, uploadDate, author, recipe);
    }

    @Override
    public String toString() {
        return "ReviewWithAuthorDto{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", comment='" + comment + '\'' +
                ", rating=" + rating +
                ", uploadDate=" + uploadDate +
                ", author=" + author +
                ", recipe=" + recipe +
                '}';
    }
}
