package it.jpanik.jCooking.entities;

import it.jpanik.jCooking.entities.Enums.CategoryEnum;
import it.jpanik.jCooking.entities.Enums.LevelEnum;
import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import java.util.List;

@Entity
@Table (name = "RECIPE")
public class Recipe {

    public static final int MAX_LENGTH = 64;
    public static final int MIN = 1;

    public static final int MAX_PREP_TIME = 6000;
    public static final int MAX_SERVINGS = 10;

    @Column (name = "ID")
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column (name = "TITLE", nullable = false, length = MAX_LENGTH)
    private String title;            //titolo ricetta
    @Column (name = "DESCRIPTION", nullable = false)
    private String description;     //descrizione ricetta


    @Column (name = "PREP_TIME")
    @Min(MIN)
    @Max(MAX_PREP_TIME)
    private int prepTime;        //tempo di preparazione

    @Column (name = "COOKING_TIME")
    @Min(0)
    @Max(MAX_PREP_TIME)
    private int cookTime;        //tempo di cottura

    @Column (name = "SERVINGS")
    @Min(MIN)
    @Max(MAX_SERVINGS)
    private int servings;           //porzioni

    @Column (name = "TAGS")
    private List<String> Tags;      //elenco tags della ricetta

    @Column (name = "STEPS")
    private List<String> Steps;      //elenco steps della ricetta

    @Column (name = "UPLOAD_DATE")
    private LocalDate uploadDate;   //data creazione ricetta

    @Column (name = "LEVEL")
    @Enumerated(EnumType.STRING)
    private LevelEnum level;            //difficoltà ricetta

/*    @Column (name = "CATEGORY")
    @Enumerated(EnumType.STRING)
    private CategoryEnum category;            //categoria ricetta
*/

    @ManyToOne (fetch = FetchType.LAZY)
    User user;

    @ManyToOne (fetch = FetchType.LAZY)
    Category category;

    @OneToMany (mappedBy = "recipe", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List <Review> reviews;

    @OneToMany(mappedBy = "recipe", cascade = CascadeType.ALL)
    private Set<RecipeIngredient> recipeIngredients = new HashSet<>();

    @OneToMany(mappedBy = "recipe", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Image> images;

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

    public int getPrepTime() {
        return prepTime;
    }

    public void setPrepTime(int prepTime) {
        this.prepTime = prepTime;
    }

    public int getCookTime() {
        return cookTime;
    }

    public void setCookTime(int cookTime) {
        this.cookTime = cookTime;
    }

    public int getServings() {
        return servings;
    }

    public void setServings(int servings) {
        this.servings = servings;
    }

    public List<String> getTags() {
        return Tags;
    }

    public void setTags(List<String> tags) {
        Tags = tags;
    }

    public List<String> getSteps() {
        return Steps;
    }

    public void setSteps(List<String> steps) {
        Steps = steps;
    }

    public LocalDate getUploadDate() {
        return uploadDate;
    }

    public void setUploadDate(LocalDate uploadDate) {
        this.uploadDate = uploadDate;
    }

    public LevelEnum getLevel() {
        return level;
    }

    public void setLevel(LevelEnum level) {
        this.level = level;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public List<Review> getReviews() {
        return reviews;
    }

    public void setReviews(List<Review> reviews) {
        this.reviews = reviews;
    }

    public Set<RecipeIngredient> getRecipeIngredients() {
        return recipeIngredients;
    }

    public List<Image> getImages() {
        return images;
    }

    public void setImages(List<Image> images) {
        this.images = images;
    }

    public void setRecipeIngredients(Set<RecipeIngredient> recipeIngredients) {
        this.recipeIngredients = recipeIngredients;
    }

}
