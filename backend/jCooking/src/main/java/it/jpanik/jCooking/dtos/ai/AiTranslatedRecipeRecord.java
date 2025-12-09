package it.jpanik.jCooking.dtos.ai;

import java.util.List;

public record AiTranslatedRecipeRecord(
        String title,
        String description,
        List<AiIngredientRecord> ingredients,
        List<String> steps
) {}