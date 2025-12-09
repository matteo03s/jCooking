package it.jpanik.jCooking.dtos;

public class RecipeIngredientDto {

    private Long id;
    private Double quantity; // es. 200
    private String unit;     // es. "g", "ml", "cup"

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Double getQuantity() {
        return quantity;
    }

    public void setQuantity(Double quantity) {
        this.quantity = quantity;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    @Override
    public String toString() {
        return "RecipeIngredientDto{" +
                "quantity=" + quantity +
                ", unit='" + unit + '\'' +
                '}';
    }
}
