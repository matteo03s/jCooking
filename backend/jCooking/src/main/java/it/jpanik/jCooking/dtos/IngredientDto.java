package it.jpanik.jCooking.dtos;

import it.jpanik.jCooking.entities.Enums.UnitEnum;

public class IngredientDto {
    private String name;
    private Double quantity;
    private UnitEnum unit;

    public IngredientDto() {
    }

    public IngredientDto(String name, Double quantity, UnitEnum unit) {
        this.name = name;
        this.quantity = quantity;
        this.unit = unit;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Double getQuantity() {
        return quantity;
    }

    public void setQuantity(Double quantity) {
        this.quantity = quantity;
    }

    public UnitEnum getUnit() {
        return unit;
    }

    public void setUnit(UnitEnum unit) {
        this.unit = unit;
    }

}
