package it.jpanik.jCooking.entities;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "FAVOURITE",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"USER_ID", "RECIPE_ID"})
        }
)
public class Favourite {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "USER_ID", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "RECIPE_ID", nullable = false)
    private Recipe recipe;

    @Column(name = "CREATION_DATE", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public Favourite() {}

    public Favourite(User user, Recipe recipe) {
        this.user = user;
        this.recipe = recipe;
    }

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id =  id; }

    public User getUser() { return user; }

    public void setUser(User user) { this.user = user; }

    public Recipe getRecipe() { return recipe; }

    public void setRecipe(Recipe recipe) { this.recipe = recipe; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
