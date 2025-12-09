package it.jpanik.jCooking.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

import java.time.LocalDate;

@Entity
@Table(name = "REVIEW")
public class Review {

    public static final int MAX_LENGTH = 64;
    public static final int MAX_RATING = 10;
    public static final int MIN = 1;

    @Column(name = "ID")
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column (name = "TITLE", nullable = false, length = MAX_LENGTH)
    private String title;

    @Column (name = "RATING")
    @Min(MIN)
    @Max(MAX_RATING)
    private Integer rating;

    @Column (name = "COMMENT")
    private String comment;     //testo recensione

    @Column (name = "UPLOAD_DATE")
    private LocalDate uploadDate;   //data creazione recensione

    @ManyToOne (fetch = FetchType.LAZY)
    User user;

    @ManyToOne (fetch = FetchType.LAZY)
    Recipe recipe;

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

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public LocalDate getUploadDate() {
        return uploadDate;
    }

    public void setUploadDate(LocalDate uploadDate) {
        this.uploadDate = uploadDate;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Recipe getRecipe() {
        return recipe;
    }

    public void setRecipe(Recipe recipe) {
        this.recipe = recipe;
    }


}
