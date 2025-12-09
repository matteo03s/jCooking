package it.jpanik.jCooking.entities;

import it.jpanik.jCooking.entities.Enums.UnitEnum;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;

@Entity
@Table (
        name = "RECIPE_INGREDIENT",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"RECIPE_ID", "INGREDIENT_ID"})
        }
)
public class RecipeIngredient {
    public static final int MIN = 1;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "RECIPE_ID")
    private Recipe recipe;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "INGREDIENT_ID")
    private Ingredient ingredient;

    @Column(name = "QUANTITY", nullable = false)
    @Min (0)
    private double quantity;

    @Enumerated(EnumType.STRING) // Mappa l'enum come stringa (es. "G", "KG") nel DB
    @Column(name = "UNIT", length = 20, nullable = false)
    private UnitEnum unit;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Recipe getRecipe() {
        return recipe;
    }

    public void setRecipe(Recipe recipe) {
        this.recipe = recipe;
    }

    public Ingredient getIngredient() {
        return ingredient;
    }

    public void setIngredient(Ingredient ingredient) {
        this.ingredient = ingredient;
    }

    public double getQuantity() {
        return quantity;
    }

    public void setQuantity(double quantity) {
        this.quantity = quantity;
    }

    public UnitEnum getUnit() {
        return unit;
    }

    public void setUnit(UnitEnum unit) {
        this.unit = unit;
    }
}
